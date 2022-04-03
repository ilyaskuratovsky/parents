import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";
import * as MyButtons from "./MyButtons";
import NewPrivateGroupModal from "./NewPrivateGroupModal";
import * as Controller from "./Controller";
import * as Globals from "./Globals";

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
  } = useSelector((state) => {
    return {
      schoolList: state.main.schoolList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
      orgsMap: state.main.orgsMap,
    };
  });
  const [visibleSchoolGroupModal, setVisibleSchoolGroupModal] = useState(null);
  const [newPrivateGroupModalVisible, setNewPrivateGroupModalVisible] =
    useState(false);
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
    groupsComponents = userGroupMemberships.map(
      (userGroupMembership, index) => {
        const groupId = userGroupMembership.groupId;
        const group = groupMap[groupId];
        if (group == null) {
          return (
            <Text>
              (null), groupId: {groupId}, group_membership_id:
              {userGroupMembership.id}
            </Text>
          );
        }
        const org = orgsMap[group.orgId];
        return (
          <>
            <TouchableOpacity
              key={group.id}
              style={{
                flexDirection: "row",
                height: 60,
                alignItems: "center",
                paddingLeft: 10,
              }}
              onPress={() => {
                dispatch(
                  Actions.goToScreen({ screen: "GROUP", groupId: group.id })
                );
              }}
            >
              <View
                style={{
                  flexGrow: 1,
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 18,
                    fontWeight: "bold",
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
            <Divider
              style={{ marginTop: 10, marginBottom: 10 }}
              width={1}
              color="lightgrey"
            />
          </>
        );
      }
    );
  }

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        style={{}}
        left={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar
              size={48}
              rounded
              title="I"
              containerStyle={{ backgroundColor: "coral", marginRight: 10 }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>My Groups</Text>
          </View>
        }
        center={null}
        right={null}
      />
      <View style={{ flex: 1, backgroundColor: "white", paddingTop: 20 }}>
        <ScrollView>
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
        <Toolbar />
      </View>
      <NewPrivateGroupModal
        visible={newPrivateGroupModalVisible}
        createGroup={createPrivateGroup}
        closeModal={() => setNewPrivateGroupModalVisible(false)}
      />
    </Portal>
  );
}
