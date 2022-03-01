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
  const group = groupMap[groupId];
  const org = orgsMap[group.orgId];
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
                closeModal();
              }}
            />
            {/*
            <View style={{ flexDirection: "row" }}>   
              <View style={{ flexDirection: "column" }}>
                {members.length <= 4 ? (
                  <View style={{ flexDirection: "row" }}>
                    {members.map(({ uid }, index) => {
                      const user = userMap[uid];
                      const name =
                        user.displayName != null
                          ? user.displayName
                          : user.email.substring(
                              0,
                              user.email.lastIndexOf("@")
                            );
                      return (
                        <Text
                          style={{
                            marginRight: 8,
                            fontWeight:
                              userInfo.uid == user.uid ? "bold" : "normal",
                          }}
                        >
                          <Avatar
                            size={24}
                            rounded
                            title="I"
                            containerStyle={{
                              backgroundColor: "coral",
                              marginRight: 1,
                            }}
                          />
                        </Text>
                      );
                    })}
                  </View>
                ) : (
                  <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontSize: 11 }}>9 Members</Text>
                    <Avatar
                      size={24}
                      rounded
                      title="I"
                      containerStyle={{
                        backgroundColor: "coral",
                        marginRight: 1,
                      }}
                    />
                  </View>
                )}
              </View>
              <MyButtons.MenuButton
                icon="account-supervisor"
                text=""
                onPress={() => {
                  closeModal();
                }}
              />
            </View>
              */}
          </View>
        </View>
        <Divider style={{}} width={1} color="darkgrey" />
      </View>

      <View style={{ flex: 1, flexDirection: "column" }}>
        {/*
        <View style={{ height: 20, grow: 0, flexDirection: "row" }}>
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
            */}
        <View style={{ flex: 1 }}>
          {/*
          <GiftedChat
            messages={giftedChatMessages}
            onSend={onSend}
            style={{ border: 1, borderColor: "black" }}
          ></GiftedChat>
          */}
          <ThreadView messages={messages} />
        </View>
      </View>
      <Toolbar />
    </Portal>
  );
}
