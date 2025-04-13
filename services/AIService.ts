// Mock AI service for generating place information
// In a real implementation, this would integrate with OpenAI, Google AI, or another language model provider

interface PlaceInfo {
  name: string;
  description: string;
  historicalFacts: string[];
  mustSeeAttractions: string[];
  funFacts: string[];
}

export type { PlaceInfo };

// Sample data - this would be replaced with actual API calls in production
const placeInfoDatabase: Record<string, PlaceInfo> = {
  Nuenen: {
    name: "Nuenen",
    description:
      "Nuenen is a charming village in the province of North Brabant, Netherlands, famous for being the place where Vincent van Gogh lived and worked from December 1883 to November 1885.",
    historicalFacts: [
      "Vincent van Gogh created over 500 paintings, drawings, and sketches while living in Nuenen.",
      "The reformed church in Nuenen, where Van Gogh's father was a pastor, was featured in several of his paintings.",
      'Van Gogh painted his first masterpiece, "The Potato Eaters," while residing in Nuenen.',
      "The village life of Nuenen significantly influenced Van Gogh's artistic development and his interest in depicting rural life.",
    ],
    mustSeeAttractions: [
      "Vincentre Museum - Learn about Van Gogh's time in Nuenen",
      "Van Gogh Village Nuenen - Outdoor experience with 23 locations related to the artist",
      "Reformed Church of Nuenen - Featured in Van Gogh's paintings",
      "Het Klooster - A former monastery now serving as a cultural center",
    ],
    funFacts: [
      'Locals refer to a specific shade of green as "Van Gogh green" due to his frequent use of this color in his Nuenen period paintings.',
      "Van Gogh wrote over 150 letters to his brother Theo while living in Nuenen.",
      "The village has maintained much of its 19th-century charm, allowing visitors to experience the landscapes that inspired Van Gogh.",
    ],
  },
  Eindhoven: {
    name: "Eindhoven",
    description:
      "Eindhoven is a vibrant city in the province of North Brabant, Netherlands, known for its technological innovations, design culture, and being the birthplace of Philips Electronics.",
    historicalFacts: [
      "Eindhoven was granted city rights in 1232 by Duke Henry I of Brabant.",
      "The founding of the Philips Electronics company in 1891 by Gerard Philips transformed Eindhoven from a small town to an industrial center.",
      "Eindhoven was severely damaged during World War II due to its industrial significance.",
      'The city experienced rapid growth in the 20th century, becoming known as the "City of Light" due to Philips\' light bulb production.',
    ],
    mustSeeAttractions: [
      "Philips Museum - Discover the history of the electronics giant",
      "Van Abbemuseum - Contemporary and modern art collection",
      "Strijp-S - Former Philips factory complex now a creative and cultural hub",
      "DAF Museum - Showcasing the history of the Dutch automobile manufacturer",
    ],
    funFacts: [
      "Eindhoven hosts the annual Dutch Design Week, the largest design event in Northern Europe.",
      "The Evoluon, a futuristic flying saucer-shaped building, was a science museum gifted to the city by Philips in 1966.",
      "PSV Eindhoven, one of the Netherlands' most successful football clubs, was originally founded as the sports club for Philips employees.",
    ],
  },
  Helmond: {
    name: "Helmond",
    description:
      "Helmond is a city in the province of North Brabant, Netherlands, known for its medieval castle, industrial heritage, and textile history.",
    historicalFacts: [
      "Helmond received city rights in 1232.",
      "The city was an important textile industry center in the 19th and early 20th centuries.",
      "Helmond Castle, built in the 14th century, is one of the largest moated castles in the Netherlands.",
      'During the Industrial Revolution, Helmond became known as "little Manchester" due to its textile factories.',
    ],
    mustSeeAttractions: [
      "Helmond Castle - A medieval water castle now housing the city museum",
      "Kunsthal Helmond - Modern art exhibitions",
      "De Bundertjes - A nature park perfect for walking and cycling",
      "Industrial heritage sites along the Zuidwillemsvaart canal",
    ],
    funFacts: [
      "The Vlisco fabric factory in Helmond produces colorful wax prints that are extremely popular in West and Central Africa.",
      "Helmond Castle is surrounded by a moat that is over 700 years old.",
      "The city hosts an annual multicultural carnival that combines Dutch traditions with international influences.",
    ],
  },
};

export class AIService {
  /**
   * Get detailed information about a place
   * In a real implementation, this would call an AI service API
   */
  static getPlaceInfo(placeName: string): Promise<PlaceInfo> {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const placeInfo = placeInfoDatabase[placeName];
        if (placeInfo) {
          resolve(placeInfo);
        } else {
          // In a real implementation, this would generate info using AI
          reject(new Error(`No information available for ${placeName}`));
        }
      }, 500);
    });
  }

  /**
   * Generate a narrative about approaching a place
   * This would use AI to create a dynamic, contextualized narrative
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
            `In about ${distance} km, you'll reach ${place.name}. Did you know? ${place.funFacts[0]}`,
            `${place.name} is coming up in ${distance} km. It's worth noting that ${place.historicalFacts[0]}`,
          ];

          // Randomly select a narrative
          const randomIndex = Math.floor(Math.random() * narratives.length);
          resolve(narratives[randomIndex]);
        } else {
          resolve(`You're approaching ${placeName}, just ${distance} km away.`);
        }
      }, 300);
    });
  }

  /**
   * Generate audio narration text for text-to-speech
   * In a real app, this would use AI to create natural sounding narration
   */
  static generateAudioNarration(text: string): Promise<string> {
    return new Promise((resolve) => {
      // In a real implementation, this would enhance the text for better TTS results
      // or use a more sophisticated speech synthesis approach
      resolve(text);
    });
  }
}

export default AIService;
