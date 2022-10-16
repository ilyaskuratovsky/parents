// @flow strict-local

import * as React from "react";
import { Text, View, Button, SafeAreaView, FlatList, Dimensions } from "react-native";
import * as Actions from "../common/Actions";
import Portal from "./Portal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function FlexTest(): React.Node {
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height - insets.top - insets.bottom;

  return (
    <Portal>
      <View style={{ backgroundColor: "orange", height: 100 }}>
        <Text>window height: {windowHeight}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={
            //DATA
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
          }
          renderItem={(item) => {
            return (
              <View style={{ height: 40, backgroundColor: "cyan" }}>
                <Text>{item.item}</Text>
              </View>
            );
          }}
          keyExtractor={(item) => item.item}
        />
      </View>
      <View style={{ backgroundColor: "purple", height: 100 }}>
        <Text>box3</Text>
      </View>
    </Portal>
  );
}

export default FlexTest;
