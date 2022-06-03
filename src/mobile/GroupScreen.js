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

export default function GroupScreen({ groupId, messageId, debug }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);

  let { groupMap, orgsMap, messages, userMap, members, userMessagesMap } = useSelector((state) => {
    return {
      userinfo: state.main.userInfo,
      schoolList: state.main.schoolList,
      schoolMap: state.main.schoolMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      orgsMap: state.main.orgsMap,
      userMap: state.main.userMap,
      messages: state.main.groupMessages[groupId] ?? [],
      members: state.main.groupMembershipMap[groupId],
      userMessagesMap: state.main.userMessagesMap,
    };
  });

  /*
  if (messageId != null) {
    const groupIdArr = messages.filter((m) => m.id === messageId);
    if (groupIdArr.length === 1) {
      groupId = groupIdArr[0].groupId;
    } else {
      Logger.log("Could not find group id for messageId: " + messageId);
      groupId = null;
    }
  }
  */

  const group = groupMap?.[groupId];
  console.log(
    "GroupScreen, groupId: " +
      groupId +
      ", messageId: " +
      messageId +
      ", group: " +
      JSON.stringify(group)
  );
  const isLoaded =
    group != null &&
    (messageId != null
      ? messages != null && messages.filter((m) => m.id === messageId).length > 0
      : true);

  const [groupSettingsModalVisible, setGroupSettingsModalVisible] = useState(false);
  const [messagesModalVisible, setMessagesModalVisible] = useState(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showBookCalendar, setShowBookCalendar] = useState(null);

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
    if (isLoaded) {
      const rootMessages = MessageUtils.buildRootMessagesWithChildren(
        messages,
        userInfo,
        userMessagesMap,
        null,
        userMap
      );
      const sortedMessages = [...rootMessages] ?? [];
      sortedMessages.sort((m1, m2) => {
        return m2.lastUpdated - m1.lastUpdated;
      });
      return sortedMessages;
    }
    return null;
  }, [messages, userInfo, userMessagesMap, null, userMap]);

  const org = orgsMap[group?.orgId];
  // send message callback function
  const sendMessage = useCallback(async (title, text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    return await Controller.sendMessage(
      dispatch,
      userInfo,
      groupId,
      title,
      text,
      null, // data
      null, // papa id
      {
        groupName,
        fromName,
      }
    );
  }, []);

  const renderMessage = ({ item }) => {
    const onPress = () => {
      setMessagesModalVisible(item.id);
    };
    return <MessageView item={item} onPress={onPress} />;
  };
  useEffect(async () => {
    // update last viewed callback function
    /* commenting out this code to check if we need it
    if (messages.length > 0) {
      const maxTimestampMessage = messages.reduce((prev, current) => {
        return Date.compare(prev.timestamp, current.timestamp) == 1 ? prev : current;
      });
      console.log(
        "setting user group last viewed timestamp: " + JSON.stringify(maxTimestampMessage.timestamp)
      );
      await Controller.setUserGroupLastViewedTimestamp(
        userInfo,
        group.id,
        Date.toDate(maxTimestampMessage.timestamp)
      );
    }
    Controller.markMessagesRead(
      userInfo,
      messages.map((m) => m.id)
    );
    */
  }, [messages]);

  // show message modal if there's a messageId prop
  useEffect(async () => {
    //Alert.alert("setting messageId: " + messageId);
    // only show if the message has been loaded and exists in the message map
    if (messageId != null) {
      setMessagesModalVisible(messageId);
    }
  }, [messageId]);

  const insets = useSafeAreaInsets();
  const topBarHeight = 64;
  const bottomBarHeight = 64;

  //Alert.alert("rendering GroupScreen: " + JSON.stringify({ groupId, messageId }));
  if (!isLoaded) {
    return <Loading />;
  }
  return (
    <Portal
      backgroundColor={UIConstants.DEFAULT_BACKGROUND}
      //backgroundColor="green"
    >
      {/* top bar section */}
      <View
        style={{
          //backgroundColor: "whitesmoke",
          flexDirection: "column",
          height: topBarHeight,
        }}
      >
        {/*
        <Text>
          debug: {debug}, messagesModalVisible: {messagesModalVisible}
        </Text>
      */}
        {/* group name and members row */}
        <View
          style={[
            {
              height: topBarHeight - 1,
              paddingLeft: 4,
              paddingRight: 4,
              paddingTop: 8,
              paddingBottom: 8,
              flexDirection: "row",
              alignItems: "center",
              //backgroundColor: "cyan",
            },
          ]}
        >
          <IconButton
            icon={"chevron-left"}
            style={{ width: 18, color: UIConstants.BLACK_TEXT_COLOR }}
            onPress={() => {
              dispatch(Actions.goToScreen({ screen: "GROUPS" }));
            }}
          />
          {/* group name */}
          <View
            style={{
              flexGrow: 1,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              //backgroundColor: "cyan",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                  onPress={() => {
                    setGroupSettingsModalVisible(true);
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      color: UIConstants.BLACK_TEXT_COLOR,
                    }}
                  >
                    {group.name}
                  </Text>
                  {Globals.dev ? <Text style={{ fontSize: 10 }}>{group.id}</Text> : null}
                  {org != null && (
                    <Text style={{ fontWeight: "normal", fontSize: 14 }}>{org.name}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* members button */}
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
            {/*
            <MyButtons.MenuButton
              icon="account-supervisor"
              text={members.length + " member" + (members.length > 1 ? "s" : "")}
              onPress={() => {
                console.log("members pressed");
                setMembersModalVisible(true);
              }}
            />
            */}
            <TouchableOpacity
              onPress={() => {
                setGroupSettingsModalVisible(true);
              }}
            >
              <FacePile
                userIds={[userInfo.uid].concat(
                  members
                    .filter((groupMembership) => {
                      return userInfo.uid != groupMembership.uid;
                    })
                    .map((groupMembership) => groupMembership.uid)
                )}
                border
              />
            </TouchableOpacity>
          </View>
        </View>
        <Divider style={{}} width={1} color="lightgrey" />
      </View>
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
      <Divider style={{}} width={1} color="darkgrey" />
      {/* toolbar section */}
      <View
        style={{
          //backgroundColor: "purple",
          alignItems: "flex-end",
          justifyContent: "center",
          flexDirection: "row",
          height: bottomBarHeight,
        }}
      >
        <MyButtons.MenuButton
          icon="plus"
          text="New Post"
          onPress={() => {
            setShowNewMessageModal(true);
          }}
          containerStyle={{ paddingRight: 24 }}
        />
        <MyButtons.MenuButton
          icon="calendar-plus"
          text="New Event"
          onPress={() => {
            setShowNewEventModal(true);
          }}
        />
      </View>
      {/* messages modal */}
      {messagesModalVisible != null && (
        <MessageModal
          groupId={groupId}
          messageId={messagesModalVisible}
          visible={messagesModalVisible != null}
          closeModal={() => {
            setMessagesModalVisible(null);
          }}
          containerStyle={{ paddingLeft: 24 }}
        />
      )}
      {/* MODALS */}
      {/* group members modal */}
      <GroupSettingsModal
        groupId={groupId}
        visible={groupSettingsModalVisible}
        closeModal={() => {
          setGroupSettingsModalVisible(false);
        }}
      />
      <ThreadMessageModal
        userInfo={userInfo}
        group={group}
        visible={showNewMessageModal}
        sendMessage={sendMessage}
        showModal={(flag) => {
          setShowNewMessageModal(flag);
        }}
      />
      <NewEventModal
        userInfo={userInfo}
        group={group}
        allowCreatePoll={true}
        visible={showNewEventModal}
        onComplete={(event) => {
          setShowNewEventModal(false);
          if (event != null) {
            Alert.alert("Book in Calendar?", null, [
              {
                text: "Yes",
                onPress: () => {
                  console.log("showing book calendar: " + JSON.stringify(event));
                  setShowBookCalendar({
                    title: event.title,
                    notes: event.text,
                    start: event.start,
                    end: event.end,
                    onDismiss: () => {
                      setShowBookCalendar(null);
                    },
                  });
                },
              },
              {
                text: "No",
                onPress: () => {
                  console.log("Cancel Pressed");
                  setShowBookCalendar(null);
                },
                style: "cancel",
              },
            ]);
          }
        }}
      />
      <BookCalendarEventModal
        key="BookCalendarEventModal"
        title={showBookCalendar?.title}
        notes={showBookCalendar?.notes}
        startDate={showBookCalendar?.start}
        endDate={showBookCalendar?.end}
        onComplete={() => {
          setShowBookCalendar(null);
        }}
        visible={showBookCalendar != null}
        onDismiss={showBookCalendar?.onDismiss}
      />
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // row
    alignItems: "center",
  },
});
