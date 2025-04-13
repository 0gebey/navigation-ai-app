# Map App - Interactive Navigation Experience

A React Native application built with Expo that provides an interactive navigation experience with points of interest, real-time location tracking, and AI-powered narration.

## Features

- 📍 Real-time location tracking
- 🗺️ Interactive map interface
- 🏛️ Points of interest with detailed information
- 🗣️ AI-powered narration about places
- 📱 Cross-platform (iOS and Android)
- 🧭 Mapbox integration for custom maps and directions

## Setup Instructions

1. **Install dependencies**

```bash
npm install
```

2. **Configure Mapbox (Required for Mapbox features)**

   The app uses Mapbox for certain map features. To enable these features:

   a. Create a Mapbox account at https://www.mapbox.com/ and obtain an access token

   b. Add your Mapbox access token to the `app.json` file:

   ```json
   "extra": {
     // other configuration
     "mapboxAccessToken": "YOUR_MAPBOX_ACCESS_TOKEN"
   }
   ```

   c. For development builds, add the following to the plugins section in `app.json`:

   ```json
   "plugins": [
     // other plugins
     [
       "@rnmapbox/maps",
       {
         "RNMapboxMapsVersion": "11.8.0",
         "RNMapboxMapsDownloadToken": "sk.YOUR_DOWNLOAD_TOKEN"
       }
     ]
   ]
   ```

   Note: The download token requires the `DOWNLOADS:READ` scope. See [Mapbox plugin documentation](https://github.com/rnmapbox/maps/blob/main/plugin/install.md) for details.

3. **Start the development server**

```bash
npx expo start
```

4. **Run on iOS Simulator**

```bash
npx expo start --ios
```

5. **Run on Android Emulator**

```bash
npx expo start --android
```

## Project Structure

- `app/` - Contains all screens and navigation setup (Expo Router)
  - `(tabs)/` - Tab-based navigation
  - `place/` - Place detail screens
- `components/` - Reusable UI components
- `services/` - Service layer for API integration
- `assets/` - Static assets like images and icons

## Development Roadmap

### 1. Core Functionality Enhancements

- [ ] Implement place details screen with dynamic content
- [ ] Add distance-based POI detection
- [ ] Create route planning and turn-by-turn navigation
- [ ] Improve map styling and UI polish

### 2. AI Integration

- [ ] Integrate LangChain.js for AI-powered features
- [ ] Implement dynamic narration generation based on location
- [ ] Add contextual information about POIs using AI
- [ ] Create personalized recommendations

### 3. Map Enhancement

- [x] Add Mapbox integration for custom styling and directions
- [ ] Implement offline map capabilities
- [ ] Add satellite and terrain view options
- [ ] Create custom markers with animation

### 4. User Experience

- [ ] Add onboarding flow for first-time users
- [ ] Implement user preferences and settings
- [ ] Create favorites/bookmarks for places
- [ ] Add search functionality

### 5. Optimization

- [ ] Improve performance for lower-end devices
- [ ] Implement caching for offline usage
- [ ] Optimize battery usage during navigation
- [ ] Add accessibility features

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
