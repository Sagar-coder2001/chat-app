import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserProfile = ({ navigation }) => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('senderemail');
        if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch (error) {
        console.error('Failed to fetch email:', error);
      }
    };

    fetchEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clears all stored data
      navigation.replace('Login'); // Navigate back to the Login screen
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}> 
  
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.profileImage}
          />

        <Text style={styles.userEmail}>{email || 'Loading...'}</Text>
      </View>




      {/* Options Section */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text style={styles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('About')}>
          <Text style={styles.optionText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B5249',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space between image and email
    width: '100%', // Take full width of the container
    marginTop: 0, // Add spacing below the header
    paddingHorizontal: 10, // Add horizontal padding
    borderBottomWidth:1,
    padding:15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 30, // Circular image
    marginRight: 10, // Space between image and email
  },
  userEmail: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    flex: 1, // Allow the email to take available space
    textAlign: 'left', // Align text to the left
  },
  optionsContainer: {
    width: '100%',
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#E53935',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
