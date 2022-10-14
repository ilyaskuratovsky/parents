// @flow strict-local

import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Globals from "./Globals";
import MessageTime from "./MessageTime";
import * as UIConstants from "./UIConstants";
import MessageView from "./MessageView";
import MessagePollView from "./MessagePollView";
import EventMessageView from "./EventMessageView";
import EventPollMessageView from "./EventPollMessageView";
import EventPollMessageCreatorView from "./EventPollMessageCreatorView";
import type { UserInfo } from "../common/Database";
import type RootMessage from "../common/MessageData";

type Props = {
  user: UserInfo,
  item: RootMessage,
  onPress: () => void,
  showGroup?: boolean,
};

export default function MessageViewContainer({
  user,
  item,
  onPress,
  showGroup = false,
}: Props): React.Node {
  if (item.getEvent() != null) {
    return <EventMessageView item={item} />;
  } else if (item.getEventPoll() != null) {
    if (item.getUserInfo()?.uid != user.uid) {
      return <EventPollMessageView item={item} />;
    } else {
      return <EventPollMessageCreatorView message={item} />;
    }
  } else if (item.getPoll() != null) {
    return <MessagePollView message={item} onPress={onPress} showGroup={showGroup} />;
  } else {
    return <MessageView item={item} onPress={onPress} showGroup={showGroup} />;
  }
}
