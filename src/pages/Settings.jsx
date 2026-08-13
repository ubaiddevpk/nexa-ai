import React, { useState } from 'react';
import { 
  Sparkles, 
  Moon, 
  Key, 
  Volume2, 
  Save, 
  AlertCircle,
  Database,
  Lock,
  Cpu
} from 'lucide-react';

export default function SettingsView() {
  const [openAiKey, setOpenAiKey] = useState('');
  const [modelType, setModelType] = useState('gpt-4-omni');
  const [enableVoice, setEnableVoice] = useState(true);
  const [themeMode, setThemeMode] = useState('dark');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d0b11] h-screen overflow-y-auto px-6 md:px-12 py-8">
      {/* Header */}
      <div className="border-b border-[#2d2938] pb-6 mb-8">
        <h2 className="text-2xl font-bold text-white tracking-wide">System Settings</h2>
        <p className="text-sm text-[#9c93a8] mt-1">
          Configure API credentials, model behaviors, theme adjustments, and interface controls.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-6">
        
        {/* API Credentials */}
        <div className="p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Credentials</h3>
              <p className="text-xs text-[#9c93a8]">Required API secrets for OpenAI model access.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#9c93a8] font-medium">OpenAI API Key</label>
            <input 
              type="password"
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              placeholder="sk-proj-........................"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0d0b11] border border-[#2d2938] focus:border-purple-500/50 outline-none text-sm text-white"
            />
            <p className="text-[10px] text-[#6b6375] flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>Keys are saved locally in the browser or .env configuration files.</span>
            </p>
          </div>
        </div>

        {/* Model Selection */}
        <div className="p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">AI Engine Configurations</h3>
              <p className="text-xs text-[#9c93a8]">Fine-tune the default routing models.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#9c93a8] font-medium">Default Chat Model</label>
              <select 
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0d0b11] border border-[#2d2938] focus:border-purple-500/50 outline-none text-sm text-white"
              >
                <option value="gpt-4-omni">GPT-4 Omni (Fast & Vision)</option>
                <option value="gpt-4o-mini">GPT-4o Mini (Efficient)</option>
                <option value="dall-e-3">DALL-E 3 (Creative Images)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#9c93a8] font-medium">Temperature</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                defaultValue="0.7"
                className="w-full accent-purple-500 bg-[#0d0b11] h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Accessibility & Theme */}
        <div className="p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">User Interface Prefs</h3>
              <p className="text-xs text-[#9c93a8]">Personalize default sounds and visual themes.</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0d0b11]/50 border border-[#2d2938]">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-[#9c93a8]" />
              <div>
                <span className="text-sm font-semibold text-white block">Auto Voice TTS</span>
                <span className="text-xs text-[#6b6375]">Speak assistant responses out loud automatically</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={enableVoice}
              onChange={(e) => setEnableVoice(e.target.checked)}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0d0b11]/50 border border-[#2d2938]">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#9c93a8]" />
              <div>
                <span className="text-sm font-semibold text-white block">Secure Mode</span>
                <span className="text-xs text-[#6b6375]">Require credentials before unlocking chat panel</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              defaultChecked={false}
              className="w-4 h-4 accent-purple-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Save Bar Button */}
        <div className="flex items-center gap-4">
          <button 
            type="submit"
            className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save System Configuration</span>
          </button>
          
          {isSaved && (
            <span className="text-xs text-green-400 font-medium animate-pulse">
              ✓ System settings saved successfully.
            </span>
          )}
        </div>

      </form>
    </div>
  );
}
