import React from "react";
import AppMobile from "./src/mobile/AppMobile";
import AppWeb from "./src/web/AppWeb";

/*
setNativeExceptionHandler((errorString) => {
  //You can do something like call an api to report to dev team here
  // When you call setNativeExceptionHandler, react-native-exception-handler sets a
  // Native Exception Handler popup which supports restart on error in case of android.
  // In case of iOS, it is not possible to restart the app programmatically, so we just show an error popup and close the app.
  // To customize the popup screen take a look at CUSTOMIZATION section.
});
*/

/*
const myErrorHandler = (error, info) => {
  //Database.logError(error, info);
  console.log("error: " + error + ", info: " + JSON.stringify(info));
};
*/

export default function App() {
  if (Platform.OS === "web") {
    return <AppWeb />;
  } else {
    return <AppMobile />;
  }
}
