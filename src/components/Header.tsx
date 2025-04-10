import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ArrowRight, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database.types';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

interface HeaderProps {
  user: Profile | null;
}

export function Header({ user }: HeaderProps) {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { addNotification } = useNotification();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      addNotification('success', 'You have been successfully signed out');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      addNotification('error', 'Failed to sign out. Please try again.');
    }
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1c5d5e]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-comfortaa text-white tracking-wide">
                Tripuva
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link 
              to="/top-places" 
              className="bg-gradient-to-r from-white to-gray-100 text-black px-4 py-2 rounded-md hover:from-gray-100 hover:to-white transition-all duration-200 text-base font-medium flex items-center"
            >
              <Star className="h-4 w-4 mr-2 text-gold" />
              Top Places
            </Link>

            <a 
              href="https://google.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent text-white px-4 py-2 rounded-md border border-white hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 text-base font-medium flex items-center"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Contact us on Whatsapp
            </a>
            
            {user && (
              <button
                onClick={handleSignOut}
                className="text-white hover:text-blue-200 flex items-center text-base font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="sm:hidden inline-flex items-center justify-center w-12 h-12 rounded-lg text-white hover:bg-white/10 focus:outline-none active:bg-white/20"
          >
            {isMobileMenuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="sm:hidden py-4">
            <div className="space-y-3 px-1">
              <Link
                to="/top-places"
                onClick={toggleMenu}
                className="block bg-gradient-to-r from-white to-gray-100 text-black px-5 py-3.5 rounded-xl hover:from-gray-100 hover:to-white transition-all duration-200 text-base font-medium"
              >
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-3 text-gold" />
                  Top Places
                </div>
              </Link>

              <a
                href="https://google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-transparent text-white px-5 py-3.5 rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-200 text-base font-medium"
              >
                <div className="flex items-center">
                  <ArrowRight className="h-5 w-5 mr-3" />
                  Contact us on Whatsapp
                </div>
              </a>

              {user && (
                <button
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                  className="w-full text-left text-white px-5 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200 text-base font-medium"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 