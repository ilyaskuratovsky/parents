// @flow strict-local

import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import GroupInviteModal from "./GroupInviteModal";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import * as Actions from "../common/Actions";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as UserInfo from "../common/UserInfo";
import * as Globals from "./Globals";
import { Avatar, Divider } from "react-native-elements";
import * as Logger from "../common/Logger";
import * as Debug from "../common/Debug";
import * as Data from "../common/Data";
import TabView from "./TabView";

export default function GroupSettingsModal({ groupId }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const userInfo = Data.getCurrentUser();
  const {
    userMap,
    userList,
    schoolList,
    schoolMap,
    groupList,
    groupMap,
    members,
    fromUserInvites,
  } = useSelector((state) => {
    return {
      userMap: state.main.userMap,
      schoolList: state.main.schoolList,
      userList: state.main.userList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      members: state.main.groupMembershipMap[groupId],
      fromUserInvites:
        state.main.fromUserInvites?.filter((invite) => invite.groupId == groupId) ?? [],
    };
  });

  const [processing, setProcessing] = useState(false);
  const group = Data.getGroup(groupId);
  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }
  if (processing) {
    return (
      <Modal visible={true}>
        <Text>Processing...</Text>
      </Modal>
    );
  }

  const invitees = userList;

  return (
    <Modal visible={true} animationType={"slide"}>
      <Portal>
        <TopBarMiddleContentSideButtons
          style={{}}
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                dispatch(Actions.closeModal());
              }}
              color="black"
            />
          }
          center={<Text style={{ fontWeight: "bold", fontSize: 16 }}>{group.name}</Text>}
          right={null}
        />
        <TabView
          tabHeadings={["Members", "Settings"]}
          tabs={[
            <GroupMembers
              groupId={groupId}
              members={members}
              userMap={userMap}
              fromUserInvites={fromUserInvites}
            />,
            <GroupSettings
              userInfo={userInfo}
              group={group}
              closeModal={() => {
                dispatch(Actions.closeModal());
              }}
            />,
          ]}
        />
      </Portal>
    </Modal>
  );
}

function GroupSettings({ userInfo, group, closeModal }) {
  const isDebugMode = Debug.isDebugMode();
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState(group.name);
  const [groupDescription, setGroupDescription] = useState(group.description);
  const { members } = useSelector((state) => {
    return {
      members: state.main.groupMembershipMap[group.id],
    };
  });
  const myGroupMemberships = members.filter(
    (group_membership) => group_membership.uid === userInfo.uid
  );

  return (
    <View
      style={{
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "column",
        height: 140,
        //backgroundColor: "cyan",
      }}
    >
      <TextInput
        key="group_name_input"
        style={{
          borderWidth: 1,
          paddingLeft: 10,
          height: 40,
          marginBottom: 20,
          fontSize: 16,
        }}
        onChangeText={(value) => {
          setGroupName(value);
        }}
        placeholder={"Group Name"}
        value={groupName ?? ""}
        selectTextOnFocus={true}
      />
      <TextInput
        key="group_description"
        style={{
          borderWidth: 1,
          paddingLeft: 10,
          height: 40,
          fontSize: 16,
        }}
        onChangeText={(value) => {
          setGroupDescription(value);
        }}
        placeholder={"Description"}
        value={groupDescription ?? ""}
        selectTextOnFocus={true}
      />
      <Text>Shared Calendar</Text>
      <Text
        style={{ color: "blue" }}
        onPress={() =>
          Linking.openURL(
            "https://firebasestorage.googleapis.com/v0/b/parents-749dd.appspot.com/o/calendars%2Ftest%2Ftest_calendar4.ics?alt=media&token=1bc2b780-e16e-4751-80fb-732c0399f90f"
          )
        }
      >
        Shared Calendar Link
      </Text>

      <MyButtons.FormButton
        text="Create Shared Calendar"
        onPress={async () => {
          await Controller.createSharedCalendar();
          closeModal();
        }}
      />
      <MyButtons.FormButton
        text="Save"
        onPress={async () => {
          await Controller.updateGroup(userInfo, group.id, {
            name: groupName,
            description: groupDescription,
          });
          closeModal();
        }}
      />
      <MyButtons.FormButton
        text="Leave Group"
        onPress={async () => {
          Alert.alert("Are You Sure?: " + JSON.stringify(myGroupMemberships), null, [
            {
              text: "Yes",
              onPress: async () => {
                for (const groupMembership of myGroupMemberships) {
                  await Controller.deleteGroupMembership(userInfo, groupMembership.id);
                }
                closeModal();
                dispatch(
                  Actions.goToScreen({
                    screen: "GROUPS",
                  })
                );
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
    </View>
  );
}

function GroupMembers({ groupId, members, userMap, fromUserInvites }) {
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const debugMode = Debug.isDebugMode();

  const memberComponents = members.map((groupMembership) => {
    const user = userMap[groupMembership.uid];
    return (
      <View
        key={user.uid ?? groupMembership.uid}
        style={{
          flexDirection: "row",
          height: 60,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingLeft: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 5,
          }}
        >
          {UserInfo.avatarComponent(user)}
          <Text
            style={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            {UserInfo.chatDisplayName(user)}
          </Text>
          {debugMode && <Text style={{ fontSize: 10 }}>gm: {groupMembership.id}</Text>}
        </View>
      </View>
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          paddingLeft: 10,
          paddingTop: 10,
          flexGrow: 1,
        }}
      >
        {memberComponents}
        <ScrollView style={{ height: 50, width: "100%" }}>
          <Text>Pending Invites</Text>
          {fromUserInvites.map((invite) => {
            const inviteUserId =
              invite.toUid != null && invite.toUid.indexOf("_uid_") == 0
                ? invite.toUid.substring(5)
                : null;

            const inviteEmail =
              invite.toUid != null && invite.toUid.indexOf("_email_") == 0
                ? invite.toUid.substring(7)
                : null;

            let component = null;
            if (inviteUserId != null) {
              const user = userMap[inviteUserId];
              component = <Text>{UserInfo.chatDisplayName(user)}</Text>;
            } else if (inviteEmail != null) {
              component = <Text>{inviteEmail}</Text>;
            } else {
              component = <Text>{JSON.stringify(invite)}</Text>;
            }

            return (
              <View style={{ flex: 1, padding: 10 }}>
                {component}
                {debugMode && <Text style={{ fontSize: 8 }}>{invite.id}</Text>}
              </View>
            );
          })}
        </ScrollView>
      </View>
      <MyButtons.FormButton
        text="Invite"
        onPress={async () => {
          dispatch(Actions.openModal({ modal: "GROUP_SETTINGS", groupId: group.id }));
        }}
      />
    </View>
  );
}
