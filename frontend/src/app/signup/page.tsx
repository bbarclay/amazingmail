"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import ClipLoader from 'react-spinners/ClipLoader';

const SignUpPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Autofill functionality
    const autofillData = localStorage.getItem('signupAutofill');
    if (autofillData) {
      const { firstName, lastName, email } = JSON.parse(autofillData);
      setFirstName(firstName || '');
      setLastName(lastName || '');
      setEmail(email || '');
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
      );
      setLoading(false);
      return;
    }

    try {
      await register(email, password, firstName, lastName);
      // Save autofill data
      localStorage.setItem(
        'signupAutofill',
        JSON.stringify({ firstName, lastName, email })
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    const mediumRegex = new RegExp(
      '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
    );

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
    <div className="bg-white dark:bg-darkblack-500 flex flex-col lg:flex-row justify-between min-h-screen">
      <div className="lg:w-1/2 px-5 xl:pl-12 pt-10">
        <header>
          <Link href="/" className="">
            <Image
              src="/assets/images/logo/logo-color.svg"
              className="block dark:hidden"
              alt="Logo"
              width={150}
              height={50}
            />
            <Image
              src="/assets/images/logo/logo-white.svg"
              className="hidden dark:block"
              alt="Logo"
              width={150}
              height={50}
            />
          </Link>
        </header>
        <div className="max-w-[460px] m-auto pt-24 pb-16">
          <header className="text-center mb-8">
            <h2 className="text-bgray-900 dark:text-white text-4xl font-semibold font-poppins mb-2">
              Sign up for an account
            </h2>
            <p className="font-urbanis text-base font-medium text-bgray-600 dark:text-darkblack-300">
              Send, spend and save smarter
            </p>
          </header>
          {/* Google & Apple Button */}
          <div className="flex flex-col md:flex-row gap-4">
            <button className="inline-flex justify-center items-center gap-x-2 border border-bgray-300 dark:border-darkblack-400 rounded-lg px-6 py-4 text-base text-bgray-900 dark:text-white font-medium">
              <Image
                src="/assets/images/google-icon.svg"
                width={23}
                height={22}
                alt="Google Icon"
              />
              <span>Sign Up with Google</span>
            </button>
          </div>
          <div className="relative border-b border-bgray-300 dark:border-darkblack-400 mt-6 mb-5">
            <p className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 bg-white dark:bg-darkblack-500 text-center text-sm font-medium text-bgray-600 dark:text-darkblack-300">
              Or continue with
            </p>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-bgray-600 dark:text-darkblack-300 font-medium mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 mt-1 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-bgray-600 dark:text-darkblack-300 font-medium mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 mt-1 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-bgray-600 dark:text-darkblack-300 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mt-1 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-bgray-600 dark:text-darkblack-300 font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mt-1 border rounded"
                required
              />
              {password && (
                <div
                  className={`text-sm mt-1 ${
                    passwordStrength === 'Strong'
                      ? 'text-green-600'
                      : passwordStrength === 'Medium'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  Password strength: {passwordStrength}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-bgray-600 dark:text-darkblack-300 font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mt-1 border rounded"
                required
              />
            </div>
            <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded">
              {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Sign Up"}
            </button>
          </form>
          <p className="text-center text-bgray-900 dark:text-bgray-50 text-base font-medium pt-7">
            Already have an account?
            <Link href="/login" className="font-semibold underline">
              {' '}
              Sign In
            </Link>
          </p>
        </div>
      </div>
      {/* Right Section */}
      <div className="lg:w-1/2 lg:block hidden bg-[#F6FAFF] dark:bg-darkblack-600 p-20 relative">
        {/* Illustration and content */}
        <Image
          src="/assets/images/illustration/signup.svg"
          width={500}
          height={500}
          alt="Sign Up Illustration"
          className="mx-auto"
        />
        <h3 className="text-bgray-900 dark:text-white font-semibold text-4xl mb-4 text-center">
          Start Your Journey with Us
        </h3>
        <p className="text-bgray-600 dark:text-bgray-50 text-sm font-medium text-center">
          Join our platform and discover a world of possibilities. Sign up now
          to access exclusive features and start your journey towards success.
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

