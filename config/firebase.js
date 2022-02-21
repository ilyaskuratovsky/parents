import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore";

// Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyD7sAZY_oPEoAhPLbLST23DAAmAPiOh8V8",
  authDomain: "parents-749dd.firebaseapp.com",
  projectId: "parents-749dd",
  storageBucket: "parents-749dd.appspot.com",
  messagingSenderId: "202897799240",
  appId: "1:202897799240:web:6e7181665de58029cfc07d",
  measurementId: "G-RJ6EY4S9LJ",
};

// initialize firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
