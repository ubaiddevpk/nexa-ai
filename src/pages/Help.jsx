import React from 'react';
import { HelpCircle, Terminal, BookOpen, MessageSquare, Play } from 'lucide-react';

export default function Help() {
  const faqList = [
    {
      q: 'How do I generate an image?',
      a: 'Type a descriptive prompt like "Generate an image of a cybernetic forest at sunset" or select the "Generate an image" shortcut card on the home dashboard view.'
    },
    {
      q: 'Does NexaAI support PDF document upload?',
      a: 'Yes! Go to the Workspace page using the left navigation sidebar, select "Upload File" to parse a PDF, and then ask questions about the document in the Chat view.'
    },
    {
      q: 'How does conversation memory function?',
      a: 'NexaAI remembers historical prompts within the active chat thread, preserving context to answer follow-up queries seamlessly.'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0d0b11] h-screen overflow-y-auto px-6 md:px-12 py-8">
      {/* Header */}
      <div className="border-b border-[#2d2938] pb-6 mb-8">
        <h2 className="text-2xl font-bold text-white tracking-wide">Help Center & Docs</h2>
        <p className="text-sm text-[#9c93a8] mt-1">
          Explore tips, shortcuts, and documentation to maximize your experience with NexaAI.
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        
        {/* Quick Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#17141e] border border-[#2d2938] hover:border-purple-500/30 transition-all space-y-3">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h4 className="font-semibold text-white text-sm">Documentation</h4>
            <p className="text-xs text-[#9c93a8]">Read comprehensive setup instructions and developer APIs.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#17141e] border border-[#2d2938] hover:border-purple-500/30 transition-all space-y-3">
            <Terminal className="w-6 h-6 text-purple-400" />
            <h4 className="font-semibold text-white text-sm">Keyboard Shortcuts</h4>
            <p className="text-xs text-[#9c93a8]">Navigate assistant workspaces quickly via hotkeys.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#17141e] border border-[#2d2938] hover:border-purple-500/30 transition-all space-y-3">
            <Play className="w-6 h-6 text-purple-400" />
            <h4 className="font-semibold text-white text-sm">Interactive Guides</h4>
            <p className="text-xs text-[#9c93a8]">Watch a walkthrough tutorial showcasing multimodal AI commands.</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-4">
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
