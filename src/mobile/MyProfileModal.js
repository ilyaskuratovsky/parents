// @flow strict-local

import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState, useCallback } from "react";
import * as React from "react";
//import * as Permissions from "expo-permissions";
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import Loading from "./Loading";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import uuid from "uuid";
import { storage } from "../../config/firebase";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as Actions from "../common/Actions";
import { userInfo } from "../common/Actions";
import * as Controller from "../common/Controller";
import * as Globals from "./Globals";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import { profileIncomplete } from "../common/UserInfo";
import * as Debug from "../common/Debug";
import * as Logger from "../common/Logger";
import * as Data from "../common/Data";
import type { UserInfo } from "../common/Database";

type Props = {
  forceComplete: boolean,
};
export default function MyProfileModal({ forceComplete }: Props): React.Node {
  Logger.log("Showing MyProfileModal");
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={true} animationType={"slide"}>
      <ModalContainer userInfo={userInfo} forceComplete={forceComplete} />
    </Modal>
  );
}

function ModalContainer({ userInfo, forceComplete }) {
  const dispatch = useDispatch();
  //const userInfo = Data.getCurrentUser();
  const [firstName, setFirstName] = useState(userInfo.firstName ?? "");
  const [lastName, setLastName] = useState(userInfo.lastName ?? "");
  const [editingImage, setEditingImage] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(userInfo.image);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const _maybeRenderUploadingOverlay = () => {
    if (uploading) {
      console.log("MyProfileModal: returning loading");
      return <Loading />;
    }
  };

  const _handleImagePicked = async (pickerResult) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri, userInfo);
        setImage(uploadUrl);
      }
    } catch (e) {
      Logger.log(e);
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

    Logger.log(JSON.stringify(pickerResult));

    _handleImagePicked(pickerResult);
  };

  const _takePhoto = async () => {
    Alert.alert("launching camera");
    const { granted } = await requestPermission();
    if (granted) {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      }).catch((error) => {
        Alert.alert("got error launching camera: " + JSON.stringify(error));
      });

      _handleImagePicked(pickerResult);
    }
  };

  const isProfileComplete = useCallback(() => {
    return (
      firstName != null && firstName.trim() !== "" && lastName != null && lastName.trim() != ""
    );
  }, [firstName, lastName]);

  return (
    <Portal>
      <TopBarMiddleContentSideButtons
        style={{}}
        left={
          <MyButtons.LinkButton
            text="Cancel"
            disabled={forceComplete}
            onPress={() => {
              dispatch(Actions.closeModal());
            }}
          />
        }
        center={<Text style={{ fontWeight: "bold", fontSize: 16 }}>My Profile</Text>}
        right={
          <MyButtons.LinkButton
            text="Save"
            disabled={!isProfileComplete()}
            onPress={() => {
              const saveProfile = async () => {
                await Controller.saveProfile(userInfo.uid, firstName, lastName, image);
                dispatch(Actions.closeModal());
              };
              saveProfile();
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
            onPress={() => {
              const logout = async () => {
                await Controller.logout(dispatch);
                dispatch(Actions.closeModal());
              };
              logout();
            }}
          />
        </View>
      </View>
      {_maybeRenderUploadingOverlay()}
    </Portal>
  );
}

async function uploadImageAsync(uri: string, userInfo: UserInfo) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      Logger.log(JSON.stringify(e));
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  Logger.log("blob:" + JSON.stringify(blob));

  //const fileRef = ref(getStorage(), uuid.v4());
  const fileRef = ref(storage, "images/profile/" + userInfo.uid + "_" + uuid.v4() + ".jpg");
  Logger.log("uploading");
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
