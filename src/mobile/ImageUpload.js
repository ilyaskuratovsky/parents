import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React from "react";
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
import uuid from "uuid";

// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      remoteImage: null,
      uploading: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.uri !== state.image) {
      return {
        image: props.uri,
      };
    } else {
      return {};
    }
  }

  async componentDidMount() {
    /*
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else {
        this.setState({ uploading: true });
        await _uploadImageToFirebase();
        this.setState({ uploading: false });
      }
    }
    */
    this.setState({ uploading: true });
    const remoteImage = await this._uploadImageToFirebase();
    this.setState({ uploading: false, remoteImage });
    this.props.onUploadRemote(remoteImage);
  }
  async _uploadImageToFirebase() {
    // don't upload yet
    const { image } = this.state;
    const uploadUrl = await uploadImageAsync(image, "images/" + uuid.v4());
    //this.setState({ remoteImage: uploadUrl });
    return uploadUrl;
  }

  render() {
    let { image } = this.state;

    return this._maybeRenderImage();
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
    let { image, remoteImage } = this.state;
    /*
    if (!image) {
      return;
    }
    */

    return (
      <View
        style={{
          width: 80,
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
          {remoteImage != null ? (
            <>
              <Image source={{ uri: remoteImage }} style={{ width: 80, height: 80 }} />
              {/*<Text style={{ fontSize: 7 }}>{remoteImage}</Text>*/}
            </>
          ) : (
            <>
              <Image source={{ uri: image }} style={{ width: 80, height: 80 }} />
              {/*<Text>Local ({this.state.uploading ? "uploading..." : "done uploading"})</Text>*/}
            </>
          )}
        </View>
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
}

async function uploadImageAsync(uri, path) {
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

  //const fileRef = ref(storage, "images/file1.jpg");
  const fileRef = ref(storage, path);
  console.log("uploading");
  const result = await uploadBytes(fileRef, blob);

  /*
  blob.close();
  */
  const url = await getDownloadURL(fileRef);
  return url;
  //return "https://firebasestorage.googleapis.com/v0/b/parents-749dd.appspot.com/o/images%2Ffile1.jpg?alt=media&token=762e5797-7488-45e7-aadf-26f89516d19b";
}
