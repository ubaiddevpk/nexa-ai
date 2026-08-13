import React from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard,
  Crown
} from 'lucide-react';

export default function Profile() {
  return (
    <div className="flex-1 flex flex-col bg-[#0d0b11] h-screen overflow-y-auto px-6 md:px-12 py-8">
      {/* Header */}
      <div className="border-b border-[#2d2938] pb-6 mb-8">
        <h2 className="text-2xl font-bold text-white tracking-wide">Account Profile</h2>
        <p className="text-sm text-[#9c93a8] mt-1">
          Review subscription statuses, active credentials, and profile settings.
        </p>
      </div>

      <div className="max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="col-span-1 md:col-span-3 p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl">
            JD
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-white">John Doe</h3>
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-500 text-[10px] font-bold tracking-wider uppercase border border-yellow-500/30 flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5" />
                <span>Premium Member</span>
              </span>
            </div>
            <p className="text-xs text-[#9c93a8] flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>john.doe@example.com</span>
            </p>
            <p className="text-xs text-[#6b6375]">Member since August 2026</p>
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
              <span className="text-xs text-[#9c93a8]">Two-Factor Auth</span>
              <span className="text-xs text-red-400 font-semibold">Disabled</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#2d2938]">
              <span className="text-xs text-[#9c93a8]">Session tokens</span>
              <span className="text-xs text-[#9c93a8] font-mono">Expires in 2 hours</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-[#9c93a8]">Active Logins</span>
              <span className="text-xs text-purple-400 font-medium">1 Active Device</span>
            </div>
          </div>
        </div>

        {/* Usage Limits Card */}
        <div className="p-6 rounded-2xl bg-[#17141e] border border-[#2d2938] flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>AI Token Usage</span>
            </h4>
            <div className="w-full bg-[#0d0b11] rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-700 to-indigo-600 h-full w-[45%]" />
            </div>
            <span className="text-[10px] text-[#9c93a8] block">45,000 / 100,000 Monthly Tokens</span>
          </div>

          <button className="w-full mt-4 py-2 bg-[#201c2a] hover:bg-[#2c2738] text-xs text-[#e5e4e7] hover:text-white rounded-xl border border-[#2d2938] font-semibold transition-all">
            Upgrade Plan
          </button>
        </div>

      </div>
    </div>
  );
}
