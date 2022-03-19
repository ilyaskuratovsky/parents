import React, { useState, useCallback, useRef } from "react";
import { Modal, Text, View, SafeAreaView, ScrollView, TextInput, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as UserInfo from "./UserInfo";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as MyButtons from "./MyButtons";
import GroupInviteModal from "./GroupInviteModal";
import Portal from "./Portal";
import * as MessageUtils from "./MessageUtils";
import { Divider } from "react-native-elements";
import CommentView from "./CommentView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import * as Controller from "./Controller";

export default function MessageModal({ groupId, messageId, visible, closeModal }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.main.userInfo);
  const { messages, userMap, userList, schoolList, schoolMap, groupList, groupMap, members } = useSelector((state) => {
    return {
      userMap: state.main.userMap,
      schoolList: state.main.schoolList,
      userList: state.main.userList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      members: state.main.groupMembershipMap[groupId],
      messages: state.main.groupMessages[groupId] ?? [],
    };
  });
  const group = groupMap[groupId];
  const message = MessageUtils.buildMessageWithChildren(messageId, messages);
  const sortedChildMessages = [...message.children] ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return m1.timestamp - m2.timestamp;
    //return 0;
  });

  const childMessages = sortedChildMessages.map((message) => {
    const user = userMap[message.uid];
    return {
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.uid,
        name: UserInfo.chatDisplayName(user),
        avatarColor: UserInfo.avatarColor(user),
      },
    };
  });

  // send message callback function
  const sendMessage = useCallback(async (text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(user);
    setText("");
    await Controller.sendMessage(dispatch, user, groupId, text, message.id, {
      groupName,
      fromName,
    });
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, []);

  /*
  const renderMessage = ({ item }) => {
    return <CommentView item={item} width={windowWidth} />;
  };
  */
  const [text, setText] = useState("");
  const scrollViewRef = useRef();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height - insets.top - insets.bottom;
  const topBarHeight = 64;
  const replyBarHeight = 80;

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal>
        {/* top bar */}
        <TopBarMiddleContentSideButtons
          height={topBarHeight}
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                closeModal();
              }}
              color="black"
            />
          }
          center={null}
          right={null}
        />

        {/* main content */}
        <View
          style={{
            height: windowHeight - topBarHeight - replyBarHeight,
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            //onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          >
            {/* parent message */}
            <View
              style={{
                flexDirection: "column",
                paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 14,
                //backgroundColor: "purple",
              }}
            >
              <View
                style={{
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
                  paddingLeft: 0,
                  paddingTop: 0,
                  borderRadius: 0,
                }}
              >
                <Text
                  //numberOfLines={showMore[item.id] ? null : 4}
                  style={{
                    paddingLeft: 0,
                    fontSize: 18,
                  }}
                >
                  {message.text}
                </Text>
              </View>
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* comments section */}
            <View style={{ flex: 1 }}>
              {childMessages.map((message) => {
                return <CommentView item={message} />;
              })}
            </View>
          </ScrollView>
        </View>
        {/* reply text input section */}
        <View
          style={{
            height: replyBarHeight,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 0,
            //backgroundColor: "cyan",
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
      </Portal>
    </Modal>
  );
}
