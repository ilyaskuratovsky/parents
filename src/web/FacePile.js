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

export function SquareFacePile({ userIds }) {
  const dispatch = useDispatch();
  const { userMap } = useSelector((state) => {
    return {
      userMap: state.main.userMap,
    };
  });

  const user1 = userIds.length > 0 ? userIds[0] : null;
  const user2 = userIds.length > 1 ? userIds[1] : null;

  let components = null;
  if (user1 != null && user2 == null) {
    components = [UserInfo.smallAvatarComponent(user1, null, true)];
  } else {
    components = [
      <View key={"user1"} style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}>
        {UserInfo.smallAvatarComponent(user1, null, true)}
      </View>,
      <View key={"user2"} style={{ position: "absolute", right: 0, bottom: 0, zIndex: -1 }}>
        {UserInfo.smallAvatarComponent(user2, null, true)}
      </View>,
    ];
  }

  return (
    <View
      style={{
        width: 42,
        height: 42,
        //backgroundColor: "cyan",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {components}
    </View>
  );
}
