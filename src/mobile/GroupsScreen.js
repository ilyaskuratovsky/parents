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
import NewPrivateGroupModal from "./NewGroupModal";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as Utils from "../common/Utils";
import * as Debug from "../common/Debug";
import * as Data from "../common/Data";
import * as MessageUtils from "../common/MessageUtils";
import { Badge } from "react-native-elements";
import GroupView from "./GroupView";
import { styles } from "./Styles";

export default function GroupsScreen({}) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  // const x = null;
  // const a = x.foo;
  const userInfo = useSelector((state) => state.main.userInfo);
  const {
    schoolList,
    schoolMap,
    groupList,
    groupMap,
    manualUserGroupMemberships,
    orgsMap,
    groupMembershipMap,
    group,
    groupRootUserMessages,
    groups,
  } = useSelector((state) => {
    return {
      schoolList: state.main.schoolList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      manualUserGroupMemberships: state.main.userGroupMemberships,
      groupMembershipMap: state.main.groupMembershipMap,
      orgsMap: state.main.orgsMap,
      groupRootUserMessages: state.main.groupRootUserMessages,
      groups: state.main.groupList,
    };
  });
  const [visibleSchoolGroupModal, setVisibleSchoolGroupModal] = useState(null);
  const createPrivateGroup = async (groupName, inviteees, emailInvitees) => {
    const groupId = await Controller.createPrivateGroupAndJoin(
      dispatch,
      userInfo,
      groupName,
      inviteees,
      emailInvitees
    );
    dispatch(Actions.goToScreen({ screen: "GROUP", groupId: groupId }));
  };

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }

  /* search bar at the top */
  /* search will surfae groups you don't belong to as well as groups you belong to */
  /* search will also surface "schools and organizations"
  /*
    loop over schools -
    if no groups and belong to the school
    Have a scroll view for each school
    with suggested adds
    at the bottom of the scroll - have a create new group
    (if no groups associated with the school, just have a create new group)
    if you do belong to a group just list the group with no sroll

    loop over activities - same as schools



    if you don't belong to any schools just say - you don't have any groups and only the search is enabled.
  */
  //const userSchools = userInfo.profile.schools ?? [];
  // const userGroupIds = userGroupMemberships.map(
  //   (groupMembership) => groupMembership.groupId
  // );
  let groupsComponents = null;
  const userGroupMemberships = [...manualUserGroupMemberships];

  if (userGroupMemberships.length > 0) {
    groupsComponents = userGroupMemberships.map((userGroupMembership, index) => {
      const groupId = userGroupMembership.groupId;
      return <GroupView key={groupId} groupId={groupId} />;
    });
  }

  const superPublicGroups = Data.getSuperPublicGroups();
  const superPublicGroupsComponents = superPublicGroups.map((group) => {
    return <GroupView groupId={group.id} />;
  });

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        key="topbar"
        style={{}}
        left={
          <View>
            <View
              style={{
                //backgroundColor: "cyan",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ alignItems: "flex-start", marginRight: 6 }}>
                {UserInfo.avatarComponent(userInfo, () => {
                  dispatch(
                    Actions.openModal({
                      modal: "MY_PROFILE",
                    })
                  );
                })}
              </View>
              <Text
                style={[
                  {
                    paddingLeft: 6,
                  },
                  styles.topBarHeaderText,
                ]}
              >
                {"My Groups"}
              </Text>
            </View>
            {debugMode && <Text style={{ fontSize: 8 }}>GroupsScreen.js</Text>}
          </View>
        }
        center={<Text>{""}</Text>}
        right={
          <MyButtons.MenuButton
            icon="plus"
            text="Create Group"
            onPress={() => {
              dispatch(Actions.openModal({ modal: "NEW_GROUP" }));
            }}
          />
        }
      />
      <View key="main_content" style={{ flex: 1, backgroundColor: "white", paddingTop: 20 }}>
        <ScrollView key="messages">
          {groupsComponents}
          {superPublicGroupsComponents}
          <View
            style={{
              flex: 1,
              /*backgroundColor: "cyan",*/
              height: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          ></View>
        </ScrollView>
        <Toolbar key="toolbar" />
      </View>
    </Portal>
  );
}
