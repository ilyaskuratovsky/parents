import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import NewSchoolGroupModal from "./NewSchoolGroupModal";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";

export default function SchoolScreen({ schoolId }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { orgsList, orgsMap, groupList, groupMap, userGroupMemberships } = useSelector((state) => {
    return {
      orgsList: state.main.orgsList,
      orgsMap: state.main.orgsMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });

  const school = orgsMap[schoolId];
  const schoolGroups = groupList.filter((group) => {
    return group.orgId == schoolId;
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

      <ScrollView
        style={{
          flex: 1,
          flexDirection: "column",
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
                        Actions.openModal({
                          modal: "GROUP",
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
                      Controller.joinGroup(userInfo.uid, group.id);
                    }}
                  />
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
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
      <Toolbar />
    </Portal>
  );
}
