import React, { useState, useRef, useEffect } from 'react';
import { X, Square, AlertCircle, RefreshCw } from 'lucide-react';
import { transcribeAudio } from '../services/api';
import NexaLogo from './NexaLogo';

/**
 * ListeningOverlay Component
 * - Records audio from the microphone using MediaRecorder API.
 * - Also supports fallback via Web Speech Recognition API if available in browser.
 * - Sends audio to Gemini transcription endpoint with graceful handling.
 */
export default function ListeningOverlay({ isOpen, onClose, onTranscriptionDraft }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const webSpeechResultRef = useRef('');

  // Start recording when the overlay opens
  useEffect(() => {
    if (isOpen) {
      startRecording();
    } else {
      stopRecording();
    }

    // Cleanup on unmount
    return () => stopRecording();
  }, [isOpen]);

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      webSpeechResultRef.current = '';

      // Check if Web Speech Recognition is available in browser as real-time fast fallback
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                webSpeechResultRef.current += event.results[i][0].transcript + ' ';
              }
            }
          };
          recognition.onerror = (e) => console.log('WebSpeech fallback note:', e.error);
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (e) {
          console.log('SpeechRecognition init skipped:', e);
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine best supported audio mimeType
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(250); // Slice data every 250ms for reliable chunks
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      setError('Microphone access denied. Please ensure your browser allows microphone access.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
      } catch (e) {}
    }
    setIsRecording(false);
  };

  const handleStop = async () => {
    if (!mediaRecorderRef.current) return;

    setIsTranscribing(true);

    // Wait for recorder to stop and flush all audio chunks
    await new Promise((resolve) => {
      if (mediaRecorderRef.current.state === 'inactive') {
        resolve();
      } else {
        mediaRecorderRef.current.onstop = resolve;
        stopRecording();
      }
    });

    try {
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
      });

      console.log(`Audio recorded: ${audioBlob.size} bytes`);
      
      if (audioBlob.size < 500 && webSpeechResultRef.current.trim()) {
        // Fallback to browser recognition if audio buffer was too brief
        onTranscriptionDraft(webSpeechResultRef.current.trim());
        onClose();
        return;
      }

      let transcribedText = '';
      try {
        transcribedText = await transcribeAudio(audioBlob);
      } catch (apiErr) {
        console.warn('API transcription error, checking client fallback:', apiErr);
        if (webSpeechResultRef.current && webSpeechResultRef.current.trim()) {
          transcribedText = webSpeechResultRef.current.trim();
        } else {
          throw apiErr;
        }
      }

      if (transcribedText && transcribedText.trim()) {
        onTranscriptionDraft(transcribedText.trim());
        onClose();
      } else if (webSpeechResultRef.current && webSpeechResultRef.current.trim()) {
        onTranscriptionDraft(webSpeechResultRef.current.trim());
        onClose();
      } else {
        setError('No speech was detected. Please speak closer to your microphone and try again.');
      }
    } catch (err) {
      console.error('Final transcription failed:', err);
      setError(err.message || 'Transcription failed. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCancel = () => {
    stopRecording();
    onClose();
  };

  const handleRetry = () => {
    setError(null);
    startRecording();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0b11]/95 backdrop-blur-md transition-opacity duration-300">

      {/* Listening pulse rings with NexaLogo Core */}
      <div className="relative flex items-center justify-center w-64 h-64">

        {/* Animated concentric rings */}
        <div className={`absolute inset-0 rounded-full border transition-all ${isRecording ? 'bg-purple-500/5 border-purple-500/10 animate-ping [animation-duration:3s]' : 'border-transparent'}`} />
        <div className={`absolute inset-8 rounded-full border transition-all ${isRecording ? 'bg-purple-500/10 border-purple-500/20 animate-ping [animation-duration:2s]' : 'border-transparent'}`} />
        <div className={`absolute inset-16 rounded-full border transition-all ${isRecording ? 'bg-purple-500/20 border-purple-500/30 animate-pulse [animation-duration:1.5s]' : 'border-transparent'}`} />

        {/* Core NexaLogo container */}
        <div className={`relative w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-purple-500/40 transition-all duration-300 p-4 ${
          isTranscribing
            ? 'bg-[#1a1429] shadow-purple-900/50'
            : isRecording
            ? 'bg-[#17141e] shadow-purple-950/70 hover:scale-105'
            : 'bg-[#17141e]'
        }`}>
          <NexaLogo className="w-16 h-16" animated={true} isLoading={isTranscribing} />
        </div>
      </div>

      {/* Status text */}
      <div className="text-center space-y-2 mt-8 px-6 max-w-md">
        {isTranscribing ? (
          <>
            <h3 className="text-2xl font-bold text-white tracking-wide">Transcribing...</h3>
            <p className="text-xs text-[#9c93a8]">Processing speech with multimodal AI intelligence...</p>
          </>
        ) : error ? (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-red-400 tracking-wide flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Transcription Note</span>
            </h3>
            <p className="text-xs text-[#9c93a8] leading-relaxed">{error}</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-white tracking-wide">Listening...</h3>
            <p className="text-xs text-[#9c93a8]">Speak now, Nexa AI is listening to your prompt.</p>
          </>
        )}
      </div>

      {/* Action controls */}
      {!isTranscribing && (
        <div className="flex items-center gap-6 mt-12">

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="flex flex-col items-center gap-2 group transition-all"
          >
            <div className="w-14 h-14 rounded-2xl border border-[#2d2938] bg-[#17141e] hover:bg-[#201c2a] flex items-center justify-center text-[#9c93a8] hover:text-white transition-all shadow-lg active:scale-95 group-hover:border-[#9c93a8]/30">
              <X className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#9c93a8] group-hover:text-white">Cancel</span>
          </button>

          {/* If error: show Retry; else show Stop & Transcribe */}
          {error ? (
            <button
              onClick={handleRetry}
              className="flex flex-col items-center gap-2 group transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-950/40 border border-purple-800/50 hover:bg-purple-900/40 flex items-center justify-center text-purple-400 hover:text-purple-300 transition-all shadow-lg active:scale-95 group-hover:border-purple-500">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="text-xs text-purple-400 group-hover:text-purple-300">Try Again</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex flex-col items-center gap-2 group transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-900/50 hover:bg-red-900/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-all shadow-lg active:scale-95 group-hover:border-red-500/50">
                <Square className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xs text-red-400 group-hover:text-red-300">Stop & Transcribe</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
