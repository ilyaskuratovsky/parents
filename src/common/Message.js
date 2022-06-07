import * as Logger from "./Logger";
import * as Dates from "./Date";

export function getEventUserResponsesByStatus(rootMessage, status) {
  const event = rootMessage.event;
  const responseByStatus = event.responses.filter((response) => response.status == status);
  const users = responseByStatus.map((response) => response.user);
  return users;
}
