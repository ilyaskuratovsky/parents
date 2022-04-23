import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Divider } from "react-native-elements";

const TopBar = ({ height = 80, left, center, right, style, leftWidth, backgroundColor }) => {
  return (
    <View
      style={{
        height: height ?? 80,
        backgroundColor: backgroundColor ?? "purple",
        flexDirection: "column",
      }}
    >
      <View
        style={[
          style,
          {
            height: height - 1,
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 8,
            paddingBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            //zIndex: Number.MAX_VALUE,
          },
        ]}
      >
        <View
          style={{
            flexBasis: 60,
            flexGrow: 0,
            alignItems: "flex-start",
            justifyContent: "flex-end",
          }}
        >
          {left}
        </View>
        <View
          style={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {center}
        </View>
        <View
          style={{
            flexBasis: 60,
            flexGrow: 0,
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ flexDirection: "row" }}>{right}</View>
        </View>
      </View>
      <Divider style={{}} width={1} color="darkgrey" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // row
    alignItems: "center",
  },
});

export default React.memo(TopBar);
