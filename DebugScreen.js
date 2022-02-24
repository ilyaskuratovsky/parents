import React, { useState } from "react";
import { Modal, Text, View, TextInput } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";
import JSONTree from "react-native-json-tree";

export default function DebugScreen({ backAction }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { schoolList, schoolMap, groupList, groupMap, userGroupMemberships } =
    useSelector((state) => {
      return {
        schoolList: state.main.schoolList,
        schoolMap: state.main.schoolMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
        userGroupMemberships: state.main.userGroupMemberships,
      };
    });

  return (
    <View>
      <JSONTree
        data={{
          user: userInfo,
          groups: groupList,
          user_group_memberships: userGroupMemberships,
        }}
      />
      <MyButtons.FormButton
        text="Back"
        onPress={() => {
          dispatch(backAction());
        }}
      />
    </View>
  );
}
