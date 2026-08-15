import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Archive, 
  Settings, 
  User as UserIcon, 
  HelpCircle,
  X,
  ArchiveRestore,
  LogIn,
  LogOut
} from 'lucide-react';
import NexaLogo from './NexaLogo';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ 
  chats = [], 
  activeChatId, 
  onSelectChat, 
  onNewChat, 
  onArchiveChat, 
  isOpen, 
  onClose,
  activeView,
  onSelectView,
  isLoading = false
}) {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  
  // Only show active (non-archived) chats in sidebar recent chats
  const activeChats = chats.filter(chat => !chat.archived);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-[#17141e] border-r border-[#2d2938] 
        transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header / Brand with Custom NexaLogo */}
        <div className="flex items-center justify-between p-5 border-b border-[#2d2938]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0d0b11] border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-950/40">
              <NexaLogo className="w-6 h-6" animated={true} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight tracking-wide">Nexa AI</h1>
              <span className="text-[11px] text-[#9c93a8] font-medium">Intelligent Assistant</span>
            </div>
          </div>
          
          {/* Close button on mobile */}
          <button 
            onClick={onClose}
            className="p-1.5 text-[#9c93a8] hover:text-white rounded-lg md:hidden hover:bg-[#201c2a] border border-transparent hover:border-[#2d2938] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="p-4 flex flex-col gap-3">
          <button 
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Scrollable list content */}
        <div className="flex-1 overflow-y-auto px-3 space-y-6 py-2">
          {/* Recent Chats Section */}
          <div>
            <div className="flex items-center gap-2 px-3 text-[#9c93a8] text-xs font-semibold uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Recent Chats</span>
            </div>
            <div className="space-y-1">
              {isLoading ? (
                <div className="space-y-2 px-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-9 rounded-xl bg-[#201c2a] animate-pulse" />
                  ))}
                </div>
              ) : activeChats.length === 0 ? (
                <div className="text-xs text-[#6b6375] italic px-3 py-2">No active chats</div>
              ) : (
                activeChats.map(chat => (
                  <div 
                    key={chat._id} 
                    className="relative group/item flex items-center"
                  >
                    <button
                      onClick={() => {
                        onSelectChat(chat._id);
                        onSelectView('chat');
                        onClose();
                      }}
                      className={`w-full text-left pl-3 pr-10 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-between ${
                        activeChatId === chat._id && activeView === 'chat'
                          ? 'bg-[#2a2438] text-white font-medium border-l-4 border-purple-500 pl-2'
                          : 'text-[#9c93a8] hover:bg-[#201c2a] hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-1">{chat.title}</span>
                    </button>
                    
                    {/* Archive button: always visible on mobile/touch, hover on desktop */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchiveChat(chat._id);
                      }}
                      className="absolute right-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 p-1.5 rounded-lg text-[#9c93a8] hover:text-white bg-[#201c2a]/80 md:bg-transparent hover:bg-[#2c2738] border border-[#2d2938]/50 md:border-transparent transition-all"
                      title="Archive chat"
                      aria-label="Archive chat"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Navigation Views */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onSelectView('archive');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === 'archive'
                  ? 'bg-[#2a2438] text-white'
                  : 'text-[#9c93a8] hover:bg-[#201c2a] hover:text-white'
              }`}
            >
              <ArchiveRestore className="w-5 h-5" />
              <span>Archive</span>
            </button>

            <button
              onClick={() => {
                onSelectView('settings');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeView === 'settings'
                  ? 'bg-[#2a2438] text-white'
                  : 'text-[#9c93a8] hover:bg-[#201c2a] hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* User Profile & Auth Footer Area */}
        <div className="p-3 border-t border-[#2d2938] space-y-2">
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#201c2a]/80 border border-[#2d2938]/60">
              <div 
                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                onClick={() => {
                  onSelectView('profile');
                  onClose();
                }}
              >
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full border border-purple-500/40 object-cover shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-[#9c93a8] truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-[#9c93a8] hover:text-red-400 rounded-lg hover:bg-[#2c2738] transition-all shrink-0 ml-1"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                openAuthModal();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#201c2a] hover:bg-[#2a2438] text-white border border-[#2d2938] text-xs font-medium transition-all"
            >
              <LogIn className="w-4 h-4 text-purple-400" />
              <span>Sign In with Google</span>
            </button>
          )}

          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => {
                onSelectView('profile');
                onClose();
              }}
              className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                activeView === 'profile'
                  ? 'text-white font-semibold'
                  : 'text-[#9c93a8] hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                onSelectView('help');
                onClose();
              }}
              className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                activeView === 'help'
                  ? 'text-white font-semibold'
                  : 'text-[#9c93a8] hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
