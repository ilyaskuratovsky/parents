import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as UserInfo from "../common/UserInfo";
import * as Globals from "./Globals";
import MessageTime from "./MessageTime";
import * as UIConstants from "./UIConstants";
import MessageView from "./MessageView";
import EventMessageView from "./EventMessageView";

export default function MessageViewContainer({ item, onPress, showGroup = false }) {
  if (item.event != null) {
    return <EventMessageView item={item} />;
  } else {
    return <MessageView item={item} onPress={onPress} showGroup={showGroup} />;
  }
}
