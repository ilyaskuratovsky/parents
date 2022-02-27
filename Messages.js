import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { groupMemberships } from "./Actions";

export default function Messages(props) {
  const { toUserInvites, groupMap } = useSelector((state) => {
    return {
      toUserInvites: state.main.toUserInvites,
      groupMap: state.main.groupMap,
    };
  });

  const insets = useSafeAreaInsets();

  if (toUserInvites != null) {
    return (
      <View
        style={{
          backgroundColor: "red",
          position: "absolute",
          bottom: insets.bottom,
          width: "100%",
        }}
      >
        {toUserInvites.map((invite) => {
          const group = groupMap[invite.groupId];
          return <Text>Invite to {group.name}</Text>;
        })}
      </View>
    );
  } else {
    return null;
  }
}
