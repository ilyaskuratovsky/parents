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

export default function InitialJoinSchoolGroupsScreen() {
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

  /* design */
  /*
    Have accordion selection with each item being a school
    under that you can scroll all the groups in the school and hit join for each one
    under everything is a done button in the footer
  */
  const [visibleSchoolGroupModal, setVisibleSchoolGroupModal] = useState(null);

  const userSchools = userInfo.profile.schools ?? [];
  const userGroups = userGroupMemberships.map(
    (groupMembership) => groupMembership.groupId
  );

  const schoolsComponents = userSchools.map((school_id) => {
    const school = schoolMap[school_id];
    const schoolGroups = groupList.filter(
      (group) => group.schoolId == school.id
    );

    const joinGroupComponents = schoolGroups.map((group) => {
      return (
        <View
          key={"join_" + school.id + "_" + group.id}
          style={{ flexDirection: "row" }}
        >
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

    return (
      <View key={"school_" + school.id} style={{ flex: 1 }}>
        <Text key="name">{school.name}</Text>
        {/* list all the groups in scroll view here */}
        <ScrollView key="scroll_join">{joinGroupComponents}</ScrollView>
      </View>
    );
  });

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        key="topbar"
        style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}
        left={null}
        center={<Text>Select School Groups</Text>}
        right={null}
      />
      <View key="bottombar" style={{ flex: 1 }}>
        {schoolsComponents}
        <BottomBar style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}>
          <MyButtons.FormButton
            key="school_orgs"
            text="Schools/Orgs"
            onPress={() => {}}
          />
          <MyButtons.FormButton
            key="profile"
            text="My Profile"
            onPress={() => {}}
          />
          <MyButtons.FormButton
            key="logout"
            text="Logout"
            onPress={() => {
              Controller.logout();
            }}
          />
          <MyButtons.FormButton
            key="debug"
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
