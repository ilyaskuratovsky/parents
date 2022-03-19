import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import BottomBar from "./BottomBar";
import * as Controller from "./Controller";
import * as MyButtons from "./MyButtons";
import * as UIConstants from "./UIConstants";
import { Badge } from "react-native-elements";
import * as MessageUtils from "./MessageUtils";

const Toolbar = ({ selected }) => {
  const dispatch = useDispatch();
  const { groupMessagesMap, userMessagesMap } = useSelector((state) => {
    return {
      groupMessagesMap: state.main.groupMessages,
      userMessagesMap: state.main.userMessagesMap,
    };
  });

  const unreadMessages = MessageUtils.calculateUnreadMessages(groupMessagesMap, userMessagesMap);
  return (
    <BottomBar style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}>
      <MyButtons.MenuButton
        icon="account-group"
        color={selected == "groups" ? "mediumblue" : "black"}
        text="Groups"
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "GROUPS",
            })
          );
        }}
        badge={
          unreadMessages >= 0 ? (
            <Badge
              status="error"
              value={unreadMessages}
              containerStyle={{ position: "absolute", top: -4, right: -4 }}
            />
          ) : null
        }
      />

      <MyButtons.MenuButton
        icon="magnify"
        text="Publici Groups"
        color={selected == "find_groups" ? "mediumblue" : "black"}
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "FIND_GROUPS",
            })
          );
        }}
      />

      <MyButtons.MenuButton
        icon="account-circle"
        text="My Profile"
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "MY_PROFILE",
            })
          );
        }}
      />
      {/*
      <MyButtons.MenuButton
        icon="logout"
        text="Logout"
        onPress={() => {
          Controller.logout();
        }}
      />
      */}
      <MyButtons.MenuButton
        icon="checkbox-blank-circle"
        text="Debug"
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "DEBUG",
              backAction: () => Actions.goToScreen({ screen: "GROUPS" }),
            })
          );
        }}
      />
    </BottomBar>
  );
};

export default React.memo(Toolbar);
