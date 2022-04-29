/* given a single root message, built it with children */
export function buildMessageWithChildren(
  messageId,
  messages,
  userInfo,
  userMessagesMap,
  groupMembers,
  userMap
) {
  let rootMessage = { children: [] };
  for (const m of messages) {
    if (m.papaId == messageId) {
      rootMessage.children.push(m);
    } else if (m.id == messageId) {
      rootMessage = { ...m, ...rootMessage };
    }
  }
  let rootMessageWithStatus = addMeta(rootMessage, userInfo, userMessagesMap, userMap);
  if (rootMessage.event != null) {
    rootMessageWithStatus = addEventData(rootMessage, userInfo, groupMembers);
  }
  return rootMessageWithStatus;
}

/* builds the entire collection of root message for all the messages of a group*/
export function buildRootMessagesWithChildren(
  messages,
  userInfo,
  userMessagesMap,
  groupMembers,
  userMap
) {
  const messageMap = messages.reduce(function (acc, message) {
    acc[message.id] = { ...message };
    return acc;
  }, {});

  for (const m of Object.values(messageMap)) {
    if (m.papaId != null) {
      const papaMessage = messageMap[m.papaId];
      if (papaMessage.children == null) {
        papaMessage["children"] = [];
      }
      papaMessage.children.push(m);
    }
  }

  const rootMessages = Object.values(messageMap).filter((m) => m.papaId == null);
  const messagesWithStatus = rootMessages.map((rootMessage) => {
    let rootMessageWithStatus = addMeta(rootMessage, userInfo, userMessagesMap, userMap);
    if (rootMessage.event != null) {
      rootMessageWithStatus = addEventData(rootMessageWithStatus, userInfo, groupMembers);
    }
    return { ...rootMessage, ...rootMessageWithStatus };
  });
  return messagesWithStatus;
}

export function calculateUnreadMessages(groupMessagesMap, userMessagesMap) {
  let unreadMessages = 0;
  for (const groupId of Object.keys(groupMessagesMap)) {
    const groupMessages = groupMessagesMap[groupId];
    for (const message of groupMessages) {
      const userMessage = userMessagesMap[message.id];
      if (userMessage == null || userMessage.status != "read") {
        unreadMessages += 1;
      }
    }
  }
  return unreadMessages;
}

export function addMeta(rootMessage, userInfo, userMessagesMap, userMap) {
  /* status */
  let status = null;
  if (userInfo.uid !== rootMessage.uid) {
    status = userMessagesMap[rootMessage.id]?.status;
  } else {
    status = "read";
  }

  /* user */
  const user = userMap[rootMessage.uid];

  /* unread child count */
  const unreadChildCount = (rootMessage.children ?? []).filter((c) => {
    if (c.uid === userInfo.uid) {
      return false;
    }
    const status = userMessagesMap[c.id]?.status != "read";
    return status;
  }).length;

  /* add meta to children */
  const children = [];
  for (const childMessage of rootMessage.children ?? []) {
    let childStatus = null;
    if (childMessage.uid !== userInfo.uid) {
      childStatus = userMessagesMap[childMessage.id];
    } else {
      childStatus = "read";
    }
    const childMessageUser = userMap[childMessage.uid];
    children.push({ ...childMessage, status: childStatus, user: childMessageUser });
  }

  /* timestamp */
  const lastUpdated = Math.max(
    rootMessage.timestamp,
    Math.max.apply(
      Math,
      (rootMessage.children ?? []).map((m) => m.timestamp)
    )
  );

  return { ...rootMessage, status, unreadChildCount, lastUpdated, children, user };
}

export function addEventData(rootMessage, userInfo, userMessagesMap, groupMembers) {
  const eventWithUserStatus = { ...rootMessage.event };
  for (const childMessage of rootMessage.children ?? []) {
    const childEvent = childMessage.event;
    if (childEvent != null) {
      const childStatus = childEvent.status;
      const userStatus = { ...eventWithUserStatus.users };
      userStatus[childMessage.uid] = { status: childStatus };
      const summary = { ...eventWithUserStatus.summary };
      const statusCount = summary[childStatus] ?? 0;
      summary[childStatus] = statusCount + 1;
      eventWithUserStatus["users"] = userStatus;
      eventWithUserStatus["summary"] = summary;
    }
  }

  return { ...rootMessage, event: eventWithUserStatus };
}
