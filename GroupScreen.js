import React, { useCallback, useState, useEffect } from "react";
import { Divider, Badge } from "react-native-elements";
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

  const { groupMap, orgsMap, messages, userMap, members, userMessagesMap } = useSelector((state) => {
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

  const rootMessages = MessageUtils.buildRootMessagesWithChildren(messages, userMessagesMap);
  const sortedMessages = [...rootMessages] ?? [];
  sortedMessages.sort((m1, m2) => {
    return m2.timestamp - m1.timestamp;
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
    };
  });

  const org = orgsMap[group.orgId];
  // send message callback function
  const sendMessage = useCallback(async (title, text, papaId) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    return await Controller.sendMessage(dispatch, userInfo, groupId, title, text, papaId, {
      groupName,
      fromName,
    });
  }, []);

  const renderMessage = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setMessagesModalVisible(item._id);
          //setMembersModalVisible(true);
          //dispatch(Actions.goToScreen({ screen: "MESSAGE", groupId: groupId, messageId: item._id }));
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              paddingLeft: 4,
              paddingTop: 11,
              alignItems: "center",
              justifyContent: "flex-start",
              width: 24,
              //backgroundColor: "cyan",
            }}
          >
            {(item.status != "read" || (item.unreadChildCount ?? 0) > 0) && (
              <Badge
                status="primary"
                value={item.unreadChildCount ?? 0 > 0 ? item.unreadChildCount : " "}
                containerStyle={{ width: 24, height: 24 }}
              />
            )}
          </View>
          <View style={{ flexGrow: 1 }}>
            <MessageView item={item} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  useEffect(async () => {
    // update last viewed callback function
    if (messages.length > 0) {
      const maxTimestampMessage = messages.reduce((prev, current) =>
        prev.timestamp > current.timestamp ? prev : current
      );
      await Controller.setUserGroupLastViewedTimestamp(userInfo, group.id, maxTimestampMessage.timestamp);
    }
    Controller.markMessagesRead(
      userInfo,
      messages.map((m) => m._id)
    );
  }, [messages]);

  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height - insets.top - insets.bottom;
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
          {/* group name */}
          <View
            style={{
              flexGrow: 1,
              alignItems: "flex-start",
              justifyContent: "flex-end",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "column" }}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>{group.name}</Text>
                {org != null && <Text style={{ fontWeight: "normal", fontSize: 14 }}>{org.name}</Text>}
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
              text={members.length + " member" + (members.length > 1 ? "s" : "")}
              onPress={() => {
                console.log("members pressed");
                setMembersModalVisible(true);
              }}
            />
          </View>
        </View>
        <Divider style={{}} width={1} color="darkgrey" />
      </View>

      {/* new message */}
      <View
        style={{
          height: newMessageHeight,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10,
          width: windowWidth,
          //backgroundColor: "orange",
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "darkgrey",
            borderRadius: 14,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
          onPress={() => {
            setShowNewMessageModal(true);
          }}
        >
          <Text
            style={{
              paddingLeft: 10,
              //backgroundColor: "green",
              fontSize: 14,
              color: "lightgrey",
            }}
          >
            New Message...
          </Text>
        </TouchableOpacity>
      </View>

      {/* messages section */}
      <View
        style={{
          height: windowHeight - topBarHeight - newMessageHeight - bottomBarHeight,
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

      {/* toolbar section */}
      <View style={{ backgroundColor: "purple", flexDirection: "column", height: bottomBarHeight }}>
        <Toolbar />
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
    </Portal>
  );
}
