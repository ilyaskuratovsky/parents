// @flow strict-local

import * as React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import type { ViewStyle } from "@react-native-segmented-control/segmented-control/js/types";
import type { AbstractComponent } from "react";

type Props = {
  size?: number,
  checked?: boolean,
  onPress?: () => void,
  style?: ViewStyle,
  containerStyle?: ViewStyle,
  text?: ?string,
};

const Checkbox = ({ size, checked, onPress, style, containerStyle, text }: Props): React.Node => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[{ flexDirection: "row", alignItems: "center" }, containerStyle]}>
        <View
          style={[
            {
              height: 18,
              width: 18,
              justifyContent: "center",
              alignItems: "center",
              //backgroundColor: "yellow",
              borderWidth: 2,
              borderColor: "grey",
              borderRadius: 13,
              marginRight: 10,
            },
            style,
          ]}
        >
          {checked && (
            <Icon
              style={{
                flex: 1,
                paddingBottom: 16,
                color: "black",
                fontSize: 15,
                fontWeight: "bold",
              }}
              name="check"
            />
          )}
        </View>
        {text}
      </View>
    </TouchableOpacity>
  );
};

const component: AbstractComponent<Props> = React.memo(Checkbox);
export default component;
