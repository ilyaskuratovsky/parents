import { Provider } from "react-redux";

import { collection, doc, setDoc } from "firebase/firestore/lite";

import React, { useEffect, useRef } from "react";
import { Text } from "react-native";
import { db } from "./config/firebase";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import store from "./Actions";
import RootApp from "./RootApp";

/*h
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./Actions";
import RootApp from "./RootApp";
*/
async function addRecord() {
  /* THIS WORKS
  import { initializeApp } from "firebase/app";
  import {
    getFirestore,
    collection,
    getDocs,
    doc,
    setDoc,
  } from "firebase/firestore/lite";

  const firebaseConfig = {
    apiKey: "AIzaSyD7sAZY_oPEoAhPLbLST23DAAmAPiOh8V8",
    authDomain: "parents-749dd.firebaseapp.com",
    projectId: "parents-749dd",
    storageBucket: "parents-749dd.appspot.com",
    messagingSenderId: "202897799240",
    appId: "1:202897799240:web:6e7181665de58029cfc07d",
    measurementId: "G-RJ6EY4S9LJ",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  */

  const groupsCol = collection(db, "groups");
  const groupRef = doc(collection(db, "groups"), "north_mianus_4_dunn");
  const messageRef = doc(collection(groupRef, "chats"), "xyz1");
  const ret = setDoc(messageRef, { foo: "bar" });

  console.log("record added");
}

export default function App() {
  /*
  useEffect(() => {
    const dox = async () => {
      const data = await addRecord();
    };
    dox().catch((e) => {
      console.log("error: " + e);
    });
  });
   */

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootApp />
      </Provider>
    </SafeAreaProvider>
  );
}
