"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import zxcvbn from 'zxcvbn';
import { useAuth } from '../../hooks/useAuth';

const schema = z.object({
  fullName: z.string().min(2, 'Name too short'),
  email:    z.string().email('Invalid email'),
  phone:    z.string().optional(),
  password: z.string().min(8, 'Min 8 characters'),
  role:     z.string(),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm({ onSuccess }: { onSuccess: (userId: string) => void }) {
  const { register: authRegister, loading } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'litigant' }
  });

  const password = watch('password', '');
  React.useEffect(() => {
    if (password) setPasswordStrength(zxcvbn(password).score);
  }, [password]);

  const onSubmit = async (data: FormData) => {
    const result = await authRegister(data);
    onSuccess(result.data.userId);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
        <input {...register('fullName')} type="text"
          className="mt-1 block w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-navy dark:focus:ring-saffron"
          placeholder="Your full legal name" />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input {...register('email')} type="email"
          className="mt-1 block w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-navy dark:focus:ring-saffron"
          placeholder="you@example.com" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone (for SMS OTP)</label>
        <input {...register('phone')} type="tel"
          className="mt-1 block w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-navy dark:focus:ring-saffron"
          placeholder="+91 98765 43210" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input {...register('password')} type="password"
          className="mt-1 block w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl" />
        {password && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[0,1,2,3,4].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200 dark:bg-gray-800'}`} />
              ))}
            </div>
            <p className="text-xs mt-1 text-gray-500">{strengthLabels[passwordStrength]}</p>
          </div>
        )}
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">I am a</label>
        <select {...register('role')} className="mt-1 block w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <option value="litigant">Litigant (seeking legal help)</option>
          <option value="lawyer">Lawyer (providing legal help)</option>
        </select>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-4 px-4 bg-navy dark:bg-saffron text-white dark:text-navy-dark font-black rounded-xl disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-95 shadow-xl">
        {loading ? 'Registering...' : 'Create Account'}
      </button>
    </form>
  );
}
