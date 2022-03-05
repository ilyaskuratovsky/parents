import React, { useCallback, useState } from "react";
import { Text, View, TouchableOpacity, StatusBar } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import * as Controller from "./Controller";
import * as MyButtons from "./MyButtons";
import * as UIConstants from "./UIConstants";
import TopBar from "./TopBar";
import Portal from "./Portal";
import GroupInviteModal from "./GroupInviteModal";
import BottomBar from "./BottomBar";
import { Avatar, Divider } from "react-native-elements";
import Toolbar from "./Toolbar";
import ThreadView from "./ThreadView";
import * as UserInfo from "./UserInfo";
import GroupMembersModal from "./GroupMembersModal";

export default function GroupScreen({ groupId }) {
  console.log("groupId: " + groupId);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const {
    schoolList,
    schoolMap,
    groupList,
    groupMap,
    orgsMap,
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
      orgsMap: state.main.orgsMap,
      userMap: state.main.userMap,
      messages: state.main.groupMessages[groupId],
      members: state.main.groupMembershipMap[groupId],
    };
  });
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const group = groupMap[groupId];
  const org = orgsMap[group.orgId];
  const threadMessages = messages.map((message) => {
    const user = userMap[message.uid];

    return {
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.uid,
        name: UserInfo.chatDisplayName(user),
        avatarColor: UserInfo.avatarColor(user),
        //avatar: "https://placeimg.com/140/140/any",
      },
    };
  });

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }

  const sendMessage = useCallback(async (text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    return await Controller.sendMessage(dispatch, userInfo, groupId, text, {
      groupName,
      fromName,
    });
  }, []);

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
              text="9 members"
              onPress={() => {
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
          <ThreadView messages={threadMessages} sendMessage={sendMessage} />
        </View>
      </View>
      <Toolbar />
    </Portal>
  );
}
