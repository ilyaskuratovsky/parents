import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "./Controller";
import GroupMembersModal from "./GroupMembersModal";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import ThreadView from "./ThreadView";
import Toolbar from "./Toolbar";
import * as UserInfo from "./UserInfo";

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

  if (userInfo == null || group == null) {
    return <Text>Loading Data...</Text>;
  }

  const threadMessages = (messages ?? []).map((message) => {
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

  const org = orgsMap[group.orgId];

  const sendMessage = useCallback(async (text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    return await Controller.sendMessage(dispatch, userInfo, groupId, text, {
      groupName,
      fromName,
    });
  }, []);

  const updateGroupLastViewed = useCallback(async () => {
    const maxTimestampMessage = messages.reduce((prev, current) =>
      prev.timestamp > current.timestamp ? prev : current
    );
    await Controller.setUserGroupLastViewedTimestamp(
      userInfo,
      group.id,
      maxTimestampMessage.timestamp
    );
  }, [messages]);

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
          <ThreadView
            messages={threadMessages}
            sendMessage={sendMessage}
            onView={updateGroupLastViewed}
          />
        </View>
      </View>
      <Toolbar />
    </Portal>
  );
}
