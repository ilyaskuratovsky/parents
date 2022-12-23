// @flow strict-local

import { useCallback, useState } from "react";
import * as React from "react";
import { ScrollView, Text, TextInput, useWindowDimensions, View } from "react-native";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import CommentView from "./CommentView";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as UserInfo from "../common/UserInfo";
import * as Data from "../common/Data";
import * as MessageData from "../common/MessageData";
import nullthrows from "nullthrows";
type Props = {
  groupId: string,
  messageId: string,
  onBack?: ?() => void,
};
export default function MessageScreen({ groupId, messageId, onBack }: Props): React.Node {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);

  const { userMap } = useSelector((state) => {
    return {
      userMap: state.main.userMap,
    };
  });
  const group = Data.getGroup(groupId);
  const { height, width } = useWindowDimensions();
  const windowWidth = width ?? 0;
  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const message = nullthrows(MessageData.getRootMessage(messageId));
  const user = nullthrows(message.getUserInfo());

  const sortedChildMessages = message.getChildren();

  const childMessages = sortedChildMessages.map((message) => {
    const user = message.getUserInfo();
    return {
      _id: message.getID(),
      text: message.getText(),
      createdAt: message.getTimestamp(),
      user: {
        _id: message.getUserInfo()?.uid,
        name: UserInfo.chatDisplayName(user),
        avatarColor: user != null ? UserInfo.avatarColor(user) : "",
      },
    };
  });

  // send message callback function
  const sendMessage = useCallback(async (text) => {
    const groupName = group?.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    setText("");

    /*
      dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  groupId: string,
  title: ?string,
  text: ?string,
  data: ?{ ... },
  papaId: ?string,
  notificationInfo: ?NotificationInfo
    */
    return await Controller.sendMessage(
      dispatch,
      userInfo,
      groupId,
      null,
      text,
      null /* data */,
      message.getID(),
      {
        groupName,
        fromName,
      }
    );
  }, []);

  const renderMessage = ({ item }) => {
    return <CommentView item={item} width={windowWidth} />;
  };
  /*
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
  */
  const [text, setText] = useState("");

  return (
    <Portal backgroundColor={/*UIConstants.DEFAULT_BACKGROUND*/ "white"}>
      <View style={{ flexBasis: 50 }}>
        <TopBarMiddleContentSideButtons
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                onBack();
              }}
              color="black"
            />
          }
        />
      </View>
      {/* main message section */}
      <View
        style={{
          flexDirection: "column",
          height: 80,
          width: width,
          paddingTop: 10,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 14,
          backgroundColor: "purple",
        }}
      >
        <View
          style={{
            width: width,
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 6,
          }}
        >
          {UserInfo.avatarComponent(user)}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 20,
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                marginLeft: 5,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {UserInfo.chatDisplayName(user)}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: width - 20,
            paddingLeft: 0,
            paddingTop: 0,
            borderRadius: 0,
            backgroundColor: "white",
          }}
        >
          <Text
            //numberOfLines={showMore[item.id] ? null : 4}
            style={{
              paddingLeft: 0,
              fontSize: 18,
              width: width - 20,
            }}
          >
            {message.getText()}
          </Text>
        </View>
        <Divider style={{}} width={1} color="darkgrey" />
      </View>

      {/* comments section */}
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flexDirection: "column" }}>
          {childMessages.map((message) => {
            return <CommentView item={message} width={windowWidth} />;
          })}
        </ScrollView>
      </View>
      {/* reply text input section */}
      <View
        style={{
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 0,
          width: windowWidth,
          backgroundColor: "cyan",
          flexDirection: "row",
        }}
      >
        <TextInput
          value={text}
          style={{
            flex: 1,
            backgroundColor: "blue",
            margin: 0,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            textAlign: "left",
            fontSize: 16,
            width: windowWidth,
            backgroundColor: "white",
            borderLeftWidth: 1,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
          }}
          placeholder={"Reply..."}
          multiline={true}
          autoFocus={false}
          onChangeText={(text) => {
            setText(text);
          }}
        />
        {text != null && text.length > 0 && (
          <IconButton
            icon="arrow-up-circle"
            color={"blue"}
            size={38}
            onPress={() => {
              sendMessage(text);
            }}
          />
        )}
      </View>
      {/*
      <Toolbar />
          */}
    </Portal>
  );
}
