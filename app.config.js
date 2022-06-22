export default {
  app_id: "greenwich_parents",
  ios: {
    bundleIdentifier: "com.ilyaskuratovsky.greenwich-parents2",
  },
  expo: {
    name: "greenwich-parents2",
    slug: "greenwich-parents2",
    version: "1.1.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends.",
        },
      ],
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.skuratovsky.greenwichparents2",
      buildNumber: "70",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
