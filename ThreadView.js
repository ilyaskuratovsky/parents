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
  const renderItem = ({ item }) => {
    const timeAgo = ({ children }) => {
      return (
        <Text
          style={{
            marginLeft: 5,
            fontWeight: "normal",
            fontSize: 14,
          }}
        >
          {children}
        </Text>
      );
    };
    return (
      <View
        style={{
          flexDirection: "column",
          width: windowWidth,
          paddingTop: 14,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 14,
        }}
      >
        <View
          style={{
            width: windowWidth,
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 0,
            backgroundColor: "white",
          }}
        >
          <Avatar
            size={28}
            rounded
            title={item.user.name.charAt(0).toUpperCase()}
            containerStyle={{
              backgroundColor: item.user.avatarColor,
              marginRight: 1,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 20,
            }}
          >
            <Text
              style={{
                marginLeft: 5,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {item.user.name}
            </Text>
            <View
              style={{
                marginLeft: 5,
                fontWeight: "normal",
                fontSize: 14,
              }}
            >
              <TimeAgo
                date={item.createdAt}
                style={{
                  marginLeft: 5,
                  fontWeight: "normal",
                  fontSize: 14,
                }}
                component={timeAgo}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            width: windowWidth - 20,
            paddingLeft: 0,
            paddingTop: 0,
            borderRadius: 0,
            backgroundColor: "white",
          }}
        >
          <Text
            numberOfLines={showMore[item.id] ? null : 4}
            style={{
              paddingLeft: 8,
              fontSize: 16,
              width: windowWidth - 20,
            }}
          >
            {item.text}
          </Text>
        </View>
        {item.children.map((comment) => {
          return (
            <View
              style={{
                paddingTop: 4,
                paddingLeft: 10,
                flex: 1,
                flexDirection: "row",
              }}
            >
              <Avatar
                size={20}
                rounded
                title={comment.user.name.charAt(0).toUpperCase()}
                containerStyle={{
                  backgroundColor: comment.user.avatarColor,
                  marginRight: 1,
                  paddingTop: 2,
                }}
              />
              <View
                style={{
                  flex: 1,
                  backgroundColor: "lightgrey",
                  flexDirection: "column",
                  borderRadius: 5,
                  paddingLeft: 10,
                  paddingTop: 2,
                  paddingRight: 10,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{comment.user.name}</Text>
                <Text>{comment.text}</Text>
              </View>
            </View>
          );
        })}
        {/*
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity onPress={() => {}}>
            <Icon name="reply" style={{ color: "lightgrey", fontSize: 20 }} />
          </TouchableOpacity>
        </View>
        */}
        <View style={{ flexDirection: "row", paddingTop: 10 }}>
          <MessageTextInput
            onPressSend={async (text) => {
              return sendMessage(text, item._id);
            }}
          />
        </View>
      </View>
    );
  };

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
