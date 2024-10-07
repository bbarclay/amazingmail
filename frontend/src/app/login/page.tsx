// src/app/login/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, remember);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <section className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Left Section */}
      <div className="lg:w-1/2 p-10 flex flex-col justify-center">
        <header className="mb-8 text-center">
          <img src="/assets/images/logo/logo-color.svg" className="block dark:hidden mb-4" alt="Logo" />
          <img src="/assets/images/logo/logo-white.svg" className="hidden dark:block mb-4" alt="Logo" />
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">Sign In to Tailwinds</h2>
          <p className="text-base text-gray-600 dark:text-gray-300">Send, spend, and save smarter</p>
        </header>

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
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
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Login'}
          </button>
        </form>

        <div className="relative mt-6 mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-gray-800 px-2 text-base text-gray-600 dark:text-gray-300">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="inline-flex justify-center items-center gap-x-2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-base text-gray-800 dark:text-white font-medium"
            aria-label="Login with Google"
          >
            <FaGoogle className="text-red-500" />
            Sign In with Google
          </button>
          <button
            onClick={() => handleSocialLogin('Facebook')}
            className="inline-flex justify-center items-center gap-x-2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-base text-gray-800 dark:text-white font-medium"
            aria-label="Login with Facebook"
          >
            <FaFacebook className="text-blue-600" />
            Sign In with Facebook
          </button>
          <button
            onClick={() => handleSocialLogin('Apple')}
            className="inline-flex justify-center items-center gap-x-2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-base text-gray-800 dark:text-white font-medium"
            aria-label="Login with Apple"
          >
            <FaApple className="text-black" />
            Sign In with Apple
          </button>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-300">
          Don’t have an account? <a href="/signup" className="font-semibold underline text-blue-600 dark:text-blue-400">Sign Up</a>
        </p>
      </div>

      {/* Right Section - Illustration or Additional Info */}
      <div className="lg:w-1/2 lg:block hidden bg-[#F6FAFF] dark:bg-gray-600 p-20 relative">
        <img src="/assets/images/illustration/signin.svg" alt="Sign In Illustration" className="mx-auto" />
        <h3 className="text-bgray-900 dark:text-white font-semibold text-4xl mb-4 text-center">Speedy, Easy, and Fast</h3>
        <p className="text-bgray-600 dark:text-bgray-50 text-sm font-medium text-center">
          BankCo. helps you set saving goals, earn cash back offers, and receive paychecks up to two days early.
          Get a <span className="text-success-300 font-bold">$20</span> bonus when you receive qualifying direct deposits.
        </p>
      </div>
    </section>
  );
}
