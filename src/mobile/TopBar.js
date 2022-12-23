// @flow strict-local

import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Divider } from "react-native-elements";
import type { AbstractComponent } from "react";
import type { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheet";

type Props = {
  left: React$Node,
  center: React$Node,
  right: React$Node,
  style: ViewStyle,
  leftWidth: number,
};
const TopBar = ({ left, center, right, style, leftWidth }: Props) => {
  return (
    <View
      style={{
        backgroundColor: "whitesmoke",
        flexDirection: "column",
        //backgroundColor: "yellow",
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
            //backgroundColor: "orange",
          },
        ]}
      >
        <View
          style={{
            //flexBasis: "100%",
            flexGrow: 0,
            alignItems: "flex-start",
            justifyContent: "flex-end",
            //backgroundColor: "brown",
          }}
        >
          {left}
        </View>
        {center != null && (
          <View
            style={{
              flexBasis: 100,
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {center}
          </View>
        )}
        <View
          style={{
            flexBasis: 100,
            flexGrow: 0,
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ flexDirection: "row" }}>{right}</View>
        </View>
      </View>
      <Divider style={{}} width={1} color="lightgrey" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // row
    alignItems: "center",
  },
});

const component: AbstractComponent<Props> = React.memo(TopBar);
export default component;

/*
Group View
  Show how many members like facebook

Event view
  Copy what that App has with the user there
  Add how many comments

Add calendar 

Pop events with 


*/
