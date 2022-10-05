import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Modal,
} from "react-native";
import { Icon } from "react-native-elements";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookCalendarEventModal from "./BookCalendarEventModal";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import * as Date from "../common/Date";
import FacePile from "./FacePile";
import * as Globals from "./Globals";
import GroupSettingsModal from "./GroupSettingsModal";
import MessageModal from "./MessageContainerModal";
import MessageViewContainer from "./MessageViewContainer";
import Portal from "./Portal";
import * as Actions from "../common/Actions";
import ThreadMessageModal from "./ThreadMessageModal";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as MyButtons from "./MyButtons";
import Loading from "./Loading";
import * as Logger from "../common/Logger";
import * as Debug from "../common/Debug";
import * as Data from "../common/Data";

export default function GroupScreen({ groupId, messageId, debug }) {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const group = Data.getGroup(groupId);
  const userRootMessages = Data.getGroupUserRootMessages(groupId);
  const members = Data.getGroupMemberships(groupId) ?? [];
  const otherMembers = (members ?? []).filter((member) => member.uid !== userInfo.uid);
  const iAmInviter = members.filter((gm) => gm.uid === userInfo.uid).length > 0;
  const groupTypeDescription =
    group.type === "private"
      ? "Private (Invite Only)"
      : group.type === "private_requesttojoin"
      ? "Private (Request To Join)"
      : group.type === "public_membersonly"
      ? "Public (Members Only)"
      : group.type === "public"
      ? "Public (Open to All)"
      : group.type;
  Logger.log(
    "GroupScreen, groupId: " +
      groupId +
      ", messageId: " +
      messageId +
      ", group: " +
      JSON.stringify(group)
  );

  useEffect(() => {
    Controller.observeGroupMessages(dispatch, group.id);
  }, []);

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 6,
          width: "100%",
          backgroundColor: "lightgrey",
        }}
      />
    );
  };

  const sortedMessages = useMemo(() => {
    const sortedMessages = [...(userRootMessages ?? [])] ?? [];
    sortedMessages.sort((m1, m2) => {
      return m2.lastUpdated - m1.lastUpdated;
    });
    return sortedMessages;
  }, [userRootMessages]);

  //const org = orgsMap[group?.orgId];
  // send message callback function
  const renderMessage = ({ item }) => {
    const onPress = () => {
      //setMessagesModalVisible(item.id);
      dispatch(Actions.openModal({ modal: "MESSAGES", messageId: item.id }));
    };
    return <MessageViewContainer user={userInfo} item={item} onPress={onPress} />;
  };

  // show message modal if there's a messageId prop
  useEffect(async () => {
    //Alert.alert("setting messageId: " + messageId);
    // only show if the message has been loaded and exists in the message map
    if (messageId != null) {
      dispatch(Actions.openModal({ modal: "MESSAGES", messageId: item.id }));
    }
  }, [messageId]);

  const bottomBarHeight = 64;

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
                {/*
              <IconButton
                icon={"chevron-left"}
                style={{ backgroundColor: "green", color: UIConstants.BLACK_TEXT_COLOR }}
                onPress={() => {
                  dispatch(Actions.goToScreen({ screen: "GROUPS" }));
                }}
              />
              */}
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

                  {/* group details section */}
                  <View
                    style={[
                      {
                        paddingLeft: 4,
                        paddingRight: 4,
                        paddingTop: 0,
                        paddingBottom: 4,
                        flexDirection: "row",
                        alignItems: "center",
                        //backgroundColor: "green",
                      },
                    ]}
                  >
                    {group.type !== "super_public" && (
                      <>
                        <Text>{groupTypeDescription}</Text>
                        <Text style={{ paddingLeft: 4, paddingRight: 4 }}>•</Text>
                        <Text style={{ paddingRight: 4 }}>{members.length} members</Text>
                      </>
                    )}
                  </View>
                  {/* member facepile */}
                  {group.type !== "super_public" && (
                    <TouchableOpacity
                      style={{ paddingBottom: 4 }}
                      onPress={() => {
                        dispatch(Actions.openModal({ modal: "GROUP_SETTINGS", groupId: group.id }));
                      }}
                    >
                      <FacePile
                        userIds={members
                          .filter((groupMembership) => {
                            return userInfo.uid != groupMembership.uid;
                          })
                          .map((groupMembership) => groupMembership.uid)}
                        border
                      />
                    </TouchableOpacity>
                  )}
                  {/* invite/join section */}
                  <View
                    style={[
                      {
                        paddingLeft: 4,
                        paddingRight: 4,
                        paddingTop: 0,
                        paddingBottom: 4,
                        flexDirection: "row",
                        alignItems: "center",
                        //backgroundColor: "green",
                      },
                    ]}
                  >
                    {group.type !== "super_public" && (
                      <>
                        {iAmInviter && (
                          <MyButtons.LinkButton
                            text="Invite"
                            onPress={() => {
                              dispatch(
                                Actions.openModal({ modal: "GROUP_INVITE", groupId: group.id })
                              );
                            }}
                          />
                        )}
                        {!iAmInviter && (
                          <MyButtons.LinkButton
                            text="Request to Join"
                            onPress={() => {
                              Controller.requestToJoin(userInfo, group.id).then(() => {
                                Alert.alert("Your request has been submitted");
                              });
                            }}
                          />
                        )}
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* members button */}
            <View
              style={{
                width: 80,
                flexGrow: 0,
                marginRight: 4,
                alignItems: "flex-end",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {/*
            <MyButtons.MenuButton
              icon="account-supervisor"
              text={members.length + " member" + (members.length > 1 ? "s" : "")}
              onPress={() => {
                Logger.log("members pressed");
                setMembersModalVisible(true);
              }}
            />
            */}
            </View>
          </View>
          <Divider style={{}} width={1} color="lightgrey" />
        </View>
        {/* invite if only you're a member */}
        {otherMembers.length === 0 && group.type !== "super_public" && (
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              //backgroundColor: "yellow",
              height: 140,
            }}
          >
            <Text style={{ padding: 8 }}>There are no other members in this group</Text>
            <MyButtons.FormButton
              text="Invite"
              onPress={() => {
                dispatch(Actions.openModal({ modal: "GROUP_INVITE", groupId: group.id }));
              }}
            />
          </View>
        )}
        {/* messages section */}
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
              <FlatList
                style={{
                  flex: 1,
                  //backgroundColor: "orange"
                }}
                data={
                  //DATA
                  sortedMessages
                }
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={FlatListItemSeparator}
              />
            </View>
          </View>
        </View>
        <Divider style={{}} width={1} color="darkgrey" />
        {/* toolbar section */}
        <View
          style={{
            //backgroundColor: "purple",
            alignItems: "flex-end",
            justifyContent: "center",
            flexDirection: "row",
            height: bottomBarHeight,
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
              dispatch(Actions.openModal({ modal: "NEW_EVENT", groupId: groupId }));
            }}
          />
        </View>
        {/* messages modal */}
        {/*messagesModalVisible != null && (
          <MessageModal
            groupId={groupId}
            messageId={messagesModalVisible}
            visible={messagesModalVisible != null}
            closeModal={() => {
              setMessagesModalVisible(null);
            }}
            containerStyle={{ paddingLeft: 24 }}
          />
        )*/}
      </Portal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // row
    alignItems: "center",
  },
});
