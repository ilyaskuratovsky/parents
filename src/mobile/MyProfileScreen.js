// @flow strict-local

import { useState } from "react";
import * as React from "react";
import { Text, View } from "react-native";
import { Avatar, Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import * as UserInfo from "../common/UserInfo";
import * as Logger from "../common/Logger";

export default function MyProfileScreen({}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { schoolList, schoolMap, groupList, groupMap, userGroupMemberships, orgsMap } = useSelector(
    (state) => {
      return {
        schoolList: state.main.schoolList,
        schoolMap: state.main.schoolMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
        userGroupMemberships: state.main.userGroupMemberships,
        orgsMap: state.main.orgsMap,
      };
    }
  );
  const [visibleSchoolGroupModal, setVisibleSchoolGroupModal] = useState(null);

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }

  const mySchools = (userInfo.profile ?? {}).schools ?? [];
  Logger.log("userInfo: " + JSON.stringify(userInfo));
  Logger.log("mySchools: " + JSON.stringify(mySchools));
  const mySchoolComponents = mySchools.map((schoolId) => {
    const school = orgsMap[schoolId];
    console.log("school: " + JSON.stringify(school));
    return (
      <View style={{ flex: 1, paddingLeft: 10 }}>
        <Text style={{ fontSize: 20 }}>{school.name}</Text>
      </View>
    );
  });

  return (
    <Portal backgroundColor={"transparent"}>
      <View style={{ flex: 1, paddingTop: 20 }}>
        {/* User Avatar section */}
        <View
          style={{
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 5,
            backgroundColor: "white",
            height: 80,
          }}
        >
          <Avatar
            size={60}
            rounded
            title={UserInfo.chatDisplayName(userInfo).charAt(0).toUpperCase()}
            containerStyle={{
              backgroundColor: UserInfo.avatarColor(userInfo),
              marginRight: 1,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 20,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  marginLeft: 5,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {UserInfo.chatDisplayName(userInfo)} {/**/ userInfo.uid /**/}
              </Text>
              <Text
                style={{
                  marginLeft: 5,
                  fontWeight: "normal",
                  fontSize: 12,
                }}
              >
                {userInfo.email}
              </Text>
            </View>
            <MyButtons.LinkButton
              text="Log Out"
              onPress={async () => {
                await Controller.logout(dispatch);
              }}
            />
          </View>
        </View>
        {/* Main grow view */}
        <View
          style={{
            flexGrow: 1,
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          {/* Schools */}
          <View
            style={{
              height: 40,
              paddingLeft: 10,
              paddingRight: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>My Schools</Text>
            <MyButtons.FormButton text="Manage" onPress={async () => {}} />
          </View>
          <Divider
            style={{ marginTop: 10, marginBottom: 15, zIndex: 999999 }}
            width={1}
            color="darkgrey"
          />
          {mySchoolComponents}
        </View>
        <Toolbar />
      </View>
    </Portal>
  );
}
