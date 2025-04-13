import { useState, useEffect, useRef } from 'react';
import { Users, Calendar, ArrowRight, Star, LogOut, Clock, Menu, X, ChevronLeft, ChevronRight, ChevronDown, MapPin, IndianRupee } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { PackageModal } from './components/PackageModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { About } from './components/pages/About';
import { Contact } from './components/pages/Contact';
import { FAQ } from './components/pages/FAQ';
import { Terms } from './components/pages/Terms';
import { Privacy } from './components/pages/Privacy';
import { Refund } from './components/pages/Refund';
import { Disclaimer } from './components/pages/Disclaimer';
import { NotFound } from './components/ErrorPages';
import { ServerError } from './components/ErrorPages';
import { Unauthorized } from './components/ErrorPages';
import { Forbidden } from './components/ErrorPages';
import { BadRequest } from './components/ErrorPages';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ScrollToTop } from './components/ScrollToTop';
import { supabase } from './lib/supabase';
import { Package, Profile } from './types/database.types';
import TopPlaces from "./components/TopPlaces";
import CustomerRating from "./components/CustomerRating";
import PartnerCarousel from "./components/PartnerCarousel";
import './index.css' 
import { ProtectedRoute } from './components/ProtectedRoute';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/datepicker.css";
import PackageDetail from './components/pages/PackageDetail';
import TallyForm from "./components/pages/TallyForm";

const backgroundImageUrl = import.meta.env.VITE_HOMEPAGE_BACKGROUND_IMAGE;

var AVAILABLE_TAGS: any[]
var parsedConfig: any 

const config_response = await supabase
  .from('config')
  .select('*')

