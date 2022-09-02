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

/* 
People can "follow" orgs, this is a new relationship
When people follow orgs - they will receive notifications of all the happenings - new groups created
 - by default they will be subscribed to the org's general discussion group.  This subscription will be created automatically (ie a new group membership will be created).
    this means the user can explicitly unsubscribe since the group will come up.
- The default discussion group will have the chevron that you can open it up to the group (at the top of that page will be subscribe)
- This page will list all the groups including the general discussion group
    Groups can be private (Invite only)
    Groups can be private (Request to Join) - in which case you can indicate it with a "lock" icon.  For these groups you need to request to join
    Groups can be Public (Request to join)
    Groups can be public
    These will all be choices created when you create a new group
- you can follow groups explicitly (or you can follow an entire org)
Of the org page you should be able to create a group -
  this will take you to the "create group" page - which will have the org pre-selected (and as if you clicked new school group).  

*/

export default function SchoolScreen({ schoolId }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const userInfo = useSelector((state) => state.main.userInfo);
  const [loading, setLoading] = useState(false);
  const group = Data.getOrgGroup(schoolId);
  const members = Data.getGroupMemberships(group.id) ?? [];
  const isMember = members.filter((gm) => gm.uid === userInfo.uid).length > 0;
  const school = Data.getOrg(schoolId);
  const subGroups = Data.getSubGroups(group.id).filter(
    (group) =>
      group.type === "public_membersonly" ||
      group.type === "private_requesttojoin" ||
      group.type === "public"
  );

  /* search bar at the top */
  /* School Screen - 
- lists details about the school on top
- below has all of the groups in a list (with join button)
- At the bottom have: Don't see your group? Create a new one
 */
  useEffect(() => {
    Controller.observeGroupMessages(dispatch, group.id);
  }, []);

  return (
    <Modal visible={true} animationType={"slide"}>
      <Portal
        backgroundColor={UIConstants.DEFAULT_BACKGROUND}
        //backgroundColor="green"
      >
        {/* top bar section */}
        <View
          style={{
            //backgroundColor: "whitesmoke",
            flexDirection: "column",
          }}
        >
          {/* group name and members row */}
          <View
            style={[
              {
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 8,
                paddingBottom: 0,
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                //backgroundColor: "cyan",
              },
            ]}
          >
            {/* group name */}
            <View
              style={{
                flexGrow: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                //backgroundColor: "cyan",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  //backgroundColor: "yellow",
                  alignItems: "flex-start",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    dispatch(Actions.closeModal());
                  }}
                >
                  <Icon name="chevron-left" />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "column",
                    //backgroundColor: "yellow"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      //setGroupSettingsModalVisible(true);
                      dispatch(Actions.openModal({ modal: "GROUP_SETTINGS", groupId: group.id }));
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 20,
                        color: UIConstants.BLACK_TEXT_COLOR,
                        //backgroundColor: "cyan",
                      }}
                    >
                      {group.name}
                    </Text>
                    {Debug.isDebugMode() ? <Text style={{ fontSize: 10 }}>{group.id}</Text> : null}
                    {/*org != null && (
                    <Text style={{ fontWeight: "normal", fontSize: 14 }}>{org.name}</Text>
                  )*/}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ paddingBottom: 4 }}
                    onPress={() => {
                      dispatch(Actions.openModal({ modal: "GROUP_SETTINGS", groupId: group.id }));
                    }}
                  >
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
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <Divider style={{}} width={1} color="lightgrey" />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          {!isMember ? (
            <MyButtons.FormButton
              text={"Follow"}
              titleStyle={{ fontSize: 14 }}
              style={{ width: 120, fontSize: 10 }}
              onPress={async () => {
                await Controller.joinGroup(user.uid, group.id);
              }}
            />
          ) : (
            <Text>Following</Text>
          )}
          <MyButtons.FormButton
            titleStyle={{ fontSize: 14 }}
            style={{ width: 100, fontSize: 10 }}
            text={"Invite"}
            onPress={() => {
              dispatch(Actions.openModal({ modal: "GROUP_INVITE", groupId: group.id }));
            }}
          />
          <MyButtons.FormButton
            text={"Create Groupy"}
            titleStyle={{ fontSize: 14 }}
            style={{ width: 120, fontSize: 10 }}
            onPress={() => {
              dispatch(Actions.openModal({ modal: "NEW_GROUP", parentGroupId: group.id }));
            }}
          />
        </View>
        {/* default group */}
        {debugMode ? <Text style={{ fontSize: 10 }}>Group: {JSON.stringify(group)}</Text> : null}
        {debugMode ? <Text style={{ fontSize: 10 }}>Org: {JSON.stringify(school)}</Text> : null}
        <ScrollView
          style={{
            marginTop: 20,
            paddingLeft: 8,
            paddingRight: 8,
            flexGrow: 1,
            flexDirection: "column",
            //backgroundColor: "cyan",
          }}
        >
          {subGroups.map((group) => {
            return <GroupView group={group} />;
          })}
          <MessagesSection groupId={group.id} user={userInfo} />
        </ScrollView>
        {/* messages section */}
        <Divider style={{}} width={1} color="darkgrey" />
        {/* toolbar section */}
        <View
          style={{
            //backgroundColor: "purple",
            alignItems: "flex-end",
            justifyContent: "center",
            flexDirection: "row",
            height: 40,
          }}
        >
          <MyButtons.MenuButton
            icon="plus"
            text="New Post"
            onPress={() => {
              dispatch(Actions.openModal({ modal: "NEW_POST", groupId: group.id }));
            }}
            containerStyle={{ paddingRight: 24 }}
          />
          <MyButtons.MenuButton
            icon="calendar-plus"
            text="New Event"
            onPress={() => {
              //setShowNewEventModal(true);
              dispatch(Actions.openModal({ modal: "NEW_EVENT", groupId: group.id }));
            }}
          />
        </View>
      </Portal>
    </Modal>
  );
}

