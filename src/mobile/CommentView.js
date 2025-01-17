// @flow strict-local

import * as React from "react";
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
import DebugText from "./DebugText";
import RootMessage from "../common/MessageData";
import * as Data from "../common/Data";

type Props = {
  item: RootMessage,
  onPress: () => void,
};
export default function CommentView({ item, onPress }: Props): React.Node {
  const user = Data.getCurrentUser();
  const debugMode = Debug.isDebugMode();

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

  if (item.getEventPoll() != null) {
    return (
      <View
        style={{
          paddingLeft: 10,
          //backgroundColor: "yellow",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {UserInfo.tinyAvatarComponent(item.getUserInfo())}
        <Text style={{ color: "grey", marginLeft: 10, fontStyle: "italic", fontSize: 10 }}>
          {UserInfo.chatDisplayName(item.getUserInfo())} responded to the poll
        </Text>
      </View>
    );
  }

  if (item.getUserInfo()?.uid == user.uid) {
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
          {UserInfo.smallAvatarComponent(item.getUserInfo())}
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
              {UserInfo.chatDisplayName(item.getUserInfo())}
            </Text>
            <View
              style={{
                flex: 1,
                marginLeft: 10,
                alignItems: "flex-end",
              }}
            >
              {item.getTimestamp() ? (
                <MessageTime
                  timestamp={item.getTimestamp()}
                  textStyle={{ fontSize: 11, color: UIConstants.BLACK_TEXT_COLOR }}
                />
              ) : (
                <Text>Fix needed</Text>
              )}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {item.getEventResponse() != null && <Text>{item.getEventResponse()}</Text>}
            {!Utils.isEmptyString(item.getText()) && (
              <Autolink
                // Required: the text to parse for links
                text={item.getText()}
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
            <DebugText text={item.getID()} />
            <DebugText text={JSON.stringify(item, null, 2)} />
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
          {UserInfo.smallAvatarComponent(item.getUserInfo())}
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
              {UserInfo.chatDisplayName(item.getUserInfo())}
            </Text>
            <View
              style={{
                flex: 1,
                marginLeft: 10,
                alignItems: "flex-end",
                //backgroundColor: "green",
              }}
            >
              {item.getTimestamp() ? (
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
                  timestamp={item.getTimestamp()}
                  textStyle={{ fontSize: 11, color: UIConstants.BLACK_TEXT_COLOR }}
                />
              ) : (
                <Text>Fix needed: {JSON.stringify(item.getTimestamp())}</Text>
              )}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "column" }}>
            {item.getEventResponse() != null && <Text>{item.getEventResponse()}</Text>}
            <Autolink
              // Required: the text to parse for links
              text={item.getText()}
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

            <DebugText text={item.getID()} />
            <DebugText text={JSON.stringify(item, null, 2)} />
          </View>
        </View>
      </View>
    );
  }
}
