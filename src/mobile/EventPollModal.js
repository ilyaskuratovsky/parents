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
import NewEventModal from "./NewEventModal";
import * as Utils from "../common/Utils";
import { Divider, CheckBox } from "react-native-elements";
import Checkbox from "./Checkbox";
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
import FacePile from "./FacePile";
import * as Date from "../common/Date";
import * as Data from "../common/Data";
import * as Actions from "../common/Actions";
import * as Debug from "../common/Debug";

export default function EventPollModal({ messageId }) {
  const dispatch = useDispatch();
  const message = Data.getRootMessageWithChildrenAndUserStatus(messageId);
  const group = Data.getGroup(message.groupId);
  const user = Data.getCurrentUser();
  const debugMode = Debug.isDebugMode();

  const sortedChildMessages = [...message.children] ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return m1.timestamp - m2.timestamp;
    //return 0;
  });

  const childMessages = sortedChildMessages;
  const sendEventPollReply = useCallback(async (pollResponse, txt) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    Controller.sendMessage(
      dispatch,
      user,
      group.id,
      null, //title
      txt,
      { event_poll_response: pollResponse },
      message.id,
      {
        groupName,
        fromName,
      }
    );
    scrollViewRef.current.scrollToEnd({ animated: true });
  });
  // send message callback function
  const sendMessage = useCallback(async (text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    Alert.alert("sending message papa_id: " + message.id);
    await Controller.sendReply(dispatch, user, group.id, text, message.id, {
      groupName,
      fromName,
    });
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, []);

  const closeModal = () => {
    dispatch(
      Actions.closeModal({
        modal: "EVENT_POLL",
      })
    );
  };

  const pollResponseSummary = message.event_poll_response_summary;
  const userPollResponse = message.user_event_poll_responses[user.uid];
  const eventPollOptions = [...message.event_poll.options];
  eventPollOptions.push({ name: "__notgoing" });

  const [text, setText] = useState("");
  const [pollResponse, setPollResponse] = useState(userPollResponse ?? {});
  const scrollViewRef = useRef();
  const topBarHeight = 64;
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

  const togglePollResponse = (option) => {
    const newPollResponse = { ...pollResponse };
    const currentPollResponse = pollResponse[option.name];
    const status = currentPollResponse == null ? true : !currentPollResponse.status;
    newPollResponse[option.name] = { status };
    setPollResponse(newPollResponse);
    return newPollResponse;
  };

  const [showNewEventModal, setShowNewEventModal] = useState(null);

  return (
    <Modal visible={true} animationType={"slide"}>
      <Portal>
        {/* top bar */}
        <TopBarMiddleContentSideButtons
          height={topBarHeight}
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
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
          center={<Text style={{ fontWeight: "bold" }}>Event Details</Text>}
          right={null}
        />

        {/* main content */}
        <KeyboardAvoidingView
          style={{
            flex: 1,
            //backgroundColor: "green",
          }}
          behavior="padding"
          keyboardVerticalOffset={40}
          enabled
        >
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            //onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          >
            {/* debug stuff*/}
            {debugMode && <Text>EventPollMessageModal</Text>}
            {debugMode && <Text>{message.id}</Text>}
            {debugMode && (
              <View style={{ height: 240 }}>
                {/*
                <ScrollView style={{ height: 120 }}>
                  <Text style={{ fontSize: 8 }}>
                    Poll Response Summary
                    {JSON.stringify(pollResponseSummary, null, 2)}
                  </Text>
                </ScrollView>
            */}
                <ScrollView style={{ height: 120 }}>
                  <Text style={{ fontSize: 8 }}>{JSON.stringify(message, null, 2)}</Text>
                </ScrollView>
              </View>
            )}
            {debugMode && (
              <Text
                style={{
                  fontSize: 10,
                }}
              >
                {JSON.stringify(message.event, null, 2)}
              </Text>
            )}
            {/* Event Container */}
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
              {/* Event Title */}
              <View
                style={{
                  height: 40,
                  paddingLeft: 0,
                  paddingRight: 10,
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingBottom: 0,
                  //backgroundColor: "yellow",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Event Title</Text>
                <Text style={{ fontSize: 20, color: "black" }}>{message.title}</Text>
              </View>
              <View
                style={{
                  height: 40,
                  paddingLeft: 0,
                  paddingRight: 10,
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingBottom: 0,
                  //backgroundColor: "yellow",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Event Details</Text>
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
              </View>
              <View
                style={{
                  paddingLeft: 0,
                  paddingRight: 10,
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingBottom: 10,
                  //backgroundColor: "yellow",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Created by</Text>
                {UserInfo.tinyAvatarComponentWithName(message.user)}
              </View>
              {/* responses */}
              <View
                style={{
                  flexDirection: "column",
                  //backgroundColor: "yellow",
                  paddingLeft: 0,
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>
                  Date &amp; Time Poll: Choose your preference(s)
                </Text>
                <MyButtons.LinkButton
                  text="Poll Result Details"
                  onPress={() => {
                    onDismiss();
                  }}
                />
                {eventPollOptions.map((option, index) => {
                  return (
                    <View
                      style={{
                        paddingTop: 8,
                        paddingBottom: 4,
                        paddingLeft: 10,
                        backgroundColor: "lightgrey",
                        //marginTop: index == 0 ? 0 : 10,
                        marginBottom: index == 0 ? 4 : 4,
                      }}
                    >
                      <Checkbox
                        checked={pollResponse != null ? pollResponse[option.name]?.status : false}
                        onPress={async () => {
                          const newPollResponse = togglePollResponse(option);
                          await sendEventPollReply(newPollResponse, null);
                        }}
                        text={
                          <Text style={{ fontWeight: "bold" }}>
                            {option.name === "__notgoing"
                              ? "None"
                              : moment(Date.toDate(option.startDate)).format("LLLL") +
                                " - " +
                                moment(Date.toDate(option.endTime)).format("LT")}
                          </Text>
                        }
                      />
                    </View>
                  );
                })}
              </View>
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* comments section */}
            <View style={{ paddingTop: 10, flex: 1 }}>
              {childMessages
                .filter((message) => {
                  return !Utils.isEmptyString(message.text);
                })
                .map((message) => {
                  return (
                    <View style={{ paddingBottom: 10 }}>
                      <CommentView item={message} user={user} />
                    </View>
                  );
                })}
            </View>
          </ScrollView>
          <View
            style={{
              height: replyBarHeight,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              paddingLeft: 0,
              paddingRight: 0,
              paddingBottom: 10,
              flexDirection: "column",
              //backgroundColor: "cyan",
            }}
          >
            <Text style={{ fontSize: 10, color: "grey" }}>Comment</Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TextInput
                value={text}
                style={{
                  flex: 1,
                  backgroundColor: "blue",
                  margin: 0,
                  //paddingLeft: 10,
                  textAlign: "left",
                  fontSize: 16,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: "grey",
                }}
                placeholder={""}
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
          </View>
        </KeyboardAvoidingView>
        <NewEventModal
          userInfo={user}
          group={group}
          visible={showNewEventModal != null}
          allowCreatePoll={false}
          papaId={message.id}
          initialTitle={showNewEventModal?.title}
          initialText={showNewEventModal?.text}
          initialStartDate={showNewEventModal?.startDate}
          initialStartTime={showNewEventModal?.startTime}
          initialEndTime={showNewEventModal?.endTime}
          closeModal={(flag) => {
            setShowNewEventModal(null);
          }}
        />
      </Portal>
    </Modal>
  );
}
