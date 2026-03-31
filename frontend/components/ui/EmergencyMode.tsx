"use client";

import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Phone, ArrowLeft, ShieldAlert } from 'lucide-react';

type EmergencyOption = {
  id: string;
  title: string;
  actions: string[];
};

const OPTIONS: EmergencyOption[] = [
  {
    id: 'police',
    title: 'Police not helping / FIR refused',
    actions: [
      'Go to the SP (Superintendent of Police) office immediately',
      'You have a right to file a Zero FIR anywhere under CrPC Section 154',
      'Record video/audio of the refusal if safe to do so',
      'Send complaint via Registered Post to the station'
    ]
  },
  {
    id: 'threat',
    title: 'Immediate threat / Harassment',
    actions: [
      'Get to a safe public place immediately',
      'Call 100 for Emergency Police Dispatch',
      'Do NOT confront the harasser alone',
      'Share your live location with 3 trusted contacts'
    ]
  },
  {
    id: 'dv',
    title: 'Domestic violence',
    actions: [
      'Call Women Helpline 1091 immediately',
      'Pack essential documents (ID, banking) if planning to leave',
      'You have the Right to Reside under DV Act',
      'Do not wait for things to escalate further'
    ]
  },
  {
    id: 'fraud',
    title: 'Financial fraud happening right now',
    actions: [
      'Call 1930 (National Cyber Crime Helpline) within 24 hours',
      'Call your bank immediately to freeze your account/cards',
      'Do NOT click any more links or share OTPs',
      'Take screenshots of all transactions and chats'
    ]
  }
];

export default function EmergencyMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<EmergencyOption | null>(null);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-600/50 hover:scale-105 active:scale-95 transition-all outline-none animate-pulse border-2 border-red-400 group"
      >
        <span className="text-xl">🚨</span>
        <span>Emergency Help</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl transition-all">
       <div className="bg-gray-900 border border-red-500/30 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-6 bg-red-600/10 border-b border-red-500/20 flex items-center justify-between sticky top-0">
             <div className="flex items-center gap-3 text-red-500">
               {selectedOption ? (
                 <button onClick={() => setSelectedOption(null)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                    <ArrowLeft size={24} />
                 </button>
               ) : (
                 <AlertTriangle size={32} />
               )}
               <h2 className="text-xl font-black uppercase tracking-widest">{selectedOption ? 'Immediate Action Plan' : 'Emergency Mode'}</h2>
             </div>
             <button 
                onClick={() => { setIsOpen(false); setSelectedOption(null); }}
                className="text-gray-400 hover:text-white font-bold p-2"
             >
                Close
             </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
             {!selectedOption ? (
               <div className="space-y-6">
                  <h3 className="text-2xl font-black text-white">What is happening right now?</h3>
                  <div className="space-y-3">
                     {OPTIONS.map(opt => (
                       <button
                         key={opt.id}
                         onClick={() => setSelectedOption(opt)}
                         className="w-full p-4 bg-gray-800 hover:bg-red-500/10 border border-gray-700 hover:border-red-500/50 rounded-xl text-left transition-all group flex justify-between items-center"
                       >
                          <span className="font-bold text-gray-200 group-hover:text-red-400">{opt.title}</span>
                          <span className="text-gray-500 group-hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                       </button>
                     ))}
                     <button className="w-full p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-left font-bold text-gray-400">
                        Other (Explain in Chat)
                     </button>
                  </div>
               </div>
             ) : (
               <div className="space-y-8 animate-fadeIn">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-red-500 mb-2">
                        <ShieldAlert size={20} />
                        <h4 className="font-black text-sm uppercase tracking-widest">Do This Immediately</h4>
                     </div>
                     <ul className="space-y-3 text-gray-200">
                        {selectedOption.actions.map((action, i) => (
                           <li key={i} className="flex gap-3 items-start bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                              <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-black flex-shrink-0">{i + 1}</span>
                              <span className="font-medium text-sm leading-relaxed">{action}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
             )}
          </div>

          {/* Footer CTAs */}
          <div className="p-6 bg-gray-950 border-t border-gray-800 space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="tel:100" className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all">
                  <Phone size={18} /> Call Police 100
                </a>
                <a href="tel:15100" className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 p-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all">
                  <Phone size={18} /> Legal Aid 15100
                </a>
                <a href="tel:1091" className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white sm:col-span-2 p-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all">
                  <Phone size={18} /> Women Helpline 1091
                </a>
             </div>
             
             <div className="pt-4 mt-4 border-t border-gray-800 flex items-start gap-3">
                <AlertCircle size={20} className="text-gray-500 flex-shrink-0" />
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest leading-relaxed">
                   This situation may require immediate human intervention. AI guidance is not enough. Please contact authorities.
                </p>
             </div>
          </div>

       </div>
    </div>
  );
}
