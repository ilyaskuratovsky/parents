import React from "react";
import { Text, View } from "react-native";
import TimeAgo from "react-timeago";
import * as Globals from "./Globals";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as Date from "../common/Date";
import Autolink from "react-native-autolink";
import MessageTime from "./MessageTime";
import * as Utils from "../common/Utils";
import * as Debug from "../common/Debug";

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

  if (item.event_poll_response != null) {
    return (
      <View
        style={{
          paddingLeft: 10,
          //backgroundColor: "yellow",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {UserInfo.tinyAvatarComponent(item.user)}
        <Text style={{ color: "grey", marginLeft: 10, fontStyle: "italic", fontSize: 10 }}>
          {UserInfo.chatDisplayName(item.user)} responded to the poll
        </Text>
      </View>
    );
  }

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
                flex: 1,
                marginLeft: 10,
                fontWeight: "normal",
                fontSize: 14,
                alignItems: "flex-end",
              }}
            >
              {item.timestamp ? (
                /*
                <TimeAgo
                  date={Date.toDate(item.timestamp)}
                  style={{
                    marginLeft: 5,
                    fontWeight: "normal",
                    fontSize: 14,
                  }}
                  component={timeAgo}
                />
                */
                <MessageTime
                  timestamp={item.timestamp?.toDate()}
                  textStyle={{ fontSize: 11, color: UIConstants.BLACK_TEXT_COLOR }}
                />
              ) : (
                <Text>Fix needed</Text>
              )}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {item.eventResponse != null && <Text>{item.eventResponse}</Text>}
            {!Utils.isEmptyString(item.text) && (
              <Autolink
                // Required: the text to parse for links
                text={item.text}
                // Optional: enable email linking
                email
                // Optional: enable hashtag linking to instagram
                phone="sms"
                // Optional: enable URL linking
                url
                style={{
                  paddingLeft: 0,
                  fontSize: 14,
                  color: "#333333",
                }}
              />
            )}
            {Debug.isDebugMode() && <Text style={{ fontSize: 8 }}>{item.id}</Text>}
            {Debug.isDebugMode() && (
              <Text style={{ fontSize: 8 }}>{JSON.stringify(item, null, 2)}</Text>
            )}
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
                flex: 1,
                marginLeft: 10,
                fontWeight: "normal",
                fontSize: 14,
                alignItems: "flex-end",
                //backgroundColor: "green",
              }}
            >
              {item.timestamp ? (
                /*
                <TimeAgo
                  date={Date.toDate(item.timestamp)}
                  style={{
                    marginLeft: 5,
                    fontWeight: "normal",
                    fontSize: 14,
                  }}
                  component={timeAgo}
                />
                */
                <MessageTime
                  timestamp={item.timestamp?.toDate()}
                  textStyle={{ fontSize: 11, color: UIConstants.BLACK_TEXT_COLOR }}
                />
              ) : (
                <Text>Fix needed: {JSON.stringify(item.createdAt)}</Text>
              )}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {item.eventResponse != null && <Text>{item.eventResponse}</Text>}
            <Autolink
              // Required: the text to parse for links
              text={item.text}
              // Optional: enable email linking
              email
              // Optional: enable hashtag linking to instagram
              phone="sms"
              // Optional: enable URL linking
              url
              style={{
                paddingLeft: 0,
                fontSize: 14,
                color: UIConstants.BLACK_TEXT_COLOR,
              }}
            />

            {Globals.dev && (
              <Text style={{ fontSize: 8 }}>(not from parent message uid) {item.id}</Text>
            )}
            {Globals.dev && <Text style={{ fontSize: 8 }}>{JSON.stringify(item, null, 2)}</Text>}
          </View>
        </View>
      </View>
    );
  }
}
