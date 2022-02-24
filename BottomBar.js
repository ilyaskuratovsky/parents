import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomBar = ({ style, children }) => {
  return (
    <View
      style={[
        style,
        {
          paddingTop: 8,
          paddingBottom: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          //zIndex: Number.MAX_VALUE,
        },
      ]}
    >
      {children.map((child, index) => {
        return <View key={index}>{child}</View>;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // row
    alignItems: "center",
  },
});

export default React.memo(BottomBar);
