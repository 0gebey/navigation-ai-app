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

/**
 * Service for interacting with Google Places API
 */
class PlacesService {
  private apiKey: string;
  private placesCache: Map<string, PlaceDetails> = new Map();
  private photoCache: Map<string, string> = new Map();

  constructor() {
    // Get API key from environment variables (make sure to add to .env file)
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    if (!this.apiKey) {
      console.warn(
        "Google Places API key not found. Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in .env file."
      );
    }
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
      // In a real implementation, you would make an API call like:
      // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${this.apiKey}`;
      // const response = await fetch(url);
      // const data = await response.json();

      // For now, return mock data to avoid making actual API calls
      return this.getMockPlaces(latitude, longitude);
    } catch (error) {
      console.error("Error searching nearby places:", error);
      return [];
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
      // In a real implementation, you would make an API call like:
      // const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,photos,rating,website,formatted_phone_number,opening_hours,reviews&key=${this.apiKey}`;
      // const response = await fetch(url);
      // const data = await response.json();

      // For now, return mock data
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
      // In a real implementation with the Places API, you would form a URL like:
      const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${this.apiKey}`;

      // For development, you can use a placeholder image service like Unsplash
      // This avoids making actual API calls but gives real images
      const placeholderUrl = `https://source.unsplash.com/400x300/?landmark,place,${Math.random()}`;

      // Cache the result
      this.photoCache.set(photoReference, placeholderUrl);

      return placeholderUrl;
    } catch (error) {
      console.error("Error getting place photo:", error);
      return "";
    }
  }

  /**
   * Get a list of places matching a text search
   */
  async searchPlacesByText(query: string): Promise<PlaceLocation[]> {
    try {
      // In a real implementation, you would make an API call like:
      // const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${this.apiKey}`;
      // const response = await fetch(url);
      // const data = await response.json();

      // For now, return mock data filtered by the query
      return this.getMockPlaces(0, 0).filter((place) =>
        place.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error("Error searching places by text:", error);
      return [];
    }
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
