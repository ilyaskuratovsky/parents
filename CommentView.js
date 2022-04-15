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
import * as Random from "./Random";
import * as Globals from "./Globals";
import * as UserInfo from "./UserInfo";

export default function CommentView({ item, user, onPress }) {
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

  if (item.user.uid == user.uid) {
    return (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          marginLeft: 40,
          paddingTop: 10,
          paddingLeft: 10,
          paddingBottom: 14,
          paddingRight: 10,
          //backgroundColor: Random.randomColor(),
        }}
      >
        {/* avatar view */}
        <View
          style={{
            width: 40,
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          {UserInfo.smallAvatarComponent(item.user)}
        </View>

        {/* user name + text */}
        <View
          style={{
            flex: 1,
            marginRight: 0,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: 15,
            backgroundColor: "lightskyblue",
            flexDirection: "column",
          }}
        >
          {/* user name + time ago */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              {UserInfo.chatDisplayName(item.user)}
            </Text>
            <View
              style={{
                marginLeft: 10,
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
          <View style={{ flex: 1, flexDirection: "column" }}>
            {item.event != null && <Text>Going</Text>}
            <Text
              //numberOfLines={showMore[item.id] ? null : 4}
              style={{
                paddingLeft: 0,
                fontSize: 14,
                color: "#222222",
              }}
            >
              {item.text}
            </Text>
            {Globals.dev && <Text style={{ fontSize: 8 }}>{item.id}</Text>}
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          paddingTop: 10,
          paddingLeft: 10,
          paddingBottom: 14,
          paddingRight: 10,
          //backgroundColor: Random.randomColor(),
        }}
      >
        {/* avatar view */}
        <View
          style={{
            width: 40,
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          {UserInfo.smallAvatarComponent(item.user)}
        </View>

        {/* user name + text */}
        <View
          style={{
            flex: 1,
            marginRight: 60,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: 15,
            backgroundColor: "#EEEEEE",
            flexDirection: "column",
          }}
        >
          {/* user name + time ago */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 14,
              }}
            >
              {UserInfo.chatDisplayName(item.user)}
            </Text>
            <View
              style={{
                marginLeft: 10,
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
          <View style={{ flex: 1, flexDirection: "column" }}>
            {item.event != null && <Text>Going</Text>}
            <Text
              //numberOfLines={showMore[item.id] ? null : 4}
              style={{
                paddingLeft: 0,
                fontSize: 14,
                color: "#222222",
              }}
            >
              {item.text}
            </Text>
            {Globals.dev && <Text style={{ fontSize: 8 }}>{item._id}</Text>}
          </View>
        </View>
      </View>
    );
  }
}
