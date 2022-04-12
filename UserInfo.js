import { Avatar } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import React from "react";

export function chatDisplayName(userInfo) {
  if (userInfo == null) {
    return "[Unknown User]";
  }
  if (userInfo.displayName != null) {
    return displayName;
  }

  return userInfo.email.split("@")[0];
}

export function avatarColor(userInfo) {
  var hash = 0;
  for (var i = 0; i < userInfo.email.length; i++) {
    hash = userInfo.email.charCodeAt(i) + ((hash << 5) - hash);
  }

  var h = hash % 360;
  return "hsl(" + h + ", " + "50" + "%, " + "65" + "%)";
}

export function avatarComponent(userInfo, onPress) {
  const displayName = chatDisplayName(userInfo);
  const avatar = (
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
  if (onPress != null) {
    return <TouchableOpacity onPress={onPress}>{avatar}</TouchableOpacity>;
  } else {
    return { avatarComponent };
  }
}
