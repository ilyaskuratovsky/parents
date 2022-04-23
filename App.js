import { Provider } from "react-redux";

import { collection, doc, setDoc } from "firebase/firestore/lite";

import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Text } from "react-native";
import { db } from "./config/firebase";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import store from "./Actions";
import RootApp from "./RootApp";
import * as Notifications from "expo-notifications";
import * as Actions from "./Actions";
//import ErrorBoundary from "./ErrorBoundary";

import { Alert } from "react-native";
import RNRestart from "react-native-restart";
import { setJSExceptionHandler, setNativeExceptionHandler } from "react-native-exception-handler";
import { ErrorBoundary } from "react-error-boundary";
import ErrorScreen from "./ErrorScreen";
import * as Database from "./Database";

/*
setNativeExceptionHandler((errorString) => {
  //You can do something like call an api to report to dev team here
  // When you call setNativeExceptionHandler, react-native-exception-handler sets a
  // Native Exception Handler popup which supports restart on error in case of android.
  // In case of iOS, it is not possible to restart the app programmatically, so we just show an error popup and close the app.
  // To customize the popup screen take a look at CUSTOMIZATION section.
});
*/

const myErrorHandler = (error, info) => {
  //Database.logError(error, info);
  console.log("error: " + error + ", info: " + JSON.stringify(info));
};

//foreground notifications settings
//alert('setting notification handler');
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  /*
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        return <ErrorScreen error={error} resetErrorBoundary={resetErrorBoundary} />;
      }}
      onError={myErrorHandler}
    >
      <SafeAreaProvider>
        <Provider store={store}>
          <RootApp />
        </Provider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
  */
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootApp />
      </Provider>
    </SafeAreaProvider>
  );
}
