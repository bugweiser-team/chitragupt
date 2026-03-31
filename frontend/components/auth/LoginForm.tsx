"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
  smsOtp:   z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function LoginForm({ onMfaRequired }: { onMfaRequired?: (userId: string) => void }) {
  const { login, loading } = useAuth();
  const [showSmsOtp, setShowSmsOtp] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login(data);
      if (result.data?.mfaRequired) {
        setShowSmsOtp(true);
        if (onMfaRequired) onMfaRequired(result.data.userId);
      } else {
        window.location.href = '/';
      }
    } catch (err) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input {...register('email')} type="email"
          className="mt-1 block w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-navy dark:focus:ring-saffron"
          placeholder="you@example.com" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input {...register('password')} type="password"
          className="mt-1 block w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl" />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {showSmsOtp && (
        <div className="animate-fadeInDown">
          <label className="block text-sm font-medium text-blue-600 dark:text-saffron">Enter SMS OTP</label>
          <input {...register('smsOtp')} type="text"
            className="mt-1 block w-full p-3 bg-blue-50 dark:bg-navy-900/30 border border-blue-200 dark:border-navy-800 rounded-xl font-mono text-center tracking-[1em]"
            placeholder="000000" maxLength={6} />
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full py-4 px-4 bg-navy dark:bg-saffron text-white dark:text-navy-dark font-black rounded-xl disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-95 shadow-xl">
        {loading ? 'Processing...' : 'Sign In'}
      </button>

      <div className="text-center pt-2">
        <a href="#" className="text-xs text-gray-400 hover:text-navy dark:hover:text-saffron underline uppercase tracking-widest font-bold">Forgot Password?</a>
      </div>
    </form>
  );
}
