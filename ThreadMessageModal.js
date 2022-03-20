import React, { useState } from "react";
import { KeyboardAvoidingView, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Avatar, Divider } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MyButtons from "./MyButtons";
import * as UserInfo from "./UserInfo";
import Portal from "./Portal";

export default function ThreadMessageModal({ userInfo, group, visible, sendMessage, showModal }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState(null);
  const [title, setTitle] = useState(null);
  //<KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: "white" }}>
  //</KeyboardAvoidingView>

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal>
        {/* top close section */}
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
              showModal(false);
            }}
          >
            <Text style={{ fontSize: 20, color: "blue" }}>Close</Text>
          </TouchableOpacity>
        </View>
        {/* group name and post button section*/}
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
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>{group.name}</Text>
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
                  sendMessage(title, text).then(() => {
                    showModal(false);
                  });
                }}
              />
            </View>
          </View>
          <Divider style={{}} width={1} color="darkgrey" />
        </View>
        {/* message section */}
        <View style={{ flexGrow: 1 }}>
          {/* avatar */}
          <View
            style={{
              height: 40,
              paddingLeft: 10,
              paddingRight: 10,
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

          {/* title */}
          <View style={{ height: 50, paddingLeft: 10, paddingRight: 10 }}>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderRadius: 5,
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 10,
                textAlign: "left",
                fontSize: 16,
                backgroundColor: "white",
              }}
              placeholder="Title"
              multiline={false}
              autoFocus={true}
              onChangeText={(text) => {
                setTitle(text);
              }}
            />
          </View>

          {/* message */}
          <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }}>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: "blue",
                borderWidth: 1,
                borderRadius: 5,
                margin: 0,
                paddingTop: 10,
                paddingBottom: 0,
                paddingLeft: 10,
                textAlign: "left",
                fontSize: 16,
                backgroundColor: "white",
              }}
              multiline={true}
              autoFocus={false}
              onChangeText={(text) => {
                setText(text);
              }}
            />
          </View>
        </View>
      </Portal>
    </Modal>
  );
}
