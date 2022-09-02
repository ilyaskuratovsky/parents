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
  const userInfo = Data.getCurrentUser();
  const { groupMessagesMap, userMessagesMap } = useSelector((state) => {
    return {
      groupMessagesMap: state.main.groupMessages,
      userMessagesMap: state.main.userMessagesMap,
    };
  });

  const unreadMessageCount = Data.getUserUnreadMessageCount();
  const unreadChatMessageCount = Data.getUserUnreadChatMessageCount();
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
          unreadMessageCount > 0 ? (
            <Badge
              status="error"
              value={unreadMessageCount}
              containerStyle={{ position: "absolute", top: -4, right: -4 }}
            />
          ) : null
        }
      />

      <MyButtons.MenuButton
        icon="magnify"
        text="Discover"
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
        text="People"
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "FRIENDS",
            })
          );
        }}
      />
      <MyButtons.MenuButton
        icon="chat-outline"
        text="Chats"
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "CHATS",
            })
          );
        }}
        badge={
          unreadChatMessageCount > 0 ? (
            <Badge
              status="error"
              value={unreadChatMessageCount}
              containerStyle={{ position: "absolute", top: -4, right: -4 }}
            />
          ) : null
        }
      />
      {userInfo.superUser && (
        <MyButtons.MenuButton
          icon="flower-poppy"
          text="Admin"
          onPress={() => {
            dispatch(
              Actions.goToScreen({
                screen: "ADMIN",
              })
            );
          }}
        />
      )}
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
