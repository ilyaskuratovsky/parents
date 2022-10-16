// @flow strict-local

import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import * as React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../../config/firebase";
import * as Actions from "../common/Actions";
import * as Globals from "../web/Globals";
import * as MyButtons from "../web/MyButtons";

export default function Loading(): React.Node {
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
      {/*<ActivityIndicator color="#fff" animating size="large" />*/}
      <Text>Loading...</Text>
    </View>
  );
}
