// @flow

import * as Notifications from "expo-notifications";
import React, { useEffect, useRef } from "react";
import { Alert, View, Text, Modal, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as MyButtons from "./MyButtons";

import * as Actions from "../common/Actions";
import type { RootState } from "../common/Actions";
import * as Controller from "../common/Controller";
import DebugScreen from "./DebugScreen";
import ErrorScreen from "./ErrorScreen";
import FindGroupsScreen from "./FindGroupsScreen";
import GroupScreen from "./GroupScreen";
import GroupsScreen from "./GroupsScreen";
import InitialChooseSchoolsWizard from "./InitialChooseSchoolsWizard";
import InitialJoinSchoolGroupsScreen from "./InitialJoinSchoolGroupsScreen";
import LoginScreen from "./LoginScreen";
import Messages from "./Messages";
import MessageScreen from "./MessageScreen";
import MyProfileModal from "./MyProfileModal";
import MyProfileScreen from "./MyProfileScreen";
import OrgScreen from "./OrgScreen";
import PostScreen from "./PostScreen";
import SchoolScreen from "./SchoolScreen";
import SignupScreen from "./SignupScreen";
import SplashScreen from "./SplashScreen";
import FriendsScreen from "./FriendsScreen";
import FeedScreen from "./FeedScreen";
import UserScreen from "./UserScreen";
import TestThreadView from "./TestThreadView";
import * as UserInfo from "../common/UserInfo";
import Loading from "./Loading";
import EventModal from "./EventModal";
import EventPollModal from "./EventPollModal";
import NewEventFromPollModal from "./NewEventFromPollModal";
import * as Globals from "./Globals";
import * as Debug from "../common/Debug";
import NewEventModal from "./NewEventModal2";
import BookCalendarEventModal from "./BookCalendarEventModal";
import Constants from "expo-constants";
import ChatsScreen from "./ChatsScreen";
import ChatModal from "./ChatModal";
import NewChatModal from "./NewChatModal";
import TestImagePicker from "./TestImagePicker";
import TestImagePickerFirebase from "./TestImagePickerFirebase";
import ThreadMessageModal from "./ThreadMessageModal";
import GroupInviteModal from "./GroupInviteModal";
import GroupSettingsModal from "./GroupSettingsModal";
import NewGroupModal from "./NewGroupModal";
import SchoolGroup from "./SchoolScreen";
import MessageModal from "./MessageModal";
import AdminScreen from "./AdminScreen";
import GroupScreenContainer from "./GroupScreenContainer";
import NewPollModal from "./NewPollModal";
import MessagePollModal from "./MessagePollModal";
import MessagePollVoteModal from "./MessagePollVoteModal";
import { DebugTextModal } from "./DebugText";
import * as Logger from "../common/Logger";

/*
App vision:  The local social network for parents.
When join you put in your zip code (we also detect based on gps coordinates)
You get suggested groups of parents that you can join:
Greenwich parents of infants
Greenwich parents of toddlers
North Mianus Elementary Parents

People can also create ephemeral private groups 

Inside the groups you can 
  write a post
  create a calendar invite
  create a poll
  create a sign up (a la signup genius)


*/

function RootApp(props: {}, state) {
  //const x = { a: "b" };
  //x.b.c = "z";
  const dispatch = useDispatch();
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useSelector((state: RootState) => {
    return state;
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Controller.initializeApp(dispatch, notificationListener, responseListener);
      } catch (error) {
        dispatch(Actions.goToScreen({ screen: "ERROR", error }));
      }
    };
    Logger.log("Initializing app (no user) - Start", Logger.INFO);
    initializeApp();
    Logger.log("Initializing app (no user) - End", Logger.INFO);
  }, []);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (lastNotificationResponse) {
      const groupId = lastNotificationResponse.notification?.request?.content?.data?.groupId;
      const messageId = lastNotificationResponse.notification?.request?.content?.data?.messageId;
      if (groupId != null) {
        dispatch(Actions.goToScreen({ screen: "GROUP", groupId, messageId }));
      }
    } else {
    }
  }, [lastNotificationResponse]);

  const screenWithParams = useSelector((state: RootState) => state.screen.screen);
  let screen = screenWithParams?.screen;

  const modalStack = useSelector((state: RootState) => {
    return state.screen?.modalStack;
  });
  const modalWithParams = modalStack.length > 0 ? modalStack[modalStack.length - 1] : null;
  let modal = modalWithParams?.modal;
  Logger.log("modalWithParams: " + JSON.stringify(modalWithParams));
  const debugMode = Debug.isDebugMode();
  Logger.log("RootApp.js:appInitialized: " + appState.main.appInitialized);
  if (!appState.main.appInitialized) {
    if (debugMode) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>app not initialized check for errors</Text>
        </View>
      );
    }
    console.log("returning loading");
    return <Loading />;
  }

  let render = null;
  if (screen === "LOGIN") {
    render = <LoginScreen />;
  } else if (screen === "SIGNUP") {
    render = <SignupScreen />;
  } else if (appState.main.userInfo == null) {
    render = <LoginScreen />;
  } else if (screen === "USER") {
    render = <UserScreen />;
    // } else if (screen == "INITIAL_SELECT_SCHOOLS") {
    //   render = <InitialChooseSchoolsWizard />;
  } else if (screen == "INITIAL_SELECT_SCHOOL_GROUPS") {
    render = <InitialJoinSchoolGroupsScreen />;
  } else if (screen == "GROUPS") {
    render = <GroupsScreen />;
  } else if (screen == "FEED" || screen == null) {
    render = <FeedScreen />;
  } else if (screen == "FRIENDS") {
    render = <FriendsScreen />;
  } else if (screen == "CHATS") {
    render = <ChatsScreen />;
  } else if (screen == "GROUP") {
    render = (
      <GroupScreenContainer
        groupId={screenWithParams["groupId"]}
        messageId={screenWithParams["messageId"]}
      />
    );
  } else if (screen == "FIND_GROUPS") {
    render = <FindGroupsScreen />;
  } else if (screen == "SCHOOL") {
    render = <SchoolScreen schoolId={screenWithParams["schoolId"]} />;
  } else if (screen == "POST") {
    render = <PostScreen messageId={screenWithParams["messageId"]} />;
  } else if (screen == "ORG") {
    render = <OrgScreen orgId={screenWithParams["orgId"]} />;
  } else if (screen == "MY_PROFILE") {
    render = <MyProfileScreen />;
  } else if (screen == "MESSAGE") {
    render = (
      <MessageScreen
        groupId={screenWithParams["groupId"]}
        messageId={screenWithParams["messageId"]}
        onBack={null}
      />
    );
  } else if (screen == "DEBUG") {
    render = <DebugScreen backAction={screenWithParams["backAction"]} />;
  } else if (screen == "ADMIN") {
    render = <AdminScreen />;
  } else if (screen == "ERROR") {
    render = <ErrorScreen error={screenWithParams["error"]} />;
  } else {
    render = <ErrorScreen error={{ message: "No screen" }} />;
  }

  Logger.log(
    "root app rendering: modal: " +
      modal +
      "(" +
      JSON.stringify(modalWithParams, null, 2) +
      "), stack: " +
      JSON.stringify(modalStack, null, 2)
  );
  return (
    <View style={{ flex: 1 }}>
      {render}
      <Messages key="messages" />
      {modal === "MY_PROFILE" && appState.main.userInfo != null && (
        <MyProfileModal visible={true} {...modalWithParams} />
      )}
      {modal === "EVENT" && <EventModal visible={true} {...modalWithParams} />}
      {modal === "EVENT_POLL" && <EventPollModal visible={true} {...modalWithParams} />}
      {modal === "NEW_EVENT_FROM_POLL" && <NewEventFromPollModal {...modalWithParams} />}
      {modal === "NEW_EVENT" && <NewEventModal visible={true} {...modalWithParams} />}
      {modal === "NEW_POLL" && <NewPollModal visible={true} {...modalWithParams} />}
      {modal === "BOOK_IN_CALENDAR" && (
        <BookCalendarEventModal visible={true} {...modalWithParams} />
      )}
      {modal === "NEW_CHAT" && <NewChatModal visible={true} {...modalWithParams} />}
      {modal === "CHAT" && <ChatModal {...modalWithParams} />}
      {modal === "TEST_IMAGE_PICKER" && <TestImagePickerFirebase {...modalWithParams} />}
      {modal === "NEW_POST" && <ThreadMessageModal {...modalWithParams} />}
      {modal === "GROUP_INVITE" && <GroupInviteModal {...modalWithParams} />}
      {modal === "GROUP_SETTINGS" && <GroupSettingsModal {...modalWithParams} />}
      {modal === "NEW_GROUP" && <NewGroupModal {...modalWithParams} />}
      {(modal === "GROUP" || modal == "SCHOOL_GROUP") && (
        <GroupScreenContainer key={modalWithParams["groupId"]} {...modalWithParams} />
      )}
      {modal === "MESSAGES" && <MessageModal {...modalWithParams} />}
      {modal === "MESSAGE_POLL" && <MessagePollModal {...modalWithParams} />}
      {modal === "MESSAGE_POLL_VOTE" && <MessagePollVoteModal {...modalWithParams} />}
      {modal === "DEBUG_TEXT" && <DebugTextModal {...modalWithParams} />}
      {/*modal === "SCHOOL_GROUP" && <SchoolGroup {...modalWithParams} />*/}
      <View style={{ position: "absolute", bottom: 400, right: 0 }}>
        {/*React.memo<{text: string, onPress:()=>void, icon:string, style: string, color: string, badge: string, containerStyle: Object}>*/}
        <MyButtons.MenuButton
          icon="bug"
          color={debugMode ? "red" : "black"}
          text=""
          onPress={() => {
            dispatch(Actions.toggleDebugMode());
            //dispatch(Actions.openModal({ modal: "TEST_IMAGE_PICKER" }));
          }}
        />
      </View>
    </View>
  );
}

export default RootApp;
