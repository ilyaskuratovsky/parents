// @flow strict-local

import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, Text, Modal, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import Portal from "./Portal";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as MyButtons from "./MyButtons";
import * as Actions from "../common/Actions";
import { storage } from "../../config/firebase";
import uuid from "uuid";

export default function ImagePickerExample() {
  const dispatch = useDispatch();
  const [imageFromLibrary, setImageFromLibrary] = useState(null);
  const [imageFromLibraryStatus, setImageFromLibraryStatus] = useState(false);
  const [imageFromCamera, setImageFromCamera] = useState(null);
  const [imageFromCameraStatus, setImageFromCameraStatus] = useState(false);
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const pickImage = async () => {
    setImageFromLibraryStatus("Picking...");

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    });

    console.log(result);

    if (!result.cancelled) {
      console.log("result.uri: " + result.uri);
      setImageFromLibrary(result.uri);
      setImageFromLibraryStatus(null);
    }
  };

  const takePhoto = async () => {
    // No permissions request is necessary for launching the image library
    const { granted } = await requestPermission();
    if (granted) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
      });

      console.log(result);

      if (!result.cancelled) {
        console.log("result.uri: " + result.uri);
        setImageFromCamera(result.uri);
      }
    }
  };

  return (
    <Modal visible={true} animationType={"slide"}>
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
          right={null}
        />
        <View style={{ flex: 1, marginTop: 20, marginBottom: 20 }}>
          <View
            style={{ marginTop: 0, flex: 1, alignItems: "center", justifyContent: "flex-start" }}
          >
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            <View style={{ width: 200, height: 200, backgroundColor: "cyan" }}>
              {imageFromLibrary && (
                <View style={{ width: 200, height: 200, backgroundColor: "cyan" }}>
                  <Image
                    source={{ uri: imageFromLibrary }}
                    style={{
                      width: 200,
                      height: 200,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      opacity: 0.5,
                    }}
                  />
                  <Text style={{ width: 200, height: 200, position: "absolute", top: 0, left: 0 }}>
                    {imageFromLibraryStatus}
                  </Text>
                </View>
              )}
            </View>

            <Text style={{ fontSize: 10 }}>image uri: {imageFromLibrary}</Text>
            <Button
              title="Upload to firebase"
              onPress={() => {
                setImageFromLibraryStatus("Uploading...");
                uploadImageAsync(imageFromLibrary, "images/test/" + uuid.v4() + ".jpg")
                  .then((url) => {
                    setImageFromLibraryStatus("Uploaded");
                  })
                  .catch((error) => {
                    setImageFromLibraryStatus("Error Uploading: " + JSON.stringify(error));
                  });
              }}
            />
          </View>
          <View
            style={{ marginTop: 0, flex: 1, alignItems: "center", justifyContent: "flex-start" }}
          >
            <Button title="Take photo" onPress={takePhoto} />
            <View style={{ width: 200, height: 200, backgroundColor: "cyan" }}>
              {imageFromCamera && (
                <View style={{ width: 200, height: 200, backgroundColor: "cyan" }}>
                  <Image
                    source={{ uri: imageFromCamera }}
                    style={{
                      width: 200,
                      height: 200,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      opacity: 0.5,
                    }}
                  />
                  <Text style={{ width: 200, height: 200, position: "absolute", top: 0, left: 0 }}>
                    {imageFromCameraStatus}
                  </Text>
                </View>
              )}
            </View>
            <Button
              title="Upload to firebase"
              onPress={() => {
                setImageFromCameraStatus("Uploading...");
                uploadImageAsync(imageFromCamera, "images/test/" + uuid.v4() + ".jpg")
                  .then((url) => {
                    setImageFromCameraStatus("Uploaded");
                  })
                  .catch((error) => {
                    setImageFromCameraStatus("Error Uploading: " + JSON.stringify(error));
                  });
              }}
            />
            <Text style={{ fontSize: 10 }}>image uri: {imageFromCamera}</Text>
          </View>
        </View>
      </Portal>
    </Modal>
  );
}

async function uploadImageAsync(uri, path) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  Alert.alert();
  Alert.alert("Alert", "Uploading image (" + uri + "): " + path, [
    { text: "OK", onPress: () => console.log("OK Pressed") },
  ]);
  const blob = await new Promise((resolve, reject) => {
    Alert.alert("constructing blob");
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      Alert.alert("xhr.onerror: " + e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    Alert.alert("xhr.open: ");
    xhr.open("GET", uri, true);
    Alert.alert("xhr.send: ");
    xhr.send(null);
  });
  Alert.alert("got blob " + blob.length);
  console.log("blob:" + JSON.stringify(blob));

  //const fileRef = ref(getStorage(), uuid.v4());
  const fileRef = ref(storage, path);
  Alert.alert("uploading ");
  console.log("uploading");
  //const result = await uploadBytes(fileRef, blob);
  Alert.alert("done uploading ");
  // We're done with the blob, close and release it
  blob.close();
  Alert.alert("blob.closed");
  //return await getDownloadURL(fileRef);
}

async function uploadImageAsyncSimple(uri, path) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  try {
    const fileRef = ref(storage, path);
    putFile(fileRef, uri)
      .then((snapshot) => {
        console.log("successfully uploaded");
      })
      .catch((e) => {
        console.log("error uploading: " + JSON.stringify(error));
        throw e;
      });

    return await getDownloadURL(fileRef);
  } catch (error) {
    console.log("catch error: " + JSON.stringify(error));
  }
}
