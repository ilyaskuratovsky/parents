import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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

function RootApp(props, state) {
  const dispatch = useDispatch();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    Controller.initializeApp(dispatch, notificationListener, responseListener);
  }, []);

  const screenWithParams = useSelector((state) => state.screen.screen);
  const screen = screenWithParams.screen;
  //return <CanvasLineTestWorkingMultilineCircle startX={100} startY={100} />;
  //return <SplashScreen />;
  //return <SlideModalTest />;
  console.log("SCREEN: " + screen);
  if (screen == "SPLASH") {
    return <SplashScreen appInitializedCallback={() => {}} refresh={2200} />;
  } else if (screen === "LOGIN") {
    return <LoginScreen dispatch={dispatch} />;
  } else if (screen === "SIGNUP") {
    return <SignupScreen />;
  } else if (screen === "USER") {
    return <UserScreen />;
  } else if (screen == "INITIAL_SELECT_SCHOOLS") {
    return <InitialChooseSchoolsWizard />;
  } else if (screen == "INITIAL_SELECT_SCHOOL_GROUPS") {
    return <InitialJoinSchoolGroupsScreen />;
  } else if (screen == "GROUPS") {
    return <GroupsScreen />;
  } else if (screen == "GROUP") {
    return <GroupScreen groupId={screenWithParams.groupId} />;
  } else if (screen == "FIND_GROUPS") {
    return <FindGroupsScreen />;
  } else if (screen == "DEBUG") {
    return <DebugScreen backAction={screenWithParams.backAction} />;
  } else {
    return <ErrorScreen />;
  }
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
