//import AsyncStorage from "@react-native-web-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Random from "./Random";

//import AsyncStorage from "@callstack/async-storage"; //works on desktop

export async function fetchPlaybooksList() {
  const playbooksListStr = await AsyncStorage.getItem("playbooks_list");
  const playbooksList =
    playbooksListStr != null ? JSON.parse(playbooksListStr) : [];
  return playbooksList;
}

export async function fetchPlays() {
  const playsListStr = await AsyncStorage.getItem("playbooks_list");
  const playsList = playsListStr != null ? JSON.parse(playsListStr) : [];
  return playsList;
}

export async function fetchPlaybooksData() {
  const playbooksList = await fetchPlaybooksList();
  let playbookMap = {};
  if (playbooksList.length > 0) {
    const playbooksStrArr = await AsyncStorage.multiGet(playbooksList);
    playbookMap = playbooksStrArr.reduce((map, [playbookId, playbookStr]) => {
      const playbook = JSON.parse(playbookStr);
      map[playbookId] = playbook;
      return map;
    }, {});
  }
  let playIds = [];
  for (const playbook of Object.values(playbookMap)) {
    playIds = playIds.concat(playbook.play_list ?? []);
  }

  let playMap = {};
  if (playIds.length > 0) {
    const playsStr = await AsyncStorage.multiGet(playIds);
    playMap = playsStr.reduce((map, [playId, playStr]) => {
      const play = JSON.parse(playStr);
      map[playId] = play;
      return map;
    }, {});
  }

  const result = {
    playbooks: playbookMap,
    playbooks_list: playbooksList,
    plays: playMap,
  };
  return result;
}

export async function fetchFormationsData() {
  const formationsPlaybook = await fetchOrCreateFormationPlaybook("formations");
  let formationPlaybooksMap = { formations: formationsPlaybook };
  let formationIds = [];
  for (const formationPlaybook of Object.values(formationPlaybooksMap)) {
    formationIds = formationIds.concat(formationPlaybook.play_list ?? []);
  }

  let formationMap = {};
  if (formationIds.length > 0) {
    const formationStr = await AsyncStorage.multiGet(formationIds);
    formationMap = formationStr.reduce((map, [formationId, formationStr]) => {
      const formation = JSON.parse(formationStr);
      map[formationId] = formation;
      return map;
    }, {});
  }

  const result = {
    formationPlaybooks: formationPlaybooksMap,
    formations: formationMap,
  };
  return result;
}

export async function fetchPlaybook(playbookId) {
  const playbookStr = await AsyncStorage.getItem(playbookId);
  const playbook = playbookStr != null ? JSON.parse(playbookStr) : null;
  return playbook;
}

export async function fetchOrCreateFormationPlaybook(formationPlaybookId) {
  const formationPlaybookStr = await AsyncStorage.getItem(formationPlaybookId);
  if (formationPlaybookStr != null) {
    const formationPlaybook =
      formationPlaybookStr != null ? JSON.parse(formationPlaybookStr) : null;
    return formationPlaybook;
  } else {
    const newFormationPlaybook = { id: formationPlaybookId };
    await AsyncStorage.setItem(
      formationPlaybookId,
      JSON.stringify(newFormationPlaybook)
    );
    return newFormationPlaybook;
  }
}

export async function createPlaybook(playbookName) {
  const playbookId = "playbook_" + Random.randomId();
  const newPlaybook = {
    id: playbookId,
    name: playbookName,
  };

  await AsyncStorage.setItem(playbookId, JSON.stringify(newPlaybook));
  const playbooksList = await fetchPlaybooksList();
  playbooksList.push(playbookId);
  await AsyncStorage.setItem("playbooks_list", JSON.stringify(playbooksList));
  return newPlaybook;
}

export async function createPlayInPlaybook(playbookId, playName, spec) {
  const playId = "play_" + Random.randomId();
  const newPlay = {
    id: playId,
    name: playName,
    spec: spec,
  };
  //printPlay(newPlay);

  await AsyncStorage.setItem(playId, JSON.stringify(newPlay));

  const playbook = await fetchPlaybook(playbookId);
  const playList = playbook.play_list ?? [];
  playList.push(playId);
  playbook["play_list"] = playList;
  await AsyncStorage.setItem(playbookId, JSON.stringify(playbook));
  return { play: newPlay, playbook: playbook };
}

/*
export async function createFormationInPlaybook(playbookId, formation) {
  const formationId = "formation_" + Random.randomId();
  const newFormation = { ...formation, id: formationId };
  await AsyncStorage.setItem(formationId, JSON.stringify(newFormation));

  const playbook = await fetchPlaybook(playbookId);
  const formationList = playbook.formation_list ?? [];
  formationList.push(formationId);
  playbook["formation_list"] = formationList;
  await AsyncStorage.setItem(playbookId, JSON.stringify(playbook));
  return { formation: newFormation, playbook: playbook };
}
*/

export async function createFormation(formationPlaybookId, formation) {
  const formationId = "formation_" + Random.randomId();
  const newFormation = { ...formation, id: formationId };
  await AsyncStorage.setItem(formationId, JSON.stringify(newFormation));

  const formationPlaybook = await fetchOrCreateFormationPlaybook(
    formationPlaybookId
  );
  const formationList = formationPlaybook.play_list ?? [];
  formationList.push(formationId);
  formationPlaybook["play_list"] = formationList;
  await AsyncStorage.setItem(
    formationPlaybookId,
    JSON.stringify(formationPlaybook)
  );
  return { formation: newFormation, formationPlaybook: formationPlaybook };
}

export async function savePlay(play) {
  //printPlay(play);
  await AsyncStorage.setItem(play.id, JSON.stringify(play));
}

export async function saveFormation(formation) {
  //printPlay(formation);
  await AsyncStorage.setItem(formation.id, JSON.stringify(formation));
}

export async function savePlaybook(playbook) {
  await AsyncStorage.setItem(playbook.id, JSON.stringify(playbook));
}

export async function deletePlaybook(playbookId) {
  const playbooksList = await fetchPlaybooksList();
  const filtered = playbooksList.filter((p) => p != playbookId);
  await AsyncStorage.setItem("playbooks_list", JSON.stringify(filtered));
  await AsyncStorage.removeItem(playbookId);
}

export async function deletePlay(playbookId, playId) {
  const playbooksList = await fetchPlaybooksList();
  const playbook = await fetchPlaybook(playbookId);
  const playList = playbook["play_list"];
  const newPlayList = playList.filter((p) => p != playId);
  playbook["play_list"] = newPlayList;
  await AsyncStorage.setItem(playbookId, JSON.stringify(playbook));
  await AsyncStorage.removeItem(playId);
}

export async function deleteFormation(formationPlaybookId, formationId) {
  const formationPlaybook = await fetchOrCreateFormationPlaybook(
    formationPlaybookId
  );
  const formationList = formationPlaybook["play_list"];
  const newFormationList = formationList.filter((p) => p != formationId);
  formationPlaybook["play_list"] = newFormationList;
  await AsyncStorage.setItem(
    formationPlaybookId,
    JSON.stringify(formationPlaybook)
  );
  await AsyncStorage.removeItem(formationId);
}

export async function clearAll() {
  const allKeys = await AsyncStorage.getAllKeys();
  for (const key of allKeys) {
    AsyncStorage.removeItem(key);
  }
}
