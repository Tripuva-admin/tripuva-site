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
        const primaryImage = pkg.package_images?.find((img: { is_primary: boolean }) => img.is_primary)?.image_url;
        return {
          ...pkg,
          image: primaryImage || pkg.image,
          package_images: pkg.package_images || []
        };
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
      <div className="relative min-h-[600px] flex items-center">
        {/* ... rest of the JSX ... */}
        {packages.map(pkg => (
          <img
            key={pkg.id}
            src={pkg.image}
            alt={pkg.title}
            onLoad={handleImageLoad}
            className="hidden" // Hide the preloading images
          />
        ))}
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedPackage(pkg)}
          >
            <img
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-48 object-cover"
              onLoad={handleImageLoad}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-indigo-600">₹{pkg.price}</span>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 