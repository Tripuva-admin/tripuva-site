import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, LogOut, Menu } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/database.types';

interface HeaderProps {
  user: Profile | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 pt-4 bg-[#0a2472]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold font-comfortaa text-white tracking-wide">Tripuva</h1>
            </Link>
          </div>

          <div className="hidden sm:flex items-center space-x-6">
            <Link 
              to="/top-places" 
              className="bg-gradient-to-r from-white to-gray-100 text-black px-4 py-2 rounded-md hover:from-gray-100 hover:to-white transition-all duration-200 text-base font-medium flex items-center"
            >
              <Star className="h-4 w-4 mr-2" />
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
                onClick={() => supabase.auth.signOut()}
                className="text-white hover:text-blue-200 flex items-center text-base font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            )}
          </div>

          <button
            onClick={() => console.log('Mobile menu button clicked')}
            className="sm:hidden text-white w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="h-8 w-8" />
          </button>
        </div>
      </nav>
    </header>
  );
} 