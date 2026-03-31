"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { ShieldCheck, Scale, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [userId, setUserId] = useState<string | null>(null);

  const handleRegisterSuccess = (id: string) => {
    setUserId(id);
  };

  const handleVerifySuccess = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-navy-50/50 dark:bg-navy-900/10 blur-[120px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-saffron-50/50 dark:bg-saffron-900/10 blur-[100px] -z-10 rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 group mb-6">
          <ArrowLeft size={16} className="text-gray-400 group-hover:text-navy dark:group-hover:text-saffron transition-colors" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-navy">Back to Home</span>
        </Link>
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-navy dark:bg-saffron rounded-2xl flex items-center justify-center text-white dark:text-navy shadow-2xl">
            <ShieldCheck size={32} />
          </div>
        </div>
        <h2 className="text-4xl font-black font-poppins text-navy dark:text-white tracking-tight">
          Join Chitragupt
        </h2>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
          <Scale size={14} className="text-saffron dark:text-saffron-light" />
          Secure Legal Access for Everyone
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-gray-950/50 py-10 px-6 sm:px-10 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-900 backdrop-blur-sm">
          {!userId ? (
            <RegisterForm onSuccess={handleRegisterSuccess} />
          ) : (
            <OTPVerification userId={userId} onSuccess={handleVerifySuccess} />
          )}

          {!userId && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Already have an account?{' '}
                <Link href="/login" className="text-navy dark:text-saffron font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
        
        <p className="mt-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          © 2026 Chitragupt • Endorsed by Law for All initiative
        </p>
      </div>
    </div>
  );
}
