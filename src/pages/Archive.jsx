import React, { useState } from 'react';
import { 
  Archive, 
  Trash2, 
  RefreshCw, 
  MessageSquare,
  FileClock,
  Search
} from 'lucide-react';

export default function ArchiveView({ 
  chats = [], 
  onRestoreChat, 
  onDeleteChat 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const archivedChats = chats.filter(chat => chat.archived);

  const filteredArchives = archivedChats.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#0d0b11] h-screen overflow-y-auto px-6 md:px-12 py-8">
      {/* Header */}
      <div className="border-b border-[#2d2938] pb-6 mb-8">
        <h2 className="text-2xl font-bold text-white tracking-wide">Archived Discussions</h2>
        <p className="text-sm text-[#9c93a8] mt-1">
          Review or restore historically closed conversations saved with NexaAI.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#17141e] border border-[#2d2938] rounded-xl mb-6 max-w-md focus-within:border-purple-500/50 transition-colors">
        <Search className="w-5 h-5 text-[#6b6375]" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search archives..."
          className="flex-1 bg-transparent border-0 outline-none ring-0 text-sm text-white placeholder-[#6b6375]"
        />
      </div>

      {/* Archive Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArchives.map((item) => (
          <div key={item._id} className="p-5 rounded-2xl bg-[#17141e] border border-[#2d2938] hover:border-purple-500/30 transition-all flex justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#9c93a8]">
                <FileClock className="w-3.5 h-3.5" />
                <span>Archived Discussion</span>
              </div>
              <h4 className="font-semibold text-white text-base leading-tight">{item.title}</h4>
              <div className="flex items-center gap-1 text-xs text-purple-400 font-medium">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{item.messages.length} Messages</span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={() => onRestoreChat(item._id)}
                className="p-2 rounded-xl text-[#9c93a8] hover:text-white hover:bg-[#201c2a] transition-all"
                title="Restore Conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDeleteChat(item._id)}
                className="p-2 rounded-xl text-[#9c93a8] hover:text-red-400 hover:bg-[#201c2a] transition-all"
                title="Delete Permanently"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredArchives.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-[#6b6375] italic">
            No archived chats found.
          </div>
        )}
      </div>
    </div>
  );
}
