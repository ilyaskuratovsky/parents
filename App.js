import { Provider } from "react-redux";

import { collection, doc, setDoc } from "firebase/firestore/lite";

import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Text } from "react-native";
import { db } from "./config/firebase";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import store from "./Actions";
import RootApp from "./RootApp";
import * as Notifications from "expo-notifications";
import * as Actions from "./Actions";

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootApp />
      </Provider>
    </SafeAreaProvider>
  );
}
