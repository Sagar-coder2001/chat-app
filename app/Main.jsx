import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import app from './Firebaseconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Main = () => {
    const [loggedInUser, setLoggedInUser] = useState(null); // To store logged-in user data
    const [allUsers, setAllUsers] = useState([]); // To store list of all users
    const [filteredUsers, setFilteredUsers] = useState([]); // To store filtered users based on search
    const [loading, setLoading] = useState(true)
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
                    setLoading(false);
                }
                else {
                    console.log("No users found in the database.");
                    setLoading(false);
                }
            });
        } else {
            console.log("No logged-in user found.");
            setLoading(false);

        }
    }, []);


    // Navigate to the Opentext screen with receiver's UID and name
    const openSingleScreen = async (receiverUid, receiverName) => {
        try {
            // Save data to AsyncStorage
            await AsyncStorage.setItem('receiverName', receiverName);
            await AsyncStorage.setItem('receiverUid', receiverUid);
            await AsyncStorage.setItem('senderUid', loggedInUser.uid);
            await AsyncStorage.setItem('senderemail', loggedInUser.email);
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

    const openprofile = () => {
        router.push('UserProfile');
    }

    return (
        <>
            {loggedInUser && (
                <View style={styles.userDetailsContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Search People"
                         placeholderTextColor="#FFFFFF"
                        onChangeText={filtername} // Directly pass the text to filtername
                    />
                    <TouchableOpacity onPress={openprofile} style={styles.imageContainer}>
                        <Image
                            source={require('../assets/images/7915471.png')}
                            style={styles.logoimg}
                       
                        />
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.container}>

                {
                    loading && (
                        <>
                         <ActivityIndicator size="large" color="#FFFFFF" />
                        </>
                    )
                }
                {/* Display the list of all users' names */}
                <View style={styles.usersContainer}>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <View>
                                <TouchableOpacity
                                    key={user.uid}
                                    style={styles.userItem}
                                    onPress={() => openSingleScreen(user.uid, user.name)}
                                >
                                    <View style={styles.logoAndNameContainer}>
                                        <Image
                                            source={require('../assets/images/images.png')}
                                            style={styles.logoimg}
                                        />
                                        <Text style={styles.userName}>{user.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>


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
        borderRadius: 25,
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
    userItem: {
        padding: 10,
        backgroundColor: 'rgb(59, 82, 60)',
        borderRadius: 8,
        marginBottom: 10,
        borderRadius:25,
        boxShadow:'0px 0px 2px inset'

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
        color:'white'
    },
    logoAndNameContainer: {
        flexDirection: 'row',  // Aligns children (logo and name) horizontally
        alignItems: 'center',  // Vertically center them
        paddingHorizontal: 10,  // Optional, adjust as necessary
    },
    logoimg: {
        width: 30,  // Set the width of your logo
        height: 30, // Set the height of your logo
        marginRight: 10,  // Space between the logo and the text
        borderRadius:50,
        marginLeft:5
    },
});

export default Main;
