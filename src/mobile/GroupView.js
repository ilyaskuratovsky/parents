import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Controller from "../common/Controller";
import FacePile from "./FacePile";
import * as Globals from "./Globals";
import * as MyButtons from "./MyButtons";
import NewPrivateGroupModal from "./NewPrivateGroupModal";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as Utils from "../common/Utils";
import * as Debug from "../common/Debug";
import * as Data from "../common/Data";
import * as MessageUtils from "../common/MessageUtils";
import { Badge } from "react-native-elements";
import { styles } from "./Styles";

export default function GroupView({ groupId }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const group = Data.getGroup(groupId);
  const members = Data.getGroupMemberships(groupId);
  const userGroupMembership = Data.getUserGroupMemberships(groupId);
  const userInfo = Data.getCurrentUser();
  const unreadRootMessages = Data.getGroupUserRootUnreadMessages(groupId);
  const unreadCount = unreadRootMessages.length;
  return (
    <View
      key={groupId}
      style={{
        flex: 1,
        //backgroundColor: "cyan",
      }}
    >
      {debugMode && (
        <Text style={{ fontSize: 8 }}>
          {JSON.stringify(
            {
              user_group_membership: userGroupMembership.id,
              group: group.id,
              unreadRootMessages: JSON.stringify(unreadRootMessages.map((m) => m.id)),
            },
            null,
            2
          )}
        </Text>
      )}
      <TouchableOpacity
        key={group.id}
        style={{
          flexDirection: "row",
          //height: Utils.isEmptyString(group.description) ? 60 : 80,
          alignItems: "flex-start",
          paddingLeft: 10,
        }}
        onPress={() => {
          dispatch(Actions.goToScreen({ screen: "GROUP", groupId: group.id }));
        }}
      >
        <View
          style={{
            flexGrow: 1,
            flexDirection: "column",
            //backgroundColor: "green",
          }}
        >
          <Text
            style={[
              {
                justifyContent: "center",
                alignItems: "flex-start",
                height: 22,
                //backgroundColor: "cyan",
                //fontFamily: "Helvetica Neue",
              },
              styles.header1,
            ]}
          >
            {group.name} {/*group.id*/}
          </Text>
          {!Utils.isEmptyString(group.description) && (
            <Text
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                fontSize: 11,
                fontWeight: "normal",
                color: UIConstants.BLACK_TEXT_COLOR,
                height: 16,
                //fontFamily: "Helvetica Neue",
              }}
            >
              {group.description}
            </Text>
          )}
          <View style={{ flex: 1, paddingTop: 4 }}>
            <FacePile
              userIds={[userInfo.uid].concat(
                members
                  .filter((groupMembership) => {
                    return userInfo.uid != groupMembership.uid;
                  })
                  .map((groupMembership) => groupMembership.uid)
              )}
              border
            />
          </View>
        </View>
        <View
          style={{
            flexBasis: 90,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            //backgroundColor: "brown",
          }}
        >
          <View
            style={{
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 2,
              alignItems: "flex-start",
              //backgroundColor: "purple",
            }}
          >
            {(unreadCount ?? 0) > 0 ? (
              <Badge status="error" value={unreadCount} containerStyle={{}} />
            ) : null}
          </View>
          <IconButton
            style={{
              //backgroundColor: "green",
              padding: 0,
              margin: 0,
            }}
            icon="chevron-right"
            color={"darkgrey"}
            size={32}
          />
        </View>
      </TouchableOpacity>
      <Divider style={{ marginTop: 20, marginBottom: 10 }} width={3} color="lightgrey" />
    </View>
  );
}
