import React from "react";
import { Badge } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as MessageUtils from "../common/MessageUtils";
import * as MyButtons from "./MyButtons";
import * as Actions from "../common/Actions";
import BottomBar from "./BottomBar";
import * as UIConstants from "./UIConstants";
import * as Logger from "../common/Logger";
import * as Data from "../common/Data";

const Toolbar = ({ selected }) => {
  const dispatch = useDispatch();
  const { groupMessagesMap, userMessagesMap } = useSelector((state) => {
    return {
      groupMessagesMap: state.main.groupMessages,
      userMessagesMap: state.main.userMessagesMap,
    };
  });

  const allUserRootMessages = Data.getAllUserRootMessages();
  const unreadMessages = MessageUtils.calculateUnreadMessages(allUserRootMessages);

  return (
    <BottomBar
      style={{ paddingLeft: 24, paddingRight: 24, backgroundColor: UIConstants.DEFAULT_BACKGROUND }}
    >
      <MyButtons.MenuButton
        icon="content-copy"
        color={selected == "groups" ? "mediumblue" : "black"}
        text="Feed"
        onPress={() => {
          Logger.log("Toolbar: groups clicked");
          dispatch(
            Actions.goToScreen({
              screen: "FEED",
            })
          );
        }}
        badge={null}
      />

      <MyButtons.MenuButton
        icon="account-group"
        color={selected == "groups" ? "mediumblue" : "black"}
        text="My Groups"
        onPress={() => {
          Logger.log("Toolbar: groups clicked");
          dispatch(
            Actions.goToScreen({
              screen: "GROUPS",
            })
          );
        }}
        badge={
          unreadMessages.length > 0 ? (
            <Badge
              status="error"
              value={unreadMessages.length}
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
      {/*
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
      */}
    </BottomBar>
  );
};

export default React.memo(Toolbar);
