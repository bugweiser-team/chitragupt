"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SITUATIONS, LAWYERS } from '@/lib/mockData';
import { Situation, Lawyer } from '@/types';
import { 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  BookOpen, 
  Gavel, 
  ChevronRight, 
  Clock, 
  IndianRupee, 
  Zap, 
  Eye, 
  EyeOff, 
  MessageCircle,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

function GetHelpContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id');
  
  const [selectedId, setSelectedId] = useState<string>(initialId || SITUATIONS[0].id);
  const [showLawText, setShowLawText] = useState(false);
  
  const current = SITUATIONS.find(s => s.id === selectedId) || SITUATIONS[0];

  useEffect(() => {
    if (initialId) setSelectedId(initialId);
  }, [initialId]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-80px)]">
      {/* LEFT SIDEBAR: Categories & Situations */}
      <aside className="w-full lg:w-[350px] bg-gray-50 dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 p-6 lg:overflow-y-auto no-scrollbar">
        <h2 className="text-xl font-black text-navy dark:text-white mb-8 flex items-center gap-2">
           <HelpCircle className="text-saffron" size={20} />
           Your Situation
        </h2>
        <div className="space-y-3">
          {SITUATIONS.map(sit => (
            <button
              key={sit.id}
              onClick={() => { setSelectedId(sit.id); setShowLawText(false); }}
              className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                selectedId === sit.id 
                  ? 'bg-white dark:bg-gray-900 border-saffron shadow-lg scale-[1.02] z-10' 
                  : 'bg-transparent border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
               {selectedId === sit.id && (
                 <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-saffron" />
               )}
               <div className="flex items-start gap-4">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{sit.emoji}</span>
                  <div className="flex-1">
                     <h4 className={`text-sm font-bold tracking-tight mb-1 ${selectedId === sit.id ? 'text-navy dark:text-saffron' : 'text-gray-700 dark:text-gray-400'}`}>
                       {sit.title}
                     </h4>
                     <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-widest">{sit.description}</p>
                  </div>
                  {selectedId === sit.id ? (
                    <ChevronRight className="text-saffron animate-pulse" size={16} />
                  ) : (
                    <ChevronRight className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                  )}
               </div>
            </button>
          ))}
        </div>

        <div className="mt-12 p-6 bg-navy text-white rounded-3xl shadow-xl space-y-4">
           <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-saffron" />
           </div>
           <h4 className="font-bold text-sm">Need deep analysis?</h4>
           <p className="text-[11px] opacity-70 leading-relaxed">Our AI can read your documents and find hidden legal leverage.</p>
           <button className="w-full py-3 bg-saffron text-navy text-xs font-black rounded-xl hover:scale-105 transition-transform active:scale-95">
              ANALYZE MY CASE
           </button>
        </div>
      </aside>

      {/* RIGHT PANEL: Rights & Action Plan */}
      <main className="flex-1 bg-white dark:bg-black p-6 lg:p-12 lg:overflow-y-auto">
         <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Header Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-3xl">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg animate-fadeIn">
                     <ShieldCheck size={24} />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-green-700 dark:text-green-400 font-black text-lg">Solid Legal Grounding</h3>
                     <p className="text-green-600 dark:text-green-500 text-xs font-medium uppercase tracking-widest">You have strong legal rights in this situation</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full border border-green-100 dark:border-green-900/50 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-widest leading-none">Verified by AI Lawyer</span>
               </div>
            </div>

            {/* SECTION 1 — RIGHTS */}
            <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <BookOpen size={18} />
                  </div>
                  <h2 className="text-2xl font-black text-navy dark:text-white font-poppins">What the Law Says — In Simple Words</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {current.rights.map((right, i) => (
                    <div key={i} className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex gap-4 transition-all hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-white dark:hover:bg-gray-900 group">
                       <CheckCircle2 className="text-blue-500 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                       <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{right}</p>
                    </div>
                  ))}
               </div>

               {/* Toggle Legal Text */}
               <div className="pt-4">
                  <button 
                    onClick={() => setShowLawText(!showLawText)}
                    className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-navy dark:hover:text-saffron transition-colors"
                  >
                    {showLawText ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showLawText ? 'Hide Original Law Text' : 'Show Original Law Text'}
                  </button>
                  {showLawText && (
                    <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 font-mono text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 whitespace-pre-wrap animate-fadeIn">
                       {current.lawText}
                    </div>
                  )}
               </div>
            </section>

            {/* SECTION 2 — ACTION PLAN */}
            <section className="p-8 bg-navy dark:bg-gray-900 rounded-[32px] text-white space-y-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
               <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Gavel size={22} className="text-saffron" />
                  </div>
                  <h3 className="text-2xl font-black font-poppins">Your Action Plan</h3>
               </div>

               <div className="space-y-6 relative z-10">
                  {current.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-6">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold border-2 transition-all ${
                         step.status === 'done' ? 'bg-saffron border-saffron text-navy shadow-lg shadow-saffron/20' : 
                         step.status === 'pending' ? 'bg-white/10 border-white/20 text-white' : 
                         'bg-transparent border-white/10 text-white/40'
                       }`}>
                          {step.status === 'done' ? <CheckCircle2 size={18} /> : i + 1}
                       </div>
                       <div className="flex-1 space-y-1">
                          <p className={`text-base font-bold ${step.status === 'info' ? 'text-white/40' : 'text-white'}`}>{step.text}</p>
                          {step.status === 'pending' && <p className="text-[10px] text-saffron uppercase font-black animate-pulse tracking-widest underline decoration-2 underline-offset-4 cursor-pointer">NEXT MOVE: START NOW</p>}
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex gap-4 items-center">
                  <div className="w-12 h-12 bg-saffron/20 rounded-xl flex items-center justify-center text-saffron flex-shrink-0">
                     <AlertTriangle size={24} />
                  </div>
                  <p className="text-xs font-medium leading-relaxed italic text-saffron-light">
                    “{current.tip}”
                  </p>
               </div>
            </section>

            {/* SECTION 3 — SMART ESCALATION & PROBABILITY */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {current.isHighRisk ? (
                 <div className="col-span-1 md:col-span-2 p-8 bg-red-50 dark:bg-red-950/20 border-2 border-red-500 rounded-[32px] space-y-6">
                    <div className="flex items-center gap-4 text-red-600 dark:text-red-500">
                       <AlertTriangle size={36} className="animate-pulse" />
                       <div>
                         <h4 className="text-2xl font-black font-poppins">This looks serious.</h4>
                         <p className="text-sm font-bold uppercase tracking-widest mt-1">Self-help is not recommended. Legal representation required.</p>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                       {LAWYERS.filter(l => l.category === current.category).slice(0, 3).map(lawyer => (
                         <div key={lawyer.id} className="p-6 bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/50 rounded-2xl shadow-xl flex flex-col justify-between">
                            <div className="space-y-4">
                               <h5 className="font-black text-navy dark:text-white flex items-center gap-2">
                                  {lawyer.name} {lawyer.verified && <CheckCircle2 size={14} className="text-blue-500" />}
                               </h5>
                               <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl text-red-700 dark:text-red-400 text-xs font-bold leading-relaxed">
                                  <span className="uppercase tracking-widest text-[10px] block mb-1 opacity-70">Why recommended:</span>
                                  {lawyer.whyMatch}
                               </div>
                            </div>
                            <button className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors flex justify-center gap-2 items-center">
                               <Gavel size={14} /> Talk to Lawyer Now
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
               ) : (
                 <div className="p-8 bg-gray-50 dark:bg-gray-950 rounded-[32px] border border-gray-100 dark:border-gray-800 space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="text-lg font-black text-navy dark:text-white">Success Odds</h4>
                       <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">High Potential</span>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-end justify-between">
                          <span className="text-4xl font-black text-navy dark:text-white">{current.successRate}%</span>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1">Chance of Success</span>
                       </div>
                       <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-saffron to-green-500 rounded-full shadow-lg transition-all duration-1000"
                            style={{ width: `${current.successRate}%` }}
                          />
                       </div>
                       <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                          Based on 340+ Consumer Forum judgments (2020-2024 for Madhya Pradesh)
                       </p>
                    </div>
                 </div>
               )}

               <div className="p-8 bg-gray-50 dark:bg-gray-950 rounded-[32px] border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                           <Clock size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Timeline</span>
                        </div>
                        <p className="text-lg font-black text-navy dark:text-white">{current.timeline}</p>
                     </div>
                     <div className="space-y-2 text-right">
                        <div className="flex items-center gap-2 text-gray-400 justify-end">
                           <IndianRupee size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Estimated Cost</span>
                        </div>
                        <p className="text-lg font-black text-navy dark:text-white">{current.cost}</p>
                     </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-4 group cursor-pointer">
                     <div className="w-10 h-10 bg-navy dark:bg-gray-800 rounded-full flex items-center justify-center text-white dark:text-saffron group-hover:scale-110 transition-transform">
                        <MessageCircle size={18} />
                     </div>
                     <p className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-navy dark:group-hover:text-saffron transition-colors leading-relaxed">
                        Got a specific question? <br /> <span className="underline uppercase tracking-widest">Ask our AI Lawyer →</span>
                     </p>
                  </div>
               </div>
            </section>

            {/* ACTION BUTTONS (Hidden for High Risk) */}
            {!current.isHighRisk && (
              <section className="space-y-4">
                 <Link href="/documents" className="flex items-center justify-between gap-4 w-full p-6 bg-green-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-600/20 hover:scale-[1.02] active:scale-95 transition-all group">
                    <div className="flex items-center gap-4">
                       <FileText size={28} />
                       <div className="text-left">
                          <span className="block leading-none mb-1">Generate Legal Notice</span>
                          <span className="text-[10px] opacity-70 uppercase tracking-widest">Resolves 68% of cases immediately</span>
                       </div>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                      <ArrowRight size={20} />
                    </div>
                 </Link>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/documents" className="flex items-center justify-center gap-3 p-4 bg-navy dark:bg-gray-800 text-white dark:text-saffron rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity active:scale-95 transition-transform">
                      <FileText size={18} />
                      <span>Consumer Complaint</span>
                    </Link>
                    <Link href="/lawyers" className="flex items-center justify-center gap-3 p-4 border-2 border-navy dark:border-saffron text-navy dark:text-saffron rounded-2xl font-bold text-sm hover:bg-navy hover:text-white dark:hover:bg-saffron dark:hover:text-black transition-all active:scale-95 transition-transform">
                      <Gavel size={18} />
                      <span>Find Local Lawyer</span>
                    </Link>
                 </div>
              </section>
            )}

            {/* WHAT YOU'LL NEED (Checklist) */}
            <section className="p-8 bg-gray-50 dark:bg-gray-950 rounded-[32px] border border-gray-100 dark:border-gray-800">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-saffron/10 rounded-lg flex items-center justify-center text-saffron-dark">
                    <FileText size={18} />
                  </div>
                  <h4 className="text-xl font-black text-navy dark:text-white">Evidence Checklist</h4>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {current.checklist.map((item, i) => (
                    <label key={i} className="flex items-center gap-4 cursor-pointer group">
                       <input type="checkbox" className="w-5 h-5 rounded-md border-2 border-gray-300 text-saffron focus:ring-saffron cursor-pointer" />
                       <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-navy dark:group-hover:text-saffron transition-colors">{item}</span>
                    </label>
                  ))}
               </div>
            </section>

            {/* Bottom Disclaimer */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
                  ⚠️ This information is for general guidance only. Laws may vary by state. Consult a lawyer for advice specific to your case.
               </p>
            </div>
         </div>
      </main>
    </div>
  );
}

export default function GetHelpPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen font-black animate-pulse">Initializing Chitragupta...</div>}>
      <GetHelpContent />
    </Suspense>
  );
}
