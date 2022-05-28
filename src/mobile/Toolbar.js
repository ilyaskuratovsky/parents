import React from "react";
import { Badge } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as MessageUtils from "../common/MessageUtils";
import * as MyButtons from "./MyButtons";
import * as Actions from "../common/Actions";
import BottomBar from "./BottomBar";
import * as UIConstants from "./UIConstants";
import * as Logger from "../common/Logger";

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
          Logger.log("Toolbar: groups clicked");
          dispatch(
            Actions.goToScreen({
              screen: "GROUPS",
            })
          );
        }}
        badge={
          (unreadMessages ?? 0) > 0 ? (
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
        text="Find"
        color={selected == "find_groups" ? "mediumblue" : "black"}
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "FIND_GROUPS",
            })
          );
        }}
      />

      {/*
      <MyButtons.MenuButton
        icon="account-circle"
        text="Profile"
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "MY_PROFILE",
            })
          );
        }}
      />
      */}
      <MyButtons.MenuButton
        icon="account-multiple"
        text="Friends"
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "FRIENDS",
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
