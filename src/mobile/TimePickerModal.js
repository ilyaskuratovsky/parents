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

export default function TimePickerModal({ value, visible, onChange, closeModal }) {
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
