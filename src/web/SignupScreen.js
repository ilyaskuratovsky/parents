import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../../config/firebase";
import * as Actions from "../common/Actions";
import * as MyButtons from "./MyButtons";

export default function Signup() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  /*
  const onHandleSignup = () => {
    if (email !== "" && password !== "") {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("signed up");
        })
        .catch((err) => console.log(`Login err: ${err}`));
    }
  };
  */
  const onHandleSignup = () => {
    setError(null);
    if (password != confirmPassword) {
      setError("Passwords do not match");
    } else if (email !== "" && password !== "") {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              console.log("got user credential: " + JSON.stringify(userCredential));
              dispatch(Actions.goToScreen({ screen: "GROUPS" }));
            })
            .catch((err) => {
              setError(err.message);
              console.log(`Login err: ${err}`);
            });
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      setError("Please enter all information");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error != null && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
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
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
        }}
      />
      <Button onPress={onHandleSignup} color="#f57c00" title="Signup" />
      {/*
      <Button
        onPress={() => {
          dispatch(Actions.goToScreen({ screen: "LOGIN" }));
        }}
        title="Go to Login"
      />
      */}
      <MyButtons.LinkButton
        text="Log In"
        onPress={async () => {
          dispatch(Actions.goToScreen({ screen: "LOGIN" }));
        }}
      />
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
