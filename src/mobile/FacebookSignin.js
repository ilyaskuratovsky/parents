// @flow strict-local

import React, { Component } from "react";
import { View, Button } from "react-native";
//import { LoginButton, AccessToken } from "react-native-fbsdk-next";
import { getAuth, signInWithPopup, FacebookAuthProvider, signInWithRedirect } from "firebase/auth";
import * as Logger from "../common/Logger";

export default class FacebookSignin extends Component {
  render() {
    return (
      <View>
        <Button
          title="Log in with Facebook"
          onPress={() => {
            const auth = getAuth();
            const provider = new FacebookAuthProvider();
            signInWithRedirect(auth, provider);
            /*
            signInWithPopup(auth, provider)
              .then((result) => {
                // The signed-in user info.
                Logger.log("facebook login successful");
                const user = result.user;

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential =
                  FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

                // ...
              })
              .catch((error) => {
                // Handle Errors here.
                Logger.log("error: " + JSON.stringify(error));
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential =
                  FacebookAuthProvider.credentialFromError(error);
              });
          */
            getRedirectResult(auth)
              .then((result) => {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                const user = result.user;
              })
              .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);
              });
            // ...
          }}
        />
      </View>
    );
  }
}
