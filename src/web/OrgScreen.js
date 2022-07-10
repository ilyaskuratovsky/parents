import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import NewOrgGroupModal from "./NewOrgGroupModal";
import Portal from "./Portal";
import * as Actions from "../common/Actions";
import BottomBar from "./BottomBar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";

export default function OrgScreen({ orgId }) {
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

  const org = orgsMap[orgId];
  const orgGroups = groupList.filter((group) => {
    return group.orgId == orgId;
  });
  const userGroupMembershipList = userGroupMemberships.map(
    (groupMembership) => groupMembership.groupId
  );
  const [visibleOrgGroupModal, setVisibleOrgGroupModal] = useState(null);

  const createOrgGroup = async function (groupName) {
    return Controller.createOrgGroupAndJoin(dispatch, userInfo, org.id, groupName);
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
        center={<Text>{org.name}</Text>}
        right={null}
      />

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {orgGroups.map((group) => {
          return (
            <View
              key={"join_" + org.id + "_" + group.id}
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
                      Controller.joinGroup(userInfo.uid, group.id);
                    }}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
      <View
        key={"org_" + org.id}
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
            setVisibleOrgGroupModal(true);
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
        <NewOrgGroupModal
          key="newgroupmodal"
          visible={visibleOrgGroupModal}
          onCreateGroup={createOrgGroup}
          closeModal={() => {
            console.log("close modal called");
            setVisibleOrgGroupModal(false);
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
                backAction: () => Actions.goToUserScreen({ screen: "FIND_GROUPS" }),
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
              Actions.goToScreen({
                screen: "DEBUG",
                backAction: () => Actions.goToScreen({ screen: "GROUPS" }),
              })
            );
          }}
        />
      </BottomBar>
    </Portal>
  );
}
