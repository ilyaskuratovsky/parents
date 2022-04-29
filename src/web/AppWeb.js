import React from "react";
import { Text } from "react-native";
import { Provider } from "react-redux";
import RootApp from "./RootApp";
import store from "../common/Actions";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootApp />
      </Provider>
    </SafeAreaProvider>
  );
}
