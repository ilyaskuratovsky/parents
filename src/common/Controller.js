// @flow strict-local
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { Platform, Alert } from "react-native";
import * as Actions from "./Actions";
import { auth } from "../../config/firebase";
import * as Database from "./Database";
import { store } from "./Actions";
import * as Search from "./Search";
import moment from "moment";
import * as UserInfoUtil from "./UserInfo";
import * as Logger from "./Logger";
import { storage } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { useSelector } from "react-redux";
import { createGroup } from "./DatabaseRDB";
import { data, loading } from "./RemoteData";
import * as Data from "./Data";
import type { ChatMessage, Group, GroupMembershipRequest, UserInfo } from "./Database";
import { useEffect } from "react";
import * as Messages from "./MessageData";
import type { ScreenState, Screen } from "./Actions";
import nullthrows from "nullthrows";

//import { Database } from "firebase-firestore-lite";

const groupMessageSubscriptions = {};
const chatMessageSubscriptions = {};
const chatSubscriptions = {};
let loggedInUnsubscribe;

export async function initializeApp(
  dispatch: (?mixed) => void,
  notificationListener: ({ ... }) => void,
  responseListener: ({ ... }) => void
): Promise<{ ... }> {
  Logger.log("initializing App");
  const orgs = await Database.getAllOrgs();

  // store all groups
  const groups = await Database.getAllGroups();

  // store all people
  const users = await Database.getAllUsers();

  //all group memberships
  const groupMemberships = await Database.getAllGroupMemberships();

  //observe super public group messages
  groups
    .filter((g) => g["type"] === "super_public")
    .forEach(async (group) => {
      //Loop through group_memberships and set up a subscriber for its messages
      observeGroupMessages(dispatch, group["id"]);
    });

  dispatch(
    Actions.locationDataInit({
      orgs,
      groups,
      users,
      groupMemberships,
    })
  );

  //observe group_membership_changes
  Database.observeAllGroupMembershipChanges((groupMemberships) => {
    Logger.log(
      "OBSERVE: AllGroupMembershipChanges (" +
        groupMemberships.length +
        "): " +
        JSON.stringify(groupMemberships.map((gm) => gm.groupId)),
      Logger.INFO
    );
    dispatch(Actions.groupMemberships(groupMemberships));
  });

  //push notification token
  let pushToken: ?string = null;

  // register for push notifications - receive a token that you can use
  // to push notifications to this particular device
  await registerForPushNotificationsAsync()
    .then((token) => {
      Logger.log("Got push notificaiton token: " + (token ?? ""));
      pushToken = token;
    })
    .catch((error) => {
      Logger.log("ERROR REtRieving PUSH TOKEN _ INVESTIGATE!!!\n" + error);
    });

  //foreground notifications settings
  /*
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      Logger.log('handle notification');
      return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  }
  });
  */
  //FOREGROUND app handler
  const notificationReceivedListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      /*
      alert(
        "FOREGROUND notification received while app is running: " +
          JSON.stringify(notification)
      );
      */
    }
  );

  // This listener is fired whenever a user taps on or interacts with a
  // notification (works when app is foregrounded, backgrounded, or killed)
  const notificationResponseReceivedListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      /*
      alert(
        "FOREGROUND/BACKGROUND/KILLED notification response received listener: " +
          JSON.stringify(response)
      );
      */
    });

  // subscribe to auth changes
  const unsubscribeAuth = onAuthStateChanged(auth, async (authenticatedUser) => {
    Logger.log("auth state change: " + JSON.stringify(authenticatedUser));
    if (authenticatedUser != null) {
      Logger.log("loggedIN: " + (pushToken ?? ""));
      loggedInUnsubscribe = await loggedIn(dispatch, authenticatedUser, pushToken);
    } else {
      loggedOut(dispatch);
    }
  });

  //observe to group changes
  Database.observeAllGroupChanges((groups: Array<Group>) => {
    Logger.log(
      "observe: AllGroupChanges: " + groups.length + ", " + JSON.stringify(groups.map((g) => g.id)),
      Logger.INFO
    );
    dispatch(Actions.groups(groups));
  });

  //build the search index
  Logger.log("building search index");
  const searchIndex = Search.buildSearchIndex(
    store.getState().main.orgsMap,
    store.getState().main.groupMap
  );
  Logger.log("done building search index");

  dispatch(Actions.searchIndex(searchIndex));

  Device.getDeviceTypeAsync().then((deviceType) => {
    //const str = deviceType.toString();
    if (deviceType == Device.DeviceType.DESKTOP) {
      dispatch(Actions.deviceType("DESKTOP"));
    } else if (deviceType == Device.DeviceType.PHONE) {
      dispatch(Actions.deviceType("PHONE"));
    } else {
      dispatch(Actions.deviceType("DESKTOP"));
    }
  });

  Logger.log("Initialization complete");
  dispatch(Actions.appInitialized());

  return () => {
    notificationReceivedListener.remove();
    notificationResponseReceivedListener.remove();
    unsubscribeAuth();
  };
}

