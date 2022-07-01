import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import NewSchoolGroupModal from "./NewSchoolGroupModal";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";
import * as Data from "../common/Data";
import * as Debug from "../common/Debug";
import { styles } from "./Styles";
import * as Utils from "../common/Utils";
import FacePile from "./FacePile";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";

/* 
People can "follow" orgs, this is a new relationship
When people follow orgs - they will receive notifications of all the happenings - new groups created
 - by default they will be subscribed to the org's general discussion group.  This subscription will be created automatically (ie a new group membership will be created).
    this means the user can explicitly unsubscribe since the group will come up.
- The default discussion group will have the chevron that you can open it up to the group (at the top of that page will be subscribe)
- This page will list all the groups including the general discussion group
    Groups can be private (Invite only)
    Groups can be private (Request to Join) - in which case you can indicate it with a "lock" icon.  For these groups you need to request to join
    Groups can be Public (Request to join)
    Groups can be public
    These will all be choices created when you create a new group
- you can follow groups explicitly (or you can follow an entire org)
Of the org page you should be able to create a group -
  this will take you to the "create group" page - which will have the org pre-selected (and as if you clicked new school group).  

*/

export default function SchoolScreen({ schoolId }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const userInfo = useSelector((state) => state.main.userInfo);
  const [loading, setLoading] = useState(false);
  const schoolGroups = Data.getOrgGroups(schoolId);
  const school = Data.getOrg(schoolId);

  let defaultOrgGroup = Data.getDefaultOrgGroup(schoolId);
  if (defaultOrgGroup == null) {
    defaultOrgGroup = {
      orgId: schoolId,
      id: "__placeholder_default_group_id_" + schoolId,
      name: school.name,
      description: school.name + " general discussion",
    };
  }

  const otherGroups = schoolGroups.filter((group) => {
    return group.type != "default_org_group";
  });

  otherGroups.sort((group1, group2) => {
    return 1; // todo sort these by grade
  });

  /*
  useEffect(() => {
    Controller.createDefaultOrgGroupIfNotExists(
      schoolId,
      school.name,
      school.name + " General Discussion"
    );
  });
  */

  /* search bar at the top */
  /* School Screen - 
- lists details about the school on top
- below has all of the groups in a list (with join button)
- At the bottom have: Don't see your group? Create a new one
 */

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        key="topbar"
        style={{}}
        left={
          <View
            style={{
              //backgroundColor: "cyan",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ alignItems: "flex-start" }}></View>
            <Text style={[{}, styles.topBarHeaderText]}>{school.name}</Text>
          </View>
        }
        center={<Text>{""}</Text>}
        right={null}
      />
      <View style={{ flexDirection: "row" }}>
        <MyButtons.FormButton text={"Follow"} />
        <MyButtons.FormButton text={"Invite"} />
      </View>
      {/* default group */}
      {debugMode ? <Text style={{ fontSize: 10 }}>{JSON.stringify(school)}</Text> : null}
      {debugMode ? (
        <Text style={{ fontSize: 10 }}>
          Default School Group: {JSON.stringify(defaultOrgGroup)}
        </Text>
      ) : null}
      <ScrollView
        style={{
          marginTop: 20,
          paddingLeft: 8,
          paddingRight: 8,
          flex: 1,
          flexDirection: "column",
        }}
      >
        <GroupView group={defaultOrgGroup} defaultOrgGroup={true} setLoading={setLoading} />
        {otherGroups.map((group) => {
          return <GroupView group={group} />;
        })}
        <View
          key={"school_" + school.id}
          style={{
            height: 150,
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/*
          {otherGroups.length == 0 && (
            <Text style={{ width: 160 }}>There are no specialized groups for {school.name}</Text>
          )}
          */}

          <TouchableOpacity
            onPress={() => {
              dispatch(Actions.goToScreen({ screen: "CREATE_GROUP" }));
            }}
          >
            <Text
              style={{
                fontSize: 20,
                textDecorationLine: "underline",
                color: "blue",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Create New Group
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toolbar />
    </Portal>
  );
}

function GroupView({ group, defaultOrgGroup, setLoading }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const groupId = group.id;
  let members = [];
  let userGroupMembership = null;
  if (!groupId.startsWith("__placeholder_default_group_id")) {
    members = Data.getGroupMemberships(groupId);
    userGroupMembership = Data.getUserGroupMemberships(group.id);
  }
  const userInfo = Data.getCurrentUser();
  return (
    <View
      key={groupId}
      style={{
        flex: 1,
        //backgroundColor: "cyan",
      }}
    >
      {debugMode && (
        <Text style={{ fontSize: 8 }}>
          {JSON.stringify(
            {
              user_group_membership: userGroupMembership?.id,
              group: group.id,
            },
            null,
            2
          )}
        </Text>
      )}
      <TouchableOpacity
        key={group.id}
        style={{
          flexDirection: "row",
          //height: Utils.isEmptyString(group.description) ? 60 : 80,
          alignItems: "flex-start",
          paddingLeft: 10,
        }}
        onPress={async () => {
          let groupId = group.id;
          if (groupId.startsWith("__placeholder_default_group_id_")) {
            const orgId = groupId.substring("__placeholder_default_group_id_".length);
            setLoading(true);
            groupId = await Controller.createDefaultOrgGroupIfNotExists(orgId);
          }

          dispatch(Actions.openModal({ modal: "GROUP", groupId: groupId }));
        }}
      >
        <View
          style={{
            flexGrow: 1,
            flexDirection: "column",
            //backgroundColor: "green",
          }}
        >
          <Text
            style={[
              {
                justifyContent: "center",
                alignItems: "flex-start",
                height: 22,
                //backgroundColor: "cyan",
                //fontFamily: "Helvetica Neue",
              },
              styles.header1,
            ]}
          >
            {group.name} {/*group.id*/}
          </Text>
          {!Utils.isEmptyString(group.description) && (
            <Text
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                fontSize: 11,
                fontWeight: "normal",
                color: UIConstants.BLACK_TEXT_COLOR,
                height: 16,
                //fontFamily: "Helvetica Neue",
              }}
            >
              {group.description}
            </Text>
          )}
          <View style={{ flex: 1, paddingTop: 4 }}>
            <FacePile
              userIds={(members ?? [])
                .filter((groupMembership) => {
                  return userInfo.uid != groupMembership.uid;
                })
                .map((groupMembership) => groupMembership.uid)}
              border
            />
          </View>
        </View>
        <View
          style={{
            flexBasis: 90,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            //backgroundColor: "brown",
          }}
        >
          <View
            style={{
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 2,
              alignItems: "flex-start",
              //backgroundColor: "purple",
            }}
          ></View>
          {!defaultOrgGroup && (
            <MyButtons.FormButton
              style={{ width: 100 }}
              text="Subscribe"
              onPress={async () => {
                if (groupId.startsWith("__placeholder_default_group_id_")) {
                  console.log("creating new default group");
                  const newGroupId = await Controller.createGroup(
                    group.name,
                    group.description,
                    "default_org_group",
                    group.orgId
                  );
                  await Controller.subscribeToGroup(userInfo, groupId);
                } else {
                  await Controller.subscribeToGroup(userInfo, group.id);
                }
              }}
            />
          )}
          {defaultOrgGroup && (
            <IconButton
              style={{
                //backgroundColor: "green",
                padding: 0,
                margin: 0,
              }}
              icon="chevron-right"
              color={"darkgrey"}
              size={32}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
