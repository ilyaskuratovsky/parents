// @flow strict-local
import { useState } from "react";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-elements";

export default function TabView({ tabHeadings, tabs }) {
  const [visibleTab, setVisibleTab] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 40,
          flexDirection: "row",
          //, backgroundColor: "yellow"
        }}
      >
        {tabHeadings.map((heading, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              onPress={() => {
                setVisibleTab(index);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  //textDecorationLine: visibleTab == index ? "underline" : "normal",
                }}
              >
                {heading}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Divider style={{ marginBottom: 10 }} width={1} color="darkgrey" />
      {tabs.filter((tab, index) => visibleTab == index)}
    </View>
  );
}
