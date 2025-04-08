import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { PackageModal } from "./PackageModal";
import { Package } from "../types/database.types";
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

const TopPlaces = () => {
  const [topPackages, setTopPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    const fetchTopPackages = async () => {
      const { data, error } = await supabase
        .from("packages")
        .select(`
          id,
          package_id,
          title,
          description,
          duration,
          price,
          group_size,
          image,
          start_date,
          agency_id,
          status,
          booking_link,
          tags,
          ranking,
          advance,
          created_at,
          updated_at,
          agency:agencies(name, rating),
          package_images(image_url, is_primary)
        `)
        .order("ranking", { ascending: true })
        .limit(10);

      if (error) {
        console.error("Error fetching packages:", error);
      } else {
        setTopPackages(data as Package[]);
      }
    };

    fetchTopPackages();
  }, []);

  return (
    <div className="min-h-screen bg-background-light">
      

      <main className="flex-grow pt-0">
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="relative w-full h-72 overflow-hidden shadow-md mb-10">
    <img
      src="https://oahorqgkqbcslflkqhiv.supabase.co/storage/v1/object/public/package-assets/static%20assets/Top-Places-bg3.png"
      alt="Trip Image"
      className="w-full h-full object-cover"
    />
    
    {/* Text on top of image */}
    <div className="absolute inset-0 flex items-center justify-center">
      <h2 className="text-5xl font-bold text-yellow-100 text-center drop-shadow-md">
        Top Places to visit this Summer
      </h2>
    </div>
  </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {topPackages.map((pkg) => {
          const primaryImage = pkg.image;

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{pkg.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">
                    ₹{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {pkg.duration} days • {pkg.group_size} spots
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
      </main>

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