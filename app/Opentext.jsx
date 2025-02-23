import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ImageBackground } from 'react-native';
import { getDatabase, ref, push, set, onChildAdded } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import app from './Firebaseconfig';

const Opentext = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [receiverName, setReceiverName] = useState(null);
    const [receiverUid, setReceiverUid] = useState(null);
    const [senderUid, setSenderUid] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const name = await AsyncStorage.getItem('receiverName');
                const uid = await AsyncStorage.getItem('receiverUid');
                const suid = await AsyncStorage.getItem('senderUid');

                if (name && uid && suid) {
                    setReceiverName(name);
                    setReceiverUid(uid);
                    setSenderUid(suid);
                }
            } catch (error) {
                console.error('Error retrieving data from AsyncStorage', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setLoggedInUser(user);
            if (receiverUid) fetchMessages(user.uid, receiverUid);
        }
    }, [receiverUid]);

    const fetchMessages = (senderUid, receiverUid) => {
        const db = getDatabase(app);
        const messagesRef = ref(db, 'messages');

        onChildAdded(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (
                (data.senderUid === senderUid && data.receiverUid === receiverUid) ||
                (data.senderUid === receiverUid && data.receiverUid === senderUid)
            ) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });
    };

    const sendMessage = () => {
        if (!messageText.trim() || !receiverUid || !senderUid) return;

        const db = getDatabase(app);
        const timestamp = Date.now();

        const newMessageRef = push(ref(db, 'messages'));
        set(newMessageRef, {
            senderUid,
            receiverUid,
            message: messageText,
            timestamp,
        }).then(() => {
            setMessageText('');
        }).catch((error) => {
            console.error("Error sending message", error);
        });
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <ImageBackground source={require('../assets/images/chatbg.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.header}>Chat with {receiverName}</Text>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <View style={[styles.message, item.senderUid === senderUid ? styles.sentMessage : styles.receivedMessage]}>
                            <Text>{item.senderUid === loggedInUser?.uid ? "You" : receiverName}: {item.message}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View style={styles.sendmsg}>
                    <TextInput
                        style={styles.input}
                        value={messageText}
                        onChangeText={setMessageText}
                        placeholder="Type a message..."
                        placeholderTextColor="#FFFFFF"
                    />
                    <TouchableOpacity
                        style={[styles.sendbtn, (!receiverUid || !messageText.trim()) && styles.disabled]}
                        onPress={sendMessage}
                        disabled={!receiverUid || !messageText.trim()}
                    >
                        <Image source={require('../assets/images/send.jpg')} style={styles.sendimg} />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    message: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    sentMessage: {
        backgroundColor: '#d1ffd6',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        borderWidth: 0,
        padding: 12,
        color: '#fff',
        borderRadius: 25,
        backgroundColor: 'rgba(59, 82, 60, 0.9)',
    },
    sendmsg: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    sendimg: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginLeft:10
    },
});

export default Opentext;
