import { Avatar } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native-expo-image-cache";

// preview can be a local image or a data uri
export function chatDisplayName(userInfo) {
  if (userInfo == null) {
    return "[Unknown User]";
  }
  if (userInfo.displayName != null) {
    return displayName;
  }

  if (userInfo.firstName != null && userInfo.lastName != null) {
    return userInfo.firstName + " " + userInfo.lastName;
  }

  if (userInfo.email != null) {
    return userInfo.email.split("@")[0];
  } else {
    return "<null>";
  }
}

export function avatarColor(userInfo) {
  var hash = 0;
  if (userInfo.email != null) {
    for (var i = 0; i < userInfo.email.length; i++) {
      hash = userInfo.email.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  var h = hash % 360;
  return "hsl(" + h + ", " + "50" + "%, " + "65" + "%)";
}

export function avatarComponent(userInfo, onPress) {
  const displayName = chatDisplayName(userInfo);
  let avatar = null;
  if (userInfo.image != null) {
    /*
    avatar = (
      <Image
        source={{ uri: userInfo.image }}
        style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
      />
    );
    */
    const uri = userInfo.image;
    avatar = <Image style={{ height: 40, width: 40, borderRadius: 20 }} uri={uri} />;
  } else {
    avatar = (
      <Avatar
        size={28}
        rounded
        title={displayName.charAt(0).toUpperCase()}
        containerStyle={{
          backgroundColor: avatarColor(userInfo),
          marginRight: 1,
        }}
      />
    );
  }
  if (onPress != null) {
    return <TouchableOpacity onPress={onPress}>{avatar}</TouchableOpacity>;
  } else {
    return <>{avatar}</>;
  }
}

export function smallAvatarComponent(userInfo, onPress, border) {
  const displayName = chatDisplayName(userInfo);
  let avatar = null;
  if (userInfo.image != null) {
    const uri = userInfo.image;
    avatar = (
      <Image
        style={{
          height: 30,
          width: 30,
          borderWidth: border ? 2 : 0,
          borderColor: "whitesmoke",
          borderRadius: 15,
        }}
        uri={uri}
      />
    );
  } else {
    let letters = null;
    if (userInfo.firstName != null && userInfo.lastName != null) {
      letters =
        userInfo.firstName.charAt(0).toUpperCase() + userInfo.lastName.charAt(0).toUpperCase();
    } else {
      letters = displayName.charAt(0).toUpperCase();
    }
    avatar = (
      <Avatar
        size={30}
        rounded
        title={letters}
        containerStyle={{
          backgroundColor: avatarColor(userInfo),
          marginRight: 1,
          borderWidth: border ? 1 : 0,
          borderColor: "whitesmoke",
        }}
      />
    );
  }
  if (onPress != null) {
    return <TouchableOpacity onPress={onPress}>{avatar}</TouchableOpacity>;
  } else {
    return <>{avatar}</>;
  }
}
