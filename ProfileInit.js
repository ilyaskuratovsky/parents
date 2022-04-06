import React, { useState } from "react";
import { Text, TouchableOpacity, View, Modal, TextInput } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as Paper from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { groupMemberships } from "./Actions";
import * as MyButtons from "./MyButtons";
import * as Controller from "./Controller";
import * as Globals from "./Globals";
import Portal from "./Portal";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";

export default function ProfileInit(props) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const visible =
    userInfo.profileInitialized == null || userInfo.profileInitialized == false;
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType={"slide"}>
      {visible && <ModalContainer userInfo={userInfo} />}
    </Modal>
  );
}

function ModalContainer({ userInfo }) {
  const [firstName, setFirstName] = useState(userInfo.firstName);
  const [lastName, setLastName] = useState(userInfo.lastName);
  return (
    <Portal>
      <TopBarMiddleContentSideButtons
        style={{}}
        left={null}
        center={
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Profile Setup
          </Text>
        }
        right={
          <MyButtons.LinkButton
            text="Done"
            onPress={async () => {
              await Controller.initializeProfile(
                userInfo.uid,
                firstName,
                lastName
              );
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
          key="first_name_input"
          style={{
            borderWidth: 1,
            paddingLeft: 10,
            height: 40,
            marginBottom: 20,
            fontSize: 16,
          }}
          onChangeText={(value) => {
            setFirstName(value);
          }}
          placeholder={"First Name"}
          value={firstName ?? ""}
          selectTextOnFocus={true}
        />
        <TextInput
          key="last_name_input"
          style={{
            borderWidth: 1,
            paddingLeft: 10,
            height: 40,
            fontSize: 16,
          }}
          onChangeText={(value) => {
            setLastName(value);
          }}
          placeholder={"Last Name"}
          value={lastName ?? ""}
          selectTextOnFocus={true}
        />
      </View>
    </Portal>
  );
}
