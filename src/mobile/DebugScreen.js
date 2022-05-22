import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, View } from "react-native";
import JSONTree from "react-native-json-tree";
import { useDispatch, useSelector } from "react-redux";
import * as Database from "../common/Database";
import * as MyButtons from "./MyButtons";
import Toolbar from "./Toolbar";
import * as Globals from "./Globals";

export default function DebugScreen({ backAction }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { schoolList, schoolMap, groupList, groupMap, orgsList, userGroupMemberships } =
    useSelector((state) => {
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
        <MyButtons.FormButton
          text="Debug Mode Toggle"
          disabled={false}
          style={{ width: 100, fontSize: 10 }}
          onPress={async () => {
            Globals.dev = !Globals.dev;
          }}
        />
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