function GroupView({ group, setLoading }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const groupId = group.id;
  let members = [];
  let userGroupMembership = null;
  if (!groupId.startsWith("__placeholder_default_group_id")) {
    members = Data.getGroupMemberships(groupId);
    userGroupMembership = Data.getUserGroupMemberships(group.id);
  }
  const userInfo = Data.getCurrentUser();
  return (
    <View
      key={groupId}
      style={{
        flex: 1,
        backgroundColor: "cyan",
        marginBottom: 2,
      }}
    >
      <TouchableOpacity
        key={group.id}
        style={{
          flexDirection: "row",
          //height: Utils.isEmptyString(group.description) ? 60 : 80,
          alignItems: "flex-start",
          paddingLeft: 10,
        }}
        onPress={async () => {
          let groupId = group.id;
          dispatch(Actions.openModal({ modal: "GROUP", groupId: groupId }));
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
              userIds={(members ?? [])
                .filter((groupMembership) => {
                  return userInfo.uid != groupMembership.uid;
                })
                .map((groupMembership) => groupMembership.uid)}
              border
            />
          </View>
          {debugMode && <Text style={{ fontSize: 10 }}>{JSON.stringify(group, null, 2)}</Text>}
          {debugMode && userInfo.superUser && (
            <MyButtons.LinkButton
              text="(Admin) Delete Group"
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
          )}
        </View>
        {/*
        <View
          style={{
            flexBasis: 120,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            padding: 10,
            //backgroundColor: "brown",
          }}
        >
          {group.type === "public_membersonly" && (
            <MyButtons.FormButton
              style={{ width: 120 }}
              titleStyle={{ fontSize: 12 }}
              text="Request to Join"
              onPress={async () => {
                await Controller.subscribeToGroup(userInfo, group.id);
              }}
            />
          )}
          {group.type === "private_requesttojoin" && (
            <MyButtons.FormButton
              style={{ width: 120 }}
              titleStyle={{ fontSize: 12 }}
              text="Request to Join"
              onPress={async () => {
                await Controller.subscribeToGroup(userInfo, group.id);
              }}
            />
          )}
        </View>
            */}
      </TouchableOpacity>
    </View>
  );
}

function MessagesSection({ groupId, user }) {
  const renderMessage = ({ item }) => {
    const onPress = () => {
      dispatch(Actions.openModal({ modal: "MESSAGES", id: item.id }));
    };
    return <MessageViewContainer key={item.id} user={user} item={item} onPress={onPress} />;
  };

  const userRootMessages = Data.getGroupUserRootMessages(groupId);

  const sortedMessages = useMemo(() => {
    if (userRootMessages == null) {
      return null;
    }
    const sortedMessages = [...(userRootMessages ?? [])] ?? [];
    sortedMessages.sort((m1, m2) => {
      return m2.lastUpdated - m1.lastUpdated;
    });
    return sortedMessages;
  }, [userRootMessages]);

  if (sortedMessages == null) {
    return <Text>Loading...</Text>;
  }
  if (sortedMessages.length == 0) {
    return (
      <View
        style={{
          flex: 1,
          height: 500,
          alignItems: "center",
          justifyContent: "center",
          //backgroundColor: "yellow",
        }}
      >
        <Text>No messages in this group</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        flexGrow: 1,
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            //backgroundColor: "green"
          }}
        >
          {sortedMessages.map((message) => {
            return renderMessage({ item: message });
          })}
        </View>
      </View>
    </View>
  );
}

function FlatListItemSeparator() {
  return (
    <View
      style={{
        height: 6,
        width: "100%",
        backgroundColor: "lightgrey",
      }}
    />
  );
}
