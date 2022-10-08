// @flow strict-local

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
import * as Data from "../common/Data";
import * as Actions from "../common/Actions";

export default function NewPollModal({ groupId }) {
  const dispatch = useDispatch();
  const group = Data.getGroup(groupId);
  const userInfo = Data.getCurrentUser();
  const [pollOptions, setPollOptions] = useState([
    { name: "Option 1", message: "" },
    { name: "Option 2", message: "" },
  ]);
  const [title, setTitle] = useState(null);
  const [text, setText] = useState(null);
  const addPollOption = () => {
    const name = "Option " + (pollOptions.length + 1);
    const newOptions = [...pollOptions];
    newOptions.push({ name });
    setPollOptions(newOptions);
  };

  const sendPoll = useCallback(async (title, text, pollOptions) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    await Controller.sendMessage(
      dispatch,
      userInfo,
      group.id,
      title,
      text,
      { poll: pollOptions }, // data
      null, //papa id
      {
        groupName,
        fromName,
      }
    );
    dispatch(Actions.closeModal());
  }, []);

  return (
    <Modal animationType={"slide"}>
      <Portal>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
          behavior="padding"
          keyboardVerticalOffset={40}
          enabled
        >
          <ScrollView>
            {/* top close section */}
            <View
              style={{
                height: 30,
                paddingLeft: 8,
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  dispatch(Actions.closeModal());
                }}
              >
                <Text style={{ fontSize: 20, color: "blue" }}>Close</Text>
              </TouchableOpacity>
            </View>
            {/* group name and post button section*/}
            <View
              style={{
                height: 60,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  //height: 100,
                  flex: 1,
                  paddingLeft: 8,
                  paddingRight: 4,
                  paddingTop: 8,
                  paddingBottom: 8,
                  flexDirection: "row",
                  //zIndex: Number.MAX_VALUE,
                }}
              >
                <View
                  style={{
                    flexGrow: 1,
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>{group.name}</Text>
                </View>
                <View
                  style={{
                    width: 80,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MyButtons.FormButton
                    text="POST"
                    onPress={async () => {
                      sendPoll(title, text, pollOptions).then(() => {
                        dispatch(Actions.closeModal());
                      });
                    }}
                  />
                </View>
              </View>
              <Divider style={{}} width={1} color="darkgrey" />
            </View>
            {/* message section */}
            <View style={{ flexGrow: 1 }}>
              {/* avatar */}
              <View
                style={{
                  height: 40,
                  paddingLeft: 10,
                  paddingRight: 10,
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 0,
                  //backgroundColor: "green",
                }}
              >
                {UserInfo.smallAvatarComponent(userInfo)}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 20,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 5,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {UserInfo.chatDisplayName(userInfo)}
                  </Text>
                </View>
              </View>

              {/* title */}
              <View
                style={{
                  height: 60,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                  //backgroundColor: "yellow",
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderRadius: 5,
                    margin: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 10,
                    textAlign: "left",
                    fontSize: 16,
                    backgroundColor: "white",
                  }}
                  placeholder="Poll Title"
                  multiline={false}
                  defaultValue={title}
                  autoFocus={true}
                  onChangeText={(text) => {
                    setTitle(text);
                  }}
                />
              </View>
              <View
                style={
                  {
                    //backgroundColor: "yellow",
                  }
                }
              >
                <View
                  style={{
                    //marginTop: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    flexDirection: "column",
                    justifyContent: "center",
                    //backgroundColor: "cyan",
                  }}
                >
                  {pollOptions.map((option, index) => (
                    <View
                      key={"poll_option" + index}
                      style={{
                        //flex: 1,
                        marginBottom: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        //backgroundColor: "red",
                      }}
                    >
                      <View
                        style={{
                          width: 68,
                          marginRight: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            alignItems: "center",
                          }}
                        >
                          {option.name}:
                        </Text>
                      </View>
                      <View
                        style={{
                          flexGrow: 1,
                          marginRight: 10,
                        }}
                      >
                        <TextInput
                          style={{
                            flex: 1,
                            borderWidth: 1,
                            borderRadius: 5,
                            margin: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingLeft: 10,
                            textAlign: "left",
                            fontSize: 16,
                            height: 40,
                            backgroundColor: "white",
                          }}
                          placeholder=""
                          multiline={false}
                          defaultValue={title}
                          autoFocus={true}
                          value={option.message}
                          onChangeText={(text) => {
                            setPollOptions((prev) => {
                              const newPollOptions = [...prev];
                              const newPollOption = { ...newPollOptions[index], message: text };
                              newPollOptions[index] = newPollOption;
                              return newPollOptions;
                            });
                          }}
                        />
                      </View>
                    </View>
                  ))}
                  <MyButtons.LinkButton
                    text="+ Add Option"
                    onPress={async () => {
                      addPollOption();
                    }}
                  />
                </View>
              </View>

              {/* message */}
              <View
                style={{
                  flex: 1,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: "blue",
                    borderWidth: 1,
                    borderRadius: 5,
                    margin: 0,
                    paddingTop: 10,
                    paddingBottom: 0,
                    paddingLeft: 10,
                    textAlign: "left",
                    fontSize: 16,
                    backgroundColor: "white",
                    minHeight: 300,
                  }}
                  multiline={true}
                  autoFocus={false}
                  numberOfLines={10}
                  defaultValue={text}
                  onChangeText={(text) => {
                    setText(text);
                  }}
                  placeholder="Additional message..."
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Portal>
    </Modal>
  );
}
