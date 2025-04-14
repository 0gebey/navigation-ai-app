import { PlaceLocation } from "./LocationService";

interface PlacePhoto {
  photoReference: string;
  width: number;
  height: number;
  url?: string;
}

interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  photos: PlacePhoto[];
  rating?: number;
  website?: string;
  phoneNumber?: string;
  openingHours?: string[];
  reviews?: any[];
}

interface MapboxSuggestion {
  id: string;
  feature_name: string;
  place_name?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  action?: {
    body?: any;
  };
  properties?: {
    feature_name?: string;
    address?: string;
    category?: string;
  };
}

/**
 * Service for interacting with Places APIs (Google Places and Mapbox)
 */
class PlacesService {
  private googleApiKey: string;
  private mapboxApiKey: string;
  private sessionToken: string;
  private placesCache: Map<string, PlaceDetails> = new Map();
  private photoCache: Map<string, string> = new Map();
  private lastLocation: { longitude: number; latitude: number } | null = null;

  constructor() {
    // Get API keys from environment variables
    this.googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    this.mapboxApiKey = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
    // Generate a random session token for Mapbox API calls
    this.sessionToken = this.generateUUID();

    if (!this.googleApiKey) {
      console.warn(
        "Google Places API key not found. Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in .env file."
      );
    }

    if (!this.mapboxApiKey) {
      console.warn(
        "Mapbox API key not found. Set EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN in .env file."
      );
    }
  }

