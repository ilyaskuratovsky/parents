import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../../config/firebase";
import * as Actions from "../common/Actions";
import * as Globals from "./Globals";
import * as MyButtons from "./MyButtons";

export default function Login({ afterLoginScreen }) {
  const dispatch = useDispatch();

  const [user, loading, error] = useAuthState(auth);
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

  if (loading || user) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(0,0,0,0.4)",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <ActivityIndicator color="#fff" animating size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      {/*
      <Button
        style={{ paddingBottom: 10 }}
        onPress={async () => {
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
          var firebase = require("firebase");
          firebase.initializeApp(firebaseConfig);
          const auth = firebase.auth();
          // initialize firebase
          //const app = initializeApp(firebaseConfig);
          //const auth = getAuth(app);

          const provider = new FacebookAuthProvider();
          const result = await auth.signInWithPopup(provider);
          const user = result.user;
          // This gives you a Facebook Access Token.
          const credential = provider.credentialFromResult(auth, result);
          const token = credential.accessToken;
          console.log("done");
          /*
          signInWithRedirect(auth, provider);

          signInWithPopup(auth, provider)
            .then((result) => {
              alert("facebook then");
              // The signed-in user info.
              const user = result.user;

              // This gives you a Facebook Access Token. You can use it to access the Facebook API.
              const credential =
                FacebookAuthProvider.credentialFromResult(result);
              const accessToken = credential.accessToken;

              // ...
            })
            .catch((error) => {
              alert("facebook catch");
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              // The email of the user's account used.
              const email = error.email;
              // The AuthCredential type that was used.
              const credential =
                FacebookAuthProvider.credentialFromError(error);

              // ...
            });

      } color="#f57c00" title="Log in using Facebook" /> */}
      {/*
      <Button
        style={{ paddingBottom: 10 }}
        onPress={() => {
          const provider = new GoogleAuthProvider();
          provider.addScope(
            "https://www.googleapis.com/auth/contacts.readonly"
          );
          const auth = getAuth();
          signInWithPopup(auth, provider)
            .then((result) => {
              console.log("google auth result: " + JSON.stringify(result));
              // This gives you a Google Access Token. You can use it to access the Google API.
              const credential =
                GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              // The signed-in user info.
              const user = result.user;
              // ...
            })
            .catch((error) => {
              console.log("google auth error: " + JSON.stringify(error));
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              // The email of the user's account used.
              const email = error.email;
              // The AuthCredential type that was used.
              const credential = GoogleAuthProvider.credentialFromError(error);
              // ...
            });
        }}
        color="#f57c00"
        title="Log in using Google"
      />
      */}
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
      <MyButtons.LinkButton
        text="Create an Account"
        onPress={async () => {
          dispatch(Actions.goToScreen({ screen: "SIGNUP" }));
        }}
      />
      {/*
      <LoginButton />
      */}
      {Globals.dev && (
        <View style={{ flexDirection: "column" }}>
          <MyButtons.LinkButton
            text="ilyaskuratovsky@gmail.com"
            onPress={async () => {
              setEmail("ilyaskuratovsky@gmail.com");
              setPassword("ilyaskuratovsky");
            }}
          />
          <MyButtons.LinkButton
            text="ingaskur@gmail.com"
            onPress={async () => {
              setEmail("ingaskur@gmail.com");
              setPassword("ingaskur");
            }}
          />
        </View>
      )}
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
