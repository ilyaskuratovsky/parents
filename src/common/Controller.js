import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Platform } from "react-native";
import * as Actions from "./Actions";
import { auth } from "../../config/firebase";
import * as Database from "./Database";
import store from "./Actions";
import * as Search from "./Search";

//import { Database } from "firebase-firestore-lite";

const groupMessageSubscriptions = {};

export async function initializeApp(dispatch, notificationListener, responseListener) {
  const orgs = await Database.getAllOrgs();

  // store all groups
  const groups = await Database.getAllGroups();

  // store all people
  const users = await Database.getAllUsers();

  //all group memberships
  const groupMemberships = await Database.getAllGroupMemberships();

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
    dispatch(Actions.groupMemberships(groupMemberships));
  });

  //push notification token
  let pushToken = null;

  // register for push notifications - receive a token that you can use
  // to push notifications to this particular device
  await registerForPushNotificationsAsync()
    .then((token) => {
      console.log("Got push notificaiton token: " + token);
      pushToken = token;
    })
    .catch((error) => {
      console.log("ERROR REtRieving PUSH TOKEN _ INVESTIGATE!!!\n" + error);
    });

  //foreground notifications settings
  /*
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      console.log('handle notification');
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
    console.log("auth state change: " + JSON.stringify(authenticatedUser));
    if (authenticatedUser != null) {
      console.log("loggedIN: " + pushToken);
      loggedIn(dispatch, authenticatedUser, pushToken);
    } else {
      loggedOut(dispatch);
    }
  });

  //observe to group changes
  Database.observeAllGroupChanges((groups) => {
    dispatch(Actions.groups(groups));
  });

  //build the search index
  const searchIndex = Search.buildSearchIndex(
    store.getState().main.orgsMap,
    store.getState().main.groupMap
  );

  dispatch(Actions.searchIndex(searchIndex));

  return () => {
    notificationReceivedListener.remove();
    notificationResponseReceivedListener.remove();
    unsubscribeAuth();
  };
}

export function getLoggedInScreen(state) {
  if (state.screen.postLoginScreen != null) {
    return state.screen.postLoginScreen;
  }
  return { screen: "GROUPS" };
}

export async function loggedIn(dispatch, authenticatedUser, pushToken) {
  console.log("logged in");
  const uid = authenticatedUser.uid;

  let userData = {
    uid,
    displayName: authenticatedUser.displayName,
    photoURL: authenticatedUser.photoURL,
    email: authenticatedUser.email,
  };
  if (pushToken != undefined) {
    userData = { pushToken, ...userData };
  }

  const userInfo = await Database.updateOrCreateUser(uid, userData);
  //observe user changes
  Database.observeUserChanges(uid, (userInfo) => {
    dispatch(Actions.userInfo(userInfo));
  });

  //observe user group membership changes
  Database.observeUserGroupMemberships(uid, (userGroupMemberships) => {
    dispatch(Actions.userGroupMemberships(userGroupMemberships));
    userGroupMemberships.forEach(async (groupMembership) => {
      //Loop through group_memberships and set up a subscriber for its messages
      if (!(groupMembership.groupId in groupMessageSubscriptions)) {
        const unsubscribe = Database.observeGroupMessages(
          groupMembership.groupId,
          (messagesSnapshot) => {
            const messages = [];
            messagesSnapshot.forEach((message) => {
              messages.push(message);
            });
            dispatch(
              Actions.groupMessages({
                groupId: groupMembership.groupId,
                messages: messages,
              })
            );
          }
        );
        groupMessageSubscriptions[groupMembership.groupId] = unsubscribe;
      }
    });
  });

  //observe user messages
  Database.observeUserMessages(uid, (userMessages) => {
    dispatch(Actions.userMessages(userMessages));
  });

  //observe org changes
  Database.observeOrgChanges((orgs) => {
    dispatch(Actions.orgsUpdated(orgs));
  });

  // observe invites
  Database.observeToUserInvites(userInfo.uid, userInfo.email, (invites) => {
    dispatch(Actions.toUserInvites(invites));
  });
}

export async function loggedOut(dispatch) {
  dispatch(Actions.goToScreen({ screen: "LOGIN" }));
}

export async function initialUserProfileSchools(dispatch, userInfo, schools) {
  await Database.updateOrCreateUser(userInfo.uid, {
    profile: { schools },
  });
  //dispatch(Actions.userInfo(newUserInfo));

  dispatch(Actions.goToScreen({ screen: "INITIAL_SELECT_SCHOOL_GROUPS" }));
  if (userInfo.profileInitialized == null || userInfo.profileInitialized == false) {
    dispatch(Actions.openModal({ modal: "MY_PROFILE" }));
  }
}

export async function joinGroup(dispatch, userInfo, groupId) {
  await Database.joinGroup(userInfo, groupId);
}

export async function createSchoolGroupAndJoin(
  dispatch,
  userInfo,
  schoolId,
  groupName,
  grade,
  year
) {
  const groupId = await Database.createGroup({
    name: groupName,
    orgId: schoolId,
    grade,
    year,
  });
  await Database.joinGroup(userInfo, groupId);
}

export async function markMessageRead(userInfo, messageId) {
  markMessagesRead(userInfo, [messageId]);
}

export async function markMessagesRead(userInfo, messageIds) {
  for (const messageId of messageIds) {
    Database.updateUserMessage(userInfo.uid, messageId, { status: "read" });
  }
}

export async function createPrivateGroupAndJoin(
  dispatch,
  userInfo,
  groupName,
  invitees,
  emailInvitees
) {
  const groupId = await Database.createGroup({
    name: groupName,
    orgId: null,
  });
  await Database.joinGroup(userInfo, groupId);

  for (const inviteeUid of invitees) {
    sendGroupInviteToUser(userInfo, groupId, inviteeUid);
  }

  for (const inviteeEmail of emailInvitees) {
    sendGroupInviteToEmail(userInfo, groupId, inviteeEmail);
  }

  return groupId;
}

export async function createOrgGroupAndJoin(dispatch, userInfo, orgId, groupName) {
  const groupId = await Database.createGroup({
    name: groupName,
    orgId: orgId,
  });
  await Database.joinGroup(userInfo, groupId);
}

export async function sendMessage(
  dispatch,
  userInfo,
  groupId,
  title,
  text,
  papaId,
  notificationInfo
) {
  return await Database.sendMessage(
    groupId,
    userInfo.uid,
    title == undefined ? null : title,
    text,
    null,
    papaId == undefined ? null : papaId,
    notificationInfo
  );
}

export async function sendReply(dispatch, userInfo, groupId, text, papaId, notificationInfo) {
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

export async function sendEventMessage(
  dispatch,
  userInfo,
  groupId,
  title,
  text,
  startDate,
  endDate,
  papaId,
  notificationInfo
) {
  return await Database.sendMessage(
    groupId,
    userInfo.uid,
    title == undefined ? null : title,
    text,
    {
      event: {
        startDate,
        endDate,
      },
    },
    papaId == undefined ? null : papaId,
    notificationInfo == undefined ? null : notificationInfo
  );
}

export async function sendEventReply(
  dispatch,
  userInfo,
  groupId,
  status,
  text,
  papaId,
  notificationInfo
) {
  return await Database.sendMessage(
    groupId,
    userInfo.uid,
    null,
    text,
    {
      event: {
        status,
      },
    },
    papaId == undefined ? null : papaId,
    notificationInfo
  );
}

export async function logout(dispatch) {
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

async function registerForPushNotificationsAsync() {
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
      console.log("Failed to get push token for push notification!");
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

export async function inviteToGroup(dispatch, fromUserInfo, touserInfo, groupId) {}

export async function createOrgAndAssignToUser(dispatch, userInfo, name, type) {
  const orgId = await Database.createOrg(name, type);
  await Database.updateUserAddToArrayField(userInfo.uid, "orgs", orgId);
}

export async function sendGroupInviteToEmail(userInfo, groupId, email) {
  await Database.createInvite(userInfo.uid, groupId, null, email);
}

export async function sendGroupInviteToUser(userInfo, groupId, uid) {
  await Database.createInvite(userInfo.uid, groupId, uid, null);
}

export async function joinGroupFromInvite(dispatch, userInfo, groupId, inviteId) {
  await Database.joinGroup(userInfo, groupId);
  await Database.updateInvite(inviteId, { status: "dismissed" });
}

export async function dismissInvite(dispatch, userInfo, inviteId) {
  await Database.updateInvite(inviteId, { status: "dismissed" });
}

export function searchGroupsAndOrgs(text) {
  const searchIndex = store.getState().main.searchIndex;
  const results = Search.search(searchIndex, text);
  return results;
}

export async function setUserGroupLastViewedTimestamp(
  userInfo,
  groupId,
  lastViewedMessageTimestamp
) {
  const userGroupMemberships = store
    .getState()
    .main.groupMembershipMap[groupId].filter((gm) => gm.uid == userInfo.uid);

  const userGroupMembership = userGroupMemberships.length > 0 ? userGroupMemberships[0] : null;
  if (userGroupMembership != null) {
    console.log(
      "found usergroupmembership: " +
        userGroupMembership.id +
        ", updating timestamp: " +
        lastViewedMessageTimestamp
    );
    Database.updateUserGroupMembership(userGroupMembership.id, {
      lastViewedMessageTimestamp,
    });
  }
}

export async function saveProfile(userId, firstName, lastName, image) {
  await Database.updateUser(userId, {
    firstName,
    lastName,
    image,
    profileInitialized: true,
  });
}

export async function deleteGroup(userInfo, groupId) {
  await Database.updateGroup(groupId, {
    status: "deleted",
  });
}
