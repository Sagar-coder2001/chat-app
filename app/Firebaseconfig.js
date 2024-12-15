// Import the necessary Firebase SDK modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // For Firebase Authentication
import { getFirestore } from 'firebase/firestore';  // For Firestore (if you plan to use it)
import { getDatabase } from 'firebase/database';  // For Realtime Database (if you plan to use it)

// Firebase configuration object
const Firebaseconfig = {
  apiKey: "AIzaSyAMU6old2nKysc8UNC-Epgiaz2etfMiJpA",
  authDomain: "chat-app-7e6d9.firebaseapp.com",
  projectId: "chat-app-7e6d9",
  storageBucket: "chat-app-7e6d9.firebasestorage.app",
  messagingSenderId: "975094457572",
  appId: "1:975094457572:web:b25c8db707119c4f6d78f1",
  measurementId: "G-47K3XT3Y2Y",
  databaseURL: 'https://chat-app-7e6d9-default-rtdb.firebaseio.com/' // For Realtime Database
};

// Initialize Firebase app
const app = initializeApp(Firebaseconfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore (if you're using Firestore)
const firestore = getFirestore(app);

// Initialize Realtime Database (if you're using Realtime DB)
const database = getDatabase(app);

// Exporting services to be used throughout your app
export { auth, firestore, database, app };
