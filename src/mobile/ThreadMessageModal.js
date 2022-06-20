import React, { useState, useCallback } from "react";
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { Divider } from "react-native-elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import * as UserInfo from "../common/UserInfo";
import { IconButton } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import ImageUpload from "./ImageUpload";
import * as Data from "../common/Data";
import { useDispatch } from "react-redux";
import * as Actions from "../common/Actions";

export default function ThreadMessageModal({ groupId }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState([]);
  const [text, setText] = useState(null);
  const [title, setTitle] = useState(null);
  const userInfo = Data.getCurrentUser();
  const group = Data.getGroup(groupId);
  //<KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: "white" }}>
  //</KeyboardAvoidingView>
  const sendMessage = useCallback(async (title, text) => {
    const groupName = group.name;
    const fromName = UserInfo.chatDisplayName(userInfo);
    return await Controller.sendMessage(
      dispatch,
      userInfo,
      groupId,
      title,
      text,
      null, // data
      null, // papa id
      {
        groupName,
        fromName,
      }
    );
  }, []);

  return (
    <Modal visible={true} animationType={"slide"}>
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
              dispatch(Actions.closeModal());
            }}
          >
            <Text style={{ fontSize: 20, color: "blue" }}>Close</Text>
          </TouchableOpacity>
        </View>
        {/* group name and post button section*/}
        <View
          style={{
            height: 60,
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
                    dispatch(Actions.closeModal());
                  });
                }}
              />
            </View>
          </View>
          <Divider style={{}} width={1} color="darkgrey" />
        </View>
        {/* message section */}
        <KeyboardAvoidingView
          style={{
            flex: 1,
            //backgroundColor: "green",
          }}
          behavior="padding"
          keyboardVerticalOffset={40}
          enabled
        >
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
              {UserInfo.smallAvatarComponent(userInfo)}
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
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
                flexDirection: "column",
              }}
            >
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
              <View style={{}}>
                <Text style={{ fontSize: 7 }}>{images.length > 0 ? images[0] : "0"}</Text>
                {images.map((image) => {
                  return <ImageUpload uri={image} style={{ width: 80, height: 80 }} />;
                })}
              </View>
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon="camera"
                  color={"blue"}
                  size={32}
                  onPress={async () => {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== "granted") {
                      alert("Sorry, we need camera roll permissions to make this work!");
                    }
                    let pickerResult = await ImagePicker.launchImageLibraryAsync({
                      allowsEditing: true,
                      aspect: [4, 3],
                    });

                    console.log({ pickerResult });
                    setImages([...images].concat([pickerResult.uri]));
                  }}
                />
                <IconButton
                  icon="image"
                  color={"blue"}
                  backgroundColor="green"
                  size={32}
                  onPress={async () => {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== "granted") {
                      alert("Sorry, we need camera roll permissions to make this work!");
                    }
                    let pickerResult = await ImagePicker.launchImageLibraryAsync({
                      allowsEditing: true,
                      aspect: [4, 3],
                    });

                    console.log({ pickerResult });
                    setImages([...images].concat([pickerResult.uri]));
                  }}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Portal>
    </Modal>
  );
}
