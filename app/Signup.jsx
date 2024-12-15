import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import app from './Firebaseconfig';  // Assuming your firebase configuration is here
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth
import { getDatabase, ref, set } from 'firebase/database'; // Import Realtime Database functions

export default function Signup() {
  const initialState = {
    name: "",
    contact: "",
    email: "",
    password: "",
    Confpass: ""
  };
  const [userdetails, setuserdetails] = useState(initialState);
  const router = useRouter();
  const [succes , setsucess] = useState(false)

  const handleSignup = async () => {
    const { name, contact, email, password, Confpass } = userdetails;

    // Validation
    if (!name || !contact || !email || !password || !Confpass) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    if (password !== Confpass) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    try {
      const auth = getAuth();  // Get Firebase auth instance

      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;  // Get user info from Firebase Authentication

      // Store additional user details in Realtime Database
      const db = getDatabase(app);
      const userRef = ref(db, 'users/' + user.uid);  // Set the path where the user data will be stored
      await set(userRef, {
        name: name,
        contact: contact,
        email: email,
        uid: user.uid
      });

      // Successful signup
      // Alert.alert("Success", "Account created successfully!");
      setsucess(true);

      // Optionally navigate to a different screen after signup
      router.push('/'); // Navigate to the home page or main screen

    } catch (error) {
      // Handle errors
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "This email is already in use.");
      } else if (error.code === 'auth/weak-password') {
        Alert.alert("Error", "Password should be at least 6 characters.");
      } else {
        Alert.alert("Error", error.message);
      }
      console.log(error);
    }
  };

  const saveUserData = (name, value) => {
    setuserdetails({
      ...userdetails,
      [name]: value,
    });
  };

  return (
    <View style={styles.container}>
      {
        succes && (
          <>
          <View>
            <Text>Account created successfully!</Text>
          </View>
          </>
        )
      }
      <Text style={styles.title}>Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        keyboardType="default"
        autoCapitalize="words"
        value={userdetails.name}
        onChangeText={(value) => saveUserData('name', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Contact"
        placeholderTextColor="#888"
        keyboardType="numeric"
        maxLength={10}
        value={userdetails.contact}
        onChangeText={(value) => saveUserData('contact', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={userdetails.email}
        onChangeText={(value) => saveUserData('email', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={userdetails.password}
        onChangeText={(value) => saveUserData('password', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={userdetails.Confpass}
        onChangeText={(value) => saveUserData('Confpass', value)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B5249',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(59, 82, 60)',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 0,
    color:'#fff',
    boxShadow:'0px 0px 3px white'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#519872',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
