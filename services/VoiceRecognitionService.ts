import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechVolumeChangeEvent,
} from '@react-native-voice/voice';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {EventEmitter} from 'events';

// Define types for our service
type VoiceRecognitionOptions = {
  language?: string;
  maxDuration?: number;
  onPartialResult?: (text: string) => void;
  onError?: (error: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type VoiceRecognitionResult = {
  text: string;
  isFinal: boolean;
};

class VoiceRecognitionService {
  private static instance: VoiceRecognitionService;
  private eventEmitter: EventEmitter;
  private isListening: boolean = false;
  private language: string = 'en-IN';
  private results: string[] = [];
  private partialResults: string[] = [];
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private maxDuration: number = 30000; // Default max duration: 30 seconds

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.setupVoiceListeners();
  }

  /**
   * Get the singleton instance of VoiceRecognitionService
   */
  public static getInstance(): VoiceRecognitionService {
    if (!VoiceRecognitionService.instance) {
      VoiceRecognitionService.instance = new VoiceRecognitionService();
    }
    return VoiceRecognitionService.instance;
  }

  /**
   * Set up Voice recognition event listeners
   */
  private setupVoiceListeners(): void {
    Voice.onSpeechStart = this.handleSpeechStart;
    Voice.onSpeechRecognized = this.handleSpeechRecognized;
    Voice.onSpeechEnd = this.handleSpeechEnd;
    Voice.onSpeechError = this.handleSpeechError;
    Voice.onSpeechResults = this.handleSpeechResults;
    Voice.onSpeechPartialResults = this.handleSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.handleSpeechVolumeChanged;
  }

  /**
   * Start listening for voice input
   * @param options Configuration options for voice recognition
   */
  public async startListening(
    options: VoiceRecognitionOptions = {},
  ): Promise<boolean> {
    if (this.isListening) {
      console.warn('Voice recognition is already active');
      return false;
    }

    try {
      this.language = options.language || 'en-US';
      this.maxDuration = options.maxDuration || 30000;

      // Reset state
      this.results = [];
      this.partialResults = [];

      // Start voice recognition
      await Voice.start(this.language);
      this.isListening = true;

      // Set timeout to automatically stop listening after maxDuration
      if (this.maxDuration > 0) {
        this.timeoutId = setTimeout(() => {
          this.stopListening();
        }, this.maxDuration);
      }

      this.eventEmitter.emit('recognitionStarted');
      return true;
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      this.eventEmitter.emit(
        'error',
        `Failed to start voice recognition: ${error}`,
      );
      return false;
    }
  }

  /**
   * Stop listening for voice input
   */
  public async stopListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    try {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
      this.eventEmitter.emit(
        'error',
        `Failed to stop voice recognition: ${error}`,
      );
    }
  }

  /**
   * Cancel voice recognition
   */
  public async cancelListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    try {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }

      await Voice.cancel();
      this.isListening = false;
      this.eventEmitter.emit('recognitionCancelled');
    } catch (error) {
      console.error('Error cancelling voice recognition:', error);
      this.eventEmitter.emit(
        'error',
        `Failed to cancel voice recognition: ${error}`,
      );
    }
  }

  /**
   * Destroy the voice recognition instance
   */
  public async destroy(): Promise<void> {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
    } catch (error) {
      console.error('Error destroying voice recognition:', error);
    }
  }

  /**
   * Check if microphone permission is granted
   */
  public async checkPermission(): Promise<boolean> {
    try {
      const result = await Voice.isAvailable();
      return result > 0;
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return false;
    }
  }

  /**
   * Request microphone permission
   */
  public async requestPermission(): Promise<boolean> {
    try {
      const result = await Voice.isAvailable();
      return result > 0;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  }

  /**
   * Send recognition results to server for processing
   * @param text The recognized text to send to the server
   */
  public async sendToServer(text: string): Promise<any> {
    try {
      const response = await fetch(
        'http://your-express-server.com/api/transcribe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({text}),
        },
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending recognition results to server:', error);
      throw error;
    }
  }

  /**
   * Register event listeners
   * @param event Event name
   * @param callback Callback function
   */
  public on(event: string, callback: (...args: any[]) => void): void {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Remove event listener
   * @param event Event name
   * @param callback Callback function
   */
  public off(event: string, callback: (...args: any[]) => void): void {
    this.eventEmitter.off(event, callback);
  }

  // Event handlers
  private handleSpeechStart = (e: any): void => {
    console.log('Speech recognition started', e);
    this.eventEmitter.emit('speechStart', e);
  };

  private handleSpeechRecognized = (e: SpeechRecognizedEvent): void => {
    console.log('Speech recognized', e);
    this.eventEmitter.emit('speechRecognized', e);
  };

  private handleSpeechEnd = (e: any): void => {
    console.log('Speech recognition ended', e);
    this.isListening = false;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    const finalText = this.results.length > 0 ? this.results[0] : '';
    this.eventEmitter.emit('speechEnd', {
      text: finalText,
      allResults: this.results,
    });
  };

  private handleSpeechError = (e: SpeechErrorEvent): void => {
    console.error('Speech recognition error', e);
    this.isListening = false;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.eventEmitter.emit(
      'error',
      e.error?.message || 'Unknown speech recognition error',
    );
  };

  private handleSpeechResults = (e: SpeechResultsEvent): void => {
    console.log('Speech results', e);
    if (e.value && e.value.length > 0) {
      this.results = e.value;
      this.eventEmitter.emit('results', {
        text: e.value[0],
        allResults: e.value,
      });
    }
  };

  private handleSpeechPartialResults = (e: SpeechResultsEvent): void => {
    console.log('Partial speech results', e);
    if (e.value && e.value.length > 0) {
      this.partialResults = e.value;
      this.eventEmitter.emit('partialResults', {
        text: e.value[0],
        allResults: e.value,
      });
    }
  };

  private handleSpeechVolumeChanged = (e: SpeechVolumeChangeEvent): void => {
    this.eventEmitter.emit('volumeChanged', e);
  };
}

export default VoiceRecognitionService;
