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

export default function CommentView({ item, onPress }) {
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
        flexDirection: "row",
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 14,
        //backgroundColor: "white",
      }}
    >
      {/* avatar view */}
      <View
        style={{
          width: 50,
          justifyContent: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Avatar
          size={40}
          rounded
          title={item.user.name.charAt(0).toUpperCase()}
          containerStyle={{
            backgroundColor: item.user.avatarColor,
            marginRight: 1,
          }}
        />
      </View>

      {/* user name + text */}
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 5,
          paddingBottom: 5,
          borderRadius: 15,
          backgroundColor: "lightgrey",
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
              fontSize: 16,
            }}
          >
            {item.user.name}
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
        <Text
          //numberOfLines={showMore[item.id] ? null : 4}
          style={{
            paddingLeft: 0,
            fontSize: 18,
          }}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );
}
