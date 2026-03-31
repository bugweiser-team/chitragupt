"use client";

import React, { useState } from 'react';
import { LAWYERS } from '@/lib/mockData';
import { 
  Users, 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Globe,
  Gavel,
  ShieldCheck,
  Zap,
  Building2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function LawyersPage() {
  const [selectedState, setSelectedState] = useState('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLawyers = LAWYERS.filter(lawyer => {
    const matchesState = selectedState === 'All' || lawyer.state.includes(selectedState);
    const matchesSpec = selectedSpecialization === 'All' || lawyer.specializations.includes(selectedSpecialization);
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lawyer.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSpec && matchesSearch;
  });

  const specializations = ['All', 'Tenant Law', 'Consumer Rights', 'Workplace Issues', 'Police & FIR', 'Family Law', 'Criminal Law', 'Cyber Crime'];

  return (
    <div className="min-h-screen bg-white dark:bg-black font-inter">
      {/* HEADER */}
      <section className="bg-navy dark:bg-gray-900 pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 blur-3xl -z-0 rounded-full" />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-saffron font-bold text-xs uppercase tracking-[0.2em]">
              <Users size={14} />
              <span>Pro Bono Network</span>
           </div>
           <h1 className="text-4xl sm:text-6xl font-black text-white font-poppins">Find Free Legal Help <br className="hidden sm:block" /> Near You</h1>
           <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
             Connect with pro-bono lawyers and legal aid organizations across India. Every citizen has a right to justice.
           </p>
        </div>
      </section>

      {/* FILTER BAR - Sticky */}
      <div className="sticky top-16 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 py-4">
           <div className="flex flex-col lg:flex-row items-center gap-4">
              {/* Search */}
              <div className="relative w-full lg:w-1/3">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search by name or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold focus:ring-2 focus:ring-saffron outline-none transition-all"
                 />
              </div>

              {/* Specialization Filter */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full lg:flex-1">
                 {specializations.map(spec => (
                    <button 
                      key={spec}
                      onClick={() => setSelectedSpecialization(spec)}
                      className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                        selectedSpecialization === spec 
                          ? 'bg-navy dark:bg-saffron text-white dark:text-navy-dark border-navy dark:border-saffron shadow-lg' 
                          : 'bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-800 hover:border-gray-300'
                      }`}
                    >
                      {spec}
                    </button>
                 ))}
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-navy dark:hover:text-saffron transition-all">
                 <Filter size={14} />
                 <span>All Filters</span>
              </button>
           </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-16">
         <div className="flex items-center justify-between mb-12">
            <h2 className="text-xl font-black text-navy dark:text-white uppercase tracking-widest">
               {filteredLawyers.length} Lawyers Found
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-green-500/20">
               <Zap size={10} />
               <span>Live Availability</span>
            </div>
         </div>

         {/* GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {filteredLawyers.map(lawyer => (
              <div key={lawyer.id} className="group bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-saffron/20 transition-all duration-500 flex flex-col sm:flex-row h-full">
                 {/* Avatar / Side Panel */}
                 <div 
                    className="w-full sm:w-[140px] flex sm:flex-col items-center justify-center p-8 gap-4 sm:gap-6 border-b sm:border-b-0 sm:border-r border-gray-100 dark:border-gray-800"
                    style={{ background: `linear-gradient(135deg, ${lawyer.gradientFrom}10, ${lawyer.gradientTo}10)` }}
                 >
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl"
                      style={{ background: `linear-gradient(135deg, ${lawyer.gradientFrom}, ${lawyer.gradientTo})` }}
                    >
                      {lawyer.initials}
                    </div>
                    <div className="flex flex-col items-center text-center">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Rating</span>
                       <div className="flex items-center gap-1 text-saffron-dark dark:text-saffron">
                          <Star size={14} fill="currentColor" />
                          <span className="text-sm font-black">{lawyer.rating}</span>
                       </div>
                    </div>
                 </div>

                 {/* Info Panel */}
                 <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <h3 className="text-xl font-black text-navy dark:text-white font-poppins">{lawyer.name}</h3>
                             {lawyer.verified && <CheckCircle2 size={16} className="text-blue-500" />}
                          </div>
                          {lawyer.badge && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-navy/5 dark:bg-saffron/10 text-navy dark:text-saffron rounded border border-navy/10 dark:border-saffron/20 leading-none">
                              {lawyer.badge}
                            </span>
                          )}
                       </div>

                       <div className="flex flex-wrap gap-4 items-center text-xs font-bold text-gray-500">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                             <MapPin size={12} />
                             {lawyer.location}
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                             <Globe size={12} />
                             {lawyer.languages.join(', ')}
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
                             <CheckCircle2 size={12} />
                             {lawyer.experience}
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-2">
                          {lawyer.specializations.map(s => (
                            <span key={s} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                               {s}
                            </span>
                          ))}
                       </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Consultation</span>
                          <span className="text-sm font-black text-navy dark:text-white leading-none">{lawyer.fee}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-2xl hover:bg-navy hover:text-white dark:hover:bg-saffron dark:hover:text-navy transition-all active:scale-90">
                             <Phone size={18} />
                          </button>
                          <button className="px-6 py-3 bg-navy dark:bg-saffron text-white dark:text-navy-dark rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-navy/20 dark:shadow-saffron/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                             <span>Book Consultation</span>
                             <ArrowRight size={14} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
         </div>

         {/* LEGAL AID INFO */}
         <section className="bg-gray-50 dark:bg-gray-950 p-12 lg:p-20 rounded-[64px] border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-20 opacity-5 grayscale group-hover:grayscale-0 transition-all duration-1000 rotate-12">
               <Gavel size={300} />
            </div>
            <div className="max-w-4xl space-y-12 relative z-10">
               <div className="space-y-6">
                  <div className="w-16 h-16 bg-navy dark:bg-saffron text-white dark:text-navy-dark rounded-3xl flex items-center justify-center shadow-2xl">
                     <Building2 size={32} />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-navy dark:text-white font-poppins">Government Legal Aid</h2>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed">
                     Every Indian citizen has the right to free legal aid under the Legal Services Authorities Act, 1987. If you cannot afford a lawyer, the government will provide one for you.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <InfoCard title="DLSA / SLSA" desc="District/State Level Legal Services for SC/ST, women, children, and victims of disaster." />
                  <InfoCard title="NALSA Helpline" desc="24/7 National hotline for free legal advice and representation. Call 15100 now." />
                  <InfoCard title="HC Legal Committee" desc="For cases pending in High Courts. Available at every state High Court." />
               </div>

               <div className="pt-8 flex flex-col sm:flex-row items-center gap-8 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-50 dark:border-gray-950 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold">L{i}</div>)}
                     <div className="w-12 h-12 rounded-full border-4 border-gray-50 dark:border-gray-950 bg-saffron flex items-center justify-center text-xs font-black">+2k</div>
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Join 2,400+ Pro Bono Lawyers across India</p>
                  <button className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border-2 border-navy dark:border-saffron text-navy dark:text-saffron rounded-2xl font-black text-sm hover:bg-navy hover:text-white dark:hover:bg-saffron dark:hover:text-black transition-all">
                     <span>Apply as Advocate</span>
                     <ExternalLink size={14} />
                  </button>
               </div>
            </div>
         </section>

         {/* HELPLINES BAR */}
         <section className="mt-24 p-10 bg-red-600 rounded-[32px] text-white shadow-[0_20px_50px_rgba(220,38,38,0.3)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
               <div className="space-y-2">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                     <ShieldCheck size={24} className="animate-pulse" />
                     <h3 className="text-xl font-bold uppercase tracking-widest">Emergency Legal Helplines</h3>
                  </div>
                  <p className="text-sm opacity-80 font-medium">Available 24/7 across all Indian states and union territories.</p>
               </div>
               <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                  <Helpline label="Police" num="100" />
                  <Helpline label="Women" num="1091" />
                  <Helpline label="Child" num="1098" />
                  <Helpline label="Cyber" num="1930" />
                  <div className="px-8 py-4 bg-white text-red-600 rounded-2xl font-black text-2xl tracking-widest shadow-xl flex flex-col items-center leading-none">
                     <span className="text-[10px] uppercase mb-1">Legal Aid</span>
                     15100
                  </div>
               </div>
            </div>
         </section>
      </main>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-4 hover:shadow-xl transition-shadow">
       <h4 className="font-black text-navy dark:text-saffron-light uppercase tracking-widest">{title}</h4>
       <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function Helpline({ label, num }: { label: string; num: string }) {
  return (
    <div className="flex flex-col items-center md:items-start group cursor-default">
       <span className="text-[10px] font-black uppercase opacity-60 mb-1 group-hover:opacity-100 transition-opacity">{label}</span>
       <span className="text-2xl font-black group-hover:scale-110 transition-transform">{num}</span>
    </div>
  );
}
