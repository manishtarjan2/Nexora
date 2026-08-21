/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette, Monitor,
  Globe, CreditCard, ChevronRight, Moon, Volume2, Eye
} from 'lucide-react';

const sections = [
  {
    title: 'Account',
    items: [
      { icon: <User className="w-[18px] h-[18px]" />, label: 'Profile', desc: 'Manage your profile information', action: 'Edit' },
      { icon: <CreditCard className="w-[18px] h-[18px]" />, label: 'Subscription', desc: 'Premium Plan • Renews Aug 28', action: 'Manage' },
      { icon: <Shield className="w-[18px] h-[18px]" />, label: 'Privacy & Security', desc: 'Password, 2FA, login sessions', action: '' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { icon: <Palette className="w-[18px] h-[18px]" />, label: 'Appearance', desc: 'Dark mode', toggle: true, enabled: true },
      { icon: <Globe className="w-[18px] h-[18px]" />, label: 'Language', desc: 'English (US)', action: 'Change' },
      { icon: <Monitor className="w-[18px] h-[18px]" />, label: 'Video Quality', desc: 'Auto (up to 4K)', action: 'Change' },
      { icon: <Volume2 className="w-[18px] h-[18px]" />, label: 'Audio', desc: 'Dolby Atmos enabled', toggle: true, enabled: true },
    ]
  },
  {
    title: 'Notifications',
    items: [
      { icon: <Bell className="w-[18px] h-[18px]" />, label: 'Push Notifications', desc: 'New releases, recommendations', toggle: true, enabled: true },
      { icon: <Eye className="w-[18px] h-[18px]" />, label: 'Watch Reminders', desc: 'Continue watching alerts', toggle: true, enabled: false },
    ]
  },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Appearance': true,
    'Audio': true,
    'Push Notifications': true,
    'Watch Reminders': false,
  });

  const handleToggle = (label: string) => {
    setToggles(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="w-full text-white px-6 pt-4 pb-10 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-sm text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-8">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
          >
            <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-3">{section.title}</h2>
            <div className="bg-[#14151D] border border-white/[0.04] rounded-xl overflow-hidden divide-y divide-white/[0.04]">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[14px] text-gray-100">{item.label}</h3>
                    <p className="text-[12px] text-gray-500">{item.desc}</p>
                  </div>
                  {'toggle' in item ? (
                    <button
                      onClick={() => handleToggle(item.label)}
                      className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${
                        toggles[item.label] ? 'bg-purple-500' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        toggles[item.label] ? 'translate-x-[22px]' : 'translate-x-0.5'
                      }`} />
                    </button>
                  ) : item.action ? (
                    <span className="text-[12px] text-purple-400 font-semibold flex-shrink-0">{item.action}</span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

