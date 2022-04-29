import React from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as UserInfo from "../common/UserInfo";

export default function FacePile({ userIds }) {
  const dispatch = useDispatch();
  const { userMap } = useSelector((state) => {
    return {
      userMap: state.main.userMap,
    };
  });

  const components = userIds.map((uid, index) => {
    const user = userMap[uid];
    return (
      <View key={index} style={{ position: "relative", left: -(index * 10), zIndex: -index }}>
        {UserInfo.smallAvatarComponent(user, null, true)}
      </View>
    );
  });

  return <View style={{ flexDirection: "row" }}>{components}</View>;
}
