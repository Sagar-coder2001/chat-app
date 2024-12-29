import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import { getDatabase, ref, push, set, onChildAdded, query, orderByChild, equalTo } from 'firebase/database';
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
    const [senderName, setSenderName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve data from AsyncStorage
                const name = await AsyncStorage.getItem('receiverName');
                const uid = await AsyncStorage.getItem('receiverUid');
                // const sname = await AsyncStorage.getItem('senderName');
                const suid = await AsyncStorage.getItem('senderUid');

                if (name && uid && suid) {
                    setReceiverName(name);
                    setReceiverUid(uid);
                    // setSenderName(sname);
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

        // Creating a query to fetch messages between the sender and receiver
        const messagesQuery = query(
            messagesRef,
            // orderByChild('timestamp')
        );

        // Listen for messages being added
        onChildAdded(messagesQuery, (snapshot) => {
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
        <View style={styles.container}>
            <Text style={styles.header}>Chat with {receiverName}</Text>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={[styles.message, item.senderUid === senderUid ? styles.sentMessage : styles.receivedMessage]}>
                        <Text>{item.senderUid === loggedInUser.uid ? "You" : receiverName}: {item.message}</Text>
                    </View>
                )}


                keyExtractor={(item, index) => index.toString()}
            // Removed inverted to prevent UI issues
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
                    <View>
                    <Image
                        source={require('../assets/images/send.jpg')}
                        style={styles.sendimg}

                    />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#3B5249',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff'
    },
    message: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#e0e0e0',
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
        
        borderColor: '#000',
        borderWidth: 0,
        padding: 20,
        color: '#fff',         // Text color
        placeholderTextColor: '#fff', // Placeholder color
        marginRight: 10,
        boxShadow: '0px 0px 3px white inset',
        color: '#fff',
        borderRadius: 25,
        padding: 12,
        backgroundColor: 'rgb(59, 82, 60)',
        boxShadow: '0px 0px 2px inset'
    },
    sendmsg: {
        flexDirection: 'row',  // Arrange children (TextInput and Button) horizontally
        alignItems: 'center',  // Vertically align them in the center
        marginBottom: 10,
        width: '100%'
    },
    sendimg :{
        width : 40,
        height:40,
        borderRadius:50,
        boxShadow:'0px 0px 8px'

    }
});
export default Opentext;
