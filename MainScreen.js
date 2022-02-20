import React from "react";
import { StyleSheet, Text } from "react-native";
import * as Paper from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
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
