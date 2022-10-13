// @flow strict-local

import * as React from "react";
import { useCallback, useState } from "react";
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
import RootMessage from "../common/MessageData";
import FacePile from "./FacePile";

type Props = {
  message: RootMessage,
  showGroup?: boolean,
};

export default function MessagePollView({ message, showGroup = false }: Props): React.Node {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const timestamp = message.getTimestamp();
  const pollOptions = message.getPoll();

  const pollSummary = message.getPollSummary();
  /*
    "Option 1": {count: 2, total: 8, users: []}
    "Option 2": {}

  */

  const initialUserPollResponses = {};

  /*
  for (const pollOption of pollOptions) {
    initialUserPollResponses[pollOption.name] = (
      (pollResponses[pollOption.name] ?? {}).uids ?? []
    ).includes(userInfo.uid);
  }
  const [userPollResponse, setUserPollReponse] = useState(initialUserPollResponses);
  */
  /*
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
      message.groupId,
      null,
      null,
      { poll_response: { option: option, response: response } },
      message.id,
      null
    );
  }, []);
  */

  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(Actions.openModal({ modal: "MESSAGE_POLL", messageId: message.id }));
      }}
    >
      <DebugText key="debug1" text="MessagePollView.js" />
      <DebugText key="debug2" text={JSON.stringify({ ...message /*, children: null*/ }, null, 2)} />
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
          {message.userStatus?.status != "read" && (
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
                {UserInfo.smallAvatarComponent(message.user)}
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
                      {message.group?.name ?? "No group name"}
                    </Text>
                    <Text
                      key="user_name"
                      style={{
                        fontWeight: "normal",
                        color: UIConstants.BLACK_TEXT_COLOR,
                        fontSize: 12,
                      }}
                    >
                      {UserInfo.chatDisplayName(message.user)} {/*item._id*/}
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
                {UserInfo.smallAvatarComponent(message.user)}
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
                    {UserInfo.chatDisplayName(message.user)} {/*item._id*/}
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
                  {message.title ?? "[No Title]"}
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
                  <View
                    key={"poll_option_" + index}
                    style={{ flexDirection: "column", marginTop: 10 }}
                  >
                    <View style={{ flex: 1, flexDirection: "row", height: 34 }}>
                      <View
                        key={"poll_option_" + index}
                        style={{ flexDirection: "column", justifyContent: "center" }}
                      >
                        <Text key={index}>{pollOption.message}</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          width: "20%",
                          alignItems: "flex-end",
                          justifyContent: "center",
                        }}
                      >
                        <FacePile userIds={pollSummary[pollOption.name].users} border />
                      </View>
                    </View>
                    <View
                      key="percent"
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        borderWidth: 1,
                        borderColor: "black",
                      }}
                    >
                      <View
                        key="percent"
                        style={{
                          width:
                            "" +
                            (100 * pollSummary[pollOption.name].count) /
                              pollSummary[pollOption.name].total +
                            "%",
                          backgroundColor: "red",
                          flexDirection: "row",
                        }}
                      >
                        <Text></Text>
                      </View>
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
                {!Utils.isEmptyString(message.text) && (
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
                    {(message.text ?? "").replace(/(\r\n|\n|\r)/gm, " ")}
                  </Text>
                )}
                {(message.attachments ?? []).map((attachment) => {
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
                      fontWeight: message.unreadChildCount > 0 ? "bold" : "normal",
                      color: UIConstants.BLACK_TEXT_COLOR,
                    }}
                  >
                    {(message.children?.length ?? -1) > 1 || message.children?.length == 0
                      ? (message.children?.length ?? -1) + " replies"
                      : (message.children?.length ?? -1) + " reply"}
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
