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
//import moment from "moment";
import moment from "moment-timezone";
import JSONTree from "react-native-json-tree";
import Autolink from "react-native-autolink";
import { userInfo } from "../common/Actions";
import * as Debug from "../common/Debug";
import * as Data from "../common/Data";
import * as Actions from "../common/Actions";
import TopBar from "./TopBar";
import { styles } from "./Styles";
import { SquareFacePile } from "../web/FacePile";
import * as ChatMessageData from "../common/ChatMessageData";
type Props = {
  chatId: string,
  scrollToEnd?: boolean,
};

export default function ChatModal({ chatId, scrollToEnd = true }: Props): React.Node {
  const debugMode = Debug.isDebugMode();
  const dispatch = useDispatch();
  const user = Data.getCurrentUser();
  const chat = Data.getChat(chatId);
  const members = Data.getUsers(chat?.participants ?? []);
  const otherMembers = members.filter((u) => u.uid !== user.uid);
  const messages = ChatMessageData.getChat(chatId);

  // send message callback function
  const sendMessage = useCallback(async (text) => {
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    //export async function sendChatMessage(dispatch, userInfo, chatId, text, papaId, notificationInfo) {
    await Controller.sendChatMessage(dispatch, user, chatId, text, null, {
      fromName,
      groupName: null,
      notifactionInfo: null,
    });
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const [text, setText] = useState("");
  const scrollViewRef = useRef();
  const insets = useSafeAreaInsets();
  const topBarHeight = 40;
  const replyBarHeight = 80;

  Data.useMarkChatMessagesRead(childMessages.filter((m) => m.userStatus?.status != "read"));

  // if the the message id is a comment (e.g. this view was opened to a comment, scroll all the way down
  // fix this later to scroll to the specific message
  useEffect(async () => {
    if (scrollToEnd) {
      scrollViewRef.current?.scrollToEnd({ anmiated: true });
    }
  }, []);

  return (
    <Modal visible={true} animationType={"slide"}>
      <Portal
        backgroundColor={UIConstants.DEFAULT_BACKGROUND}
        //backgroundColor="green"
      >
        {debugMode && <Text>ChatModal</Text>}
        {/* top bar */}
        <TopBar
          key="topbar"
          style={{ height: 56 }}
          left={
            <View
              style={{
                //backgroundColor: "cyan",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconButton
                style={{
                  //backgroundColor: "green",
                  padding: 0,
                  margin: 0,
                }}
                icon="chevron-left"
                color={"darkgrey"}
                size={32}
                onPress={() => {
                  dispatch(Actions.closeModal());
                }}
              />
              <View style={{ alignItems: "flex-start", marginRight: 2 }}>
                <SquareFacePile userIds={otherMembers} />
              </View>
              <Text
                style={[
                  {
                    paddingLeft: 2,
                  },
                  styles.topBarHeaderText,
                ]}
              >
                {UserInfo.commaSeparatedChatThread(otherMembers)}
              </Text>
            </View>
          }
          center={<Text>{""}</Text>}
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
              height: replyBarHeight,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 0,
              //backgroundColor: "cyan",
              flexDirection: "row",
            }}
          >
            <TextInput
              value={text}
              style={{
                flex: 1,
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
              placeholder={"Type..."}
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
