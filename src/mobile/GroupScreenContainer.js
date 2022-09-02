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
import { Icon } from "react-native-elements";
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
import SchoolScreen from "./SchoolScreen";
import GroupScreen from "./GroupScreen";

export default function GroupScreenContainer({ groupId, messageId, debug }) {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const group = Data.getGroup(groupId);
  const org = group.orgId != null ? Data.getOrg(group.orgId) : null;
  /*
  if (org != null) {
    return <SchoolScreen schoolId={org.id} />;
  } else {
    return <GroupScreen groupId={group.id} messageId={messageId} />;
  }
  */
  return <GroupScreen groupId={group.id} messageId={messageId} />;
}
