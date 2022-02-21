import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

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
    locationIds: null,
    locationMap: null,
    groupIds: null,
    groupMap: null,
    groupMemberships: null,
    groupMessages: {},
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
      const newState = {
        ...state,
        userInfo,
      };
      return newState;
    },
    locationDataInit: (state, obj) => {
      const { schools, groups } = obj.payload;

      //groups
      const groupList = [];
      const groupMap = {};
      for (const group of groups) {
        groupList.push(group);
        groupMap[group.id] = group;
      }

      //schools
      const schoolList = [];
      const schoolMap = {};
      for (const school of schools) {
        schoolList.push(school);
        schoolMap[school.id] = school;
      }

      const newState = {
        ...state,
        groupList,
        groupMap,
        schoolList,
        schoolMap,
      };
      return newState;
    },
    groupMemberships: (state, obj) => {
      const groupMemberships = obj.payload;
      const newState = {
        ...state,
        groupMemberships,
      };
      return newState;
    },
    groupMessages: (state, obj) => {
      const { groupId, messages } = obj.payload;
      const groupMessages = { ...state.groupMessages };
      groupMessages[groupId] = messages;

      const newState = {
        ...state,
        groupMessages,
      };
      return newState;
    },
    schoolsUpdated: (state, obj) => {
      const schools = obj.payload;
      const newState = {
        ...state,
      };
      return newState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  appInitialized,
  userInfo,
  locationDataInit,
  schoolsUpdated,
  groupMemberships,
  groupMessages,
} = mainSlice.actions;
export const { goToScreen, goToUserScreen } = screenSlice.actions;

export default configureStore({
  reducer: {
    main: mainSlice.reducer,
    screen: screenSlice.reducer,
  },
  middleware: [],
});
