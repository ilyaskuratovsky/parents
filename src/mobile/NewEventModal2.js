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
import Checkbox from "./Checkbox";

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
  onComplete,
}) {
  console.log("NewEventModal: initialTitle: " + initialTitle + ", onComplete: " + onComplete);
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
  const [showBookCalendar, setShowBookCalendar] = useState(null);

  useEffect(() => {
    console.log("setting title: " + initialTitle + ", text: " + initialText);
    setTitle(initialTitle);
    setText(initialText);
    setStartDate(Dates.toDate(initialStartDate) ?? new Date());
    setStartTime(Dates.toDate(initialStartTime) ?? new Date());
    setEndTime(Dates.toDate(initialEndTime) ?? new Date());
  }, [initialTitle, initialText, initialStartDate, initialStartTime, initialEndTime]);

  const sendEvent = useCallback(async (title, text, startDate, startTime, endTime) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    const timezone = Localization.timezone;

    const start = moment(
      moment(startDate).format("YYYY-MM-DD") + " " + moment(startTime).format("hh:mm a"),
      "YYYY-MM-DD hh:mm a"
    );
    const end = moment(
      moment(startDate).format("YYYY-MM-DD") + " " + moment(endTime).format("hh:mm a"),
      "YYYY-MM-DD hh:mm a"
    );

    const localStart = start.tz(timezone);
    const localEnd = end.tz(timezone);

    const event = {
      event: {
        start: localStart.utc().format(),
        end: localEnd.utc().format(),
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
    onComplete({ title, text, start: localStart.toDate(), end: localEnd.toDate() });
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
    onComplete();
  }, []);

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
        {/* top bar */}
        <TopBarMiddleContentSideButtons
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
          height={40}
          left={
            <MyButtons.LinkButton
              text="Cancel"
              onPress={() => {
                onDismiss();
              }}
            />
          }
          center={<Text style={{ fontWeight: "bold" }}>New Event</Text>}
          right={null}
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
          <ScrollView style={{ paddingTop: 10 }}>
            {/* message section */}
            <View style={{ flexGrow: 1, flexDirection: "column" }}>
              {/* group name */}
              <View
                style={{
                  height: 40,
                  paddingLeft: 10,
                  paddingRight: 10,
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingBottom: 0,
                  //backgroundColor: "yellow",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Group</Text>
                <Text style={{ fontSize: 20, color: "black" }}>{group.name}</Text>
              </View>

              {/* title */}
              <View
                style={{
                  height: 80,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                  //backgroundColor: "yellow",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Event Title</Text>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: "lightgrey",
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

              {/* Date and Time */}
              {!poll && (
                <View
                  style={{
                    marginTop: 0,
                    paddingLeft: 10,
                    flexDirection: "column",
                    justifyContent: "center",
                    height: 120,
                    //backgroundColor: "cyan",
                  }}
                >
                  {/* date and time header */}
                  <Text style={{ fontSize: 10, color: "grey" }}>Event Date &amp; Time</Text>
                  {/* date section */}
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 40,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          alignItems: "center",
                          color: "grey",
                        }}
                      >
                        Date:
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        marginRight: 10,
                        //backgroundColor: "green",
                        alignItems: "flex-start",
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
                        style={{
                          //backgroundColor: "white",
                          borderColor: "grey",
                          borderRadius: 20,
                          borderWidth: 1,
                          paddingLeft: 10,
                          paddingRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            alignItems: "center",
                          }}
                        >
                          {startDate != null ? moment(startDate).format("dddd, MMMM Do YYYY") : ""}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* time start/end section */}
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 40,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: "grey",
                          alignItems: "center",
                        }}
                      >
                        Time Start:
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 80,
                        marginRight: 10,
                      }}
                    >
                      {/* start time to */}
                      <TouchableOpacity
                        onPress={() => {
                          setShowTimePicker({
                            value: startTime ?? Dates.roundToNearest(new Date(), 15),
                            onChange: (value) => {
                              setStartTime(value);
                            },
                          });
                        }}
                        style={{
                          borderColor: "grey",
                          borderRadius: 20,
                          borderWidth: 1,
                          paddingLeft: 10,
                          paddingRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
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
                    <View
                      style={{
                        width: 40,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: "grey",
                          alignItems: "center",
                        }}
                      >
                        Time End:
                      </Text>
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
                        style={{
                          borderColor: "grey",
                          borderRadius: 20,
                          borderWidth: 1,
                          paddingLeft: 10,
                          paddingRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          paddingTop: 10,
                          paddingBottom: 10,
                        }}
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
                </View>
              )}
              {poll && (
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
                        marginBottom: 10,
                        flexDirection: "column",
                        alignItems: "left",
                        //backgroundColor: "red",
                        height: 104,
                      }}
                    >
                      {/* option header */}

                      {/* date and time header */}
                      <Text style={{ fontSize: 10, color: "grey" }}>{option.name}</Text>
                      {/* date section */}
                      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <View
                          style={{
                            width: 40,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              alignItems: "center",
                              color: "grey",
                            }}
                          >
                            Date:
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            marginRight: 10,
                            //backgroundColor: "green",
                            alignItems: "flex-start",
                          }}
                        >
                          {/* start date */}
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
                            style={{
                              //backgroundColor: "white",
                              borderColor: "grey",
                              borderRadius: 20,
                              borderWidth: 1,
                              paddingLeft: 10,
                              paddingRight: 10,
                              alignItems: "center",
                              justifyContent: "center",
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                alignItems: "center",
                              }}
                            >
                              {startDate != null
                                ? moment(startDate).format("dddd, MMMM Do YYYY")
                                : ""}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* time start/end section */}
                      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <View
                          style={{
                            width: 40,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              color: "grey",
                              alignItems: "center",
                            }}
                          >
                            Time Start:
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 80,
                            marginRight: 10,
                          }}
                        >
                          {/* start time to */}
                          <TouchableOpacity
                            onPress={() => {
                              console.log("setShowDatePicker: option: " + JSON.stringify(option));
                              setShowTimePicker({
                                value: option.startTime ?? Dates.roundToNearest(new Date(), 15),
                                onChange: (value) => {
                                  setOptionStartTime(option.name, value);
                                },
                              });
                            }}
                            style={{
                              borderColor: "grey",
                              borderRadius: 20,
                              borderWidth: 1,
                              paddingLeft: 10,
                              paddingRight: 10,
                              alignItems: "center",
                              justifyContent: "center",
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
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
                            width: 40,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              color: "grey",
                              alignItems: "center",
                            }}
                          >
                            Time End:
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 80,
                          }}
                        >
                          {/* end time to */}
                          <TouchableOpacity
                            onPress={() => {
                              console.log("setShowDatePicker: option: " + JSON.stringify(option));
                              setShowTimePicker({
                                value: option.endTime ?? Dates.roundToNearest(new Date(), 15),
                                onChange: (value) => {
                                  setOptionEndTime(option.name, value);
                                },
                              });
                            }}
                            style={{
                              borderColor: "grey",
                              borderRadius: 20,
                              borderWidth: 1,
                              paddingLeft: 10,
                              paddingRight: 10,
                              alignItems: "center",
                              justifyContent: "center",
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}
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
                    </View>
                  ))}
                  <TouchableOpacity
                    onPress={async () => {
                      addPollOption();
                    }}
                  >
                    <Text style={{}}>+ add option</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* is poll */}
              {allowCreatePoll && (
                <View style={{ paddingLeft: 10, marginTop: 10 }}>
                  <Checkbox
                    checked={poll}
                    onPress={async () => {
                      setPoll(!poll);
                    }}
                    text={
                      <Text style={{ fontWeight: "normal", fontSize: 12, color: "grey" }}>
                        Create a poll with multiple dates &amp; times
                      </Text>
                    }
                  />
                </View>
              )}

              {/* event details */}
              <View
                style={{
                  height: 140,
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                  //backgroundColor: "yellow",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Event Details</Text>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: "blue",
                    borderWidth: 1,
                    borderColor: "lightgrey",
                    borderRadius: 10,
                    margin: 0,
                    paddingTop: 10,
                    paddingBottom: 0,
                    paddingLeft: 10,
                    textAlign: "left",
                    fontSize: 16,
                    backgroundColor: "white",
                    minHeight: 100,
                  }}
                  multiline={true}
                  autoFocus={false}
                  numberOfLines={10}
                  defaultValue={text}
                  onChangeText={(text) => {
                    setText(text);
                  }}
                  placeholder="Details..."
                />
              </View>
            </View>
            {/* button */}
            <View
              style={{
                //backgroundColor: "cyan",
                height: 40,
                width: "100%",
                alignItems: "flex-end",
                paddingRight: 10,
              }}
            >
              <View
                style={{
                  width: 180,
                  alignItems: "flex-end",
                }}
              >
                <MyButtons.FormButton
                  text="CREATE EVENT"
                  onPress={async () => {
                    //const m = moment(date);
                    if (!poll) {
                      await sendEvent(title, text, startDate, startTime, endTime);
                    } else {
                      sendPoll(title, text, pollOptions).then(() => {
                        onComplete();
                      });
                    }
                  }}
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
            console.log("DateTimePicker onchange: " + newValue);
            setTime(newValue);
          }}
        />
      </Portal>
    </Modal>
  );
}
