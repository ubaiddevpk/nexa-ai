import React from 'react';
import { 
  HelpCircle, 
  Key, 
  BookOpen, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  FileText,
  Sparkles,
  Cpu
} from 'lucide-react';

export default function Help() {
  const steps = [
    {
      title: '1. Obtain your Gemini API Key',
      desc: 'Visit Google AI Studio (aistudio.google.com), sign in with your Google account, and click "Get API Key" to generate a free or pay-as-you-go Gemini API key.'
    },
    {
      title: '2. Open Nexa AI Settings',
      desc: 'In Nexa AI, click "Settings" in the left sidebar navigation menu.'
    },
    {
      title: '3. Paste & Save Key',
      desc: 'Paste your Gemini API key into the "Google Gemini API Key" field and click "Save API Key".'
    },
    {
      title: '4. Automatic Fallback',
      desc: 'If you ever remove or leave the API key blank, Nexa AI will automatically fall back to using the default system API key without interrupting your conversations.'
    }
  ];

  const faqList = [
    {
      q: 'Do I need my own Gemini API Key to use Nexa AI?',
      a: 'No, it is completely optional! Nexa AI works out of the box with the default system Gemini API key. Adding your own key is useful if you want to use your personal Google Cloud / AI Studio quota and rate limits.'
    },
    {
      q: 'Where is my API key stored?',
      a: 'Your API key is stored securely in your browser\'s local storage and transmitted directly in header requests to authenticate your Gemini generation requests.'
    },
    {
      q: 'How do I upload and chat with PDF documents?',
      a: 'In any chat session, click the "Attach PDF" paperclip button in the chat prompt bar to attach a document. Nexa AI will extract the content and provide accurate citations and answers based on your document.'
    },
    {
      q: 'How does Google Sign-In work?',
      a: 'Signing in with Google connects your session to your MongoDB cloud account, automatically syncing your chat history across devices.'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0d0b11] h-screen overflow-y-auto px-6 md:px-12 py-8">
      {/* Header */}
      <div className="border-b border-[#2d2938] pb-6 mb-8">
        <h2 className="text-2xl font-bold text-white tracking-wide">Help & Configuration Guide</h2>
        <p className="text-sm text-[#9c93a8] mt-1">
          Learn how to configure your Gemini API key, use document analysis, and make the most out of Nexa AI.
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        
        {/* Gemini Configuration Instructions */}
        <div className="p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Gemini API Key Configuration</h3>
                <p className="text-xs text-[#9c93a8]">Step-by-step instructions to set up your personal AI tier</p>
              </div>
            </div>
            
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 text-xs font-semibold border border-purple-500/30 transition-all"
            >
              <span>Open AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0d0b11] border border-[#2d2938]/60 space-y-1.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{step.title}</span>
                </h4>
                <p className="text-xs text-[#9c93a8] leading-relaxed pl-5">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-3">
            <Cpu className="w-6 h-6 text-purple-400" />
            <h4 className="font-semibold text-white text-sm">Gemini AI Models</h4>
            <p className="text-xs text-[#9c93a8] leading-relaxed">
              Powered by Google Gemini for lightning-fast multi-turn reasoning and chat generation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-3">
            <FileText className="w-6 h-6 text-indigo-400" />
            <h4 className="font-semibold text-white text-sm">PDF Context Extraction</h4>
            <p className="text-xs text-[#9c93a8] leading-relaxed">
              Upload PDF reports or documents directly in any chat for instant synthesis and Q&A.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h4 className="font-semibold text-white text-sm">Secure Authentication</h4>
            <p className="text-xs text-[#9c93a8] leading-relaxed">
              Sign in via Google OAuth 2.0 with JWT encryption to keep your chat history synchronized and private.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-2">
                <h4 className="font-semibold text-white text-sm">Q: {faq.q}</h4>
                <p className="text-xs text-[#9c93a8] leading-relaxed">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
