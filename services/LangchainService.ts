import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

// Initialize with a default API key (should be replaced with user's key in production)
// In production, this would be stored securely in environment variables
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";

export interface NarrationOptions {
  style?: "informative" | "storyteller" | "concise";
  pointsOfInterest?: string[];
  includeHistory?: boolean;
  userPreferences?: string[];
}

export interface PlaceInsight {
  name: string;
  description: string;
  historicalContext: string;
  culturalSignificance: string[];
  localTips: string[];
  hiddenGems: string[];
}

export class LangchainService {
  private llm: ChatOpenAI;

  constructor(apiKey?: string) {
    // Allow overriding the API key
    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey || OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
    });
  }

  /**
   * Generate a dynamic narration about a place based on user's location
   */
  async generateLocationNarration(
    placeName: string,
    distance: number,
    options: NarrationOptions = {}
  ): Promise<string> {
    // If API key is not set, return a sample narration
    if (!OPENAI_API_KEY && !this.llm.openAIApiKey) {
      return this.getSampleNarration(placeName, distance, options);
    }

    const promptTemplate = new PromptTemplate({
      template: `
      You are an AI tour guide specializing in providing information about places.
      
      Generate a {style} narration about {placeName} which is {distance} kilometers away from the user.
      
      ${options.includeHistory ? "Include important historical facts." : ""}
      ${
        options.pointsOfInterest && options.pointsOfInterest.length > 0
          ? `Mention these points of interest if relevant: ${options.pointsOfInterest.join(
              ", "
            )}`
          : ""
      }
      ${
        options.userPreferences && options.userPreferences.length > 0
          ? `The user has expressed interest in: ${options.userPreferences.join(
              ", "
            )}`
          : ""
      }
      
      Keep the narration to about 3-4 sentences and make it feel natural and engaging.
      `,
      inputVariables: ["placeName", "distance", "style"],
    });

    const chain = new LLMChain({
      llm: this.llm,
      prompt: promptTemplate,
    });

    try {
      const style = options.style || "informative";
      const result = await chain.call({
        placeName,
        distance,
        style,
      });

      return result.text || "No narration generated.";
    } catch (error) {
      console.error("Error generating narration:", error);
      return this.getSampleNarration(placeName, distance, options);
    }
  }

  /**
   * Get deeper insights about a place using AI
   */
  async getPlaceInsights(placeName: string): Promise<PlaceInsight> {
    // If API key is not set, return sample insights
    if (!OPENAI_API_KEY && !this.llm.openAIApiKey) {
      return this.getSampleInsights(placeName);
    }

    const promptTemplate = new PromptTemplate({
      template: `
      Generate detailed information about {placeName} formatted as JSON with the following structure:
      
      {
        "name": "{placeName}",
        "description": "A detailed description of the place",
        "historicalContext": "Information about the place's history and development",
        "culturalSignificance": ["Several points about cultural importance", "..."],
        "localTips": ["Tips from locals about the place", "..."],
        "hiddenGems": ["Lesser-known attractions or features", "..."]
      }
      
      Provide only the JSON output with no additional text.
      `,
      inputVariables: ["placeName"],
    });

    const chain = new LLMChain({
      llm: this.llm,
      prompt: promptTemplate,
    });

    try {
      const result = await chain.call({ placeName });

      // Extract and parse the JSON from the response
      const jsonMatch = result.text.match(/({.*})/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error("Could not parse JSON from response");
    } catch (error) {
      console.error("Error getting place insights:", error);
      return this.getSampleInsights(placeName);
    }
  }

  /**
   * Generate a customized audio tour script
   */
  async generateAudioTourScript(
    placeName: string,
    duration: number = 2
  ): Promise<string> {
    // If API key is not set, return a sample script
    if (!OPENAI_API_KEY && !this.llm.openAIApiKey) {
      return `Welcome to ${placeName}! This is a sample audio tour script that would normally be generated using AI. It would include interesting facts about the location, historical context, and guide you through notable points of interest.`;
    }

    const promptTemplate = new PromptTemplate({
      template: `
      Create an engaging audio tour script for {placeName} that would take approximately {duration} minutes to narrate.
      
      The script should:
      - Start with a warm welcome and introduction to {placeName}
      - Include 3-4 significant points about the history or culture
      - Highlight 2-3 must-see attractions
      - End with a thoughtful conclusion
      
      The tone should be conversational and engaging, as if a knowledgeable friend is giving the tour.
      `,
      inputVariables: ["placeName", "duration"],
    });

    const chain = new LLMChain({
      llm: this.llm,
      prompt: promptTemplate,
    });

    try {
      const result = await chain.call({
        placeName,
        duration,
      });

      return result.text || "No audio tour script generated.";
    } catch (error) {
      console.error("Error generating audio tour script:", error);
      return `Welcome to ${placeName}! This is a sample audio tour script that would normally be generated using AI. It would include interesting facts about the location, historical context, and guide you through notable points of interest.`;
    }
  }

  /**
   * Sample narration for when API key is not available
   */
  private getSampleNarration(
    placeName: string,
    distance: number,
    options: NarrationOptions
  ): string {
    const narrations = [
      `You're approaching ${placeName}, just ${distance} kilometers away. This area is known for its unique character and local charm.`,
      `In about ${distance} kilometers, you'll reach ${placeName}. It's a place with a rich history and cultural significance.`,
      `${placeName} is coming up in ${distance} kilometers. Many visitors find the local architecture and atmosphere quite captivating.`,
    ];

    return narrations[Math.floor(Math.random() * narrations.length)];
  }

  /**
   * Sample insights for when API key is not available
   */
  private getSampleInsights(placeName: string): PlaceInsight {
    return {
      name: placeName,
      description: `${placeName} is a charming location with a unique character and atmosphere that attracts visitors from around the world.`,
      historicalContext: `${placeName} has a rich history dating back centuries, with influences from various cultural periods that have shaped its development.`,
      culturalSignificance: [
        `${placeName} has contributed significantly to the region's cultural heritage`,
        `The local customs and traditions in ${placeName} reflect a blend of historical influences`,
        `${placeName} has been featured in various forms of art and literature throughout history`,
      ],
      localTips: [
        "Visit early in the morning to avoid crowds",
        "Try the local specialty dishes at family-owned restaurants",
        "Explore the side streets for hidden shops and cafes",
      ],
      hiddenGems: [
        "A little-known viewpoint offering panoramic views",
        "A small museum showcasing local crafts and history",
        "A peaceful garden frequented mainly by locals",
      ],
    };
  }
}

export default new LangchainService();
