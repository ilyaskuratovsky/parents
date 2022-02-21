import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  CheckBox,
  Button,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "react-native-elements";
import * as MyButtons from "./MyButtons";
import * as Controller from "./Controller";
import * as Actions from "./Actions";
/*
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
*/
import * as Firestore from "firebase/firestore";
import { signOut } from "firebase/auth";

import { auth, database } from "./config/firebase";

export default function GroupsScreen({ navigation }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { schoolList, schoolMap, groupList, groupMap } = useSelector(
    (state) => {
      return {
        schoolList: state.main.schoolList,
        schoolMap: state.main.schoolMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
      };
    }
  );

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

  let schoolsComponent = null;
  if (userSchools.length > 0) {
    schoolsComponent = userSchools.map((school_id) => {
      const school = schoolMap[school_id];
      const schoolGroups = groupList.filter(
        (group) => group.school == school.id
      );

      const userSchoolGroups = schoolGroups.filter((schoolGroup) => {
        return userInfo.groups.includes(schoolGroup.id);
      });

      const schoolGroupComponents = userSchoolGroups.map((group) => {
        return (
          <View key={school.id} style={{ flexDirection: "row" }}>
            <Text>
              {group.name} ({group.id})
            </Text>
            <MyButtons.FormButton
              text="Go To Group"
              onPress={() => {
                dispatch(
                  Actions.goToUserScreen({ screen: "GROUP", groupId: group.id })
                );
              }}
            />
          </View>
        );
      });

      const joinSchoolGroups = schoolGroups.filter((schoolGroup) => {
        return !userInfo.groups.includes(schoolGroup.id);
      });

      const joinGroupComponents = joinSchoolGroups.map((group) => {
        return (
          <View key={school.id} style={{ flexDirection: "row" }}>
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
        <View key={school.id} style={{ flex: 1 }}>
          <Text>{school.name}</Text>
          <ScrollView>{schoolGroupComponents}</ScrollView>
          {/* list all the groups in scroll view here */}
          <ScrollView>{joinGroupComponents}</ScrollView>
        </View>
      );
    });
  } else {
    schoolsComponent = (
      <Text key="noschool">
        No Schools Set Up [link here to set up schools]
      </Text>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        key="search"
        round
        searchIcon={{ size: 24 }}
        onChangeText={(text) => {}}
        onClear={(text) => {}}
        placeholder="Search..."
        value={""}
      />
      <Text key="group">Groups Screen {JSON.stringify(userInfo)}</Text>
      {schoolsComponent}
    </View>
  );
}
