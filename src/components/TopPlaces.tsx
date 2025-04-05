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
                <Star className="h-4 w-4 mr-2 text-gold fill-current drop-shadow-md transition-transform hover:scale-110" />
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
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-comfortaa">🌟 Top Places to visit these Summer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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