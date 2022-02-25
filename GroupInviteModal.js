import React, { useState } from "react";
import { Modal, Text, View, TextInput, ScrollView } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";

export default function GroupInviteModal({ groupId, visible, closeModal }) {
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

  const [gradeSelection, setGradeSelection] = useState(null);
  const [yearSelection, setYearSelection] = useState(null);
  const [groupName, setGroupName] = useState(null);
  const [processing, setProcessing] = useState(false);

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
          <MyButtons.FormButton text="Invite" onPress={() => {}} />
        </View>
      </View>
    );
  });

  return (
    <Modal visible={visible} animationType={"slide"}>
      <ScrollView>{inviteeComponents}</ScrollView>
      <MyButtons.MenuButton
        icon="arrow-right"
        text="Done"
        onPress={() => {
          closeModal();
        }}
      />
    </Modal>
  );
}
