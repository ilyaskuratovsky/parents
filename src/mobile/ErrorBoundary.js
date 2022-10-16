// @flow strict-local

import * as React from "react";

import { Text, View, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import * as Logger from "../common/Logger";
import Toolbar from "./Toolbar";

import * as Database from "../common/Database";

type Props = {};

export default class ErrorBoundary extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    Logger.log("driving state from error: " + error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    Logger.log("logging error: " + error + ", errorInfo" + JSON.stringify(errorInfo));
    //Database.logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      Logger.log("this.state.error: " + this.state.error);

      const errorText = Logger.toString();
      return (
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
          behavior="padding"
          keyboardVerticalOffset={40}
          enabled
        >
          <Text style={{ height: 80 }}>Oops, something went wrong.</Text>
          <TextInput
            style={{ fontSize: 7, flex: 2 }}
            multiline
            numberOfLines={2}
            value={
              this.state.error != null
                ? this.state.error.toString() + JSON.stringify(this.state.error, null, 2)
                : "null"
            }
          />
          <TextInput
            style={{ fontSize: 7, flex: 8, borderWidth: 1, width: "100%" }}
            multiline
            numberOfLines={10}
            value={Logger.flush()}
          />
        </KeyboardAvoidingView>
      );
    }
    return this.props.children;
  }
}
