import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Checkbox = ({ size, checked, onPress, style, text }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            height: 18,
            width: 18,
            justifyContent: "center",
            alignItems: "center",
            //backgroundColor: "yellow",
            borderWidth: 2,
            borderColor: "grey",
            borderRadius: 13,
            ...style,
            marginRight: 10,
          }}
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

export default React.memo(Checkbox);