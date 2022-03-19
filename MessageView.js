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

export default function MessageView({ item, width, onPress }) {
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
        width: width,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 14,
        //backgroundColor: "white",
      }}
    >
      <View
        style={{
          width: width,
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: 6,
          //backgroundColor: "white",
        }}
      >
        <Avatar
          size={20}
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
            //backgroundColor: "white",
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
          width: width - 20,
          paddingLeft: 0,
          paddingTop: 0,
          borderRadius: 0,
          //backgroundColor: "white",
        }}
      >
        <Text
          //numberOfLines={showMore[item.id] ? null : 4}
          style={{
            paddingLeft: 0,
            fontSize: 18,
            width: width - 20,
          }}
        >
          {item.text}
        </Text>
      </View>
      {/*item.children.map((comment) => {
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
      })*/}
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
      {/*
      <View style={{ flexDirection: "row", paddingTop: 10 }}>
        <MessageTextInput
          onPressSend={async (text) => {
            return sendMessage(text, item._id);
          }}
        />
      </View>
        */}
    </View>
  );
}
