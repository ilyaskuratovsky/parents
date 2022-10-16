// @flow strict-local

import { useState } from "react";
import * as React from "react";
import { Modal, Text, View, TextInput } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";

export default function NewOrgGroupModal({ orgId, visible, onCreateGroup, closeModal }) {
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
  const [groupName, setGroupName] = useState(null);
  const [processing, setProcessing] = useState(false);

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

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Text key="group_name_label">Group Name</Text>
      <TextInput
        key="group_name_input"
        style={{ borderWidth: 1, width: "100%", fontSize: 16 }}
        onChangeText={(value) => {
          setGroupName(value);
        }}
        value={groupName ?? ""}
        selectTextOnFocus={true}
      />
      <MyButtons.FormButton
        key="create_button"
        text="Create"
        onPress={() => {
          setProcessing(true);
          onCreateGroup(groupName).then(() => {
            setProcessing(false);
            closeModal();
          });
        }}
      />
    </Modal>
  );
}
