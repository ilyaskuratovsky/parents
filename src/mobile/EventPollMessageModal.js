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

export default function EventPollMessageModal({
  group,
  message,
  user,
  userMap,
  visible,
  closeModal,
}) {
  const dispatch = useDispatch();
  const sortedChildMessages = [...message.children] ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return m1.timestamp - m2.timestamp;
    //return 0;
  });

  const childMessages = sortedChildMessages;
  const sendEventPollReply = useCallback(async (pollResponse, txt) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(user);

    await Controller.sendMessage(
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

  const pollResponseSummary = message.event_poll_response_summary;
  const userPollResponse = message.user_event_poll_responses[user.uid];

  const [text, setText] = useState("");
  const [pollResponse, setPollResponse] = useState(userPollResponse?.event_poll_response ?? []);
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

  const canSend =
    (text != null && text.length > 0) ||
    (pollResponse != null &&
      JSON.stringify(pollResponse) != JSON.stringify(userPollResponse?.event_poll_response ?? []));

  console.log("canSend: " + canSend + ", text: " + text);
  const togglePollResponse = (option) => {
    console.log("toggling poll response: " + JSON.stringify(option));
    const index = pollResponse.findIndex((response) => {
      return response.name == option.name;
    });
    console.log("toggling poll response, index" + index);
    const newPollResponse = [...pollResponse];
    if (index == -1) {
      newPollResponse.push(option);
    } else {
      newPollResponse.splice(index, 1);
    }
    console.log("newPollResponse: " + JSON.stringify(newPollResponse));
    setPollResponse(newPollResponse);
  };

  const [showNewEventModal, setShowNewEventModal] = useState(null);

  return (
    <Modal visible={visible} animationType={"slide"}>
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
          center={null}
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
            {/* parent message */}
            <View
              key="root_message"
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
                {UserInfo.avatarComponent(user)}
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
                      fontSize: 16,
                    }}
                  >
                    {UserInfo.chatDisplayName(user)}
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
                {Globals.dev && <Text>EventPollMessageModal</Text>}
                {Globals.dev && <Text>{message.id}</Text>}
                {Globals.dev && (
                  <View style={{ height: 240 }}>
                    <ScrollView style={{ height: 120 }}>
                      <Text style={{ fontSize: 8 }}>
                        Poll Response Summary
                        {JSON.stringify(pollResponseSummary, null, 2)}
                      </Text>
                    </ScrollView>
                    <ScrollView style={{ height: 120 }}>
                      <Text style={{ fontSize: 8 }}>{JSON.stringify(message, null, 2)}</Text>
                    </ScrollView>
                  </View>
                )}
                <Text
                  //numberOfLines={showMore[item.id] ? null : 4}
                  style={{
                    paddingLeft: 0,
                    fontWeight: "bold",
                    fontSize: 20,
                    color: UIConstants.BLACK_TEXT_COLOR,
                  }}
                >
                  {message.title}
                </Text>
                {Globals.dev && (
                  <Text
                    style={{
                      fontSize: 10,
                    }}
                  >
                    {JSON.stringify(message.event, null, 2)}
                  </Text>
                )}
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
              {/* responses */}
              <View>
                {pollResponseSummary.map((option) => {
                  return (
                    <View style={{ flex: 1, flexDirection: "column" }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          //backgroundColor: "yellow",
                        }}
                      >
                        <Text>
                          {moment(Date.toDate(option.poll_option.startDate)).format("L") +
                            " " +
                            moment(Date.toDate(option.poll_option.startTime)).format("LT") +
                            " - " +
                            moment(Date.toDate(option.poll_option.endTime)).format("LT")}
                        </Text>
                        {message.event_poll.creator === user.uid && (
                          <IconButton
                            style={{
                              flex: 1,
                              //backgroundColor: "purple",
                              margin: 0,
                              alignItems: "flex-end",
                            }}
                            icon="calendar-plus"
                            onPress={() => {
                              setShowNewEventModal({
                                title: message.title,
                                text: message.text,
                                startDate: option.poll_option.startDate,
                                startTime: option.poll_option.startTime,
                                endTime: option.poll_option.endTime,
                              });
                            }}
                          />
                        )}
                      </View>
                      {option.uid_list.length == 0 && (
                        <View style={{ height: 30, justifyContent: "center" }}>
                          <Text
                            style={
                              {
                                //backgroundColor: "yellow",
                              }
                            }
                          >
                            No responses
                          </Text>
                        </View>
                      )}
                      {option.uid_list.length >= 0 && <FacePile userIds={option.uid_list} border />}
                    </View>
                  );
                })}
              </View>
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* comments section */}
            <View
              style={{
                paddingTop: 10,
                //backgroundColor: "cyan",
              }}
            >
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
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                width: "100%",
                //backgroundColor: "yellow",
                flexDirection: "column",
              }}
            >
              {Globals.dev && (
                <ScrollView style={{ height: 150 }}>
                  <Text style={{ fontSize: 8 }}>
                    pollResponseState: {JSON.stringify(pollResponse, null, 2)}
                  </Text>
                </ScrollView>
              )}
              {message.event_poll.creator != user.uid && (
                <>
                  {message.event_poll.options.map((option) => {
                    return (
                      <CheckBox
                        checked={
                          pollResponse.filter((response) => response.name == option.name).length > 0
                        }
                        onPress={() => {
                          togglePollResponse(option);
                        }}
                        style={{ alignSelf: "center" }}
                        title={
                          moment(Date.toDate(option.startDate)).format("L") +
                          " " +
                          moment(Date.toDate(option.startTime)).format("LT") +
                          " - " +
                          moment(Date.toDate(option.endTime)).format("LT")
                        }
                      />
                    );
                  })}
                </>
              )}
            </View>
            <View
              style={{
                height: replyBarHeight,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 0,
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
                placeholder={"Optional Reply..."}
                multiline={true}
                autoFocus={false}
                onChangeText={(text) => {
                  console.log("setting text: " + text);
                  setText(text);
                }}
              />
              {canSend && (
                <IconButton
                  icon="arrow-up-circle"
                  color={"blue"}
                  size={38}
                  onPress={() => {
                    sendEventPollReply(pollResponse, text);
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
          text={showNewEventModal?.text}
          startDate={showNewEventModal?.startDate}
          startTime={showNewEventModal?.startTime}
          endTime={showNewEventModal?.endTime}
          closeModal={(flag) => {
            setShowNewEventModal(null);
          }}
        />
      </Portal>
    </Modal>
  );
}
