import React, { useState, useCallback, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Avatar, Divider, CheckBox } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MyButtons from "./MyButtons";
import * as UserInfo from "../common/UserInfo";
import Portal from "./Portal";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import * as Localization from "expo-localization";
import * as UIConstants from "./UIConstants";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as Controller from "../common/Controller";
import { useDispatch, useSelector } from "react-redux";
import * as Dates from "../common/Date";
import BookCalendarEventModal from "./BookCalendarEventModal";
import * as Debug from "../common/Debug";
import TimePickerModal from "./TimePickerModal";
import DatePickerModal from "./DatePickerModal";
import DateInput from "./DateInput";
import TimeInput from "./TimeInput";
import * as Actions from "../common/Actions";
import * as Data from "../common/Data";

export default function NewChatModal({}) {
  const debugMode = Debug.isDebugMode();
  //console.log("NewEventModal: initialTitle: " + initialTitle + ", onComplete: " + onComplete);
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const allUsers = Data.getAllUsers();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUser = (uid) => {
    if (selectedUsers.includes(uid)) {
      const newSelectedUsers = selectedUsers.filter((listUid) => listUid !== uid);
      setSelectedUsers(newSelectedUsers);
    } else {
      const newSelectedUsers = [...selectedUsers];
      newSelectedUsers.push(uid);
      setSelectedUsers(newSelectedUsers);
    }
  };

  return (
    <Modal visible={true} animationType={"slide"}>
      <Portal>
        {/* top bar */}
        <TopBarMiddleContentSideButtons
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
          height={60}
          left={
            <MyButtons.LinkButton
              text="Cancel"
              onPress={() => {
                dispatch(Actions.closeModal());
              }}
            />
          }
          center={<Text style={{ fontWeight: "bold" }}>Select People</Text>}
          right={
            selectedUsers.length > 0 && (
              <MyButtons.FormButton
                text="Next"
                onPress={async () => {
                  const chatId = await Controller.createChat(userInfo, [
                    userInfo.uid,
                    ...selectedUsers,
                  ]);
                  dispatch(Actions.closeModal());
                  dispatch(Actions.openModal({ modal: "CHAT", chatId }));
                }}
              />
            )
          }
        />
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
          behavior="padding"
          keyboardVerticalOffset={40}
          enabled
        >
          {debugMode && <Text style={{ fontSize: 10 }}>NewChatModal</Text>}
          <ScrollView style={{ paddingTop: 10 }}>
            {allUsers.map((user) => {
              if (user.uid === userInfo.uid) {
                return null;
              }
              return (
                <View
                  key={user.uid}
                  style={{
                    flex: 1,
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingBottom: 5,
                  }}
                >
                  {UserInfo.avatarComponent(user)}
                  <Text
                    style={{
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 10,
                    }}
                  >
                    {UserInfo.chatDisplayName(user)}
                  </Text>
                  <CheckBox
                    checked={selectedUsers.includes(user.uid)}
                    onPress={() => {
                      toggleUser(user.uid);
                    }}
                    style={{ alignSelf: "center" }}
                    title=""
                  />
                </View>
              );
            })}
          </ScrollView>
        </KeyboardAvoidingView>
      </Portal>
    </Modal>
  );
}
