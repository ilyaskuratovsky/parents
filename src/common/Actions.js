// @flow

import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  Timestamp,
  //} from "firebase/firestore/lite";
} from "firebase/firestore";
import * as Logger from "./Logger";
import * as MessageUtils from "./MessageUtils";
import { RemoteData, loading, data } from "./RemoteData";

/*
export type Org = Record<string, Object>;
export type Group = Record<string, Object>;
export type GroupMembership = Record<string, Object>;
export type UserInfo = Record<string, Object>;
export type UserMessage = Record<string, Object>;
export type MessageRecord = Record<string, Object>;
*/

const START_IN_DEBUG = true;
export const screenSlice = createSlice({
  name: "screen",
  initialState: {
    screen: {
      screen: null,
    },
    modalStack: [],
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
    openModal: (state, modal: { payload: string }) => {
      const newState = {
        ...state,
        modalStack: [...state.modalStack, modal.payload],
      };
      return newState;
    },
    closeModal: (state, modal) => {
      Logger.log("Actions.closeModal: " + JSON.stringify(modal));
      const newModalStack = [...state.modalStack];
      newModalStack.pop();

      const newState = {
        ...state,
        modalStack: [...state.modalStack].slice(0, state.modalStack.length - 1),
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
    appInitialized: false,
    userInfo: null as UserInfo | null,
    orgsList: null as Array<Record<string, Object>> | null,
    orgsMap: null as Record<string, Org> | null,
    // groupIds: null,
    groupList: null as Array<Group> | null,
    groupMap: null as Record<string, Group> | null,
    groupMembershipMap: null as Record<string, Array<GroupMembership>> | null,
    userMap: null as Record<string, Record<string, Object>> | null,
    userList: null as Array<Record<string, Object>> | null,
    userGroupMemberships: null as Array<GroupMembership> | null,
    userChatMemberships: null as Array<Record<string, Object>> | null,
    chatMap: null as Record<string, Object> | null,
    messagesMap: null as Record<string, Record<string, Object>> | null,
    //
    groupMessagesMap: null as Record<string, Array<Record<string, Object>>> | null,
    chatMessagesMap: null as Record<string, Object> | null,
    pushToken: null,
    toUserInvites: null,
    groupMembershipRequests: null,
    fromUserInvites: null,
    // key'd by message id the user's meta data for the message (e.g. read/unread)
    userMessagesMap: {} as Record<string, UserMessage>,
    userChatMessagesMap: {} as Record<string, any>,
    unreadMessages: [],
    deviceType: null,
  },
  reducers: {
    appInitialized: (state) => {
      Logger.log("Actions.appInitialized");
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
      const userList: Array<Record<string, Object>> = [];
      const userMap = {} as Record<string, Record<string, Object>>;
      for (const user of users) {
        userList.push(user);
        userMap[user.id] = user;
      }

      //groups
      const groupList = [] as Array<Record<string, Group>>;
      const groupMap = {} as Record<string, Group>;
      for (const group of groups) {
        groupList.push(group);
        groupMap[group.id] = group;
      }

      //groupMemberships
      const groupMembershipMap = {} as Record<string, Array<GroupMembership>>;
      for (const groupMembership of groupMemberships) {
        if (!(groupMembership.groupId in groupMembershipMap)) {
          groupMembershipMap[groupMembership.groupId] = [groupMembership];
        } else {
          groupMembershipMap[groupMembership.groupId]?.push(groupMembership);
        }
      }

      //orgs
      const orgsList = [] as Array<Record<string, Object>>;
      const orgsMap = {} as Record<string, Record<string, Object>>;
      for (const org of orgs) {
        orgsList.push(org);
        orgsMap[org.id] = org;
      }

      const newState = {
        ...state,
        userList: userList,
        userMap: userMap,
        groupList: groupList,
        groupMap: groupMap,
        orgsList: orgsList,
        orgsMap: orgsMap,
        groupMembershipMap: groupMembershipMap,
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
    groupMessages: (
      state,
      obj: {
        payload: { groupId: string; messages: Array<Record<string, Object>> } 
      }
    ) => {
      const { groupId, messages } = obj.payload;
      const orderedMessages = messages.sort((message1, message2) => {
        return message2.timestamp as number - (message1.timestamp as number); 
      });
      const groupMessages = { ...state.groupMessagesMap };
      groupMessages[groupId] = orderedMessages;

      const allMessages = { ...state.messagesMap };
      orderedMessages.forEach((message) => {
        allMessages[message.id as string] = message;
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
      const { chatId, messages }: { chatId: string; messages: Array<Record<string, Object>> } =
        obj.payload;
      const orderedMessages = messages.sort((message1, message2) => {
        return (message2["timestamp"] as number) - (message1["timestamp"] as number);
      });
      const chatMessagesMap = { ...(state.chatMessagesMap ?? {}) };
      chatMessagesMap[chatId] = orderedMessages;

      const newState = {
        ...state,
        chatMessagesMap,
      };
      return newState;
    },

    //THE user's meta data on a message (e.g. read/unread etc.)
    userMessages: (state, obj) => {
      const userMessages = obj.payload as Array<Record<string, any>>;
      const userMessagesMap = { ...(state.userMessagesMap ?? {}) };

      for (const userMessage of userMessages) {
        userMessagesMap[userMessage.id] = userMessage;
      }

      return {
        ...state,
        userMessagesMap: userMessagesMap,
      };
    },

    //User meta data on chat messages (e.g. read/unread)
    userChatMessages: (state, obj: {payload: Array<Record<string, Object>>}) => {
      const messages = obj.payload;
      const userChatMessagesMap = { ...state.userChatMessagesMap };
      for (const message of messages) {
        userChatMessagesMap[message.id as string] = message;
      }

      return {
        ...state,
        userChatMessagesMap,
        //rootUserMessages,
      };
    },
    groups: (state, obj: {payload: Array<Record<string, Object>>}) => {
      let groups = obj.payload;
      groups = groups.filter((group) => group != null);
      const groupList = [] as Array<Group>;
      const groupMap = {} as Record<string, Group>;
      for (const group of groups) {
        groupList.push(group);
        groupMap[group.id as string] = group;
      }
      const newState = {
        ...state,
        groupList: groupList,
        groupMap: groupMap,
      };
      return newState;
    },
    groupMemberships: (state, obj : {payload: Array<Record<string, Object>>}) => {
      const groupMemberships = obj.payload;
      const groupMembershipMap = {} as Record<string, Array<Record<string, Object>>>;
      for (const groupMembership of groupMemberships) {
         const groupId = groupMembership.groupId as string;
        if (!(groupId in groupMembershipMap)) {
          groupMembershipMap[groupId] = [groupMembership];
        } else {
          groupMembershipMap[groupId].push(groupMembership);

        }
      }
      const newState = {
        ...state,
        groupMembershipMap: groupMembershipMap,
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
      const orgsMap = {} as Record<string, Record<string, Object>>;
      for (const org of orgs) {
        orgsList.push(org);
        orgsMap[org.id] = org;
      }

      const newState = {
        ...state,
        orgsList: orgsList,
        orgsMap: orgsMap,
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
export const { goToScreen, openModal, closeModal, goToUserScreen } = screenSlice.actions;

export const { toggleDebugMode } = debugSlice.actions;

export const store = configureStore({
  reducer: Reducer<>: {
    main: mainSlice.reducer,
    screen: screenSlice.reducer,
    debug: debugSlice.reducer,
  },
  middleware: [],
});

/*
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
*/