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
import Checkbox from "./Checkbox";
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
import * as Dates from "../common/Date";
import * as Data from "../common/Data";
import * as Message from "../common/MessageData";
import * as Debug from "../common/Debug";
import * as Actions from "../common/Actions";
import * as Logger from "../common/Logger";
import * as MessageData from "../common/MessageData";
import nullthrows from "nullthrows";
import RootMessage from "../common/MessageData";
import DebugText from "./DebugText";

type Props = {
  messageId: string,
};
export default function EventModalContainer({ messageId }: Props): React.Node {
  const message = nullthrows(
    MessageData.getRootMessage(messageId),
    "EventModalContainer.js: message is null for id: " + messageId
  );
  return <EventModal message={message} />;
}

function EventModal({ message }: { message: RootMessage }) {
  const dispatch = useDispatch();
  const group = nullthrows(Data.getGroup(message.getGroupId()));
  const user = Data.getCurrentUser();

  const sortedChildMessages = [...message.getChildren()] ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return (m1.getTimestamp()?.getTime() ?? 0) - (m2.getTimestamp()?.getTime() ?? 0);
    //return 0;
  });

  const event = nullthrows(message.getEvent());
  const eventStart = Dates.toDate(event?.start);
  const eventEnd = Dates.toDate(event?.end);

  const childMessages = sortedChildMessages;
  let currentUserStatus = null;
  const currentUserStatusArr: Array<RootMessage> = childMessages.filter((m) => {
    return m.getUserInfo()?.uid == user.uid && !Utils.isEmptyString(m.getEventResponse());
  });
  if (currentUserStatusArr.length > 0) {
    currentUserStatus = currentUserStatusArr[currentUserStatusArr.length - 1].getEventResponse();
  }

  const sendEventReply = useCallback(async (eventResponse, text) => {
    const groupName = group?.name;
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    await Controller.sendMessage(
      dispatch,
      user,
      group?.id,
      null, //title
      text,
      { eventResponse },
      message.getID(),
      {
        groupName,
        fromName,
      }
    );
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
          onPress: () => Logger.log("Cancel Pressed"),
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

  Controller.useMarkRead(message.getID());

  Logger.log(
    "event response is empty string: " + (Utils.isEmptyString(eventResponse) ? "true" : "false")
  );
  const canSend =
    (text != null && text.length > 0) ||
    (!Utils.isEmptyString(eventResponse) && eventResponse != currentUserStatus);

  const eventSummary = message.getEventSummary();
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
                dispatch(Actions.closeModal());
              }}
              color="black"
            />
          }
          center={<Text>Event Details</Text>}
          right={null}
        />
        <DebugText text="EventModal.js" />
        <DebugText
          text={JSON.stringify(
            { rootMessage: message.rootMessage, children: message.children },
            null,
            2
          )}
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
                <Text style={{ fontSize: 20, color: "black" }}>{message.getTitle()}</Text>
              </View>
              <View
                style={{
                  paddingLeft: 0,
                  paddingRight: 10,
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingBottom: 0,
                  //backgroundColor: "cyan",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Event Date &amp; Time</Text>
              </View>
              {/* date section */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  //backgroundColor: "green",
                  marginBottom: 0,
                }}
              >
                <View
                  style={{
                    width: 40,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      alignItems: "center",
                      color: "grey",
                    }}
                  >
                    Date:
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    marginRight: 10,
                    //backgroundColor: "green",
                    alignItems: "flex-start",
                  }}
                >
                  {/* start date */}
                  <View
                    style={{
                      //backgroundColor: "white",
                      borderColor: "grey",
                      borderRadius: 20,
                      //borderWidth: 1,
                      paddingLeft: 10,
                      paddingRight: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        alignItems: "center",
                      }}
                    >
                      {event?.start != null ? moment(event.start).format("dddd, MMMM Do YYYY") : ""}
                    </Text>
                  </View>
                </View>
              </View>
              {/* time start/end section */}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  //backgroundColor: "orange",
                }}
              >
                <View
                  style={{
                    width: 40,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: "grey",
                      alignItems: "center",
                    }}
                  >
                    Time Start:
                  </Text>
                </View>
                <View
                  style={{
                    width: 80,
                    marginRight: 10,
                  }}
                >
                  {/* start time to */}
                  <View
                    style={{
                      borderColor: "grey",
                      borderRadius: 20,
                      //borderWidth: 1,
                      paddingLeft: 10,
                      paddingRight: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        alignItems: "center",
                      }}
                    >
                      {event?.start != null ? moment(event.start).format("LT") : ""}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 40,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: "grey",
                      alignItems: "center",
                    }}
                  >
                    Time End:
                  </Text>
                </View>
                <View
                  style={{
                    width: 80,
                  }}
                >
                  {/* end time to */}
                  <View
                    style={{
                      borderColor: "grey",
                      borderRadius: 20,
                      //borderWidth: 1,
                      paddingLeft: 10,
                      paddingRight: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        alignItems: "center",
                      }}
                    >
                      {event.end != null ? moment(event.end).format("LT") : ""}
                    </Text>
                  </View>
                </View>
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
              </View>
              <View
                style={{
                  paddingLeft: 0,
                  paddingRight: 10,
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingBottom: 0,
                  //backgroundColor: "yellow",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Created by</Text>
                {UserInfo.tinyAvatarComponentWithName(message.getUserInfo())}
              </View>
              <View
                style={{
                  paddingLeft: 0,
                  paddingTop: 0,
                  borderRadius: 0,
                }}
              >
                {Globals.dev && <Text>EventMessageModal</Text>}
                {Globals.dev && <Text>{message.getID()}</Text>}
                {Globals.dev && (
                  <ScrollView style={{ height: 200 }}>
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
              </View>
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* reply section */}
            <View
              style={{
                flex: 1,
                paddingLeft: 10,
                paddingRight: 10,
                //backgroundColor: "cyan"
              }}
            >
              <View>
                <Text>RSVP</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  //backgroundColor: "yellow",
                }}
              >
                <Checkbox
                  checked={eventResponse === "Going"}
                  onPress={async () => {
                    setEventResponse("Going");
                  }}
                  text={
                    <Text style={{ fontWeight: "normal", fontSize: 12, color: "grey" }}>Going</Text>
                  }
                />
                <Checkbox
                  checked={eventResponse === "Not Going"}
                  onPress={async () => {
                    setEventResponse("Not Going");
                  }}
                  text={
                    <Text style={{ fontWeight: "normal", fontSize: 12, color: "grey" }}>
                      Not Going
                    </Text>
                  }
                />
                <Checkbox
                  checked={eventResponse === "Maybe"}
                  onPress={async () => {
                    setEventResponse("Maybe");
                  }}
                  text={
                    <Text style={{ fontWeight: "normal", fontSize: 12, color: "grey" }}>Maybe</Text>
                  }
                />
              </View>
              <View
                style={{
                  height: replyBarHeight,
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingBottom: 0,
                  flexDirection: "column",
                  //backgroundColor: "cyan",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Comments</Text>
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
              </View>
            </View>
            {/* button */}
            <View
              style={{
                //backgroundColor: "cyan",
                height: 60,
                width: "100%",
                alignItems: "flex-end",
                paddingTop: 10,
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  width: 180,
                  alignItems: "flex-end",
                }}
              >
                <MyButtons.FormButton
                  text="Confirm"
                  onPress={async () => {
                    await sendEventReply(eventResponse, text);
                  }}
                />
              </View>
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* Other user responses */}
            <Text style={{ fontSize: 10, color: "grey" }}>Going</Text>
            {eventSummary?.acceptedResponses.map((response) => {
              return (
                <View style={{ flexDirection: "column" }}>
                  {UserInfo.smallAvatarComponentWithName(message.getUserInfo())}
                  <Text>{response.getText()}</Text>
                </View>
              );
            })}
            <Text style={{ fontSize: 10, color: "grey" }}>Not Going</Text>
            {eventSummary?.declinedResponses.map((response) => {
              return (
                <View style={{ flexDirection: "column" }}>
                  {UserInfo.smallAvatarComponentWithName(message.getUserInfo())}
                  <Text>{response.getText()}</Text>
                </View>
              );
            })}
            <Text style={{ fontSize: 10, color: "grey" }}>Maybe</Text>
            {eventSummary?.maybeResponses.map((response) => {
              return (
                <View style={{ flexDirection: "column" }}>
                  {UserInfo.smallAvatarComponentWithName(message.getUserInfo())}
                  <Text>{response.getText()}</Text>
                </View>
              );
            })}

            {/* comments section */}
            {/*
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
            */}
          </ScrollView>
        </KeyboardAvoidingView>
      </Portal>
      {showCalendarSelection && (
        <BookCalendarEventModal
          key="BookCalendarEventModal"
          title={message.getTitle()}
          startDate={eventStart}
          endDate={eventEnd}
          onComplete={() => {
            setShowCalendarSelection(false);
          }}
          visible={showCalendarSelection}
          onDismiss={() => {
            setShowCalendarSelection(false);
          }}
        />
      )}
    </Modal>
  );
}
