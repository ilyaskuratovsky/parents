import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
//import { getFirestore } from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore";

// Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyD7sAZY_oPEoAhPLbLST23DAAmAPiOh8V8",
  authDomain: "parents-749dd.firebaseapp.com",
  databaseURL: "https://parents-749dd-default-rtdb.firebaseio.com",
  projectId: "parents-749dd",
  storageBucket: "parents-749dd.appspot.com",
  messagingSenderId: "202897799240",
  appId: "1:202897799240:web:6e7181665de58029cfc07d",
  measurementId: "G-RJ6EY4S9LJ",
};

// initialize firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rdb = getDatabase(app);
export const storage = getStorage(app);

export const ROOT_GROUP_ID = "greenwich_parents";
