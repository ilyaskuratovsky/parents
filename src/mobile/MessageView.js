// @flow strict-local
import * as React from "react";
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
import RootMessage from "../common/MessageData";

export default function MessageView({
  item,
  onPress,
  showGroup = false,
}: {
  item: RootMessage,
  onPress: () => void,
  showGroup: boolean,
  ...
}): React.Node {
  const timestamp = item.getTimestamp();
  const debugMode = Debug.isDebugMode();
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
    >
      <DebugText key="debug1" text="MessageView.js" />
      <View key="content" style={{ flex: 1, flexDirection: "row", paddingRight: 20 }}>
        <View
          key="badge"
          style={{
            paddingLeft: 0,
            paddingTop: 15,
            alignItems: "center",
            justifyContent: "flex-start",
            width: 20,
            //backgroundColor: "cyan",
          }}
        >
          {item.getUserStatus()?.status != "read" && (
            <Badge status="primary" value={""} containerStyle={{ width: 12, height: 12 }} />
          )}
        </View>
        <View
          key="content"
          style={{
            flexGrow: 1,
            flexDirection: "row",
            //backgroundColor: "cyan"
          }}
        >
          {/* main content*/}
          <View
            key="main_content"
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
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 6,
                  //backgroundColor: "cyan",
                }}
              >
                {UserInfo.smallAvatarComponent(item.getUserInfo())}
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
                    <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                      {item.getGroup()?.name ?? "No group name"}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "normal",
                        color: UIConstants.BLACK_TEXT_COLOR,
                        fontSize: 12,
                      }}
                    >
                      {UserInfo.chatDisplayName(item.getUserInfo())} {/*item._id*/}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: 5,
                      //fontWeight: "normal",
                      //fontSize: 14,
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
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 6,
                  //backgroundColor: "cyan",
                }}
              >
                {UserInfo.smallAvatarComponent(item.getUserInfo())}
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
                    key="name"
                    style={{
                      marginLeft: 5,
                      fontWeight: "bold",
                      color: UIConstants.BLACK_TEXT_COLOR,
                      fontSize: 16,
                    }}
                  >
                    {UserInfo.chatDisplayName(item.getUserInfo())} {/*item._id*/}
                  </Text>
                  <View
                    key="message_time"
                    style={{
                      marginLeft: 5,
                      //fontWeight: "normal",
                      //fontSize: 14,
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
              style={{
                paddingLeft: 0,
                paddingTop: 0,
                borderRadius: 0,
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text
                  key="title"
                  style={{
                    paddingLeft: 0,
                    fontSize: 16,
                    fontWeight: "bold",
                    color: UIConstants.BLACK_TEXT_COLOR,
                  }}
                >
                  {item.getTitle() ?? "[No Title]"}
                </Text>
              </View>
              <DebugText key="debug1" text={item.getID()} />
              <DebugText
                key="debug2"
                text={JSON.stringify({ ...item.rootMessage, children: item.children }, null, 2)}
              />
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
                {!Utils.isEmptyString(item.getText()) && (
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
                    {(item.getText() ?? "").replace(/(\r\n|\n|\r)/gm, " ")}
                  </Text>
                )}
                {(item.getAttachments() ?? []).map((attachment) => {
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
                      fontWeight: item.getUnreadChildCount() > 0 ? "bold" : "normal",
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
