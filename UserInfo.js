export function chatDisplayName(userInfo) {
  if (userInfo.displayName != null) {
    return displayName;
  }

  return userInfo.email.split("@")[0];
}

export function avatarColor(userInfo) {
  var hash = 0;
  for (var i = 0; i < userInfo.email.length; i++) {
    hash = userInfo.email.charCodeAt(i) + ((hash << 5) - hash);
  }

  var h = hash % 360;
  return "hsl(" + h + ", " + "50" + "%, " + "65" + "%)";
}
