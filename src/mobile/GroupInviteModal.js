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
import * as Data from "../common/Data";
import * as Actions from "../common/Actions";

import * as UserInfo from "../common/UserInfo";

export default function GroupInviteModal({ groupId }) {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const [invitees, setInvitees] = useState([]);
  const [processing, setProcessing] = useState(false);
  let addList = Data.getAllUsers();
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
    <Modal visible={true} animationType={"slide"}>
      <Portal>
        <TopBarMiddleContentSideButtons
          style={{}}
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                dispatch(Actions.closeModal());
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
            dispatch(Actions.closeModal());
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
