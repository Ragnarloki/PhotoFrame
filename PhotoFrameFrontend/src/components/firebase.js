// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Optional, for Firestore database


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3gjxVzEUwHJpT9eUNQlep3Q7Y_mVxHLY",
  authDomain: "photoframe-36904.firebaseapp.com",
  projectId: "photoframe-36904",
  storageBucket: "photoframe-36904.firebasestorage.app",
  messagingSenderId: "1064640457153",
  appId: "1:1064640457153:web:426a7a1c259e324aaca740",
  measurementId: "G-TV01J6GD1P"
};

// Initialize Firebase
// firebase.js
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // Optional, for database

export { auth, provider, db }; // Export the services you need
