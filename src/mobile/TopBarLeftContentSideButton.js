import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Divider } from "react-native-elements";

const TopBarLeftContentSideButton = ({ content, side, style, leftWidth }) => {
  return (
    <View style={{ backgroundColor: "whitesmoke", flexDirection: "column" }}>
      <View
        style={[
          style,
          {
            //height: 100,
            paddingLeft: 4,
            paddingRight: 4,
            paddingTop: 8,
            paddingBottom: 8,
            flexDirection: "row",
            //zIndex: Number.MAX_VALUE,
          },
        ]}
      >
        <View
          style={{
            flexGrow: 1,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {content}
        </View>
        <View
          style={{
            width: 60,
            flexGrow: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>{side}</View>
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

export default React.memo(TopBarLeftContentSideButton);