import React from "react";
import { Text, View } from "react-native";
import { Provider } from "react-redux";
import RootApp from "./RootApp";
import store from "../common/Actions";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  /*
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootApp />
      </Provider>
    </SafeAreaProvider>
  );
  */
  return (
    <SafeAreaProvider>
      <View style={{ flexDirection: "column" }}>
        <Text>
          This app is not available on the browser. Open the app on your mobile device or download
          it from the app store.
        </Text>
      </View>
    </SafeAreaProvider>
  );
}
