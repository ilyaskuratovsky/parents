// @flow strict-local

import * as Calendar from "expo-calendar";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import * as Logger from "../common/Logger";
import RootMessage from "../common/MessageData";
import * as MessageData from "../common/MessageData";
import nullthrows from "nullthrows";

type Props = {
  messageId: string,
};
export default function MessagePollVoteModal({ messageId }: Props): React.Node {
  Logger.log("MessagePollVoteModal: " + messageId);
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const message = nullthrows(MessageData.getRootMessage(messageId));
  const pollOptions = nullthrows(message.getPoll());
  const [pollSelection, setPollSelection] = useState(message.getUserPollResponses(userInfo.uid));

  return (
    <Modal visible={true} animationType={"slide"} transparent={true}>
      <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
        <DebugText key="debug1" text={"MessagePollVoteModal.js"} />
        <DebugText key="debug2" text={"Message: " + JSON.stringify(message, null, 2)} />
        <DebugText key="debug3" text={"pollSelection: " + JSON.stringify(pollSelection)} />
        <View
          key="content"
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          {pollOptions.map((pollOption, index) => {
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
                    checked={pollSelection?.[pollOption.name]}
                    onPress={async () => {
                      setPollSelection({
                        ...pollSelection,
                        [pollOption.name]: !pollSelection?.[pollOption.name],
                      });
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
        <View
          style={{
            flexGrow: 1,
            marginTop: 40,
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <MyButtons.FormButton
            key="vote"
            text="Vote"
            disabled={false}
            style={{ width: 100, fontSize: 10 }}
            onPress={async () => {
              console.log("pressed");
              await Controller.sendMessage(
                dispatch,
                userInfo,
                message.getGroupId(),
                null,
                null,
                { poll_response: pollSelection },
                message.getID(),
                null
              );
              dispatch(Actions.closeModal());
            }}
          />
          <MyButtons.LinkButton
            key="cancel"
            text="Cancel"
            disabled={false}
            style={{ width: 100, fontSize: 12, alignItems: "center", justifyContent: "center" }}
            onPress={() => {
              dispatch(Actions.closeModal());
            }}
          />
        </View>
      </Portal>
    </Modal>
  );
}
