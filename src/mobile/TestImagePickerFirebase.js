// @flow strict-local

import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as React from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  LogBox,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
} from "react-native";
import { storage } from "../../config/firebase";

/*
const firebaseConfig = {
  apiKey: "AIzaSyAlZruO2T_JNOWn4ysfX6AryR6Dzm_VVaA",
  authDomain: "blobtest-36ff6.firebaseapp.com",
  databaseURL: "https://blobtest-36ff6.firebaseio.com",
  storageBucket: "blobtest-36ff6.appspot.com",
  messagingSenderId: "506017999540",
};
*/
/*
export const firebaseConfig = {
  apiKey: "AIzaSyD7sAZY_oPEoAhPLbLST23DAAmAPiOh8V8",
  authDomain: "parents-749dd.firebaseapp.com",
  databaseURL: "https://parents-749dd-default-rtdb.firebaseio.com",
  projectId: "parents-749dd",
  storageBucket: "parents-749dd.appspot.com",
  messagingSenderId: "202897799240",
  appId: "1:202897799240:web:6e7181665de58029cfc07d",
  measurementId: "G-RJ6EY4S9LJ",
};

// Editing this file with fast refresh will reinitialize the app on every refresh, let's not do that
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
*/
// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

export default class App extends React.Component {
  state = {
    image: null,
    uploading: false,
  };

  async componentDidMount() {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  }

  render() {
    let { image } = this.state;

    return (
      <Modal visible={true} animationType={"slide"}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          {!!image && (
            <Text
              style={{
                fontSize: 20,
                marginBottom: 20,
                textAlign: "center",
                marginHorizontal: 15,
              }}
            >
              Example: Upload ImagePicker result
            </Text>
          )}

          <Button onPress={this._pickImage} title="Pick an image from camera roll" />

          <Button onPress={this._takePhoto} title="Take a photo" />

          <Button onPress={this._uploadImageToFirebase} title="Upload image" />

          {this._maybeRenderImage()}
          {this._maybeRenderUploadingOverlay()}

          <StatusBar barStyle="default" />
        </View>
      </Modal>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
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

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: "rgba(0,0,0,1)",
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: "hidden",
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        >
          {image}
        </Text>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: "Check out this photo",
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert("Copied image URL to clipboard");
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log({ pickerResult });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        this.setState({ image: pickerResult.uri });
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };

  _uploadImageToFirebase = async () => {
    // don't upload yet
    const { image } = this.state;
    const uploadUrl = await uploadImageAsync(image);
    this.setState({ image: uploadUrl });
  };
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
  //const fileRef = ref(getStorage(), "images/file1.jpg");
  const fileRef = ref(storage, "images/file1.jpg");
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
