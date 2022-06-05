import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as UserInfo from "../common/UserInfo";
import * as Globals from "./Globals";
import MessageTime from "./MessageTime";
import * as UIConstants from "./UIConstants";

export default function EventMessageView({ item, onPress, showGroup = false }) {
  const timestamp = item.timestamp?.toDate();
  return (
    <TouchableOpacity
      style={{ flex: 1, padding: 20 }}
      onPress={() => {
        onPress();
      }}
    >
      {Globals.dev ? <Text style={{ fontSize: 10 }}>{item.id}</Text> : null}
      {Globals.dev ? (
        <Text style={{ fontSize: 10 }}>{JSON.stringify({ ...item, children: null })}</Text>
      ) : null}
      <View style={{ height: 22 }}>
        <Text style={{ fontWeight: "bold", fontSize: 12 }}>Event</Text>
      </View>
      <View style={{ height: 30 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}
