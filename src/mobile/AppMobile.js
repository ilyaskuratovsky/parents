// @flow

import * as Notifications from "expo-notifications";
import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import RootApp from "./RootApp";
import { store } from "../common/Actions";
import { setNativeExceptionHandler } from "react-native-exception-handler";
//import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundary from "./ErrorBoundary";
import ErrorScreen from "./ErrorScreen";
import * as Database from "../common/Database";
import * as Logger from "../common/Logger";
import * as Device from "expo-device";
import MessageTest from "./test/MessageTest";
/*
setNativeExceptionHandler((errorString) => {
  //You can do something like call an api to report to dev team here
  // When you call setNativeExceptionHandler, rea ct-native-exception-handler sets a
  // Native Exception Handler popup which supports πrestart on error in case of android.
  // In case of iOS, it is not possible to restart the app programmatically, so we just show an error popup and close the app.
  // To customize the popup screen take a look at CUSTOMIZATION section.
});

*/

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

/*
const myErrorHandler = (error, info) => {
  Logger.log("logging error to database");
  Database.logError(error, info);
  Logger.log("error: " + error + ", info: " + JSON.stringify(info));
};
*/

export default function App(): React.Node {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        {/*<ErrorBoundary>*/}
        <RootApp />
        {/*<MessageTest />*/}
        {/*</ErrorBoundary>*/}
      </Provider>
    </SafeAreaProvider>
  );

  /*
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootApp />
      </Provider>
    </SafeAreaProvider>
  );
  */
}
