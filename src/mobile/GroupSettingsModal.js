import React, { useState } from "react";
import { Alert, Modal, Text, View, ScrollView, TouchableOpacity, TextInput } from "react-native";
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

export default function GroupSettingsModal({ groupId, visible, closeModal }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
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
  //console.log("fromUserInviets: " + (fromUserInvites ? fromUserInvites.length : "null"));

  const [processing, setProcessing] = useState(false);
  const group = groupMap[groupId];
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
    <Modal visible={visible} animationType={"slide"}>
      <Portal>
        <TopBarMiddleContentSideButtons
          style={{}}
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                closeModal();
              }}
              color="black"
            />
          }
          center={<Text style={{ fontWeight: "bold", fontSize: 16 }}>{group.name}</Text>}
          right={null}
        />
        <TabView
          tab1={
            <GroupMembers
              groupId={groupId}
              members={members}
              userMap={userMap}
              fromUserInvites={fromUserInvites}
            />
          }
          tab2={<GroupSettings userInfo={userInfo} group={group} closeModal={closeModal} />}
        />
      </Portal>
    </Modal>
  );
}

function TabView({ tab1, tab2 }) {
  const [visibleTab, setVisibleTab] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 40,
          flexDirection: "row",
          //, backgroundColor: "yellow"
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          onPress={() => {
            setVisibleTab(0);
          }}
        >
          <Text style={{ fontSize: 18, textDecorationLine: visibleTab == 0 ? "underline" : null }}>
            Members
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          onPress={() => {
            setVisibleTab(1);
          }}
        >
          <Text style={{ fontSize: 18, textDecorationLine: visibleTab == 1 ? "underline" : null }}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
      <Divider style={{ marginBottom: 10 }} width={1} color="darkgrey" />
      {visibleTab == 0 && tab1}
      {visibleTab == 1 && tab2}
    </View>
  );
}

function GroupSettings({ userInfo, group, closeModal }) {
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState(group.name);
  const [groupDescription, setGroupDescription] = useState(group.description);
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
      <MyButtons.FormButton
        text="Save"
        onPress={async () => {
          await Controller.updateGroup(userInfo, group.id, {
            name: groupName,
            description: groupDescription,
          });
          Logger.log("going to screen tab");
          closeModal();
        }}
      />
      <MyButtons.FormButton
        text="Delete Group"
        onPress={async () => {
          Alert.alert("Are You Sure?", null, [
            {
              text: "Yes",
              onPress: async () => {
                await Controller.deleteGroup(userInfo, group.id);
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
              onPress: () => console.log("Cancel Pressed"),
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
                {Globals.dev && <Text style={{ fontSize: 8 }}>{invite.id}</Text>}
              </View>
            );
          })}
        </ScrollView>
      </View>
      <MyButtons.FormButton
        text="Invite"
        onPress={async () => {
          setInviteModalVisible(true);
        }}
      />
      <GroupInviteModal
        groupId={groupId}
        visible={inviteModalVisible}
        closeModal={() => {
          setInviteModalVisible(false);
        }}
        onInvite={async () => {}}
      />
    </View>
  );
}
