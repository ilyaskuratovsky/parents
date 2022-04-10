export function buildMessageWithChildren(
  messageId,
  messages,
  userInfo,
  userMessagesMap,
  groupMembers
) {
  let rootMessage = { children: [] };
  for (const m of messages) {
    if (m.papaId == messageId) {
      rootMessage.children.push(m);
    } else if (m.id == messageId) {
      rootMessage = { ...m, ...rootMessage };
    }
  }
  let rootMessageWithStatus = addMeta(rootMessage, userInfo, userMessagesMap);
  if (rootMessage.event != null) {
    rootMessageWithStatus = addEventData(rootMessage, userInfo, groupMembers);
  }
  return rootMessageWithStatus;
}

export function buildRootMessagesWithChildren(messages, userInfo, userMessagesMap, groupMembers) {
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
    let rootMessageWithStatus = addMeta(rootMessage, userInfo, userMessagesMap);
    if (rootMessage.event != null) {
      rootMessageWithStatus = addEventData(rootMessage, userInfo, groupMembers);
    }
    return rootMessageWithStatus;
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

export function addMeta(rootMessage, userInfo, userMessagesMap) {
  /* status */
  let status = null;
  if (userInfo.uid !== rootMessage.uid) {
    status = userMessagesMap[rootMessage.id]?.status;
  } else {
    status = "read";
  }

  const unreadChildCount = (rootMessage.children ?? []).filter((c) => {
    if (c.uid === userInfo.uid) {
      return false;
    }
    const status = userMessagesMap[c.id]?.status != "read";
    return status;
  }).length;

  const children = [];
  for (const childMessage of rootMessage.children ?? []) {
    let childStatus = null;
    if (childMessage.uid !== userInfo.uid) {
      childStatus = userMessagesMap[childMessage.id];
    } else {
      childStatus = "read";
    }
    children.push({ ...childMessage, status: childStatus });
  }

  /* timestamp */
  const lastUpdated = Math.max(
    rootMessage.timestamp,
    Math.max.apply(
      Math,
      (rootMessage.children ?? []).map((m) => m.timestamp)
    )
  );

  return { ...rootMessage, status, unreadChildCount, lastUpdated, children };
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
