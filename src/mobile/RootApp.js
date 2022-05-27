import * as Notifications from "expo-notifications";
import React, { useEffect, useRef } from "react";
import { Alert, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
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
import UserScreen from "./UserScreen";
import TestThreadView from "./TestThreadView";
import * as UserInfo from "../common/UserInfo";
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

function RootApp(props, state) {
  //const x = { a: "b" };
  //x.b.c = "z";
  const dispatch = useDispatch();
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useSelector((state) => {
    return state;
  });

  useEffect(async () => {
    try {
      return await Controller.initializeApp(dispatch, notificationListener, responseListener);
    } catch (error) {
      dispatch(Actions.goToScreen({ screen: "ERROR", error }));
    }
  }, []);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (lastNotificationResponse) {
      const groupId = lastNotificationResponse.notification?.request?.content?.data?.groupId;
      const messageId = lastNotificationResponse.notification?.request?.content?.data?.messageId;
      //Alert.alert("last notification response: " + groupId + ", " + messageId);
      if (groupId != null) {
        dispatch(Actions.goToScreen({ screen: "GROUP", groupId, messageId }));
      }
    } else {
    }
  }, [lastNotificationResponse]);

  if (!appState.main.appInitialized == "SPLASH") {
    return <SplashScreen appInitializedCallback={() => {}} refresh={2200} />;
  }

  const screenWithParams = useSelector((state) => state.screen.screen);
  let screen = screenWithParams?.screen;

  const modalWithParams = useSelector((state) => {
    return state.screen?.modal;
  });
  let modal = modalWithParams?.modal;
  console.log("modalWithParams: " + JSON.stringify(modalWithParams));

  //return <TestThreadView />;
  if (screen === "LOGIN") {
    return <LoginScreen dispatch={dispatch} />;
  } else if (screen === "SIGNUP") {
    return <SignupScreen />;
  }

  if (appState.main.userInfo == null) {
    return <LoginScreen />;
  }

  let render = null;
  if (screen === "USER") {
    render = <UserScreen />;
  } else if (screen == "INITIAL_SELECT_SCHOOLS") {
    render = <InitialChooseSchoolsWizard />;
  } else if (screen == "INITIAL_SELECT_SCHOOL_GROUPS") {
    render = <InitialJoinSchoolGroupsScreen />;
  } else if (screen == "GROUPS" || screen == null) {
    render = <GroupsScreen />;
  } else if (screen == "GROUP") {
    render = (
      <GroupScreen
        groupId={screenWithParams.groupId}
        messageId={screenWithParams.messageId}
        //messageId={"u0A2kEIkHIrBnqbrtNZv"}
        debug={JSON.stringify(screenWithParams)}
      />
    );
  } else if (screen == "FIND_GROUPS") {
    render = <FindGroupsScreen />;
  } else if (screen == "SCHOOL") {
    render = <SchoolScreen schoolId={screenWithParams.schoolId} />;
  } else if (screen == "POST") {
    render = <PostScreen messageId={screenWithParams.messageId} />;
  } else if (screen == "ORG") {
    render = <OrgScreen orgId={screenWithParams.orgId} />;
  } else if (screen == "MY_PROFILE") {
    render = <MyProfileScreen />;
  } else if (screen == "MESSAGE") {
    render = (
      <MessageScreen groupId={screenWithParams.groupId} messageId={screenWithParams.messageId} />
    );
  } else if (screen == "DEBUG") {
    render = <DebugScreen backAction={screenWithParams.backAction} />;
  } else if (screen == "ERROR") {
    render = <ErrorScreen error={screenWithParams.error} />;
  } else {
    render = <ErrorScreen error={{ message: "No screen" }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {render}
      <Messages key="messages" />
      <MyProfileModal visible={modal === "MY_PROFILE"} {...modalWithParams} />
    </View>
  );
}

export default RootApp;
