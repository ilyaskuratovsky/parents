// @flow strict-local

import * as React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Portal({ backgroundColor, children, style }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, width: "100%", flexDirection: "column" }}>
      <View
        style={[
          style,
          {
            height: insets.top,
            backgroundColor: backgroundColor,
            flexGrow: 0,
          },
        ]}
      />
      <View
        style={{
          flexGrow: 1,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: backgroundColor,
        }}
      >
        {children}
      </View>

      <View
        style={[
          style,
          {
            height: insets.bottom,
            backgroundColor: backgroundColor,
            flexGrow: 0,
          },
        ]}
      />
    </View>
  );
}
