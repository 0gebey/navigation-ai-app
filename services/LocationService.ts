import * as Location from "expo-location";
import { EventEmitter } from "events";

export interface Place {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius?: number; // Detection radius in meters
}

export interface Route {
  id: string;
  name: string;
  start: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  end: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  waypoints: Array<{
    latitude: number;
    longitude: number;
  }>;
}

// Sample POI data - would come from a database in a real app
const placesOfInterest: Place[] = [
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

class LocationService extends EventEmitter {
  private watchId: Location.LocationSubscription | null = null;
  private lastLocation: Location.LocationObject | null = null;
  private isTracking: boolean = false;
  private nearbyPlaces: Set<string> = new Set();

  constructor() {
    super();
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

  // Calculate distance between two coordinates in kilometers
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  // Convert degrees to radians
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Check if user is near any places of interest
  private checkProximityToPlaces(location: Location.LocationObject): void {
    placesOfInterest.forEach((place) => {
      const distance = this.calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        place.coordinates.latitude,
        place.coordinates.longitude
      );

      // Convert distance to meters for comparison with radius
      const distanceInMeters = distance * 1000;
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
  getPlacesOfInterest(): Place[] {
    return placesOfInterest;
  }

  // Get a specific place by ID
  getPlaceById(id: string): Place | undefined {
    return placesOfInterest.find((place) => place.id === id);
  }

  // Mock function to get a route - in a real app, this would use a routing API
  getRoute(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<Route> {
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

        const route: Route = {
          id: `route-${Date.now()}`,
          name: "Custom Route",
          start: {
            name: "Starting Point",
            coordinates: {
              latitude: startLat,
              longitude: startLng,
            },
          },
          end: {
            name: "Destination",
            coordinates: {
              latitude: endLat,
              longitude: endLng,
            },
          },
          waypoints,
        };

        resolve(route);
      }, 500);
    });
  }
}

// Singleton instance
const locationService = new LocationService();
export default locationService;
