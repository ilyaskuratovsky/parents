import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Controller from "../common/Controller";
import FacePile from "./FacePile";
import * as Globals from "./Globals";
import * as MyButtons from "./MyButtons";
import NewPrivateGroupModal from "./NewPrivateGroupModal";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as Utils from "../common/Utils";
export default function FriendsScreen({}) {
  const dispatch = useDispatch();
  // const x = null;
  // const a = x.foo;
  const userInfo = useSelector((state) => state.main.userInfo);
  const {
    schoolList,
    schoolMap,
    groupList,
    groupMap,
    userGroupMemberships,
    orgsMap,
    groupMembershipMap,
  } = useSelector((state) => {
    return {
      schoolList: state.main.schoolList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
      groupMembershipMap: state.main.groupMembershipMap,
      orgsMap: state.main.orgsMap,
    };
  });
  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }

  return null;
  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        key="topbar"
        style={{}}
        left={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                flexGrow: 1,
                paddingLeft: 6,
                fontWeight: "bold",
                fontSize: 20,
                color: UIConstants.BLACK_TEXT_COLOR,
                //fontFamily: "Helvetica Neue",
                //color: "grey",
                //backgroundColor: "yellow",
              }}
            >
              Friends
            </Text>
            <View style={{ width: 80, alignItems: "flex-end" }}>
              {UserInfo.avatarComponent(userInfo, () => {
                dispatch(
                  Actions.openModal({
                    modal: "MY_PROFILE",
                  })
                );
              })}
            </View>
          </View>
        }
        center={null}
        right={null}
      />
      <View key="main_content" style={{ flex: 1, backgroundColor: "white", paddingTop: 20 }}>
        <Text>Sorry this feature is not available yet.</Text>
        <Toolbar key="toolbar" />
      </View>
    </Portal>
  );
}
