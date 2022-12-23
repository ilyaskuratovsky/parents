// @flow strict-local

import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Paper from "react-native-paper";
import { Badge } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Elements from "react-native-elements";
import { IconNode } from "react-native-elements/dist/icons/Icon";
import type { TextStyleProp, ViewStyleProp } from "react-native/Libraries/StyleSheet/StyleSheet";
import type { MaterialCommunityIconsGlyphs } from "react-native-vector-icons/MaterialCommunityIcons";

export function MenuButton({
  icon,
  text,
  onPress,
  color = "black",
  badge = null,
  containerStyle = null,
}: {
  icon: MaterialCommunityIconsGlyphs,
  text: string,
  onPress: () => void,
  color?: string,
  badge?: ?React$Node,
  containerStyle?: ViewStyleProp,
}): React.Node {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
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

/*
export function DialogButton({
  text,
  onPress,
  icon,
  style,
}: {
  text: string,
  onPress: () => void,
  icon: string,
  style: ViewStyleProp,
}): React.Node {
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
        {icon && <Icon name={icon} style={{ marginRight: 10, color: "black", fontSize: 16 }} />}
        <Text style={{ color: "black", fontSize: 18 }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}
*/

/*
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
*/

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

export function FormButton({
  text,
  icon,
  onPress,
  style,
  titleStyle,
  disabled = false,
}: {
  text: string,
  icon?: string,
  onPress: () => void,
  style?: ViewStyleProp,
  titleStyle?: TextStyleProp,
  disabled?: boolean,
}): React.Node {
  return (
    <Elements.Button
      title={text}
      titleStyle={titleStyle}
      icon={icon}
      onPress={onPress}
      style={style ?? { width: 160 }}
      disabled={disabled}
    >
      {text}
    </Elements.Button>
  );
}

export function LinkButton({
  text,
  onPress,
  style,
  disabled,
}: {
  text: string,
  onPress: () => void,
  style?: ViewStyleProp,
  disabled?: ?boolean,
}): React.Node {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled != null ? disabled : false}>
      <Text
        style={[
          {
            fontSize: 16,
            textDecorationLine: "underline",
            color: "blue",
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

/*
const RoundedButton = React.memo(({ text, onPress, style = null, disabled }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled != null ? disabled : false}>
      <Text
        style={[
          {
            //fontSize: 16,
            textDecorationLine: "underline",
            color: "blue",
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
});
*/
