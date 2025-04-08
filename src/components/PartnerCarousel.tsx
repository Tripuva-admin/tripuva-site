import React from 'react';
import { supabase } from '../lib/supabase';

var PARTNERS_LOGO: string[] = [];

const agencies_response = await supabase
  .from('agencies')
  .select('*');

if (agencies_response.error) {
  console.error("Error fetching data:", agencies_response.error);
} else if (Array.isArray(agencies_response.data)) {
   PARTNERS_LOGO = agencies_response.data.map((item: any) => item.agency_logo);
} else {
  console.warn("Unexpected response format:", agencies_response);
}

console.log("PARTNERS_LOGO: ",PARTNERS_LOGO);

const PartnerCarousel: React.FC = () => {
  return (
    <div className="w-full bg-transparent py-1 overflow-hidden">
    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Travel Partners</h3>
  
    <div className="relative w-full">
      <div className="flex w-max animate-scroll gap-8 px-4">
        {[...PARTNERS_LOGO, ...PARTNERS_LOGO].map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-60 h-32 flex items-center justify-center"
          >
            <img
              src={logo}
              alt={`Partner logo ${index}`}
              className="h-full object-contain hover:grayscale-0 transition duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
  

  );
};

export default PartnerCarousel;
