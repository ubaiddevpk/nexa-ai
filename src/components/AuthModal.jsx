import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, Cloud, History, Shield, Lock, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, handleGoogleSuccess } = useAuth();
  const [error, setError] = useState(null);

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#17141e] border border-[#2d2938] rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-950/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button with Cross */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[#9c93a8] hover:text-white rounded-xl hover:bg-[#201c2a] border border-transparent hover:border-[#2d2938] transition-all"
          title="Close (Continue as Guest)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-900/40 mb-3">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide">Sign in to Nexa AI</h3>
          <p className="text-xs text-[#9c93a8] mt-1.5 leading-relaxed max-w-xs">
            Connect your Google account to unlock full cloud synchronization and keep your history safe.
          </p>
        </div>

        {/* Benefits Highlight Box */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#0d0b11] border border-[#2d2938]/80 space-y-2 text-xs">
          <div className="flex items-start gap-2.5 text-[#e5e4e7]">
            <Cloud className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Cloud Storage:</strong> With login, all your chats, document uploads, and PDF context are permanently saved to MongoDB.</span>
          </div>
          <div className="flex items-start gap-2.5 text-[#e5e4e7]">
            <History className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span><strong className="text-white">Cross-Device Sync:</strong> Access your chat history anytime across all your devices without data loss.</span>
          </div>
        </div>

        {/* Error notification if any */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign In Button Container */}
        <div className="flex flex-col items-center justify-center gap-3 my-4">
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setError(null);
                  await handleGoogleSuccess(credentialResponse);
                } catch (err) {
                  setError(err.message || 'Google authentication failed');
                }
              }}
              onError={() => {
                setError('Google Sign-In failed or was cancelled. Please try again.');
              }}
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
              locale="en"
            />
          </div>

          <button
            onClick={closeAuthModal}
            className="text-[11px] text-[#9c93a8] hover:text-[#e5e4e7] underline underline-offset-4 pt-1 transition-colors"
          >
            Continue as Guest (Local Storage only)
          </button>
        </div>

        {/* Footer Security Badges */}
        <div className="pt-4 border-t border-[#2d2938] flex items-center justify-center gap-6 text-[11px] text-[#6b6375]">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            256-bit Secure
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            OAuth 2.0 Verified
          </span>
        </div>
      </div>
    </div>
  );
}
