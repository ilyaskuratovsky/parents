import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SearchBar } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import * as Controller from "./Controller";
import * as MyButtons from "./MyButtons";
import NewSchoolGroupModal from "./NewSchoolGroupModal";
import Portal from "./Portal";
import * as UIConstants from "./UIConstants";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

export default function GroupsScreen({ navigation }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { schoolList, schoolMap, groupList, groupMap, userGroupMemberships } =
    useSelector((state) => {
      return {
        schoolList: state.main.schoolList,
        schoolMap: state.main.schoolMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
        userGroupMemberships: state.main.userGroupMemberships,
      };
    });
  const [visibleSchoolGroupModal, setVisibleSchoolGroupModal] = useState(null);
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
  const userGroups = userGroupMemberships.map(
    (groupMembership) => groupMembership.groupId
  );
  let groupsComponents = null;
  if (userGroups.length > 0) {
    groupsComponents = userGroups.map((groupId, index) => {
      const group = groupMap[groupId];
      return (
        <View
          key={group.id}
          style={{
            flexDirection: "row",
            height: 60,
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <Text
            style={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {group.name}
          </Text>
          <View
            style={{
              flexBasis: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MyButtons.FormButton
              text="Open"
              onPress={() => {
                dispatch(
                  Actions.goToScreen({ screen: "GROUP", groupId: group.id })
                );
              }}
            />
          </View>
        </View>
      );
    });
  }

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}
        left={null}
        center={<Text>Groups</Text>}
        right={null}
      />
      <View style={{ flex: 1 }}>
        {/*
        <SearchBar
          key="search"
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => {}}
          onClear={(text) => {}}
          placeholder="Search..."
          value={""}
        />
        */}
        <ScrollView>{groupsComponents}</ScrollView>
        <BottomBar style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}>
          <MyButtons.FormButton text="Schools/Orgs" onPress={() => {}} />
          <MyButtons.FormButton text="My Profile" onPress={() => {}} />
          <MyButtons.FormButton
            text="Logout"
            onPress={() => {
              Controller.logout();
            }}
          />
          <MyButtons.FormButton
            text="Debug"
            onPress={() => {
              dispatch(
                Actions.goToUserScreen({
                  screen: "DEBUG",
                  backAction: () =>
                    Actions.goToUserScreen({ screen: "GROUPS" }),
                })
              );
            }}
          />
        </BottomBar>
      </View>
    </Portal>
  );
}
