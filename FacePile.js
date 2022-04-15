import React, { useState } from "react";
import { Modal, Text, View, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as UserInfo from "./UserInfo";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as MyButtons from "./MyButtons";
import GroupInviteModal from "./GroupInviteModal";
import Portal from "./Portal";

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
