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

export default function EventMessageModal({ group, message, user, userMap, visible, closeModal }) {
  const dispatch = useDispatch();
  const sortedChildMessages = [...message.children] ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return m1.timestamp - m2.timestamp;
    //return 0;
  });

  const event = message.event;
  const eventStartDate = moment
    .tz(event.date + " " + event.startTime, "YYYYMMDD HH:mm", event.timezone)
    .utc()
    .toDate();
  const eventEndDate = moment
    .tz(event.date + " " + event.endTime, "YYYYMMDD HH:mm", event.timezone)
    .utc()
    .toDate();
  //const eventStartDate = moment.tz("2022-05-07 19:00", "America/New_York").utc().toDate();
  //const eventEndDate = moment.tz("2022-05-07 19:00", "America/New_York").utc().toDate();

  const childMessages = sortedChildMessages;
  let currentUserStatus = null;
  const currentUserStatusArr = childMessages.filter((m) => {
    console.log(
      "userInfo.uid: " +
        user.uid +
        ", m.uid: " +
        m.uid +
        ", m.event.eventResponse: " +
        m.event.eventResponse
    );
    return m.uid == user.uid && !Utils.isEmptyString(m.event?.eventResponse);
  });
  console.log(
    "currentUserSTatusArr: " +
      JSON.stringify(currentUserStatusArr) +
      ", childMessages: " +
      JSON.stringify(childMessages)
  );
  if (currentUserStatusArr.length > 0) {
    currentUserStatus = currentUserStatusArr[currentUserStatusArr.length - 1].event?.eventResponse;
  }
  console.log("currentUserStatus: " + currentUserStatus);

  const sendEventReply = useCallback(async (eventResponse, text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    await Controller.sendEventReply(dispatch, user, group.id, eventResponse, text, message.id, {
      groupName,
      fromName,
    });
    scrollViewRef.current.scrollToEnd({ animated: true });

    if (eventResponse === "Going" && currentUserStatus != "Going") {
      Alert.alert("Book in Calendar?", null, [
        {
          text: "Yes",
          onPress: () => {
            setShowCalendarSelection(true);
          },
        },
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
    }
  }, []);

  const [text, setText] = useState("");
  const [eventResponse, setEventResponse] = useState(currentUserStatus);
  const [showCalendarSelection, setShowCalendarSelection] = useState(false);
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

  console.log("event response is empty string: " + Utils.isEmptyString(eventResponse));
  const canSend =
    (text != null && text.length > 0) ||
    (!Utils.isEmptyString(eventResponse) && eventResponse != currentUserStatus);
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
                {Globals.dev && <Text>{message.id}</Text>}
                {Globals.dev && (
                  <ScrollView style={{ height: 80 }}>
                    {/*
                    <JSONTree
                      data={message}
                      labelRenderer={(raw) => (
                        <Text style={{ fontSize: 8, fontWeight: "bold" }}>{raw}</Text>
                      )}
                      valueRenderer={(raw) => (
                        <Text style={{ fontSize: 8, fontWeight: "bold" }}>{raw}</Text>
                      )}
                    />
                      */}

                    <Text style={{ fontSize: 8 }}>{JSON.stringify(message, null, 2)}</Text>
                  </ScrollView>
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
              {/* accept/decline bar */}
              {/*
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
                <TouchableOpacity
                  onPress={() => {
                    sendEventReply("accept", null);
                  }}
                >
                  {(message.event.users ?? {})[user.uid]?.status === "accept" && (
                    <Text style={{ backgroundColor: "green" }}>Going</Text>
                  )}
                  {(message.event.users ?? {})[user.uid]?.status != "accept" && <Text>Going</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    sendEventReply("decline", null);
                  }}
                >
                  <Text>Not Going</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    sendEventReply("tentative", null);
                  }}
                >
                  <Text>Don't Know Yet</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text>...</Text>
                </TouchableOpacity>
              </View>
                */}
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* comments section */}
            <View
              style={{
                flex: 1,
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
              height: replyBarHeight + 60,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <CheckBox
                checked={eventResponse === "Going"}
                onPress={() => {
                  const response = "Going";
                  if (eventResponse != response) {
                    setEventResponse(response);
                  } else {
                    setEventResponse("");
                  }
                }}
                style={{ alignSelf: "center" }}
                title="Going"
              />
              <CheckBox
                checked={eventResponse === "Not Going"}
                onPress={() => {
                  const response = "Not Going";
                  if (eventResponse != response) {
                    setEventResponse(response);
                  } else {
                    setEventResponse("");
                  }
                }}
                style={{ alignSelf: "center" }}
                title="Not Going"
              />
              <CheckBox
                checked={eventResponse === "Maybe"}
                onPress={() => {
                  const response = "Maybe";
                  if (eventResponse != response) {
                    setEventResponse(response);
                  } else {
                    setEventResponse("");
                  }
                }}
                style={{ alignSelf: "center" }}
                title="Maybe"
              />
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
                  setText(text);
                }}
              />
              {canSend && (
                <IconButton
                  icon="arrow-up-circle"
                  color={"blue"}
                  size={38}
                  onPress={() => {
                    sendEventReply(eventResponse, text);
                  }}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Portal>

      <BookCalendarEventModal
        key="BookCalendarEventModal"
        title={message.title}
        startDate={eventStartDate}
        endDate={eventEndDate}
        onComplete={() => {
          setShowCalendarSelection(false);
        }}
        visible={showCalendarSelection}
        onDismiss={() => {
          setShowCalendarSelection(false);
        }}
      />
    </Modal>
  );
}
