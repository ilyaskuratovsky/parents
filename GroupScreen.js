import React, { useCallback, useState } from "react";
import { Divider } from "react-native-elements";
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
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  TextInput,
} from "react-native";

export default function GroupScreen({ groupId }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { groupMap, orgsMap, messages, userMap, members } = useSelector(
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
      };
    }
  );
  const { height, width } = useWindowDimensions();
  const windowWidth = width ?? 0;
  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const group = groupMap[groupId];

  const messagesRead = (messages) => {
    Controller.markMessagesRead(
      userInfo,
      messages.map((m) => m._id)
    );
  };

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

  const messageMap = messages.reduce(function (acc, message) {
    acc[message.id] = { ...message };
    return acc;
  }, {});

  for (const m of Object.values(messageMap)) {
    if (m.papaId != null) {
      const papaMessage = messageMap[m.papaId];
      if (papaMessage.children == null) {
        papaMessage["children"] = [];
      }
      papaMessage.children.push(m);
    }
  }

  const rootMessages = Object.values(messageMap).filter(
    (m) => m.papaId == null
  );
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
            };
          });

    return {
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.uid,
        name: UserInfo.chatDisplayName(user),
        avatarColor: UserInfo.avatarColor(user),
      },
      children: childrenThreadMessages,
    };
  });

  const org = orgsMap[group.orgId];
  // send message callback function
  const sendMessage = useCallback(async (text, papaId) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    return await Controller.sendMessage(
      dispatch,
      userInfo,
      groupId,
      text,
      papaId,
      {
        groupName,
        fromName,
      }
    );
  }, []);

  // update last viewed callback function
  const updateGroupLastViewed = useCallback(async () => {
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
  }, [messages]);

  const renderMessage = ({ item }) => {
    return <MessageView item={item} width={windowWidth} />;
  };
  return (
    <Portal backgroundColor={/*UIConstants.DEFAULT_BACKGROUND*/ "white"}>
      <View style={{ backgroundColor: "whitesmoke", flexDirection: "column" }}>
        <View
          style={[
            {
              //height: 100,
              paddingLeft: 4,
              paddingRight: 4,
              paddingTop: 8,
              paddingBottom: 8,
              flexDirection: "row",
              //zIndex: Number.MAX_VALUE,
            },
          ]}
        >
          <View
            style={{
              flexGrow: 1,
              alignItems: "flex-start",
              justifyContent: "flex-end",
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
            <GroupMembersModal
              groupId={groupId}
              visible={membersModalVisible}
              closeModal={() => {
                setMembersModalVisible(false);
              }}
            />
          </View>
        </View>
        <Divider style={{}} width={1} color="darkgrey" />
      </View>

      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flex: 1 }}>
          {/*
          <ThreadView
            userInfo={userInfo}
            group={group}
            messages={threadMessages}
            sendMessage={sendMessage}
            onView={updateGroupLastViewed}
            messagesRead={messagesRead}
          />
            */}
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
            <View
              style={{
                height: 50,
                alignItems: "center",
                justifyContent: "center",
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
          </View>
        </View>
      </View>
      <Toolbar />
    </Portal>
  );
}
