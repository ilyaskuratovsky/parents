// @flow strict-local

import moment from "moment-timezone";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Globals from "./Globals";
import * as UIConstants from "./UIConstants";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Debug from "../common/Debug";
import { Badge } from "react-native-elements";

export default function EventPollMessageView({ item, showGroup = false }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();

  return (
    <View
      style={{
        flex: 1,
        //backgroundColor: "purple"
      }}
    >
      {debugMode ? <Text style={{ fontSize: 10 }}>{item.id}</Text> : null}
      {debugMode ? (
        <Text style={{ fontSize: 10 }}>{JSON.stringify({ ...item, children: null }, null, 2)}</Text>
      ) : null}
      <TouchableOpacity
        style={{ flex: 1, padding: 0, backgroundColor: "rgba(204, 255, 255, 0.5)" }}
        onPress={() => {
          dispatch(
            Actions.openModal({
              modal: "EVENT_POLL",
              messageId: item.id,
            })
          );
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
            {item.userStatus?.status != "read" && (
              <Badge status="primary" value={""} containerStyle={{ width: 12, height: 12 }} />
            )}
          </View>
          <View
            style={{
              flexGrow: 1,
              flexDirection: "column",
              paddingTop: 10,
            }}
          >
            <View style={{ height: 22 }}>
              <Text style={{ fontWeight: "bold", fontSize: 12 }}>Poll</Text>
            </View>
            <View style={{ height: 30 }}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>{item.title}</Text>
            </View>

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
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          height: 60,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            flex: 1, //backgroundColor: "cyan"
          }}
          onPress={() => {
            dispatch(
              Actions.openModal({
                modal: "EVENT_POLL",
                messageId: item.id,
              })
            );
          }}
        >
          <Text>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            flex: 1, //backgroundColor: "cyan"
          }}
        >
          <Text>Not Going</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
