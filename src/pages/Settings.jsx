import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Save, 
  AlertCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function SettingsView() {
  const [customApiKey, setCustomApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('nexa_custom_gemini_api_key');
    if (savedKey) {
      setCustomApiKey(savedKey);
      setHasCustomKey(true);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (customApiKey.trim()) {
      localStorage.setItem('nexa_custom_gemini_api_key', customApiKey.trim());
      setHasCustomKey(true);
    } else {
      localStorage.removeItem('nexa_custom_gemini_api_key');
      setHasCustomKey(false);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRemove = () => {
    localStorage.removeItem('nexa_custom_gemini_api_key');
    setCustomApiKey('');
    setHasCustomKey(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d0b11] h-screen overflow-y-auto px-6 md:px-12 py-8">
      {/* Header */}
      <div className="border-b border-[#2d2938] pb-6 mb-8">
        <h2 className="text-2xl font-bold text-white tracking-wide">Settings</h2>
        <p className="text-sm text-[#9c93a8] mt-1">
          Configure your Google Gemini API key to use your own quota and tier, or leave blank to use the default system key.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        
        {/* Status Banner */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
          hasCustomKey 
            ? 'bg-purple-950/20 border-purple-800/40 text-purple-200'
            : 'bg-[#17141e] border-[#2d2938] text-[#9c93a8]'
        }`}>
          {hasCustomKey ? (
            <Zap className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <p className="font-semibold text-white">
              {hasCustomKey 
                ? 'Using Custom Gemini API Key' 
                : 'Using Default System Gemini Tier'}
            </p>
            <p className="leading-relaxed">
              {hasCustomKey 
                ? 'Your requests are authenticated using your personal Google Gemini API key and quota.' 
                : 'No personal API key configured. Nexa AI is running seamlessly with the default shared backend API key.'}
            </p>
          </div>
        </div>

        {/* Gemini API Key Form */}
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Google Gemini API Key</h3>
                <p className="text-xs text-[#9c93a8]">Provide your custom key from Google AI Studio</p>
              </div>
            </div>
            
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium transition-colors"
            >
              <span>Get API Key</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#9c93a8] font-medium">Gemini API Key</label>
            <input 
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="AIzaSy...................................."
              className="w-full px-4 py-3 rounded-xl bg-[#0d0b11] border border-[#2d2938] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm text-white font-mono placeholder:text-[#4d465c] transition-all"
            />
            <p className="text-[11px] text-[#6b6375] flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#9c93a8]" />
              <span>Your API key is securely stored in your browser's local storage and sent with your requests.</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button 
              type="submit"
              className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/20 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save API Key</span>
            </button>

            {hasCustomKey && (
              <button 
                type="button"
                onClick={handleRemove}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#201c2a] hover:bg-red-950/30 text-[#9c93a8] hover:text-red-400 border border-[#2d2938] hover:border-red-800/40 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear & Use Default</span>
              </button>
            )}

            {isSaved && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings saved successfully</span>
              </span>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
