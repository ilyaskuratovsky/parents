import React, { useCallback, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import * as Controller from "./Controller";
import * as MyButtons from "./MyButtons";
import * as UIConstants from "./UIConstants";
import TopBar from "./TopBar";
import Portal from "./Portal";
import GroupInviteModal from "./GroupInviteModal";

export default function GroupScreen({ groupId, navigation }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const {
    schoolList,
    schoolMap,
    groupList,
    groupMap,
    messages,
    userMap,
    members,
  } = useSelector((state) => {
    return {
      userinfo: state.main.userInfo,
      schoolList: state.main.schoolList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userMap: state.main.userMap,
      messages: state.main.groupMessages[groupId],
      members: state.main.groupMembershipMap[groupId],
    };
  });
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const group = groupMap[groupId];
  const giftedChatMessages = messages.map((message) => {
    const user = userMap[message.uid];

    return {
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.uid,
        name: user.displayName ?? user.email,
        //avatar: "https://placeimg.com/140/140/any",
      },
    };
  });

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }

  const onSend = useCallback((messages = []) => {
    Controller.sendMessage(dispatch, userInfo, groupId, messages[0].text);
  }, []);

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}
        left={
          <MyButtons.MenuButton
            icon="arrow-left"
            text=""
            onPress={() => {
              dispatch(Actions.goToScreen({ screen: "GROUPS" }));
            }}
          />
        }
        center={<Text>{group.name}</Text>}
        right={null}
      />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ height: 50, grow: 0, flexDirection: "row" }}>
          {members.map(({ uid }, index) => {
            const user = userMap[uid];
            const name =
              user.displayName != null
                ? user.displayName
                : user.email.substring(0, user.email.lastIndexOf("@"));
            return (
              <Text
                style={{
                  marginRight: 8,
                  fontWeight: userInfo.uid == user.uid ? "bold" : "normal",
                }}
              >
                {name}
                {index < members.length - 1 ? "," : ""}
              </Text>
            );
          })}
          <TouchableOpacity
            onPress={() => {
              setInviteModalVisible(true);
            }}
          >
            <Text
              style={{
                fontSize: 12,
                textDecorationLine: "underline",
                color: "blue",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Invite
            </Text>
            <GroupInviteModal
              key="newgroupmodal"
              groupId={group.id}
              visible={inviteModalVisible}
              closeModal={() => {
                console.log("close modal called");
                setInviteModalVisible(false);
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <GiftedChat
            messages={giftedChatMessages}
            onSend={onSend}
            style={{ border: 1, borderColor: "black" }}
          ></GiftedChat>
        </View>
      </View>
    </Portal>
  );
}
