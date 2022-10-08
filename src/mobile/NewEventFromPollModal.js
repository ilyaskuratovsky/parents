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
import Checkbox from "./Checkbox";
import * as Debug from "../common/Debug";
import TimePickerModal from "./TimePickerModal";
import DatePickerModal from "./DatePickerModal";
import DateInput from "./DateInput";
import TimeInput from "./TimeInput";
import * as Data from "../common/Data";
import * as Date from "../common/Date";
import FacePile from "./FacePile";
import * as Actions from "../common/Actions";

export default function NewEventFromPollModal({ pollMessageId }) {
  const debugMode = Debug.isDebugMode();
  const message = Data.getRootMessageWithChildrenAndUserStatus(pollMessageId);
  const group = message.group;
  const userInfo = Data.getCurrentUser();

  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [text, setText] = useState(message.text);
  const [title, setTitle] = useState(message.title);
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [checkedPollOption, setCheckedPollOption] = useState(null);
  const [booked, setBooked] = useState(false);

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
      pollMessageId, //papa id
      {
        groupName,
        fromName,
      }
    );
    setBooked(true);

    dispatch(Actions.closeModal());
  }, []);

  useEffect(() => {
    return () => {
      if (booked) {
        Alert.alert("Book in Calendar?", null, [
          {
            text: "Yes",
            onPress: () => {
              dispatch(
                Actions.openModal({
                  modal: "BOOK_IN_CALENDAR",
                  title: title,
                  notes: text,
                  start: startDate,
                  end: endTime,
                })
              );
            },
          },
          {
            text: "No",
            onPress: () => {
              // console.log("Cancel Pressed");
              // setShowBookCalendar(null);
            },
            style: "cancel",
          },
        ]);
      }
    };
  });

  return (
    <Modal visible={true} animationType={"slide"}>
      <Portal>
        {/* top bar */}
        <TopBarMiddleContentSideButtons
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
          height={40}
          left={
            <MyButtons.LinkButton
              text="Cancel"
              onPress={() => {
                dispatch(Actions.closeModal());
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
          {debugMode && <Text style={{ fontSize: 10 }}>NewEventFromPollModal</Text>}
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

              <View
                style={{
                  marginTop: 0,
                  paddingLeft: 10,
                  flexDirection: "column",
                  justifyContent: "center",
                  //backgroundColor: "cyan",
                }}
              >
                <Text style={{ fontSize: 10, color: "grey" }}>Poll Results</Text>
                {/* poll results */}
                {message.event_poll.options.map((option, index) => {
                  const optionSummary = message.event_poll_response_summary.filter((summary) => {
                    return summary.poll_option.name === option.name;
                  })[0];

                  return (
                    <View
                      style={{
                        paddingTop: 8,
                        paddingBottom: 4,
                        paddingLeft: 10,
                        backgroundColor: "lightgrey",
                        //marginTop: index == 0 ? 0 : 10,
                        marginBottom: index == 0 ? 4 : 4,
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <Checkbox
                          checked={checkedPollOption == option.name}
                          onPress={async () => {
                            if (checkedPollOption != option.name) {
                              setCheckedPollOption(option.name);
                              setStartDate(Date.toDate(option.startDate));
                              setStartTime(Date.toDate(option.startDate));
                              setEndTime(Date.toDate(option.endTime));
                            } else {
                              setCheckedPollOption(null);
                            }
                          }}
                          text={null}
                        />
                        <Text style={{ fontWeight: "bold" }}>
                          {moment(Date.toDate(option.startDate)).format("LLLL") +
                            " - " +
                            moment(Date.toDate(option.endTime)).format("LT")}
                        </Text>
                      </View>
                      {optionSummary.uid_list.length >= 0 && (
                        <View style={{ marginLeft: 0 }}>
                          <FacePile userIds={optionSummary.uid_list} border />
                        </View>
                      )}
                      {optionSummary.uid_list.length == 0 && (
                        <View style={{ marginLeft: 0, height: 24 }}></View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Date and Time */}
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
                    <DateInput
                      date={startDate}
                      onChange={(value) => {
                        setStartDate(value);
                      }}
                    />
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
                    <TimeInput
                      time={startTime}
                      onChange={(value) => {
                        setStartTime(value);
                      }}
                    />
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
                    <TimeInput
                      time={endTime}
                      onChange={(value) => {
                        setEndTime(value);
                      }}
                    />
                  </View>
                </View>
              </View>
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
                    borderWidth: 1,
                    borderColor: "lightgrey",
                    borderRadius: 10,
                    paddingTop: 10,
                    paddingLeft: 10,
                    textAlign: "left",
                    fontSize: 16,
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
                    await sendEvent(title, text, startDate, startTime, endTime);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Portal>
    </Modal>
  );
}
