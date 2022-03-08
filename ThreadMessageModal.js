import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Divider } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MyButtons from "./MyButtons";
import * as UserInfo from "./UserInfo";

export default function ThreadMessageModal({
  userInfo,
  group,
  visible,
  sendMessage,
  closeModal,
}) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(null);
  console.log("text: " + text);

  return (
    <Modal visible={visible} animationType={"slide"}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <View style={{ top: 0, height: 44 }} />
        <View
          style={{
            height: 30,
            paddingLeft: 8,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              closeModal();
            }}
          >
            <Text style={{ fontSize: 20, color: "blue" }}>Close</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 50,
            flexDirection: "column",
          }}
        >
          <View
            style={{
              //height: 100,
              flex: 1,
              paddingLeft: 8,
              paddingRight: 4,
              paddingTop: 8,
              paddingBottom: 8,
              flexDirection: "row",
              //zIndex: Number.MAX_VALUE,
            }}
          >
            <View
              style={{
                flexGrow: 1,
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {group.name}
              </Text>
            </View>
            <View
              style={{
                width: 80,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MyButtons.FormButton
                text="POST"
                onPress={async () => {
                  sendMessage(text).then(() => {
                    closeModal();
                  });
                }}
              />
            </View>
          </View>
        </View>
        <Divider style={{}} width={1} color="darkgrey" />
        <View style={{ flexGrow: 1 }}>
          <View
            style={{
              height: 40,
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 0,
              //backgroundColor: "green",
            }}
          >
            {UserInfo.avatarComponent(userInfo)}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 20,
              }}
            >
              <Text
                style={{
                  marginLeft: 5,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {UserInfo.chatDisplayName(userInfo)}
              </Text>
            </View>
          </View>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: "blue",
              margin: 0,
              paddingTop: 10,
              paddingBottom: 0,
              paddingLeft: 10,
              textAlign: "left",
              fontSize: 16,
              backgroundColor: "white",
            }}
            multiline={true}
            autoFocus={true}
            onChangeText={(text) => {
              setText(text);
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
