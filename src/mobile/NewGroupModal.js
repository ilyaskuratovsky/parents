import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as UserInfo from "../common/UserInfo";
import * as Utils from "../common/Utils";
import * as Globals from "./Globals";
import * as MyButtons from "./MyButtons";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as Debug from "../common/Debug";
import Checkbox from "./Checkbox";
import * as Actions from "../common/Actions";
import * as Data from "../common/Data";
import Portal from "./Portal";
import TabView from "./TabView";
import * as Controller from "../common/Controller";

export default function NewGroupModal({ scheme, parentGroupId }) {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  let parentGroup = Data.getGroup(parentGroupId);
  const rootGroup = Data.getRootGroup();

  if (parentGroupId == null) {
    parentGroup = rootGroup;
  }

  const org = parentGroup != null ? Data.getOrg(parentGroup.orgId) : null;
  const orgId = org?.id;
  const debugMode = Debug.isDebugMode();

  const [groupType, setGroupType] = useState();
  const [selectedScheme, setSelectedScheme] = useState(scheme);
  const [groupOrgId, setGroupOrgId] = useState(orgId);
  const [groupName, setGroupName] = useState(null);
  const [groupDescription, setGroupDescription] = useState(null);

  let startPage = null;
  if (page == null) {
    if (parentGroup != null) {
      startPage = "DETAILS";
    } else if (scheme === "school" || scheme == "activity") {
      startPage = "ORG";
    } else if (scheme == "private" || scheme == "public") {
      startPage = "DETAILS";
    } else {
      startPage = "TYPE";
    }
  }
  const [page, setPage] = useState(startPage);

  return (
    <Modal visible={true} animationType={"slide"}>
      {page === "TYPE" && (
        <GroupScheme
          onNext={(scheme) => {
            setSelectedScheme(scheme);
            if (scheme === "school") {
              setPage("ORG");
            } else if (scheme === "activity") {
            } else if (scheme === "private") {
              setGroupType("private");
              setPage("DETAILS");
            } else if (scheme === "public") {
              setGroupType("public");
              setPage("DETAILS");
            }
          }}
        />
      )}
      {page === "DETAILS" && (
        <GroupMainInfo
          groupName={groupName}
          groupDescription={groupDescription}
          groupType={groupType}
          parentGroup={parentGroup}
          scheme={selectedScheme}
          onCreate={async (name, description, type) => {
            setGroupName(name);
            setGroupDescription(description);
            setGroupType(type);
            //export async function createGroup(groupName, groupDescription, type, orgId) {
            const groupId = await Controller.createGroupAndJoin(
              userInfo,
              name,
              description,
              type,
              parentGroupId
            );
            dispatch(Actions.closeModal());
            dispatch(Actions.openModal({ modal: "GROUP", groupId: groupId }));
          }}
        />
      )}
      {page === "ORG" && (
        <Organization
          scheme={selectedScheme}
          initialOrgId={groupOrgId}
          onNext={(orgId) => {
            setGroupOrgId(orgId);
            setPage("DETAILS");
          }}
        />
      )}
    </Modal>
  );
}

