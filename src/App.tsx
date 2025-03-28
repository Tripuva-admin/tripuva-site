import React, { useState, useEffect } from 'react';
import { MapPin, Users, Building2, Calendar, ArrowRight, Search, Filter, Star, LogOut, Clock, IndianRupee, Menu, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { PackageModal } from './components/PackageModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { About } from './components/pages/About';
import { Contact } from './components/pages/Contact';
import { FAQ } from './components/pages/FAQ';
import { Legal } from './components/pages/Legal';
import { supabase } from './lib/supabase';
import { Package, Profile } from './types/database.types';
import TopPlaces from "./components/TopPlaces";
import './index.css' 

interface HeaderProps {
  user: Profile | null;
}

function Header({ user }: HeaderProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className={`w-full z-10 transition-colors duration-300 ${
      isMobileMenuOpen 
        ? 'bg-primary-600' 
        : isHomePage 
          ? 'absolute top-0 left-0 right-0 bg-transparent' 
          : 'bg-primary-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
           
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold font-comfortaa text-white tracking-wide">Tripuva</h1>
          </Link>

          <nav className="hidden sm:flex items-center space-x-6">
            <Link 
              to="/top-places" 
              className="btn-primary"
            >
              <Star className="h-4 w-4 mr-2" />
              Top Places
            </Link>

            <a 
    href="https://google.com"  // Replace with your actual URL
    target="_blank" 
    rel="noopener noreferrer"
    className="btn-outline"
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
            className="sm:hidden text-white w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Menu className="h-8 w-8" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="sm:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="bg-gradient-to-r from-white to-gray-100 text-black px-4 py-2 rounded-md hover:from-gray-100 hover:to-white transition-all duration-200 text-base font-medium w-full text-center flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star className="h-4 w-4 mr-2" />
                Top Places
              </Link>

              <a
        href="https://google.com"  // Change to your actual link
        target="_blank"
        rel="noopener noreferrer"
        className="bg-transparent border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 transition-all duration-200 text-base font-medium w-full text-center flex items-center justify-center"
      >
        <ArrowRight className="h-4 w-4 mr-2" />
        Contact us on Whatsapp
      </a>

              {user && (
                <button
                  onClick={handleSignOut}
                  className="text-white hover:text-gray-200 flex items-center justify-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

const AVAILABLE_TAGS = [
  'Hill',
  'Beaches', 
  'Wildlife',
  'Desert',
  'Heritage',
  'Urban',
  'Rural',
  'Trekking',
  'Road Trip',
  'Camping'
] as const;

function MainContent({ selectedPackage, setSelectedPackage }: {
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
        sortedPackages.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
        break;
    }
    setPackages(sortedPackages);
    setSortMenuOpen(false);
  };

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
          )
        `)
        .eq('status', 'open')
        .order('ranking', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setPackages([]);
        return;
      }

      const transformedData = data.map(pkg => {
        const primaryImage = pkg.package_images?.find((img: any) => img.is_primary)?.image_url;
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
          pkg.title.toLowerCase().includes(filters.destination.toLowerCase());

        const matchesPrice = !filters.maxPrice || pkg.price <= parseInt(filters.maxPrice);

        const matchesDate = !filters.startDate || 
          new Date(pkg.start_date) >= new Date(filters.startDate);

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
            backgroundImage: 'url("https://organizedadventurer.com/wp-content/uploads/2023/10/Antelope-Canyon-min-scaled.webp")'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative w-full z-10 pt-24 sm:pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white sm:tracking-tight">
              Travel Together, Create Memories
            </h2>
            <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white">
              Join group trips across India's most beautiful cities. Meet new people and explore together.
            </p>

            {/* Search and Filters */}
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-3xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter destination"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 outline-none pr-10"
                        value={filters.destination}
                        onChange={(e) => handleFilterChange({ destination: e.target.value })}
                      />
                      {filters.destination && (
                        <button
                          onClick={clearDestination}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="100000"
                      min="0"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 outline-none"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange({ maxPrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-opacity-50 outline-none"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange({ startDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary hover:text-primary-700"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Destinations</h2>
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
            { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80' },
            { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80' },
            { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80' },
            { name: 'Varanasi', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80' },
            { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80' },
            { name: 'Ladakh', image: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&q=80' }
          ].map((city) => (
            <button
              key={city.name}
              onClick={() => handleFilterChange({ destination: city.name })}
              className={`relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${
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
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
<div className="filter-container">
  <div className="filter-card">
    <h3 className="filter-title">Filter by Experience</h3>
    <div className="filter-tags-grid">
      {AVAILABLE_TAGS.map(tag => (
        <button
          key={tag}
          onClick={() => handleTagToggle(tag)}
          className={`filter-tag ${
            filters.tags.includes(tag)
              ? 'filter-tag-active'
              : 'filter-tag-inactive'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
    {filters.tags.length > 0 && (
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setFilters(prev => ({ ...prev, tags: [] }))}
          className="filter-clear-btn"
        >
          Clear Tags
        </button>
      </div>
    )}
  </div>
</div>

      {/* All Trips */}
      <div className="max-w-7xl mx-auto px-4 py-0 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Trips</h2>
          
          <div className="flex space-x-4">
            {/* Sort by Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortMenuOpen(!sortMenuOpen)}
                className="text-sm text-primary hover:text-primary-700 flex items-center bg-gray-100 px-4 py-2 rounded-md"
              >
                Sort by
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              {sortMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                  <button onClick={() => handleSort('price')} className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100">Price (Low to High)</button>
                  <button onClick={() => handleSort('-price')} className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100">Price (High to Low)</button>
                  <button onClick={() => handleSort('date')} className="block w-full text-left text-sm px-4 py-2 hover:bg-gray-100">Date (Newest)</button>
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {currentPackages.map((pkg) => (
                <div key={pkg.id} className="card">
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
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{pkg.title}</h3>
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
                      <span className="text-lg font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
                    </div>
                    
                    {/* Add tags display */}
                    {pkg.tags && pkg.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
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

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{new Date(pkg.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{pkg.duration} days</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-2" />
                        <span>{pkg.group_size} spots</span>
                      </div>
                      <p className="text-gray-600 mt-2 line-clamp-2">{pkg.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-600 flex items-center justify-center"
                      disabled={pkg.status === 'closed'}
                    >
                      {pkg.status === 'closed' ? 'Booking Closed' : 'View Details'}
                      {pkg.status === 'open' && <ArrowRight className="ml-2 h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 mb-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
    </div>
  );
}

function App() {
  const [user, setUser] = useState<Profile | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(null);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {selectedPackage && (
          <PackageModal
            package={selectedPackage}
            onClose={() => setSelectedPackage(null)}
            userId={user?.id}
          />
        )}

        <Header user={user} />

        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                <MainContent 
                  selectedPackage={selectedPackage}
                  setSelectedPackage={setSelectedPackage}
                />
              } 
            />
            <Route 
              path="/admin" 
              element={
                user?.is_admin ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/admin-login" replace />
                )
              } 
            />
            <Route
              path="/admin-login"
              element={
                user?.is_admin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <AdminLogin />
                )
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/legal/:page" element={<Legal />} />
            <Route path="/top-places" element={<TopPlaces />} />
          </Routes>
        </main>

        <footer className="mt-7 bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About tripuva</h3>
                <p className="text-gray-400">
                  Connecting travelers across Globe for unforgettable group adventures and cultural experiences.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin-login" className="text-gray-400 hover:text-white transition-colors">
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Policies</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/legal/terms" className="text-gray-400 hover:text-white transition-colors">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/privacy" className="text-gray-400 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/refund" className="text-gray-400 hover:text-white transition-colors">
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/legal/disclaimer" className="text-gray-400 hover:text-white transition-colors">
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <address className="text-gray-400 not-italic space-y-2">
                  <p className="flex items-center">
                    <span className="block">Email: tripuva@gmail.com</span>
                  </p>
                  <p className="flex items-center">
                    <span className="block">Phone: +91 93959 29602</span>
                  </p>
                  
                </address>
                
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-center">
                &copy; {new Date().getFullYear()} tripuva. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;