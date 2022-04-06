import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Platform,
  ScrollView,
} from "react-native";
import * as Calendar from "expo-calendar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [calendar, setCalendar] = useState(null);
  const [calendars, setCalendars] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        //alert("Here are all your calendars:" + JSON.stringify(calendars));
        setCalendars(calendars);
        //alert("calendar[0]:" + JSON.stringify(calendars[0]));
        //setCalendar(calendars[0]);
      }
    })();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>Calendar Module Example</Text>
        <Button
          disabled={true}
          title="Create a new calendar"
          onPress={createCalendar}
        />
        {calendar != null && (
          <Button
            disabled={calendar == null}
            title={
              "Create event " +
              (calendar?.title ?? "null") +
              "[" +
              (calendar?.source.name ?? "null") +
              "]"
            }
            onPress={() => createEvent(calendar)}
          />
        )}
        {calendar == null && (
          <ScrollView style={{ height: 400 }}>
            {(calendars ?? []).map((calendar) => {
              return (
                <Button
                  disabled={calendar == null}
                  title={
                    "Choose " +
                    (calendar?.title ?? "null") +
                    "[" +
                    (calendar?.source.name ?? "null") +
                    "]"
                  }
                  onPress={() => setCalendar(calendar)}
                />
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Expo Calendar" };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: "Expo Calendar",
    color: "blue",
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: "internalCalendarName",
    ownerAccount: "personal",
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  alert(`Your new calendar ID is: ${newCalendarID}`);
}

async function createEvent(calendar) {
  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Expo Calendar" };

  let dateMs = Date.parse("2022-04-06");
  let startDate = new Date(dateMs);
  let endDate = new Date(dateMs + 2 * 60 * 60 * 1000);

  Calendar.createEventAsync(calendar?.id, {
    title: "ilya test",
    startDate: startDate,
    endDate: endDate,
    timeZone: "America/New_York",
    location: "Ilya's Bedroom",
  })
    .then((x) => {
      console.log("success: " + JSON.stringify(x));
    })
    .catch((err) => alert(JSON.stringify(err)));
  // console.log(`calendar ID is: ${id}`)
}

const styles = StyleSheet.create({ container: {} });
