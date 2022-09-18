import React, { useEffect, useMemo } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Data from "../common/Data";
import * as MessageUtils from "../common/MessageUtils";
import * as UserInfo from "../common/UserInfo";
import MessageViewContainer from "./MessageViewContainer";
import Portal from "./Portal";
import Toolbar from "./Toolbar";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";

export default function FeedScreen({ debug }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  console.log("FeedScreen 1");
  let { messages, userMap, userMessagesMap, groupMap } = useSelector((state) => {
    return {
      userinfo: state.main.userInfo,
      schoolList: state.main.schoolList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      orgsMap: state.main.orgsMap,
      userMap: state.main.userMap,
      messages: Object.values(state.main.groupMessages).flat(),
      userMessagesMap: state.main.userMessagesMap,
    };
  });
  console.log("FeedScreen 2");

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

  console.log("FeedScreen 3");
  const sortedMessages = useMemo(() => {
    const rootMessages = MessageUtils.buildRootMessagesWithChildren(
      messages,
      userInfo,
      userMessagesMap,
      null,
      groupMap,
      userMap
    );
    const sortedMessages = [...rootMessages] ?? [];
    sortedMessages.sort((m1, m2) => {
      return m2.lastUpdated - m1.lastUpdated;
    });
    return sortedMessages;
  }, [messages, userInfo, userMessagesMap, null, userMap]);

  console.log("FeedScreen 4");
  const renderMessage = ({ item }) => {
    const onPress = () => {
      //setMessagesModalVisible({ messageId: item.id, groupId: item.groupId });
      dispatch(Actions.openModal({ modal: "MESSAGES", messageId: item.id }));
    };
    return <MessageViewContainer user={userInfo} showGroup={true} item={item} onPress={onPress} />;
  };
  useEffect(async () => {}, [messages]);
  const defaultGroup = Data.getSuperPublicGroups()[0];

  console.log("FeedScreen 5");
  return (
    <Portal
      backgroundColor={UIConstants.DEFAULT_BACKGROUND}
      //backgroundColor="green"
    >
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
              style={{
                paddingLeft: 6,
                fontWeight: "bold",
                fontSize: 20,
                color: UIConstants.BLACK_TEXT_COLOR,
              }}
            >
              {"Feed"}
            </Text>
          </View>
        }
        center={<Text>{""}</Text>}
        right={
          <View style={{ height: 30, width: 34 }}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("new post: " + defaultGroup.id);
                dispatch(Actions.openModal({ modal: "NEW_POST", groupId: defaultGroup.id }));
              }}
            >
              <Icon fill="white" name="plus-circle" style={{ color: "black", fontSize: 26 }} />
            </TouchableOpacity>
          </View>
        }
      />
      {/* messages section */}
      <View
        style={{
          flexGrow: 1,
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              //backgroundColor: "green"
            }}
          >
            <FlatList
              style={{
                flex: 1,
                //backgroundColor: "orange"
              }}
              data={
                //DATA
                sortedMessages
              }
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={FlatListItemSeparator}
            />
          </View>
        </View>
      </View>
      <Toolbar key="toolbar" />

      {/* MODALS */}
      {/*messagesModalVisible != null && (
        <MessageModalContainer
          groupId={messagesModalVisible.groupId}
          messageId={messagesModalVisible.messageId}
          visible={messagesModalVisible != null}
          closeModal={() => {
            setMessagesModalVisible(null);
          }}
          containerStyle={{ paddingLeft: 24 }}
        />
        )*/}
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // row
    alignItems: "center",
  },
});
