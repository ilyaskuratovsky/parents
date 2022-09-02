import React, { useEffect, useState, useMemo } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import NewSchoolGroupModal from "./NewSchoolGroupModal";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";
import * as Data from "../common/Data";
import * as Debug from "../common/Debug";
import { styles } from "./Styles";
import * as Utils from "../common/Utils";
import FacePile from "./FacePile";
import { Divider, Icon } from "react-native-elements";
import { IconButton } from "react-native-paper";
import MessageViewContainer from "./MessageViewContainer";

export default function AdminScreen({}) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const allGroups = Data.getAllGroups();
  const [page, setPage] = useState(null);

  return (
    <Portal
      backgroundColor={UIConstants.DEFAULT_BACKGROUND}
      //backgroundColor="green"
    >
      <Text>Admin Screen</Text>
      <View style={{ marginLeft: 5, flexDirection: "row" }}>
        <View style={{ marginRight: 10, marginBottom: 20 }}>
          <MyButtons.LinkButton
            text="Home"
            onPress={() => {
              dispatch(Actions.goToScreen({ screen: "FEED" }));
            }}
          />
        </View>
        <View style={{ marginRight: 10, marginBottom: 20 }}>
          <MyButtons.LinkButton
            text="Groups"
            onPress={() => {
              setPage("groups");
            }}
          />
        </View>
        <View style={{ marginRight: 5 }}>
          <MyButtons.LinkButton
            text="Users"
            onPress={() => {
              setPage("users");
            }}
          />
        </View>
        <View style={{ marginRight: 5 }}>
          <MyButtons.LinkButton
            text="Memberships"
            onPress={() => {
              setPage("group_memberships");
            }}
          />
        </View>
      </View>
      {/* Groups */}
      {(page == null || page === "groups") && (
        <ScrollView style={{ marginBottom: 200 }}>
          {allGroups.map((group) => {
            return <GroupView group={group} />;
          })}
        </ScrollView>
      )}
      {/* Users */}
      {page === "users" &&
        allGroups.map((group) => {
          return <Text>{group.name}</Text>;
        })}

      {/* Group Memberships */}
      {page === "group_memberships" &&
        allGroups.map((group) => {
          return <Text>{group.name}</Text>;
        })}
    </Portal>
  );
}

function GroupView({ group }) {
  const dispatch = useDispatch();
  const members = Data.getGroupMemberships(group.id) ?? [];
  const groupMessages = Data.getGroupUserRootMessages(group.id);

  return (
    <View
      style={{
        marginLeft: 5,
        marginTop: 10,
        paddingBottom: 10,
        paddingTop: 10,
        flexDirection: "column",
        alignContent: "flex-end",
        backgroundColor: "lightgrey",
        justifyContent: "flex-end",
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <MyButtons.LinkButton
          style={{ width: 150, fontWeight: "bold", fontSize: 10 }}
          text={group.name}
          onPress={() => {
            dispatch(Actions.openModal({ modal: "GROUP", groupId: group.id }));
          }}
        />
        <Text style={{ width: 120, fontSize: 8, marginRight: 10 }}>{group.id}</Text>
        {members != null && members.length > 0 ? (
          <Text style={{ width: 20, fontSize: 10 }}>{members.length}</Text>
        ) : (
          <Text style={{ width: 20, fontSize: 10 }}>-</Text>
        )}
        {groupMessages != null && groupMessages.length > 0 ? (
          <Text style={{ width: 200, fontSize: 10 }}>{groupMessages.length}</Text>
        ) : (
          <Text style={{ width: 20, fontSize: 10 }}>-</Text>
        )}
        <Text style={{ width: 120, fontSize: 8 }}>{group.parentGroupId}</Text>
      </View>
      <MyButtons.LinkButton
        style={{ marginTop: 4, marginBottom: 4 }}
        text="Delete"
        onPress={async () => {
          Alert.alert("Delete Group?", null, [
            {
              text: "Yes",
              onPress: async () => {
                await Controller.deleteGroup(group.id);
              },
            },
            {
              text: "No",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
          ]);
        }}
      />
    </View>
  );
}
