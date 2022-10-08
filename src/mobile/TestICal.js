// @flow strict-local

import React, { useState } from "react";
import { SafeAreaView, Text, Linking, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ICalendarLink from "react-icalendar-link";

export default function App() {
  const event = {
    title: "My Title",
    description: "My Description",
    startTime: "2018-10-07T10:30:00+10:00",
    endTime: "2018-10-07T12:00:00+10:00",
    location: "10 Carlotta St, Artarmon NSW 2064, Australia",
    attendees: ["Hello World <hello@world.com>", "Hey <hey@test.com>"],
  };
  //<ICalendarLink event={event}>
  //    </ICalendarLink>

  //https://firebasestorage.googleapis.com/v0/b/parents-749dd.appspot.com/o/event.ics?alt=media&token=338deba8-1aa0-415b-a1bb-8126acc479cc
  //links.txl.paperlesspost.com/ls/click?upn=ZWwliz2y7MEoHcVM-2FJBNTckkXP3A016R-2F2E7QP-2FoejK0UWsIqukwXwYirce1a4v7Z85WbmcpDlh6UVFDyhqPuTN-2Bt6GgXgb8FXqkDcMGWS3AZ5BpLC2igEVySPWe1IGfdDLo7D4NwTzGBGQ4fN4lPrDcaomzL5w2B8MrP7RJu9lajZwO-2Bx-2BF6Lsfva6qsuMDLYTaePYYLzC4nhKBONnDgW-2FIN5TXcP5PJ-2B3zt8xHPvCMnAgnam0ye1OLr2BEjzwnPSqRmHOUmQY50o2cEMg-2FpjVNJ8a2Kit64k0JxnL4LKKE1xsLMi6TqxFr9aI-2B7AfqPljBPNe47TuhbkIdnj8mdw-3D-3D0g26_eMvO4jwgUcGTcLLDDn-2BERh1TfyD1Cr1w4skhyNLyZ8eJGs5D6-2FX4QdyIBCVy4UGQirBPqVLAfrO4l5si4gRxT4mp8PIsJDjlvJhkIDGGwotMKXwBEuoRgYRjhQeYe4HT4t40SNm8xyaqmaX0peznPTsrEqnC4cnGhc5okQxFTt72jmUs1dcoILScAe9W8CL9OVhzm4KqZfR-2F9lUot6DouEU2cRXNXPhY4ACXMnwSfWB2kn2iJAXQorQHOJnLwJq5

  http: return (
    <SafeAreaView>
      <Button
        title="cal5"
        onPress={() => {
          //Linking.openURL("ical://www.example.com/calendar/event.ical");
          Linking.openURL(
            //"https://firebasestorage.googleapis.com/v0/b/parents-749dd.appspot.com/o/event.ics?alt=media&token=338deba8-1aa0-415b-a1bb-8126acc479cc"
            //"https://firebasestorage.googleapis.com/v0/b/parents-749dd.appspot.com/o/replies.ics?alt=media&token=212c5fb7-cc07-42c9-b0f1-d04d9a59674a"
            "https://www.paperlesspost.com/events/46652572-d179212f/replies.ics"
          );
        }}
      />
    </SafeAreaView>
  );
}
