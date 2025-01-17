// @flow strict-local
import * as Calendar from "expo-calendar";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
import * as Actions from "../common/Actions";
import * as Debug from "../common/Debug";
import * as Data from "../common/Data";
import DebugText from "./DebugText";
import nullthrows from "nullthrows";
import * as Messages from "../common/MessageData";

type Props = {
  messageId: string,
  scrollToEnd: boolean,
};
export default function MessageModal({ messageId, scrollToEnd }: Props): React.Node {
  const windowWidth = Dimensions.get("window").width;
  const [text, setText] = useState();
  const [textInputHeightChanged, setTextInputHeightChanged] = useState(0);
  const debugMode = Debug.isDebugMode();
  const dispatch = useDispatch();
  const user = Data.getCurrentUser();
  const messageObj = Data.getMessage(messageId);
  const message = nullthrows(
    Messages.getRootMessage(messageId),
    "Message is null for id: " + messageId
  );
  const group = nullthrows(Data.getGroup(message.getGroupId()));

  const sortedChildMessages = [...message.getChildren()] ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return m1.getTimestamp()?.getTime() ?? 0 - (m2.getTimestamp()?.getTime() ?? 0);
  });

  const childMessages = sortedChildMessages;

  // send message callback function
  const sendMessage = useCallback(async (text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    await Controller.sendReply(dispatch, user, group.id, text, message.getID(), {
      groupName,
      fromName,
    });
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  //const [text, setText] = useState("");
  const scrollViewRef = useRef();
  const insets = useSafeAreaInsets();
  const topBarHeight = 40;

  useEffect(() => {
    const markRead = async () => {
      let markRead = [];
      if (message.getUserStatus()?.status != "read") {
        markRead.push(message.getID());
      }
      const unreadChildMessages = (message.getChildren() ?? []).filter(
        (m) => m.getUserStatus()?.status != "read"
      );
      markRead = markRead.concat(unreadChildMessages.map((m) => m.getID()));
      Controller.markMessagesRead(user, markRead);
    };
    markRead();
  }, [message]);

  // if the the message id is a comment (e.g. this view was opened to a comment, scroll all the way down
  // fix this later to scroll to the specific message
  useEffect(() => {
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
        <DebugText text="MessageModal.js" />

        {/* top bar */}
        <TopBarMiddleContentSideButtons
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
          height={100}
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
          <DebugText text={JSON.stringify(messageObj, null, 2)} />
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
                {UserInfo.smallAvatarComponent(message.getUserInfo())}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 20,
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
                    {UserInfo.chatDisplayName(message.getUserInfo())}
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
                  {message.getTitle()}
                </Text>
                {/* the message text */}
                <Autolink
                  // Required: the text to parse for links
                  text={message.getText()}
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
                <DebugText text={JSON.stringify(message, null, 2)} />
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
              paddingLeft: 0,
              paddingRight: 0,
              paddingBottom: 0,
              //backgroundColor: "cyan",
              flexDirection: "row",
              alignItems: "flex-start",
              width: windowWidth,
            }}
          >
            <View
              style={{
                //backgroundColor: "pink",
                width: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => {}}>
                <Icon name="camera" size={36} color="blue" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                //backgroundColor: "lightgreen",
                width: 40,
              }}
            >
              <View
                style={{
                  //backgroundColor: "pink",
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => {}}>
                  <Icon name="image" size={36} color="blue" />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={
                {
                  //backgroundColor: "green"
                }
              }
            >
              <TextInput
                value={text}
                style={{
                  width: windowWidth - 60 - 60,
                  flexWrap: "wrap",
                  //backgroundColor: "blue",
                  margin: 0,
                  paddingTop: textInputHeightChanged <= 1 ? 10 : 0,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingBottom: 0,
                  //paddingLeft: 10,
                  textAlign: "left",
                  fontSize: 14,
                  backgroundColor: "white",
                  // borderLeftWidth: 1,
                  // borderTopWidth: 1,
                  // borderRightWidth: 1,
                  // borderBottomWidth: 1,
                  // borderTopLeftRadius: 5,
                  // borderTopRightRadius: 5,
                  // borderBottomRightRadius: 5,
                  // borderBottomLeftRadius: 5,
                }}
                placeholder={"Reply..."}
                multiline={true}
                autoFocus={false}
                onChangeText={(text) => {
                  setText(text);
                }}
                onLayout={(event) => {
                  console.log("onlayout call: " + event.nativeEvent.height);
                  setTextInputHeightChanged((prev) => prev + 1);
                }}
              />
            </View>
            <View
              style={{
                //backgroundColor: "orange",
                width: 40,
              }}
            >
              <View
                style={{
                  //backgroundColor: "pink",
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    sendMessage(text);
                  }}
                >
                  <Icon name="arrow-up-circle" size={36} color="blue" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Portal>
    </Modal>
  );
}
