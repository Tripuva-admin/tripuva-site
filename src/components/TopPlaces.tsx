import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { PackageModal } from "./PackageModal";
import { Package } from "../types/database.types";

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl text-center mb-10 mt-3">🌟 Top Places to visit these Summer</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topPackages.map((pkg) => {
          const primaryImage = pkg.image; // Now using the direct image field from Package

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