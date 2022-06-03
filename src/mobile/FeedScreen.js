import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookCalendarEventModal from "./BookCalendarEventModal";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import * as Date from "../common/Date";
import FacePile from "./FacePile";
import * as Globals from "./Globals";
import GroupSettingsModal from "./GroupSettingsModal";
import MessageModal from "./MessageContainerModal";
import * as MessageUtils from "../common/MessageUtils";
import MessageView from "./MessageView";
import NewEventModal from "./NewEventModal";
import Portal from "./Portal";
import * as Actions from "../common/Actions";
import ThreadMessageModal from "./ThreadMessageModal";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as MyButtons from "./MyButtons";
import Loading from "./Loading";
import * as Logger from "../common/Logger";
import TopBar from "./TopBar";
import Toolbar from "./Toolbar";

export default function FeedScreen({ debug }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);

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

  const renderMessage = ({ item }) => {
    const onPress = () => {
      setMessagesModalVisible(item.id);
    };
    return <MessageView showGroup={true} item={item} onPress={onPress} />;
  };
  useEffect(async () => {}, [messages]);

  const insets = useSafeAreaInsets();
  const topBarHeight = 64;
  const bottomBarHeight = 64;

  return (
    <Portal
      backgroundColor={UIConstants.DEFAULT_BACKGROUND}
      //backgroundColor="green"
    >
      <TopBar
        key="topbar"
        style={{}}
        left={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                flexGrow: 1,
                paddingLeft: 6,
                fontWeight: "bold",
                fontSize: 20,
                color: UIConstants.BLACK_TEXT_COLOR,
                //fontFamily: "Helvetica Neue",
                //color: "grey",
                //backgroundColor: "yellow",
              }}
            >
              {""}
            </Text>
            <View style={{ width: 80, alignItems: "flex-end" }}>
              {UserInfo.avatarComponent(userInfo, () => {
                dispatch(
                  Actions.openModal({
                    modal: "MY_PROFILE",
                  })
                );
              })}
            </View>
          </View>
        }
        center={null}
        right={null}
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
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // row
    alignItems: "center",
  },
});
