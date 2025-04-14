# Mapbox Integration Setup

This guide explains how to properly set up and build the app with Mapbox support.

## Important Note

The Mapbox integration **cannot** work in the regular Expo Go app because Mapbox requires custom native code. According to the [official Mapbox plugin documentation](https://github.com/rnmapbox/maps/blob/main/plugin/install.md):

> This plugin uses custom native code that cannot run in the Expo Go app. You must use a development build or EAS Build to create a native binary.

## Setup Instructions

To use Mapbox in your Expo project, you need to create a development build. Here's how to do it:

1. Make sure you have installed the required packages:

   ```bash
   npx expo install @rnmapbox/maps expo-location
   ```

2. Create a `.env` file in the root of your project (copy from `.env.example`):

   ```
   EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```

3. Create a development build for your device:
   ```bash
   npx expo prebuild
   npx expo run:ios  # For iOS
   # OR
   npx expo run:android  # For Android
   ```

## Token Configuration

Your Mapbox token is configured in the following places:

1. In your `.env` file as `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`
2. In the `app.json` under `"extra": { "mapboxAccessToken": "your_token_here" }`
3. For Android builds, also in `android/gradle.properties` as `MAPBOX_DOWNLOADS_TOKEN`

## Additional Resources

- [Mapbox React Native Maps Documentation](https://github.com/rnmapbox/maps)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
