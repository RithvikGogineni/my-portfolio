// Firebase Configuration
// Replace these values with your Firebase project credentials
// Get them from: https://console.firebase.google.com/

import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDmsJL0LnGWZpjPtyxegrKQNC4wt3LjBhE",
  authDomain: "my-portfolio-14d57.firebaseapp.com",
  projectId: "my-portfolio-14d57",
  storageBucket: "my-portfolio-14d57.firebasestorage.app",
  messagingSenderId: "505302019973",
  appId: "1:505302019973:web:a873f64e83852ba7105eec",
  measurementId: "G-L7NG8V4X5Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;

