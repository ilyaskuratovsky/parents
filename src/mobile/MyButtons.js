import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Paper from "react-native-paper";
import { Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Elements from "react-native-elements";

const MenuButton = React.memo(
  ({ icon, text, onPress, color = "black", badge }) => {
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
          {badge}
          <Text style={{ color: color, fontSize: 12 }}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
);

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

/*
const FormButton = React.memo(({ text, icon, onPress, style }) => {
  return (
    <Paper.Button
      style={style}
      icon={icon}
      labelStyle={{ color: "black", fontSize: 12 }}
      uppercase={false}
      onPress={onPress}
      mode="contained"
      color="blue"
      //labelStyle={{ fontSize: 16, color: "white" }}
    >
      {text}
    </Paper.Button>
  );
});
*/

const FormButton = React.memo(({ text, icon, onPress, style }) => {
  return (
    <Elements.Button title={text} icon={icon} onPress={onPress} mode="outline">
      {text}
    </Elements.Button>
  );
});

const LinkButton = React.memo(({ text, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={[
          style,
          { fontSize: 16, textDecorationLine: "underline", color: "blue" },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
});

export { MenuButton, DialogButton, PaperDialogButton, FormButton, LinkButton };
