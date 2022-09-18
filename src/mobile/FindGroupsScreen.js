import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert, TextInput } from "react-native";
import { Divider, SearchBar } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import NewPrivateGroupModal from "./NewGroupModal";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBarLeftContentSideButton from "./TopBarLeftContentSideButton";
import * as UIConstants from "./UIConstants";
import * as Data from "../common/Data";
import * as Debug from "../common/Debug";
import * as Logger from "../common/Logger";

export default function FindGroupsScreens({ navigation }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const userInfo = Data.getCurrentUser();
  const [searchResults, setSearchResults] = useState(null);
  const groups = Data.getAllOrgGroups();
  const orgsMap = Data.getAllOrgsMap();
  const groupMap = Data.getAllGroupsMap();
  const schoolGroups = groups.filter((group) => {
    if (group.orgId != null) {
      const org = orgsMap[group.orgId];
      if (org != null && org.type === "school") {
        return true;
      }
    }
    return false;
  });
  const otherOrgGroups = groups.filter((group) => {
    if (group.orgId != null) {
      const org = orgsMap[group.orgId];
      if (org != null && org.type != "school") {
        return true;
      }
    }
    return false;
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
  const [searchText, setSearchText] = useState("");
  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBarLeftContentSideButton
        style={{}}
        content={<Text style={{ fontWeight: "bold", fontSize: 20 }}>Find</Text>}
        side={null}
      />
      <View style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}>
        {userInfo.superUser && <NewSchool />}
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
        {/* search results */}
        {searchResults != null && searchResultsSection(dispatch, searchResults, orgsMap, groupMap)}

        {/* 'all schools/activities/groups' section */}
        {searchResults == null &&
          directorySection(dispatch, userInfo, schoolGroups, otherOrgGroups, orgsMap, debugMode)}
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
                  textAlign: "left",
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
                  textAlign: "left",
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

function directorySection(dispatch, user, schoolGroups, otherOrgGroups, orgsMap, isDebugMode) {
  return (
    <ScrollView
      style={{
        paddingLeft: 10,
        flexGrow: 1,
        flexDirection: "column",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Schools</Text>
      {isDebugMode && (
        <Text style={{ fontSize: 8 }}>
          School groups count: {schoolGroups.length}, Other groups count: {otherOrgGroups.length}
        </Text>
      )}
      <Divider style={{ marginTop: 10, marginBottom: 10 }} width={1} color="lightgrey" />
      {schoolGroups
        .sort(function (g1, g2) {
          const org1 = orgsMap[g1.orgId];
          const org2 = orgsMap[g2.orgId];
          return org1.name.toUpperCase().localeCompare(org2.name.toUpperCase());
        })
        .map((schoolGroup) => {
          const school = orgsMap[schoolGroup.orgId];
          return (
            <TouchableOpacity
              onPress={async () => {
                /*
                dispatch(
                  Actions.goToScreen({
                    screen: "SCHOOL",
                    schoolId: school.id,
                  })
                );
                */
                dispatch(
                  Actions.openModal({
                    modal: "SCHOOL_GROUP",
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
                  textAlign: "left",
                  //backgroundColor: "cyan",
                }}
              >
                {school.name}
              </Text>
              {isDebugMode && <Text>{JSON.stringify(schoolGroup)}</Text>}
              {isDebugMode && user.superUser && (
                <MyButtons.LinkButton
                  text="(Admin) Delete Group"
                  onPress={async () => {
                    Alert.alert("Delete Group?", null, [
                      {
                        text: "Yes",
                        onPress: async () => {
                          await Controller.deleteGroup(schoolGroup.id);
                        },
                      },
                      {
                        text: "No",
                        onPress: () => Logger.log("Cancel Pressed"),
                        style: "cancel",
                      },
                    ]);
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      <Text style={{ marginTop: 20, fontSize: 20, fontWeight: "bold" }}>Activities</Text>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} width={1} color="lightgrey" />
      {otherOrgGroups.map((orgGroup) => {
        const org = orgsMap[orgGroup.orgId];
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
                //backgroundColor: "cyan",
              }}
            >
              {org.name}
            </Text>
            {isDebugMode && <Text>{JSON.stringify({ groupId: orgGroup.id, orgId: org.id })}</Text>}
            {isDebugMode && user.superUser && (
              <MyButtons.LinkButton
                text="(Admin) Delete Group"
                onPress={async () => {
                  Alert.alert("Delete Group?", null, [
                    {
                      text: "Yes",
                      onPress: async () => {
                        await Controller.deleteGroup(orgGroup.id);
                      },
                    },
                    {
                      text: "No",
                      onPress: () => Logger.log("Cancel Pressed"),
                      style: "cancel",
                    },
                  ]);
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function NewSchool() {
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);

  return (
    <View
      style={{
        paddingTop: 4,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "column",
        height: 100,
        width: "100%",
        //backgroundColor: "cyan",
      }}
    >
      <TextInput
        key="group_name_input"
        style={{
          borderWidth: 1,
          paddingLeft: 10,
          height: 30,
          fontSize: 12,
        }}
        onChangeText={(value) => {
          setName(value);
        }}
        placeholder={"Group Name"}
        value={name ?? ""}
        selectTextOnFocus={true}
      />
      <TextInput
        key="group_description"
        style={{
          borderWidth: 1,
          paddingLeft: 10,
          height: 30,
          fontSize: 12,
        }}
        onChangeText={(value) => {
          setDescription(value);
        }}
        placeholder={"Description"}
        value={description ?? ""}
        selectTextOnFocus={true}
      />
      <MyButtons.FormButton
        text="Create School"
        style={{ width: 100 }}
        titleStyle={{ fontSize: 10 }}
        onPress={async () => {
          await Controller.createOrgGroup(name, description, "school");
        }}
      />
    </View>
  );
}
