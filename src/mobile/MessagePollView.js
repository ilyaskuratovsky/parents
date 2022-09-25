import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as UserInfo from "../common/UserInfo";
import * as Globals from "./Globals";
import MessageTime from "./MessageTime";
import * as UIConstants from "./UIConstants";
import * as Debug from "../common/Debug";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Utils from "../common/Utils";
import DebugText from "./DebugText";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import Checkbox from "./Checkbox";
import * as Data from "../common/Data";
import * as Controller from "../common/Controller";
import * as Logger from "../common/Logger";

export default function MessagePollView({ item, showGroup = false }) {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const timestamp = item.timestamp?.toDate();
  const pollOptions = item.poll;
  const pollResponses = item.poll_responses ?? {};
  const initialUserPollResponses = {};

  for (const pollOption of pollOptions) {
    initialUserPollResponses[pollOption.name] = (
      (pollResponses[pollOption.name] ?? {}).uids ?? []
    ).includes(userInfo.uid);
  }
  const [userPollResponse, setUserPollReponse] = useState(initialUserPollResponses);
  Logger.log("userPollResponse: " + JSON.stringify(userPollResponse));
  const toggleAndSendPollResponse = useCallback(async (option) => {
    const currentState = userPollResponse[option];
    let response = null;
    if (currentState == null || currentState.response == "false") {
      response = "true";
    } else {
      response = "false";
    }

    await Controller.sendMessage(
      dispatch,
      userInfo,
      item.groupId,
      null,
      null,
      { poll_response: { option: option, response: response } },
      item.id,
      null
    );
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(Actions.openModal({ modal: "MESSAGE_POLL", messageId: item.id }));
      }}
    >
      <DebugText key="debug1" text="MessagePollView.js" />
      <DebugText key="debug2" text={JSON.stringify({ ...item /*, children: null*/ }, null, 2)} />
      <View key="container" style={{ flex: 1, flexDirection: "row", paddingRight: 20 }}>
        <View
          key={"user_status"}
          style={{
            paddingLeft: 0,
            paddingTop: 15,
            alignItems: "center",
            justifyContent: "flex-start",
            width: 20,
            //backgroundColor: "cyan",
          }}
        >
          {item.userStatus?.status != "read" && (
            <Badge status="primary" value={""} containerStyle={{ width: 12, height: 12 }} />
          )}
        </View>
        <View
          key="flex_container"
          style={{
            flexGrow: 1,
            flexDirection: "row",
            //backgroundColor: "cyan"
          }}
        >
          {/* main content*/}
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              paddingTop: 10,
              paddingLeft: 0,
              paddingRight: 0,
              paddingBottom: 14,
              //backgroundColor: "purple",
            }}
          >
            {/* group name/user avatar and name section */}
            {showGroup && (
              <View
                key="container1"
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 6,
                  //backgroundColor: "cyan",
                }}
              >
                {UserInfo.smallAvatarComponent(item.user)}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 0,
                    //backgroundColor: "yellow",
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "column", marginLeft: 6 }}>
                    <Text key="group_name" style={{ fontWeight: "bold", fontSize: 14 }}>
                      {item.group?.name ?? "No group name"}
                    </Text>
                    <Text
                      key="user_name"
                      style={{
                        fontWeight: "normal",
                        color: UIConstants.BLACK_TEXT_COLOR,
                        fontSize: 12,
                      }}
                    >
                      {UserInfo.chatDisplayName(item.user)} {/*item._id*/}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: 5,
                      fontWeight: "normal",
                      fontSize: 14,
                    }}
                  >
                    <MessageTime
                      timestamp={timestamp}
                      textStyle={{ fontSize: 11, color: UIConstants.BLACK_TEXT_COLOR }}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* user avatar and name section */}
            {!showGroup && (
              <View
                key="container2"
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 6,
                  //backgroundColor: "cyan",
                }}
              >
                {UserInfo.smallAvatarComponent(item.user)}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 0,
                    //backgroundColor: "yellow",
                  }}
                >
                  <Text
                    key="username"
                    style={{
                      marginLeft: 5,
                      fontWeight: "bold",
                      color: UIConstants.BLACK_TEXT_COLOR,
                      fontSize: 16,
                    }}
                  >
                    {UserInfo.chatDisplayName(item.user)} {/*item._id*/}
                  </Text>
                  <View
                    key="message_time"
                    style={{
                      marginLeft: 5,
                      fontWeight: "normal",
                      fontSize: 14,
                    }}
                  >
                    <MessageTime
                      timestamp={timestamp}
                      textStyle={{ fontSize: 11, color: UIConstants.BLACK_TEXT_COLOR }}
                    />
                  </View>
                </View>
              </View>
            )}
            {/* title */}
            <View
              key="title"
              style={{
                paddingLeft: 0,
                paddingTop: 0,
                borderRadius: 0,
              }}
            >
              <View key="title_1" style={{ flex: 1, flexDirection: "row" }}>
                <Text
                  style={{
                    paddingLeft: 0,
                    fontSize: 16,
                    fontWeight: "bold",
                    color: UIConstants.BLACK_TEXT_COLOR,
                  }}
                >
                  {item.title ?? "[No Title]"}
                </Text>
              </View>
            </View>

            {/* Poll Section */}
            <View
              key="poll_section"
              style={{
                paddingLeft: 0,
                paddingTop: 0,
                borderRadius: 0,
                flex: 1,
                flexDirection: "column",
                //backgroundColor: "cyan",
              }}
            >
              {pollOptions.map((pollOption, index) => {
                return (
                  <View key={"poll_option_" + index} style={{ flexDirection: "column" }}>
                    <DebugText
                      key="debug1"
                      text={"Checked: " + userPollResponse[pollOption.name]}
                    />
                    <Text key={index}>{pollOption.message}</Text>
                    <DebugText key="debug2" text={JSON.stringify(userPollResponse)} />
                    <View key="percent" style={{ width: "100%", backgroundColor: "red" }}>
                      <Text>0%</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* message text */}
            <View
              style={{
                paddingLeft: 0,
                paddingTop: 0,
                borderRadius: 0,
                flex: 1,
                flexDirection: "row",
                //backgroundColor: "cyan",
              }}
            >
              <View
                style={{
                  width: "100%",
                  //backgroundColor: "yellow",
                }}
              >
                {!Utils.isEmptyString(item.text) && (
                  <Text
                    key="text"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 16,
                      color: UIConstants.BLACK_TEXT_COLOR,
                      flexGrow: 1,
                    }}
                  >
                    {(item.text ?? "").replace(/(\r\n|\n|\r)/gm, " ")}
                  </Text>
                )}
                {(item.attachments ?? []).map((attachment) => {
                  return (
                    <Image
                      key="image"
                      source={{ uri: attachment.uri }}
                      //resizeMode={"contain"}
                      style={{ width: "100%", height: null, aspectRatio: 4 / 3 }}
                    />
                  );
                })}
              </View>
              {/* replies */}
              <View
                style={{
                  width: 100,
                  //backgroundColor: "purple",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    //backgroundColor: "lightgrey",
                    //borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      //backgroundColor: "green",
                      paddingLeft: 0,
                      fontSize: 14,
                      fontWeight: item.unreadChildCount > 0 ? "bold" : "normal",
                      color: UIConstants.BLACK_TEXT_COLOR,
                    }}
                  >
                    {(item.children?.length ?? -1) > 1 || item.children?.length == 0
                      ? (item.children?.length ?? -1) + " replies"
                      : (item.children?.length ?? -1) + " reply"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
