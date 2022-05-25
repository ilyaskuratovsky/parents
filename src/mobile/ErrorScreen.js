import React from "react";
import { Text, View, Button, SafeAreaView } from "react-native";

function ErrorScreen({ error, resetErrorBoundary }) {
  return (
    <SafeAreaView>
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
    </SafeAreaView>
  );
}

export default ErrorScreen;
