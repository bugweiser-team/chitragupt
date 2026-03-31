"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function FAB() {
  return (
    <Link 
      href="/get-help"
      className="fixed bottom-24 right-6 md:right-8 w-16 h-16 bg-gradient-to-br from-saffron to-saffron-dark rounded-full flex items-center justify-center text-navy shadow-2xl shadow-saffron/40 hover:scale-110 active:scale-95 transition-all z-[900] group"
    >
      <MessageCircle size={28} />
      <div className="absolute right-20 bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
        Ask Chitragupta AI
      </div>
    </Link>
  );
}
