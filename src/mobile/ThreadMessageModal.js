// @flow strict-local
import React, { useState, useCallback } from "react";
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
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
import * as Controller from "../common/Controller";
import * as Debug from "../common/Debug";
import DebugText from "./DebugText";

export default function ThreadMessageModal({ groupId }) {
  const dispatch = useDispatch();
  const isDebugMode = Debug.isDebugMode();
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState([]);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const userInfo = Data.getCurrentUser();
  const group = Data.getGroup(groupId);
  //<KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: "white" }}>
  //</KeyboardAvoidingView>
  const sendMessage = useCallback(
    async (title, text) => {
      const groupName = group?.name;
      const fromName = UserInfo.chatDisplayName(userInfo);
      const data = {};
      const attachments =
        images.length > 0
          ? images.map((image) => {
              return { type: "image", uri: image.remoteUri };
            })
          : null;
      if (attachments != null) {
        data["attachments"] = attachments;
      }

      return await Controller.sendMessage(
        dispatch,
        userInfo,
        groupId,
        title,
        text,
        data,
        null, // papa id
        {
          groupName,
          fromName,
        }
      );
    },
    [title, text, images]
  );

  const canPost = () => {
    const notUploadedImages = images.filter(
      (image) => image.remoteUri == null && image.localUri != null
    );
    const hasText = title.length > 0 || text.length > 0;
    const hasImages = images.length > 0;
    const hasUnuploaded = hasImages ? notUploadedImages.length > 0 : 0;
    return (hasText && !hasImages) || (hasImages && !hasUnuploaded);
  };
  return (
    <Modal visible={true} animationType={"slide"}>
      <Portal>
        <DebugText text="ThreadMessageModal.js" />
        <DebugText text={"groupId: " + groupId} />
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
              <SelectGroup groupId={groupId} onSet={() => {}} />
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
                disabled={!canPost()}
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
                <ScrollView
                  contentContainerStyle={{ flexDirection: "row", justifyContent: "flex-start" }}
                  horizontal={true}
                >
                  {images.map((image, index) => {
                    const localUri = image.localUri;
                    return (
                      <View style={{ margin: 4 }}>
                        <ImageUpload
                          uri={localUri}
                          style={{ width: 80, height: 80 }}
                          onUploadRemote={(remoteUri) => {
                            const newImages = [...images];
                            newImages[index] = { ...images[index], uploaded: true, remoteUri };
                            setImages(newImages);
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon="camera"
                  color={"blue"}
                  backgroundColor="green"
                  size={32}
                  onPress={async () => {
                    const { status } = await ImagePicker.requestCameraPermissionsAsync();
                    if (status !== "granted") {
                      alert("Sorry, we need camera roll permissions to make this work!");
                    }
                    let pickerResult = await ImagePicker.launchCameraAsync({
                      allowsEditing: true,
                      aspect: [4, 3],
                    });

                    if (!pickerResult.cancelled) {
                      let newImages = [...images];
                      newImages.push({ localUri: pickerResult.uri });
                      setImages(newImages);
                    }
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

                    if (!pickerResult.cancelled) {
                      let newImages = [...images];
                      newImages.push({ localUri: pickerResult.uri });
                      setImages(newImages);
                    }
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

function SelectGroup({ groupId, onSet }) {
  const group = Data.getGroup(groupId);
  return (
    <View
      style={{
        flexGrow: 1,
        alignItems: "flex-start",
        justifyContent: "left",
        flexDirection: "row",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{group?.name}</Text>
      <IconButton
        style={{
          //backgroundColor: "green",
          padding: 0,
          margin: 0,
        }}
        icon="chevron-right"
        color={"darkgrey"}
        size={32}
      />
    </View>
  );
}
