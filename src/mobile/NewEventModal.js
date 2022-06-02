import React, { useState, useCallback, useEffect } from "react";
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

export default function NewEventModal({
  userInfo,
  group,
  papaId,
  allowCreatePoll,
  initialTitle,
  initialText,
  initialStartDate,
  initialStartTime,
  initialEndTime,
  visible,
  closeModal,
}) {
  console.log("NewEventModal: initialTitle: " + initialTitle + ", closeModal: " + closeModal);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [text, setText] = useState(null);
  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTimeFrom, setStartTimeFrom] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTimeFrom, setEndTimeFrom] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(null);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    console.log("setting title: " + initialTitle);
    setTitle(initialTitle);
  }, [initialTitle, initialText, initialStartDate, initialStartTime, initialEndTime]);

  const sendEvent = useCallback(async (title, text, startDate, startTime, endTime) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    const timezone = Localization.timezone;
    const event = {
      event: {
        startDate: moment(startDate).format("YYYYMMDD"),
        startTime: moment(startTime).format("HH:MM"),
        endTime: moment(endTime).format("HH:MM"),
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
      papaId, //papa id
      {
        groupName,
        fromName,
      }
    );
    closeModal();
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
    closeModal();
  }, []);

  const onDateChange = (event, selectedDate) => {
    console.log("onDateChange: " + selectedDate);
    setDate(selectedDate);
    setShowDatePicker(null);
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
  const [pollOptions, setPollOptions] = useState([
    { name: "Option 1", startDate: new Date() },
    { name: "Option 2", startDate: new Date() },
  ]);
  const addPollOption = () => {
    const name = "Option " + (pollOptions.length + 1);
    const newOptions = [...pollOptions];
    newOptions.push({ name });
    setPollOptions(newOptions);
  };

  const setOptionStartDate = (optionName, date) => {
    const index = pollOptions.findIndex((option) => option.name == optionName);
    const newPollOptions = [...pollOptions];
    newPollOptions[index] = { ...pollOptions[index], startDate: date };
    setPollOptions(newPollOptions);
  };

  const setOptionStartTime = (optionName, time) => {
    const index = pollOptions.findIndex((option) => option.name == optionName);
    const newPollOptions = [...pollOptions];
    newPollOptions[index] = { ...pollOptions[index], startTime: time };
    setPollOptions(newPollOptions);
  };

  const setOptionEndTime = (optionName, time) => {
    const index = pollOptions.findIndex((option) => option.name == optionName);
    const newPollOptions = [...pollOptions];
    newPollOptions[index] = { ...pollOptions[index], endTime: time };
    setPollOptions(newPollOptions);
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
                  closeModal();
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
                        sendEvent(title, text, startDate, startTime, endTime).then(() => {
                          closeModal();
                        });
                      } else {
                        sendPoll(title, text, pollOptions).then(() => {
                          closeModal();
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
                  defaultValue={title}
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
                {allowCreatePoll && (
                  <CheckBox
                    onPress={() => {
                      setPoll(!poll);
                    }}
                    title="Create a poll for multiple dates &amp; times"
                    checked={poll}
                  />
                )}
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
                          width: 100,
                          marginRight: 10,
                        }}
                      >
                        {/* start date */}
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePicker({
                              value: startDate ?? new Date(),
                              onChange: (value) => {
                                setStartDate(value);
                              },
                            });
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              alignItems: "center",
                            }}
                          >
                            {startDate != null ? moment(startDate).format("L") : "Date"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: 80,
                        }}
                      >
                        {/* start time to */}
                        <TouchableOpacity
                          onPress={() => {
                            setShowTimePicker({
                              value: startTime ?? new Date(),
                              onChange: (value) => {
                                setStartTime(value);
                              },
                            });
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              alignItems: "center",
                            }}
                          >
                            {startTime != null ? moment(startTime).format("LT") : ""}
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
                            fontSize: 14,
                            alignItems: "center",
                          }}
                        >
                          Ends:
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 100,
                          marginRight: 10,
                        }}
                      >
                        {/* end date */}
                        <TouchableOpacity
                          onPress={() => {
                            setShowDatePicker({
                              value: endDate ?? new Date(),
                              onChange: (value) => {
                                setEndDate(value);
                              },
                            });
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              alignItems: "center",
                            }}
                          >
                            {endDate != null ? moment(endDate).format("L") : "Date"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: 80,
                        }}
                      >
                        {/* end time to */}
                        <TouchableOpacity
                          onPress={() => {
                            setShowTimePicker({
                              value: endTime ?? new Date(),
                              onChange: (value) => {
                                setEndTime(value);
                              },
                            });
                          }}
                          style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              alignItems: "center",
                            }}
                          >
                            {endTime != null ? moment(endTime).format("LT") : ""}
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
                            width: 60,
                            marginRight: 10,
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
                            width: 110,
                            marginRight: 10,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              console.log("setShowDatePicker: option: " + JSON.stringify(option));
                              setShowDatePicker({
                                value: option.startDate ?? new Date(),
                                onChange: (value) => {
                                  setOptionStartDate(option.name, value);
                                },
                              });
                            }}
                            style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                alignItems: "center",
                              }}
                            >
                              {option.startDate != null ? moment(option.startDate).format("L") : ""}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            width: 90,
                            marginRight: 10,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              console.log("setShowDatePicker: option: " + JSON.stringify(option));
                              setShowTimePicker({
                                value: option.startTime ?? new Date(),
                                onChange: (value) => {
                                  setOptionStartTime(option.name, value);
                                },
                              });
                            }}
                            style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                alignItems: "center",
                              }}
                            >
                              {option.startTime != null
                                ? moment(option.startTime).format("LT")
                                : ""}
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
                              console.log("setShowDatePicker: option: " + JSON.stringify(option));
                              setShowTimePicker({
                                value: option.endTime ?? new Date(),
                                onChange: (value) => {
                                  setOptionEndTime(option.name, value);
                                },
                              });
                            }}
                            style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                alignItems: "center",
                              }}
                            >
                              {option.endTime != null ? moment(option.endTime).format("LT") : ""}
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
                    minHeight: 300,
                  }}
                  multiline={true}
                  autoFocus={false}
                  numberOfLines={10}
                  onChangeText={(text) => {
                    setText(text);
                  }}
                  placeholder="Details..."
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Portal>
      <TimePickerModal
        value={showTimePicker?.value}
        visible={showTimePicker != null}
        onChange={showTimePicker?.onChange}
        closeModal={() => {
          setShowTimePicker(null);
        }}
      />
      <DatePickerModal
        visible={showDatePicker != null}
        value={showDatePicker?.value}
        onChange={showDatePicker?.onChange}
        closeModal={() => {
          setShowDatePicker(null);
        }}
      />
    </Modal>
  );
}

