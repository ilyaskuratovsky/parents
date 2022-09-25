import * as Logger from "./Logger";
import * as Dates from "./Date";

export function getEventUserResponsesByStatus(rootMessage, status) {}

export class RootMessage {
  constructor(message) {
    this.message = message;
    this.id = message.id;
    this.groupId = message.groupId;
  }

  getPollResponses() {
    if (this.message.poll == null) {
      return null;
    }

    const result = {};
    for (const child of this.message.children) {
      if (child.poll_response != null) {
        const poll_responses = Array.isArray(child.poll_response)
          ? child.poll_response
          : [child.poll_response];
        /*
        for (const response of poll_responses) {
          const optionName = child.poll_response.option.name;
          const value = child.poll_response.response;
          result[optionName] = value;
        }
        */
      }
    }
    return result;
  }

  getPoll() {
    return this.message.poll;
  }
}
