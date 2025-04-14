import { useState, useEffect, useRef } from 'react';
import { MapPin, Users, Calendar, ArrowRight, Star, Clock, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package } from '../types/database.types';
import { LoadingScreen } from './LoadingScreen';

interface MainContentProps {
  selectedPackage: Package | null;
  setSelectedPackage: (pkg: Package | null) => void;
  availableTags: string[];
  config: any;
}

// Utility function to clean up tags
const cleanTag = (tag: string): string => {
  // Remove special characters, extra spaces, and convert to lowercase
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

export function MainContent({ 
  selectedPackage, 
  setSelectedPackage,
  availableTags,
  config 
}: MainContentProps) {
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
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalImages = useRef(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 12;
  const totalPages = Math.ceil(packages.length / packagesPerPage);

  // Calculate current packages to display
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = packages.slice(indexOfFirstPackage, indexOfLastPackage);

  // Sorting state
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const fetchData = async () => {
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
          listings!inner(
            id,
            start_date
          ),
          tags
        `)
        .eq('status', 'open')
        .order('ranking', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        setPackages([]);
        return;
      }

      console.log('Raw data from database:', JSON.stringify(data, null, 2));

      const transformedData = data.map(pkg => {
        const primaryImage = pkg.package_images?.find((img: { is_primary: boolean }) => img.is_primary)?.image_url;
        const transformedPkg = {
          ...pkg,
          image: primaryImage || pkg.image,
          package_images: pkg.package_images || [],
          listings: pkg.listings || [],
          tags: pkg.tags || []
        };
        console.log('Transformed package:', JSON.stringify(transformedPkg, null, 2));
        return transformedPkg;
      });

      // Count total images to load
      totalImages.current = transformedData.reduce((acc, pkg) => {
        return acc + (pkg.package_images?.length || 1); // Count each package's images + 1 for the main image
      }, 0);

      // Add a small delay before setting the data
      await new Promise(resolve => setTimeout(resolve, 500));
      setPackages(transformedData);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Failed to load packages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to the package grid section using ID
    const packageGrid = document.getElementById('package-grid');
    if (packageGrid) {
      const offset = packageGrid.offsetTop - 100; // Adjust for any fixed headers
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  const handleTagToggle = (tag: string) => {
    const cleanedTag = cleanTag(tag);
    setFilters(prev => {
      const newTags = prev.tags.includes(cleanedTag)
        ? prev.tags.filter(t => t !== cleanedTag)
        : [...prev.tags, cleanedTag];
      return { ...prev, tags: newTags };
    });
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

        // Updated tag filtering logic
        const matchesTags = filters.tags.length === 0 || 
          filters.tags.every(tag => pkg.tags?.includes(tag));

        return matchesDestination && matchesPrice && matchesDate && matchesTags;
      })
    : packages;

  // Show loading screen until all images are loaded
  if (loading || imagesLoaded < totalImages.current) {
    return <LoadingScreen message="Loading amazing trips for you..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              setImagesLoaded(0);
              fetchData();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[500px] sm:min-h-[600px] flex items-center">
        {/* ... hero section content ... */}
      </div>

      {/* Tags Filter */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md p-4 border border-gray-100 max-w-7xl mx-auto mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Filter by Experience</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {availableTags.map(tag => (
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

      {/* Package Grid */}
      <div id="package-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
        {currentPackages.map(pkg => (
          <div
            key={pkg.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedPackage(pkg)}
          >
            <div className="relative h-48">
              <img
                src={pkg.image_url instanceof Array ? pkg.image_url[0] : pkg.image_url}
                alt={pkg.title}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
              />
              {pkg.tags && pkg.tags.length > 0 && (
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                  {pkg.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{pkg.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#1c5d5e]">₹{pkg.price.toLocaleString()}</span>
                <button className="px-4 py-2 bg-[#1c5d5e] text-white text-sm rounded hover:bg-[#133f40] transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}