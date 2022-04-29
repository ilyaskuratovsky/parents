import React from "react";
import { Text, View } from "react-native";
import TimeAgo from "react-timeago";
import * as Globals from "./Globals";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
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
          paddingTop: 0,
          paddingLeft: 10,
          paddingBottom: 0,
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
            backgroundColor: "#daedf4", //light blue
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
                color: UIConstants.BLACK_TEXT_COLOR,
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
                color: "#333333",
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
          paddingTop: 0,
          paddingLeft: 10,
          paddingBottom: 0,
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
                color: UIConstants.BLACK_TEXT_COLOR,
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
                  color: "#333333",
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
                color: UIConstants.BLACK_TEXT_COLOR,
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
