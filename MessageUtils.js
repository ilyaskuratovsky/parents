export function buildMessageWithChildren(messageId, messages, userMessagesMap) {
  let rootMessage = { children: [] };
  for (const m of messages) {
    if (m.papaId == messageId) {
      rootMessage.children.push(m);
    } else if (m.id == messageId) {
      rootMessage = { ...m, ...rootMessage };
    }
  }
  const rootMessageWithStatus = addStatus(rootMessage, userMessagesMap);
  return rootMessageWithStatus;
}

export function buildRootMessagesWithChildren(messages, userMessagesMap) {
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
  const messagesWithStatus = rootMessages.map((message) => addStatus(message, userMessagesMap));
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

export function addStatus(rootMessage, userMessagesMap) {
  const status = userMessagesMap[rootMessage.id]?.status;
  const unreadChildCount = (rootMessage.children ?? []).filter((c) => {
    const status = userMessagesMap[c.id]?.status != "read";
    return status;
  }).length;
  const children = [];
  for (const childMessage of rootMessage.children ?? []) {
    const childStatus = userMessagesMap[childMessage.id];
    children.push({ ...childMessage, status: childStatus });
  }
  return { ...rootMessage, status, unreadChildCount, children };
}
