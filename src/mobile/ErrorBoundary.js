import React from "react";
import { Text } from "react-native";

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
  }

  render() {
    if (this.state.hasError) {
      return <Text>Oops, something went wrong.{error.message}</Text>;
    }
    return this.props.children;
  }
}
