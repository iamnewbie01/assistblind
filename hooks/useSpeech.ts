// src/hooks/useSpeech.ts
import {useState, useEffect, useCallback} from 'react';
import SpeechService from '../services/SpeechService';
import Tts from 'react-native-tts';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [voices, setVoices] = useState<any[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en-US');
  const [currentVoice, setCurrentVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(0.5);
  const [pitch, setPitch] = useState<number>(1.0);

  // Initialize and load available voices
  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await SpeechService.getVoices();
      setVoices(availableVoices);
    };

    // Set up event listeners for speech state changes
    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechFinish = () => setIsSpeaking(false);
    const handleSpeechCancel = () => setIsSpeaking(false);
    const handleSpeechPause = () => setIsPaused(true);
    const handleSpeechResume = () => setIsPaused(false);

    // Add event listeners
    const subscriptionStart = Tts.addListener('tts-start', handleSpeechStart);
    const subscriptionFinish = Tts.addListener(
      'tts-finish',
      handleSpeechFinish,
    );
    const subscriptionCancel = Tts.addListener(
      'tts-cancel',
      handleSpeechCancel,
    );

    // Load voices
    loadVoices();

    // Cleanup function
    return () => {
      subscriptionCancel.remove();
      subscriptionFinish.remove();
      subscriptionStart.remove();
    };
  }, []);

  // Speak text
  const speak = useCallback(async (text: string, options?: { onDone?: () => void }): Promise<boolean> => {
    const result = await SpeechService.speak(text, options);
    return result;
  }, []);

  // Stop speaking
  const stop = useCallback(async (): Promise<void> => {
    await SpeechService.stop();
    setIsPaused(false);
  }, []);

  // Pause speaking
  const pause = useCallback(async (): Promise<void> => {
    await SpeechService.pause();
    setIsPaused(true);
  }, []);

  // Resume speaking
  const resume = useCallback(async (): Promise<void> => {
    await SpeechService.resume();
    setIsPaused(false);
  }, []);

  // Set language
  const setLanguage = useCallback(
    async (language: string): Promise<boolean> => {
      const result = await SpeechService.setLanguage(language);
      if (result) {
        setCurrentLanguage(language);
      }
      return result;
    },
    [],
  );

  // Set voice
  const setVoice = useCallback(async (voiceId: string): Promise<boolean> => {
    const result = await SpeechService.setVoice(voiceId);
    if (result) {
      setCurrentVoice(voiceId);
    }
    return result;
  }, []);

  // Set speech rate
  const setSpeechRate = useCallback(
    async (newRate: number): Promise<boolean> => {
      const result = await SpeechService.setRate(newRate);
      if (result) {
        setRate(newRate);
      }
      return result;
    },
    [],
  );

  // Set speech pitch
  const setSpeechPitch = useCallback(
    async (newPitch: number): Promise<boolean> => {
      const result = await SpeechService.setPitch(newPitch);
      if (result) {
        setPitch(newPitch);
      }
      return result;
    },
    [],
  );

  // Speak with accessibility considerations
  const speakWithPriority = useCallback(
    async (
      text: string,
      priority: 'high' | 'normal' | 'low' = 'normal',
    ): Promise<boolean> => {
      // For high priority announcements, always interrupt current speech
      if (priority === 'high') {
        return await speak(text);
      }

      // For normal priority, speak if not already speaking
      if (priority === 'normal' && !isSpeaking) {
        return await speak(text);
      }

      // For low priority, only speak if nothing else is happening
      if (priority === 'low' && !isSpeaking) {
        return await speak(text);
      }

      return false;
    },
    [isSpeaking, speak],
  );

  return {
    isSpeaking,
    isPaused,
    voices,
    currentLanguage,
    currentVoice,
    rate,
    pitch,
    speak,
    stop,
    pause,
    resume,
    setLanguage,
    setVoice,
    setSpeechRate,
    setSpeechPitch,
    speakWithPriority,
  };
};
