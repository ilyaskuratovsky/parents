// @flow strict-local

import React from "react";
import { Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";

export default function LoggedInScreenRouter({ groupId, navigation }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { schoolList, schoolMap, groupList, groupMap, userGroupMemberships } = useSelector(
    (state) => {
      return {
        schoolList: state.main.schoolList,
        schoolMap: state.main.schoolMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
        userGroupMemberships: state.main.userGroupMemberships,
      };
    }
  );
  const currentScreen = useSelector((state) => state.screen.screen);
  if (currentScreen.screen == "LOGGED_IN_SCREEN_ROUTER") {
    if (userInfo == null) {
    } else if (userInfo != null && userInfo.profile == null) {
      dispatch(Actions.goToScreen({ screen: "INITIAL_SELECT_SCHOOLS" }));
    } else {
      if (
        userInfo.profile.schools != null &&
        userInfo.profile.schools.length > 0 &&
        userGroupMemberships == 0
      ) {
        dispatch(Actions.goToScreen({ screen: "INITIAL_SELECT_SCHOOL_GROUPS" }));
      } else {
        dispatch(Actions.goToScreen({ screen: "GROUPS" }));
      }
    }
  }

  return <Text>Loading Data...</Text>;
}
