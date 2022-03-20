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
import { Avatar, Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ThreadMessageModal from "./ThreadMessageModal";
import TimeAgo from "react-timeago";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import * as MyButtons from "./MyButtons";

export default function MessageView({ item, onPress }) {
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
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            paddingLeft: 4,
            paddingTop: 15,
            alignItems: "center",
            justifyContent: "flex-start",
            width: 24,
            //backgroundColor: "green",
          }}
        >
          {(true || item.status != "read" || (item.unreadChildCount ?? 0) > 0) && (
            <Badge
              status="primary"
              //value={item.unreadChildCount ?? 0 > 0 ? item.unreadChildCount : " "}
              value={""}
              containerStyle={{ width: 24, height: 24 }}
            />
          )}
        </View>
        <View style={{ flexGrow: 1, flexDirection: "row" }}>
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              paddingTop: 10,
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 14,
              //backgroundColor: "purple",
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
                //backgroundColor: "cyan",
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
                  {item.lastUpdated}
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
                numberOfLines={1}
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
        </View>
      </View>
    </TouchableOpacity>
  );
}
