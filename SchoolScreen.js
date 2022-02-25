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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function SchoolScreen({ schoolId }) {
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

  const school = schoolMap[schoolId];
  const schoolGroups = groupList.filter((group) => {
    return group.schoolId == schoolId;
  });
  const userGroupMembershipList = userGroupMemberships.map(
    (groupMembership) => groupMembership.groupId
  );
  const [visibleSchoolGroupModal, setVisibleSchoolGroupModal] = useState(null);

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

  /* search bar at the top */
  /* School Screen - 
- lists details about the school on top
- below has all of the groups in a list (with join button)
- At the bottom have: Don't see your group? Create a new one
 */

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}
        left={null}
        center={<Text>{school.name}</Text>}
        right={null}
      />

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {schoolGroups.map((group) => {
          return (
            <View
              key={"join_" + school.id + "_" + group.id}
              style={{
                width: "100%",
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
                  <MyButtons.FormButton
                    text="Open"
                    onPress={() => {
                      dispatch(
                        Actions.goToScreen({
                          screen: "GROUP",
                          groupId: group.id,
                        })
                      );
                    }}
                  />
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
        })}
      </View>
      <View
        key={"school_" + school.id}
        style={{
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text>Don't see your group?</Text>
        <TouchableOpacity
          onPress={() => {
            setVisibleSchoolGroupModal(school.id);
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
                backAction: () => Actions.goToUserScreen({ screen: "GROUPS" }),
              })
            );
          }}
        />
      </BottomBar>
    </Portal>
  );
}
