import React,{ useState, useEffect } from 'react';
import { Package } from '../types/database.types';
import { X, Calendar, Users, Clock, IndianRupee, Star, Building2 } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PackageModalProps {
  package: Package & { 
    agency?: { name: string; rating: number };
    package_images?: { id: string; image_url: string; is_primary: boolean }[];
    listings?: { id: string; start_date: string }[];
  };
  onClose: () => void;
  userId?: string;
}

export function PackageModal({ package: pkg, onClose }: PackageModalProps) {
  const primaryImage = pkg.package_images?.find(img => img.is_primary)?.image_url || pkg.image;
  const [selectedDate, setSelectedDate] = useState(
    pkg.listings && pkg.listings.length > 0 ? pkg.listings[0].start_date : pkg.start_date
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const images = pkg.package_images?.map(img => img.image_url) || [pkg.image];
  const [transitionDirection, setTransitionDirection] = useState<'left'|'right'>('right');

  useEffect(() => {
    console.log('Full package data:', JSON.stringify(pkg, null, 2));
    console.log('Package start_date:', pkg.start_date);
    console.log('Package listings:', pkg.listings);
    console.log('Selected date:', selectedDate);
    console.log('Type of start_date:', typeof pkg.start_date);
    console.log('Type of listings:', Array.isArray(pkg.listings));
    if (pkg.listings) {
      pkg.listings.forEach((listing, index) => {
        console.log(`Listing ${index}:`, {
          id: listing.id,
          start_date: listing.start_date,
          type: typeof listing.start_date
        });
      });
    }
    if (!isAutoPlaying || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setTransitionDirection('right'); // <-- Added this line
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 2500);
  
    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying, pkg, selectedDate]);

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

  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    pkg.start_date_2 ? Object.keys(pkg.start_date_2)[0] : ''
  );

  const [availableSlots, setAvailableSlots] = useState<number | null>(null);

  useEffect(() => {
    if (selectedStartDate && pkg.start_date_2) {
      setAvailableSlots(pkg.start_date_2[selectedStartDate] || null);
    }
  }, [selectedStartDate, pkg.start_date_2]);

  const isBookingDisabled = Boolean(
    !selectedStartDate || 
    !pkg.start_date_2 ||
    Object.keys(pkg.start_date_2).length === 0 ||
    Object.keys(pkg.start_date_2).every(date => new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) ||
    (selectedStartDate && pkg.start_date_2[selectedStartDate] === 0)
  );

  const allDatesHavePassed = Boolean(
    pkg.start_date_2 && Object.keys(pkg.start_date_2).every(date => new Date(date) < new Date(new Date().setHours(0, 0, 0, 0)))
  );

  const noDatesAvailable = Boolean(
    !pkg.start_date_2 || Object.keys(pkg.start_date_2).length === 0
  );

  const handleBooking = () => {
    if (selectedStartDate) {
      const message = `Hi, I want to book the Trip: ${pkg.title}%0A%0ATrip Date: ${selectedStartDate}%0A%0A(Experience Code: ${pkg.package_id})`;
      const BOOKING_LINK = `${import.meta.env.VITE_WHATSAPP_LINK}/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${message}`;
      
      console.log('Booking Link:', BOOKING_LINK);
      console.log('Selected Date:', selectedStartDate);
      console.log('Package:', pkg);
      
      window.open(BOOKING_LINK, '_blank');
    }
  };

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
  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{pkg.title}</h2>

  {pkg.agency && (
    <div className="mb-3 flex items-start space-x-2">
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

  <div className="space-y-3 mb-6">
    <div className="flex items-center text-gray-700">
      <div className="flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        <span className="font-medium">Available Dates:</span>
      </div>
      {pkg.start_date_2 && Object.keys(pkg.start_date_2).some(date => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0))) && (
        <span className="ml-3 text-sm text-yellow-600 italic">Choose your departure</span>
      )}
    </div>

    <div className="flex flex-wrap gap-2">
      {pkg.start_date_2 && Object.keys(pkg.start_date_2).length > 0 ? (
        (() => {
          const allPast = Object.keys(pkg.start_date_2).every(date => new Date(date) < new Date(new Date().setHours(0, 0, 0, 0)));

          return (
            <>
              {allPast && (
                <div className="w-full">
                  <span className="text-yellow-600 text-sm">Missed these dates? Stay tuned for upcoming departures!</span>
                </div>
              )}
              {Object.entries(pkg.start_date_2).map(([date, slots]: [string, number]) => {
                const isPast = new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
                const isSoldOut = slots === 0;
                const formatted = new Date(date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: '2-digit'
                });

                return (
                  <div key={date} className="flex flex-col items-center">
                    <button
                      onClick={() => !isPast && !isSoldOut && setSelectedStartDate(formatted)}
                      disabled={isPast || isSoldOut}
                      aria-disabled={isPast || isSoldOut}
                      className={`text-sm py-1 px-2 rounded border transition-colors ${
                        isPast || isSoldOut
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50 pointer-events-none'
                          : selectedStartDate === formatted
                          ? 'bg-yellow-300 border-yellow-300'
                          : 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
                      }`}
                    >
                      {formatted}
                    </button>
                    {!isPast && (
                      <span className={`text-xs mt-1 ${isSoldOut ? 'text-red-500' : 'text-gray-500'}`}>
                        {isSoldOut ? 'Sold Out' : `${slots} slots left`}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          );
        })()
      ) : (
        <span className="text-yellow-600 text-sm">
          Exciting departures being planned - Check back soon!
        </span>
      )}
    </div>
  </div>

    <div className="flex flex-wrap items-center sm:flex-row sm:items-start gap-4">
     
 <div className="flex items-center text-gray-800 font-semibold">
              <Clock className="h-5 w-5 mr-2" />
              Duration: <span className="ml-1 text-gray-600 font-normal">{pkg.duration} days</span>
            </div>
    
            <div className="flex items-center text-gray-800 font-semibold mb-3">
              <Users className="h-5 w-5 mr-2" />
              Group Size: <span className="ml-1 text-gray-600 font-normal">{pkg.group_size} people</span>
            </div>
</div>

<div className="space-y-4">
<div className="border rounded-md p-4 bg-white shadow-sm">
  {/* Top Row: Booking Advance & Price */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
    {/* Booking Advance (Left) */}
    <p className="text-gray-800 text-base font-semibold mb-2 sm:mb-0">
      Booking Advance:  <span className="text-green-600">₹{pkg.advance.toLocaleString()}</span>
    </p>
    
    {/* Price Per Person (Right) */}
    <p className="text-gray-800 text-base font-semibold">
      Price per person: <span className="text-gray-700">₹{pkg.price.toLocaleString()}</span>
    </p>
  </div>

  {/* Book Now Button */}
  <div className="w-full">
    <button
      onClick={handleBooking}
      disabled={isBookingDisabled}
      className={`w-full py-2 px-4 rounded-md transition duration-200 ${
        isBookingDisabled
          ? 'bg-gray-100 text-gray-700 cursor-not-allowed pointer-events-none'
          : 'bg-[#1c5d5e] text-white hover:bg-primary-600'
      }`}
    >
      {noDatesAvailable
        ? 'Exciting departures being planned - Check back soon!'
        : allDatesHavePassed
          ? 'Missed these dates? Stay tuned for upcoming departures!'
          : 'Book Now'
      }
    </button>

    {!isBookingDisabled && !allDatesHavePassed && !noDatesAvailable && (
      <p className="text-blue-800 text-sm mt-1">
        Click "Book Now" to connect with us on WhatsApp and reserve your spot for this amazing trip!
      </p>
    )}
  </div>
</div>

    <div className="prose max-w-none mb-6 mt-3">
            <p className="text-gray-600">{pkg.description}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}