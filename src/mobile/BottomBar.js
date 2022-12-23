// @flow strict-local

import type { AbstractComponent, ElementProps } from "react";
import type { ViewProps } from "react-native-web/dist/exports/View";
import type { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheet";
import type { PropsType } from "react-native/ReactCommon/hermes/inspector/tools/msggen/src/Type";

import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  style: ViewStyle,
  children: ?$ReadOnlyArray<?React$Node>,
};

const BottomBar = ({ style, children }: Props): React.Node => {
  return (
    <View
      style={[
        style,
        {
          height: 80,
          paddingTop: 8,
          paddingBottom: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          //zIndex: Number.MAX_VALUE,
        },
      ]}
    >
      {children?.map((child, index) => {
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

const component: AbstractComponent<Props> = React.memo(BottomBar);
export default component;
