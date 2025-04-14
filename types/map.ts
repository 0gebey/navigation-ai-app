import { LocationObject } from "expo-location";
import { PlaceLocation } from "../services/LocationService";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PointOfInterest {
  id: string;
  title: string;
  description: string;
  coordinate: Coordinates;
  image: string;
  category?: string;
}

export interface Suggestion {
  id: string;
  placeName: string;
  description?: string;
  coordinate?: Coordinates;
}

export interface PlaceNearbyEvent {
  place: PlaceLocation;
  distance: number;
  location: LocationObject;
}

export interface Route {
  id?: string;
  name?: string;
  distance: number;
  duration: number;
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  startLocation: {
    latitude: number;
    longitude: number;
  };
  endLocation: {
    latitude: number;
    longitude: number;
  };
}
