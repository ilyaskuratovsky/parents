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

export default function TimeInput({ time, onChange }) {
  const [showTimePicker, setShowTimePicker] = useState(null);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShowTimePicker({
            value: time ?? Dates.roundToNearest(new Date(), 15),
            onChange: (value) => {
              onChange(value);
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
          {time != null ? moment(time).format("LT") : ""}
        </Text>
      </TouchableOpacity>
      <TimePickerModal
        value={showTimePicker?.value}
        visible={showTimePicker != null}
        onChange={showTimePicker?.onChange}
        closeModal={() => {
          setShowTimePicker(null);
        }}
      />
    </>
  );
}
