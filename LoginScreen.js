import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config/firebase";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
//import * as Facebook from "expo-facebook";
//import FacebookSignin from "./FacebookSignin";
//import { LoginButton } from "react-native-fbsdk";

export default function Login({ afterLoginScreen }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("got user credential: " + JSON.stringify(userCredential));
          dispatch(Actions.goToScreen(afterLoginScreen));
        })
        .catch((err) => {
          console.log(`Login err: ${err}`);
        });
    }
  };

  /*
  async function loginWithFacebook() {
    let type = null;
    let token = null;
    try {
      await Facebook.initializeAsync({
        appId: "7185965598112053",
      });

      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        "7185965598112053",
        { permissions: ["public_profile"] }
      );

      alert("type: " + type + ", " + token);
    } catch (error) {
      alert("error: " + error);
    }
    if (type == "success") {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      firebase
        .auth()
        .signInWithCredential(credential)
        .catch((error) => {
          console.log(error);
        });
    }
  }
  */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={true}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button onPress={onHandleLogin} color="#f57c00" title="Login" />
      {/*
      <Button
        onPress={async () => {
          loginWithFacebook();
        }}
        color="#f57c00"
        title="Login With Facebook"
      />
      */}
      <Button
        onPress={() => {
          dispatch(Actions.goToScreen({ screen: "SIGNUP" }));
        }}
        title="Go to Signup"
      />
      {/*
      <LoginButton />
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#444",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
  },
});
