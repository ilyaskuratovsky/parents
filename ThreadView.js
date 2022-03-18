import React, { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  TextInput,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ThreadMessageModal from "./ThreadMessageModal";
import TimeAgo from "react-timeago";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import * as MyButtons from "./MyButtons";
import MessageTextInput from "./MessageTextInput";

export default function ThreadView({
  userInfo,
  group,
  messages,
  sendMessage,
  onView,
  messagesRead,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (onView != null) {
      onView();
    }
    messagesRead(messages);
  }, [messages]);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [messageReplyText, setMessageReplyText] = useState({});
  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 6,
          width: "100%",
          backgroundColor: "lightgrey",
        }}
      />
    );
  };

  const { height, width } = useWindowDimensions();
  const windowWidth = width ?? 0;
  const [showMore, setShowMore] = useState({});

  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      <ThreadMessageModal
        userInfo={userInfo}
        group={group}
        visible={showNewMessageModal}
        sendMessage={sendMessage}
        showModal={(flag) => {
          setShowNewMessageModal(flag);
        }}
      />
      <FlatList
        style={{ flex: 1 }}
        data={
          //DATA
          messages
        }
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          width: windowWidth,
        }}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
      <View
        style={{
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10,
          width: windowWidth,
          //backgroundColor: "orange",
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "darkgrey",
            borderRadius: 14,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
          onPress={() => {
            setShowNewMessageModal(true);
          }}
        >
          <Text
            style={{
              paddingLeft: 10,
              //backgroundColor: "green",
              fontSize: 14,
              color: "lightgrey",
            }}
          >
            New Message...
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
