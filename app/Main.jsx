import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import app from './Firebaseconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Main = () => {
    const [loggedInUser, setLoggedInUser] = useState(null); // To store logged-in user data
    const [allUsers, setAllUsers] = useState([]); // To store list of all users
    const [filteredUsers, setFilteredUsers] = useState([]); // To store filtered users based on search
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            setLoggedInUser({
                name: user.displayName, // Use displayName or any field
                email: user.email,
                uid: user.uid,
            });

            // Fetch all users from Firebase Realtime Database
            const db = getDatabase(app);
            const usersRef = ref(db, 'users'); // Reference to 'users' node

            // Listen for changes in the 'users' node
            onValue(usersRef, (snapshot) => {
                const data = snapshot.val();
                console.log("Fetched data from Firebase:", data); // Log the entire data object

                if (data) {
                    const users = [];

                    // Loop through all users and store their names and UID
                    for (let id in data) {
                        const userData = data[id];
                        if (userData && id !== user.uid) { // Avoid showing the logged-in user
                            users.push({ name: userData.name, uid: id });
                        }
                    }
                    setAllUsers(users); // Set all users' data
                    setFilteredUsers(users); // Initially, set filtered users to all users
                } else {
                    console.log("No users found in the database.");
                }
            });
        } else {
            console.log("No logged-in user found.");
        }
    }, []);

    // Navigate to the Opentext screen with receiver's UID and name
    const openSingleScreen = async (receiverUid, receiverName) => {
        try {
            // Save data to AsyncStorage
            await AsyncStorage.setItem('receiverName', receiverName);
            await AsyncStorage.setItem('receiverUid', receiverUid);
            await AsyncStorage.setItem('senderUid', loggedInUser.uid);

            // Navigate to the Opentext screen
            router.push('Opentext');
        } catch (error) {
            console.error('Error saving data to AsyncStorage', error);
        }
    };

    const filtername = (text) => {
        // Filter users based on the search text
        const filtered = allUsers.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered); // Update the filtered users list
    };

    return (
        <>
            {loggedInUser && (
                <View style={styles.userDetailsContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Search People"
                        onChangeText={filtername} // Directly pass the text to filtername
                    />
                    <Image source={require('../assets/images/logo.png')} style={styles.logoimg} />
                </View>
            )}

            <View style={styles.container}>
                {/* Display the list of all users' names */}
                <View style={styles.usersContainer}>
                    <Text style={styles.header}>All Users</Text>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <TouchableOpacity
                                key={user.uid}
                                style={styles.userItem}
                                onPress={() => openSingleScreen(user.uid, user.name)}
                            >
                                <Text style={styles.userName}>{user.name}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noUsersText}>No users available.</Text>
                    )}
                </View>
            </View>
        </>
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
        color: '#fff',
    },
    userDetailsContainer: {
        marginBottom: 0,
        padding: 0,
        backgroundColor: '#3B5249',
        color: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: '100%',
        borderWidth: 0.2,
    },
    textInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginLeft: 5,
        color: '#fff',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: 'rgb(59, 82, 60)',
    },
    usersContainer: {
        marginTop: 20,
    },
    userItem: {
        padding: 10,
        backgroundColor: 'rgb(59, 82, 60)',
        borderRadius: 8,
        marginBottom: 10,
    },
    noUsersText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#888',
    },
    logoimg: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
});

export default Main;
