import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Platform } from "react-native";
import * as Actions from "./Actions";
import { auth } from "./config/firebase";
import * as Database from "./Database";
import store from "./Actions";

export function chatDisplayName(userInfo) {
  if (userInfo.displayName != null) {
    return displayName;
  }

  return userInfo.email.split("@")[0];
}
