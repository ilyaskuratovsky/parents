// @flow strict-local

import { Avatar } from "react-native-elements";
import { TouchableOpacity, Text, View } from "react-native";
import { Image } from "react-native-expo-image-cache";
import * as Utils from "../common/Utils";
import type { Group, UserInfo, GroupMembership } from "./Database";
import * as React from "react";

// preview can be a local image or a data uri
export function chatDisplayName(userInfo: ?UserInfo): ?string {
  if (userInfo == null) {
    return "[Unknown User]";
  }
  if (userInfo.displayName != null) {
    return userInfo.displayName;
  }

  if (userInfo.firstName != null && userInfo.lastName != null) {
    return userInfo.firstName + " " + userInfo.lastName;
  }

  if (userInfo.email != null) {
    return userInfo.email.split("@")[0];
  } else {
    return null;
  }
}

export function avatarColor(userInfo: UserInfo): string {
  var hash = 0;
  if (userInfo.email != null) {
    for (var i = 0; i < userInfo.email.length; i++) {
      hash = userInfo.email.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  var h = hash % 360;
  return "hsl(" + h + ", " + "50" + "%, " + "65" + "%)";
}

export function avatarComponent(userInfo: UserInfo, onPress: () => void): React.Node {
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
        size={40}
        rounded
        title={displayName?.charAt(0).toUpperCase() ?? ""}
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

export function smallAvatarComponent(
  userInfo: ?UserInfo,
  onPress: ?() => void,
  border: ?string
): React.Node {
  return sizedAvatarComponent(userInfo, onPress, border, "small");
}

export function tinyAvatarComponent(
  userInfo: UserInfo,
  onPress: () => void,
  border: ?string
): React.Node {
  return sizedAvatarComponent(userInfo, onPress, border, "tiny");
}

export function tinyAvatarComponentWithName(
  userInfo: UserInfo,
  onPress: () => void,
  border: ?string,
  containerStyle: mixed
): React.Node {
  return (
    <View style={{ flex: 1, flexDirection: "row", ...containerStyle }}>
      {tinyAvatarComponent(userInfo, onPress)}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 20,
          //backgroundColor: "cyan",
        }}
      >
        <Text
          style={{
            marginLeft: 5,
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          {chatDisplayName(userInfo)}
        </Text>
      </View>
    </View>
  );
}

export function smallAvatarComponentWithName(
  userInfo: UserInfo,
  onPress: () => void,
  border: ?string,
  containerStyle: mixed
): React.Node {
  return (
    <View style={{ flex: 1, flexDirection: "row", ...containerStyle }}>
      {smallAvatarComponent(userInfo, onPress)}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 20,
          //backgroundColor: "cyan",
        }}
      >
        <Text
          style={{
            marginLeft: 5,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {chatDisplayName(userInfo)}
        </Text>
      </View>
    </View>
  );
}

function sizedAvatarComponent(userInfo, onPress, border, size) {
  let imageHeight = 30;
  if (size == "small") {
    imageHeight = 30;
  } else if (size == "tiny") {
    imageHeight = 16;
  }
  const displayName = chatDisplayName(userInfo);
  let avatar = null;
  if (userInfo == null) {
    return <Text>Null Info</Text>;
  }
  if (userInfo.image != null) {
    const uri = userInfo.image;
    avatar = (
      <Image
        style={{
          height: imageHeight,
          width: imageHeight,
          borderWidth: border ? 2 : 0,
          borderColor: "whitesmoke",
          borderRadius: imageHeight / 2,
        }}
        uri={uri}
      />
    );
  } else {
    let letters = null;
    if (userInfo.firstName != null && userInfo.lastName != null) {
      letters =
        userInfo.firstName.charAt(0).toUpperCase() +
        (userInfo.lastName?.charAt(0).toUpperCase() ?? "");
    } else {
      if (displayName != null) {
        letters = displayName.charAt(0).toUpperCase();
      } else {
        ("N/A");
      }
    }
    avatar = (
      <Avatar
        size={imageHeight}
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

export function profileIncomplete(userInfo: UserInfo): boolean {
  return (
    (userInfo.firstName == null || userInfo.firstName.trim() == "") &&
    (userInfo.lastName == null || userInfo.lastName.trim() == "")
  );
}

export function commaSeparatedChatThread(users: Array<UserInfo>): string {
  const shortNames = users.map((user) => user.firstName);
  const ret = shortNames.join(", ");
  return ret;
}

export function allUsers(
  userInfo: UserInfo,
  userMap: { [key: string]: UserInfo }
): Array<UserInfo> {
  return Object.keys(userMap).map((u) => userMap[u]);
}
