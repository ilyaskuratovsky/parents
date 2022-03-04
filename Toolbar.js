import React from "react";
import { useDispatch } from "react-redux";
import * as Actions from "./Actions";
import BottomBar from "./BottomBar";
import * as Controller from "./Controller";
import * as MyButtons from "./MyButtons";
import * as UIConstants from "./UIConstants";

const Toolbar = ({ selected }) => {
  const dispatch = useDispatch();
  return (
    <BottomBar style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}>
      <MyButtons.MenuButton
        icon="account-group"
        color={selected == "groups" ? "mediumblue" : "black"}
        text="My Groups"
        onPress={() => {
          dispatch(
            Actions.goToScreen({
              screen: "GROUPS",
            })
          );
        }}
      />

      <MyButtons.MenuButton
        icon="magnify"
        text="Find Groups"
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
