// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBub1WPQYXpQF7stirDnL9uJD_zoTg7VhE",
  authDomain: "e-store-c0200.firebaseapp.com",
  projectId: "e-store-c0200",
  storageBucket: "e-store-c0200.appspot.com",
  messagingSenderId: "694135846259",
  appId: "1:694135846259:web:8007f552c61f609889c106"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
