export function buildSearchIndex(orgsMap, groupsMap) {
  const searchWordIndex = {};
  for (const orgId of Object.keys(orgsMap)) {
    const org = orgsMap[orgId];
    const orgName = org.name;
    if (orgName != null) {
      const words = splitIntoWords(org.name);
      for (const word of words) {
        addIntoMap(searchWordIndex, word, { type: "org", entity: org.id });
      }
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
        split.push(current.toUpperCase());
        current = null;
      }
    }
  }
  if (current != null) {
    split.push(current.toUpperCase());
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

export function search(index, text) {
  const words = splitIntoWords(text);
  let results = [];
  for (let word of words) {
    const wordResults = findInIndex(index, word);
    results = results.concat(wordResults);
  }

  const entityMap = {};
  for (const entity of results) {
    entityMap[entity.entity] = entity;
  }

  const occurrences = results.reduce(function (acc, result) {
    return acc[result.entity] ? ++acc[result.entity] : (acc[result.entity] = 1), acc;
  }, {});

  let maxCountResults = [];
  let maxCount = 0;
  for (let [entityId, count] of Object.entries(occurrences)) {
    if (count == maxCount) {
      maxCountResults.push(entityId);
    } else if (count > maxCount) {
      maxCount = count;
      maxCountResults = [entityId];
    }
  }

  return maxCountResults.map((entityId) => entityMap[entityId]);
}

export function findInIndex(index, word) {
  let current = index;
  for (let ch of word) {
    current = current.subTree[ch];
  }

  if (current != null) {
    return current.entities;
  }
}
