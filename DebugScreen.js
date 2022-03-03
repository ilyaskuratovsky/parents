import React, { useState } from "react";
import { Modal, Text, View, TextInput, SafeAreaView } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";
import JSONTree from "react-native-json-tree";
import * as Controller from "./Controller";
import Toolbar from "./Toolbar";
import * as Database from "./Database";

export default function DebugScreen({ backAction }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const {
    schoolList,
    schoolMap,
    groupList,
    groupMap,
    orgsList,
    userGroupMemberships,
  } = useSelector((state) => {
    return {
      schoolList: state.main.schoolList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
      orgsList: state.main.orgsList,
    };
  });

  const [addSchoolDisabled, setAddSchoolDisabled] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");

  return (
    <SafeAreaView>
      <View style={{ grow: 1 }}>
        <View
          style={{
            backgroundColor: "orange",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Add School</Text>
          <TextInput
            style={{ borderWidth: 1, width: 150 }}
            placeholder="School Name"
            onChangeText={(text) => setNewSchoolName(text)}
          />
          <MyButtons.FormButton
            text="Add"
            disabled={setAddSchoolDisabled}
            style={{ width: 100, fontSize: 10 }}
            onPress={async () => {
              setAddSchoolDisabled(true);
              await Database.createOrg(newSchoolName, "school");
              setAddSchoolDisabled(false);
            }}
          />
        </View>

        <JSONTree
          data={{
            user: userInfo,
            groups: groupList,
            user_group_memberships: userGroupMemberships,
            orgsList: orgsList,
          }}
        />
        <MyButtons.FormButton
          text="Back"
          onPress={() => {
            dispatch(backAction());
          }}
        />
      </View>
      <Toolbar />
    </SafeAreaView>
  );
}
