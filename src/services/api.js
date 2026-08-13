/**
 * api.js - Central API service layer for NexaAI frontend
 * All backend API calls are routed through this file.
 * In Phase 2, replace mock state in App.jsx with these functions.
 */

const BASE_URL = 'http://localhost:5000/api';

// ─── Chat APIs ────────────────────────────────────────────────────────────────

/** Fetch all chats (active + archived) */
export async function fetchAllChats() {
  const res = await fetch(`${BASE_URL}/chats`);
  if (!res.ok) throw new Error('Failed to fetch chats');
  return res.json();
}

/** Create a new empty chat session */
export async function createChat(title = 'New Chat Session') {
  const res = await fetch(`${BASE_URL}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('Failed to create chat');
  return res.json();
}

/** Update chat properties (e.g. archive, title, activePDF) */
export async function updateChat(chatId, updates) {
  const res = await fetch(`${BASE_URL}/chats/${chatId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update chat');
  return res.json();
}

/** Permanently delete a chat session */
export async function deleteChat(chatId) {
  const res = await fetch(`${BASE_URL}/chats/${chatId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete chat');
  return res.json();
}

/** Send a user message and receive AI-generated reply */
export async function sendMessage(chatId, content) {
  const res = await fetch(`${BASE_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to send message');
  }
  return res.json();
}

/** Upload a PDF file to attach as context to a specific chat */
export async function uploadPDF(chatId, file) {
  const formData = new FormData();
  formData.append('pdf', file);
  const res = await fetch(`${BASE_URL}/chats/${chatId}/pdf`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload PDF');
  return data;
}

// ─── Voice APIs ───────────────────────────────────────────────────────────────

/** 
 * Transcribe an audio Blob using Whisper API
 * @param {Blob} audioBlob - raw audio blob from MediaRecorder
 * @returns {string} transcribed text
 */
export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  const res = await fetch(`${BASE_URL}/voice/transcribe`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to transcribe audio');
  const data = await res.json();
  return data.text;
}

/**
 * Convert text to speech audio using TTS API
 * @param {string} text - text to speak
 * @returns {Blob} mp3 audio blob
 */
export async function textToSpeech(text) {
  const res = await fetch(`${BASE_URL}/voice/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to synthesize speech');
  return res.blob(); // Returns audio Blob for playback
}

// ─── Image APIs ───────────────────────────────────────────────────────────────

/**
 * Generate an image via DALL-E 3
 * @param {string} prompt - image description
 * @returns {string} image URL
 */
export async function generateImage(prompt) {
  const res = await fetch(`${BASE_URL}/image/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('Failed to generate image');
  const data = await res.json();
  return data.imageUrl;
}
