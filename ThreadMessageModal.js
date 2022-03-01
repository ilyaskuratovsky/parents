import React, { useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Modal,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import { IconButton } from "react-native-paper";

import { Avatar, Divider } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import TopBar from "./TopBar";

export default function ThreadMessageModal({ visible, closeModal }) {
  const insets = useSafeAreaInsets();
  console.log("top: " + insets.top);
  return (
    <Modal visible={visible} animationType={"slide"}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <View style={{ top: 0, height: 44 }} />
        <View
          style={{
            height: 60,
            backgroundColor: "green",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              //height: 100,
              flex: 1,
              paddingLeft: 4,
              paddingRight: 4,
              paddingTop: 8,
              paddingBottom: 8,
              flexDirection: "row",
              //zIndex: Number.MAX_VALUE,
            }}
          >
            <View
              style={{
                width: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton icon="chevron-right" color={"darkgrey"} size={32} />
            </View>
            <View
              style={{
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Mrs.Legio Class 4th Grade
              </Text>
            </View>
            <View
              style={{
                width: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton icon="chevron-right" color={"darkgrey"} size={32} />
            </View>
          </View>
        </View>
        <View style={{ flexGrow: 1 }}>
          <View
            style={{
              height: 80,
              justifyContent: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 5,
              backgroundColor: "white",
            }}
          >
            <Avatar
              size={28}
              rounded
              title="I"
              containerStyle={{
                backgroundColor: "coral",
                marginRight: 1,
              }}
            />
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
                Ilya Skuratovsky
              </Text>
            </View>
          </View>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: "blue",
              margin: 10,
              paddingTop: 10,
              paddingBottom: 0,
              paddingLeft: 10,
              textAlign: "left",
              fontSize: 16,
              backgroundColor: "white",
            }}
            multiline={true}
            autoFocus={true}
          />
        </View>
        <View style={{ height: 50 }}>
          <Button
            title="Close"
            onPress={() => {
              closeModal();
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
