"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const router = useRouter();
  const { login, socialLogin } = useAuth();

  useEffect(() => {
    // Autofill functionality
    const autofillData = localStorage.getItem('loginAutofill');
    if (autofillData) {
      const { email, remember } = JSON.parse(autofillData);
      setEmail(email || '');
      setRemember(remember || false);
    }
  }, []);

  const validateInputs = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Save autofill data
      if (remember) {
        localStorage.setItem('loginAutofill', JSON.stringify({ email, remember }));
      } else {
        localStorage.removeItem('loginAutofill');
      }
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'linkedin') => {
    try {
      await socialLogin(provider);
      router.push('/dashboard');
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setError(`${provider} login failed. Please try again.`);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const getPasswordStrength = (password: string) => {
    const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
    const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

    if (strongRegex.test(password)) {
      return 'Strong';
    } else if (mediumRegex.test(password)) {
      return 'Medium';
    } else {
      return 'Weak';
    }
  };

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(password));
  }, [password]);

  return (
    <section className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Left Section */}
      <div className="lg:w-1/2 p-10 flex flex-col justify-center">
        <header className="mb-8 text-center">
          <Image src="/assets/images/logo/logo-color.svg" width={200} height={50} className="block dark:hidden mb-4" alt="Logo" />
          <Image src="/assets/images/logo/logo-white.svg" width={200} height={50} className="hidden dark:block mb-4" alt="Logo" />
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">Sign In to AmazingMail</h2>
          <p className="text-base text-gray-600 dark:text-gray-300">Access your cold email system</p>
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
            {password && (
              <div className={`text-sm mt-1 ${passwordStrength === 'Strong' ? 'text-green-600' : passwordStrength === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                Password strength: {passwordStrength}
              </div>
            )}
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
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Forgot password?
            </button>
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
            onClick={() => handleSocialLogin('google')}
            className="inline-flex justify-center items-center gap-x-2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-base text-gray-800 dark:text-white font-medium"
            aria-label="Login with Google"
          >
            <FaGoogle className="text-red-500" />
            Sign In with Google
          </button>
          <button
            onClick={() => handleSocialLogin('linkedin')}
            className="inline-flex justify-center items-center gap-x-2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-base text-gray-800 dark:text-white font-medium"
            aria-label="Login with LinkedIn"
          >
            <FaLinkedin className="text-blue-600" />
            Sign In with LinkedIn
          </button>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-300">
          Don&apos;t have an account? <a href="/signup" className="font-semibold underline text-blue-600 dark:text-blue-400">Sign Up</a>
        </p>
      </div>

      {/* Right Section - Illustration or Additional Info */}
      <div className="lg:w-1/2 lg:block hidden bg-[#F6FAFF] dark:bg-gray-600 p-20 relative">
        <Image src="/assets/images/illustration/signin.svg" width={500} height={500} alt="Sign In Illustration" className="mx-auto" />
        <h3 className="text-bgray-900 dark:text-white font-semibold text-4xl mb-4 text-center">Streamline Your Cold Email Campaigns</h3>
        <p className="text-bgray-600 dark:text-bgray-50 text-sm font-medium text-center">
          AmazingMail helps you create, manage, and optimize your cold email campaigns for better results.
          Get started today and see the difference in your outreach efforts.
        </p>
      </div>
    </section>
  );
}

