// Simple AI service for generating place information for navigation
// In a real implementation, this would integrate with an AI API

export interface PlaceInfo {
  name: string;
  description: string;
  // Simplify to only keep what's needed for navigation
  mustSeeAttractions: string[];
  funFacts: string[];
}

// Sample data for essential places - streamlined for navigation purposes
const placeInfoDatabase: Record<string, PlaceInfo> = {
  Nuenen: {
    name: "Nuenen",
    description:
      "Nuenen is a charming village famous for being the place where Vincent van Gogh lived and worked from 1883 to 1885.",
    mustSeeAttractions: [
      "Vincentre Museum",
      "Van Gogh Village Nuenen",
      "Reformed Church of Nuenen",
    ],
    funFacts: [
      "Van Gogh painted his first masterpiece, 'The Potato Eaters', while residing in Nuenen.",
      "The village has maintained much of its 19th-century charm.",
    ],
  },
  Eindhoven: {
    name: "Eindhoven",
    description:
      "Eindhoven is a vibrant city known for its technological innovations, design culture, and being the birthplace of Philips Electronics.",
    mustSeeAttractions: [
      "Philips Museum",
      "Van Abbemuseum",
      "Strijp-S creative hub",
    ],
    funFacts: [
      "Eindhoven hosts the annual Dutch Design Week, the largest design event in Northern Europe.",
      "PSV Eindhoven, one of the Netherlands' most successful football clubs, was founded as the sports club for Philips employees.",
    ],
  },
  Helmond: {
    name: "Helmond",
    description:
      "Helmond is a city known for its medieval castle, industrial heritage, and textile history.",
    mustSeeAttractions: [
      "Helmond Castle",
      "Kunsthal Helmond",
      "De Bundertjes nature park",
    ],
    funFacts: [
      "Helmond Castle is surrounded by a moat that is over 700 years old.",
      "The city was once known as 'little Manchester' due to its textile factories.",
    ],
  },
};

export class AIService {
  /**
   * Get essential information about a place for navigation
   */
  static getPlaceInfo(placeName: string): Promise<PlaceInfo> {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const placeInfo = placeInfoDatabase[placeName];
        if (placeInfo) {
          resolve(placeInfo);
        } else {
          reject(new Error(`No information available for ${placeName}`));
        }
      }, 300);
    });
  }

  /**
   * Generate a narrative about approaching a place
   * This is used for real-time narration during navigation
   */
  static generateApproachingNarrative(
    placeName: string,
    distance: number
  ): Promise<string> {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const place = placeInfoDatabase[placeName];

        if (place) {
          const narratives = [
            `You're approaching ${place.name}, just ${distance} km away. ${place.description}`,
            `In about ${distance} km, you'll reach ${place.name}. A must-see attraction is ${place.mustSeeAttractions[0]}.`,
            `${place.name} is coming up in ${distance} km. Fun fact: ${place.funFacts[0]}`,
          ];

          // Randomly select a narrative
          const randomIndex = Math.floor(Math.random() * narratives.length);
          resolve(narratives[randomIndex]);
        } else {
          resolve(`You're approaching ${placeName}, just ${distance} km away.`);
        }
      }, 200);
    });
  }
}

export default AIService;
