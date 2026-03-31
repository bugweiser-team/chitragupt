"use client";

import React from "react";
import { useCase } from "@/context/CaseContext";
import { Clock, FileText, Download, ShieldCheck, ArrowRight, Gavel, FileCheck } from "lucide-react";
import Link from "next/link";

export default function MyCasePage() {
  const { currentIssue, stateLocation, amount, documentsGenerated, chatHistory } = useCase();

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
         
         {/* HEADER */}
         <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-100 dark:border-gray-900">
            <div>
               <h1 className="text-3xl font-black font-poppins text-navy dark:text-white">Your Case File</h1>
               <p className="text-sm font-medium text-gray-400 mt-2">Continuity guaranteed across sessions.</p>
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-navy/5 dark:bg-saffron/10 text-navy dark:text-saffron rounded-xl font-black text-xs uppercase tracking-widest hover:bg-navy hover:text-white transition-all">
               <Download size={16} />
               <span>Case Summary PDF</span>
            </button>
         </div>

         {/* MAIN GRID */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* TIMELINE LEFT */}
            <div className="col-span-2 space-y-12">
               
               <section className="p-8 bg-gray-50 dark:bg-gray-950 rounded-[32px] border border-gray-100 dark:border-gray-900 space-y-6">
                  <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-widest flex items-center gap-2">
                     <FileText className="text-saffron" size={18} />
                     Initial Problem Description
                  </h3>
                  <p className="text-lg font-medium leading-relaxed text-gray-500">
                     {currentIssue || "No issue provided yet. Tell us what happened to start building your case file."}
                  </p>
                  
                  {currentIssue && (
                    <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                       <span className="px-3 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-500">Location: {stateLocation}</span>
                       <span className="px-3 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-500">Involved: {amount || "N/A"}</span>
                    </div>
                  )}
               </section>

               <section className="space-y-6">
                  <h3 className="text-sm font-black text-navy dark:text-white uppercase tracking-widest pl-4 border-l-4 border-saffron">Action Timeline</h3>
                  <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-6 space-y-8 pl-8 pb-4">
                     
                     <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-green-500 -left-[41px] top-1 border-4 border-white dark:border-black" />
                        <h4 className="font-bold text-lg text-navy dark:text-white">Case Initiated</h4>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Today</p>
                     </div>

                     {documentsGenerated.length > 0 && documentsGenerated.map((doc, idx) => (
                       <div key={idx} className="relative animate-fadeIn">
                          <div className="absolute w-4 h-4 rounded-full bg-saffron -left-[41px] top-1 border-4 border-white dark:border-black" />
                          <h4 className="font-bold text-lg text-navy dark:text-white">Generated {doc.type}</h4>
                          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{new Date(doc.date).toLocaleDateString()}</p>
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group">
                             <div className="flex items-center gap-3">
                                <FileCheck className="text-saffron" size={20} />
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Draft Completed</span>
                             </div>
                             <button className="text-xs font-black text-navy dark:text-saffron uppercase hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Draft</button>
                          </div>
                       </div>
                     ))}

                     <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-800 -left-[41px] top-1 border-4 border-white dark:border-black" />
                        <h4 className="font-bold text-lg text-gray-400">Waiting for Next Step</h4>
                        <Link href="/get-help" className="mt-4 inline-flex items-center gap-2 text-xs font-black text-navy dark:text-saffron uppercase tracking-widest hover:gap-4 transition-all">
                           <span>Review Rights & Actions</span>
                           <ArrowRight size={14} />
                        </Link>
                     </div>

                  </div>
               </section>

            </div>

            {/* SIDEBAR */}
            <div className="space-y-8">
               <div className="p-8 bg-navy text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 -m-16 rounded-full group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 space-y-6">
                     <h3 className="font-black font-poppins text-2xl">Need Lawyer Support?</h3>
                     <p className="text-sm opacity-80 leading-relaxed font-medium">Your case data is saved locally. You can securely share this timeline and your generated drafts with a pro-bono lawyer to fast-track your resolution.</p>
                     <Link href="/lawyers" className="flex items-center justify-center gap-3 w-full py-4 bg-saffron text-navy rounded-xl font-black text-sm transition-transform active:scale-95 shadow-lg">
                        <Gavel size={18} />
                        <span>Find Vetted Lawyers</span>
                     </Link>
                  </div>
               </div>

               <div className="p-6 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-3xl flex items-start gap-4">
                  <ShieldCheck className="text-green-600 mt-1" size={24} />
                  <div className="space-y-1">
                     <h4 className="text-sm font-black text-green-800 dark:text-green-500">100% Private</h4>
                     <p className="text-xs font-semibold text-green-700 dark:text-green-600/70 leading-relaxed">This data never leaves your device unless you explicitly share it. We do not store your situation logs on remote servers.</p>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
