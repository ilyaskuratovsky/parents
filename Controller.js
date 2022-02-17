import * as Actions from "./Actions";
import { goToScreen, playbookCreated } from "./Actions";
import * as DB from "./Database";

export async function clearAll(dispatch) {
  DB.clearAll();
}

export async function initializeApp(dispatch) {
  dispatch(goToScreen({ screen: "LOADING" }));
  const playbookData = await DB.fetchPlaybooksData();
  const formationsData = await DB.fetchFormationsData();
  dispatch(Actions.playbookData(playbookData));
  dispatch(Actions.formationData(formationsData));
  dispatch(Actions.appInitialized());
}

export async function createPlaybook(dispatch, playbookName) {
  const newPlaybook = await DB.createPlaybook(playbookName);
  dispatch(playbookCreated(newPlaybook));
  return newPlaybook;
}

export async function deletePlaybook(dispatch, playbookId) {
  await DB.deletePlaybook(playbookId);
  dispatch(Actions.playbookDeleted(playbookId));
}

export async function deletePlay(playId, playbookId, dispatch) {
  await DB.deletePlay(playbookId, playId);
  dispatch(Actions.playDeleted({ playId, playbookId }));
}

export async function deleteFormation(
  formationId,
  formationPlaybookId,
  dispatch
) {
  await DB.deleteFormation(formationPlaybookId, formationId);
  dispatch(Actions.formationDeleted({ formationId, formationPlaybookId }));
}

export function getDefaultFormations() {
  return [
    {
      name: "7 v 7",
      section: "5 Players",
      type: "Offense",
      spec: {
        players: [
          { id: "0", x: 12.5, y: 75 },
          { id: "1", x: 25.0, y: 75 },
          { id: "2", x: 37.5, y: 75 },
          { id: "3", x: 50.0, y: 75 },
          { id: "4", x: 62.5, y: 75 },
          { id: "5", x: 75.0, y: 75 },
          { id: "6", x: 87.5, y: 75 },
        ],
        los: [{ id: "los__", y: 71.25, width: 100 }],
        routes: [],
      },
    },
    {
      name: "6 v 6",
      type: "Offense",
      section: "6 Players",
      spec: {
        players: [
          { id: "0", x: 14.28, y: 75 },
          { id: "1", x: 28.57, y: 75 },
          { id: "2", x: 42.86, y: 75 },
          { id: "3", x: 57.14, y: 75 },
          { id: "4", x: 71.43, y: 75 },
          { id: "5", x: 85.71, y: 75 },
        ],
        los: [{ id: "los__", y: 71.25, width: 100 }],
        routes: [],
      },
    },
    {
      name: "5 v 5",
      section: "5 Players",
      type: "Offense",
      spec: {
        players: [
          { id: "1", x: 16.67, y: 75 },
          { id: "2", x: 33.33, y: 75 },
          { id: "3", x: 50, y: 75 },
          { id: "4", x: 66.67, y: 75 },
          { id: "5", x: 83.33, y: 75 },
        ],
        los: [{ id: "los__", y: 71.25, width: 100 }],
        routes: [],
      },
    },
    {
      name: "Blank",
      type: "Offense",
      section: "Blank",
      spec: {
        players: [],
        los: [{ id: "los__", y: 71.25, width: 100 }],
        routes: [],
      },
    },
  ];
}

export async function createPlayInPlaybook(dispatch, playbookId, templatePlay) {
  /*
  const defaultSpec = {
    players: [
      { x: 10, y: 75 },
      { x: 30, y: 75 },
      { x: 70, y: 75 },
      { x: 90, y: 75 },
      { x: 50, y: 82 },
      { x: 50, y: 94 },
    ],
    los: { y: 68, width: 90 },
    routes: [],
  };
  */
  const spec = templatePlay.spec;
  const name = "New Play";
  const { play, playbook } = await DB.createPlayInPlaybook(
    playbookId,
    name,
    spec
  );
  dispatch(Actions.playCreated(play));
  dispatch(Actions.playbookUpdated(playbook));
  return play;
}

/*
export async function createFormationInPlaybook(
  dispatch,
  playbookId,
  newFormation
) {
  const { formation, playbook } = await DB.createFormationInPlaybook(
    playbookId,
    newFormation
  );
  dispatch(Actions.formationCreated(formation));
  dispatch(Actions.playbookUpdated(playbook));
  return play;
}
*/

export async function createFormation(
  dispatch,
  newFormationPlaybookId,
  newFormation
) {
  const { formation, formationPlaybook } = await DB.createFormation(
    newFormationPlaybookId,
    newFormation
  );
  dispatch(Actions.formationCreated(formation));
  dispatch(Actions.formationPlaybookUpdated(formationPlaybook));
  return formation;
}

export function savePlay(play, dispatch) {
  dispatch(Actions.playUpdated(play));
  DB.savePlay(play);
  return play;
}

export function saveFormation(formation, dispatch) {
  dispatch(Actions.formationUpdated(formation));
  DB.saveFormation(formation);
  return formation;
}

export async function savePlaybook(playbook, dispatch) {
  dispatch(Actions.playbookUpdated(playbook));
  await DB.savePlaybook(playbook);
  return playbook;
}

export async function saveFormationPlaybook(formationPlaybook, dispatch) {
  dispatch(Actions.formationPlaybookUpdated(formationPlaybook));
  await DB.savePlaybook(formationPlaybook);
  return formationPlaybook;
}
