'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Zap, Download, Monitor, Shield, Headphones, Star } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '₹149',
    period: '/month',
    features: ['720p quality', '1 device', 'Ads included', 'Limited downloads'],
    color: 'border-gray-700',
    popular: false,
  },
  {
    name: 'Premium',
    price: '₹499',
    period: '/month',
    features: ['4K Ultra HD', '4 devices', 'Ad-free', 'Unlimited downloads', 'Dolby Atmos', 'Early access'],
    color: 'border-purple-500',
    popular: true,
  },
  {
    name: 'Family',
    price: '₹799',
    period: '/month',
    features: ['4K Ultra HD', '6 devices', 'Ad-free', 'Unlimited downloads', 'Family profiles', 'Parental controls'],
    color: 'border-gray-700',
    popular: false,
  },
];

const features = [
  { icon: <Monitor className="w-6 h-6" />, title: '4K Ultra HD', desc: 'Crystal clear streaming' },
  { icon: <Download className="w-6 h-6" />, title: 'Offline Downloads', desc: 'Watch anywhere, anytime' },
  { icon: <Shield className="w-6 h-6" />, title: 'Ad-free', desc: 'Zero interruptions' },
  { icon: <Headphones className="w-6 h-6" />, title: 'Dolby Atmos', desc: 'Immersive audio' },
];

export default function PremiumPage() {
  return (
    <div className="w-full text-white px-6 pt-4 pb-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block mb-4">
          <Crown className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)] mx-auto" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-3">Go Premium</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">Unlock the ultimate streaming experience with ad-free content, 4K quality, and exclusive originals</p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {features.map((feat, i) => (
          <motion.div
            key={feat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#14151D] border border-white/[0.04] rounded-xl p-5 text-center"
          >
            <div className="text-purple-400 mb-3 flex justify-center">{feat.icon}</div>
            <h3 className="font-bold text-[13px] text-white mb-1">{feat.title}</h3>
            <p className="text-[11px] text-gray-500">{feat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-[#14151D] border ${plan.color} rounded-2xl p-6 ${plan.popular ? 'ring-1 ring-purple-500/30' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-3xl font-black">{plan.price}</span>
              <span className="text-sm text-gray-500">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-[13px] text-gray-300">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition-all ${
              plan.popular
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.5)]'
                : 'bg-white/[0.06] text-gray-200 hover:bg-white/10 border border-white/[0.06]'
            }`}>
              {plan.popular ? 'Get Premium' : 'Choose Plan'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
