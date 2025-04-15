import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { PackageModal } from "./PackageModal";
import { Package } from "../types/database.types";
import { Star, Users, Clock } from 'lucide-react';

type ExtendedPackage = Package & {
  agency?: { name: string; rating: number };
  package_images?: { id: string; image_url: string; is_primary: boolean }[];
  listings?: { id: string; start_date: string }[];
  package_id?: string;
}

const TopPlaces = () => {
  const [packages, setPackages] = useState<ExtendedPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<ExtendedPackage | null>(null);
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

        const transformedData = data.map(pkg => {
          const primaryImage = pkg.package_images?.find((img: any) => img.is_primary)?.image_url;
          const fallbackImage = pkg.image_url || pkg.image;
          const defaultImage = "https://oahorqgkqbcslflkqhiv.supabase.co/storage/v1/object/public/package-assets/static%20assets/placeholder.jpg";

          console.log(`Package: ${pkg.title}`);
          console.log('Primary Image:', primaryImage);
          console.log('Fallback Image:', fallbackImage);
          console.log('Package Images:', pkg.package_images);
          console.log('Image URL:', pkg.image_url);
          console.log('Image:', pkg.image);

          const finalImage = primaryImage || fallbackImage || defaultImage;
          console.log('Final Image Used:', finalImage);

          return {
            ...pkg,
            image: finalImage
          };
        });

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
        className={`h-4 w-4 ${index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-#ffffff">

      <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-b-none">
        <img
          src="https://oahorqgkqbcslflkqhiv.supabase.co/storage/v1/object/public/package-assets/static%20assets/Top-Places-bg4.png"
          alt="Summer Destination"
          className="w-full h-full object-cover transform rotate-180 scale-105 transition-transform duration-700"
        />

        {/* ✅ Black gradient overlay from top to transparent */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <div className="max-w-md sm:max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Explore the Best Places <br className="sm:hidden" /> to Visit This Summer
            </h2>

            <p className="mt-6 italic text-white/90 text-sm sm:text-base leading-relaxed sm:leading-loose drop-shadow-sm">
              Handpicked destinations across India for your next unforgettable journey.
              <br />
              Mountains, beaches, forests — all waiting for you.
            </p>
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full h-20 z-10"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M0,192L60,181.3C120,171,240,149,360,154.7C480,160,600,192,720,197.3C840,203,960,181,1080,154.7C1200,128,1320,96,1380,80L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.log(`Image load error for ${pkg.title}:`, target.src);
                      target.src = "https://oahorqgkqbcslflkqhiv.supabase.co/storage/v1/object/public/package-assets/static%20assets/placeholder.jpg";
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.title}</h3>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      {pkg.start_date_2 && Object.entries(pkg.start_date_2).some(([_, spots]) => Number(spots) > 0) ? (
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
                        <span className="text-yellow-600 text-sm">
                          Exciting departures being planned - Check back soon!
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-[#1c5d5e]">₹{pkg.price.toLocaleString()}</span>
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