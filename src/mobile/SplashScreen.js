// @flow strict-local

import React, { useEffect, useRef } from "react";
import { Image, SafeAreaView, Text } from "react-native";
import { useSelector } from "react-redux";

function SplashScreen({ appInitializedCallback, refresh }) {
  const readyRef = useRef(false);
  const appInitialized = useSelector((state) => {
    return state.main.appInitialized;
  });

  if (appInitialized) {
    readyRef.current = true;
  }

  useEffect(() => {
    let id = setInterval(() => {
      if (readyRef.current) {
        appInitializedCallback();
      }
    }, refresh);
    return () => clearInterval(id);
  }, []);

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text>Parents</Text>
    </SafeAreaView>
  );
}

export default SplashScreen;
