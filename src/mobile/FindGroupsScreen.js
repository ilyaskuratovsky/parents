import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Divider, SearchBar } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import NewPrivateGroupModal from "./NewPrivateGroupModal";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBarLeftContentSideButton from "./TopBarLeftContentSideButton";
import * as UIConstants from "./UIConstants";

export default function FindGroupsScreens({ navigation }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const [searchResults, setSearchResults] = useState(null);
  const { orgsList, orgsMap, groupList, groupMap, userGroupMemberships } = useSelector((state) => {
    return {
      orgsList: state.main.orgsList,
      orgsMap: state.main.orgsMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });

  /* search bar at the top */
  /* In the Groups page, a view that's divided into sections:
[Search bar]
Schools:
 - Brunswick
 - North Mianus 
Activities
 - OGRCC
 - Greenwich Dance Studio

 */
  const createOrg = async function (name, type) {
    return Controller.createOrgAndAssignToUser(dispatch, userInfo, name, type);
  };
  const schoolList = orgsList.filter((org) => {
    return org.type == "school";
  });
  const otherOrgsList = orgsList.filter((org) => {
    return org.type != "school";
  });
  const [searchText, setSearchText] = useState("");
  const [visibleNewOrgModal, setVisibleNewOrgModal] = useState(false);
  const [newPrivateGroupModalVisible, setNewPrivateGroupModalVisible] = useState(false);
  const createPrivateGroup = async (groupName) => {
    const groupId = await Controller.createPrivateGroupAndJoin(dispatch, userInfo, groupName);
    dispatch(Actions.goToScreen({ screen: "GROUP", groupId: groupId }));
  };
  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBarLeftContentSideButton
        style={{}}
        content={<Text style={{ fontWeight: "bold", fontSize: 20 }}>Find</Text>}
        // side={
        //   <MyButtons.MenuButton
        //     icon="plus"
        //     text="Create Private Group"
        //     onPress={() => {
        //       setNewPrivateGroupModalVisible(true);
        //     }}
        //   />
        // }
        side={null}
      />
      <NewPrivateGroupModal
        visible={newPrivateGroupModalVisible}
        createGroup={createPrivateGroup}
        closeModal={() => setNewPrivateGroupModalVisible(false)}
      />
      <View style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}>
        <View style={{ flexBasis: 80 }}>
          <SearchBar
            key="search"
            platform="ios"
            round
            searchIcon={{ size: 12 }}
            onChangeText={(text) => {
              if (text == "") {
                setSearchResults(null);
              } else {
                const results = Controller.searchGroupsAndOrgs(text);
                setSearchResults(results);
              }
              setSearchText(text);
            }}
            onClear={(text) => {
              setSearchText("");
              setSearchResults(null);
            }}
            placeholder="Search..."
            value={searchText}
            containerStyle={{ backgroundColor: "white" }}
          />
        </View>
        {searchResults != null && searchResultsSection(dispatch, searchResults, orgsMap, groupMap)}
        {searchResults == null && directorySection(dispatch, schoolList, otherOrgsList)}
      </View>
      <Toolbar />
    </Portal>
  );
}

function searchResultsSection(dispatch, searchResults, orgsMap, groupMap) {
  if (searchResults == null) {
    return <Text>No Results</Text>;
  }

  return (
    <View>
      {searchResults.map((entity) => {
        if (entity.type == "org") {
          const org = orgsMap[entity.entity];
          return (
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontSize: 16,
                  paddingTop: 5,
                  paddingBottom: 10,
                  textDecorationLine: "underline",
                  color: "blue",
                  fontWeight: "bold",
                  textAlign: "start",
                  //backgroundColor: "cyan",
                }}
              >
                {org.name}
              </Text>
              <Text style={{ fontSize: 12 }}>{org.type == "school" ? "School" : "Activities"}</Text>
            </View>
          );
        } else if (entity.type == "group") {
          const group = groupMap[entity.entity];
          return (
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontSize: 16,
                  paddingTop: 5,
                  paddingBottom: 10,
                  textDecorationLine: "underline",
                  color: "blue",
                  fontWeight: "normal",
                  textAlign: "start",
                  //backgroundColor: "cyan",
                }}
              >
                {group.name}
              </Text>
              <Text style={{ fontSize: 12 }}>Group</Text>
            </View>
          );
        }
      })}
    </View>
  );
}

function directorySection(dispatch, schoolList, otherOrgsList) {
  return (
    <ScrollView
      style={{
        paddingLeft: 10,
        flexGrow: 1,
        flexDirection: "column",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Schools</Text>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} width={1} color="lightgrey" />
      {schoolList
        .sort(function (a, b) {
          return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
        })
        .map((school) => {
          return (
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  Actions.goToScreen({
                    screen: "SCHOOL",
                    schoolId: school.id,
                  })
                );
              }}
              style={
                {
                  /*backgroundColor: "green"*/
                }
              }
            >
              <Text
                style={{
                  fontSize: 16,
                  paddingTop: 5,
                  paddingBottom: 10,
                  textDecorationLine: "underline",
                  color: "blue",
                  fontWeight: "bold",
                  textAlign: "start",
                  //backgroundColor: "cyan",
                }}
              >
                {school.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      <Text style={{ marginTop: 20, fontSize: 20, fontWeight: "bold" }}>Activities</Text>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} width={1} color="lightgrey" />
      {otherOrgsList.map((org) => {
        return (
          <TouchableOpacity
            onPress={() => {
              dispatch(
                Actions.goToScreen({
                  screen: "ORG",
                  orgId: org.id,
                })
              );
            }}
          >
            <Text
              style={{
                fontSize: 16,
                paddingTop: 5,
                paddingBottom: 10,
                textDecorationLine: "underline",
                color: "blue",
                fontWeight: "bold",
                textAlign: "start",
                //backgroundColor: "cyan",
              }}
            >
              {org.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
