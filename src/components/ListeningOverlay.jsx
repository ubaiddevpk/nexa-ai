import React, { useState, useRef, useEffect } from 'react';
import { X, Square } from 'lucide-react';
import { transcribeAudio } from '../services/api';

/**
 * ListeningOverlay Component
 * - Records audio from the microphone using the MediaRecorder API.
 * - On Stop, sends the recorded audio blob to the Whisper transcription endpoint.
 * - On success, calls onTranscriptionComplete(text) to inject the text into the chat input.
 */
export default function ListeningOverlay({ isOpen, onClose, onTranscriptionComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks to release the microphone
      mediaRecorderRef.current.stream?.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
  };

  const handleStop = async () => {
    if (!mediaRecorderRef.current) return;

    setIsTranscribing(true);

    // Wait for the recorder to fully stop and collect all audio chunks
    await new Promise((resolve) => {
      mediaRecorderRef.current.onstop = resolve;
      stopRecording();
    });

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const text = await transcribeAudio(audioBlob);
      if (text && text.trim()) {
        onTranscriptionComplete(text);
      }
      onClose();
    } catch (err) {
      setError('Transcription failed. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCancel = () => {
    stopRecording();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0b11]/95 transition-opacity duration-300">

      {/* Listening pulse rings */}
      <div className="relative flex items-center justify-center w-64 h-64">

        {/* Animated concentric rings */}
        <div className={`absolute inset-0 rounded-full border transition-all ${isRecording ? 'bg-purple-500/5 border-purple-500/10 animate-ping [animation-duration:3s]' : 'border-transparent'}`} />
        <div className={`absolute inset-8 rounded-full border transition-all ${isRecording ? 'bg-purple-500/10 border-purple-500/20 animate-ping [animation-duration:2s]' : 'border-transparent'}`} />
        <div className={`absolute inset-16 rounded-full border transition-all ${isRecording ? 'bg-purple-500/20 border-purple-500/30 animate-pulse [animation-duration:1.5s]' : 'border-transparent'}`} />

        {/* Core speaker avatar circle */}
        <div className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl border-4 border-[#17141e] transition-all duration-300 ${
          isTranscribing
            ? 'bg-indigo-800'
            : isRecording
            ? 'bg-gradient-to-tr from-purple-700 to-indigo-600 hover:scale-105'
            : 'bg-[#201c2a]'
        }`}>
          {isTranscribing ? (
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="text-3xl font-bold text-white tracking-widest select-none">N</span>
          )}
        </div>
      </div>

      {/* Status text */}
      <div className="text-center space-y-2 mt-8 px-6 max-w-sm">
        {isTranscribing ? (
          <>
            <h3 className="text-2xl font-bold text-white tracking-wide">Transcribing...</h3>
            <p className="text-sm text-[#9c93a8]">Processing your voice, please wait.</p>
          </>
        ) : error ? (
          <>
            <h3 className="text-2xl font-bold text-red-400 tracking-wide">Error</h3>
            <p className="text-sm text-[#9c93a8]">{error}</p>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-bold text-white tracking-wide">Listening...</h3>
            <p className="text-sm text-[#9c93a8]">Speak now, NexaAI is ready.</p>
          </>
        )}
      </div>

      {/* Stop & Cancel action controls */}
      {!isTranscribing && (
        <div className="flex items-center gap-6 mt-16">

          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="flex flex-col items-center gap-2 group transition-all"
          >
            <div className="w-14 h-14 rounded-full border border-[#2d2938] bg-[#17141e] hover:bg-[#201c2a] flex items-center justify-center text-[#9c93a8] hover:text-white transition-all shadow-lg active:scale-95 group-hover:border-[#9c93a8]/30">
              <X className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#9c93a8] group-hover:text-white">Cancel</span>
          </button>

          {/* Stop & Transcribe Button */}
          <button
            onClick={handleStop}
            className="flex flex-col items-center gap-2 group transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-red-950/40 border border-red-900/50 hover:bg-red-900/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-all shadow-lg active:scale-95 group-hover:border-red-500/50">
              <Square className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xs text-red-400 group-hover:text-red-300">Stop</span>
          </button>
        </div>
      )}
    </div>
  );
}
