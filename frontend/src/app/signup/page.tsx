import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useRouter } from 'next/router';

const SignUpPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      // Optionally, save additional user info to your database
      // Redirect to dashboard or login
      router.push('/dashboard');
    }
  };

  return (
    <div className="bg-white dark:bg-darkblack-500 flex flex-col lg:flex-row justify-between min-h-screen">
      {/* Left Section */}
      <div className="lg:w-1/2 px-5 xl:pl-12 pt-10">
        <header>
          <a href="/" className="">
            <img src="/assets/images/logo/logo-color.svg" className="block dark:hidden" alt="Logo" />
            <img src="/assets/images/logo/logo-white.svg" className="hidden dark:block" alt="Logo" />
          </a>
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
              {/* Google SVG Icon */}
              <svg
                width="23"
                height="22"
                viewBox="0 0 23 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- SVG paths -->
              </svg>
              <span> Sign Up with Google </span>
            </button>
            <button className="inline-flex justify-center items-center gap-x-2 border border-bgray-300 dark:border-darkblack-400 rounded-lg px-6 py-4 text-base text-bgray-900 dark:text-white font-medium">
              {/* Apple SVG Icon */}
              <svg
                className="fill-bgray-900 dark:fill-white"
                width="21"
                height="22"
                viewBox="0 0 21 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <!-- SVG paths -->
              </svg>
              <span> Sign Up with Apple </span>
            </button>
          </div>
          <div className="relative mt-6 mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-darkblack-400"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-darkblack-500 px-2 text-base text-bgray-600">Or continue with</span>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
              <div>
                <input
                  type="text"
                  className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <input
                type="email"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6 relative">
              <input
                type="password"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute top-4 right-4 bottom-4">
                {/* Eye Icon SVG */}
                <svg
                  width="22"
                  height="20"
                  viewBox="0 0 22 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- SVG paths -->
                </svg>
              </button>
            </div>
            <div className="mb-6 relative">
              <input
                type="password"
                className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute top-4 right-4 bottom-4">
                {/* Eye Icon SVG */}
                <svg
                  width="22"
                  height="20"
                  viewBox="0 0 22 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- SVG paths -->
                </svg>
              </button>
            </div>
            <div className="flex justify-between mb-7">
              <div className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 focus:ring-transparent rounded-md border border-bgray-300 focus:accent-success-300 text-success-300 dark:bg-transparent dark:border-darkblack-400"
                  name="agree"
                  id="agree"
                  required
                />
                <label htmlFor="agree" className="text-bgray-600 dark:text-bgray-50 text-base">
                  By creating an account, you agree to our
                  <span className="text-bgray-900 dark:text-white"> Privacy Policy,</span> and
                  <span className="text-bgray-900 dark:text-white"> Terms of Service.</span>
                </label>
              </div>
            </div>
            <button type="submit" className="py-3.5 flex items-center justify-center text-white font-bold bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full">
              Sign Up
            </button>
          </form>
          {/* Form Bottom */}
          <p className="text-center text-bgray-900 dark:text-bgray-50 text-base font-medium pt-7">
            Already have an account?
            <a href="/login" className="font-semibold underline"> Sign In</a>
          </p>
          <nav className="flex items-center justify-center flex-wrap gap-x-11 pt-24">
            <a href="#" className="text-sm text-bgray-700 dark:text-bgray-50">Terms & Conditions</a>
            <a href="#" className="text-sm text-bgray-700 dark:text-bgray-50">Privacy Policy</a>
            <a href="#" className="text-sm text-bgray-700 dark:text-bgray-50">Help</a>
            <a href="#" className="text-sm text-bgray-700 dark:text-bgray-50">English</a>
          </nav>
          {/* Copyright */}
          <p className="text-bgray-600 dark:text-darkblack-300 text-center text-sm mt-6">
            &copy; 2023 Bankco. All Rights Reserved.
          </p>
        </div>
      </div>
      {/* Right Section */}
      <div className="lg:w-1/2 lg:block hidden bg-[#F6FAFF] dark:bg-darkblack-600 p-20 relative">
        <ul>
          <li className="absolute top-10 left-8">
            <img src="/assets/images/shapes/square.svg" alt="" />
          </li>
          <li className="absolute right-12 top-14">
            <img src="/assets/images/shapes/vline.svg" alt="" />
          </li>
          <li className="absolute bottom-7 left-8">
            <img src="/assets/images/shapes/dotted.svg" alt="" />
          </li>
        </ul>
        <div className="mb-10">
          <img src="/assets/images/illustration/signup.svg" alt="" />
        </div>
        <div>
          <div className="text-center max-w-lg px-1.5 m-auto">
            <h3 className="text-bgray-900 dark:text-white font-semibold font-poppins text-4xl mb-4">
              Speedy, Easy and Fast
            </h3>
            <p className="text-bgray-600 dark:text-darkblack-300 text-sm font-medium">
              BankCo. helps you set saving goals, earn cash back offers, and get paychecks up to two days early. Get a
              <span className="text-success-300 font-bold"> $20</span> bonus when you receive qualifying direct deposits.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<!--scripts -->
<script src="/assets/js/jquery-3.6.0.min.js"></script>
<script src="/assets/js/main.js"></script>
</section>

