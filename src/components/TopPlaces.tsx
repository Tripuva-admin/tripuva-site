import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { PackageModal } from "./PackageModal";
import { Package } from "../types/database.types";
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Users, Clock } from 'lucide-react';

const TopPlaces = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          .order('ranking', { ascending: true })
          .limit(6);

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('No packages found');
        }

        const transformedData = data.map(pkg => ({
          ...pkg,
          image: pkg.package_images?.find((img: any) => img.is_primary)?.image_url || pkg.image
        }));

        setPackages(transformedData);
      } catch (err: any) {
        console.error('Error fetching packages:', err);
        setError(err.message || 'Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

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
    <div className="min-h-screen bg-background-light">
      <div className="relative w-full h-72 overflow-hidden shadow-md">
        <img
          src="https://oahorqgkqbcslflkqhiv.supabase.co/storage/v1/object/public/package-assets/static%20assets/Top-Places-bg4.png"
          alt="Trip Image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-5xl font-bold text-yellow-100 text-center drop-shadow-md">
            Top Places to visit this Summer
          </h2>
        </div>
      </div>
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading amazing trips for you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-primary hover:text-primary-700 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No packages available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.title}</h3>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      {pkg.start_date ? (
                        <>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{pkg.duration} days</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{pkg.group_size} spots</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-yellow-600">No dates available</span>
                        </div>
                      )}
                    </div>
                    <span className="text-lg font-bold text-blue-600">₹{pkg.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPackage && (
        <PackageModal
          package={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
};

export default TopPlaces;