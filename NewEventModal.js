import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Divider } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MyButtons from "./MyButtons";
import * as UserInfo from "./UserInfo";
import Portal from "./Portal";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

export default function NewEventModal({
  userInfo,
  group,
  visible,
  sendEvent,
  showModal,
}) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(null);
  const [title, setTitle] = useState(null);
  //<KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: "white" }}>
  //</KeyboardAvoidingView>
  const [date, setDate] = useState(moment());
  const [startTime, setStartTime] = useState(moment());
  const [endTime, setEndTime] = useState(moment());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    alert("on date change");
    const currentDate = selectedDate || date;
    setDate(moment(currentDate));
    setShowDatePicker(false);
  };

  const onStartTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setStartTime(moment(currentDate));
    setShowStartTimePicker(false);
  };

  const onEndTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setEndTime(moment(currentDate));
    setShowEndTimePicker(false);
  };

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal>
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
            height: 50,
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
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {group.name}
              </Text>
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
                  const startDate = moment();
                  startDate.set({
                    year: date.year,
                    month: date.month,
                    date: date.date,
                    hour: startTime.get("hour"),
                    minute: startTime.get("minute"),
                  });
                  const endDate = moment();
                  startDate.set({
                    year: date.year,
                    month: date.month,
                    date: date.date,
                    hour: endTime.get("hour"),
                    minute: endTime.get("minute"),
                  });
                  sendEvent(
                    title,
                    text,
                    startDate.format(),
                    endDate.format()
                  ).then(() => {
                    showModal(false);
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
            {UserInfo.avatarComponent(userInfo)}
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
          <View style={{ height: 50, paddingLeft: 10, paddingRight: 10 }}>
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
          {/* Starts */}
          <View
            style={{
              flexDirection: "column",
              height: 100,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text>Date: </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(!showDatePicker);
                }}
              >
                <Text>{date.format("L")}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text>Start Time: </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowStartTimePicker(!showStartTimePicker);
                }}
              >
                <Text>{startTime.format("LT")}</Text>
              </TouchableOpacity>
              <Text>End Time: </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowEndTimePicker(!showEndTimePicker);
                }}
              >
                <Text>{endTime.format("LT")}</Text>
              </TouchableOpacity>
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
              }}
              multiline={true}
              autoFocus={false}
              onChangeText={(text) => {
                setText(text);
              }}
            />
          </View>
        </View>
        <Modal visible={showDatePicker} animationType={"slide"}>
          <DateTimePicker
            display={"inline"}
            mode={"date"}
            value={startTime.toDate()}
            onChange={onDateChange}
          />
        </Modal>
        <Modal visible={showStartTimePicker} animationType={"slide"}>
          <DateTimePicker
            display={"spinner"}
            mode={"time"}
            value={startTime.toDate()}
            onChange={onStartTimeChange}
          />
        </Modal>
        <Modal visible={showEndTimePicker} animationType={"slide"}>
          <DateTimePicker
            display={"spinner"}
            mode={"time"}
            value={endTime.toDate()}
            onChange={onEndTimeChange}
          />
        </Modal>
      </Portal>
    </Modal>
  );
}