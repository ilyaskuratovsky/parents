// @flow strict-local
import { useEffect, useState, useMemo } from "react";
import * as React from "react";
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
import * as Logger from "../common/Logger";
import * as Messages from "../common/MessageData";

export default function AdminScreen({}: {}): React.Node {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const allGroups = Data.getAllGroups();
  const users = Data.getAllUsers() ?? [];
  const [page, setPage] = useState(null);
  const groupMemberships = Data.getAllGroupMemberships();

  return (
    <Portal
      backgroundColor={UIConstants.DEFAULT_BACKGROUND}
      //backgroundColor="green"
    >
      <Text>Admin Screen</Text>
      <View style={{ marginLeft: 5, flexDirection: "row" }}>
        <View key={"home"} style={{ marginRight: 10, marginBottom: 12 }}>
          <MyButtons.LinkButton
            text="Home"
            onPress={() => {
              dispatch(Actions.goToScreen({ screen: "FEED" }));
            }}
          />
        </View>
        <View key={"groups"} style={{ marginRight: 10, marginBottom: 12 }}>
          <MyButtons.LinkButton
            text="Groups"
            onPress={() => {
              setPage("groups");
            }}
          />
        </View>
        <View key={"users"} style={{ marginRight: 5 }}>
          <MyButtons.LinkButton
            text="Users"
            onPress={() => {
              setPage("users");
            }}
          />
        </View>
        <View key={"memberships"} style={{ marginRight: 5 }}>
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
        <View style={{ flexDirection: "column" }}>
          <Text>Groups</Text>
          <ScrollView style={{ paddingBottom: 100, marginBottom: 200 }}>
            {allGroups.map((group) => {
              return <GroupView group={group} />;
            })}
          </ScrollView>
        </View>
      )}
      {/* Users */}
      {page === "users" && (
        <View style={{ flexDirection: "column" }}>
          <Text>Users</Text>
          <ScrollView style={{ marginBottom: 200 }}>
            {users.map((user) => {
              return <UserView user={user} />;
            })}
          </ScrollView>
        </View>
      )}

      {/* Group Memberships */}
      {page === "group_memberships" && (
        <View style={{ flexDirection: "column" }}>
          <Text>Group Memberships</Text>
          <ScrollView style={{ marginBottom: 200 }}>
            {groupMemberships.map((groupMembership) => {
              return <GroupMembershipView groupMembership={groupMembership} />;
            })}
          </ScrollView>
        </View>
      )}
    </Portal>
  );
}

function GroupView({ group }) {
  const dispatch = useDispatch();
  const members = Data.getGroupMemberships(group.id) ?? [];
  const groupMessages = Messages.getGroupUserRootMessages(group.id);

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
          <Text
            style={{
              width: 20,
              fontSize: 16,
              color: "red",
              fontWeight: "bold",
              backgroundColor: "yellow",
            }}
          >
            {members.length}
          </Text>
        ) : (
          <Text style={{ width: 20, fontSize: 10 }}>-</Text>
        )}
        {groupMessages != null && groupMessages.length > 0 ? (
          <Text
            style={{
              width: 200,
              fontSize: 16,
              color: "red",
              fontWeight: "bold",
              backgroundColor: "yellow",
            }}
          >
            {groupMessages.length}
          </Text>
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
              onPress: () => Logger.log("Cancel Pressed"),
              style: "cancel",
            },
          ]);
        }}
      />
    </View>
  );
}

function UserView({ user }) {
  const dispatch = useDispatch();
  const userGroupMemberships = Data.getUserGroupMemberships();

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
          flexDirection: "column",
        }}
      >
        <Text style={{ width: "100%", fontSize: 12, marginRight: 10 }}>
          {JSON.stringify(user, null, 2) ?? "<None>"}
        </Text>
      </View>
      <MyButtons.LinkButton
        style={{ marginTop: 4, marginBottom: 4 }}
        text="Delete"
        onPress={async () => {
          Alert.alert("Delete User?", null, [
            {
              text: "Yes",
              onPress: async () => {
                await Controller.deleteUser(user.uid);
              },
            },
            {
              text: "No",
              onPress: () => Logger.log("Cancel Pressed"),
              style: "cancel",
            },
          ]);
        }}
      />
    </View>
  );
}

function GroupMembershipView({ groupMembership }) {
  const dispatch = useDispatch();
  const group = Data.getGroup(groupMembership.groupId);

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
          flexDirection: "column",
        }}
      >
        <Text style={{ width: "100%", fontSize: 12, marginRight: 10 }}>
          Group Membership Object: {JSON.stringify(groupMembership, null, 2) ?? "<None>"}
        </Text>
        <Text style={{ width: "100%", fontSize: 12, marginRight: 10 }}>
          Group Object: {JSON.stringify(group) ?? "<Null>"}
        </Text>
      </View>
      <MyButtons.LinkButton
        style={{ marginTop: 4, marginBottom: 4 }}
        text="Delete"
        onPress={async () => {
          Alert.alert("Delete Group Membership " + groupMembership.id + "?", null, [
            {
              text: "Yes",
              onPress: async () => {
                await Controller.deleteGroupMembership(groupMembership.id);
              },
            },
            {
              text: "No",
              onPress: () => Logger.log("Cancel Pressed"),
              style: "cancel",
            },
          ]);
        }}
      />
    </View>
  );
}
