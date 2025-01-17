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
  scrollToEnd?: ?boolean,
};
export default function MessagePollModal({ messageId, scrollToEnd }: Props): React.Node {
  Logger.log("MessagePollModal: " + messageId);
  const debugMode = Debug.isDebugMode();
  const dispatch = useDispatch();
  const user = Data.getCurrentUser();
  const pollMessage = nullthrows(MessageData.getRootMessage(messageId));
  //const message = Data.getRootMessageWithChildrenAndUserStatus(messageId);
  //const pollMessage = new RootMessage(message);
  const pollSummary = nullthrows(pollMessage.getPollSummary());
  const pollOptions = nullthrows(pollMessage.getPoll());
  const group = nullthrows(pollMessage.getGroup());
  const sortedChildMessages = [...pollMessage.getChildren()] ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return (m1.getTimestamp()?.getTime() ?? 0) - (m2.getTimestamp()?.getTime() ?? 0);
    //return 0;
  });

  const childMessages = sortedChildMessages;

  // send message callback function
  const sendMessage = useCallback(async (text: string) => {
    const groupName = group?.name;
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    await Controller.sendReply(dispatch, user, group?.id, text, pollMessage.getID(), {
      groupName,
      fromName,
    });
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const [text, setText] = useState("");
  const scrollViewRef = useRef();
  const insets = useSafeAreaInsets();
  const topBarHeight = 40;

  useEffect(() => {
    const markMessagesRead = async (): Promise<void> => {
      let markRead = [];
      if (pollMessage.getUserStatus().status != "read") {
        markRead.push(pollMessage.getID());
      }
      const unreadChildMessages = (pollMessage.getChildren() ?? []).filter(
        (m) => m.getUserStatus().status != "read"
      );
      markRead = markRead.concat(unreadChildMessages.map((m) => m.getID()));
      Controller.markMessagesRead(user, markRead);
    };
    markMessagesRead();
  }, [pollMessage]);

  // if the the message id is a comment (e.g. this view was opened to a comment, scroll all the way down
  // fix this later to scroll to the specific message
  useEffect(() => {
    const scrollToEnd = async (): Promise<void> => {
      if (scrollToEnd) {
        scrollViewRef?.current?.scrollToEnd({ anmiated: true });
      }
    };
    scrollToEnd();
  }, []);

  return (
    <Modal visible={true} animationType={"slide"}>
      <Portal
        backgroundColor={UIConstants.DEFAULT_BACKGROUND}
        //backgroundColor="green"
      >
        <DebugText key="debug1" text="MessagePollModal.js" />
        {/* top bar */}
        <TopBarMiddleContentSideButtons
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
          height={topBarHeight}
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                dispatch(Actions.closeModal());
              }}
              color="black"
            />
          }
          center={null}
          right={null}
        />

        {/* main content */}
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
          behavior="padding"
          keyboardVerticalOffset={40}
          enabled
        >
          <DebugText key="debug1" text={JSON.stringify(pollMessage.rootMessage, null, 2)} />
          <ScrollView
            key="scroll"
            ref={scrollViewRef}
            style={{ flex: 1 }}
            onContentSizeChange={() => {
              //scrollViewRef.current.scrollToEnd({ animated: true });
            }}
          >
            {/* parent message */}
            <View
              key="header"
              style={{
                flexDirection: "column",
                paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 14,
                //backgroundColor: "purple",
              }}
            >
              <View
                key="avatar"
                style={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 6,
                }}
              >
                {UserInfo.smallAvatarComponent(pollMessage.getUserInfo())}
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
                      fontSize: 14,
                      color: UIConstants.BLACK_TEXT_COLOR,
                    }}
                  >
                    {UserInfo.chatDisplayName(pollMessage.getUserInfo())}
                  </Text>
                </View>
              </View>
              <View
                key="title"
                style={{
                  paddingLeft: 0,
                  paddingTop: 0,
                  borderRadius: 0,
                }}
              >
                <Text
                  //numberOfLines={showMore[item.id] ? null : 4}
                  style={{
                    paddingLeft: 0,
                    fontWeight: "bold",
                    fontSize: 16,
                    color: UIConstants.BLACK_TEXT_COLOR,
                  }}
                >
                  {pollMessage.getTitle()}
                </Text>

                {/* the message text */}
                <Autolink
                  // Required: the text to parse for links
                  text={pollMessage.getText()}
                  // Optional: enable email linking
                  email
                  // Optional: enable hashtag linking to instagram
                  phone="sms"
                  // Optional: enable URL linking
                  url
                  style={{
                    paddingLeft: 0,
                    paddingTop: 8,
                    fontSize: 14,
                    color: UIConstants.BLACK_TEXT_COLOR,
                  }}
                />
                {/* Poll Part of the message */}
                <View
                  style={{
                    paddingLeft: 0,
                    paddingTop: 0,
                    borderRadius: 0,
                    flex: 1,
                    flexDirection: "column",
                    backgroundColor: "cyan",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1, width: "100%" }}>
                    {pollOptions.map((pollOption, index) => {
                      /*
                      return (
                        <Checkbox
                          checked={true}
                          onPress={async () => {
                            //setPoll(!poll);
                          }}
                          text={<Text key={index}>{pollOption.message}</Text>}
                        />
                      );
                      */
                      return (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <Text style={{ width: "80%" }} key={index}>
                            {pollOption.message}
                          </Text>
                          <View style={{ flex: 1, width: "20%", alignItems: "flex-end" }}>
                            <Text style={{}} key={index}>
                              {JSON.stringify(pollSummary[pollOption.name].users)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  <MyButtons.FormButton
                    text="Vote"
                    disabled={false}
                    style={{ width: 100, fontSize: 10 }}
                    onPress={() => {
                      dispatch(
                        Actions.openModal({
                          modal: "MESSAGE_POLL_VOTE",
                          messageId: pollMessage.getID(),
                        })
                      );
                    }}
                  />
                </View>
                <DebugText text={JSON.stringify(pollMessage.rootMessage, null, 2)} />
              </View>
            </View>
            <Divider key="divider" style={{}} width={1} color="darkgrey" />
            {/* comments section */}
            <View key="comments" style={{ paddingTop: 10, flex: 1 }}>
              {childMessages.map((message, index) => {
                return (
                  <View key={index} style={{ paddingBottom: 10 }}>
                    <CommentView item={message} user={user} />
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* reply text input section */}
          <View
            style={{
              //height: replyBarHeight,
              height: 50,
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 0,
              //backgroundColor: "cyan",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton key="camera" icon="camera" color={"blue"} size={32} onPress={() => {}} />
            <IconButton
              key="button"
              icon="image"
              color={"blue"}
              backgroundColor="green"
              size={32}
              onPress={() => {}}
            />

            <TextInput
              key="text"
              value={text}
              style={{
                flexGrow: 1,
                backgroundColor: "blue",
                margin: 0,
                paddingTop: 10,
                paddingBottom: 10,
                //paddingLeft: 10,
                textAlign: "left",
                fontSize: 16,
                backgroundColor: "white",
                borderLeftWidth: 1,
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                borderBottomLeftRadius: 5,
              }}
              placeholder={"Reply..."}
              multiline={true}
              autoFocus={false}
              onChangeText={(text) => {
                setText(text);
              }}
            />
            {text != null && text.length > 0 && (
              <IconButton
                key="send"
                icon="arrow-up-circle"
                color={"blue"}
                size={38}
                onPress={() => {
                  sendMessage(text);
                }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </Portal>
    </Modal>
  );
}
