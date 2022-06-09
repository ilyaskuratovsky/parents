import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import * as Globals from "./Globals";
import * as Debug from "../common/Debug";

export default function Messages(props) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { toUserInvites, groupMap } = useSelector((state) => {
    return {
      toUserInvites: state.main.toUserInvites,
      groupMap: state.main.groupMap,
    };
  });

  const insets = useSafeAreaInsets();

  if (toUserInvites != null) {
    return (
      <View
        style={{
          backgroundColor: "red",
          position: "absolute",
          bottom: insets.bottom,
          width: "100%",
        }}
      >
        {toUserInvites.map((invite) => {
          const group = groupMap[invite.groupId];
          return (
            <View
              key={"join_" + group.id}
              style={{
                flexDirection: "row",
                height: 60,
                alignItems: "center",
                paddingLeft: 10,
              }}
            >
              <Text
                style={{
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Invite to {group.name}
              </Text>
              <View
                style={{
                  flexBasis: 200,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MyButtons.FormButton
                  text="Join"
                  onPress={async () => {
                    await Controller.joinGroupFromInvite(dispatch, userInfo, group.id, invite.id);
                  }}
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
