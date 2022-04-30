import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import * as Globals from "./Globals";
import * as UserInfo from "../common/UserInfo";

export default function Messages(props) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { toUserInvites, groupMap, userMap } = useSelector((state) => {
    return {
      toUserInvites: state.main.toUserInvites,
      groupMap: state.main.groupMap,
      userMap: state.main.userMap,
    };
  });

  const insets = useSafeAreaInsets();

  if (toUserInvites != null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "red",
          position: "absolute",
          width: "100%",
          bottom: insets.bottom,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        {toUserInvites.map((invite) => {
          const group = groupMap[invite.groupId];
          const fromUser = userMap[invite.fromUid];
          return (
            <View
              key={"join_" + group.id}
              style={{
                flexDirection: "column",
                alignItems: "center",
                paddingLeft: 10,
                width: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  //backgroundColor: "cyan",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {UserInfo.smallAvatarComponent(fromUser)}
                  <Text
                    style={{
                      flexGrow: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 6,
                    }}
                  >
                    {UserInfo.chatDisplayName(fromUser)} invited you to join
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  //backgroundColor: "cyan",
                  flexDirection: "row",
                  paddingTop: 6,
                  paddingBottom: 10,
                  justifyContent: "flex-end",
                }}
              >
                <Text style={{ fontSize: 20 }}>{group.name}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MyButtons.FormButton
                  text="Accept"
                  onPress={async () => {
                    await Controller.joinGroupFromInvite(dispatch, userInfo, group.id, invite.id);
                  }}
                  style={{ paddingRight: 10 }}
                />
                <MyButtons.FormButton
                  text="Dismiss"
                  onPress={async () => {
                    await Controller.dismissInvite(dispatch, userInfo, invite.id);
                  }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 10 }}>{Globals.dev ? "(" + invite.id + ")" : ""}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  } else {
    return null;
  }
}
