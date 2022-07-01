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
import * as Debug from "../common/Debug";
import * as Data from "../common/Data";
import * as MessageUtils from "../common/MessageUtils";
import { Badge } from "react-native-elements";
import { styles } from "./Styles";
import Loading from "./Loading";
import { SquareFacePile } from "../web/FacePile";

export default function ChatThreadView({ chatId }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const userInfo = Data.getCurrentUser();
  const chat = Data.getChat(chatId);
  const members = Data.getUsers(chat?.participants ?? []);
  const otherMembers = members.filter((u) => u.uid !== userInfo.uid);
  const unreadMessages = Data.getChatUserUnreadMessages(chat?.id);
  const unreadCount = unreadMessages.length;
  if (chat == null) {
    return <Loading />;
  }
  return (
    <View
      key={chat.id}
      style={{
        //backgroundColor: "green",
        justifyContent: "center",
      }}
    >
      {debugMode && (
        <Text style={{ fontSize: 8 }}>
          {JSON.stringify(
            {
              chatId: chat.id,
              participants: chat.participants,
              //unreadRootMessages: JSON.stringify(unreadRootMessages.map((m) => m.id)),
            },
            null,
            2
          )}
        </Text>
      )}
      <TouchableOpacity
        key={"view"}
        style={{
          flexDirection: "row",
          //backgroundColor: "cyan",
          //height: Utils.isEmptyString(group.description) ? 60 : 80,
          alignItems: "flex-start",
          paddingLeft: 4,
        }}
        onPress={() => {
          dispatch(Actions.openModal({ modal: "CHAT", chatId: chat.id }));
        }}
      >
        <View
          style={{
            flexGrow: 1,
            flexDirection: "column",
            //backgroundColor: "green",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              //backgroundColor: "green",
            }}
          >
            <SquareFacePile userIds={otherMembers} />
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text
                style={[
                  {
                    justifyContent: "center",
                    alignItems: "flex-start",
                    height: 22,
                    //backgroundColor: "cyan",
                    //fontFamily: "Helvetica Neue",
                  },
                  styles.header1,
                ]}
              >
                {UserInfo.commaSeparatedChatThread(otherMembers)}
              </Text>
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  fontSize: 11,
                  fontWeight: "normal",
                  color: UIConstants.BLACK_TEXT_COLOR,
                  height: 16,
                  //fontFamily: "Helvetica Neue",
                }}
              >
                Last message goes here
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexBasis: 90,
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row",
            //backgroundColor: "brown",
          }}
        >
          <View
            style={{
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 2,
              alignItems: "flex-start",
              //backgroundColor: "purple",
            }}
          >
            {(unreadCount ?? 0) > 0 ? (
              <Badge status="error" value={unreadCount} containerStyle={{}} />
            ) : null}
          </View>
          <IconButton
            style={{
              //backgroundColor: "green",
              padding: 0,
              margin: 0,
            }}
            icon="chevron-right"
            color={"darkgrey"}
            size={32}
          />
        </View>
      </TouchableOpacity>
      <Divider style={{ marginTop: 6, marginBottom: 6 }} width={3} color="lightgrey" />
    </View>
  );
}
