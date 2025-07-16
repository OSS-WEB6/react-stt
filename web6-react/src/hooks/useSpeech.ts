/*
STT(Speech To Text)
Web Speech API
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/* @types */
interface UseSpeechToTextOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

interface SpeechToTextResult {
  transcript: string;
  isListening: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  browserSupport: {
    isSupported: boolean;
    errorMessage: string | null;
  };
}

const useSpeech = (options?: UseSpeechToTextOptions): SpeechToTextResult => {
  const { continuous = false, interimResults = true, lang = 'ko-KR' } = options || {};

  const [transcript, setTranscript] = useState<string>('');
  const [currentInterimTranscript, setCurrentInterimTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  //Check Browser support check, Cross Browser
  const [browserSupport, setBrowserSupport] = useState<{
    isSupported: boolean;
    errorMessage: string | null;
  }>({
    isSupported: false,
    errorMessage: null,
  });

  // Check for browser support on mount
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setBrowserSupport({
        isSupported: false,
        errorMessage:
          'Your browser does not support the Web Speech API. Please try Chrome or Edge.',
      });
      return;
    }

    setBrowserSupport({
      isSupported: true,
      errorMessage: null,
    });

    // Use webkitSpeechRecognition for older Chrome versions, otherwise SpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    if (recognitionRef.current) {
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.lang = lang;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        //말하기 끝났는지 판단해서 이어 붙이기
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        // isFinal == true -> transcript에 누적
        if (final) {
          setTranscript((prev) => prev + final + ' '); // 공백 추가하여 단어 구분
          setCurrentInterimTranscript(''); // 최종 결과로 확정 -> 임시 스크립트 초기화
        }

        // 중간 결과가 있고, interimResults 옵션이 true일 경우에만 업데이트
        if (interim && interimResults) {
          setCurrentInterimTranscript(interim);
        }
      };

      //start 될때 이벤트 동작
      recognitionRef.current.onstart = () => {
        console.log('STT: Recognition started, setting isListening to true.');
        setIsListening(true);
        setError(null);
        setTranscript('');
        setCurrentInterimTranscript('');
      };

      //stop 될때 이벤트 동작
      recognitionRef.current.onend = () => {
        console.log('STT: Recognition ended, setting isListening to false.');
        setIsListening(false);

        if (currentInterimTranscript) {
          setTranscript((prev) => prev + currentInterimTranscript + ' ');
          setCurrentInterimTranscript('');
        }
      };

      //error 처리 이벤트 동작
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        let errorMessage = `Speech recognition error: ${event.error}`;
        if (event.error === 'no-speech') {
          errorMessage = 'No speech was detected. Please try again.';
        } else if (event.error === 'not-allowed') {
          errorMessage =
            'Microphone access was denied. Please allow microphone access in your browser settings.';
        } else if (event.error === 'aborted') {
          errorMessage = 'Speech recognition was aborted.';
        } else if (event.error === 'network') {
          errorMessage = 'Network error during speech recognition.';
        }
        setError(errorMessage);
        console.error(event);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.lang = lang;
      console.log('STT: Recognition options updated.');
    }
  }, [continuous, interimResults, lang]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && browserSupport.isSupported) {
      try {
        recognitionRef.current.start();
      } catch (e: any) {
        if (e.name === 'InvalidStateError') {
          setError('Speech recognition is already active. Please stop before starting again.');
        } else {
          setError(`Error starting speech recognition: ${e.message}`);
        }
        console.error('Error starting speech recognition:', e);
      }
    } else if (!browserSupport.isSupported) {
      setError(browserSupport.errorMessage);
    }
  }, [browserSupport.isSupported, browserSupport.errorMessage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    transcript: transcript + currentInterimTranscript,
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening,
    browserSupport,
  };
};

export { useSpeech };
