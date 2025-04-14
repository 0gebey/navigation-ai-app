// Voice service for handling text-to-speech functionality
// Uses a simplified approach focused on navigation narration

import { AIService } from "./AIService";

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

export interface VoiceOptions {
  volume?: number; // Volume (default: 1.0)
  language?: string; // Language code (default: "en-US")
}

export class VoiceService extends EventEmitter {
  private static instance: VoiceService;
  private isSpeaking: boolean = false;
  private options: VoiceOptions = {
    volume: 1.0,
    language: "en-US",
  };

  // Private constructor (singleton pattern)
  private constructor() {
    super();
    console.log("VoiceService initialized");
  }

  // Get singleton instance
  public static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  /**
   * Speak given text using text-to-speech
   * @param text Text to speak
   * @param options Voice options (optional)
   */
  public speak(text: string, options?: VoiceOptions): Promise<void> {
    return new Promise((resolve) => {
      // Merge with default options
      const mergedOptions = { ...this.options, ...options };

      // Set speaking state
      this.isSpeaking = true;

      // Emit speaking event
      this.emit("speaking", { text, options: mergedOptions });

      console.log(`Speaking: "${text}"`);

      // In a real implementation, this would use a platform-specific
      // text-to-speech API like expo-speech or react-native-tts

      // For now, simulate speech with a timeout
      setTimeout(() => {
        this.isSpeaking = false;
        this.emit("finished");
        resolve();
      }, text.length * 90); // Rough approximation: ~90ms per character
    });
  }

  /**
   * Speak a narrative about approaching a place
   * @param placeName Name of the place being approached
   * @param distance Distance to the place in kilometers
   */
  public async speakApproachingNarrative(
    placeName: string,
    distance: number
  ): Promise<void> {
    try {
      // Generate the approaching narrative
      const narrative = await AIService.generateApproachingNarrative(
        placeName,
        distance
      );

      // Speak the processed text
      return this.speak(narrative);
    } catch (error) {
      console.error("Error generating approaching narrative:", error);
      return this.speak(
        `You are approaching ${placeName}, ${distance} kilometers away.`
      );
    }
  }

  /**
   * Stop currently playing speech
   */
  public stop(): void {
    if (this.isSpeaking) {
      this.isSpeaking = false;
      this.emit("stopped");
      console.log("Speech stopped");
    }
  }

  /**
   * Check if the service is currently speaking
   */
  public isSpeakingNow(): boolean {
    return this.isSpeaking;
  }
}

// Export singleton instance
const voiceService = VoiceService.getInstance();
export default voiceService;
