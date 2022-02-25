import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Paper from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MenuButton = React.memo(({ icon, text, onPress, color = "black" }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          marginLeft: 8,
          marginRight: 8,
        }}
      >
        <Icon name={icon} style={{ color: color, fontSize: 24 }} />
        <Text style={{ color: color, fontSize: 12 }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
});

const DialogButton = React.memo(({ text, onPress, icon, style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
            marginRight: 8,
            marginBottom: 8,
            alignSelf: "center",
            ...style,
          },
        ]}
      >
        {icon && (
          <Icon
            name={icon}
            style={{ marginRight: 10, color: "black", fontSize: 16 }}
          />
        )}
        <Text style={{ color: "black", fontSize: 18 }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
});

const PaperDialogButton = React.memo(({ text, icon, onPress }) => {
  return (
    <Paper.Button
      icon={icon}
      labelStyle={{ color: "black", fontSize: 18 }}
      uppercase={false}
      onPress={onPress}
    >
      {text}
    </Paper.Button>
  );
});

const FormButton = React.memo(({ text, icon, onPress, style }) => {
  return (
    <Paper.Button
      style={style}
      icon={icon}
      labelStyle={{ color: "black", fontSize: 12 }}
      uppercase={false}
      onPress={onPress}
      mode="contained"
    >
      {text}
    </Paper.Button>
  );
});

export { MenuButton, DialogButton, PaperDialogButton, FormButton };
