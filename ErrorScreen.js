import React from "react";
import { Text, View, Button } from "react-native";
import Actions from "./Actions";

function ErrorScreen({ error, resetErrorBoundary }) {
  return (
    <View>
      <Text>ErrorScreen</Text>
      <Text>{error.message}</Text>
      <Text>{error.stack}</Text>
      <Button
        title="Reset error boundary"
        onPress={() => {
          if (resetErrorBoundary) {
            resetErrorBoundary();
          }
        }}
      />
    </View>
  );
}

export default ErrorScreen;
