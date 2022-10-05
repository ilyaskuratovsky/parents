import React, { useState } from "react";
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
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
              onPress={() => {
                setVisibleTab(index);
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  textDecorationLine: visibleTab == index ? "underline" : null,
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