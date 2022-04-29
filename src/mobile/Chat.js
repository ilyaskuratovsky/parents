import React, { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { TouchableOpacity, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
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

import { auth, database } from "../../config/firebase";
export default function Chat({ navigation }) {
  const [messages, setMessages] = useState([]);

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
  };
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    const { _id, createdAt, text, user } = messages[0];
    Firestore.addDoc(Firestore.collection(database, "chats"), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onSignOut}
        >
          <Text>Logout</Text>
        </TouchableOpacity>
      ),
    });

    const collectionRef = Firestore.collection(database, "chats");
    const q = Firestore.query(collectionRef, Firestore.orderBy("createdAt", "desc"));

    const unsubscribe = Firestore.onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return unsubscribe;
  });

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        avatar: "https://i.pravatar.cc/300",
      }}
    />
  );
}
