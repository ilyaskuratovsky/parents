import React, { useState, useRef } from "react";
import { Alert, SafeAreaView, Text, TextInput, View, Modal, ScrollView } from "react-native";
import JSONTree from "react-native-json-tree";
import { useDispatch, useSelector } from "react-redux";
import * as Database from "../common/Database";
import * as MyButtons from "./MyButtons";
import Toolbar from "./Toolbar";
import * as Globals from "./Globals";
import * as Debug from "../common/Debug";
//import { Tooltip, Text } from "react-native-elements";
import * as Actions from "../common/Actions";
import { Clipboard } from "react-native";

export default function DebugText({ text }) {
  //const lines = (children.match(/\n/g) || "").length + 1;
  const debugMode = Debug.isDebugMode();
  let displayText = text;
  if (text === null) {
    displayText = "null";
  } else if (text === undefined) {
    displayText = "undefined";
  }
  const lines = (displayText.match(/\n/g) || "").length + 1;
  const dispatch = useDispatch();

  const defaultNumberOfLines = 5;
  const [numberOfLines, setNumberOfLines] = useState(Math.min(lines, defaultNumberOfLines));

  //const lines = 5;
  if (!debugMode) {
    return null;
  }
  const scrollViewStyle =
    numberOfLines > defaultNumberOfLines ? { height: Math.min(numberOfLines * 15, 500) } : null;

  const scrollViewRef = useRef();
  const isSmall = numberOfLines == defaultNumberOfLines;
  const textComponent = (
    <Text
      onPress={() => {
        //dispatch(Actions.openModal({ modal: "DEBUG_TEXT", text: children }));
        setNumberOfLines(numberOfLines > defaultNumberOfLines ? defaultNumberOfLines : lines);
      }}
      numberOfLines={numberOfLines}
      style={{ fontSize: 9, color: "black" }}
    >
      ({lines}) {displayText}
    </Text>
  );
  return (
    <View style={{ marginTop: 4, marginBottom: 4, backgroundColor: "yellow" }}>
      {isSmall ? (
        textComponent
      ) : (
        <ScrollView ref={scrollViewRef} style={scrollViewStyle}>
          {textComponent}
        </ScrollView>
      )}
      {isSmall && (
        <Text
          style={{ textDecorationLine: "underline", fontSize: 9, color: "blue" }}
          onPress={() => {
            //dispatch(Actions.openModal({ modal: "DEBUG_TEXT", text: children }));
            setNumberOfLines(100);
            scrollViewRef.current?.scrollTo({});
          }}
        >
          more...
        </Text>
      )}
      {numberOfLines > defaultNumberOfLines && (
        <Text
          style={{ textDecorationLine: "underline", fontSize: 9, color: "blue" }}
          onPress={() => {
            //dispatch(Actions.openModal({ modal: "DEBUG_TEXT", text: children }));
            setNumberOfLines(defaultNumberOfLines);
          }}
        >
          less...
        </Text>
      )}
    </View>
  );
}

export function DebugTextModal({ text }) {
  const dispatch = useDispatch();
  const [textState, setTextState] = useState(text);
  return (
    <Modal visible={true} animationType={"slide"}>
      <SafeAreaView style={{ flex: 1 }}>
        <MyButtons.LinkButton
          text="Home"
          onPress={() => {
            dispatch(Actions.closeModal());
          }}
        />
        <TextInput
          defaultValue={textState}
          style={{
            height: 800,
            flex: 1,
            backgroundColor: "blue",
            borderWidth: 1,
            borderRadius: 5,
            margin: 0,
            paddingTop: 10,
            paddingBottom: 0,
            paddingLeft: 10,
            textAlign: "left",
            fontSize: 12,
            backgroundColor: "white",
          }}
          multiline={true}
          autoFocus={false}
          onChangeText={(text) => {
            setTextState(text);
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}
