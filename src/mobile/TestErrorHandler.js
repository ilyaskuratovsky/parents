// @flow strict-local

import * as React from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Divider } from "react-native-elements";

export default function TestErrorHandler({ messages }) {
  const c = null;
  c.map();
  return (
    <View style={{ paddingRight: 10, paddingLeft: 10 }}>
      <Text>Hello world</Text>
    </View>
  );
}
