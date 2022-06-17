import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Modal,
} from "react-native";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookCalendarEventModal from "./BookCalendarEventModal";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import * as Date from "../common/Date";
import FacePile from "./FacePile";
import * as Globals from "./Globals";
import GroupSettingsModal from "./GroupSettingsModal";
import MessageModal from "./MessageContainerModal";
import * as MessageUtils from "../common/MessageUtils";
import MessageViewContainer from "./MessageViewContainer";
import NewEventModal from "./NewEventModal2";
import Portal from "./Portal";
import * as Actions from "../common/Actions";
import ThreadMessageModal from "./ThreadMessageModal";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as MyButtons from "./MyButtons";
import Loading from "./Loading";
import * as Logger from "../common/Logger";
import * as Debug from "../common/Debug";
import * as Data from "../common/Data";
import TopBar from "./TopBar";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";

export default function ChatScreen({ chatId }) {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  //const chat = Data.getChat(chatId);

  return (
    <Modal visible={true} animationType={"none"}>
      <Portal>
        <TopBarMiddleContentSideButtons
          height={64}
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                dispatch(Actions.closeModal());
              }}
              color="black"
            />
          }
          center={<Text>Chat</Text>}
          right={null}
        />
      </Portal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // row
    alignItems: "center",
  },
});
