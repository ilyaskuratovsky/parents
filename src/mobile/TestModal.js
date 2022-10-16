// @flow strict-local

import * as Calendar from "expo-calendar";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Utils from "../common/Utils";
import { Divider, CheckBox } from "react-native-elements";
import Checkbox from "./Checkbox";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CommentView from "./CommentView";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import * as Globals from "./Globals";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import BookCalendarEventModal from "./BookCalendarEventModal";
//import moment from "moment";
import moment from "moment-timezone";
import JSONTree from "react-native-json-tree";
import Autolink from "react-native-autolink";
import { userInfo } from "../common/Actions";
import * as Dates from "../common/Date";
import * as Data from "../common/Data";
import * as Message from "../common/MessageData";
import * as Debug from "../common/Debug";
import * as Actions from "../common/Actions";
import * as Logger from "../common/Logger";
import * as MessageData from "../common/MessageData";
import nullthrows from "nullthrows";
import RootMessage from "../common/MessageData";
import DebugText from "./DebugText";
import BottomModal from "./BottomModal";

type Props = {};
export default function EventModalContainer(): React.Node {
  const [rsvpVisible, setRsvpVisible] = useState(false);
  const { height, width } = Dimensions.get("window");

  return (
    <View
      style={{ flex: 1, backgroundColor: "cyan", justifyContent: "center", alignItems: "center" }}
    >
      <BottomModal
        animation="slide"
        visible={rsvpVisible}
        mode="overFullScreen"
        boxBackgroundColor="lightyellow"
        transparentContainer={true}
        bottomHalf={false}
        outsideClick={() => {
          setRsvpVisible(false);
        }}
      >
        <Text>
          This is an extended modal content to show how far the modal content will wrap the text
          inside
        </Text>
        <Button
          title="Close Modal"
          onPress={() => {
            setRsvpVisible(false);
          }}
        />
      </BottomModal>
      <MyButtons.FormButton
        text="RSVP"
        onPress={async () => {
          //await sendEventReply(eventResponse, text);
          setRsvpVisible(true);
        }}
      />
      <Text>
        {height},{width}
      </Text>
    </View>
  );
}
