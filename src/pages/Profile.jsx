import React, { useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard,
  Crown,
  LogIn,
  LogOut,
  Calendar,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, isAuthenticated, logout, openAuthModal, refreshUser } = useAuth();

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'August 2026';

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Real token usage calculation
  const totalLimit = user?.plan === 'premium' ? 1000000 : 100000;
  const tokensUsed = user?.totalTokensUsed || 0;
  const usagePercentage = Math.min(100, Math.round((tokensUsed / totalLimit) * 100));

  return (
    <div className="flex-1 flex flex-col bg-[#0d0b11] h-screen overflow-y-auto px-6 md:px-12 py-8">
      {/* Header */}
      <div className="border-b border-[#2d2938] pb-6 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Account Profile</h2>
          <p className="text-sm text-[#9c93a8] mt-1">
            Review your Google account credentials, real Gemini API token usage, and security status.
          </p>
        </div>
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-800/40 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Google</span>
          </button>
        )}
      </div>

      <div className="max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="col-span-1 md:col-span-3 p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] flex flex-col sm:flex-row items-center gap-6">
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt={user.name || 'User Profile'} 
              className="w-20 h-20 rounded-full border-2 border-purple-500/50 shadow-xl object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-white">{user?.name || 'Guest User'}</h3>
     
            </div>
            <p className="text-xs text-[#9c93a8] flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email || 'Not authenticated (local session)'}</span>
            </p>
            <p className="text-xs text-[#6b6375] flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Member since {formattedDate}</span>
            </p>
          </div>
        </div>

        {/* Security Settings Box */}
        <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] space-y-4">
          <h4 className="font-semibold text-white text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Security & Access Controls</span>
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[#2d2938]">
              <span className="text-xs text-[#9c93a8]">Authentication Provider</span>
              <span className="text-xs text-purple-400 font-semibold">{isAuthenticated ? 'Google OAuth 2.0' : 'Anonymous'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#2d2938]">
              <span className="text-xs text-[#9c93a8]">Session status</span>
              <span className="text-xs text-[#9c93a8] font-mono">{isAuthenticated ? 'Active (JWT secured)' : 'Guest Mode'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-[#9c93a8]">Data Sync</span>
              <span className="text-xs text-emerald-400 font-medium">{isAuthenticated ? 'Cloud MongoDB Synced' : 'Local Storage Only'}</span>
            </div>
          </div>
        </div>

        {/* Real Token Usage Card */}
        <div className="p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Free Tier Tokens</span>
              </h4>
              <span className="text-[11px] font-bold text-purple-400 font-mono">{usagePercentage}%</span>
            </div>

            <div className="w-full bg-[#0d0b11] rounded-full h-2 overflow-hidden border border-[#2d2938]/80">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(4, usagePercentage)}%` }}
              />
            </div>

            <div className="flex flex-col gap-0.5 pt-1">
              <span className="text-xs font-semibold text-white font-mono">
                {tokensUsed.toLocaleString()} / {totalLimit.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#9c93a8]">
                Real tokens calculated from Gemini responses
              </span>
            </div>
          </div>

          <button className="w-full mt-4 py-2 bg-[#201c2a] hover:bg-[#2c2738] text-xs text-[#e5e4e7] hover:text-white rounded-xl border border-[#2d2938] font-semibold transition-all">
            Upgrade Tier
          </button>
        </div>

      </div>
    </div>
  );
}