export function getLoggedInScreen(state: ScreenState): Screen {
  if (state.screen?.postLoginScreen != null) {
    return state.screen?.postLoginScreen;
  }
  return { screen: "GROUPS" };
}

export async function loggedIn(
  dispatch: (?{ ... }) => void,
  authenticatedUser: {
    uid: string,
    displayName: string,
    photoURL: string,
    email: string,
    pushToken: ?string,
    ...
  },
  pushToken: ?string
): Promise<() => void> {
  Logger.log("Logged In: " + JSON.stringify(authenticatedUser), Logger.INFO);
  const uid = authenticatedUser.uid;

  let userData: {
    uid: string,
    displayName: string,
    photoURL: string,
    email: string,
    pushToken: ?string,
  } = {
    uid,
    displayName: authenticatedUser.displayName,
    photoURL: authenticatedUser.photoURL,
    email: authenticatedUser.email,
    pushToken: null,
  };
  if (pushToken != undefined) {
    userData = { pushToken, ...userData };
  }

  const userInfo = await Database.updateOrCreateUser(uid, userData);
  //observe user changes
  Database.observeUserChanges(uid, (userInfo) => {
    Logger.log("OBSERVE: UserChanges: ", Logger.INFO);
    dispatch(Actions.userInfo(userInfo));
  });

  //observe user group membership changes
  Database.observeUserGroupMemberships(uid, (userGroupMemberships) => {
    Logger.log("OBSERVE: UserGroupMemberships: " + userGroupMemberships.length, Logger.INFO);
    dispatch(Actions.userGroupMemberships(userGroupMemberships));
    userGroupMemberships.forEach(async (groupMembership) => {
      //Loop through group_memberships and set up a subscriber for its messages
      observeGroupMessages(dispatch, groupMembership.groupId);

      //Also observe any requests to join on this group
      Database.observeGroupMembershipRequests(
        groupMembership.groupId,
        (groupMembershipRequests) => {
          Logger.log(
            "OBSERVE: UserGroupMemberships: " + groupMembershipRequests.length,
            Logger.INFO
          );
          dispatch(Actions.groupMembershipRequests(groupMembershipRequests));
        }
      );
    });
  });

  /* observe user chat memberships */
  Database.observeUserChatMemberships(uid, (userChatMemberships) => {
    Logger.log("OBSERVE: UserChatMemberships: " + userChatMemberships.length, Logger.INFO);
    dispatch(Actions.userChatMemberships(userChatMemberships));
    userChatMemberships.forEach(async (chatMembership) => {
      //Loop through group_memberships and set up a subscriber for its messages
      if (!(chatMembership.chatId in chatSubscriptions)) {
        const unsubscribeChat = Database.observeChat(chatMembership.chatId, (chat) => {
          dispatch(Actions.chat(chat));
        });
        chatSubscriptions[chatMembership.chatId] = unsubscribeChat;

        const unsubscribeChatMessages = Database.observeChatMessages(
          chatMembership.chatId,
          (messagesSnapshot) => {
            Logger.log("observe_callback[start]: observeChatMessages");
            const messages = [];
            messagesSnapshot.forEach((message) => {
              messages.push(message);
            });
            dispatch(
              Actions.chatMessages({
                chatId: chatMembership.chatId,
                messages: messages,
              })
            );
            Logger.log("observe_callback[end]: observeChatMessages");
          }
        );
        chatMessageSubscriptions[chatMembership.chatId] = unsubscribeChatMessages;
      }
    });
    Logger.log("observe_callback[end]: observeUserChatMemberships");
  });

  //observe user messages
  Database.observeUserMessages(uid, (userMessages) => {
    Logger.log("OBSERVE: UserMessages: " + userMessages.length, Logger.INFO);
    dispatch(Actions.userMessages(userMessages));
    Logger.log("observe_callback[end]: observeUserMessages");
  });

  //observe user chat messages
  Database.observeUserChatMessages(uid, (userMessages) => {
    Logger.log("OBSERVE: UserChatMessages: " + userMessages.length, Logger.INFO);
    dispatch(Actions.userChatMessages(userMessages));
    Logger.log("observe_callback[end]: observeUserChatMessages");
  });

  //observe org changes
  Database.observeOrgChanges((orgs) => {
    Logger.log("OBSERVE: OrgChanges: " + orgs.length, Logger.INFO);
    dispatch(Actions.orgsUpdated(orgs));
  });

  // observe invites
  const userInvitesUnsubscribe = Database.observeToUserInvites(
    userInfo.uid,
    userInfo.email,
    (invites) => {
      Logger.log("OBSERVE: ToUserInvites: " + invites.length, Logger.INFO);
      dispatch(Actions.toUserInvites(invites));
      Logger.log("observe_callback[end]: observeToUserInvites");
    }
  );

  Database.observeFromUserInvites(userInfo.uid, (invites) => {
    Logger.log("OBSERVE: FromUserInvites: " + invites.length, Logger.INFO);
    dispatch(Actions.fromUserInvites(invites));
    Logger.log("observe_callback[end]: observeFromUserInvites");
  });

  // redirect user automatically to profile if it's not complete
  if (UserInfoUtil.profileIncomplete(userInfo)) {
    Logger.log("observe_callback[start]: profileIncomplete");
    dispatch(Actions.openModal({ modal: "MY_PROFILE", forceComplete: true }));
    Logger.log("observe_callback[end]: profileIncomplete");
  }

  Logger.log("Logged in complete");
  const unsubscribe = () => {
    userInvitesUnsubscribe();
  };
  return unsubscribe;
}

