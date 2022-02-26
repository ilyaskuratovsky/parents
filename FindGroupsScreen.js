import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
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
import NewOrgModal from "./NewOrgModal";

export default function FindGroupsScreens({ navigation }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { orgsList, orgsMap, groupList, groupMap, userGroupMemberships } =
    useSelector((state) => {
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

  const [visibleNewOrgModal, setVisibleNewOrgModal] = useState(false);
  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}
        left={null}
        center={<Text>Groups</Text>}
        right={null}
      />
      <View
        style={{ flex: 1, flexDirection: "column", alignItems: "flex-start" }}
      >
        <SearchBar
          key="search"
          round
          searchIcon={{ size: 24 }}
          onChangeText={(text) => {}}
          onClear={(text) => {}}
          placeholder="Search..."
          value={""}
        />
        <Text>Schools</Text>
        {schoolList.map((school) => {
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
            >
              <Text
                style={{
                  fontSize: 12,
                  textDecorationLine: "underline",
                  color: "blue",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {school.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Text>Activities</Text>
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
                  fontSize: 12,
                  textDecorationLine: "underline",
                  color: "blue",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {org.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View
          key={"new"}
          style={{
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Text>Can't find your organization or school?</Text>
          <TouchableOpacity
            onPress={() => {
              setVisibleNewOrgModal(true);
            }}
          >
            <Text
              style={{
                fontSize: 12,
                textDecorationLine: "underline",
                color: "blue",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Create a new one
            </Text>
          </TouchableOpacity>
          <NewOrgModal
            key="newgroupmodal"
            visible={visibleNewOrgModal}
            onCreateOrg={createOrg}
            closeModal={() => {
              console.log("close modal called");
              setVisibleNewOrgModal(null);
            }}
          />
        </View>

        <BottomBar style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}>
          <MyButtons.FormButton
            text="Groups"
            onPress={() => {
              dispatch(
                Actions.goToUserScreen({
                  screen: "DEBUG",
                  backAction: () =>
                    Actions.goToUserScreen({ screen: "FIND_GROUPS" }),
                })
              );
            }}
          />
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
