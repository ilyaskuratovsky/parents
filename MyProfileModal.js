import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { IconButton } from "react-native-paper";
import { Image } from "react-native-expo-image-cache";

import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as Paper from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { groupMemberships, userInfo } from "./Actions";
import * as MyButtons from "./MyButtons";
import * as Controller from "./Controller";
import * as Globals from "./Globals";
import Portal from "./Portal";
import * as Actions from "./Actions";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import uuid from "uuid";

import { getStorage, ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { storage } from "./config/firebase";

export default function MyProfileModal({ visible }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType={"slide"}>
      {visible && <ModalContainer userInfo={userInfo} />}
    </Modal>
  );
}

function ModalContainer({ userInfo }) {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(userInfo.firstName);
  const [lastName, setLastName] = useState(userInfo.lastName);
  const [editingImage, setEditingImage] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(userInfo.image);

  const _maybeRenderUploadingOverlay = () => {
    if (uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  const _handleImagePicked = async (pickerResult) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        setImage(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  };

  const _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log({ pickerResult });

    _handleImagePicked(pickerResult);
  };

  const _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    _handleImagePicked(pickerResult);
  };

  return (
    <Portal>
      <TopBarMiddleContentSideButtons
        style={{}}
        left={
          <MyButtons.LinkButton
            text="Cancel"
            onPress={async () => {
              dispatch(
                Actions.closeModal({
                  modal: "MY_PROFILE",
                })
              );
            }}
          />
        }
        center={<Text style={{ fontWeight: "bold", fontSize: 16 }}>My Profile</Text>}
        right={
          <MyButtons.LinkButton
            text="Done"
            onPress={async () => {
              await Controller.saveProfile(userInfo.uid, firstName, lastName, image);
              dispatch(
                Actions.closeModal({
                  modal: "MY_PROFILE",
                })
              );
            }}
          />
        }
      />
      {Globals.dev && <Text style={{ fontSize: 10 }}>{userInfo.uid}</Text>}
      <View
        style={{
          paddingTop: 20,
          paddingLeft: 10,
          paddingRight: 10,
          flexDirection: "column",
          height: 140,
          //backgroundColor: "cyan",
        }}
      >
        <TextInput
          key="first_name_input"
          style={{
            borderWidth: 1,
            paddingLeft: 10,
            height: 40,
            marginBottom: 20,
            fontSize: 16,
          }}
          onChangeText={(value) => {
            setFirstName(value);
          }}
          placeholder={"First Name"}
          value={firstName ?? ""}
          selectTextOnFocus={true}
        />
        <TextInput
          key="last_name_input"
          style={{
            borderWidth: 1,
            paddingLeft: 10,
            height: 40,
            fontSize: 16,
          }}
          onChangeText={(value) => {
            setLastName(value);
          }}
          placeholder={"Last Name"}
          value={lastName ?? ""}
          selectTextOnFocus={true}
        />
        <Text style={{ marginTop: 20 }}>Profile Picture</Text>
        <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}>
          {image == null && (
            <Text style={{ width: 80, height: 80, borderRadius: 400 / 2 }}>No Profile Image</Text>
          )}
          {image != null && (
            <Image style={{ height: 80, width: 80, borderRadius: 40 }} uri={image} />
          )}
          {/*
          <IconButton
            icon="pencil"
            color={"blue"}
            size={38}
            onPress={() => {
              setEditingImage(!editingImage);
            }}
          />
          */}
          {editingImage && (
            <>
              <Button onPress={_pickImage} title="Pick Image" />
              <Button onPress={_takePhoto} title="Take Photo" />
            </>
          )}
        </View>
        <View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
          <MyButtons.LinkButton
            text="Log Out"
            onPress={async () => {
              await Controller.logout();
              dispatch(
                Actions.closeModal({
                  modal: "MY_PROFILE",
                })
              );
            }}
          />
        </View>
      </View>
      {_maybeRenderUploadingOverlay()}
    </Portal>
  );
}

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  console.log("blob:" + JSON.stringify(blob));

  //const fileRef = ref(getStorage(), uuid.v4());
  const fileRef = ref(storage, "images/profile/" + userInfo.uid + "_" + uuid.v4() + ".jpg");
  console.log("uploading");
  const result = await uploadBytes(fileRef, blob);
  // We're done with the blob, close and release it
  blob.close();

  /*
  const string1 = "5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
  try {
    uploadString(fileRef, string1)
      .then((response) => {
        console.log("response; " + JSON.stringify(response));
      })
      .catch((error) => {
        console.log("error caught in promise: " + JSON.stringify(error));
      });
  } catch (e) {
    console.log("error caugh: " + JSON.stringify(e));
  }
  */
  return await getDownloadURL(fileRef);
}
