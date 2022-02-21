import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { TouchableOpacity, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import ErrorScreen from "./ErrorScreen";
import ProfileScreen from "./ProfileScreen";
import GroupsScreen from "./GroupsScreen";
import GroupScreen from "./GroupScreen";
/*
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
*/
import * as Firestore from "firebase/firestore";
import { signOut } from "firebase/auth";

import { auth, database } from "./config/firebase";
export default function UserScreen({ navigation }) {
  const userInfo = useSelector((state) => state.main.userInfo);
  const screenWithParams = useSelector((state) => state.screen.userScreen);
  const screen = screenWithParams.screen;

  if (userInfo == null) {
    return <Text>Loading User Information...</Text>;
  } else if (screen == null) {
    return <Text>error (no screen)</Text>;
  } else {
    if (screen == "PROFILE") {
      return <ProfileScreen />;
    } else if (screen == "GROUPS") {
      return <GroupsScreen />;
    } else if (screen == "GROUP") {
      return <GroupScreen groupId={screenWithParams.groupId} />;
    }
    return <ErrorScreen />;
  }
}
