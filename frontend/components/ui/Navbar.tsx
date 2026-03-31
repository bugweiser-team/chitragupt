"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, Menu, X, Phone, Globe } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-[1000] w-full border-b transition-all duration-200 ${
        isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm border-gray-200 dark:border-gray-800' : 'bg-white dark:bg-black border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-navy to-navy-light rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <Scale size={24} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-navy dark:text-saffron text-lg font-bold tracking-tight">Chitragupta</span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Your Legal Backup</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="/get-help">Get Help</NavLink>
              <NavLink href="/documents">RTI Generator</NavLink>
              <NavLink href="/lawyers">Find a Lawyer</NavLink>
              <NavLink href="/my-case">My Case</NavLink>
              <NavLink href="/login">Sign In</NavLink>
            </div>

            {/* Right side options */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1 border border-gray-200 dark:border-gray-700">
                <button className="px-3 py-1 text-xs font-semibold bg-navy text-white rounded shadow-sm">EN</button>
                <button className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-navy dark:hover:text-saffron transition-colors">हिं</button>
              </div>
              <NavLink href="/register">
                <span className="px-4 py-2 bg-navy dark:bg-saffron text-white dark:text-navy font-bold rounded-lg shadow-lg hover:scale-105 transition-all text-sm">
                  Join Free
                </span>
              </NavLink>
              <a href="tel:15100" className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold border border-red-100 dark:border-red-900/50 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                <Phone size={16} />
                <span>Emergency: 15100</span>
              </a>
            </div>

            {/* Mobile toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-navy dark:text-saffron rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[2000] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[300px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-6 flex flex-col`}>
          <div className="flex items-center justify-between mb-8">
            <span className="font-bold text-navy dark:text-saffron">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={20} /></button>
          </div>
          <nav className="flex flex-col gap-2">
            <MobileNavLink href="/get-help" onClick={() => setIsOpen(false)}>Get Help</MobileNavLink>
            <MobileNavLink href="/documents" onClick={() => setIsOpen(false)}>RTI Generator</MobileNavLink>
            <MobileNavLink href="/lawyers" onClick={() => setIsOpen(false)}>Find a Lawyer</MobileNavLink>
            <MobileNavLink href="/my-case" onClick={() => setIsOpen(false)}>My Case</MobileNavLink>
            <MobileNavLink href="/login" onClick={() => setIsOpen(false)}>Sign In</MobileNavLink>
            <MobileNavLink href="/register" onClick={() => setIsOpen(false)}>Join Free</MobileNavLink>
          </nav>
          <div className="mt-auto space-y-4">
             <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full">
                <button className="flex-1 py-3 text-sm font-bold bg-navy text-white rounded-md shadow">English</button>
                <button className="flex-1 py-3 text-sm font-bold text-gray-500">हिंदी</button>
             </div>
             <a href="tel:15100" className="flex items-center justify-center gap-3 w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 active:scale-95 transition-transform">
                <Phone size={20} />
                <span>🆘 Emergency Help: 15100</span>
             </a>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-saffron hover:bg-navy-50 dark:hover:bg-navy-900/30 rounded-lg transition-all">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="px-4 py-4 text-base font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-50 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-800 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
