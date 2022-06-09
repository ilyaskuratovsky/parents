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
import * as Debug from "../common/Debug";

export default function GroupsScreen({}) {
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
  const [visibleSchoolGroupModal, setVisibleSchoolGroupModal] = useState(null);
  const [newPrivateGroupModalVisible, setNewPrivateGroupModalVisible] = useState(false);
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
  if (userGroupMemberships.length > 0) {
    groupsComponents = userGroupMemberships.map((userGroupMembership, index) => {
      const groupId = userGroupMembership.groupId;
      const group = groupMap[groupId];
      if (group == null || group.status == "deleted") {
        /*
        if (Globals.dev) {
          return (
            <Text key={index}>
              (null), groupId: {groupId}, group_membership_id:
              {userGroupMembership.id}
            </Text>
          );
        } else {
          return null;
        }
        */
        return null;
      }
      const org = orgsMap[group.orgId];
      const members = groupMembershipMap[group.id];
      return (
        <View
          key={index}
          style={{
            flex: 1,
            //backgroundColor: "cyan"
          }}
        >
          <TouchableOpacity
            key={group.id}
            style={{
              flexDirection: "row",
              height: 60,
              alignItems: "center",
              paddingLeft: 10,
            }}
            onPress={() => {
              dispatch(Actions.goToScreen({ screen: "GROUP", groupId: group.id }));
            }}
          >
            <View
              style={{
                flexGrow: 1,
                flexDirection: "column",
                //backgroundColor: "green",
              }}
            >
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: UIConstants.BLACK_TEXT_COLOR,
                  //fontFamily: "Helvetica Neue",
                }}
              >
                {group.name} {/*group.id*/}
              </Text>
              {Globals.dev && (
                <Text style={{ fontSize: 8 }}>
                  user_group_membership: {userGroupMembership.id}
                  group: {group.id}
                </Text>
              )}
              {org != null && (
                <Text
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 14,
                  }}
                >
                  {org.name ?? "[No organization]"}
                </Text>
              )}
              <View style={{ flex: 1, paddingTop: 8 }}>
                <FacePile
                  userIds={[userInfo.uid].concat(
                    members
                      .filter((groupMembership) => {
                        return userInfo.uid != groupMembership.uid;
                      })
                      .map((groupMembership) => groupMembership.uid)
                  )}
                  border
                />
              </View>
            </View>
            <View
              style={{
                flexBasis: 100,
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <IconButton icon="chevron-right" color={"darkgrey"} size={32} />
              {/*
              <MyButtons.FormButton
                text="Open"
                onPress={() => {
                  dispatch(
                    Actions.goToScreen({ screen: "GROUP", groupId: group.id })
                  );
                }}
              />
              */}
            </View>
          </TouchableOpacity>
          <Divider style={{ marginTop: 20, marginBottom: 10 }} width={3} color="lightgrey" />
        </View>
      );
    });
  }

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
              My Groups
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
        <ScrollView key="messages">
          {groupsComponents}
          <View
            style={{
              flex: 1,
              /*backgroundColor: "cyan",*/ height: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MyButtons.LinkButton
              text="Start a new Group"
              onPress={async () => {
                setNewPrivateGroupModalVisible(true);
              }}
            />
          </View>
        </ScrollView>
        <Toolbar key="toolbar" />
      </View>
      <NewPrivateGroupModal
        key="new-group-modal"
        visible={newPrivateGroupModalVisible}
        createGroup={createPrivateGroup}
        closeModal={() => setNewPrivateGroupModalVisible(false)}
      />
    </Portal>
  );
}
