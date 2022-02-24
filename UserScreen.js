import React from "react";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import DebugScreen from "./DebugScreen";
import ErrorScreen from "./ErrorScreen";
import GroupScreen from "./GroupScreen";
import GroupsScreen from "./GroupsScreen";
import ProfileScreen from "./ProfileScreen";

export default function UserScreen({ navigation }) {
  const userInfo = useSelector((state) => state.main.userInfo);
  const screenWithParams = useSelector((state) => state.screen.userScreen);
  const screen = screenWithParams.screen;

  if (userInfo == null) {
    return <Text>Loading User Information...</Text>;
  } else if (screen == null) {
    return <Text>error (no screen)</Text>;
  } else {
    if (screen == "PROFILE") {
      return <ProfileScreen />;
    } else if (screen == "GROUPS") {
      return <GroupsScreen />;
    } else if (screen == "GROUP") {
      return <GroupScreen groupId={screenWithParams.groupId} />;
    } else if (screen == "DEBUG") {
      return <DebugScreen backAction={screenWithParams.backAction} />;
    }
    return <ErrorScreen />;
  }
}
