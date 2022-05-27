import React, { useState } from "react";
import { Modal, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { useSelector } from "react-redux";
import * as UserInfo from "../common/UserInfo";
import * as Utils from "../common/Utils";
import * as Globals from "./Globals";
import * as MyButtons from "./MyButtons";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";

export default function NewPrivateGroupModal({ visible, createGroup, closeModal }) {
  const userInfo = useSelector((state) => state.main.userInfo);
  const [groupName, setGroupName] = useState(null);
  const [groupDescription, setGroupDescription] = useState(null);
  const [inviteByEmail, setInviteByEmail] = useState(null);
  const [invitees, setInvitees] = useState([]);
  const [invitesByEmailList, setInvitesByEmailList] = useState([]);
  const [processing, setProcessing] = useState(false);

  const { groupMap, userGroupMemberships, groupMembershipMap, userMap } = useSelector((state) => {
    return {
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
      groupMembershipMap: state.main.groupMembershipMap,
      userMap: state.main.userMap,
    };
  });

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }
  if (processing) {
    return (
      <Modal visible={true}>
        <Text>Creating group...</Text>
      </Modal>
    );
  }

  console.log("getting group invitee list");

  let addList = UserInfo.groupInviteeList(
    userInfo,
    null,
    userGroupMemberships,
    groupMap,
    groupMembershipMap,
    userMap
  );
  console.log("got group invitee list");

  return (
    <Modal visible={visible} animationType={"slide"}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopBarMiddleContentSideButtons
          left={
            <MyButtons.LinkButton
              text="Cancel"
              onPress={async () => {
                closeModal();
              }}
            />
          }
          center={
            <View style={{ flex: 1 }}>
              <Text>New Group</Text>
              {Globals.dev && <Text>NewPrivateGroupModal.js</Text>}
            </View>
          }
          right={
            <MyButtons.LinkButton
              text="Done"
              onPress={async () => {
                await createGroup(groupName, invitees, invitesByEmailList);
                closeModal();
              }}
            />
          }
        />
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
        </View>
        {addList.length > 0 && (
          <View
            style={{
              flexGrow: 1,
              padding: 10,
              //backgroundColor: "yellow",
            }}
          >
            <Text>Add People</Text>
            <ScrollView style={{ flex: 1, flexDirection: "row" }}>
              {addList.map((user) => {
                return (
                  <View
                    key={user.uid}
                    style={{
                      height: 60,
                      justifyContent: "flex-start",
                      alignContent: "center",
                      //backgroundColor: "cyan",
                      borderWidth: 0,
                      flexDirection: "row",
                    }}
                  >
                    <CheckBox
                      checked={invitees.includes(user.uid)}
                      onPress={() => {
                        let newInviteeList = [...invitees];
                        if (newInviteeList.includes(user.uid)) {
                          newInviteeList = newInviteeList.filter((i) => i != user.uid);
                        } else {
                          newInviteeList.push(user.uid);
                        }
                        setInvitees(newInviteeList);
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          alignItems: "center",
                          //backgroundColor: "orange",
                        }}
                      >
                        {UserInfo.chatDisplayName(user)}
                      </Text>
                      <Text
                        style={{
                          alignItems: "center",
                          alignSelf: "flex-start",
                          fontSize: 10,
                          //backgroundColor: "orange",
                        }}
                      >
                        {user.email}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        <View
          style={{
            height: 160,
            padding: 10,
            //backgroundColor: "yellow",
          }}
        >
          <Text>Invite By Email</Text>
          {invitesByEmailList.length > 0 && (
            <View style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1 }}>
                {invitesByEmailList.map((email) => {
                  return <Text>{email}</Text>;
                })}
              </ScrollView>
            </View>
          )}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TextInput
              key="invite_by_email_input"
              style={{
                borderWidth: 1,
                paddingLeft: 10,
                height: 40,
                marginBottom: 20,
                fontSize: 16,
              }}
              onChangeText={(value) => {
                setInviteByEmail(value);
              }}
              placeholder={"Email"}
              value={inviteByEmail ?? ""}
              selectTextOnFocus={true}
              autoCapitalize={"none"}
            />
            <MyButtons.FormButton
              text="Add"
              onPress={() => {
                const newList = [...invitesByEmailList];
                newList.push(inviteByEmail);
                setInvitesByEmailList(newList);
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
