import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function App() {
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  return (
    <SafeAreaView>
      <DateTimePicker
        display={"inline"}
        mode={"date"}
        value={date}
        onChange={onChange}
      />
      <DateTimePicker
        display={"spinner"}
        mode={"time"}
        value={date}
        onChange={onChange}
      />
    </SafeAreaView>
  );
}
