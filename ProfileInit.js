import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as Paper from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { groupMemberships } from "./Actions";
import * as MyButtons from "./MyButtons";
import * as Controller from "./Controller";
import * as Globals from "./Globals";

export default function ProfileInit(props) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);

  const insets = useSafeAreaInsets();

  if (
    userInfo.profileInitialized == null ||
    userInfo.profileInitialized == false
  ) {
    return (
      <Modal visible={visible} animationType={"slide"}>
        <Portal>
          <TopBarMiddleContentSideButtons
            style={{}}
            left={
              {
                /*
              <MyButtons.MenuButton
                icon="arrow-left"
                text="Back"
                onPress={() => {
                  closeModal();
                }}
                color="black"
              />
              */
              }
            }
            center={
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Profile Setup
              </Text>
            }
            right={null}
          />
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              paddingLeft: 10,
              paddingTop: 10,
              flexGrow: 1,
            }}
          >
            <Text>Done</Text>
          </View>
        </Portal>
      </Modal>
    );
  } else {
    return null;
  }
}
