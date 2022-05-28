import React from "react";
import { Text, View, TextInput } from "react-native";

import * as Database from "../common/Database";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log("driving state from error: " + error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log("logging error: " + error + ", errorInfo" + JSON.stringify(errorInfo));
    //Database.logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log("this.state.error: " + this.state.error);
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
            value={
              this.state.error != null
                ? this.state.error.toString() + JSON.stringify(this.state.error, null, 2)
                : "null"
            }
          />
        </View>
      );
    }
    return this.props.children;
  }
}
