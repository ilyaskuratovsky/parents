import React, { useState } from "react";
import { Modal, Text, View, TextInput, SafeAreaView } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";

export default function NewPrivateGroupModal({ visible, createGroup, closeModal }) {
  const userInfo = useSelector((state) => state.main.userInfo);
  const [groupName, setGroupName] = useState(null);
  const [groupDescription, setGroupDescription] = useState(null);
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
        <TopBarMiddleContentSideButtons
          left={<MyButtons.LinkButton text="Cancel" onPress={async () => {}} />}
          center={<Text>New Group</Text>}
          right={
            <MyButtons.LinkButton
              text="Done"
              onPress={async () => {
                setProcessing(true);
                await createGroup(groupName);
                closeModal();
              }}
            />
          }
        />
        <View
          style={{
            flexGrow: 1,
            paddingTop: 20,
            paddingLeft: 10,
            paddingRight: 10,
            flexDirection: "column",
            //backgroundColor: "cyan",
          }}
        >
          <TextInput
            key="group_name_input"
            style={{ borderWidth: 1, paddingLeft: 10, height: 40, marginBottom: 20, fontSize: 16 }}
            onChangeText={(value) => {
              setGroupName(value);
            }}
            placeholder={"Group Name"}
            value={groupName ?? ""}
            selectTextOnFocus={true}
          />
          <TextInput
            key="group_description"
            style={{ borderWidth: 1, paddingLeft: 10, height: 40, fontSize: 16 }}
            onChangeText={(value) => {
              setGroupDescription(value);
            }}
            placeholder={"Description"}
            value={groupDescription ?? ""}
            selectTextOnFocus={true}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
