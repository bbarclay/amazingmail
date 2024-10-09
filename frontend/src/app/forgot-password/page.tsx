// src/app/forgot-password/page.tsx

"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import ClipLoader from 'react-spinners/ClipLoader';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess('Password reset email sent. Please check your inbox.');
    } catch (error: unknown) {
      console.error('Password reset failed:', error);
      setError(error instanceof Error ? error.message : 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="lg:w-1/2 p-10 flex flex-col justify-center">
        <header className="mb-8 text-center">
          <Image src="/assets/images/logo/logo-color.svg" width={200} height={50} className="block dark:hidden mb-4" alt="Logo" />
          <Image src="/assets/images/logo/logo-white.svg" width={200} height={50} className="hidden dark:block mb-4" alt="Logo" />
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">Forgot Password</h2>
          <p className="text-base text-gray-600 dark:text-gray-300">Enter your email to reset your password</p>
        </header>

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Reset Password'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Remember your password? <a href="/login" className="font-semibold underline text-blue-600 dark:text-blue-400">Log In</a>
        </p>
      </div>

      <div className="lg:w-1/2 lg:block hidden bg-[#F6FAFF] dark:bg-gray-600 p-20 relative">
        <Image src="/assets/images/illustration/forgot-password.svg" width={500} height={500} alt="Forgot Password Illustration" className="mx-auto" />
        <h3 className="text-bgray-900 dark:text-white font-semibold text-4xl mb-4 text-center">Password Recovery</h3>
        <p className="text-bgray-600 dark:text-bgray-50 text-sm font-medium text-center">
          Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back into your account.
        </p>
      </div>
    </section>
  );
}

