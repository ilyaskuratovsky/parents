import React from "react";
import { Text, View } from "react-native";

import * as Database from "../common/Database";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log("logging error: " + error);
    Database.logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "yellow",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Oops, something went wrong.</Text>
          <Text>
            {this.state.error != null ? JSON.stringify(this.state.error, null, 2) : "null"}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}
