import React from 'react';

const logos = [
  'https://static.vecteezy.com/system/resources/previews/009/930/049/non_2x/world-travel-logo-travel-agency-logo-free-vector.jpg',
  'https://static.vecteezy.com/system/resources/previews/009/930/049/non_2x/world-travel-logo-travel-agency-logo-free-vector.jpg',
  'https://static.vecteezy.com/system/resources/previews/009/930/049/non_2x/world-travel-logo-travel-agency-logo-free-vector.jpg',
  'https://static.vecteezy.com/system/resources/previews/009/930/049/non_2x/world-travel-logo-travel-agency-logo-free-vector.jpg',
  'https://static.vecteezy.com/system/resources/previews/009/930/049/non_2x/world-travel-logo-travel-agency-logo-free-vector.jpg',
  'https://static.vecteezy.com/system/resources/previews/009/930/049/non_2x/world-travel-logo-travel-agency-logo-free-vector.jpg',
];

const PartnerCarousel: React.FC = () => {
  return (
    <div className="w-full bg-transparent py-8 overflow-hidden">
    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Travel Partners</h3>
  
    <div className="relative w-full">
      <div className="flex w-max animate-scroll gap-8 px-4">
        {[...logos, ...logos].map((logo, index) => (
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
