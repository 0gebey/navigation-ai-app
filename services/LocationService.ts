import * as Location from "expo-location";

// Simple EventEmitter implementation for React Native
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, ...args: any[]): void {
    const listeners = this.events[event];
    if (listeners) {
      listeners.forEach((listener) => listener(...args));
    }
  }

  removeListener(event: string, listener: Function): void {
    const listeners = this.events[event];
    if (listeners) {
      this.events[event] = listeners.filter((l) => l !== listener);
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceLocation {
  id: string;
  name: string;
  coordinates: Coordinates;
  address?: string;
  category?: string;
  distance?: number; // Distance from user in meters
  photoReference?: string; // Add photoReference property
  radius?: number; // Radius in meters for proximity detection
}

export interface RouteInfo {
  id?: string;
  name?: string;
  distance: number; // in meters
  duration: number; // in seconds
  startLocation: Coordinates;
  endLocation: Coordinates;
  coordinates: Coordinates[]; // Route coordinates for drawing
}

// Sample POI data - would come from a database in a real app
const placesOfInterest: PlaceLocation[] = [
  {
    id: "1",
    name: "Nuenen",
    coordinates: {
      latitude: 51.4583,
      longitude: 5.5583,
    },
    radius: 2000, // 2km
  },
  {
    id: "2",
    name: "Eindhoven - Philips Museum",
    coordinates: {
      latitude: 51.4382,
      longitude: 5.4784,
    },
    radius: 500, // 500m
  },
  {
    id: "3",
    name: "Helmond Castle",
    coordinates: {
      latitude: 51.4826,
      longitude: 5.6552,
    },
    radius: 1000, // 1km
  },
];

export class LocationService extends EventEmitter {
  private static instance: LocationService;
  private watchId: Location.LocationSubscription | null = null;
  private lastLocation: Location.LocationObject | null = null;
  private isTracking: boolean = false;
  private nearbyPlaces: Set<string> = new Set();

  constructor() {
    super();
  }

  // Static method to get the instance
  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Initialize location services
  async init(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.error("Location permission not granted");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error initializing location services:", error);
      return false;
    }
  }

  // Start tracking user location
  startLocationTracking(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (this.isTracking) {
        resolve(true);
        return;
      }

      try {
        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission denied");
          resolve(false);
          return;
        }

        // Get initial location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        this.lastLocation = location;
        this.emit("locationChanged", location);

        // Start watching for location changes
        this.watchId = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 10, // minimum change (in meters) to trigger update
            timeInterval: 5000, // minimum time interval between updates
          },
          (location) => {
            this.lastLocation = location;
            this.emit("locationChanged", location);
            this.checkProximityToPlaces(location);
          }
        );

        this.isTracking = true;
        resolve(true);
      } catch (error) {
        console.error("Error starting location tracking:", error);
        resolve(false);
      }
    });
  }

  // Stop tracking user location
  stopLocationTracking(): void {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
    this.isTracking = false;
  }

  // Get user's current location
  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      if (this.lastLocation) {
        return this.lastLocation;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      this.lastLocation = location;
      return location;
    } catch (error) {
      console.error("Error getting current location:", error);
      return null;
    }
  }

  // Convert degrees to radians
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Check if user is near any places of interest
  private checkProximityToPlaces(location: Location.LocationObject): void {
    placesOfInterest.forEach((place) => {
      const distance = this.calculateDistance(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        place.coordinates
      );

      // Convert distance to meters for comparison with radius
      const distanceInMeters = distance; // Already in meters from calculateDistance
      const radius = place.radius || 1000; // Default 1km if not specified

      if (distanceInMeters <= radius) {
        // If we haven't already detected this place
        if (!this.nearbyPlaces.has(place.id)) {
          this.nearbyPlaces.add(place.id);
          this.emit("placeNearby", {
            place,
            distance,
            location,
          });
        }
      } else {
        // If we're leaving the place's radius
        if (this.nearbyPlaces.has(place.id)) {
          this.nearbyPlaces.delete(place.id);
          this.emit("placeLeft", {
            place,
            distance,
            location,
          });
        }
      }
    });
  }

  // Get all places of interest
  getPlacesOfInterest(): PlaceLocation[] {
    return placesOfInterest;
  }

  // Get a specific place by ID
  getPlaceById(id: string): PlaceLocation | undefined {
    return placesOfInterest.find((place) => place.id === id);
  }

  // Mock function to get a route - in a real app, this would use a routing API
  getRoute(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<RouteInfo> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // For our example, just create a straight line between points
        // In a real app, we'd call a routing API like Google Directions, Mapbox, etc.

        // Create intermediate points for the route
        const waypoints = [];
        const pointCount = 10;

        for (let i = 1; i < pointCount; i++) {
          const fraction = i / pointCount;
          waypoints.push({
            latitude: startLat + (endLat - startLat) * fraction,
            longitude: startLng + (endLng - startLng) * fraction,
          });
        }

        const route: RouteInfo = {
          id: `route-${Date.now()}`,
          name: "Custom Route",
          distance: 0, // Add a default value
          duration: 0, // Add a default value
          startLocation: {
            latitude: startLat,
            longitude: startLng,
          },
          endLocation: {
            latitude: endLat,
            longitude: endLng,
          },
          coordinates: waypoints,
        };

        resolve(route);
      }, 500);
    });
  }

  /**
   * Calculate the distance between two coordinates in meters
   */
  calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // in meters
  }

  /**
   * Find nearby places based on user location and radius
   */
  findNearbyPlaces(
    userLocation: Coordinates,
    places: PlaceLocation[],
    radius: number = 5000
  ): PlaceLocation[] {
    return places
      .map((place) => {
        const distance = this.calculateDistance(
          userLocation,
          place.coordinates
        );
        return {
          ...place,
          distance,
        };
      })
      .filter((place) => place.distance <= radius)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  /**
   * Get nearby place by category
   */
  findPlacesByCategory(
    userLocation: Coordinates,
    places: PlaceLocation[],
    category: string,
    radius: number = 10000
  ): PlaceLocation[] {
    const nearbyPlaces = this.findNearbyPlaces(userLocation, places, radius);
    return nearbyPlaces.filter((place) => place.category === category);
  }

  /**
   * Mock route planning between two points
   * In a real implementation, this would call a routing API like Google Directions, Mapbox, etc.
   */
  async planRoute(
    start: Coordinates,
    end: Coordinates
  ): Promise<RouteInfo | null> {
    try {
      // Calculate direct distance
      const directDistance = this.calculateDistance(start, end);

      // Simulate route calculation delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate some intermediate points to simulate a route
      const numPoints = Math.max(2, Math.floor(directDistance / 500)); // One point every 500m
      const coordinates: Coordinates[] = [start];

      for (let i = 1; i < numPoints - 1; i++) {
        const fraction = i / (numPoints - 1);

        // Add some randomness to make it look like a realistic route
        const jitterLat = (Math.random() - 0.5) * 0.001;
        const jitterLng = (Math.random() - 0.5) * 0.001;

        coordinates.push({
          latitude:
            start.latitude +
            (end.latitude - start.latitude) * fraction +
            jitterLat,
          longitude:
            start.longitude +
            (end.longitude - start.longitude) * fraction +
            jitterLng,
        });
      }

      coordinates.push(end);

      // Simulate that the route is typically longer than direct distance
      const routeFactor = 1.2 + Math.random() * 0.3; // Between 1.2x and 1.5x the direct distance
      const routeDistance = directDistance * routeFactor;

      // Estimate duration based on average speed of 40 km/h
      const speedInMetersPerSecond = (40 * 1000) / 3600;
      const duration = routeDistance / speedInMetersPerSecond;

      return {
        distance: routeDistance,
        duration: duration,
        startLocation: start,
        endLocation: end,
        coordinates: coordinates,
      };
    } catch (error) {
      console.error("Error planning route:", error);
      return null;
    }
  }

  /**
   * Format distance for display
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  }

  /**
   * Format duration for display
   */
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}min`;
    }
  }
}

// Singleton instance
const locationService = new LocationService();
export default locationService;
