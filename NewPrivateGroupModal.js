import React, { useState } from "react";
import { Modal, Text, View, TextInput, SafeAreaView } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";

export default function NewPrivateGroupModal({
  visible,
  createGroup,
  closeModal,
}) {
  const userInfo = useSelector((state) => state.main.userInfo);
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
      <SafeAreaView>
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
          text="Join"
          onPress={async () => {
            setProcessing(true);
            await createGroup(groupName);
            closeModal();
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}
