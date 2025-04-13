import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MapboxReadme() {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Mapbox Setup Guide",
          headerBackTitle: "Back",
        }}
      />

      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Mapbox Integration Setup</Text>

        <Text style={styles.paragraph}>
          This guide explains how to properly set up and build the app with
          Mapbox support.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.importantTitle}>Important Note</Text>
          <Text style={styles.infoText}>
            The Mapbox integration cannot work in the regular Expo Go app
            because Mapbox requires custom native code.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Setting Up Development Build</Text>
        <Text style={styles.paragraph}>
          To use Mapbox in your Expo project, you need to create a development
          build. Here's how to do it:
        </Text>

        <Text style={styles.subTitle}>1. Install Required Packages</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            npx expo install @rnmapbox/maps expo-location
          </Text>
        </View>

        <Text style={styles.subTitle}>2. Configure app.json</Text>
        <Text style={styles.paragraph}>
          The app.json file has already been configured with:
        </Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Ionicons name="checkmark" size={18} color="#4CAF50" />
            <Text style={styles.listText}>The Mapbox plugin configuration</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="checkmark" size={18} color="#4CAF50" />
            <Text style={styles.listText}>
              A download token with the necessary permissions
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="checkmark" size={18} color="#4CAF50" />
            <Text style={styles.listText}>
              The access token in the extras section
            </Text>
          </View>
        </View>

        <Text style={styles.subTitle}>3. Create a Development Build</Text>
        <Text style={styles.paragraph}>
          Create a development build using EAS Build:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            # Install EAS CLI if you haven't already{"\n"}
            npm install -g eas-cli{"\n\n"}# Log in to your Expo account{"\n"}
            eas login{"\n\n"}# Configure EAS Build (if not already configured)
            {"\n"}
            eas build:configure{"\n\n"}# Create a development build for iOS
            {"\n"}
            eas build --profile development --platform ios
          </Text>
        </View>

        <Text style={styles.subTitle}>4. Install the Development Build</Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Ionicons name="phone-portrait" size={18} color="#2196F3" />
            <Text style={styles.listText}>
              For iOS: You'll receive a link to download the app or it will be
              installed directly in your simulator
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="phone-portrait" size={18} color="#2196F3" />
            <Text style={styles.listText}>
              For Android: You'll receive a link to download the APK or AAB file
            </Text>
          </View>
        </View>

        <Text style={styles.subTitle}>5. Run the App Locally</Text>
        <Text style={styles.paragraph}>
          Once you have installed the development build, you can run the app
          locally:
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>npx expo start --dev-client</Text>
        </View>

        <Text style={styles.sectionTitle}>Testing Mapbox Features</Text>
        <Text style={styles.paragraph}>
          After setting up your development build:
        </Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Text style={styles.listNumber}>1.</Text>
            <Text style={styles.listText}>Open the app</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listNumber}>2.</Text>
            <Text style={styles.listText}>Go to the Settings tab</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listNumber}>3.</Text>
            <Text style={styles.listText}>
              Find and tap the "Mapbox Integration Demo" option
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.listNumber}>4.</Text>
            <Text style={styles.listText}>
              The Mapbox demo screen will show your current location with
              directions to points of interest
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Troubleshooting</Text>
        <View style={styles.list}>
          <View style={styles.listItem}>
            <Ionicons name="warning" size={18} color="#FF9800" />
            <Text style={styles.listText}>
              If you see warnings about Mapbox token not being configured, check
              that you have properly set up your access token in app.json
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="warning" size={18} color="#FF9800" />
            <Text style={styles.listText}>
              If the map doesn't load, make sure you're using a development
              build and not Expo Go
            </Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="warning" size={18} color="#FF9800" />
            <Text style={styles.listText}>
              For iOS issues, check that you have the correct permissions in
              your Info.plist (handled automatically by Expo's configuration)
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Useful Resources</Text>
        <View style={styles.resourceList}>
          <TouchableOpacity
            style={styles.resource}
            onPress={() =>
              openLink(
                "https://github.com/rnmapbox/maps/blob/main/plugin/install.md"
              )
            }
          >
            <Ionicons name="link" size={18} color="#2196F3" />
            <Text style={styles.resourceText}>
              Mapbox Plugin Installation Guide
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resource}
            onPress={() => openLink("https://github.com/rnmapbox/maps")}
          >
            <Ionicons name="link" size={18} color="#2196F3" />
            <Text style={styles.resourceText}>
              Mapbox React Native Documentation
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resource}
            onPress={() =>
              openLink(
                "https://docs.expo.dev/develop/development-builds/introduction/"
              )
            }
          >
            <Ionicons name="link" size={18} color="#2196F3" />
            <Text style={styles.resourceText}>
              Expo Development Builds Guide
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    color: "#333",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#333",
  },
  importantTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#F57C00",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: "#555",
  },
  infoBox: {
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  codeBlock: {
    backgroundColor: "#263238",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  code: {
    fontSize: 14,
    lineHeight: 20,
    color: "#FFF",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  list: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  listNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    width: 24,
  },
  listText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    flex: 1,
    marginLeft: 8,
  },
  resourceList: {
    marginBottom: 24,
  },
  resource: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  resourceText: {
    fontSize: 16,
    color: "#2196F3",
    marginLeft: 12,
    textDecorationLine: "underline",
  },
  actionButtons: {
    marginVertical: 24,
  },
  backButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});