if (config_response.error) {
  console.error("Error fetching config data:", config_response.error);
} else {
  var parsedConfig = Object.fromEntries(
    config_response.data.map(item => {
      try {
        // First, check if the value is already a valid JSON string
        if (typeof item.config_value === 'string') {
          try {
            // Try parsing as is first
            return [item.config_key, JSON.parse(item.config_value)];
          } catch (e) {
            // If that fails, try fixing common JSON formatting issues
            const formattedValue = item.config_value
              .replace(/(\w+):(?![^"]*https?:\/\/)/g, '"$1":') // Fix unquoted keys, avoid URLs
              .replace(/'([^']*)'/g, '"$1"') // Convert single quotes to double quotes
              .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'); // Add quotes around unquoted keys
            
            try {
              return [item.config_key, JSON.parse(formattedValue)];
            } catch (parseError) {
              console.error(`Error parsing JSON for ${item.config_key}:`, parseError);
              console.error('Original value:', item.config_value);
              console.error('Formatted value:', formattedValue);
              return [item.config_key, null];
            }
          }
        } else {
          // If it's not a string, return as is
          return [item.config_key, item.config_value];
        }
      } catch (err) {
        console.error(`Error processing config for ${item.config_key}:`, err);
        return [item.config_key, null];
      }
    })
  );
}

console.log('Parsed config:', parsedConfig);

const tags_response = await supabase
  .from('tags')
  .select('*');

if (tags_response.error) {
  console.error("Error fetching data:", tags_response.error);
} else if (Array.isArray(tags_response.data)) {
  AVAILABLE_TAGS = tags_response.data.map(item => item.tag_name);
} else {
  console.warn("Unexpected response format:", tags_response);
}

interface HeaderProps {
  user: Profile | null;
}

function Header({ user }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const isTopPlaces = location.pathname === '/top-places';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className={`w-full z-50 ${
      isMobileMenuOpen 
        ? 'bg-[#081314]' 
        : isHomePage 
          ? 'absolute top-0 left-0 right-0 bg-transparent' 
          : 'bg-[#081314]'
    } ${isTopPlaces ? 'border-b-0' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
        <Link to="/" className="flex flex-col items-center justify-center leading-none group">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-comfortaa text-yellow-400 tracking-wide">
    Tripuva
  </h1>
  <svg
    className="w-28 sm:w-32 h-5 mt-1 transition-transform duration-300 group-hover:scale-105"
    viewBox="0 0 100 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 15 C 25 5, 75 5, 95 15"
      stroke="#facc15"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
</Link>




    
          <nav className="hidden sm:flex items-center space-x-6">
            <Link 
              to="/top-places" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Star className="h-5 w-5 mr-2 text-black fill-current drop-shadow-md transition-transform hover:scale-110 strokeWidth={2}" />
              Top Trips
            </Link>
    
            <a 
              href={`${import.meta.env.VITE_WHATSAPP_LINK}/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent text-white px-4 py-2 rounded-md border border-gray-300 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 text-base font-normal flex items-center"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Contact us on Whatsapp
            </a>
    
            {user && (
              <button
                onClick={handleSignOut}
                className="text-white hover:text-gray-200 flex items-center"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            )}
          </nav>
    
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden text-white w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-9 w-9 transition-transform duration-200 ease-in-out" strokeWidth={2.5} />
            ) : (
              <Menu className="h-9 w-9 transition-transform duration-200 ease-in-out" strokeWidth={2.5} />
            )}
          </button>
        </div>
    
        {/* Mobile menu with smooth transition */}
        <div
  className={`sm:hidden fixed top-20 left-4 right-4 z-50 rounded-2xl shadow-lg backdrop-blur-lg bg-white/10 ring-1 ring-white/20 transition-all duration-500 ease-in-out transform ${
    isMobileMenuOpen ? 'max-h-[500px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 pointer-events-none'
  } overflow-hidden`}
>
  <nav className="mt-4 pb-4 px-4">
    <div className="flex flex-col space-y-4">
      <Link
        to="/top-places"
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-3 rounded-xl text-base font-semibold w-full text-center flex items-center justify-center transition-all duration-200 hover:from-yellow-500 hover:to-yellow-700 shadow-sm"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Star className="h-5 w-5 mr-2 text-black" strokeWidth={2} />
        Top Trips
      </Link>

      <a
        href={`${import.meta.env.VITE_WHATSAPP_LINK}/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white/10 text-white px-4 py-3 rounded-xl border border-white/30 hover:bg-green-500 hover:text-white hover:border-green-600 transition-all duration-200 text-base font-normal w-full text-center flex items-center justify-center backdrop-blur-md"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <ArrowRight className="h-5 w-5 mr-2" strokeWidth={2} />
        Contact us on Whatsapp
      </a>

      {user && (
        <button
          onClick={() => {
            handleSignOut();
            setIsMobileMenuOpen(false);
          }}
          className="text-white hover:text-gray-200 flex items-center justify-center py-3 px-4 w-full border border-white/20 rounded-xl transition-all duration-200 hover:bg-white/10"
        >
          <LogOut className="h-5 w-5 mr-2" strokeWidth={2} />
          Sign Out
        </button>
      )}
    </div>
  </nav>
</div>

      </div>
    </header>
    
  );
}

function MainContent({ setSelectedPackage }: {
  selectedPackage: Package | null;
  setSelectedPackage: (pkg: Package | null) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState<(Package & { agency: { name: string; rating: number } | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [filters, setFilters] = useState({
    destination: '',
    maxPrice: '',
    startDate: '',
    tags: [] as string[]
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 12;

  // Sorting state
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const packagesRef = useRef<HTMLDivElement>(null);

  // Add effect to handle scrolling when page changes
  useEffect(() => {
    if (packagesRef.current) {
      const yOffset = -100; // Offset to account for any fixed headers
      const element = packagesRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          agency:agencies(
            name,
            rating
          ),
          package_images(
            id,
            image_url,
            is_primary
          ),
          itenary
        `)
        .eq('status', 'open')
        .order('ranking', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setPackages([]);
        return;
      }

      const transformedData = data.map(pkg => {
        const primaryImage = pkg.package_images?.find((img: { is_primary: any; })=> img.is_primary)?.image_url;
        return {
          ...pkg,
          image: primaryImage || pkg.image,
          package_images: pkg.package_images || []
        };
      });

      setPackages(transformedData);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (type: string) => {
    const sortedPackages = [...packages];
    switch (type) {
      case 'price':
        sortedPackages.sort((a, b) => a.price - b.price);
        break;
      case '-price':
        sortedPackages.sort((a, b) => b.price - a.price);
        break;
      case 'date':
        sortedPackages.sort((a, b) => {
          const getLatestDate = (pkg: any): number => {
            if (!pkg.start_date_2) return 0;
            const dates = Object.keys(pkg.start_date_2);
            if (dates.length === 0) return 0;
            return Math.max(...dates.map(d => new Date(d).setHours(0, 0, 0, 0)));
          };
          return getLatestDate(b) - getLatestDate(a);
        });
        break;
    }
    setPackages(sortedPackages);
    setSortMenuOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      destination: '',
      maxPrice: '',
      startDate: '',
      tags: []
    });
    setSearchQuery('');
    setHasUserInteracted(false);
    setCurrentPage(1);
  };

  const clearDestination = () => {
    setFilters(prev => ({ ...prev, destination: '' }));
    setHasUserInteracted(true);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setHasUserInteracted(true);
    setCurrentPage(1);
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
    setHasUserInteracted(true);
    setCurrentPage(1);
  };

  const filteredPackages = hasUserInteracted
    ? packages.filter(pkg => {
        const matchesDestination = !filters.destination || 
          pkg.title.toLowerCase().includes(filters.destination.toLowerCase()) ||
          pkg.description.toLowerCase().includes(filters.destination.toLowerCase());

        const matchesPrice = !filters.maxPrice || pkg.price <= parseInt(filters.maxPrice);

        const matchesDate = !filters.startDate || (() => {
          const filterDate = new Date(filters.startDate).toISOString().split('T')[0];
          const startDate2 = pkg.start_date_2 || {};
          
          if (Object.keys(startDate2).length > 0) {
            return Object.keys(startDate2).some(date => {
              const packageDate = new Date(date).toISOString().split('T')[0];
              return packageDate >= filterDate && startDate2[date] > 0;
            });
          }
          return false;
        })();

        const matchesTags = filters.tags.length === 0 || 
          filters.tags.some(tag => pkg.tags?.includes(tag));

        return matchesDestination && matchesPrice && matchesDate && matchesTags;
      })
    : packages;

  // Calculate pagination
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-[600px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative w-full z-10 pt-40 sm:pt-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link to="/" className="inline-block">
              <h2 className="text-4.5xl sm:text-4xl md:text-5xl lg:text-6xl text-white sm:tracking-tight">
              <span className="font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">Travel Together,</span> <span className="font-medium">Create Memories</span>
              </h2>
            </Link>
            <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white">
              Join group trips across India's most beautiful cities. Meet new people and explore together.
            </p>

            {/* Search and Filters */}
            <div className="mt-8 mb-5">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-5 max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Find Your Perfect Trip</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Destination Field */}
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#1c5d5e]" />
                      Destination
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Where do you want to go?"
                        className="w-full pl-4 pr-3 py-3 rounded-lg border-2 border-gray-200 bg-white/80 shadow-sm focus:border-[#1c5d5e] focus:ring focus:ring-[#1c5d5e]/10 outline-none transition-all duration-200 placeholder:text-gray-400"
                        value={filters.destination}
                        onChange={(e) => handleFilterChange({ destination: e.target.value })}
                      />
                      {filters.destination && (
                        <button
                          onClick={clearDestination}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Price Field */}
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-[#1c5d5e]" />
                      Budget
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Max budget"
                        min="0"
                        className="w-full pl-4 pr-10 py-3 rounded-lg border-2 border-gray-200 bg-white/80 shadow-sm focus:border-[#1c5d5e] focus:ring focus:ring-[#1c5d5e]/10 outline-none transition-all duration-200 placeholder:text-gray-400"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                        <span className="text-sm font-medium">₹</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Field */}
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#1c5d5e]" />
                      Travel Date
                    </label>
                    <div className="relative datepicker-wrapper">
                      <DatePicker
                        selected={filters.startDate ? new Date(filters.startDate) : null}
                        onChange={(date: Date | null) => {
                          handleFilterChange({
                            startDate: date ? date.toISOString().split('T')[0] : ''
                          });
                        }}
                        minDate={new Date()}
                        placeholderText="Select travel date"
                        dateFormat="dd MMM yyyy"
                        showPopperArrow={false}
                        isClearable
                        customInput={
                          <input
                            type="text"
                            className="w-full pl-4 pr-10 py-3 rounded-lg border-2 border-gray-200 bg-white/80 shadow-sm focus:border-[#1c5d5e] focus:ring focus:ring-[#1c5d5e]/10 outline-none transition-all duration-200 text-gray-600 cursor-pointer"
                            readOnly
                          />
                        }
                        className="w-full"
                        calendarClassName="shadow-lg rounded-lg border border-gray-100 bg-white"
                        popperClassName="z-[1000]"
                        popperPlacement="bottom-start"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <Calendar className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                {(filters.destination || filters.maxPrice || filters.startDate) && (
                  <div className="mt-2 flex justify-center">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-sm font-medium text-[#1c5d5e] hover:bg-[#1c5d5e]/5 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Popular Destinations</h2>
        <div className="flex justify-between items-center mb-4">
        
          {filters.destination && (
            <button
              onClick={clearDestination}
              className="flex items-center text-primary hover:text-primary-700 transition-colors"
            >
              <X className="h-5 w-5 mr-1" />
              Clear Selection
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Goa", image: `${import.meta.env.VITE_POPULAR_DESTINATION_GOA_IMAGE}?auto=format&fit=crop&q=80`, hasPackage: true },
            { name: "Manali", image: `${import.meta.env.VITE_POPULAR_DESTINATION_MANALI_IMAGE}?auto=format&fit=crop&q=80`, hasPackage: false },
            { name: "Jaipur", image: `${import.meta.env.VITE_POPULAR_DESTINATION_JAIPUR_IMAGE}?auto=format&fit=crop&q=80`, hasPackage: false },
            { name: "Varanasi", image: `${import.meta.env.VITE_POPULAR_DESTINATION_VARANASI_IMAGE}?auto=format&fit=crop&q=80`, hasPackage: false },
            { name: "Kerala", image: `${import.meta.env.VITE_POPULAR_DESTINATION_KERALA_IMAGE}?auto=format&fit=crop&q=80`, hasPackage: false },
            { name: "Ladakh", image: `${import.meta.env.VITE_POPULAR_DESTINATION_LADAKH_IMAGE}?auto=format&fit=crop&q=80`, hasPackage: false }
          ].map((city) => (
            <div key={city.name} className="relative group">
              <button
                onClick={() => handleFilterChange({ destination: city.name })}
                className={`relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 w-full ${
                  filters.destination === city.name ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <div className="w-full pb-[100%] relative">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-lg">{city.name}</p>
                  </div>
                  {!city.hasPackage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-lg text-opacity-70 font-normal">Coming Soon</span>
                    </div>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Filter by Experience</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filters.tags.includes(tag)
                    ? 'bg-[#1c5d5e] text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {filters.tags.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setFilters(prev => ({ ...prev, tags: [] }))}
                className="px-4 py-2 text-sm font-medium text-[#1c5d5e] hover:text-[#133f40] transition-colors duration-200 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Tags
              </button>
            </div>
          )}
        </div>
      </div>

      {/* All Trips */}
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
      <div className="relative mb-4 flex items-center justify-center">
  {/* Centered Heading */}
  <h2 className="text-2xl font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
    All Trips
  </h2>

  {/* Sort by Dropdown on Right */}
  <div className="ml-auto">
    <div className="relative">
      <button
        onClick={() => setSortMenuOpen(!sortMenuOpen)}
        className="text-sm text-primary hover:text-primary-700 flex items-center bg-white px-4 py-2 rounded-md border border-gray-200"
      >
        Sort by
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>
      {sortMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
          <button
            onClick={() => handleSort('price')}
            className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
          >
            Price (Low to High)
          </button>
          <button
            onClick={() => handleSort('-price')}
            className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
          >
            Price (High to Low)
          </button>
          <button
            onClick={() => handleSort('date')}
            className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100"
          >
            Date (Newest)
          </button>
        </div>
      )}
    </div>
  </div>
</div>


        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading amazing trips for you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchPackages}
              className="mt-4 text-primary hover:text-primary-700 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : filteredPackages.length === 0 && hasUserInteracted ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No packages found. Try adjusting your filters.</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-primary hover:text-primary-700 font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div ref={packagesRef} id="packages-grid" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-[200px]">
              {currentPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                  <div className="relative h-48">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        pkg.status === 'open'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between h-[calc(100%-12rem)]">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{pkg.title}</h3>
                          
                          <div className="mt-1">
                            {pkg.agency && (
                              <>
                                <p className="text-sm text-gray-600">By {pkg.agency.name}</p>
                                <div className="flex items-center mt-1">
                                  {renderStars(pkg.agency.rating)}
                                  <span className="ml-1 text-sm text-gray-600">
                                    ({pkg.agency.rating.toFixed(1)})
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-lg font-bold text-[#1c5d5e] ml-4 flex-shrink-0">₹{pkg.price.toLocaleString()}</span>
                      </div>

                      {pkg.tags && pkg.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {pkg.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-5 w-5 mr-2" />
                          <p>Available Dates:</p>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-[4.5rem] overflow-hidden">
                          {pkg.start_date_2 && Object.keys(pkg.start_date_2).length > 0 ? (
                            Object.keys(pkg.start_date_2).map((date, index) => {
                              const isPastDate = new Date(date) < new Date(new Date().setHours(0, 0, 0));
                              return (
                                <span
                                  key={index}
                                  className={`${
                                    isPastDate
                                      ? 'bg-gray-100 border-gray-200 text-gray-400'
                                      : 'bg-[#fffbea] border border-yellow-300 text-[#92400e]'
                                  } border text-sm py-1 px-2 rounded`}
                                >
                                  {new Date(date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: '2-digit',
                                  })}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-yellow-600 text-sm">
                              Exciting departures being planned - Check back soon!
                            </span>
                          )}
                        </div>

                        <div className="flex gap-6">
                          <div className="flex items-center text-gray-700">
                            <Users className="h-5 w-5 mr-2" />
                            <span>{pkg.group_size} spots</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Clock className="h-5 w-5 mr-2" />
                            <span>{pkg.duration} days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="w-full bg-[#1c5d5e] text-white py-2 px-4 rounded-md hover:bg-yellow-500 flex items-center justify-center transition-colors duration-200"
                        disabled={pkg.status === 'closed'}
                      >
                        {pkg.status === 'closed' ? 'Booking Closed' : 'View Info'}
                        {pkg.status === 'open' && <ArrowRight className="ml-2 h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 mb-2 flex justify-center items-center space-x-4">
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Partner Carousel Section */}
      <div className="bg-background-light py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PartnerCarousel />
        </div>
      </div>

      {/* Customer Rating Section */}
      <div className="bg-gray-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CustomerRating />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<Profile | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setUser(data);
  };

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-background-light">
            <Header user={user} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<MainContent selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage} />} />
                <Route path="/package/:id" element={<PackageDetail />} />
                <Route path="/top-places" element={<TopPlaces />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/legal/terms" element={<Terms />} />
                <Route path="/legal/privacy" element={<Privacy />} />
                <Route path="/legal/refund" element={<Refund />} />
                <Route path="/form" element={<TallyForm />} />
                <Route path="/legal/disclaimer" element={<Disclaimer />} />
                <Route path="/admin">
                  <Route index element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="login" element={<AdminLogin />} />
                  <Route path="dashboard" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Route>
                <Route path="/404" element={<NotFound />} />
                <Route path="/500" element={<ServerError />} />
                <Route path="/401" element={<Unauthorized />} />
                <Route path="/403" element={<Forbidden />} />
                <Route path="/400" element={<BadRequest />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <footer className="bg-gray-800 text-white py-12 border-t border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg text-yellow-400 font-semibold mb-4 font-comfortaa">About tripuva</h3>
                    <p className="text-gray-300 text-base">
                      Connecting travelers across India for unforgettable group adventures and cultural experiences.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 font-comfortaa text-white">Quick Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-base">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-base">
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link to="/faq" className="text-gray-300 hover:text-white transition-colors text-base">
                          FAQ
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 font-comfortaa text-white">Legal</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link to="/legal/terms" className="text-gray-300 hover:text-white transition-colors text-base">
                          Terms & Conditions
                        </Link>
                      </li>
                      <li>
                        <Link to="/legal/privacy" className="text-gray-300 hover:text-white transition-colors text-base">
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link to="/legal/refund" className="text-gray-300 hover:text-white transition-colors text-base">
                          Refund Policy
                        </Link>
                      </li>
                      <li>
                        <Link to="/legal/disclaimer" className="text-gray-300 hover:text-white transition-colors text-base">
                          Disclaimer
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 font-comfortaa text-white">Contact Information</h3>
                    <address className="text-gray-300 not-italic space-y-2 text-base">
                      <p className="flex items-center">
                        <span className="block">Email: tripuva@gmail.com</span>
                      </p>
                      <p className="flex items-center">
                        <span className="block">Phone: +91 9395929602</span>
                      </p>
                      <p className="flex items-center">
                        <span className="block">Address: Guwahati, Assam, India</span>
                      </p>
                    </address>
                    
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <p className="text-gray-300 text-center font-comfortaa text-base">
                    &copy; {new Date().getFullYear()} tripuva. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
            {selectedPackage && (
              <PackageModal
                package={selectedPackage}
                onClose={() => setSelectedPackage(null)}
              />
            )}
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;