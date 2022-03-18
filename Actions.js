import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  Timestamp,
  //} from "firebase/firestore/lite";
} from "firebase/firestore";

export const screenSlice = createSlice({
  name: "screen",
  initialState: {
    screen: {
      screen: "SPLASH",
    },
    userScreen: {
      screen: "LOADING",
    },
  },
  reducers: {
    goToScreen: (state, screen) => {
      const newState = {
        ...state,
        screen: screen.payload,
      };
      return newState;
    },
    goToUserScreen: (state, screen) => {
      const newState = {
        ...state,
        userScreen: screen.payload,
      };
      return newState;
    },
  },
});

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    userInfo: null,
    orgsList: null,
    orgMap: null,
    groupIds: null,
    groupMap: null,
    groupMembershipMap: null,
    userMap: null,
    userList: null,
    userGroupMemberships: null,
    groupMessages: {},
    pushToken: null,
    toUserInvites: null,
    userMessagesMap: null,
  },
  reducers: {
    appInitialized: (state, obj) => {
      const newState = {
        ...state,
        appInitialized: true,
      };
      return newState;
    },
    userInfo: (state, obj) => {
      const userInfo = obj.payload;
      const newUserMap = { ...state.userMap };
      newUserMap[userInfo.uid] = userInfo;
      const newState = {
        ...state,
        userInfo,
        userMap: newUserMap,
      };
      return newState;
    },
    locationDataInit: (state, obj) => {
      const { orgs, groups, users, groupMemberships } = obj.payload;

      //users
      const userList = [];
      const userMap = {};
      for (const user of users) {
        userList.push(user);
        userMap[user.id] = user;
      }

      //groups
      const groupList = [];
      const groupMap = {};
      for (const group of groups) {
        groupList.push(group);
        groupMap[group.id] = group;
      }

      //groupMemberships
      const groupMembershipMap = {};
      for (const groupMembership of groupMemberships) {
        !(groupMembership.groupId in groupMembershipMap)
          ? (groupMembershipMap[groupMembership.groupId] = [groupMembership])
          : groupMembershipMap[groupMembership.groupId].push(groupMembership);
      }

      //orgs
      const orgsList = [];
      const orgsMap = {};
      for (const org of orgs) {
        orgsList.push(org);
        orgsMap[org.id] = org;
      }

      const newState = {
        ...state,
        userList,
        userMap,
        groupList,
        groupMap,
        orgsList,
        orgsMap,
        groupMembershipMap,
      };
      return newState;
    },
    pushToken: (state, obj) => {
      const { token } = obj.payload;

      const newState = {
        ...state,
        pushToken: token,
      };
      return newState;
    },
    userGroupMemberships: (state, obj) => {
      const userGroupMemberships = obj.payload;
      const newState = {
        ...state,
        userGroupMemberships,
      };
      return newState;
    },
    groupMessages: (state, obj) => {
      const { groupId, messages } = obj.payload;
      const orderedMessages = messages.sort((message1, message2) => {
        return message2.timestamp - message1.timestamp;
      });
      const groupMessages = { ...state.groupMessages };
      groupMessages[groupId] = orderedMessages;

      const newState = {
        ...state,
        groupMessages,
      };
      return newState;
    },
    userMessages: (state, obj) => {
      const messages = obj.payload;
      const userMessagesMap = { ...state.userMessagesMap}
      for (const message of messages) {
        userMessagesMap[message.id] = message;
      }
      return {
        ...state,
        userMessagesMap,
      }
    },
    groups: (state, obj) => {
      const groups = obj.payload;
      const groupList = [];
      const groupMap = {};
      for (const group of groups) {
        groupList.push(group);
        groupMap[group.id] = group;
      }
      const newState = {
        ...state,
        groupList,
        groupMap,
      };
      return newState;
    },
    groupMemberships: (state, obj) => {
      const groupMemberships = obj.payload;
      const groupMembershipMap = {};
      for (const groupMembership of groupMemberships) {
        !(groupMembership.groupId in groupMembershipMap)
          ? (groupMembershipMap[groupMembership.groupId] = [groupMembership])
          : groupMembershipMap[groupMembership.groupId].push(groupMembership);
      }
      const newState = {
        ...state,
        groupMembershipMap,
      };
      return newState;
    },
    orgsUpdated: (state, obj) => {
      const orgs = obj.payload;
      const orgsList = [];
      const orgsMap = {};
      for (const org of orgs) {
        orgsList.push(org);
        orgsMap[org.id] = org;
      }

      const newState = {
        ...state,
        orgsList,
        orgsMap,
      };
      return newState;
    },
    toUserInvites: (state, obj) => {
      const toUserInvites = obj.payload;
      const newState = {
        ...state,
        toUserInvites,
      };
      return newState;
    },
    searchIndex: (state, obj) => {
      const searchIndex = obj.payload;
      const newState = {
        ...state,
        searchIndex,
      };
      return newState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  appInitialized,
  pushToken,
  userInfo,
  locationDataInit,
  orgsUpdated,
  userGroupMemberships,
  groupMessages,
  groups,
  groupMemberships,
  toUserInvites,
  searchIndex,
  userMessages,
} = mainSlice.actions;
export const { goToScreen, goToUserScreen } = screenSlice.actions;

export default configureStore({
  reducer: {
    main: mainSlice.reducer,
    screen: screenSlice.reducer,
  },
  middleware: [],
});
