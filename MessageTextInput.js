import React, { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  TextInput,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ThreadMessageModal from "./ThreadMessageModal";
import TimeAgo from "react-timeago";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./Actions";
import * as MyButtons from "./MyButtons";

export default function MessageTextInput({ onPressSend }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <TextInput
        style={{
          flex: 1,
          borderColor: "black",
          borderRadius: 5,
          borderWidth: 1,
          textAlign: "left",
          fontSize: 16,
          backgroundColor: "white",
          flexGrow: 1,
          textAlignVertical: "center",
          paddingLeft: 5,
        }}
        multiline={false}
        placeholder="Reply..."
        onChangeText={(text) => {
          setText(text);
        }}
      />
      <MyButtons.FormButton
        style={{ width: 120 }}
        text={busy ? "..." : "Send"}
        onPress={async () => {
          setBusy(true);
          onPressSend(text).then(() => {
            setBusy(false);
          });
        }}
      />
    </View>
  );
}
