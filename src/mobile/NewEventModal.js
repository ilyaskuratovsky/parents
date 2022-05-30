import React, { useState, useCallback } from "react";
import {
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

export default function NewEventModal({ userInfo, group, visible, showModal }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [text, setText] = useState(null);
  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const sendEvent = useCallback(async (title, text, start, end) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    const timezone = Localization.timezone;
    const event = {
      event: {
        start: moment(start).format("YYYYMMDD HH:MM"),
        end: moment(end).format("YYYYMMDD HH:MM"),
        timezone,
      },
    };
    await Controller.sendMessage(
      dispatch,
      userInfo,
      group.id,
      title,
      text,
      event,
      null, //papa id
      {
        groupName,
        fromName,
      }
    );
    showModal(false);
  }, []);

  const sendPoll = useCallback(async (title, text, pollOptions) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    await Controller.sendMessage(
      dispatch,
      userInfo,
      group.id,
      title,
      text,
      { event_poll: pollOptions }, // data
      null, //papa id
      {
        groupName,
        fromName,
      }
    );
    showModal(false);
  }, []);

  const onDateChange = (event, selectedDate) => {
    console.log("onDateChange: " + selectedDate);
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const onStartTimeChange = (selectedDate) => {
    console.log("onStartTimeChange: " + selectedDate);
    setStartTime(selectedDate);
    setShowStartTimePicker(false);
  };

  const onEndTimeChange = (selectedDate) => {
    console.log("onEndTimeChange: " + selectedDate);
    setEndTime(selectedDate);
    setShowEndTimePicker(false);
  };

  const [poll, setPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState([{ name: "Option 1" }, { name: "Option 2" }]);
  const addPollOption = () => {
    const name = "Option " + (pollOptions.length + 1);
    const newOptions = [...pollOptions];
    newOptions.push({ name });
    setPollOptions(newOptions);
  };
  return (
    <Modal visible={visible} animationType={"slide"}>
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
                  showModal(false);
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
                      //const m = moment(date);
                      if (!poll) {
                        sendEvent(title, text, start, end).then(() => {
                          showModal(false);
                        });
                      } else {
                        sendPoll(title, text, pollOptions).then(() => {
                          showModal(false);
                        });
                      }
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
                  height: 50,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                  backgroundColor: "yellow",
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
                  placeholder="Title"
                  multiline={false}
                  autoFocus={true}
                  onChangeText={(text) => {
                    setTitle(text);
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                  backgroundColor: "yellow",
                }}
              >
                {/* is poll */}
                <CheckBox
                  onPress={() => {
                    setPoll(!poll);
                  }}
                  title="Create a poll for multiple dates &amp; times"
                  checked={poll}
                />
                {/* Starts */}
                {!poll && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingLeft: 10,
                      flexDirection: "column",
                      justifyContent: "center",
                      height: 100,
                      backgroundColor: "cyan",
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          width: 50,
                          marginRight: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            alignItems: "center",
                          }}
                        >
                          Starts:
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 110,
                          marginRight: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePicker(!showDatePicker);
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              alignItems: "center",
                            }}
                          >
                            {date != null ? moment(date).format("L") : "Date"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: 80,
                          marginRight: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePicker(!showDatePicker);
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              alignItems: "center",
                            }}
                          >
                            {" "}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: 80,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePicker(!showDatePicker);
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              alignItems: "center",
                            }}
                          >
                            {" "}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                      <View
                        style={{
                          width: 50,
                          marginRight: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            alignItems: "center",
                          }}
                        >
                          Ends:
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 110,
                          marginRight: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePicker(!showDatePicker);
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              alignItems: "center",
                            }}
                          >
                            {date != null ? moment(date).format("L") : "Date"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: 80,
                          marginRight: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePicker(!showDatePicker);
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              alignItems: "center",
                            }}
                          >
                            {" "}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: 80,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePicker(!showDatePicker);
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              alignItems: "center",
                            }}
                          >
                            {" "}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/*
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ width: 50, fontSize: 16 }}>Start: </Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log(
                        "Start time box pressed, showStartTimePicker: " + showStartTimePicker
                      );
                      setShowStartTimePicker(!showStartTimePicker);
                    }}
                    style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                  >
                    <Text style={{ width: 90, fontSize: 16 }}>
                      {startTime != null ? moment(startTime).format("LT") : ""}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ marginLeft: 20, width: 50, fontSize: 16 }}>End: </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowEndTimePicker(!showEndTimePicker);
                    }}
                    style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                  >
                    <Text style={{ width: 100, fontSize: 16 }}>
                      {endTime != null ? moment(endTime).format("LT") : ""}
                    </Text>
                  </TouchableOpacity>
                </View>
                  */}
                  </View>
                )}
                {poll && (
                  <View
                    style={{
                      marginTop: 10,
                      paddingLeft: 0,
                      flexDirection: "column",
                      justifyContent: "center",
                      backgroundColor: "cyan",
                    }}
                  >
                    {pollOptions.map((option, index) => (
                      <View
                        key={"poll_option" + index}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "red",
                        }}
                      >
                        <View
                          style={{
                            width: 70,
                            marginRight: 10,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              alignItems: "center",
                            }}
                          >
                            {option.name}:
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 110,
                            marginRight: 10,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setShowDatePicker(!showDatePicker);
                            }}
                            style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                alignItems: "center",
                              }}
                            >
                              {date != null ? moment(date).format("L") : "Date"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            width: 80,
                            marginRight: 10,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setShowDatePicker(!showDatePicker);
                            }}
                            style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                alignItems: "center",
                              }}
                            >
                              {" "}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            width: 80,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setShowDatePicker(!showDatePicker);
                            }}
                            style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                          >
                            <Text
                              style={{
                                fontSize: 16,
                                alignItems: "center",
                              }}
                            >
                              {" "}
                            </Text>
                          </TouchableOpacity>
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
                )}
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
                  }}
                  multiline={true}
                  autoFocus={false}
                  onChangeText={(text) => {
                    setText(text);
                  }}
                  placeholder="Details..."
                />
              </View>
            </View>
          </ScrollView>
          <Modal visible={showDatePicker} animationType={"slide"}>
            <Portal
              backgroundColor={UIConstants.DEFAULT_BACKGROUND}
              //backgroundColor="green"
            >
              <TopBarMiddleContentSideButtons
                backgroundColor={UIConstants.DEFAULT_BACKGROUND}
                height={64}
                left={
                  <MyButtons.MenuButton
                    icon="arrow-left"
                    text="Back"
                    onPress={() => {
                      setShowDatePicker(false);
                    }}
                    color="black"
                  />
                }
                center={null}
                right={null}
              />
              <DateTimePicker
                display={"inline"}
                mode={"date"}
                value={date}
                onChange={onDateChange}
                onCancel={() => {
                  setShowStartTimePicker(false);
                }}
              />
            </Portal>
          </Modal>
          <TimePickerModal
            value={startTime ?? new Date()}
            visible={showStartTimePicker}
            onChange={onStartTimeChange}
            onCancel={() => {
              setShowStartTimePicker(false);
            }}
          />
          <TimePickerModal
            value={endTime ?? new Date()}
            visible={showEndTimePicker}
            onChange={onEndTimeChange}
            onCancel={() => {
              setShowEndTimePicker(false);
            }}
          />
        </KeyboardAvoidingView>
      </Portal>
    </Modal>
  );
}

function TimePickerModal({ value, visible, onChange, onCancel }) {
  const [time, setTime] = useState(value);
  console.log("Time picker modal visible: " + visible);
  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal
        backgroundColor={UIConstants.DEFAULT_BACKGROUND}
        //backgroundColor="green"
      >
        <TopBarMiddleContentSideButtons
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
          height={64}
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                onCancel();
              }}
              color="black"
            />
          }
          center={null}
          right={
            <MyButtons.FormButton
              text="Done"
              onPress={() => {
                onChange(time);
              }}
            />
          }
        />
        <DateTimePicker
          display={"spinner"}
          mode={"time"}
          value={time}
          onChange={(event, newValue) => {
            setTime(newValue);
          }}
        />
      </Portal>
    </Modal>
  );
}
