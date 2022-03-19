import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import * as Controller from "./Controller";
import ErrorScreen from "./ErrorScreen";
import InitialChooseSchoolsWizard from "./InitialChooseSchoolsWizard";
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";
import UserScreen from "./UserScreen";
import SignupScreen from "./SignupScreen";
import InitialJoinSchoolGroupsScreen from "./InitialJoinSchoolGroupsScreen";
import GroupsScreen from "./GroupsScreen";
import GroupScreen from "./GroupScreen";
import FindGroupsScreen from "./FindGroupsScreen";
import SchoolScreen from "./SchoolScreen";
import RDBTest from "./RDBTest";
import LoggedInScreenRouter from "./LoggedInScreenRouter";
import OrgScreen from "./OrgScreen";
import Messages from "./Messages";
import TestThreadView from "./TestThreadView";
import MyProfileScreen from "./MyProfileScreen";
import DebugScreen from "./DebugScreen";
import * as Notifications from "expo-notifications";
import * as Actions from "./Actions";
import PostScreen from "./PostScreen";
import MessageScreen from "./MessageScreen";
import TestErrorHandler from "./TestErrorHandler";
import FlexTest from "./FlexTest";

function RootApp(props, state) {
  //const x = { a: "b" };
  //x.b.c = "z";
  const dispatch = useDispatch();
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useSelector((state) => {
    return state;
  });

  //return <FlexTest />;
  useEffect(async () => {
    try {
      return await Controller.initializeApp(dispatch, notificationListener, responseListener);
    } catch (error) {
      dispatch(Actions.goToScreen({ screen: "ERROR", error }));
    }
  }, []);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    /*
    dispatch(
      Actions.goToScreen({
        screen: "GROUP",
        groupId: "-MyFOw8ypHPOmvARbHAa",
      })
    );
    */
    if (lastNotificationResponse) {
      /*
      alert(
        "lastNotificationResponse.notification: " +
          JSON.stringify(lastNotificationResponse.notification)
      );
      */
      const groupId = lastNotificationResponse.notification?.request?.content?.data?.groupId;
      dispatch(Actions.goToScreen({ screen: "GROUP", groupId }));
    } else {
    }
  }, [lastNotificationResponse]);

  if (!appState.main.appInitialized == "SPLASH") {
    return <SplashScreen appInitializedCallback={() => {}} refresh={2200} />;
  }

  const screenWithParams = useSelector((state) => state.screen.screen);
  let screen = screenWithParams?.screen;

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
    render = <GroupScreen groupId={screenWithParams.groupId} />;
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
    render = <MessageScreen groupId={screenWithParams.groupId} messageId={screenWithParams.messageId} />;
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
    </View>
  );
}

export default RootApp;
