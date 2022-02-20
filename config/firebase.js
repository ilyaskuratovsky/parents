import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
import * as FirebaseApp from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import * as Firestore from "firebase/firestore";

console.log("extra: " + JSON.stringify(Constants.manifest));
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
FirebaseApp.initializeApp(firebaseConfig);
export const auth = FirebaseAuth.getAuth();
export const db = Firestore.getFirestore();
