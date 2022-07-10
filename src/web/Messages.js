import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import * as MyButtons from "./MyButtons";
import * as Globals from "./Globals";
import * as Debug from "../common/Debug";
import * as UserInfo from "../common/UserInfo";

export default function Messages(props) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { toUserInvites, groupMap, userMap, groupMembershipRequests } = useSelector((state) => {
    return {
      toUserInvites: state.main.toUserInvites ?? [],
      groupMap: state.main.groupMap,
      groupMembershipRequests: state.main.groupMembershipRequests ?? [],
      userMap: state.main.userMap,
    };
  });

  const insets = useSafeAreaInsets();

  if (toUserInvites.length > 0 || groupMembershipRequests.length > 0) {
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
                <Text style={{ fontSize: 10 }}>{debugMode ? "(" + invite.id + ")" : ""}</Text>
              </View>
            </View>
          );
        })}
        {groupMembershipRequests.map((request) => {
          const group = groupMap[request.groupId];
          const fromUser = userMap[request.uid];
          return (
            <View
              key={"request_" + group.id}
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
                {UserInfo.chatDisplayName(fromUser)} request to join {group.name}
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
                  text="Accept"
                  onPress={async () => {
                    await Controller.acceptGroupMembershipRequest(userInfo, request);
                  }}
                />
                <MyButtons.FormButton
                  text="Reject"
                  onPress={async () => {
                    await Controller.rejectGroupMembershipRequest(userInfo, request);
                  }}
                />
                <MyButtons.FormButton
                  text="Dismiss"
                  onPress={async () => {
                    await Controller.dismissGroupMembershipRequest(dispatch, userInfo, invite.id);
                  }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 10 }}>{debugMode ? JSON.stringify(req) : ""}</Text>
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
