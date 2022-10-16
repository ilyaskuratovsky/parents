// @flow strict-local

import { useState } from "react";
import * as React from "react";
import { Modal, Text, View, TextInput, ScrollView, Alert } from "react-native";
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
import TabView from "./TabView";
import Checkbox from "./Checkbox";
import * as Utils from "../common/Utils";

import * as UserInfo from "../common/UserInfo";

type Props = {
  groupId: string,
};

export default function GroupInviteModal({ groupId }: Props): React.Node {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
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
        <TabView
          tabHeadings={["People", "Contacts", "Email"]}
          tabs={[
            <People
              onSend={(invitees) => {
                for (const inviteeUid of invitees) {
                  Controller.sendGroupInviteToUser(userInfo, groupId, inviteeUid);
                }
                dispatch(Actions.closeModal());
              }}
            />,
            <Contacts
              onSend={() => {
                dispatch(Actions.closeModal());
              }}
            />,
            <Email
              onSend={async (emails) => {
                await Controller.sendGroupInviteToEmails(userInfo, groupId, emails);
                Alert.alert("Invites sent");
                dispatch(Actions.closeModal());
              }}
            />,
          ]}
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
function People({ onSend }) {
  const userInfo = Data.getCurrentUser();
  const dispatch = useDispatch();
  const [invitees, setInvitees] = useState([]);
  let addList = Data.getAllUsers();
  return (
    <View
      style={{
        flex: 1,
        padding: 10,

        //height: 250,
        //backgroundColor: "yellow",
      }}
    >
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
      <View style={{ alignItems: "center", width: "100%" }}>
        <MyButtons.FormButton
          style={{ width: 200, padding: 8 }}
          text="Send Invite"
          onPress={async () => {
            onSend(invitees);
          }}
        />
      </View>
    </View>
  );
}

function Email({ onSend }) {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const [email, setEmail] = useState(null);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "columns",
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          height: 160,
          width: "100%",
          alignItems: "flex-start",
          //backgroundColor: "yellow",
        }}
      >
        <Text style={{ fontSize: 10 }}>Enter emails separated by ','</Text>
        <View
          style={{
            //backgroundColor: "cyan",
            flexDirection: "column",
            flex: 1,
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <TextInput
            key="email"
            style={{ flex: 1, borderWidth: 1, width: "100%", fontSize: 12, height: 100 }}
            onChangeText={(value) => {
              setEmail(value);
            }}
            value={email ?? ""}
            selectTextOnFocus={true}
            autoCapitalize="none"
            multiline
            numberOfLines={4}
          />
        </View>
        <Text style={{ marginTop: 10, marginBottom: 10 }}>
          {Utils.parseEmails(email)?.join("\r\n")}
        </Text>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          flex: 1,
          //backgroundColor: "yellow"
        }}
      >
        <MyButtons.FormButton
          style={{ width: 200, padding: 8 }}
          text="Send Invite"
          onPress={async () => {
            const emails = Utils.parseEmails(email);
            onSend(emails);
          }}
        />
      </View>
    </View>
  );
}

function Contacts() {
  return (
    <View style={{ flex: 1, flexDirection: "columns", paddingLeft: 10, paddingRight: 10 }}>
      <Text>Contacts</Text>
    </View>
  );
}
