import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  Timestamp,
  //} from "firebase/firestore/lite";
} from "firebase/firestore";
import * as Logger from "./Logger";
import * as MessageUtils from "./MessageUtils";

const START_IN_DEBUG = true;
export const screenSlice = createSlice({
  name: "screen",
  initialState: {
    screen: {
      screen: null,
    },
    modal: {
      modal: null,
    },
    userScreen: {
      screen: null,
    },
  },
  reducers: {
    goToScreen: (state, screen) => {
      Logger.log("Actions.goToScreen: " + JSON.stringify(screen));
      const newState = {
        ...state,
        screen: screen.payload,
        postLoginScreen: null,
      };
      return newState;
    },
    openModal: (state, modal) => {
      Logger.log("Actions.openModal: " + JSON.stringify(modal));
      const newState = {
        ...state,
        modal: modal.payload,
      };
      return newState;
    },
    closeModal: (state, modal) => {
      Logger.log("Actions.closeModal: " + JSON.stringify(modal));
      const newState = {
        ...state,
        modal: null,
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
    userChatMemberships: [],
    chatMap: {},
    messages: {},
    allChatMessages: {},
    groupMessages: {},
    chatMessages: {},
    pushToken: null,
    toUserInvites: null,
    groupMembershipRequests: null,
    fromUserInvites: null,
    userMessagesMap: null,
    userChatMessagesMap: null,
    unreadMessages: [],
    deviceType: null,
  },
  reducers: {
    appInitialized: (state, obj) => {
      Logger.log("Actions.appInitialized");
      const newState = {
        ...state,
        appInitialized: true,
      };
      return newState;
    },
    userInfo: (state, obj) => {
      const userInfo = obj.payload;
      Logger.log("Actions.userInfo: " + userInfo?.id);
      const newUserMap = { ...state.userMap };
      newUserMap[userInfo.uid] = userInfo;
      const newState = {
        ...state,
        userInfo,
        userMap: newUserMap,
      };
      return newState;
    },
    clearUserData: (state, obj) => {
      const newState = {
        ...state,
        userInfo: null,
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
      Logger.log("Actions.pushToken: " + JSON.stringify(token));

      const newState = {
        ...state,
        pushToken: token,
      };
      return newState;
    },
    userGroupMemberships: (state, obj) => {
      const userGroupMemberships = obj.payload;
      Logger.log(
        "Actions.userGroupMemberships: " + JSON.stringify(userGroupMemberships?.map((u) => u?.id))
      );
      const newState = {
        ...state,
        userGroupMemberships,
      };
      return newState;
    },
    userChatMemberships: (state, obj) => {
      const userChatMemberships = obj.payload;
      const newState = {
        ...state,
        userChatMemberships,
      };
      return newState;
    },
    chat: (state, obj) => {
      const chat = obj.payload;
      const newChatMap = { ...state.chatMap };
      if (chat != null) {
        newChatMap[chat.id] = chat;
      }
      const newState = {
        ...state,
        chatMap: newChatMap,
      };
      return newState;
    },
    groupMessages: (state, obj) => {
      const { groupId, messages } = obj.payload;
      Logger.log("Actions.groupMessages, groupId:" + groupId);
      const orderedMessages = messages.sort((message1, message2) => {
        return message2.timestamp - message1.timestamp;
      });
      const groupMessages = { ...state.groupMessages };
      groupMessages[groupId] = orderedMessages;

      const allMessages = { ...state.messages };
      orderedMessages.forEach((message) => {
        allMessages[message.id] = message;
      });

      const newState = {
        ...state,
        groupMessages,
        messages: allMessages,
        //rootUserMessages: {...state.rootUserMessages, ...groupRootUserMessages},
      };
      return newState;
    },
    chatMessages: (state, obj) => {
      const { chatId, messages } = obj.payload;
      Logger.log("Actions.chatMessages, chatId:" + chatId);
      const orderedMessages = messages.sort((message1, message2) => {
        return message2.timestamp - message1.timestamp;
      });
      const chatMessages = { ...state.chatMessages };
      chatMessages[chatId] = orderedMessages;

      const allChatMessages = { ...state.allChatMessages };
      orderedMessages.forEach((message) => {
        allChatMessages[message.id] = message;
      });

      const newState = {
        ...state,
        chatMessages,
        allChatMessages,
        //rootUserMessages: {...state.rootUserMessages, ...groupRootUserMessages},
      };
      return newState;
    },
    userMessages: (state, obj) => {
      const messages = obj.payload;
      Logger.log("Actions.userMessages");
      const userMessagesMap = { ...state.userMessagesMap };
      for (const message of messages) {
        userMessagesMap[message.id] = message;
      }

      return {
        ...state,
        userMessagesMap,
        //rootUserMessages,
      };
    },
    userChatMessages: (state, obj) => {
      const messages = obj.payload;
      Logger.log("Actions.userChatMessages");
      const userChatMessagesMap = { ...state.userChatMessagesMap };
      for (const message of messages) {
        userChatMessagesMap[message.id] = message;
      }

      return {
        ...state,
        userChatMessagesMap,
        //rootUserMessages,
      };
    },
    groups: (state, obj) => {
      let groups = obj.payload;
      groups = groups.filter((group) => group != null /* && group.status != "deleted"*/);
      Logger.log("Actions.groups");
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
      Logger.log("Actions.groupMemberships");
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
    groupMembershipRequests: (state, obj) => {
      const groupMembershipRequests = obj.payload;
      Logger.log("Actions.groupMembershipRequests");
      const newState = {
        ...state,
        groupMembershipRequests,
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
      Logger.log("Actions.toUserInvites");
      const newState = {
        ...state,
        toUserInvites,
      };
      return newState;
    },
    fromUserInvites: (state, obj) => {
      const fromUserInvites = obj.payload;
      Logger.log("Actions.fromUserInvites");
      const newState = {
        ...state,
        fromUserInvites,
      };
      return newState;
    },
    searchIndex: (state, obj) => {
      const searchIndex = obj.payload;
      Logger.log("Actions.searchIndex");
      const newState = {
        ...state,
        searchIndex,
      };
      return newState;
    },
    deviceType: (state, obj) => {
      const deviceType = obj.payload;
      Logger.log("Actions.deviceType");
      const newState = {
        ...state,
        deviceType,
      };
      return newState;
    },
  },
});

export const debugSlice = createSlice({
  name: "debug",
  initialState: {
    debugMode: {
      status: START_IN_DEBUG,
    },
  },
  reducers: {
    toggleDebugMode: (state) => {
      const newState = {
        ...state,
        debugMode: { status: !state.debugMode.status },
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
  chat,
  userGroupMemberships,
  userChatMemberships,
  groupMessages,
  chatMessages,
  groups,
  groupMemberships,
  toUserInvites,
  fromUserInvites,
  groupMembershipRequests,
  searchIndex,
  userMessages,
  userChatMessages,
  clearUserData,
  deviceType,
} = mainSlice.actions;
export const { goToScreen, openModal, closeModal, goToUserScreen, goToScreenAfterLogin } =
  screenSlice.actions;

export const { toggleDebugMode } = debugSlice.actions;

export default configureStore({
  reducer: {
    main: mainSlice.reducer,
    screen: screenSlice.reducer,
    debug: debugSlice.reducer,
  },
  middleware: [],
});
