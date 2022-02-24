import * as Actions from "./Actions";
import { db, auth } from "./config/firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  where,
  setDoc,
  onSnapshot,
  query,
  Timestamp,
  //} from "firebase/firestore/lite";
} from "firebase/firestore";

const groupMessageSubscriptions = {};

export async function initializeApp(
  dispatch,
  notificationListener,
  responseListener
) {
  // store all schools
  const schoolsSnapshot = await getDocs(collection(db, "schools"));
  const schools = [];
  schoolsSnapshot.forEach((doc) => {
    schools.push({ id: doc.id, ...doc.data() });
  });

  // store all groups
  const groupsSnapshot = await getDocs(collection(db, "groups"));
  const groups = [];
  groupsSnapshot.forEach((doc) => {
    groups.push(doc.data());
  });

  // store all people
  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = [];
  usersSnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });

  //all group memberships
  const groupMembershipsRef = collection(db, "group_memberships");
  const groupMembershipsSnapshot = await getDocs(groupMembershipsRef);
  const groupMemberships = [];
  groupMembershipsSnapshot.forEach((doc) => {
    groupMemberships.push({ id: doc.id, ...doc.data() });
  });

  dispatch(
    Actions.locationDataInit({ schools, groups, users, groupMemberships })
  );

  //observe group_membership_changes
  onSnapshot(groupMembershipsRef, (groupMembershipsSnapshot) => {
    const groupMembershipDocs = [];
    groupMembershipsSnapshot.forEach((groupMembership) => {
      const data = groupMembership.data();
      groupMembershipDocs.push({
        id: groupMembership.id,
        ...data,
      });
    });
    dispatch(Actions.groupMemberships(groupMembershipDocs));
  });

  //push notification token

  let pushToken = null;

  await registerForPushNotificationsAsync().then((token) => {
    console.log("Got push notificaiton token: " + token);
    pushToken = token;
  });

  //foreground notifications settings
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  console.log("notificationListener: " + notificationListener);
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("received notification: " + JSON.stringify(notification));
    }
  );

  // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  responseListener.current =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

  // subscribe to auth changes
  const unsubscribeAuth = onAuthStateChanged(
    auth,
    async (authenticatedUser) => {
      console.log("auth state change: " + JSON.stringify(authenticatedUser));
      if (authenticatedUser != null) {
        console.log("loggedIN: " + pushToken);
        loggedIn(dispatch, authenticatedUser, pushToken);
      } else {
        loggedOut(dispatch);
      }
    }
  );

  //observe to group changes
  const groupsCollectionRef = collection(db, "groups");
  onSnapshot(groupsCollectionRef, (groupsSnapshot) => {
    const groupDocs = [];
    groupsSnapshot.forEach((group) => {
      const data = group.data();
      groupDocs.push({
        id: group.id,
        name: data.name,
        schoolId: data.schoolId,
      });
    });
    dispatch(Actions.groups(groupDocs));
  });

  //Go to login page by default
  dispatch(Actions.goToScreen({ screen: "LOGIN" }));
}

function goToSignup(dispatch) {
  dispatch(Actions.goToScreen({ screen: "SIGNUP" }));
}

