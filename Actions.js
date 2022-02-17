import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export const screenSlice = createSlice({
  name: "screen",
  initialState: {
    screen: {
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
  },
});

export const mainSlice = createSlice({
  name: "main",
  initialState: {
    appInitialized: false,
    playbooks: {},
    playbooks_list: [],
    plays: {},
    formations: {},
    formationPlaybooks: { formations: {} },
  },
  reducers: {
    appInitialized: (state, obj) => {
      const newState = {
        ...state,
        appInitialized: true,
      };
      return newState;
    },
    playbookData: (state, obj) => {
      const playbookData = obj.payload;
      const newState = {
        ...state,
        ...playbookData,
      };
      return newState;
    },
    formationData: (state, obj) => {
      const formationsData = obj.payload;
      const newState = {
        ...state,
        ...formationsData,
      };
      return newState;
    },
    playbookCreated: (state, obj) => {
      const playbook = obj.payload;
      const playbookId = playbook.id;
      const newState = {
        ...state,
        playbooks: { ...state.playbooks, [playbookId]: playbook },
        playbooks_list: [...state.playbooks_list, playbookId],
      };
      return newState;
    },
    playbookUpdated: (state, obj) => {
      const playbook = obj.payload;
      const playbookId = playbook.id;
      const newState = {
        ...state,
        playbooks: { ...state.playbooks, [playbookId]: playbook },
      };
      return newState;
    },
    formationPlaybookUpdated: (state, obj) => {
      const formationPlaybook = obj.payload;
      const formationPlaybookId = formationPlaybook.id;
      const newState = {
        ...state,
        formationPlaybooks: {
          ...state.formationPlaybooks,
          [formationPlaybookId]: formationPlaybook,
        },
      };
      return newState;
    },
    playUpdated: (state, obj) => {
      const play = obj.payload;
      const playId = play.id;
      const newState = {
        ...state,
        plays: { ...state.plays, [playId]: play },
      };
      return newState;
    },
    formationUpdated: (state, obj) => {
      const formation = obj.payload;
      const formationId = formation.id;
      const newState = {
        ...state,
        formations: { ...state.formations, [formationId]: formation },
      };
      return newState;
    },
    playDeleted: (state, obj) => {
      const { playbookId, playId } = obj.payload;
      const newPlaybook = { ...state.playbooks[playbookId] };
      const playList = newPlaybook.play_list.filter((p) => p != playId);
      newPlaybook.play_list = playList;
      const newState = {
        ...state,
        playbooks: { ...state.playbooks, [playbookId]: newPlaybook },
      };
      return newState;
    },
    formationDeleted: (state, obj) => {
      const { formationPlaybookId, formationId } = obj.payload;
      const newFormationPlaybook = {
        ...state.formationPlaybooks[formationPlaybookId],
      };
      const formationList = newFormationPlaybook.play_list.filter(
        (p) => p != formationId
      );
      newFormationPlaybook.play_list = formationList;
      const newState = {
        ...state,
        formationPlaybooks: {
          ...state.formationPlaybooks,
          [formationPlaybookId]: newFormationPlaybook,
        },
      };
      return newState;
    },
    playbookDeleted: (state, obj) => {
      const playbookId = obj.payload;
      const playbooksList = state.playbooks_list.filter(
        (id) => id != playbookId
      );
      const newState = {
        ...state,
        playbooks: { ...state.playbooks, [playbookId]: null },
        playbooks_list: playbooksList,
      };
      return newState;
    },
    playCreated: (state, obj) => {
      const play = obj.payload;
      const newState = {
        ...state,
        plays: { ...state.plays, [play.id]: play },
      };
      return newState;
    },
    formationCreated: (state, obj) => {
      const formation = obj.payload;
      const newState = {
        ...state,
        formations: { ...state.formations, [formation.id]: formation },
      };
      return newState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  appInitialized,
  playCreated,
  playbookCreated,
  playbookData,
  formationData,
  playbookUpdated,
  formationPlaybookUpdated,
  playbookDeleted,
  playUpdated,
  formationUpdated,
  playDeleted,
  formationDeleted,
  formationCreated,
} = mainSlice.actions;
export const { goToScreen } = screenSlice.actions;

export default configureStore({
  reducer: {
    main: mainSlice.reducer,
    screen: screenSlice.reducer,
  },
  middleware: [],
});
