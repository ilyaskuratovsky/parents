// @flow strict-local

import React from "react";
import { Text, View } from "react-native";

export default function PostScreen({ messageId }) {
  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      <Text>sub thread: {messageId}</Text>
    </View>
  );
}
