import * as Calendar from "expo-calendar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment-timezone";

import {
  Alert,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CommentView from "./CommentView";
import * as Controller from "../common/Controller";
import * as MessageUtils from "../common/MessageUtils";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import * as Globals from "./Globals";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";

export default function BookCalendarEventModal({
  title,
  startDate,
  endDate,
  timezone,
  onComplete,
  visible,
  onDismiss,
}) {
  const [calendars, setCalendars] = useState(null);

  useEffect(async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      setCalendars(calendars);
    }
  });

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal
        backgroundColor={UIConstants.DEFAULT_BACKGROUND}
        //backgroundColor="green"
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
            {Globals.dev && (
              <Text>
                title: {title}, startDate: {moment(startDate).format()}, endDate:{" "}
                {moment(endDate).format()}
              </Text>
            )}
            <ScrollView style={{ height: 200, backgroundColor: "cyan" }}>
              {(calendars ?? [])
                .sort((c1, c2) => c1.source.name.localeCompare(c2.source.name))
                .filter((calendar) => calendar.allowsModifications)
                .map((calendar) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        createEvent(calendar, title, startDate, endDate)
                          .then((eventId) => {
                            Alert.alert("Done", null, [
                              {
                                text: "OK",
                                onPress: async () => {
                                  onComplete();
                                },
                              },
                            ]);
                          })
                          .catch((error) => {
                            Alert.alert("caught error: " + JSON.stringify(error));
                          });
                      }}
                    >
                      <Text style={{ fontSize: 8, fontWeight: "bold" }}>
                        {(calendar?.title ?? "null") +
                          "[" +
                          (calendar?.source.name ?? "null") +
                          "]"}
                      </Text>
                      <Text style={{ fontSize: 8 }}>{JSON.stringify(calendar)}</Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            <Button title="Cancel" onPress={() => onDismiss()} />
          </SafeAreaView>
        </View>
      </Portal>
    </Modal>
  );
}

async function createEvent(calendar, title, startDate, endDate) {
  let dateMs = Date.parse("2022-04-11");

  Calendar.createEventAsync(calendar?.id, {
    //title: "ilya test 3",
    title: title,
    startDate: startDate,
    endDate: endDate,
    //timeZone: "America/New_York",
    //timeZone: timeZone,
    location: "",
  })
    .then((eventId) => {
      return eventId;
    })
    .catch((error) => {
      Alert.alert("got error booking in calnar: " + JSON.stringify(error));
    });
  // console.log(`calendar ID is: ${id}`)
}
