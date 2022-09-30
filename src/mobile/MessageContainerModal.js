import * as Calendar from "expo-calendar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Utils from "../common/Utils";
import { Divider, CheckBox } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CommentView from "./CommentView";
import * as Controller from "../common/Controller";
import * as MessageUtils from "../common/MessageUtils";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import * as Globals from "./Globals";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import BookCalendarEventModal from "./BookCalendarEventModal";
//import moment from "moment";
import moment from "moment-timezone";
import JSONTree from "react-native-json-tree";
import Autolink from "react-native-autolink";
import { userInfo } from "../common/Actions";
import MessageModal from "./MessageModal";
import EventMessageModal from "./EventMessageModal";
import EventPollMessageModal from "./EventPollMessageModal";

export default function MessagesContainer({ groupId, messageId, visible, closeModal }) {
  const user = useSelector((state) => state.main.userInfo);

  // if message has a parent, render the parent message
  const message = Data.getRootMessageWithChildrenAndUserStatus(messageId);
  const group = Data.getGroup(grouId);
  Logger.log("built message with children: " + message.id);

  if (message.event != null) {
    return (
      <EventMessageModal
        user={user}
        group={group}
        message={message}
        visible={visible}
        closeModal={closeModal}
        userMap={userMap}
      />
    );
  } else if (message.event_poll != null) {
    return (
      <EventPollMessageModal
        user={user}
        group={group}
        message={message}
        visible={visible}
        closeModal={closeModal}
        userMap={userMap}
      />
    );
  } else {
    return (
      <MessageModal
        user={user}
        group={group}
        message={message}
        visible={visible}
        closeModal={closeModal}
        userMap={userMap}
        scrollToEnd={message.id != messageId}
      />
    );
  }
}
