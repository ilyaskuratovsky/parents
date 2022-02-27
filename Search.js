import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Platform } from "react-native";
import * as Actions from "./Actions";
import { auth } from "./config/firebase";
import * as Database from "./Database";
import store from "./Actions";

async function buildSearchIndex(orgsMap, groupsMap) {
  const searchWordIndex = {};
  for (const orgId of Object.keys(orgsList)) {
    const org = orgsMap[orgId];
    const words = splitIntoWords(org.name);
    for (const word of words) {
      addIntoMap(orgSearchWordIndex, word, { type: "org", entity: org });
    }
  }

  for (const groupId of Object.keys(groupsMap)) {
    const group = groupsMap[groupId];
    const org = orgsMap[groupId.orgId];
    const groupWords = splitIntoWords(group.name);
    const orgWords = splitintoWords(org.name);
    const words = groupWords.concat(orgWords);
    for (const word of words) {
      addIntoMap(searchWordIndex, word, { type: "group", entity: group });
    }
  }

  const searchTree = {};
  for (const word of Object.keys(searchWordIndex)) {
    const entity = searchWordIndex[word];
    const current = searchTree;
    for (let i = 0; i < word.length; i++) {
      const subTree = searchTree[word[i]];
      if (subTree == null) {
        searchTree[word[i]] = {};
      }
      current = searchTree[word[i]];
    }
    addIntoMap(current, "__terminal__", entity);
  }
  //consecutive word matches count for the most
}

function addIntoMap(map, key, val) {
  if (!(key in map)) {
    map[key] = [];
  }
  map[key].push(val);
}
