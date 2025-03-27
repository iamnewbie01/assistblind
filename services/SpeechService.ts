// SpeechService.ts
import Tts from 'react-native-tts';

class SpeechService {
  private static instance: SpeechService;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;

  private constructor() {
    this.initializeTts();
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  private initializeTts(): void {
    // Initialize event listeners
    Tts.addEventListener('tts-start', () => {
      this.isSpeaking = true;
      console.log('Speech started');
    });

    Tts.addEventListener('tts-finish', () => {
      this.isSpeaking = false;
      if (this.onDoneCallback) {
        this.onDoneCallback();
        this.onDoneCallback = null;
      }
      console.log('Speech finished');
    });

    Tts.addEventListener('tts-cancel', () => {
      this.isSpeaking = false;
      console.log('Speech canceled');
    });

    Tts.addEventListener('tts-error', event => {
      console.error('Speech error:', event);
    });

    // Set default language
    Tts.setDefaultLanguage('en-IN');
  }
  
  private onDoneCallback: (() => void) | null = null;

  public async speak(text: string, options?: { onDone?: () => void }): Promise<boolean> {
    try {
      if (this.isSpeaking) {
        await this.stop();
      }

      if (options?.onDone) {
        this.onDoneCallback = options.onDone;
      }

      await Tts.speak(text);
      return true;
    } catch (error) {
      console.error('Failed to speak:', error);
      return false;
    }
  }

  public async stop(): Promise<void> {
    try {
      await Tts.stop();
      this.isPaused = false;
    } catch (error) {
      console.error('Failed to stop speech:', error);
    }
  }

  public async pause(): Promise<void> {
    try {
      if (this.isSpeaking && !this.isPaused) {
        await Tts.pause();
        this.isPaused = true;
      }
    } catch (error) {
      console.error('Failed to pause speech:', error);
    }
  }

  public async resume(): Promise<void> {
    try {
      if (this.isPaused) {
        await Tts.resume();
        this.isPaused = false;
      }
    } catch (error) {
      console.error('Failed to resume speech:', error);
    }
  }

  public async getVoices(): Promise<any[]> {
    try {
      return await Tts.voices();
    } catch (error) {
      console.error('Failed to get voices:', error);
      return [];
    }
  }

  public async setLanguage(language: string): Promise<boolean> {
    try {
      await Tts.setDefaultLanguage(language);
      return true;
    } catch (error) {
      console.error(`Failed to set language to ${language}:`, error);
      return false;
    }
  }

  public async setVoice(voiceId: string): Promise<boolean> {
    try {
      await Tts.setDefaultVoice(voiceId);
      return true;
    } catch (error) {
      console.error(`Failed to set voice to ${voiceId}:`, error);
      return false;
    }
  }

  public async setRate(rate: number): Promise<boolean> {
    try {
      // Rate values typically range from 0.1 to 1
      await Tts.setDefaultRate(rate);
      return true;
    } catch (error) {
      console.error(`Failed to set rate to ${rate}:`, error);
      return false;
    }
  }

  public async setPitch(pitch: number): Promise<boolean> {
    try {
      // Pitch values typically range from 0.5 to 2
      await Tts.setDefaultPitch(pitch);
      return true;
    } catch (error) {
      console.error(`Failed to set pitch to ${pitch}:`, error);
      return false;
    }
  }

  public isSpeakingNow(): boolean {
    return this.isSpeaking;
  }
}

export default SpeechService.getInstance();
