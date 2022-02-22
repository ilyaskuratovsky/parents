import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import Actions from "./Actions";
import { auth } from "./config/firebase";

export default function LoginScreen({ dispatch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      console.log("signing in with " + email + ", " + password);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {})
        .catch((err) => console.log(`Login err: ${err}`));
    }
  };

  return (
    <View style={{ padding: 40 }}>
      <TextInput
        style={{ fontSize: 20, padding: 10 }}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={true}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={{ fontSize: 20, padding: 10 }}
        placeholder="Enter password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button onPress={onHandleLogin} color="#f57c00" title="Login" />
      <Button
        onPress={() => {
          dispatch(Actions.goToScreen("SIGNUP"));
        }}
        title="Go to Signup"
      />
    </View>
  );
}
