import React from "react";
import { Button, SafeAreaView, Text } from "react-native";

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
