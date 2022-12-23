// @flow strict-local

import { useState, useCallback, useEffect } from "react";
import * as React from "react";

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
import * as Logger from "../common/Logger";

type Props = {
  value: ?Date,
  visible: boolean,
  onChange: ?(?Date) => void,
  closeModal: () => void,
};

export default function DatePickerModal({
  value,
  visible,
  onChange,
  closeModal,
}: Props): React.Node {
  const [date, setDate] = useState<?Date>(value ?? null);
  useEffect(() => {
    setDate(value);
  }, [value]);
  Logger.log("Time picker modal visible: " + (visible ? "true" : "false"));
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
                if (onChange != null) {
                  onChange(date);
                }
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
