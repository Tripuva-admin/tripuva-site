import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from './Alert';
import { useNotification } from '../contexts/NotificationContext';

export function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // If user is already logged in and is admin, redirect to dashboard
  if (!authLoading && user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.is_admin) {
          addNotification('success', 'Welcome back!', 'You have successfully logged in as admin.');
          navigate('/admin/dashboard');
        } else {
          throw new Error('Unauthorized access. Admin privileges required.');
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during login';
      setError(errorMessage);
      addNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="animate-spin text-primary">
          <Loader className="h-8 w-8" />
        </div>
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f424c] to-[#1c5d5e] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-white/10 p-3 rounded-full">
            <Lock className="h-12 w-12 text-yellow-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-200">
          Access the admin dashboard to manage packages and agencies
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {error && (
            <Alert
              variant="error"
              message={error}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1c5d5e] hover:bg-[#0f424c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5d5e] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}