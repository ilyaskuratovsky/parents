import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import * as Paper from "react-native-paper";
import { Button as PaperButton, Dialog } from "react-native-paper";
import { renderers } from "react-native-popup-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import BottomBar from "./BottomBar";
import * as Controller from "./Controller";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import TopBar from "./TopBar";
import * as UIConstants from "./UIConstants";

function PlaybooksListScreen(props) {
  const myGroups = useSelector((state) => state.main.groupSubscriptions);
  const dispatch = useDispatch();
  return (
    <Paper.Provider>
      <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
        <TopBar
          style={{ backgroundColor: UIConstants.DEFAULT_BACKGROUND }}
          left={null}
          center={<Text style={styles.topBarCenterText}>Groups</Text>}
          right={null}
        />
      </Portal>
      ..
    </Paper.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backdrop: {},
  menuOptions: {
    padding: 50,
  },
  menuTrigger: {
    padding: 5,
  },
  triggerText: {
    fontSize: 20,
  },
  contentText: {
    fontSize: 18,
  },
  topBarCenterText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});

export default PlaybooksListScreen;
