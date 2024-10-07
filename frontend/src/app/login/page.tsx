import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

const LoginPage: React.FC = () => {
  // Default credentials for testing purposes
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error, session } = await supabase.auth.signIn({ email, password });
    if (error) {
      alert('Invalid credentials');
    } else {
      // Store authentication state
      localStorage.setItem('authenticated', 'true');
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="p-6 bg-white rounded shadow-md" onSubmit={handleLogin}>
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

