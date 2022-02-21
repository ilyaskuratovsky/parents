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
  const { schoolList, schoolMap, groupList, groupMap, messages, userMap } =
    useSelector((state) => {
      return {
        schoolList: state.main.schoolList,
        schoolMap: state.main.schoolMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
        userMap: state.main.userMap,
        messages: state.main.groupMessages[groupId],
      };
    });
  const group = groupMap[groupId];
  const giftedChatMessages = messages.map((message) => {
    const user = userMap[message.uid];

    return {
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.uid,
        name: user.displayName ?? user.email,
        //avatar: "https://placeimg.com/140/140/any",
      },
    };
  });

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }

  const onSend = useCallback((messages = []) => {
    Controller.sendMessage(dispatch, userInfo, groupId, messages[0].text);
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <Text key="group">
        Group Screen {groupId} {group.name}
      </Text>
      <View style={{ width: "80%", height: "80%" }}>
        <GiftedChat
          messages={giftedChatMessages}
          onSend={onSend}
          style={{ border: 1, borderColor: "black" }}
        ></GiftedChat>
      </View>
    </View>
  );
}
