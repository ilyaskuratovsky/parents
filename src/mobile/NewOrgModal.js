// @flow strict-local

import { useState } from "react";
import * as React from "react";
import { Modal, Text, View, TextInput } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";

export default function NewOrgModal({ schoolId, visible, onCreateOrg, closeModal }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { orgsList, orgsMap, groupList, groupMap, userGroupMemberships } = useSelector((state) => {
    return {
      orgsList: state.main.schoolList,
      orgsMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });
  const [typeSelection, setTypeSelection] = useState(null);
  const [name, setName] = useState(null);
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

  const types = [
    { type: "school", label: "School" },
    { type: "activities_spors", label: "Activities: Sports" },
    { type: "activities_other", label: "Activities: Other" },
    { type: "other", label: "Other" },
  ];
  return (
    <Modal visible={visible} animationType={"slide"}>
      <Text key="type">Type</Text>
      <View key="types" style={{ flexDirection: "row" }}>
        {types.map((type) => {
          return (
            <Paper.Button
              key={"type"}
              mode={typeSelection == type.type ? "contained" : "outlined"}
              compact="true"
              onPress={() => {
                setTypeSelection(type.type);
              }}
            >
              {type.label}
            </Paper.Button>
          );
        })}
      </View>
      <Text key="name_label">Name</Text>
      <TextInput
        key="name_input"
        style={{ borderWidth: 1, width: "100%", fontSize: 16 }}
        onChangeText={(value) => {
          setName(value);
        }}
        value={name ?? ""}
        selectTextOnFocus={true}
      />
      <MyButtons.FormButton
        key="create_button"
        text="Create"
        onPress={() => {
          setProcessing(true);
          onCreateOrg(name, typeSelection).then(() => {
            setProcessing(false);
            closeModal();
          });
        }}
      />
    </Modal>
  );
}
