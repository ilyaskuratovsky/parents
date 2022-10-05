//@flow strict-local

import { useEffect, useMemo } from "react";
import * as React from "react";
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
import * as Logger from "../common/Logger";
import { ActivityIndicator } from "react-native-paper";
import Loading from "./Loading";

export default function FeedScreen(): React.Node {
  /*
  return (
    <View>
      <Text>Feed Screen</Text>
    </View>
  );
  */
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const groupMessages = Data.getAllRootMessages();
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

  const renderMessage = ({ item }) => {
    const onPress = () => {
      //setMessagesModalVisible({ messageId: item.id, groupId: item.groupId });
      dispatch(Actions.openModal({ modal: "MESSAGES", messageId: item.getID() }));
    };
    return <MessageViewContainer user={userInfo} showGroup={true} item={item} onPress={onPress} />;
  };
  const defaultGroup = Data.getSuperPublicGroups()[0];

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
      <Text>Count: {groupMessages.length}</Text>
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
                groupMessages
              }
              renderItem={renderMessage}
              keyExtractor={(item) => item.getID()}
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
