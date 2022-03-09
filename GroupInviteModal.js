import React, { useState } from "react";
import { Modal, Text, View, TextInput, ScrollView } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";
import * as Controller from "./Controller";
import Portal from "./Portal";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";

export default function GroupInviteModal({
  groupId,
  visible,
  onInvite,
  closeModal,
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const {
    userList,
    schoolList,
    schoolMap,
    groupList,
    groupMap,
    userGroupMemberships,
  } = useSelector((state) => {
    return {
      schoolList: state.main.schoolList,
      userList: state.main.userList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });

  const [processing, setProcessing] = useState(false);
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

  /*
  const invitees = userList;
  const inviteeComponents = invitees.map((user) => {
    return (
      <View
        key={user.uid}
        style={{
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
          {user.displayName ?? user.email}
        </Text>
        <View
          style={{
            flexBasis: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MyButtons.FormButton
            text="Invite"
            onPress={async () => {
              await Controller.sendGroupInviteToUser(
                userInfo,
                groupId,
                user.id
              );
              closeModal();
            }}
          />
        </View>
      </View>
    );
  });
  */

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
          center={
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Invite</Text>
          }
          right={null}
        />
        <Text>Email</Text>
        <View
          style={{
            flexDirection: "row",
            height: 60,
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <TextInput
              key="email"
              style={{ borderWidth: 1, width: "100%", fontSize: 16 }}
              onChangeText={(value) => {
                setEmail(value);
              }}
              value={email ?? ""}
              selectTextOnFocus={true}
            />
            <Text>Enter emails separated by ','</Text>
          </View>
          <MyButtons.FormButton
            text="Invite"
            onPress={async () => {
              await Controller.sendGroupInviteToEmail(userInfo, groupId, email);
              closeModal();
            }}
          />
        </View>
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
