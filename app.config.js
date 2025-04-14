const config = require("./app.json");

module.exports = ({ config: _config }) => {
  // Get the original expo config from app.json
  const originalConfig = config.expo;

  return {
    ...originalConfig,
    // Add values that should be defined at runtime
    extra: {
      ...originalConfig.extra,
      mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
    },
    // Override plugins to include environment variables
    plugins: [
      "expo-router",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow Map App to use your location to show nearby points of interest.",
        },
      ],
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsVersion: "11.8.0",
          RNMapboxMapsDownloadToken:
            process.env.EXPO_PUBLIC_MAPBOX_SECRET_TOKEN,
        },
      ],
    ],
    android: {
      ...originalConfig.android,
      package: process.env.ANDROID_PACKAGE_NAME || "com.mapapp.example",
    },
  };
};