function DatePickerModal({ value, visible, onChange, closeModal }) {
  console.log("DatePickerModal, value: " + value);
  const [date, setDate] = useState(value);
  useEffect(() => {
    setDate(value);
  }, [value]);
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
                closeModal();
              }}
              color="black"
            />
          }
          center={null}
          right={
            <MyButtons.FormButton
              text="Done"
              onPress={() => {
                onChange(date);
                setDate(null);
                closeModal();
              }}
            />
          }
        />
        <DateTimePicker
          display={"inline"}
          mode={"date"}
          value={date ?? new Date()}
          onChange={(event, newValue) => {
            setDate(newValue);
          }}
        />
      </Portal>
    </Modal>
  );
}

function TimePickerModal({ value, visible, onChange, closeModal }) {
  console.log("TimePickerModal value: " + value);
  const [time, setTime] = useState(value ?? new Date());
  console.log("Time picker modal visible: " + visible);
  useEffect(() => {
    setTime(value);
  }, [value]);
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
                closeModal();
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
                setTime(null);
                closeModal();
              }}
            />
          }
        />
        <DateTimePicker
          display={"spinner"}
          mode={"time"}
          minuteInterval={15}
          value={time ?? new Date()}
          onChange={(event, newValue) => {
            setTime(newValue);
          }}
        />
      </Portal>
    </Modal>
  );
}
