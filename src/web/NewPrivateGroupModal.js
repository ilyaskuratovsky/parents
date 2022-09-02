import React, { useState } from "react";
import { Modal, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { useSelector } from "react-redux";
import * as UserInfo from "../common/UserInfo";
import * as Utils from "../common/Utils";
import * as Globals from "./Globals";
import * as MyButtons from "./MyButtons";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as Debug from "../common/Debug";

/*
  Screen 0 (org only): Select the organization - if school, the list is only schools otherwise its only activities.
    Can also open a new modal to create a new organization. (By default this organization will not be searchable until it is approved - so for now no)

  Screen 1: Name/Description 
    Group Type:
    (if School - add the grade - (Skip - this is the default choice default), 
      PTA
      Pre-K, K, 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th, 11th, 12th, Undergraduate, Graduate)
    Group expire?
      Summer 2021, Winter 2022, Spring 2023, Custom Date
  Screen 2: Type
    Private (Invite Only)
      This group is completely secret and only users invited to the group will become members
    Private (Request to Join)
      Users need to request to join to see your group
    Public (Posts by members only)
      Everyone can read your group but only members can post
    Public (Open to all)
      Anyone can read and post

*/
export default function NewPrivateGroupModal({ visible, createGroup, closeModal }) {
  const userInfo = useSelector((state) => state.main.userInfo);
  const [groupName, setGroupName] = useState(null);
  const [groupDescription, setGroupDescription] = useState(null);
  const [inviteByEmail, setInviteByEmail] = useState(null);
  const [invitees, setInvitees] = useState([]);
  const [invitesByEmailList, setInvitesByEmailList] = useState([]);
  const [processing, setProcessing] = useState(false);
  const debugMode = Debug.isDebugMode();

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

  let addList = [];
  for (let m of userGroupMemberships) {
    const groupId = m.groupId;
    const group = groupMap[groupId];
    const members = groupMembershipMap[groupId];
    for (let userGroupMemebership of members) {
      const userId = userGroupMemebership.uid;
      if (userId != userInfo.uid) {
        const user = userMap[userId];
        addList.push(user);
      }
    }
  }
  addList = Utils.uniqueArray(addList, (user) => user.uid);
  /*
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
        }
      }
    })();
  }, []);
  */
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
              <Text>New Group{debugMode ? " (New Private Group Modal)" : ""}</Text>
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
