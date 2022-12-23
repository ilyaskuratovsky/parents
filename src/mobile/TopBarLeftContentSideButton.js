// @flow strict-local

import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Divider } from "react-native-elements";
import type { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheet";
import type { AbstractComponent } from "react";

type Props = {
  left: React$Node,
  right: React$Node,
  style: ViewStyle,
  leftWidth: number,
};
const TopBarLeftContentSideButton = ({ left, right, style, leftWidth }) => {
  return (
    <View
      style={{
        backgroundColor: "whitesmoke",
        flexDirection: "column",
        backgroundColor: "cyan",
      }}
    >
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
          {left}
        </View>
        <View
          style={{
            width: 60,
            flexGrow: 0,
            alignItems: "center",
            justifyContent: "center",
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

const component: AbstractComponent<Props> = React.memo(TopBarLeftContentSideButton);
export default component;
