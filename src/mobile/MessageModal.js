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
import * as Debug from "../common/Debug";

export default function MessageModal({
  user,
  group,
  message,
  scrollToEnd,
  visible,
  closeModal,
  userMap,
}) {
  const debugMode = Debug.isDebugMode();
  const dispatch = useDispatch();
  const sortedChildMessages = [...message.children] ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return m1.timestamp - m2.timestamp;
    //return 0;
  });

  const childMessages = sortedChildMessages;

  // send message callback function
  const sendMessage = useCallback(async (text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    await Controller.sendReply(dispatch, user, group.id, text, message.id, {
      groupName,
      fromName,
    });
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, []);

  const [text, setText] = useState("");
  const scrollViewRef = useRef();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height - insets.top - insets.bottom;
  const topBarHeight = 40;
  const replyBarHeight = 80;

  useEffect(async () => {
    let markRead = [];
    if (message.status != "read") {
      markRead.push(message.id);
    }
    const unreadChildMessages = (message.children ?? []).filter((m) => m.status != "read");
    markRead = markRead.concat(unreadChildMessages.map((m) => m.id));
    Controller.markMessagesRead(user, markRead);
  }, [message]);

  // if the the message id is a comment (e.g. this view was opened to a comment, scroll all the way down
  // fix this later to scroll to the specific message
  useEffect(async () => {
    if (scrollToEnd) {
      scrollViewRef.current.scrollToEnd({ anmiated: true });
    }
  }, []);

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal
        backgroundColor={UIConstants.DEFAULT_BACKGROUND}
        //backgroundColor="green"
      >
        {debugMode && <Text>MessageModal</Text>}
        {/* top bar */}
        <TopBarMiddleContentSideButtons
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
          height={topBarHeight}
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                closeModal();
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
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            onContentSizeChange={() => {
              //scrollViewRef.current.scrollToEnd({ animated: true });
            }}
          >
            {/* parent message */}
            <View
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
                style={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 6,
                }}
              >
                {UserInfo.smallAvatarComponent(message.user)}
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
                    {UserInfo.chatDisplayName(message.user)}
                  </Text>
                </View>
              </View>
              <View
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
                  {message.title}
                </Text>
                {/* the message text */}
                <Autolink
                  // Required: the text to parse for links
                  text={message.text}
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
                {Globals.dev && (
                  <Text style={{ fontSize: 8 }}>{JSON.stringify(message, null, 2)}</Text>
                )}
              </View>
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* comments section */}
            <View style={{ paddingTop: 10, flex: 1 }}>
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
            <IconButton
              icon="camera"
              color={"blue"}
              size={32}
              onPress={() => {
                sendEventReply(eventResponse, text);
              }}
            />
            <IconButton
              icon="image"
              color={"blue"}
              backgroundColor="green"
              size={32}
              onPress={() => {
                sendEventReply(eventResponse, text);
              }}
            />

            <TextInput
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
