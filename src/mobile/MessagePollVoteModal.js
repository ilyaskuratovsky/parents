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
import Checkbox from "./Checkbox";
//import moment from "moment";
import moment from "moment-timezone";
import JSONTree from "react-native-json-tree";
import Autolink from "react-native-autolink";
import * as Actions from "../common/Actions";
import * as Debug from "../common/Debug";
import * as Data from "../common/Data";
import DebugText from "./DebugText";

export default function MessagePollVoteModal({ messageId }) {
  Logger.log("MessagePollVoteModal: " + messageId);
  const debugMode = Debug.isDebugMode();
  const dispatch = useDispatch();
  const user = Data.getCurrentUser();
  const messageObj = Data.getMessage(messageId);
  const message = Data.getRootMessageWithChildrenAndUserStatus(messageId);
  const pollOptions = message.poll;
  const group = Data.getGroup(message.groupId);

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
      item.groupId,
      null,
      null,
      { poll_response: { option: option, response: response } },
      item.id,
      null
    );
  }, []);

  return (
    <Modal visible={true} animationType={"slide"} transparent={true}>
      <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          {pollOptions.map((pollOption, index) => {
            /*
                      return (
                      );
                      */
            return (
              <View
                key={index}
                style={{
                  height: 60,
                  flexDirection: "row",
                  backgroundColor: "cyan",
                  borderWidth: 1,
                  alignItems: "center",
                }}
              >
                <View style={{ width: "80%" }}>
                  <Checkbox
                    checked={true}
                    onPress={async () => {
                      //setPoll(!poll);
                    }}
                    text={<Text key={index}>{pollOption.message}</Text>}
                  />
                </View>
                <View style={{ flex: 1, width: "20%", alignItems: "flex-end" }}>
                  <Text style={{}} key={index}>
                    Putas
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ flexGrow: 1, marginTop: 40, alignItems: "center" }}>
          <MyButtons.FormButton
            text="Vote"
            disabled={false}
            style={{ width: 100, fontSize: 10 }}
            onPress={() => {}}
          />
        </View>
      </Portal>
    </Modal>
  );
}
