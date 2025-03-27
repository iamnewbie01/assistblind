// src/hooks/useVoiceRecognition.ts
import { useState, useEffect, useCallback } from 'react';
import VoiceRecognitionService from '../services/VoiceRecognitionService';

export const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Get singleton instance
  const voiceService = VoiceRecognitionService.getInstance();
  
  // Set up event listeners
  useEffect(() => {
    const handleResults = (data: {text: string, allResults: string[]}) => {
      setResults(data.allResults);
      setIsListening(false);
    };
    
    const handlePartialResults = (data: {text: string, allResults: string[]}) => {
      setPartialResults(data.allResults);
    };
    
    const handleError = (errorMessage: string) => {
      setError(errorMessage);
      setIsListening(false);
    };
    
    const handleSpeechEnd = () => {
      setIsListening(false);
    };
    
    // Register listeners
    voiceService.on('results', handleResults);
    voiceService.on('partialResults', handlePartialResults);
    voiceService.on('error', handleError);
    voiceService.on('speechEnd', handleSpeechEnd);
    
    // Cleanup function
    return () => {
      voiceService.off('results', handleResults);
      voiceService.off('partialResults', handlePartialResults);
      voiceService.off('error', handleError);
      voiceService.off('speechEnd', handleSpeechEnd);
    };
  }, []);
  
  // Start listening function
  const startListening = useCallback(async (options = {}) => {
    try {
      setError(null);
      const hasPermission = await voiceService.checkPermission();
      
      if (!hasPermission) {
        const granted = await voiceService.requestPermission();
        if (!granted) {
          setError('Microphone permission is required for voice recognition');
          return false;
        }
      }
      
      const started = await voiceService.startListening(options);
      if (started) {
        setIsListening(true);
        setResults([]);
        setPartialResults([]);
      }
      return started;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      return false;
    }
  }, []);
  
  // Stop listening function
  const stopListening = useCallback(async () => {
    await voiceService.stopListening();
    setIsListening(false);
  }, []);
  
  // Cancel listening function
  const cancelListening = useCallback(async () => {
    await voiceService.cancelListening();
    setIsListening(false);
    setResults([]);
    setPartialResults([]);
  }, []);
  
  return {
    isListening,
    results,
    partialResults,
    error,
    startListening,
    stopListening,
    cancelListening
  };
};
