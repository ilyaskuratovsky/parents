// @flow strict-local

import React, { useState } from "react";
import { Modal, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { useSelector } from "react-redux";
import * as UserInfo from "../common/UserInfo";
import * as Utils from "../common/Utils";
import * as Globals from "./Globals";
import * as MyButtons from "./MyButtons";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";

export default function SelectUsers({ onSelect, onDeselect }) {
  const { groupMap, userGroupMemberships, groupMembershipMap, userMap } = useSelector((state) => {
    return {
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
      groupMembershipMap: state.main.groupMembershipMap,
      userMap: state.main.userMap,
    };
  });

  const [selected, setSelected] = useState();

  let addList = [];
  for (let m of userGroupMemberships) {
    const groupId = m.groupId;
    const group = groupMap[groupId];
    const members = groupMembershipMap[groupId];
    for (let userGroupMemebership of members) {
      const userId = userGroupMemebership.uid;
      if (userId != userInfo.uid) {
        const user = userMap[userId];
        addList.push(user);
      }
    }
  }
  addList = Utils.uniqueArray(addList, (user) => user.uid);
  return (
    <View style={{ flex: 1 }}>
      {addList.length > 0 && (
        <View
          style={{
            flexGrow: 1,
            padding: 10,
            //backgroundColor: "yellow",
          }}
        >
          <Text>Add People</Text>
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
                    checked={selected.includes(user.uid)}
                    onPress={() => {
                      if (selected.includes(user.uid)) {
                        selected = selected.filter((uid) => user.uid != uid);
                      } else {
                        selected.push(user.uid);
                      }
                      setSelected(selected);
                      onUpdate(selected);
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
    </View>
  );
}
