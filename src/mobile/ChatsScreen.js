import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Controller from "../common/Controller";
import FacePile from "./FacePile";
import * as Globals from "./Globals";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as Utils from "../common/Utils";
import * as Data from "../common/Data";
import * as Debug from "../common/Debug";
import { styles } from "./Styles";
import ChatThreadView from "./ChatThreadView";

export default function ChatsScreen({}) {
  const debugMode = Debug.isDebugMode();
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const allUsers = Data.getAllUsers();
  const userChatMemberships = Data.getUserChatMemberships();

  return (
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <TopBar
        key="topbar"
        style={{}}
        left={
          <View
            style={{
              //backgroundColor: "cyan",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ alignItems: "flex-start", marginRight: 6 }}>
              {UserInfo.avatarComponent(userInfo, () => {
                dispatch(
                  Actions.openModal({
                    modal: "MY_PROFILE",
                  })
                );
              })}
            </View>
            <Text
              style={[
                {
                  paddingLeft: 6,
                },
                styles.topBarHeaderText,
              ]}
            >
              {"Chats"}
            </Text>
          </View>
        }
        center={<Text>{""}</Text>}
        right={
          <MyButtons.MenuButton
            icon="plus"
            text="New Chat"
            onPress={() => {
              dispatch(Actions.openModal({ modal: "NEW_CHAT" }));
            }}
          />
        }
      />
      <View key="main_content" style={{ flex: 1, backgroundColor: "white", paddingTop: 20 }}>
        <ScrollView
          key="messages"
          style={
            {
              //backgroundColor: "yellow"
            }
          }
        >
          {userChatMemberships.map((m) => {
            return <ChatThreadView key={m.chatId} chatId={m.chatId} />;
          })}
        </ScrollView>
        <Toolbar key="toolbar" />
      </View>
    </Portal>
  );
}
