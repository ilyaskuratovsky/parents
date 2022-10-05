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
import { Divider } from "react-native-elements";
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
import * as Debug from "../common/Debug";

export default function MessagesContainer({ groupId, messageId, visible, closeModal }) {
  const user = useSelector((state) => state.main.userInfo);
  const { userMap } = useSelector((state) => {
    return {
      userMap: state.main.userMap,
    };
  });
  const message = Data.getMessage(messageId);
  Logger.log("built message with children: " + message.id);
  const group = Data.getGroup(groupId);
  if (message.event == null) {
    return (
      <MessageModal
        user={user}
        group={group}
        message={message}
        visible={visible}
        closeModal={closeModal}
      />
    );
  } else {
    return (
      <EventMessageModal
        user={user}
        group={group}
        message={message}
        visible={visible}
        closeModal={closeModal}
      />
    );
  }
}

function MessageModal({ user, group, message, visible, closeModal }) {
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

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal
        backgroundColor={UIConstants.DEFAULT_BACKGROUND}
        //backgroundColor="green"
      >
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
                {UserInfo.smallAvatarComponent(user)}
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
                <Text
                  //numberOfLines={showMore[item.id] ? null : 4}
                  style={{
                    paddingLeft: 0,
                    paddingTop: 8,
                    fontSize: 14,
                    color: UIConstants.BLACK_TEXT_COLOR,
                  }}
                >
                  {message.text}
                </Text>
                {Globals.dev && <Text style={{ fontSize: 8 }}>{JSON.stringify(message)}</Text>}
              </View>
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* comments section */}
            <View style={{ paddingTop: 10, flex: 1 }}>
              {childMessages.map((message) => {
                return (
                  <View style={{ paddingBottom: 10 }}>
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

function EventMessageModal({ group, message, user, userMap, visible, closeModal }) {
  const dispatch = useDispatch();
  const sortedChildMessages = [...message.children] ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return m1.timestamp - m2.timestamp;
    //return 0;
  });

  const childMessages = sortedChildMessages.map((message) => {
    const user = userMap[message.uid];
    return {
      ...message,
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.uid,
        name: UserInfo.chatDisplayName(user),
        avatarColor: UserInfo.avatarColor(user),
      },
    };
  });

  const sendEventReply = useCallback(async (status, text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    await Controller.sendEventReply(dispatch, user, group.id, status, text, message.id, {
      groupName,
      fromName,
    });
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, []);

  const [text, setText] = useState("");
  const [calendar, setCalendar] = useState(null);
  const [calendars, setCalendars] = useState(null);
  const [showCalendarSelection, setShowCalendarSelection] = useState(false);
  const scrollViewRef = useRef();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height - insets.top - insets.bottom;
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

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal>
        {/* top bar */}
        <TopBarMiddleContentSideButtons
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
                <Text
                  //numberOfLines={showMore[item.id] ? null : 4}
                  style={{
                    paddingLeft: 0,
                    fontSize: 18,
                  }}
                >
                  {message.text}
                </Text>
              </View>
              {/* accept/decline bar */}
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly" }}>
                <TouchableOpacity
                  onPress={() => {
                    sendEventReply("accept", null);
                    Alert.alert("Book in Calendar?", null, [
                      {
                        text: "Yes",
                        onPress: async () => {
                          const { status } = await Calendar.requestCalendarPermissionsAsync();
                          if (status === "granted") {
                            const calendars = await Calendar.getCalendarsAsync(
                              Calendar.EntityTypes.EVENT
                            );
                            //alert("Here are all your calendars:" + JSON.stringify(calendars));
                            setCalendars(calendars);
                            //alert("calendar[0]:" + JSON.stringify(calendars[0]));
                            //setCalendar(calendars[0]);
                            setShowCalendarSelection(true);
                          }
                        },
                      },
                      {
                        text: "No",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                    ]);
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
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* comments section */}
            <View style={{ flex: 1, marginTop: 10, backgroundColor: "cyan" }}>
              {childMessages.map((message) => {
                return <CommentView item={message} user={user} />;
              })}
            </View>
          </ScrollView>
          {/* reply text input section */}
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

      {showCalendarSelection && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <SafeAreaView>
            <ScrollView style={{ height: 200, backgroundColor: "cyan" }}>
              {(calendars ?? []).map((calendar) => {
                return (
                  <Button
                    disabled={calendar == null}
                    title={
                      "Choose " +
                      (calendar?.title ?? "null") +
                      "[" +
                      (calendar?.source.name ?? "null") +
                      "]"
                    }
                    onPress={() => {
                      createEvent(calendar).then((eventId) => {
                        setShowCalendarSelection(false);
                      });
                    }}
                  />
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      )}
    </Modal>
  );
}

async function createEvent(calendar) {
  let dateMs = Date.parse("2022-04-11");
  let startDate = new Date(dateMs);
  let endDate = new Date(dateMs + 2 * 60 * 60 * 1000);

  Calendar.createEventAsync(calendar?.id, {
    title: "ilya test 3",
    startDate: startDate,
    endDate: endDate,
    timeZone: "America/New_York",
    location: "Ilya's Bedroom",
  }).then((eventId) => {
    Logger.log("booked: " + eventId);
    return eventId;
  });
  // console.log(`calendar ID is: ${id}`)
}
