import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ListeningOverlay from './components/ListeningOverlay';
import AuthModal from './components/AuthModal';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Help from './pages/Help';
import NexaLogo from './components/NexaLogo';
import { useAuth } from './context/AuthContext';
import {
  fetchAllChats,
  createChat,
  updateChat,
  deleteChat,
  sendMessage,
  uploadPDF,
  transcribeAudio
} from './services/api';

const LOCAL_STORAGE_CHATS_KEY = 'nexa_guest_chats';

export default function App() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeView, setActiveView] = useState('chat');
  const [activeChatId, setActiveChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingPDF, setIsUploadingPDF] = useState(false);
  const [draftVoiceText, setDraftVoiceText] = useState('');
  const [sendError, setSendError] = useState(null);
  const abortControllerRef = useRef(null); // tracks in-flight Gemini request

  // ─── Load chats on mount and when authentication state changes ─────────────
  useEffect(() => {
    loadChats();
  }, [user, isAuthenticated]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        // Authenticated: fetch user's synced chats from MongoDB
        const data = await fetchAllChats();
        setChats(data);
      } else {
        // Guest mode: load from localStorage
        const stored = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY);
        if (stored) {
          try {
            setChats(JSON.parse(stored));
          } catch (e) {
            setChats([]);
          }
        } else {
          // If no local chats exist, try fetching default chats or initialize empty
          try {
            const data = await fetchAllChats();
            setChats(data);
            localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(data));
          } catch {
            setChats([]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to persist chats to localStorage when user is in guest mode
  const saveGuestChats = (newChats) => {
    if (!isAuthenticated) {
      localStorage.setItem(LOCAL_STORAGE_CHATS_KEY, JSON.stringify(newChats));
    }
  };

  // ─── Create a new chat session ─────────────────────────────────────────────
  const handleNewChat = async () => {
    try {
      const newChat = await createChat('New Chat Session');
      setChats(prev => {
        const updated = [newChat, ...prev];
        saveGuestChats(updated);
        return updated;
      });
      setActiveChatId(newChat._id);
      setActiveView('chat');
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setActiveView('chat');
  };

  // ─── Archive a chat (set archived: true) ───────────────────────────────────
  const handleArchiveChat = async (id) => {
    try {
      const updated = await updateChat(id, { archived: true });
      setChats(prev => {
        const next = prev.map(c => c._id === id ? updated : c);
        saveGuestChats(next);
        return next;
      });
      if (activeChatId === id) setActiveChatId(null);
    } catch (err) {
      console.error('Failed to archive chat:', err);
    }
  };

  // ─── Restore a chat (set archived: false) ──────────────────────────────────
  const handleRestoreChat = async (id) => {
    try {
      const updated = await updateChat(id, { archived: false });
      setChats(prev => {
        const next = prev.map(c => c._id === id ? updated : c);
        saveGuestChats(next);
        return next;
      });
    } catch (err) {
      console.error('Failed to restore chat:', err);
    }
  };

  // ─── Delete a chat permanently ────────────────────────────────────────────
  const handleDeleteChat = async (id) => {
    try {
      await deleteChat(id);
      setChats(prev => {
        const next = prev.filter(c => c._id !== id);
        saveGuestChats(next);
        return next;
      });
      if (activeChatId === id) setActiveChatId(null);
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  // ─── Send message + receive AI response ───────────────────────────────────
  const handleSendMessage = async (text) => {
    let currentId = activeChatId;

    // If no session is active, create one first
    if (!currentId) {
      try {
        const title = text.length > 30 ? text.substring(0, 30) + '...' : text;
        const newChat = await createChat(title);
        setChats(prev => {
          const next = [newChat, ...prev];
          saveGuestChats(next);
          return next;
        });
        setActiveChatId(newChat._id);
        currentId = newChat._id;
      } catch (err) {
        console.error('Failed to create chat:', err);
        return;
      }
    }

    // Optimistic update: show user message immediately before API responds
    const optimisticMsg = {
      _id: `optimistic-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setChats(prev => {
      const next = prev.map(c =>
        c._id === currentId
          ? { ...c, messages: [...(c.messages || []), optimisticMsg] }
          : c
      );
      saveGuestChats(next);
      return next;
    });

    try {
      // Create a new AbortController for this request so it can be cancelled
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsSending(true);
      setSendError(null);
      const updatedChat = await sendMessage(currentId, text, controller.signal);
      abortControllerRef.current = null;
      // Replace optimistic state with real server response
      setChats(prev => {
        const next = prev.map(c => c._id === currentId ? updatedChat : c);
        saveGuestChats(next);
        return next;
      });

      // Refresh token counter in profile if authenticated
      if (refreshUser) {
        refreshUser();
      }
    } catch (err) {
      abortControllerRef.current = null;

      // Silently ignore abort errors — user intentionally cancelled
      if (err.name === 'AbortError') {
        // Remove the optimistic message when user cancels
        setChats(prev => {
          const next = prev.map(c =>
            c._id === currentId
              ? { ...c, messages: c.messages.filter(m => m._id !== optimisticMsg._id) }
              : c
          );
          saveGuestChats(next);
          return next;
        });
        setIsSending(false);
        return;
      }

      console.error('Failed to send message:', err);

      // Show a friendly error banner
      const errMsg = err.message || '';
      if (errMsg.includes('overloaded') || errMsg.includes('temporarily')) {
        setSendError('⚡ Gemini AI is temporarily overloaded. Please wait a moment and try again.');
      } else if (errMsg.includes('rate') || errMsg.includes('Rate limit')) {
        setSendError('🕐 Rate limit reached. Please wait a few seconds before sending another message.');
      } else {
        setSendError('❌ Failed to get a response. Please check your connection and try again.');
      }
      // Auto-clear error after 6s
      setTimeout(() => setSendError(null), 6000);

      // Remove optimistic message on failure
      setChats(prev => {
        const next = prev.map(c =>
          c._id === currentId
            ? { ...c, messages: c.messages.filter(m => m._id !== optimisticMsg._id) }
            : c
        );
        saveGuestChats(next);
        return next;
      });
    } finally {
      setIsSending(false);
    }
  };

  // ─── Cancel the in-flight Gemini request ───────────────────────────────────
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleSuggestionClick = (label) => {
    handleSendMessage(label);
  };

  // ─── Upload PDF to the active chat session ─────────────────────────────────
  const handleAttachPDF = async (file) => {
    let chatId = activeChatId;

    // Create a new chat first if none is active
    if (!chatId) {
      try {
        const newChat = await createChat('PDF: ' + file.name.replace('.pdf', ''));
        setChats(prev => {
          const next = [newChat, ...prev];
          saveGuestChats(next);
          return next;
        });
        setActiveChatId(newChat._id);
        chatId = newChat._id;
      } catch (err) {
        console.error('Failed to create chat for PDF:', err);
        alert('Could not create chat session. Is the backend server running?');
        return;
      }
    }

    try {
      setIsUploadingPDF(true);
      console.log(`Uploading PDF "${file.name}" to chat ${chatId}...`);
      const result = await uploadPDF(chatId, file);
      setChats(prev => {
        const next = prev.map(c =>
          c._id === chatId ? { ...c, activePDF: result.activePDF } : c
        );
        saveGuestChats(next);
        return next;
      });
      console.log('PDF upload success:', result.message);
    } catch (err) {
      console.error('Failed to upload PDF:', err);
      alert(`PDF upload failed: ${err.message}`);
    } finally {
      setIsUploadingPDF(false);
    }
  };

  // ─── Remove PDF context from the active chat session ──────────────────────
  const handleRemovePDF = async () => {
    if (!activeChatId) return;
    try {
      const updated = await updateChat(activeChatId, { activePDF: null });
      setChats(prev => {
        const next = prev.map(c => c._id === activeChatId ? updated : c);
        saveGuestChats(next);
        return next;
      });
    } catch (err) {
      console.error('Failed to remove PDF:', err);
    }
  };

  // ─── Handle Whisper transcription from ListeningOverlay ───────────────────
  const handleTranscriptionDraft = (text) => {
    if (text && text.trim()) {
      setDraftVoiceText(text);
      // Auto-clear after Dashboard useEffect picks it up
      setTimeout(() => setDraftVoiceText(''), 500);
    }
  };

  const currentChat = chats.find(c => c._id === activeChatId);

  // ─── Render active page view ───────────────────────────────────────────────
  const renderActiveView = () => {
    switch (activeView) {
      case 'chat':
        return (
          <Dashboard
            onMenuToggle={() => setIsSidebarOpen(true)}
            onVoiceToggle={() => setIsListening(true)}
            chatSession={currentChat}
            onSendMessage={handleSendMessage}
            onSuggestionClick={handleSuggestionClick}
            onAttachPDF={handleAttachPDF}
            onRemovePDF={handleRemovePDF}
            isSending={isSending}
            isUploadingPDF={isUploadingPDF}
            draftVoiceText={draftVoiceText}
            sendError={sendError}
            onStopGeneration={handleStopGeneration}
          />
        );
      case 'archive':
        return (
          <Archive
            chats={chats}
            onRestoreChat={handleRestoreChat}
            onDeleteChat={handleDeleteChat}
          />
        );
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      case 'help':
        return <Help />;
      default:
        return (
          <Dashboard
            onMenuToggle={() => setIsSidebarOpen(true)}
            onVoiceToggle={() => setIsListening(true)}
            chatSession={currentChat}
            onSendMessage={handleSendMessage}
            onSuggestionClick={handleSuggestionClick}
            onAttachPDF={handleAttachPDF}
            onRemovePDF={handleRemovePDF}
            isSending={isSending}
            onStopGeneration={handleStopGeneration}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0b11]">

      {/* Sidebar Navigation */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onArchiveChat={handleArchiveChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onSelectView={setActiveView}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {activeView !== 'chat' && (
          <div className="md:hidden flex items-center px-4 py-3 bg-[#17141e] border-b border-[#2d2938]">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-[#9c93a8] hover:text-white rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 ml-2">
              <NexaLogo className="w-5 h-5" animated={false} />
              <span className="font-semibold text-white capitalize">{activeView}</span>
            </div>
          </div>
        )}
        {renderActiveView()}
      </div>

      {/* Voice Listening Overlay — records mic and fills input field */}
      <ListeningOverlay
        isOpen={isListening}
        onClose={() => setIsListening(false)}
        onTranscriptionDraft={handleTranscriptionDraft}
      />

      {/* Google Sign-In First Time / On-Demand Modal */}
      <AuthModal />
    </div>
  );
}
