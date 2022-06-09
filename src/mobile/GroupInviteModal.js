import React, { useState } from "react";
import { Modal, Text, View, TextInput, ScrollView } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";
import * as Controller from "../common/Controller";
import Portal from "./Portal";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import { CheckBox } from "react-native-elements";

import * as UserInfo from "../common/UserInfo";

export default function GroupInviteModal({ groupId, visible, onInvite, closeModal }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const {
    userList,
    schoolList,
    schoolMap,
    groupList,
    groupMap,
    userMap,
    userGroupMemberships,
    groupMembershipMap,
  } = useSelector((state) => {
    return {
      schoolList: state.main.schoolList,
      userList: state.main.userList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
      groupMembershipMap: state.main.groupMembershipMap,
      userMap: state.main.userMap,
    };
  });

  const [invitees, setInvitees] = useState([]);
  const [processing, setProcessing] = useState(false);
  /*
  let addList = UserInfo.groupInviteeList(
    userInfo,
    groupId,
    userGroupMemberships,
    groupMap,
    groupMembershipMap,
    userMap
  );
  */
  let addList = UserInfo.allUsers(userInfo, userMap);
  const [email, setEmail] = useState(null);
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
          center={<Text style={{ fontWeight: "bold", fontSize: 16 }}>Invite</Text>}
          right={null}
        />

        {addList.length > 0 && (
          <View
            style={{
              //flex: 1,
              padding: 10,
              height: 250,
              //backgroundColor: "yellow",
            }}
          >
            <Text>People You May Know</Text>
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
        <View style={{ flex: 1, flexDirection: "columnsw", paddingLeft: 10, paddingRight: 10 }}>
          <Text>Email(s)</Text>
          <View
            style={{
              flexDirection: "row",
              height: 60,
              alignItems: "center",
              //backgroundColor: "yellow",
            }}
          >
            <View style={{ flexDirection: "column", flex: 1 }}>
              <TextInput
                key="email"
                style={{ flex: 1, borderWidth: 1, width: "100%", fontSize: 12 }}
                onChangeText={(value) => {
                  setEmail(value);
                }}
                value={email ?? ""}
                selectTextOnFocus={true}
                autoCapitalize="none"
                multiline
                numberOfLines={4}
              />
              <Text style={{ fontSize: 10 }}>Enter emails separated by ','</Text>
            </View>
          </View>
        </View>
        <MyButtons.FormButton
          text="Invite"
          onPress={async () => {
            Controller.sendGroupInviteToEmail(userInfo, groupId, email);
            for (const inviteeUid of invitees) {
              Controller.sendGroupInviteToUser(userInfo, groupId, inviteeUid);
            }
            closeModal();
          }}
        />
        {/*
      <Text>Find People</Text>
      <ScrollView>{inviteeComponents}</ScrollView>
      <MyButtons.MenuButton
        icon="arrow-right"
        text="Done"
        onPress={() => {
          closeModal();
        }}
      />
      */}
      </Portal>
    </Modal>
  );
}