export function useMarkRead(messageId: string) {
  const user = Data.getCurrentUser();
  const message = Messages.getRootMessage(messageId);

  useEffect(() => {
    if (message != null) {
      let markRead = [];
      if (message?.getUserStatus()?.status != "read") {
        markRead.push(message.getID());
      }
      const unreadChildMessages = (message.getChildren() ?? []).filter(
        (m) => m.getUserStatus().status != "read"
      );
      markRead = markRead.concat(unreadChildMessages.map((m) => m.getID()));
      markMessagesRead(user, markRead);
    }
  }, [message]);
}

export function useMarkChatMessagesRead(chatMessages: Array<ChatMessage>): void {
  const user = Data.getCurrentUser();
  return useEffect(() => {
    markChatMessagesRead(
      user,
      chatMessages.map((m) => m.id)
    );
  }, []);
}

export function observeGroupMessages(dispatch: (?{ ... }) => void, groupId: string) {
  if (!(groupId in groupMessageSubscriptions)) {
    const unsubscribe = Database.observeGroupMessages(groupId, (messagesSnapshot) => {
      Logger.log("OBSERVE: GroupMessages: " + messagesSnapshot.length, Logger.INFO);
      const messages = [];
      messagesSnapshot.forEach((message) => {
        messages.push(message);
      });
      dispatch(
        Actions.groupMessages({
          groupId: groupId,
          messages: messages,
        })
      );
    });
    groupMessageSubscriptions[groupId] = unsubscribe;
  }
}

export async function loggedOut(dispatch: (?{ ... }) => void) {
  if (loggedInUnsubscribe != null) {
    loggedInUnsubscribe();
  }
  dispatch(Actions.goToScreen({ screen: "LOGIN" }));
}

export async function initialUserProfileSchools(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  schools: Array<{ ... }>
): Promise<void> {
  await Database.updateOrCreateUser(userInfo.uid, {
    profile: { schools },
  });
  //dispatch(Actions.userInfo(newUserInfo));

  dispatch(Actions.goToScreen({ screen: "INITIAL_SELECT_SCHOOL_GROUPS" }));
  if (userInfo.profileInitialized == null || userInfo.profileInitialized == false) {
    dispatch(Actions.openModal({ modal: "MY_PROFILE" }));
  }
}

