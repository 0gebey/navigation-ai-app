# Mapbox Integration Setup

This guide explains how to properly set up and build the app with Mapbox support.

## Important Note

The Mapbox integration **cannot** work in the regular Expo Go app because Mapbox requires custom native code. According to the [official Mapbox plugin documentation](https://github.com/rnmapbox/maps/blob/main/plugin/install.md):

> ⚠️ This package cannot be used in the "Expo Go" app because it requires custom native code.

## Setting Up Development Build

To use Mapbox in your Expo project, you need to create a development build. Here's how to do it:

### 1. Install Required Packages

Make sure you have the following packages installed:

```bash
npx expo install @rnmapbox/maps expo-location
```

### 2. Configure app.json

The `app.json` file has already been configured with:

- The Mapbox plugin configuration
- A download token with the necessary permissions
- The access token in the extras section

### 3. Create a Development Build

Create a development build using EAS Build:

```bash
# Install EAS CLI if you haven't already
npm install -g eas-cli

# Log in to your Expo account
eas login

# Configure EAS Build (if not already configured)
eas build:configure

# Create a development build for iOS
eas build --profile development --platform ios

# Create a development build for Android
eas build --profile development --platform android
```

### 4. Install the Development Build

- For iOS: You'll receive a link to download the app or it will be installed directly in your simulator
- For Android: You'll receive a link to download the APK or AAB file

### 5. Run the App Locally

Once you have installed the development build, you can run the app locally:

```bash
npx expo start --dev-client
```

## Testing Mapbox Features

After setting up your development build:

1. Open the app
2. Go to the Settings tab
3. Find and tap the "Mapbox Integration Demo" option
4. The Mapbox demo screen will show your current location with directions to points of interest

## Troubleshooting

- If you see warnings about Mapbox token not being configured, check that you have properly set up your access token in `app.json`
- If the map doesn't load, make sure you're using a development build and not Expo Go
- For iOS issues, check that you have the correct permissions in your Info.plist (handled automatically by Expo's configuration)
- For Android issues, verify permissions are properly set up

## Useful Resources

- [Mapbox Plugin Installation Guide](https://github.com/rnmapbox/maps/blob/main/plugin/install.md)
- [Mapbox React Native Documentation](https://github.com/rnmapbox/maps)
- [Expo Development Builds Guide](https://docs.expo.dev/develop/development-builds/introduction/)
