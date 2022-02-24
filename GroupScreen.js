import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import * as Controller from "./Controller";
import * as MyButtons from "./MyButtons";
import * as UIConstants from "./UIConstants";
import TopBar from "./TopBar";
import Portal from "./Portal";

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
      schoolList: state.main.schoolList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userMap: state.main.userMap,
      messages: state.main.groupMessages[groupId],
      members: state.main.groupMembershipMap[groupId],
    };
  });
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
            text="Groups"
            onPress={() => {
              dispatch(Actions.goToUserScreen({ screen: "GROUPS" }));
            }}
          />
        }
        center={<Text>Groups</Text>}
        right={null}
      />
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Text key="label">{group.name}</Text>

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
