import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, Divider } from "react-native-elements";
import TimeAgo from "react-timeago";

import moment from "moment";
const MessageTime = ({ timestamp, textStyle }) => {
  const messageTime = moment(timestamp);

  const [now, setNow] = useState(moment(new Date()));

  const diffInSeconds = now.diff(messageTime, "seconds");

  let text = "";
  if (diffInSeconds < 60) {
    text = "Just now";
  } else if (diffInSeconds < 60 * 60) {
    text = Math.round(diffInSeconds / 60) + "m";
  } else if (diffInSeconds < 60 * 60 * 24) {
    text = Math.round(diffInSeconds / (60 * 60)) + "h";
  } else {
    text = messageTime.format("lll");
  }
  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment(new Date());
      setNow(now);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <Text style={textStyle}>{text}</Text>;
};
export default React.memo(MessageTime);
