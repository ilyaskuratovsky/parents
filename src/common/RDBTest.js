import firebase from "firebase/compat/database";

import React, { useEffect } from "react";
import { Text } from "react-native";
function RDBTest(props) {
  // Firebase config
  /*
  const firebaseConfig = {
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
  const app = firebase.initializeApp(firebaseConfig);
  const db = app.database();
  useEffect(() => {
    const r = ref(child(db, "text"));
  }, []);
  */
  return <Text>HelloWorld</Text>;
}

export default RDBTest;
