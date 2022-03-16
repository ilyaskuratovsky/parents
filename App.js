import { Provider } from "react-redux";

import { collection, doc, setDoc } from "firebase/firestore/lite";

import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Text } from "react-native";
import { db } from "./config/firebase";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import store from "./Actions";
import RootApp from "./RootApp";
import * as Notifications from "expo-notifications";
import * as Actions from "./Actions";
//import ErrorBoundary from "./ErrorBoundary";

import { Alert } from "react-native";
import RNRestart from "react-native-restart";
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from "react-native-exception-handler";
import { ErrorBoundary } from "react-error-boundary";
import ErrorScreen from "./ErrorScreen";

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
  alert(
    "Unexpected error occurred: " +
      `Error: ${error.name} ${error.message}
        We will need to restart the app. ${JSON.stringify(
          error
        )} || ${JSON.stringify(info)}
        `,
    [
      {
        text: "Restart",
        onPress: () => {
          RNRestart.Restart();
        },
      },
    ]
  );
  console.log("erorr handosijdfojsodf ij");
};

export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        return (
          <ErrorScreen error={error} resetErrorBoundary={resetErrorBoundary} />
        );
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
}
