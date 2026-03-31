"use client";

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function OTPVerification({ userId, onSuccess }: { userId: string, onSuccess: () => void }) {
  const { verifyOTP, loading } = useAuth();
  const [otp, setOtp] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    try {
      await verifyOTP(userId, otp);
      onSuccess();
    } catch (err) {}
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6 text-center animate-fadeInUp">
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-navy dark:text-saffron">Verify Your Account</h3>
        <p className="text-gray-500 text-sm">We've sent a 6-digit code to your email and phone. Enter it below to secure your identity.</p>
      </div>

      <div>
        <input 
          type="text" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
          maxLength={6}
          placeholder="000000"
          className="w-full p-5 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-navy dark:focus:border-saffron rounded-2xl text-center text-4xl font-black tracking-[0.5em] outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full py-4 bg-navy dark:bg-saffron text-white dark:text-navy-dark font-black rounded-xl disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-95 shadow-xl"
      >
        {loading ? 'Verifying...' : 'Verify & Continue'}
      </button>

      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
        Didn't receive the code? <button type="button" className="underline hover:text-navy dark:hover:text-saffron">Resend in 60s</button>
      </p>
    </form>
  );
}