  /**
   * Generate a UUID for Mapbox session tokens
   */
  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   * Search for places nearby a given location
   */
  async searchNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number = 5000,
    type: string = ""
  ): Promise<PlaceLocation[]> {
    try {
      // Check if Mapbox API key is available
      if (this.mapboxApiKey) {
        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
          new URLSearchParams({
            access_token: this.mapboxApiKey,
            limit: "5",
            types: "poi",
            radius: radius.toString(),
          });

        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          return data.features.map((feature: any) => ({
            id: feature.id,
            name: feature.text,
            coordinates: {
              latitude: feature.center[1],
              longitude: feature.center[0],
            },
            category: feature.properties?.category || "place",
            address: feature.place_name,
            photoReference: feature.id, // We'll use the ID as a photo reference
          }));
        }
      }

      // Fallback to mock data if API key not available or request failed
      return this.getMockPlaces(latitude, longitude);
    } catch (error) {
      console.error("Error searching nearby places:", error);
      return this.getMockPlaces(latitude, longitude); // Fallback to mock data
    }
  }

  /**
   * Get place details by place ID
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    // Check cache first
    if (this.placesCache.has(placeId)) {
      return this.placesCache.get(placeId) || null;
    }

    try {
      // For Mapbox, we need to use the retrieve endpoint if this is a Mapbox ID
      if (this.mapboxApiKey && placeId.includes(".")) {
        // This appears to be a Mapbox ID
        try {
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: placeId }),
          };

          const url =
            `https://api.mapbox.com/search/v1/retrieve?` +
            new URLSearchParams({
              access_token: this.mapboxApiKey,
              session_token: this.sessionToken,
            });

          const response = await fetch(url, options);
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const placeDetails: PlaceDetails = {
              placeId: feature.id,
              name: feature.properties?.feature_name || feature.text,
              address: feature.properties?.address || feature.place_name || "",
              photos: [
                {
                  photoReference: feature.id,
                  width: 400,
                  height: 300,
                },
              ],
              rating: feature.properties?.rating || 4.0,
              website: feature.properties?.website || "",
              phoneNumber: feature.properties?.phone || "",
              openingHours: feature.properties?.hours
                ? [feature.properties.hours]
                : [],
            };

            // Cache the result
            this.placesCache.set(placeId, placeDetails);
            return placeDetails;
          }
        } catch (mapboxError) {
          console.error("Error fetching from Mapbox:", mapboxError);
          // Continue to fallback
        }
      }

      // Fallback to mock data
      const placeDetails = this.getMockPlaceDetails(placeId);

      // Cache the result
      if (placeDetails) {
        this.placesCache.set(placeId, placeDetails);
      }

      return placeDetails;
    } catch (error) {
      console.error("Error getting place details:", error);
      return null;
    }
  }

  /**
   * Get a photo URL for a place
   */
  async getPlacePhoto(photoReference: string): Promise<string> {
    // Check cache first
    if (this.photoCache.has(photoReference)) {
      return this.photoCache.get(photoReference) || "";
    }

    try {
      // If the photo reference is Mapbox POI ID, we can try to get a static map image
      if (this.mapboxApiKey && photoReference.includes(".")) {
        const parts = photoReference.split(".");
        if (parts.length >= 2) {
          const lon = parts[parts.length - 2];
          const lat = parts[parts.length - 1];

          if (!isNaN(parseFloat(lon)) && !isNaN(parseFloat(lat))) {
            const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+f74e4e(${lon},${lat})/${lon},${lat},15,0/400x300?access_token=${this.mapboxApiKey}`;
            this.photoCache.set(photoReference, mapUrl);
            return mapUrl;
          }
        }
      }

      // Fallback to Unsplash images
      const placeholderUrl = `https://source.unsplash.com/400x300/?landmark,place,${photoReference}`;
      this.photoCache.set(photoReference, placeholderUrl);
      return placeholderUrl;
    } catch (error) {
      console.error("Error getting place photo:", error);
      return "";
    }
  }

  /**
   * Get a list of places matching a text search using Mapbox Search API
   */
  async searchPlacesByText(
    query: string,
    category?: string,
    limit: number = 10
  ): Promise<PlaceLocation[]> {
    if (query.trim().length < 2) return [];

    try {
      // Use Mapbox Search API if available
      if (this.mapboxApiKey) {
        // Define POI types to search based on category
        let types = "place,poi,address";
        let proximity = "";

        // If user has location, prioritize nearby results
        if (this.lastLocation) {
          proximity = `${this.lastLocation.longitude},${this.lastLocation.latitude}`;
        }

        // If a specific category is requested, refine the search
        if (category && category !== "all") {
          // Map our categories to Mapbox categories
          switch (category) {
            case "restaurant":
            case "food":
              types = "poi.food";
              break;
            case "hotel":
            case "lodging":
              types = "poi.lodging";
              break;
            case "shopping":
            case "mall":
              types = "poi.shop";
              break;
            case "hospital":
            case "medical":
              types = "poi.medical";
              break;
            case "attraction":
            case "museum":
              types = "poi.landmark,poi.attraction";
              break;
            case "parks":
              types = "poi.park";
              break;
            default:
              // Keep default types if category doesn't match
              break;
          }
        }

        const params: Record<string, string> = {
          access_token: this.mapboxApiKey,
          autocomplete: "true",
          limit: limit.toString(),
          types: types,
          language: "en",
        };

        // Add proximity if available
        if (proximity) {
          params.proximity = proximity;
        }

        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?` + new URLSearchParams(params);

        const response = await fetch(url);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          return data.features.map((feature: any) => ({
            id: feature.id,
            name: feature.text,
            coordinates: {
              latitude: feature.center[1],
              longitude: feature.center[0],
            },
            category: this.mapFeatureToCategory(feature),
            address: feature.place_name,
            photoReference: feature.id, // We'll use the ID as a photo reference
          }));
        }
      }

      // Fallback to the Mapbox Search Suggest API if available
      if (this.mapboxApiKey) {
        const url =
          `https://api.mapbox.com/search/v1/suggest/${encodeURIComponent(
            query
          )}?` +
          new URLSearchParams({
            access_token: this.mapboxApiKey,
            session_token: this.sessionToken,
            language: "en",
          });

        const response = await fetch(url);
        const data = await response.json();

        if (data.suggestions && data.suggestions.length > 0) {
          // For suggestions, we need to make a second call to get coordinates
          // For now, return the basic info
          return data.suggestions.map((suggestion: MapboxSuggestion) => ({
            id: suggestion.id || `suggestion-${Math.random()}`,
            name: suggestion.feature_name || suggestion.place_name || query,
            coordinates: suggestion.coordinates || {
              latitude: 0,
              longitude: 0,
            },
            category: "place",
            address: suggestion.address || suggestion.place_name || "",
          }));
        }
      }

      // Fallback to mock data filtered by the query
      return this.getMockPlaces(0, 0).filter((place) =>
        place.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Error searching places by text:", error);
      // Fallback to mock data
      return this.getMockPlaces(0, 0).filter((place) =>
        place.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  /**
   * Maps a Mapbox feature to a user-friendly category
   */
  private mapFeatureToCategory(feature: any): string {
    // Try to extract category from properties or place_type
    const placeType = feature.place_type?.[0] || "";

    if (placeType === "poi") {
      // Extract category from Mapbox properties or class
      const poiCategory =
        feature.properties?.category || feature.properties?.maki || "";

      // Map to user-friendly categories
      if (
        poiCategory.includes("restaurant") ||
        poiCategory.includes("food") ||
        poiCategory.includes("cafe")
      ) {
        return "restaurant";
      } else if (
        poiCategory.includes("hotel") ||
        poiCategory.includes("lodging")
      ) {
        return "hotel";
      } else if (
        poiCategory.includes("shop") ||
        poiCategory.includes("mall") ||
        poiCategory.includes("store")
      ) {
        return "shopping";
      } else if (
        poiCategory.includes("hospital") ||
        poiCategory.includes("clinic") ||
        poiCategory.includes("doctor")
      ) {
        return "medical";
      } else if (
        poiCategory.includes("museum") ||
        poiCategory.includes("landmark") ||
        poiCategory.includes("monument")
      ) {
        return "attraction";
      } else if (poiCategory.includes("park")) {
        return "park";
      }

      return "place";
    } else if (placeType === "address") {
      return "address";
    } else if (placeType === "place") {
      return "city";
    }

    return "place";
  }

  /**
   * Store the last known location to improve search results
   */
  public setLastLocation(longitude: number, latitude: number): void {
    this.lastLocation = { longitude, latitude };
  }

  /**
   * Generate mock places for development (would be replaced with actual API calls)
   */
  private getMockPlaces(latitude: number, longitude: number): PlaceLocation[] {
    // Use the landmark locations from LocationService but add more details
    return [
      {
        id: "1",
        name: "Nuenen",
        coordinates: {
          latitude: 51.4583,
          longitude: 5.5583,
        },
        category: "historical",
        address: "Nuenen, Netherlands",
        photoReference: "nuenen_photo_ref",
      },
      {
        id: "2",
        name: "Eindhoven - Philips Museum",
        coordinates: {
          latitude: 51.4382,
          longitude: 5.4784,
        },
        category: "museum",
        address: "Emmasingel 31, 5611 AZ Eindhoven, Netherlands",
        photoReference: "philips_museum_photo_ref",
      },
      {
        id: "3",
        name: "Helmond Castle",
        coordinates: {
          latitude: 51.4826,
          longitude: 5.6552,
        },
        category: "historical",
        address: "Kasteelplein 1, 5701 PP Helmond, Netherlands",
        photoReference: "helmond_castle_photo_ref",
      },
      {
        id: "4",
        name: "Van Gogh Village Museum",
        coordinates: {
          latitude: 51.473,
          longitude: 5.5474,
        },
        category: "museum",
        address: "Berg 24, 5671 CC Nuenen, Netherlands",
        photoReference: "van_gogh_museum_photo_ref",
      },
      {
        id: "5",
        name: "Evoluon",
        coordinates: {
          latitude: 51.4469,
          longitude: 5.4442,
        },
        category: "cultural",
        address: "Noord Brabantlaan 1A, 5652 LA Eindhoven, Netherlands",
        photoReference: "evoluon_photo_ref",
      },
    ];
  }

  /**
   * Get mock place details (would be replaced with actual API calls)
   */
  private getMockPlaceDetails(placeId: string): PlaceDetails | null {
    const mockDetails: Record<string, PlaceDetails> = {
      "1": {
        placeId: "1",
        name: "Nuenen",
        address: "Nuenen, Netherlands",
        photos: [
          { photoReference: "nuenen_photo_1", width: 400, height: 300 },
          { photoReference: "nuenen_photo_2", width: 400, height: 300 },
        ],
        rating: 4.5,
        website: "https://www.nuenen.nl",
        phoneNumber: "+31 40 263 1631",
        openingHours: ["Monday-Friday: 9:00 AM - 5:00 PM"],
        reviews: [
          {
            author: "Art Lover",
            rating: 5,
            text: "Beautiful village with a strong Van Gogh heritage.",
          },
        ],
      },
      "2": {
        placeId: "2",
        name: "Eindhoven - Philips Museum",
        address: "Emmasingel 31, 5611 AZ Eindhoven, Netherlands",
        photos: [
          { photoReference: "philips_museum_photo_1", width: 400, height: 300 },
          { photoReference: "philips_museum_photo_2", width: 400, height: 300 },
        ],
        rating: 4.3,
        website: "https://www.philips-museum.com",
        phoneNumber: "+31 40 235 9030",
        openingHours: ["Tuesday-Sunday: 11:00 AM - 5:00 PM", "Monday: Closed"],
      },
      "3": {
        placeId: "3",
        name: "Helmond Castle",
        address: "Kasteelplein 1, 5701 PP Helmond, Netherlands",
        photos: [
          { photoReference: "helmond_castle_photo_1", width: 400, height: 300 },
          { photoReference: "helmond_castle_photo_2", width: 400, height: 300 },
        ],
        rating: 4.4,
        website: "https://www.museumhelmond.nl",
        phoneNumber: "+31 492 587 716",
        openingHours: [
          "Tuesday-Friday: 10:00 AM - 5:00 PM",
          "Saturday-Sunday: 12:00 PM - 5:00 PM",
          "Monday: Closed",
        ],
      },
      "4": {
        placeId: "4",
        name: "Van Gogh Village Museum",
        address: "Berg 24, 5671 CC Nuenen, Netherlands",
        photos: [
          {
            photoReference: "van_gogh_museum_photo_1",
            width: 400,
            height: 300,
          },
          {
            photoReference: "van_gogh_museum_photo_2",
            width: 400,
            height: 300,
          },
        ],
        rating: 4.6,
        website: "https://www.vangoghvillagenuenen.nl",
        phoneNumber: "+31 40 283 9615",
        openingHours: ["Tuesday-Sunday: 10:00 AM - 5:00 PM", "Monday: Closed"],
      },
      "5": {
        placeId: "5",
        name: "Evoluon",
        address: "Noord Brabantlaan 1A, 5652 LA Eindhoven, Netherlands",
        photos: [
          { photoReference: "evoluon_photo_1", width: 400, height: 300 },
          { photoReference: "evoluon_photo_2", width: 400, height: 300 },
        ],
        rating: 4.2,
        website: "https://www.evoluon.com",
        phoneNumber: "+31 40 250 4504",
        openingHours: [
          "Monday-Friday: 9:00 AM - 6:00 PM",
          "Saturday-Sunday: 10:00 AM - 5:00 PM",
        ],
      },
    };

    return mockDetails[placeId] || null;
  }
}

// Create singleton instance
const placesService = new PlacesService();
export default placesService;