/*
  School Group (e.g. Mrs Smith's 4th grade 2022)
  Activity Group (e.g. Travel Baseball Juniors)
  Private Group (Secret group that you invite people to)
  General Public Group (open to all)
*/
function GroupScheme({ onNext }) {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const [type, setType] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBarMiddleContentSideButtons
        left={
          <MyButtons.LinkButton
            text="Cancel"
            onPress={async () => {
              dispatch(Actions.closeModal());
            }}
          />
        }
        center={
          <View style={{ flex: 1 }}>
            <Text>New Group</Text>
          </View>
        }
        right={
          /*
          <MyButtons.LinkButton
            text="Next"
            onPress={() => {
              onNext(name, description, type);
            }}
          />
          */ null
        }
      />
      {debugMode && <Text style={{ fontSize: 8 }}>NewGroupModald.js</Text>}
      {debugMode && <Text style={{ fontSize: 8 }}>page: GroupScheme</Text>}
      <View style={{ marginTop: 60, paddingLeft: 20, paddingRight: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            //backgroundColor: "cyan",
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: 140,
              height: 140,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              onNext("school");
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "column" }}>
              <Text style={{ textAlign: "center", fontSize: 16 }}>School Group</Text>
              <Text style={{ textAlign: "center", height: 60, padding: 10, fontSize: 10 }}>
                e.g. Mrs. Smith's 4th Grade Class
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: 140,
              height: 140,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "column" }}>
              <Text style={{ textAlign: "center", fontSize: 16 }}>Activity Group</Text>
              <Text style={{ textAlign: "center", height: 60, padding: 10, fontSize: 10 }}>
                e.g. Sports, recreation and other non-school activities
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 20,
            //backgroundColor: "cyan",
          }}
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: 140,
              height: 140,
              padding: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              onNext("private");
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "column" }}>
              <Text style={{ textAlign: "center", fontSize: 16 }}>Private Group</Text>
              <Text style={{ textAlign: "center", height: 60, padding: 10, fontSize: 10 }}>
                (Invite only)
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              width: 140,
              height: 140,
              padding: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              onNext("public");
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "column" }}>
              <Text style={{ textAlign: "center", fontSize: 16 }}>Public Group</Text>
              <Text style={{ textAlign: "center", height: 60, padding: 10, fontSize: 10 }}>
                Accessible to everyone
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function GroupMainInfo({ groupName, groupDescription, parentGroup, groupType, scheme, onCreate }) {
  const userInfo = Data.getCurrentUser();
  const debugMode = Debug.isDebugMode();
  const dispatch = useDispatch();
  const [name, setName] = useState(groupName);
  //const org = Data.getOrg(orgId);
  const [description, setDescription] = useState(groupDescription);
  const [type, setType] = useState(groupType);

  /*
  let nextButton = null;
  if (type === "private" || type === "public") {
  } else {
    nextButton = (
      <MyButtons.LinkButton
        text="Next"
        onPress={() => {
          onNext(name, description, type);
        }}
      />
    );
  }
  */

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBarMiddleContentSideButtons
        left={
          <MyButtons.LinkButton
            text="Cancel"
            onPress={async () => {
              dispatch(Actions.closeModal());
            }}
          />
        }
        center={
          <View style={{ flex: 1 }}>
            <Text>New Group</Text>
          </View>
        }
        right={null}
      />
      {debugMode && <Text style={{ fontSize: 8 }}>NewGroupModal.js</Text>}
      {debugMode && <Text style={{ fontSize: 8 }}>page: GroupMainInfo, parentGroup: </Text>}
      <View style={{ paddingTop: 20, alignItems: "center" }}>
        <Text>{parentGroup.name}</Text>
        <View
          style={{
            paddingTop: 4,
            paddingLeft: 10,
            paddingRight: 10,
            flexDirection: "column",
            height: 120,
            width: "100%",
            //backgroundColor: "cyan",
          }}
        >
          <TextInput
            key="group_name_input"
            style={{
              borderWidth: 1,
              paddingLeft: 10,
              height: 40,
              marginBottom: 20,
              fontSize: 16,
            }}
            onChangeText={(value) => {
              setName(value);
            }}
            placeholder={"Group Name"}
            value={name ?? ""}
            selectTextOnFocus={true}
          />
          <TextInput
            key="group_description"
            style={{
              borderWidth: 1,
              paddingLeft: 10,
              height: 40,
              fontSize: 16,
            }}
            onChangeText={(value) => {
              setDescription(value);
            }}
            placeholder={"Description"}
            value={description ?? ""}
            selectTextOnFocus={true}
          />
        </View>
        <View
          style={{
            paddingTop: 4,
            paddingLeft: 10,
            paddingRight: 10,
            flexDirection: "column",
            width: "100%",
            //backgroundColor: "cyan",
          }}
        >
          {(scheme == null || scheme === "school") && (
            <View style={{ flexDirection: "row" }}>
              <Checkbox
                checked={type === "private"}
                onPress={async () => {
                  setType("private");
                }}
                text={null}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Private (Invite Only)</Text>
                <Text style={{ fontSize: 14 }}>
                  Others cannot see your group. Members are by invite only.
                </Text>
              </View>
            </View>
          )}
          {(scheme == null || scheme === "school") && (
            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <Checkbox
                checked={type === "private_requesttojoin"}
                onPress={async () => {
                  setType("private_requesttojoin");
                }}
                text={null}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Private (Request to Join)</Text>
                <Text style={{ fontSize: 14 }}>Others can see your group and request to join.</Text>
              </View>
            </View>
          )}
          {(scheme == null || scheme === "school") && (
            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <Checkbox
                checked={type === "public_membersonly"}
                onPress={async () => {
                  setType("public_membersonly");
                }}
                text={null}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Public (Members only)</Text>
                <Text style={{ fontSize: 14 }}>
                  Everyone can see posts in your group, but can only contribute if they become
                  members.
                </Text>
              </View>
            </View>
          )}
          {(scheme == null || scheme === "school") && (
            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <Checkbox
                checked={type === "public"}
                onPress={async () => {
                  setType("public");
                }}
                text={null}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Public (Open to all)</Text>
                <Text style={{ fontSize: 14 }}>Everyone can see and post in your group.</Text>
              </View>
            </View>
          )}
        </View>
        <View style={{ marginTop: 20 }}>
          <MyButtons.FormButton
            text="Create Group"
            onPress={() => {
              onCreate(name, description, type);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

/*
function Invite() {
  const userInfo = Data.getCurrentUser();
  let addList = Data.getAllUsers();
  const [inviteByEmail, setInviteByEmail] = useState(null);
  const [invitees, setInvitees] = useState([]);
  const [invitesByEmailList, setInvitesByEmailList] = useState([]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopBarMiddleContentSideButtons
        left={
          <MyButtons.LinkButton
            text="Cancel"
            onPress={async () => {
              dispatch(Actions.closeModal());
            }}
          />
        }
        center={
          <View style={{ flex: 1 }}>
            <Text>New Group</Text>
            {Globals.dev && <Text>NewPrivateGroupModal.js</Text>}
          </View>
        }
        right={
          <MyButtons.LinkButton
            text="Skip Invite"
            onPress={() => {
              onNext(name, description, type);
            }}
          />
        }
      />
      {addList.length > 0 && (
        <View
          style={{
            flexGrow: 1,
            padding: 10,
            //backgroundColor: "yellow",
          }}
        >
          <Text>Add People</Text>
          <ScrollView style={{ flex: 1, flexDirection: "row" }}>
            {addList.map((user) => {
              return (
                <View
                  key={user.uid}
                  style={{
                    height: 60,
                    justifyContent: "flex-start",
                    alignContent: "center",
                    //backgroundColor: "cyan",
                    borderWidth: 0,
                    flexDirection: "row",
                  }}
                >
                  <CheckBox
                    checked={invitees.includes(user.uid)}
                    onPress={() => {
                      let newInviteeList = [...invitees];
                      if (newInviteeList.includes(user.uid)) {
                        newInviteeList = newInviteeList.filter((i) => i != user.uid);
                      } else {
                        newInviteeList.push(user.uid);
                      }
                      setInvitees(newInviteeList);
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        alignItems: "center",
                        //backgroundColor: "orange",
                      }}
                    >
                      {UserInfo.chatDisplayName(user)}
                    </Text>
                    <Text
                      style={{
                        alignItems: "center",
                        alignSelf: "flex-start",
                        fontSize: 10,
                        //backgroundColor: "orange",
                      }}
                    >
                      {user.email}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
      <View
        style={{
          height: 160,
          padding: 10,
          //backgroundColor: "yellow",
        }}
      >
        <Text>Invite By Email</Text>
        {invitesByEmailList.length > 0 && (
          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
              {invitesByEmailList.map((email) => {
                return <Text>{email}</Text>;
              })}
            </ScrollView>
          </View>
        )}
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TextInput
            key="invite_by_email_input"
            style={{
              borderWidth: 1,
              paddingLeft: 10,
              height: 40,
              marginBottom: 20,
              fontSize: 16,
            }}
            onChangeText={(value) => {
              setInviteByEmail(value);
            }}
            placeholder={"Email"}
            value={inviteByEmail ?? ""}
            selectTextOnFocus={true}
            autoCapitalize={"none"}
          />
          <MyButtons.FormButton
            text="Add"
            onPress={() => {
              const newList = [...invitesByEmailList];
              newList.push(inviteByEmail);
              setInvitesByEmailList(newList);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
*/
function Organization({ type, initialOrgId, onNext }) {
  const dispatch = useDispatch();
  let orgList = Data.getAllOrgs();
  if (type === "school") {
    orgList = orgList.filter((org) => org.type === "school");
  }
  const [orgId, setOrgId] = useState(initialOrgId);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        //backgroundColor: "yellow"
      }}
    >
      <TopBarMiddleContentSideButtons
        left={
          <MyButtons.LinkButton
            text="Cancel"
            onPress={async () => {
              dispatch(Actions.closeModal());
            }}
          />
        }
        center={
          <View style={{ flex: 1 }}>
            <Text>Choose School</Text>
            {Globals.dev && <Text>NewPrivateGroupModal.js</Text>}
          </View>
        }
        right={
          <MyButtons.FormButton
            text={"Next"}
            style={{ width: 80 }}
            disabled={orgId == null}
            onPress={() => {
              onNext(orgId);
            }}
          />
        }
      />
      <View style={{ flex: 1, marginTop: 0, paddingLeft: 20, paddingRight: 20 }}>
        <ScrollView style={{ height: 100, flexDirection: "row" }}>
          {orgList.map((org) => {
            return (
              <View
                key={org.id}
                style={{
                  height: 60,
                  justifyContent: "flex-start",
                  alignContent: "center",
                  borderWidth: 0,
                  flexDirection: "row",
                }}
              >
                <CheckBox
                  checked={org.id === orgId}
                  onPress={() => {
                    setOrgId(org.id);
                  }}
                />
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      alignItems: "center",
                      //backgroundColor: "orange",
                    }}
                  >
                    {org.name}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Invite({ groupId }) {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const [processing, setProcessing] = useState(false);

  return (
    <Portal>
      <TopBarMiddleContentSideButtons
        style={{}}
        left={
          <MyButtons.MenuButton
            icon="arrow-left"
            text="Back"
            onPress={() => {
              dispatch(Actions.closeModal());
            }}
            color="black"
          />
        }
        center={<Text style={{ fontWeight: "bold", fontSize: 16 }}>Invite</Text>}
        right={null}
      />
      <TabView
        tabHeadings={["People", "Contacts", "Email"]}
        tabs={[<People />, <Contacts />, <Email />]}
      />
    </Portal>
  );
}
function People() {
  const userInfo = Data.getCurrentUser();
  const dispatch = useDispatch();
  const [invitees, setInvitees] = useState([]);
  let addList = Data.getAllUsers();
  return (
    <View
      style={{
        flex: 1,
        padding: 10,

        //height: 250,
        //backgroundColor: "yellow",
      }}
    >
      <ScrollView style={{ flex: 1, flexDirection: "row" }}>
        {addList.map((user) => {
          return (
            <View
              key={user.uid}
              style={{
                height: 60,
                justifyContent: "flex-start",
                alignContent: "center",
                //backgroundColor: "cyan",
                borderWidth: 0,
                flexDirection: "row",
              }}
            >
              <CheckBox
                checked={invitees.includes(user.uid)}
                onPress={() => {
                  let newInviteeList = [...invitees];
                  if (newInviteeList.includes(user.uid)) {
                    newInviteeList = newInviteeList.filter((i) => i != user.uid);
                  } else {
                    newInviteeList.push(user.uid);
                  }
                  setInvitees(newInviteeList);
                }}
              />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    alignItems: "center",
                    //backgroundColor: "orange",
                  }}
                >
                  {UserInfo.chatDisplayName(user)}
                </Text>
                <Text
                  style={{
                    alignItems: "center",
                    alignSelf: "flex-start",
                    fontSize: 10,
                    //backgroundColor: "orange",
                  }}
                >
                  {user.email}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function Email() {
  const dispatch = useDispatch();
  const userInfo = Data.getCurrentUser();
  const [email, setEmail] = useState(null);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "columns",
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          height: 160,
          width: "100%",
          alignItems: "flex-start",
          //backgroundColor: "yellow",
        }}
      >
        <Text style={{ fontSize: 10 }}>Enter emails separated by ','</Text>
        <View
          style={{
            //backgroundColor: "cyan",
            flexDirection: "column",
            flex: 1,
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <TextInput
            key="email"
            style={{ flex: 1, borderWidth: 1, width: "100%", fontSize: 12, height: 100 }}
            onChangeText={(value) => {
              setEmail(value);
            }}
            value={email ?? ""}
            selectTextOnFocus={true}
            autoCapitalize="none"
            multiline
            numberOfLines={4}
          />
        </View>
        <Text style={{ marginTop: 10, marginBottom: 10 }}>
          {Utils.parseEmails(email)?.join("\r\n")}
        </Text>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          flex: 1,
          //backgroundColor: "yellow"
        }}
      >
        <MyButtons.FormButton
          style={{ width: 200, padding: 8 }}
          text="Send Invite"
          onPress={async () => {
            const emails = Utils.parseEmails(email);
            await Controller.sendGroupInviteToEmails(userInfo, groupId, emails);
            Alert.alert("Invites sent");
            dispatch(Actions.closeModal());
          }}
        />
      </View>
    </View>
  );
}

function Contacts() {
  return (
    <View style={{ flex: 1, flexDirection: "columns", paddingLeft: 10, paddingRight: 10 }}>
      <Text>Contacts</Text>
    </View>
  );
}
