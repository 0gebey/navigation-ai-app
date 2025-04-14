# Navigation with AI Narration

A React Native application built with Expo that provides an interactive navigation experience with AI-powered narration for notable places along your route.

## Core Features

- 📍 Real-time location tracking
- 🗺️ Interactive map interface
- 🗣️ AI-powered narration about places you encounter
- 🧭 Turn-by-turn navigation via native maps apps
- 🚶‍♀️ Points of interest with essential information

## Setup Instructions

1. **Install dependencies**

```bash
npm install
```

2. **Start the development server**

```bash
npx expo start
```

3. **Run on iOS Simulator**

```bash
npx expo start --ios
```

4. **Run on Android Emulator**

```bash
npx expo start --android
```

## Project Structure

- `app/` - Contains all screens (Expo Router)
  - `(tabs)/` - Tab-based navigation with Map and Settings
- `services/` - Core services for app functionality:
  - `LocationService.ts` - Handles location tracking and place proximity
  - `AIService.ts` - Provides place information and narration text
  - `VoiceService.ts` - Text-to-speech functionality

## How It Works

This app focuses on enhancing your navigation experience with AI narration:

1. As you navigate to a destination, the app tracks your location in real-time
2. When you approach a point of interest, you receive a notification
3. The AI automatically narrates interesting facts about the place
4. You can tap on any point of interest to:
   - Hear more detailed narration
   - View essential information and images
   - Start turn-by-turn navigation via native maps

## Road Map

- [x] Core navigation functionality with voice narration
- [ ] Support for offline mode with pre-cached place data
- [ ] Optional integration with OpenAI API for enhanced narration
- [ ] User preferences for narration style and voice options

## License

[MIT](LICENSE)
