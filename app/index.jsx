import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Button, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from './Firebaseconfig'; // Importing auth from your Firebase configuration
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Authentication method

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const router = useRouter();
  const [showerr, setShowerr] = useState('');

  const handleLogin = async () => {
    // Clear any previous errors
    // router.push('/Main');
    setEmailErr('');
    setPasswordErr('');

    // Validate email
    if (!email) {
      setEmailErr('Email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailErr('Please enter a valid email address.');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordErr('Password is required.');
      return;
    }

    try {
      // Use Firebase Authentication to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // If login is successful, navigate to the main screen
      // Alert.alert('Success', 'Logged in successfully!');
      router.push('/Main'); // Redirect to the Main screen

      // Optionally, you can reset the form fields after successful login
      setEmail('');
      setPassword('');
    } catch (error) {
      // Handle authentication errors
      if (error.code === 'auth/user-not-found') {
        // Alert.alert('Error', 'No user found with this email.');
        setShowerr('No user found with this email.')
      } else if (error.code === 'auth/wrong-password') {
        // Alert.alert('Error', 'Incorrect password.');
        setShowerr('Incorrect password.')
      } else {
        // Alert.alert('Error', error.message);
        setShowerr('Error', error.message);
      }
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>

      {
        showerr && (
          <>
            <View style={styles.showerr}>
              <Text style={styles.errorText}> Error ! {showerr}</Text>
              <Text style={styles.showerrrbtn} title="OK" onPress={() => setShowerr('')} >ok</Text>
            </View>
          </>
        )
      }

      {
        !showerr && (
          <>
            <Text style={styles.title}>Login</Text>
            <TouchableOpacity>
              <Text style={styles.signupPrompt}>
                Don't have an account?{' '}
                <Text style={styles.signupbtn} onPress={() => router.push('/Signup')}>
                  Sign Up
                </Text>
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {emailErr ? <Text style={styles.errorText}>{emailErr}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {passwordErr ? <Text style={styles.errorText}>{passwordErr}</Text> : null}
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          
          </>
        )
      }

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
    color: 'white'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    color: 'white'
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
    borderColor: '#ddd',
    boxShadow: '0px 0px 3px white',
    color: '#fff'
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
  forgotPassword: {
    color: '#4caf50',
    fontSize: 16,
    marginBottom:'10',
  },
  signupPrompt: {
    paddingBottom: 20,
    color: 'white'
    
  },
  signupbtn: {
    fontSize: 18,
    color: '#4caf50',
  },
  errorText: {
    color:'#fff'
  },
  showerr: {
    backgroundColor: '#f8d7da', 
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5c6cb', 
    width: '80%', 
    alignItems: 'center', 
  },
  errorText: {
    color: '#721c24', 
    fontSize: 16,
    marginBottom: 20, 
    textAlign: 'center',
  },
  showerrrbtn: {
    backgroundColor: '#519872',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 5,
    color: 'white'
  }
});
