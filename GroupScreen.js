import React, { useCallback, useState, useEffect } from "react";
import { Divider, Badge } from "react-native-elements";
import { IconButton } from "react-native-paper";

import { useDispatch, useSelector } from "react-redux";
import * as Controller from "./Controller";
import GroupMembersModal from "./GroupMembersModal";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import ThreadView from "./ThreadView";
import Toolbar from "./Toolbar";
import * as UserInfo from "./UserInfo";
import * as Actions from "./Actions";
import MessageView from "./MessageView";
import * as MessageUtils from "./MessageUtils";
import MessageScreen from "./MessageScreen";
import MessageModal from "./MessageModal";
import ThreadMessageModal from "./ThreadMessageModal";
import NewEventModal from "./NewEventModal";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Dimensions,
  TextInput,
} from "react-native";
import { Modal } from "react-native-paper";
import TopBarLeftContentSideButton from "./TopBarLeftContentSideButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GroupScreen({ groupId }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);

  const { groupMap, orgsMap, messages, userMap, members, userMessagesMap } =
    useSelector((state) => {
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
    });
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

  const rootMessages = MessageUtils.buildRootMessagesWithChildren(
    messages,
    userInfo,
    userMessagesMap
  );
  const sortedMessages = [...rootMessages] ?? [];
  sortedMessages.sort((m1, m2) => {
    return m2.lastUpdated - m1.lastUpdated;
    //return 0;
  });

  const threadMessages = sortedMessages.map((message) => {
    const user = userMap[message.uid];
    const children = message.children;
    const childrenThreadMessages =
      children == null
        ? []
        : children.map((message) => {
            return {
              _id: message.id,
              text: message.text,
              createdAt: new Date(message.timestamp),
              user: {
                _id: message.uid,
                name: UserInfo.chatDisplayName(user),
                avatarColor: UserInfo.avatarColor(user),
              },
              children,
              status: message.status,
            };
          });

    return {
      _id: message.id,
      title: message.title ?? "[No title]",
      text: message.text,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.uid,
        name: UserInfo.chatDisplayName(user),
        avatarColor: UserInfo.avatarColor(user),
      },
      children: childrenThreadMessages,
      status: message.status,
      unreadChildCount: message.unreadChildCount,
      lastUpdated: message.lastUpdated,
    };
  });

  const org = orgsMap[group.orgId];
  // send message callback function
  const sendMessage = useCallback(async (title, text, papaId) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    return await Controller.sendMessage(
      dispatch,
      userInfo,
      groupId,
      title,
      text,
      papaId,
      {
        groupName,
        fromName,
      }
    );
  }, []);

  // send message callback function
  const sendEvent = useCallback(async (title, text, papaId) => {}, []);

  const renderMessage = ({ item }) => {
    const onPress = () => {
      setMessagesModalVisible(item._id);
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
      messages.map((m) => m._id)
    );
  }, [messages]);

  const insets = useSafeAreaInsets();
  const windowHeight =
    Dimensions.get("window").height - insets.top - insets.bottom;
  const topBarHeight = 64;
  const newMessageHeight = 80;
  const bottomBarHeight = 64;
  return (
    <Portal backgroundColor={/*UIConstants.DEFAULT_BACKGROUND*/ "white"}>
      {/* top bar section */}
      <View
        style={{
          //backgroundColor: "yellow",
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
            style={{ width: 18 }}
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
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  {group.name}
                </Text>
                {org != null && (
                  <Text style={{ fontWeight: "normal", fontSize: 14 }}>
                    {org.name}
                  </Text>
                )}
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
            <MyButtons.MenuButton
              icon="account-supervisor"
              text={
                members.length + " member" + (members.length > 1 ? "s" : "")
              }
              onPress={() => {
                console.log("members pressed");
                setMembersModalVisible(true);
              }}
            />
          </View>
        </View>
        <Divider style={{}} width={1} color="darkgrey" />
      </View>

      {/* messages section */}
      <View
        style={{
          flexGrow: 1,
          flexDirection: "column",
          //backgroundColor: "orange",
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <FlatList
              style={{ flex: 1 }}
              data={
                //DATA
                threadMessages
              }
              renderItem={renderMessage}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{
                width: windowWidth,
              }}
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
        <IconButton
          icon="plus"
          onPress={() => {
            setShowNewMessageModal(true);
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
      {messagesModalVisible && (
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
      <GroupMembersModal
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
      <NewEventModal
        userInfo={userInfo}
        group={group}
        visible={showNewEventModal}
        sendEvent={sendEvent}
        showModal={(flag) => {
          setShowNewEventModal(flag);
        }}
      />
    </Portal>
  );
}
