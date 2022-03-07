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

function RootApp(props, state) {
  const dispatch = useDispatch();
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useSelector((state) => {
    return state;
  });

  //return <TestThreadView />;
  useEffect(() => {
    Controller.initializeApp(dispatch, notificationListener, responseListener);
  }, []);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (lastNotificationResponse) {
      alert(
        "lastNotificationResponse: " + JSON.stringify(lastNotificationResponse)
      );
      dispatch(Actions.goToScreen({ screen: "GROUP", groupId: group.id }));
    } else {
      alert("lastNotificationResponse: " + JSON.stringify(null));
    }
  }, []);

  const screenWithParams = useSelector((state) => state.screen.screen);
  let screen = screenWithParams.screen;
  //return <CanvasLineTestWorkingMultilineCircle startX={100} startY={100} />;
  //return <SplashScreen />;
  //return <TestChat />;

  let render = null;

  if (screen == "SPLASH") {
    render = <SplashScreen appInitializedCallback={() => {}} refresh={2200} />;
  } else if (screen === "LOGIN") {
    render = <LoginScreen dispatch={dispatch} />;
  } else if (screen === "SIGNUP") {
    render = <SignupScreen />;
  } else if (screen === "USER") {
    render = <UserScreen />;
  } else if (screen == "INITIAL_SELECT_SCHOOLS") {
    render = <InitialChooseSchoolsWizard />;
  } else if (screen == "INITIAL_SELECT_SCHOOL_GROUPS") {
    render = <InitialJoinSchoolGroupsScreen />;
  } else if (screen == "GROUPS") {
    render = <GroupsScreen />;
  } else if (screen == "GROUP") {
    render = <GroupScreen groupId={screenWithParams.groupId} />;
  } else if (screen == "FIND_GROUPS") {
    render = <FindGroupsScreen />;
  } else if (screen == "SCHOOL") {
    render = <SchoolScreen schoolId={screenWithParams.schoolId} />;
  } else if (screen == "ORG") {
    render = <OrgScreen orgId={screenWithParams.orgId} />;
  } else if (screen == "MY_PROFILE") {
    render = <MyProfileScreen />;
  } else if (screen == "DEBUG") {
    render = <DebugScreen backAction={screenWithParams.backAction} />;
  } else {
    render = <ErrorScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {render}
      <Messages key="messages" />
    </View>
  );
}

export default RootApp;

/*
import React, { useState, createContext, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from "react-native";
import * as FirebaseAuth from "firebase/auth";
import * as Controller from "./Controller";
import { auth } from "./config/firebase";
import { useDispatch, useSelector } from "react-redux";

import {
  AuthenticatedUserProvider,
  AuthenticatedUserContext,
} from "./AuthenticatedUserContext";

import Login from "./Login";
import Signup from "./Signup";
import Chat from "./Chat";
import ProfileScreen from "./ProfileScreen";
import { Provider } from "react-redux";
import store from "./Actions";

const Stack = createStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const dispatch = useDispatch();
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = FirebaseAuth.onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        if (authenticatedUser != null) {
          Controller.loggedIn(dispatch, navigation, authenticatedUser);
          setUser(authenticatedUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    </Provider>
  );
}

*/