export async function joinGroup(uid: string, groupId: string) {
  await Database.joinGroup(uid, groupId);
}

export async function requestToJoin(userInfo: UserInfo, groupId: string) {
  await Database.createGroupMembershipRequest(userInfo, groupId);
}

export async function acceptGroupMembershipRequest(
  userInfo: UserInfo,
  groupMembershipRequest: GroupMembershipRequest
) {
  //have the user join the group
  await joinGroup(groupMembershipRequest.uid, groupMembershipRequest.groupId);

  //delete the group membership request
  await Database.deleteGroupMembershipRequest(
    userInfo,
    groupMembershipRequest.groupId,
    groupMembershipRequest.id
  );
}
export async function rejectGroupMembershipRequest(
  userInfo: UserInfo,
  groupId: string,
  groupMembershipRequest: GroupMembershipRequest
) {
  //get the latest group membership request then update it indicating this particular user dismissed it
  /*
  const groupMembershipRequest = await Database.getGroupMembershipRequest(
    groupMembershipRequest.groupId
  );
  */

  const update = {};
  update[userInfo.uid] = "rejected";
  await Database.updateGroupMembershipRequest(
    groupMembershipRequest.groupId,
    groupMembershipRequest.id,
    update
  );
}
export async function dismissGroupMembershipRequest(
  userInfo: UserInfo,
  groupMembershipRequest: GroupMembershipRequest
) {
  //get the latest group membership request then update it indicating this particular user dismissed it
  /*
  const groupMembershipRequest = await Database.getGroupMembershipRequest(
    groupMembershipRequest.groupId
  );
  */

  const update = {};
  update[userInfo.uid] = "dismissed";
  await Database.updateGroupMembershipRequest(
    groupMembershipRequest.groupId,
    groupMembershipRequest.id,
    update
  );
}

export async function joinOrg(userInfo: UserInfo, orgId: string) {
  await Database.joinOrg(userInfo, orgId);
}

export async function createSchoolGroupAndJoin(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  schoolId: string,
  groupName: string,
  grade: string,
  year: string
) {
  /*
  const groupId = await Database.createGroup({
    name: groupName,
    orgId: schoolId,
    grade,
    year,
  });
  await Database.joinGroup(userInfo.uid, groupId);
  */
}

export async function createGroupAndJoin(
  userInfo: UserInfo,
  groupName: string,
  groupDescription: string,
  type: string,
  parentGroupId: ?string
): Promise<string> {
  const group = {
    name: groupName,
    description: groupDescription,
    parentGroupId: parentGroupId ?? null,
    type: type,
  };
  Logger.log("controller creating group: " + JSON.stringify(group) + ", type: " + type);
  const groupId = await Database.createGroup(groupName, groupDescription, type, null);
  await Database.joinGroup(userInfo.uid, groupId);
  Logger.log("controller created group: " + groupId);
  return groupId;
}

export async function createDefaultOrgGroupIfNotExists(orgId: string): Promise<string> {
  Logger.log("Controller.createDefaultOrgGroupIfNotExists: orgId: " + orgId);
  const groupList = await Database.getAllGroups();
  const org = nullthrows(await Database.getOrg(orgId));

  const defaultGroup = single(
    groupList.filter((group) => {
      group["orgId"] == orgId && group["type"] === "default_org_group";
    })
  );

  if (defaultGroup == null) {
    let groupId = null;
    try {
      const groupName = org.name;
      const groupDescription = groupName + " General Discussion";
      groupId = await createGroup(groupName, groupDescription, "default_org_group", orgId);
    } catch (e) {
      Logger.log("could not create group: " + JSON.stringify(e));
    }
    Logger.log("group created: " + nullthrows(groupId));
    return nullthrows(groupId);
  } else {
    Logger.log("group already exists: " + defaultGroup.id);
    return defaultGroup.id;
  }
}

export async function createOrgGroup(
  orgName: string,
  orgDescription: string,
  orgType: string /* school or activity */
) {
  const orgId = await Database.createOrg(orgName, orgType);
  const groupId = await Database.createGroup(orgName, orgName, "default_org_group", orgId);
}

export async function markMessageRead(userInfo: UserInfo, messageId: string): Promise<void> {
  markMessagesRead(userInfo, [messageId]);
}

