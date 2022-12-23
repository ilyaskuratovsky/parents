// @flow strict-local

import { configureStore } from "@reduxjs/toolkit";
import * as Redux from "@reduxjs/toolkit";
import {
  Timestamp,
  //} from "firebase/firestore/lite";
} from "firebase/firestore";
import * as Logger from "./Logger";
import type {
  UserInfo,
  Org,
  Group,
  UserMessage,
  Message,
  UserChatMessage,
  GroupMembership,
  ChatMembership,
  Chat,
  ChatMessage,
  UserInvite,
  GroupMembershipRequest,
} from "./Database";

const START_IN_DEBUG = true;
export const screenSlice: {
  name: string,
  initialState: ScreenState,
  actions: ScreenActions,
  reducer: ScreenReducer,
} = Redux.createSlice({
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
    goToScreen: (state: ScreenState, screen) => {
      Logger.log("Actions.goToScreen: " + JSON.stringify(screen), Logger.INFO);
      const newState = {
        ...state,
        screen: screen.payload,
        postLoginScreen: null,
      };
      return newState;
    },
    openModal: (
      state: ScreenState,
      obj: { payload: { modal: string, animationType?: string } }
    ) => {
      Logger.log("Actions.openModal: " + JSON.stringify(obj), Logger.INFO);
      const { modal, animationType, ...params } = obj.payload;
      const newState = {
        ...state,
        modalStack: [
          ...state.modalStack,
          { modal: modal, animationType: animationType, payload: params },
        ],
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

export type RootState = {
  main: MainState,
  screen: ScreenState,
};

export type ScreenState = {
  screen: ?Screen,
  modalStack: Array<{ modal: string, payload: { ... }, animationType: string }>,
};
export type Screen = { screen: string, postLoginScreen?: ?Screen, ... };
export type MainState = {|
  appInitialized: boolean,
  debugMode: { status: boolean },
  userChatMessagesMap: ?{ [key: string]: UserChatMessage },
  userInfo: ?UserInfo,
  userMap: ?{ [key: string]: UserInfo },
  messagesMap: ?{ [key: string]: Message },
  userList: ?Array<UserInfo>,
  orgsMap: ?{ [key: string]: Org },
  orgsList: ?Array<Org>,
  groupMap: ?{ [key: string]: Group },
  groupList: ?Array<Group>,
  groupMembershipMap: ?{ [key: string]: Array<GroupMembership> },
  userGroupMemberships: ?{ [key: string]: GroupMembership },
  userChatMembershipsList: ?Array<ChatMembership>,
  chatMap: ?{ [key: string]: Chat },
  groupMessagesMap: ?{| [key: string]: { ... } |},
  chatMessagesMap: ?{ [key: string]: ChatMessage },
  pushToken: string,
  toUserInvites: ?Array<UserInvite>,
  groupMembershipRequests: ?Array<GroupMembershipRequest>,
  fromUserInvites: ?Array<UserInvite>,
  // key'd by message id the user's meta data for the message (e.g. read/unread)
  userMessagesMap: ?{ [key: string]: UserMessage },
  userChatMessagesMap: ?{ [key: string]: ChatMessage },
  deviceType: string,
  searchIndex: ?{ ... },
|};

export type DebugState = { ... };

export type MainActions = {
  appInitialized: () => void,
  deviceType: (string) => void,
  groups: (Array<Group>) => void,
  orgsUpdated: (Array<Org>) => void,
  groupMemberships: (Array<GroupMembership>) => void,
  userGroupMemberships: (Array<GroupMembership>) => void,
  groupMembershipRequests: (Array<GroupMembershipRequest>) => void,
  userChatMemberships: (Array<ChatMembership>) => void,
  chat: (Chat) => void,
  userMessages: (Array<UserMessage>) => void,
  userChatMessages: (Array<UserChatMessage>) => void,
  toUserInvites: (Array<UserInvite>) => void,
  fromUserInvites: (Array<UserInvite>) => void,
  [key: string]: ({ ... }) => void,
};
export type MainReducer = { [key: string]: () => void };
export type ScreenActions = {
  openModal: ({ modal: string, animationType?: string, ... }) => void,
  goToScreen: ({ screen: string, ... }) => void,
  closeModal: () => void,
};
export type ScreenReducer = { [key: string]: () => void };
export type DebugActions = { [key: string]: () => void };
export type DebugReducer = { [key: string]: () => void };

export const mainSlice: {
  name: string,
  initialState: MainState,
  actions: MainActions,
  reducer: MainReducer,
} = Redux.createSlice({
  name: "main",
  initialState: {
    appInitialized: false,
    userInfo: null,
    messagesMap: null,
    orgsList: null,
    orgsMap: null,
    // groupIds: null,
    groupList: null,
    groupMap: null,
    groupMembershipMap: null,
    userMap: null,
    userList: null,
    userGroupMemberships: null,
    userChatMembershipsList: null,
    chatMap: null,
    messagesMap: null,
    //
    groupMessagesMap: null,
    chatMessagesMap: null,
    pushToken: null,
    toUserInvites: null,
    groupMembershipRequests: null,
    fromUserInvites: null,
    // key'd by message id the user's meta data for the message (e.g. read/unread)
    userMessagesMap: {},
    userChatMessagesMap: {},
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
      const userList = [];
      const userMap = {};
      for (const user of users) {
        userList.push(user);
        userMap[user.uid] = user;
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
        if (!(groupMembership.groupId in groupMembershipMap)) {
          groupMembershipMap[groupMembership.groupId] = [groupMembership];
        } else {
          groupMembershipMap[groupMembership.groupId]?.push(groupMembership);
        }
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
        userChatMembershipsList: userChatMemberships,
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
      state: MainState,
      obj: { payload: { groupId: string, messages: Array<Message> } }
    ) => {
      const { groupId, messages } = obj.payload;
      const orderedMessages = messages.sort((message1, message2) => {
        return message2.timestamp - message1.timestamp;
      });
      const groupMessages = { ...(state.groupMessagesMap ?? {}) };
      groupMessages[groupId] = orderedMessages;

      const allMessages = { ...(state.messagesMap ?? {}) };
      orderedMessages.forEach((message) => {
        allMessages[message.id] = message;
      });

      const userMessagesMap = { ...(state.userMessagesMap ?? {}) };
      const newState = {
        ...state,
        groupMessagesMap: groupMessages,
        messagesMap: allMessages,
      };
      return newState;
    },
    chatMessages: (state: MainState, obj) => {
      const { chatId, messages } = obj.payload;
      const orderedMessages = messages.sort((message1, message2) => {
        return message2["timestamp"] - message1["timestamp"];
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
    userMessages: (state: MainState, obj) => {
      const userMessages = obj.payload;
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
    userChatMessages: (state: MainState, obj) => {
      const messages = obj.payload;
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
    groups: (state: MainState, obj: { payload: Array<Group> }) => {
      let groups = obj.payload;
      groups = groups.filter((group) => group != null);
      const groupList = [];
      const groupMap = {};
      for (const group of groups) {
        groupList.push(group);
        groupMap[group.id] = group;
      }
      const newState = {
        ...state,
        groupList: groupList,
        groupMap: groupMap,
      };
      return newState;
    },
    groupMemberships: (state, obj) => {
      const groupMemberships = obj.payload;
      const groupMembershipMap = {};
      for (const groupMembership of groupMemberships) {
        const groupId = groupMembership.groupId;
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
      const orgsMap = {};
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
    deviceType: (state: MainState, obj: { payload: string }) => {
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

export const debugSlice: {
  name: string,
  initialState: DebugState,
  actions: DebugActions,
  reducer: DebugReducer,
} = Redux.createSlice({
  name: "debug",
  initialState: {
    debugMode: {
      status: START_IN_DEBUG,
    },
  },
  reducers: {
    toggleDebugMode: (state: MainState) => {
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

export const { goToScreen, openModal, closeModal } = screenSlice.actions;

export const { toggleDebugMode } = debugSlice.actions;

export const store: {
  getState: () => {
    main: MainState,
  },
  reducer: {
    main: MainReducer,
    screen: ScreenReducer,
    debug: DebugReducer,
  },
} = configureStore({
  reducer: {
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
