import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Avatar, Divider } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MyButtons from "./MyButtons";
import * as UserInfo from "../common/UserInfo";
import Portal from "./Portal";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import * as Localization from "expo-localization";
import * as UIConstants from "./UIConstants";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";

export default function NewEventModal({ userInfo, group, visible, sendEvent, showModal }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(null);
  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

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
                  const m = moment(date);
                  const timezone = Localization.timezone;
                  sendEvent(title, text, { date, startTime, endTime, timezone }).then(() => {
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
              marginTop: 10,
              paddingLeft: 10,
              flexDirection: "column",
              justifyContent: "center",
              height: 100,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ width: 50, fontSize: 16 }}>Date: </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(!showDatePicker);
                }}
                style={{ backgroundColor: "lightgrey", padding: 10, borderRadius: 10 }}
              >
                <Text style={{ width: 90, fontSize: 16 }}>{moment(date).format("L")}</Text>
              </TouchableOpacity>
            </View>
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
