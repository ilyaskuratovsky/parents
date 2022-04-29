import React, { useState } from "react";
import { TextInput, View } from "react-native";
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
