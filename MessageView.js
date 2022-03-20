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
        flex: 1,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 14,
        //backgroundColor: "white",
      }}
    >
      {/* user avatar and name section */}
      <View
        style={{
          flex: 1,
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
            {item.user.name} {/*item._id*/}
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
      {/* title */}
      <View
        style={{
          paddingLeft: 0,
          paddingTop: 0,
          borderRadius: 0,
          //backgroundColor: "white",
        }}
      >
        <Text
          style={{
            paddingLeft: 0,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {item.title}
        </Text>
        {/*
        <Text
          style={{
            paddingLeft: 0,
            fontSize: 10,
            fontWeight: "bold",
          }}
        >
          {JSON.stringify(item)}
        </Text>
        */}
      </View>

      {/* message text */}
      <View
        style={{
          paddingLeft: 0,
          paddingTop: 0,
          borderRadius: 0,
          //backgroundColor: "white",
        }}
      >
        <Text
          numberOfLines={2}
          ellipsizeMode="head"
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
