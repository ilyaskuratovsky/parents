import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as UserInfo from "../common/UserInfo";
import * as Globals from "./Globals";
import MessageTime from "./MessageTime";
import * as UIConstants from "./UIConstants";
import * as Debug from "../common/Debug";

export default function MessageView({ item, onPress }) {
  const timestamp = item.timestamp?.toDate();
  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", paddingRight: 20 }}>
        <View
          style={{
            paddingLeft: 0,
            paddingTop: 15,
            alignItems: "center",
            justifyContent: "flex-start",
            width: 20,
            //backgroundColor: "cyan",
          }}
        >
          {(item.status != "read" || (item.unreadChildCount ?? 0) > 0) && (
            <Badge
              status="primary"
              //value={item.unreadChildCount ?? 0 > 0 ? item.unreadChildCount : " "}
              value={""}
              containerStyle={{ width: 12, height: 12 }}
            />
          )}
        </View>
        <View
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
            {/* title */}
            <View
              style={{
                paddingLeft: 0,
                paddingTop: 0,
                borderRadius: 0,
                //backgroundColor: "white",
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                {item.event != null && (
                  <Icon name="calendar" style={{ color: "black", fontSize: 24 }} />
                )}
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
              {Globals.dev ? <Text style={{ fontSize: 10 }}>{item.id}</Text> : null}
              {Globals.dev ? (
                <Text style={{ fontSize: 10 }}>{JSON.stringify({ ...item, children: null })}</Text>
              ) : null}
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
                  width: 200,
                  //backgroundColor: "cyan"
                }}
              >
                <Text
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
              </View>
              <View style={{ flexGrow: 1 }}></View>
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
            {item.event != null && item.event.summary != null && (
              <View style={{ flexDirection: "row" }}>
                <Text>{item.event.summary.accepted ?? 0} Accepted</Text>
                <Text>{item.event.summary.declined ?? 0} Declined</Text>
                <Text>{item.event.summary.not_responded ?? 0} Not Responded</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
