// @flow
import React from "react";
import AppMobile from "./src/mobile/AppMobile";
import AppWeb from "./src/web/AppWeb";
import { Platform } from "react-native";

export default function App(): React$Element<any> {
  if (Platform.OS === "web") {
    return <AppWeb />;
  } else {
    return <AppMobile />;
  }
}
