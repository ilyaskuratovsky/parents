import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  CheckBox,
  Button,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "react-native-elements";
import * as MyButtons from "./MyButtons";
import * as Controller from "./Controller";
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

export default function GroupScreen({ groupId, navigation }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { schoolList, schoolMap, groupList, groupMap } = useSelector(
    (state) => {
      return {
        schoolList: state.main.schoolList,
        schoolMap: state.main.schoolMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
      };
    }
  );
  const group = groupMap[groupId];

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <Text key="group">
        Group Screen {groupId} {group.name}
      </Text>
    </View>
  );
}