export async function markMessagesRead(
  userInfo: UserInfo,
  messageIds: Array<string>
): Promise<void> {
  for (const messageId of messageIds) {
    Database.updateUserMessage(userInfo.uid, messageId, { status: "read" });
  }
}

export async function markChatMessagesRead(
  userInfo: UserInfo,
  chatMessageIds: Array<string>
): Promise<void> {
  for (const chatMessageId of chatMessageIds) {
    Database.updateUserChatMessage(userInfo.uid, chatMessageId, { status: "read" });
  }
}

/*
            const groupId = await Controller.createPrivateGroupAndJoin(
              userInfo,
              groupName,
              groupDescription
            );
*/

export async function createPrivateGroupAndJoin(
  userInfo: UserInfo,
  groupName: string,
  groupDescription: string
): Promise<string> {
  const groupId = await Database.createGroup(groupName, groupDescription, "private", null);
  await Database.joinGroup(userInfo.uid, groupId);

  /*
  for (const inviteeUid of invitees) {
    sendGroupInviteToUser(userInfo, groupId, inviteeUid);
  }

  for (const inviteeEmail of emailInvitees) {
    sendGroupInviteToEmail(userInfo, groupId, inviteeEmail);
  }
  */

  return groupId;
}

export async function createChat(
  userInfo: UserInfo,
  participantIds: Array<string>
): Promise<string> {
  Logger.log("calling Database.createChat");
  const chatId = await Database.createChat({ organizerUid: userInfo.uid, participantIds });
  //await Database.joinChat(userInfo.uid, chatId);
  participantIds.forEach(async (uid) => {
    Logger.log("calling Database.joinChat");
    await Database.joinChat(uid, chatId);
  });
  return chatId;
}

export async function createOrgGroupAndJoin(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  orgId: string,
  groupName: string
) {
  const groupId = await Database.createGroup(groupName, "", "", orgId);
  await Database.joinGroup(userInfo.uid, groupId);
}

export async function subscribeToGroup(userInfo: UserInfo, groupId: string) {}

export async function sendMessage(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  groupId: string,
  title: string,
  text: string,
  data: ?{ ... },
  papaId: ?string,
  notificationInfo: ?{ ... }
): Promise<string> {
  return await Database.sendMessage(
    groupId,
    userInfo.uid,
    title == undefined ? null : title,
    text,
    data,
    papaId == undefined ? null : papaId,
    notificationInfo
  );
}

export async function sendReply(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  groupId: string,
  text: string,
  papaId: ?string,
  notificationInfo: ?{ ... }
): Promise<string> {
  return await Database.sendMessage(
    groupId,
    userInfo.uid,
    null,
    text,
    null,
    papaId == undefined ? null : papaId,
    notificationInfo
  );
}

export async function sendChatMessage(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  chatId: string,
  text: string,
  papaId: ?string,
  notificationInfo: ?{ ... }
): Promise<string> {
  //export async function sendChatMessage(chatId, uid, text, data, papaId, notificationInfo) {
  return await Database.sendChatMessage(
    chatId,
    userInfo.uid,
    text,
    null,
    papaId == undefined ? null : papaId,
    notificationInfo
  );
}

export async function sendEventReply(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  groupId: string,
  eventResponse: ?{ ... },
  text: string,
  papaId: ?string,
  notificationInfo: ?{ ... }
): Promise<string> {
  return await Database.sendMessage(
    groupId,
    userInfo.uid,
    null,
    text,
    {
      event: {
        eventResponse,
      },
    },
    papaId == undefined ? null : papaId,
    notificationInfo
  );
}

