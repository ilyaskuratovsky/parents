import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as UserInfo from "../common/UserInfo";
import * as Globals from "./Globals";
import MessageTime from "./MessageTime";
import * as UIConstants from "./UIConstants";
import MessageView from "./MessageView";
import MessagePollView from "./MessagePollView";
import EventMessageView from "./EventMessageView";
import EventPollMessageView from "./EventPollMessageView";
import EventPollMessageCreatorView from "./EventPollMessageCreatorView";

export default function MessageViewContainer({ user, item, onPress, showGroup = false }) {
  if (item.event != null) {
    return <EventMessageView item={item} />;
  } else if (item.event_poll != null) {
    if (item.user.uid != user.uid) {
      return <EventPollMessageView item={item} />;
    } else {
      return <EventPollMessageCreatorView message={item} />;
    }
  } else if (item.poll != null) {
    return <MessagePollView message={item} onPress={onPress} showGroup={showGroup} />;
  } else {
    return <MessageView item={item} onPress={onPress} showGroup={showGroup} />;
  }
}
