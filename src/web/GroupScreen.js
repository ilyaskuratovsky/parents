import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import FacePile from "./FacePile";
import * as Globals from "./Globals";
import GroupMembersModal from "./GroupMembersModal";
import MessageModal from "./MessageModal";
import MessageView from "./MessageView";
import NewEventModal from "./NewEventModal";
import Portal from "./Portal";
import * as Actions from "../common/Actions";
import ThreadMessageModal from "./ThreadMessageModal";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as Device from "expo-device";
import * as Debug from "../common/Debug";

export default function GroupScreen({ groupId }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const deviceType = useSelector((state) => state.main.deviceType);

  const { groupMap, orgsMap, messages, userMap, members, userMessagesMap } = useSelector(
    (state) => {
      return {
        userinfo: state.main.userInfo,
        schoolList: state.main.schoolList,
        schoolMap: state.main.schoolMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
        orgsMap: state.main.orgsMap,
        userMap: state.main.userMap,
        messages: state.main.groupMessages[groupId] ?? [],
        members: state.main.groupMembershipMap[groupId],
        userMessagesMap: state.main.userMessagesMap,
      };
    }
  );
  const { height, width } = useWindowDimensions();
  const windowWidth = width ?? 0;
  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const [messagesModalVisible, setMessagesModalVisible] = useState(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const group = groupMap[groupId];

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

  const rootMessages = Data.buildRootMessagesWithChildren(
    messages,
    userInfo,
    userMessagesMap,
    null,
    userMap
  );
  const sortedMessages = [...rootMessages] ?? [];
  sortedMessages.sort((m1, m2) => {
    return m2.lastUpdated - m1.lastUpdated;
    //return 0;
  });

  const org = orgsMap[group?.orgId];
  // send message callback function
  const sendMessage = useCallback(async (title, text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    return await Controller.sendMessage(
      dispatch,
      userInfo,
      groupId,
      title,
      text,
      null, //data
      null, //papa id
      {
        groupName,
        fromName,
      }
    );
  }, []);

  const sendEventMessage = useCallback(async (title, text, eventTime) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    return await Controller.sendEventMessage(
      dispatch,
      userInfo,
      groupId,
      title,
      text,
      eventTime,
      null, //papa id
      {
        groupName,
        fromName,
      }
    );
  }, []);

  const renderMessage = ({ item }) => {
    const onPress = () => {
      setMessagesModalVisible(item.id);
    };
    return <MessageView item={item} onPress={onPress} />;
  };
  useEffect(async () => {
    // update last viewed callback function
    if (messages.length > 0) {
      const maxTimestampMessage = messages.reduce((prev, current) =>
        prev.timestamp > current.timestamp ? prev : current
      );
      await Controller.setUserGroupLastViewedTimestamp(
        userInfo,
        group.id,
        maxTimestampMessage.timestamp
      );
    }
    Controller.markMessagesRead(
      userInfo,
      messages.map((m) => m.id)
    );
  }, [messages]);

  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height - insets.top - insets.bottom;
  const topBarHeight = 64;
  const newMessageHeight = 80;
  const bottomBarHeight = 64;
  return (
    <Portal
      backgroundColor={UIConstants.DEFAULT_BACKGROUND}
      //backgroundColor="green"
    >
      {/* top bar section */}
      <View
        style={{
          //backgroundColor: "whitesmoke",
          flexDirection: "column",
          height: topBarHeight,
        }}
      >
        {/* group name and members row */}
        <View
          style={[
            {
              height: topBarHeight - 1,
              paddingLeft: 4,
              paddingRight: 4,
              paddingTop: 8,
              paddingBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              //backgroundColor: "cyan",
            },
          ]}
        >
          <IconButton
            icon={"chevron-left"}
            style={{ width: 18, color: UIConstants.BLACK_TEXT_COLOR }}
            onPress={() => {
              dispatch(Actions.goToScreen({ screen: "GROUPS" }));
            }}
          />
          {/* group name */}
          <View
            style={{
              flexGrow: 1,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              //backgroundColor: "cyan",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                  onPress={() => {
                    setMembersModalVisible(true);
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      color: UIConstants.BLACK_TEXT_COLOR,
                    }}
                  >
                    {group.name}
                  </Text>
                  {Globals.dev ? <Text style={{ fontSize: 10 }}>{group.id}</Text> : null}
                  {org != null && (
                    <Text style={{ fontWeight: "normal", fontSize: 14 }}>{org.name}</Text>
                  )}
                </TouchableOpacity>
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
                console.log("members pressed");
                setMembersModalVisible(true);
              }}
            />
            */}
            <TouchableOpacity
              onPress={() => {
                setMembersModalVisible(true);
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
        <Divider style={{}} width={1} color="lightgrey" />
      </View>
      <Text>{deviceType}</Text>
      {/* messages section */}
      <View
        style={{
          flexGrow: 1,
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        <ScrollView>
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
        </ScrollView>
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
        <IconButton
          icon="plus"
          onPress={() => {
            setShowNewMessageModal(true);
          }}
        />
        <MyButtons.MenuButton
          icon="plus"
          text="New Post"
          onPress={() => {
            dispatch(
              Actions.goToScreen({
                screen: "FIND_GROUPS",
              })
            );
          }}
        />
        <MyButtons.MenuButton
          icon="calendar-plus"
          text="New Event"
          onPress={() => {
            dispatch(
              Actions.goToScreen({
                screen: "FIND_GROUPS",
              })
            );
          }}
        />
        <IconButton
          icon="calendar-plus"
          onPress={() => {
            setShowNewEventModal(true);
          }}
        />
      </View>
      {/* messages modal */}
      {messagesModalVisible != null && (
        <MessageModal
          groupId={groupId}
          messageId={messagesModalVisible}
          visible={messagesModalVisible != null}
          closeModal={() => {
            setMessagesModalVisible(null);
          }}
        />
      )}
      {/* MODALS */}
      {/* group members modal */}
      <GroupSettingsModal
        groupId={groupId}
        visible={membersModalVisible}
        closeModal={() => {
          setMembersModalVisible(false);
        }}
      />
      <ThreadMessageModal
        userInfo={userInfo}
        group={group}
        visible={showNewMessageModal}
        sendMessage={sendMessage}
        showModal={(flag) => {
          setShowNewMessageModal(flag);
        }}
      />
      {/*
      <NewEventModal
        userInfo={userInfo}
        group={group}
        visible={showNewEventModal}
        sendEvent={sendEventMessage}
        showModal={(flag) => {
          setShowNewEventModal(flag);
        }}
      />
      */}
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // row
    alignItems: "center",
  },
});
