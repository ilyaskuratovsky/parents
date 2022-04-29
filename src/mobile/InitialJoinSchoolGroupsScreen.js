import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import NewSchoolGroupModal from "./NewSchoolGroupModal";
import Portal from "./Portal";
import * as Actions from "../common/Actions";
import BottomBar from "./BottomBar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";

export default function InitialJoinSchoolGroupsScreen() {
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

  /* design */
  /*
    Have accordion selection with each item being a school
    under that you can scroll all the groups in the school and hit join for each one
    under everything is a done button in the footer
  */
  const [visibleSchoolGroupModal, setVisibleSchoolGroupModal] = useState(null);

  const userSchools = userInfo.profile.schools ?? [];
  const userGroupMembershipList = userGroupMemberships.map(
    (groupMembership) => groupMembership.groupId
  );

  const schoolsComponents = userSchools.map((school_id, index) => {
    const school = schoolMap[school_id];
    const schoolGroups = groupList.filter((group) => group.schoolId == school.id);

    const joinGroupComponents = schoolGroups.map((group) => {
      return (
        <View
          key={"join_" + school.id + "_" + group.id}
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
            {userGroupMembershipList.includes(group.id) && (
              <Icon name={"check"} style={{ color: "black", fontSize: 16 }} />
            )}
            {!userGroupMembershipList.includes(group.id) && (
              <MyButtons.FormButton
                text="Join"
                onPress={() => {
                  Controller.joinGroup(dispatch, userInfo, group.id);
                }}
              />
            )}
          </View>
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
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            backgroundColor: "darkgrey",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 20 }}>{school.name}</Text>
        </View>
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

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        key="topbar"
        style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}
        left={null}
        center={<Text>Join School Groups</Text>}
        right={
          <MyButtons.MenuButton
            icon="arrow-right"
            text="Done"
            onPress={() => {
              dispatch(Actions.goToScreen({ screen: "GROUPS" }));
            }}
          />
        }
      />
      <View key="bottombar" style={{ flex: 1 }}>
        {schoolsComponents}
        <BottomBar style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}>
          <MyButtons.FormButton key="school_orgs" text="Schools/Orgs" onPress={() => {}} />
          <MyButtons.FormButton key="profile" text="My Profile" onPress={() => {}} />
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