export async function logout(dispatch: (?{ ... }) => void) {
  await signOut(auth);
  dispatch(Actions.clearUserData({}));
}

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync(): Promise<?string> {
  if (!Device.isDevice) {
    return;
  }

  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      //alert("Failed to get push token for push notification!");
      Logger.log("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    //palert("got notification token!");
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function createOrgAndAssignToUser(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  name: string,
  type: string
) {
  const orgId = await Database.createOrg(name, type);
  await Database.updateUserAddToArrayField(userInfo.uid, "orgs", orgId);
}

export async function sendGroupInviteToEmails(
  userInfo: UserInfo,
  groupId: string,
  emails: Array<string>
) {
  for (const email of emails) {
    await Database.createInvite(userInfo.uid, groupId, null, email);
  }
}

export async function sendGroupInviteToUser(userInfo: UserInfo, groupId: string, uid: string) {
  await Database.createInvite(userInfo.uid, groupId, uid, null);
}

export async function joinGroupFromInvite(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  groupId: string,
  inviteId: string
) {
  await Database.joinGroup(userInfo.uid, groupId);
  await Database.updateInvite(inviteId, { status: "dismissed" });
}

export async function dismissInvite(
  dispatch: (?{ ... }) => void,
  userInfo: UserInfo,
  inviteId: string
) {
  await Database.updateInvite(inviteId, { status: "dismissed" });
}

export function searchGroupsAndOrgs(text: string): { ... } {
  const searchIndex = store.getState().main.searchIndex;
  const results = Search.search(searchIndex, text);
  return results;
}

export async function setUserGroupLastViewedTimestamp(
  userInfo: UserInfo,
  groupId: string,
  lastViewedMessageTimestamp: Date
) {
  console.log("getState()");
  const userGroupMemberships = store.getState().main.groupMembershipMap?.[groupId].filter((gm) => {
    console.log("NULL check: " + JSON.stringify(gm));
    return gm.uid == userInfo.uid;
  });

  const userGroupMembership =
    (userGroupMemberships ?? []).length > 0 ? userGroupMemberships?.[0] : null;
  if (userGroupMembership != null) {
    /*
    Logger.log(
      "found usergroupmembership: " +
        userGroupMembership.id +
        ", updating timestamp: " +
        lastViewedMessageTimestamp.getTime() +
        "(" +
        lastViewedMessageTimestamp +
        ")"
    );
    */
    Logger.log("lastViewedMessageTimestamp: " + lastViewedMessageTimestamp.toDateString());
    Database.updateUserGroupMembership(userGroupMembership.id, {
      lastViewedMessageTimestamp: lastViewedMessageTimestamp.getTime(),
    });
  }
}

export async function saveProfile(
  userId: string,
  firstName: string,
  lastName: string,
  image: ?string
) {
  await Database.updateUser(userId, {
    firstName,
    lastName,
    image: image === undefined ? null : image,
    profileInitialized: true,
  });
}

export async function updateGroup(userInfo: UserInfo, groupId: string, update: { ... }) {
  await Database.updateGroup(groupId, update);
}

export async function markDeleteGroup(userInfo: UserInfo, groupId: string) {
  await Database.updateGroup(groupId, {
    status: "deleted",
  });
}

export async function deleteGroup(groupId: string) {
  await Database.deleteGroup(groupId);
}

export async function deleteUser(uid: string) {
  const allGroupMemberships = await Database.getAllGroupMemberships();
  const userGroupMemberships = allGroupMemberships.filter((gm) => {
    console.log("NULL check: " + JSON.stringify(gm));
    return gm.uid === uid;
  });
  for (const gm of userGroupMemberships) {
    await Database.deleteGroupMembership(gm.id);
  }
  await Database.deleteUser(uid);
}

export async function deleteGroupMembership(groupMembershipId: string) {
  await Database.deleteGroupMembership(groupMembershipId);
}

export async function createSharedCalendar(groupId: string) {
  const ics = require("ics"); //https://www.npmjs.com/package/ics

  ics.createEvent(
    {
      title: "Dinner",
      description: "Nightly thing I do",
      busyStatus: "FREE",
      start: [2022, 6, 23, 6, 30],
      duration: { minutes: 50 },
    },
    async (error, value) => {
      if (error) {
        Logger.log(error);
      }

      const metadata = {
        contentType: "text/calendar",
      };

      const fileRef = ref(storage, "calendars/test/test_calendar4.ics");
      let blob = new Blob([value], { type: "text/calendar" });
      Logger.log("uploading");
      const result = uploadBytes(fileRef, blob).then((snapshot) => {
        Logger.log("Uploaded a blob or file!");
        Logger.log("snapshpt: " + JSON.stringify(snapshot));
      });
      Logger.log("result: " + JSON.stringify(result));
      // We're done with the blob, close and release it
      //blob.close();
    }
  );
  ics;
}

function single(list) {
  if (list != null && list.length > 0) {
    return list[list.length - 1];
  } else {
    return null;
  }
}
