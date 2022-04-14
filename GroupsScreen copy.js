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
  const userSchools = userInfo.profile.schools ?? [];
  const userGroups = userGroupMemberships.map((groupMembership) => groupMembership.groupId);
  let schoolsComponent = null;
  if (userSchools.length > 0) {
    schoolsComponent = userSchools.map((school_id) => {
      const school = schoolMap[school_id];
      const schoolGroups = groupList.filter((group) => group.schoolId == school.id);

      const userSchoolGroups = schoolGroups.filter((schoolGroup) => {
        return userGroups.includes(schoolGroup.id);
      });

      const schoolGroupComponents = userSchoolGroups.map((group) => {
        return (
          <View key={"x" + school.id + "_" + group.id} style={{ flexDirection: "row" }}>
            <Text>
              {group.name} ({group.id})
            </Text>

            <MyButtons.FormButton
              text="Go To Group"
              onPress={() => {
                dispatch(Actions.goToUserScreen({ screen: "GROUP", groupId: group.id }));
              }}
            />
          </View>
        );
      });

      const joinSchoolGroups = schoolGroups.filter((schoolGroup) => {
        return !userGroups.includes(schoolGroup.id);
      });

      const joinGroupComponents = joinSchoolGroups.map((group) => {
        return (
          <View key={"join_" + school.id + "_" + group.id} style={{ flexDirection: "row" }}>
            <Text>
              {group.name} ({group.id})
            </Text>
            <MyButtons.FormButton
              text="Join"
              onPress={() => {
                Controller.joinGroup(dispatch, userInfo, group.id);
              }}
            />
          </View>
        );
      });
      joinGroupComponents.push(
        <View key="new">
          <MyButtons.FormButton
            text="Create New Group"
            onPress={() => {
              setVisibleSchoolGroupModal(school.id);
            }}
          />
        </View>
      );

      const createSchoolGroup = async function (groupName, grade, year) {
        return Controller.createSchoolGroupAndJoin(
          dispatch,
          userInfo,
          school.id,
          groupName,
          grade,
          year
        );
      };

      return (
        <View key={"school_" + school.id} style={{ flex: 1 }}>
          <Text key="name">{school.name}</Text>
          <ScrollView key="scroll_open">{schoolGroupComponents}</ScrollView>
          {/* list all the groups in scroll view here */}
          <ScrollView key="scroll_join">{joinGroupComponents}</ScrollView>
          <NewSchoolGroupModal
            key="newgroupmodal"
            visible={visibleSchoolGroupModal == school.id}
            onCreateGroup={createSchoolGroup}
            closeModal={() => {
              console.log("close modal called");
              setVisibleSchoolGroupModal(null);
            }}
          />
        </View>
      );
    });
  } else {
    schoolsComponent = <Text key="noschool">No Schools Set Up [link here to set up schools]</Text>;
  }

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        key="topbar"
        style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}
        left={null}
        center={<Text>Groups</Text>}
        right={null}
      />
      <View style={{ flex: 1 }} key="main_content">
        <SearchBar
          key="search"
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => {}}
          onClear={(text) => {}}
          placeholder="Search..."
          value={""}
        />
        {schoolsComponent}
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
                  backAction: () => Actions.goToUserScreen({ screen: "GROUPS" }),
                })
              );
            }}
          />
        </BottomBar>
      </View>
    </Portal>
  );
}
