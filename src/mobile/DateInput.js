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

export default function DateInput({ date, onChange }) {
  const [showDatePicker, setShowDatePicker] = useState(null);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShowDatePicker({
            value: date ?? new Date(),
            onChange: (value) => {
              onChange(value);
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
            width: 200,
          }}
        >
          {date != null ? moment(date).format("dddd, MMMM Do YYYY") : ""}
        </Text>
      </TouchableOpacity>
      <DatePickerModal
        visible={showDatePicker != null}
        value={showDatePicker?.value}
        onChange={showDatePicker?.onChange}
        closeModal={() => {
          setShowDatePicker(null);
        }}
      />
    </>
  );
}
