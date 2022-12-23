// @flow strict-local
import * as Calendar from "expo-calendar";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Alert,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Utils from "../../common/Utils";
import { Divider, CheckBox } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CommentView from "../CommentView";
import * as Controller from "../../common/Controller";
import * as MyButtons from "../MyButtons";
import Portal from "../Portal";
import * as Globals from "../Globals";
import TopBarMiddleContentSideButtons from "../TopBarMiddleContentSideButtons";
import * as UIConstants from "../UIConstants";
import * as UserInfo from "../../common/UserInfo";
import BookCalendarEventModal from "../BookCalendarEventModal";
//import moment from "moment";
import moment from "moment-timezone";
import JSONTree from "react-native-json-tree";
import Autolink from "react-native-autolink";
import * as Actions from "../../common/Actions";
import * as Debug from "../../common/Debug";
import * as Data from "../../common/Data";
import DebugText from "../DebugText";
import nullthrows from "nullthrows";
import * as Messages from "../../common/MessageData";

type Props = {};
export default function MessageTest({}: Props): React.Node {
  const windowWidth = Dimensions.get("window").width;
  const [text, setText] = useState();
  const [textInputHeightChanged, setTextInputHeightChanged] = useState(0);
  return (
    <Modal visible={true} animationType={"slide"}>
      <Portal
        backgroundColor={UIConstants.DEFAULT_BACKGROUND}
        //backgroundColor="green"
      >
        {/* top bar */}
        <TopBarMiddleContentSideButtons
          backgroundColor={UIConstants.DEFAULT_BACKGROUND}
          height={100}
          left={
            <MyButtons.MenuButton icon="arrow-left" text="Back" onPress={() => {}} color="black" />
          }
          center={null}
          right={null}
        />

        {/* main content */}
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
          behavior="padding"
          keyboardVerticalOffset={40}
          enabled
        >
          <ScrollView style={{ flex: 1 }} onContentSizeChange={() => {}}>
            {/* parent message */}
            <View
              style={{
                flexDirection: "column",
                paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 14,
                //backgroundColor: "purple",
              }}
            >
              <View
                style={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 6,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 20,
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 5,
                      fontWeight: "bold",
                      fontSize: 14,
                      color: UIConstants.BLACK_TEXT_COLOR,
                    }}
                  >
                    User Name
                  </Text>
                </View>
              </View>
              <View
                style={{
                  paddingLeft: 0,
                  paddingTop: 0,
                  borderRadius: 0,
                }}
              >
                <Text
                  //numberOfLines={showMore[item.id] ? null : 4}
                  style={{
                    paddingLeft: 0,
                    fontWeight: "bold",
                    fontSize: 16,
                    color: UIConstants.BLACK_TEXT_COLOR,
                  }}
                >
                  Message title
                </Text>
                {/* the message text */}
                <Autolink
                  // Required: the text to parse for links
                  text={"message text"}
                  // Optional: enable email linking
                  email
                  // Optional: enable hashtag linking to instagram
                  phone="sms"
                  // Optional: enable URL linking
                  url
                  style={{
                    paddingLeft: 0,
                    paddingTop: 8,
                    fontSize: 14,
                    color: UIConstants.BLACK_TEXT_COLOR,
                  }}
                />
              </View>
            </View>
            <Divider style={{}} width={1} color="darkgrey" />
            {/* comments section */}
            <View style={{ paddingTop: 10, flex: 1 }}>
              <Text> comments section</Text>
            </View>
          </ScrollView>
          {/* reply text input section */}
          <View
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              paddingBottom: 0,
              //backgroundColor: "cyan",
              flexDirection: "row",
              alignItems: "flex-start",
              width: windowWidth,
            }}
          >
            <View
              style={{
                //backgroundColor: "pink",
                width: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => {}}>
                <Icon name="camera" size={36} color="blue" />
              </TouchableOpacity>
            </View>
            <View
              style={{
                //backgroundColor: "lightgreen",
                width: 40,
              }}
            >
              <View
                style={{
                  //backgroundColor: "pink",
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => {}}>
                  <Icon name="image" size={36} color="blue" />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={
                {
                  //backgroundColor: "green"
                }
              }
            >
              <TextInput
                value={text}
                style={{
                  width: windowWidth - 60 - 60,
                  flexWrap: "wrap",
                  //backgroundColor: "blue",
                  margin: 0,
                  paddingTop: textInputHeightChanged <= 1 ? 10 : 0,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingBottom: 0,
                  //paddingLeft: 10,
                  textAlign: "left",
                  fontSize: 14,
                  backgroundColor: "white",
                  // borderLeftWidth: 1,
                  // borderTopWidth: 1,
                  // borderRightWidth: 1,
                  // borderBottomWidth: 1,
                  // borderTopLeftRadius: 5,
                  // borderTopRightRadius: 5,
                  // borderBottomRightRadius: 5,
                  // borderBottomLeftRadius: 5,
                }}
                placeholder={"Reply..."}
                multiline={true}
                autoFocus={false}
                onChangeText={(text) => {
                  setText(text);
                }}
                onLayout={(event) => {
                  setTextInputHeightChanged((prev) => prev + 1);
                }}
              />
            </View>
            <View
              style={{
                //backgroundColor: "orange",
                width: 40,
              }}
            >
              <View
                style={{
                  //backgroundColor: "pink",
                  width: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => {}}>
                  <Icon name="arrow-up-circle" size={36} color="blue" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Portal>
    </Modal>
  );
}
