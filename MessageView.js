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
import * as Globals from "./Globals";

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
        <View style={{ flexGrow: 1, flexDirection: "row" }}>
          {/* main content*/}
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              paddingTop: 10,
              paddingLeft: 0,
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
                    date={item.lastUpdated}
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
              <View style={{ flex: 1, flexDirection: "row" }}>
                {item.event != null && (
                  <Icon name="calendar" style={{ color: "black", fontSize: 24 }} />
                )}
                <Text
                  style={{
                    paddingLeft: 0,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {item.title}
                </Text>
              </View>
              {Globals.dev ? <Text style={{ fontSize: 10 }}>{item._id}</Text> : null}
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
                    fontSize: 18,
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
                    width: 80,
                    flexDirection: "column",
                    backgroundColor: "lightgrey",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      //backgroundColor: "green",
                      paddingLeft: 0,
                      fontSize: 14,
                      fontWeight: item.unreadChildCount > 0 ? "bold" : "normal",
                    }}
                  >
                    {item.children.length > 1
                      ? item.children.length + " replies"
                      : item.children.length + " reply"}
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
