import React,{ useState, useEffect } from 'react';
import { Package } from '../types/database.types';
import { X, Calendar, Users, Clock, IndianRupee, Star, Building2 } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PackageModalProps {
  package: Package & { 
    agency?: { name: string; rating: number };
    package_images?: { id: string; image_url: string; is_primary: boolean }[];
  };
  onClose: () => void;
  userId?: string;
}

export function PackageModal({ package: pkg, onClose }: PackageModalProps) {
  const primaryImage = pkg.package_images?.find(img => img.is_primary)?.image_url || pkg.image;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const images = pkg.package_images?.map(img => img.image_url) || [pkg.image];
  const [transitionDirection, setTransitionDirection] = useState<'left'|'right'>('right');

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setTransitionDirection('right'); // <-- Added this line
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 2500);
  
    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

const goToPrev = () => {
  setIsAutoPlaying(false);
  setTransitionDirection('left'); // <-- Added this line
  setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  setTimeout(() => setIsAutoPlaying(true), 10000);
};

const goToNext = () => {
  setIsAutoPlaying(false);
  setTransitionDirection('right'); // <-- Added this line
  setCurrentIndex(prev => (prev + 1) % images.length);
  setTimeout(() => setIsAutoPlaying(true), 10000);
};

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

  const handleBooking = () => {
    if (pkg.booking_link) {
      var BOOKING_LINK = `${import.meta.env.VITE_WHATSAPP_LINK}/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${pkg.booking_link}` 
      console.log(BOOKING_LINK)
      window.open(BOOKING_LINK, '_blank');
    }
  };

  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    Array.isArray(pkg.start_date) ? pkg.start_date[0] : pkg.start_date
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 z-10"
        >
          <X className="h-6 w-6" />
        </button>

        

        <div className="w-full md:w-1/2 h-[300px] md:h-auto flex-shrink-0 relative overflow-hidden">
    {images.map((image, index) => (
      <div
      key={index}
      className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
        index === currentIndex 
          ? 'translate-x-0' 
          : index < currentIndex 
            ? '-translate-x-full' 
            : 'translate-x-full'
      }`}
    >
        <img
          src={image}
          alt={`${pkg.title} ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
     {images.length > 1 && (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </>
  )}

{images.length > 1 && (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={(e) => { 
            e.stopPropagation(); 
            setCurrentIndex(index);
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 10000);
          }}
          className={`w-2 h-2 rounded-full transition-all ${
            index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
          }`}
        />
      ))}
    </div>
  )}
  </div>

 

        <div className="w-full md:w-1/2 md:overflow-y-auto p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{pkg.title}</h2>

          {pkg.agency && (
            <div className="mb-6 flex items-start space-x-2">
              <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-gray-700 font-medium">{pkg.agency.name}</p>
                <div className="flex items-center mt-1">
                  {renderStars(pkg.agency.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    ({pkg.agency.rating.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>
          )}

{/* New Multiple Start Date View - Begin*/}          

<div className="flex items-center text-gray-600 mb-3 font-semibold">
                      <Calendar className="h-5 w-5 mr-2 mt-1" /><span>Available Dates: </span>
                      </div>

          <div className="flex sm:grid-cols-2 gap-4 mb-6 items-start">
          
          <div className="flex items-center text-gray-600">
            



        
<div className="flex flex-wrap gap-2">
  {Array.isArray(pkg.start_date)
    ? pkg.start_date.map((date, index) => {
        const formatted = new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        });
        return (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedStartDate(date)}
            className={`text-sm py-1 px-2 rounded border transition-all ${
              selectedStartDate === date
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-yellow-50 text-gray-700 border-yellow-200'
            }`}
          >
            {formatted}
          </button>
        );
      })
    : (
      <span className="text-sm py-1 px-2 rounded border bg-white text-gray-700 border-gray-300">
        {new Date(pkg.start_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        })}
      </span>
    )}
</div>
</div>

</div>



{/* New Multiple Start Date View - End*/}  
        
 <div className="flex items-center text-gray-600 font-semibold">
              <Clock className="h-5 w-5 mr-2" />
              <span>Duration: {pkg.duration} days</span>
            </div>
    
            <div className="flex items-center text-gray-600 mt-3 font-semibold">
              <Users className="h-5 w-5 mr-2" />
              <span>Group Size: {pkg.group_size} people</span>
            </div>
          

          <div className="prose max-w-none mb-6 mt-3">
            <p className="text-gray-600">{pkg.description}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg md:text-xl font-semibold">Price per person</span>
              <div className="flex items-center text-xl md:text-2xl font-bold text-[#1c5d5e]">
                <IndianRupee className="h-5 w-5 md:h-6 md:w-6 mr-1" />
                {pkg.price.toLocaleString()}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-blue-800 text-sm md:text-base font-bold">
                  Booking Advance: ₹{pkg.advance.toLocaleString()}
                </p>
                <p className="text-blue-800 text-sm md:text-base mt-2">
                  Click "Book Now" to connect with us on WhatsApp and reserve your spot for this amazing trip!
                </p>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-[#1c5d5e] text-white py-3 px-4 rounded-md hover:bg-primary-600 transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}