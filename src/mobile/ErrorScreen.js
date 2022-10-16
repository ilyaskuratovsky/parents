// @flow strict-local

import * as React from "react";
import { Text, View, TextInput } from "react-native";
import * as Logger from "../common/Logger";

import * as Database from "../common/Database";

type Props = {};

export default class ErrorBoundary extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    Logger.log("logging error: " + error + ", errorInfo" + JSON.stringify(errorInfo));
    Database.logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            //backgroundColor: "yellow",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: 10,
          }}
        >
          <Text>Oops, something went wrong.</Text>
          <TextInput
            style={{ fontSize: 7 }}
            multiline
            numberOfLines={2}
            value={this.state.error != null ? JSON.stringify(this.state.error, null, 2) : "null"}
          />
        </View>
      );
    }
    return this.props.children;
  }
}
