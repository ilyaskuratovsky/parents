import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./Actions";
import RootApp from "./RootApp";

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootApp />
      </Provider>
    </SafeAreaProvider>
  );
}
