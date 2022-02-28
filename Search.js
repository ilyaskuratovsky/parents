import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Platform } from "react-native";
import * as Actions from "./Actions";
import { auth } from "./config/firebase";
import * as Database from "./Database";
import store from "./Actions";

export function buildSearchIndex(orgsMap, groupsMap) {
  const searchWordIndex = {};
  for (const orgId of Object.keys(orgsMap)) {
    const org = orgsMap[orgId];
    const words = splitIntoWords(org.name);
    for (const word of words) {
      addIntoMap(searchWordIndex, word, { type: "org", entity: org.id });
    }
  }

  for (const groupId of Object.keys(groupsMap)) {
    const group = groupsMap[groupId];
    const org = orgsMap[groupId.orgId];
    const groupWords = splitIntoWords(group.name);
    const orgWords = org != null ? splitIntoWords(org.name) : [];
    const words = groupWords.concat(orgWords);
    for (const word of words) {
      addIntoMap(searchWordIndex, word, { type: "group", entity: group.id });
    }
  }

  const searchTree = { subTree: {} };
  for (let [x, entities] of Object.entries(searchWordIndex)) {
    let parent = searchTree;
    for (let y of x) {
      let subTree = parent["subTree"][y];
      if (subTree == null) {
        subTree = { y, entities: [...entities], subTree: {} };
        parent["subTree"][y] = subTree;
      } else {
        subTree["entities"] = subTree["entities"].concat(entities);
      }
      parent = subTree;
    }
  }
  return searchTree;
  //consecutive word matches count for the most
}

function splitIntoWords(str) {
  const split = [];
  let current = null;
  for (const c of str) {
    if (isAlphaNumericCharacter(c)) {
      current = current == null ? c : current + c;
    } else {
      if (current != null) {
        split.push(current);
        current = null;
      }
    }
  }
  if (current != null) {
    split.push(current);
  }
  return split;
}

function isAlphaNumericCharacter(str) {
  const code = str.charCodeAt(0);
  if (
    !(code > 47 && code < 58) && // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123)
  ) {
    // lower alpha (a-z)
    return false;
  } else {
    return true;
  }
}

function addIntoMap(map, key, val) {
  if (!(key in map)) {
    map[key] = [];
  }
  map[key].push(val);
}
