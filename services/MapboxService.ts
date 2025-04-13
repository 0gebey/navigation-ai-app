import Mapbox from "@rnmapbox/maps";
import { Platform } from "react-native";
import { LocationService } from "./LocationService";
import { PlaceLocation } from "./LocationService";
import Constants from "expo-constants";

// Define types for Mapbox service
export interface MapboxRouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface MapboxRoute {
  coordinates: MapboxRouteCoordinate[];
  distance: number; // in meters
  duration: number; // in seconds
}

export class MapboxService {
  private static instance: MapboxService;
  private locationService: LocationService;
  private apiKey: string;
  private isInitialized: boolean = false;

  private constructor() {
    this.locationService = LocationService.getInstance();

    // Try to get the API key from environment variables or constants
    const envToken = process.env.MAPBOX_ACCESS_TOKEN;
    const constantsToken = Constants.expoConfig?.extra?.mapboxAccessToken;

    this.apiKey =
      envToken ||
      constantsToken ||
      "pk.eyJ1IjoiMGdlYmV5IiwiYSI6ImNtOWc4eDloMjEzbnUya3Nhc3QweHNsdzgifQ.EgYSNJZX7G-PfdojXV9y_g";

    // Only log a warning if no token is found
    if (!this.apiKey) {
      console.warn(
        "Mapbox token not found. Set MAPBOX_ACCESS_TOKEN environment variable or add mapboxAccessToken to app.json extra section."
      );
    }
  }

  public static getInstance(): MapboxService {
    if (!MapboxService.instance) {
      MapboxService.instance = new MapboxService();
    }
    return MapboxService.instance;
  }

  /**
   * Initialize Mapbox with the API key
   */
  public initialize(): void {
    if (this.isInitialized) return;

    try {
      Mapbox.setAccessToken(this.apiKey);
      this.isInitialized = true;
      console.log("Mapbox initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Mapbox:", error);
    }
  }

  /**
   * Check if the API key is set
   */
  public isConfigured(): boolean {
    return this.apiKey !== "YOUR_MAPBOX_ACCESS_TOKEN" && this.isInitialized;
  }

  /**
   * Set the Mapbox API key
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    if (apiKey) {
      this.initialize();
    }
  }

  /**
   * Get directions between two points
   * @param origin Starting coordinates
   * @param destination Ending coordinates
   * @returns Promise with route information
   */
  public async getDirections(
    origin: PlaceLocation,
    destination: PlaceLocation
  ): Promise<MapboxRoute | null> {
    if (!this.isConfigured()) {
      console.warn("Mapbox not configured with a valid API key");
      return this.getMockRoute(origin, destination);
    }

    try {
      const originStr = `${origin.longitude},${origin.latitude}`;
      const destStr = `${destination.longitude},${destination.latitude}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${originStr};${destStr}?geometries=geojson&access_token=${this.apiKey}&overview=full`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(
          (coord: [number, number]) => ({
            longitude: coord[0],
            latitude: coord[1],
          })
        );

        return {
          coordinates,
          distance: route.distance,
          duration: route.duration,
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching directions from Mapbox:", error);
      // Fall back to mock route in case of error
      return this.getMockRoute(origin, destination);
    }
  }

  /**
   * Generate a mock route for development or when API is not configured
   */
  private getMockRoute(
    origin: PlaceLocation,
    destination: PlaceLocation
  ): MapboxRoute {
    // Create a simple straight line route with some intermediate points
    const numPoints = 10;
    const coordinates: MapboxRouteCoordinate[] = [];

    for (let i = 0; i <= numPoints; i++) {
      const fraction = i / numPoints;
      coordinates.push({
        latitude:
          origin.latitude + (destination.latitude - origin.latitude) * fraction,
        longitude:
          origin.longitude +
          (destination.longitude - origin.longitude) * fraction,
      });
    }

    // Calculate rough distance using the Haversine formula
    const distance =
      this.locationService.calculateDistance(
        { latitude: origin.latitude, longitude: origin.longitude },
        { latitude: destination.latitude, longitude: destination.longitude }
      ) * 1000; // Convert km to meters

    // Assume average walking speed of 5 km/h or about 1.4 m/s
    const duration = distance / 1.4;

    return {
      coordinates,
      distance,
      duration,
    };
  }
}
