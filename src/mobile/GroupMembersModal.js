import React, { useState } from "react";
import { Alert, Modal, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "../common/Controller";
import GroupInviteModal from "./GroupInviteModal";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import * as Actions from "../common/Actions";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as UserInfo from "../common/UserInfo";

export default function GroupMembersModal({ groupId, visible, closeModal }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { userMap, userList, schoolList, schoolMap, groupList, groupMap, members } = useSelector(
    (state) => {
      return {
        userMap: state.main.userMap,
        schoolList: state.main.schoolList,
        userList: state.main.userList,
        schoolMap: state.main.schoolMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
        members: state.main.groupMembershipMap[groupId],
      };
    }
  );

  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }
  if (processing) {
    return (
      <Modal visible={true}>
        <Text>Processing...</Text>
      </Modal>
    );
  }

  const invitees = userList;

  const memberComponents = members.map((groupMembership) => {
    const user = userMap[groupMembership.uid];
    return (
      <View
        key={user.uid ?? groupMembership.uid}
        style={{
          flexDirection: "row",
          height: 60,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingLeft: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 5,
          }}
        >
          {UserInfo.avatarComponent(user)}
          <Text
            style={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            {UserInfo.chatDisplayName(user)}
          </Text>
        </View>
      </View>
    );
  });

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal>
        <TopBarMiddleContentSideButtons
          style={{}}
          left={
            <MyButtons.MenuButton
              icon="arrow-left"
              text="Back"
              onPress={() => {
                closeModal();
              }}
              color="black"
            />
          }
          center={<Text style={{ fontWeight: "bold", fontSize: 16 }}>Group Members</Text>}
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
          {memberComponents}
        </View>
        <MyButtons.FormButton
          text="Invite"
          onPress={async () => {
            setInviteModalVisible(true);
          }}
        />
        <MyButtons.FormButton
          text="Delete Group"
          onPress={async () => {
            Alert.alert("Are You Sure?", null, [
              {
                text: "Yes",
                onPress: async () => {
                  await Controller.deleteGroup(userInfo, groupId);
                  dispatch(
                    Actions.goToScreen({
                      screen: "GROUPS",
                    })
                  );
                },
              },
              {
                text: "No",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
            ]);
          }}
        />
        <GroupInviteModal
          groupId={groupId}
          visible={inviteModalVisible}
          closeModal={() => {
            setInviteModalVisible(false);
          }}
          onInvite={async () => {}}
        />
      </Portal>
    </Modal>
  );
}