export async function loggedIn(dispatch, authenticatedUser, pushToken) {
  console.log("logged in");
  const uid = authenticatedUser.uid;
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  let userDoc = null;
  let userInfo = null;
  if (docSnap.exists()) {
    //update with latest push token
    const userRef = doc(collection(db, "users"), uid);
    userInfo = { id: docSnap.id, ...docSnap.data() };
    userDoc = await setDoc(
      userRef,
      {
        pushToken: pushToken == undefined ? null : pushToken,
      },
      { merge: true }
    );
  } else {
    const userData = {
      uid: uid,
      displayName: authenticatedUser.displayName,
      photoURL: authenticatedUser.photoURL,
      email: authenticatedUser.email,
      pushToken: pushToken == undefined ? null : pushToken,
    };
    userDoc = await setDoc(doc(db, "users", uid), userData);
    userInfo = userData;
  }

  //observe user changes
  const userDocRef = doc(db, "users", uid);
  onSnapshot(
    userDocRef,
    (doc) => {
      const data = doc.data();
      userInfo = { id: doc.id, ...data };
      dispatch(Actions.userInfo(userInfo));
    },
    (err) => {
      console.log("encountered error");
    }
  );

  //observe user group membership changes
  const userGroupMembershipsQuery = query(
    collection(db, "group_memberships"),
    where("uid", "==", uid)
  );
  const userGroupMemberships = await getDocs(userGroupMembershipsQuery);
  const userGroupMembershipDocs = userGroupMemberships.docs.map((doc) =>
    doc.data()
  );
  dispatch(Actions.userGroupMemberships(userGroupMembershipDocs));

  //user group membership subscription
  onSnapshot(userGroupMembershipsQuery, (userGroupMembershipsSnapshot) => {
    const userGroupMembershipDocs = userGroupMembershipsSnapshot.docs.map(
      (doc) => doc.data()
    );

    // messages for each group
    userGroupMembershipDocs.forEach(async (groupMembership) => {
      const messagesCollectionRef = collection(
        doc(collection(db, "groups"), groupMembership.groupId),
        "messages"
      );
      if (!(groupMembership.groupId in groupMessageSubscriptions)) {
        const unsubscribe = onSnapshot(
          messagesCollectionRef,
          (messagesSnapshot) => {
            const messageDocs = [];
            messagesSnapshot.forEach((message) => {
              const data = message.data();
              messageDocs.push({
                id: message.id,
                text: data.text,
                uid: data.uid,
                timestamp: data.timestamp.toMillis(),
              });
            });
            dispatch(
              Actions.groupMessages({
                groupId: groupMembership.groupId,
                messages: messageDocs,
              })
            );
          }
        );
        groupMessageSubscriptions[groupMembership.groupId] = unsubscribe;
      }
      dispatch(Actions.userGroupMemberships(userGroupMembershipDocs));
    });
  });

  //observe schools changes
  var schoolQuery = onSnapshot(
    collection(db, "schools"),
    (docsSnapshot) => {
      const schools = docsSnapshot.docs.map((doc) => doc.data());
      dispatch(Actions.schoolsUpdated(schools));
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );
  if (userInfo.profile == null) {
    dispatch(Actions.goToScreen({ screen: "INITIAL_SELECT_SCHOOLS" }));
  } else {
    if (userInfo.schools == null || userInfo.schools.length == 0) {
      dispatch(Actions.goToScreen({ screen: "INITIAL_SELECT_SCHOOL_GROUPS" }));
    } else {
      dispatch(Actions.goToScreen({ screen: "GROUPS" }));
    }
  }
}

export async function loggedOut(dispatch) {
  dispatch(Actions.goToScreen({ screen: "LOGIN" }));
}

export async function initialUserProfileSchools(dispatch, userInfo, schools) {
  /*
  const res = await cityRef.set({
  capital: true
  }, { merge: true });
  */

  const newUserInfo = { ...userInfo, profile: { schools } };
  dispatch(Actions.userInfo(newUserInfo));

  await setDoc(doc(db, "users", userInfo.uid), newUserInfo, {
    merge: true,
  });
  dispatch(Actions.goToUserScreen({ screen: "INITIAL_SELECT_SCHOOL_GROUPS" }));
}

export async function joinGroup(dispatch, userInfo, groupId) {
  const groupMembershipCollectionRef = collection(db, "group_memberships");
  const existingGroupMembershipQuery = query(
    groupMembershipCollectionRef,
    where("uid", "==", userInfo.uid),
    where("groupId", "==", groupId)
  );

  const existingGroupMembershipSnapshot = await getDocs(
    existingGroupMembershipQuery
  );

  console.log(
    "existing memberships: " + existingGroupMembershipSnapshot.docs.length
  );
  if (existingGroupMembershipSnapshot.docs.length == 0) {
    const membership = { uid: userInfo.uid, groupId: groupId };
    await addDoc(groupMembershipCollectionRef, membership);
  }
  /*
  const newGroups = [...userInfo.groups];
  newGroups.push(groupId);
  const update = {
    groups: newGroups,
  };
  await setDoc(doc(db, "users", userInfo.uid), update, {
    merge: true,
  });
  */
}

export async function createSchoolGroupAndJoin(
  dispatch,
  userInfo,
  schoolId,
  groupName,
  grade,
  year
) {
  const groupsRef = collection(db, "groups");
  const group = await addDoc(groupsRef, {
    name: groupName,
    schoolId: schoolId,
    grade,
    year,
  });
  await joinGroup(dispatch, userInfo, group.id);
}

export async function sendMessage(dispatch, userInfo, groupId, text) {
  const message = {
    uid: userInfo.uid,
    groupId,
    text,
    //timestamp: Date.now(),
    //timestamp: db.firestore.FieldValue.serverTimestamp(), doesn't work
    //timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    timestamp: Timestamp.now().toDate(),
  };
  const messagesRef = collection(
    doc(collection(db, "groups"), groupId),
    "messages"
  );
  await addDoc(messagesRef, message);
}

export async function logout(dispatch) {
  await signOut(auth);
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
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
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
