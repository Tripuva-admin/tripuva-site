import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package } from '../types/database.types';
import { Calendar, Users, Clock, Star, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { arunachalItinerary } from '../data/arunachal-itinerary';

// Utility function to clean up tags
const cleanTag = (tag: string): string => {
  // Remove special characters, extra spaces, and convert to lowercase
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState<Package & {
    agency?: { name: string; rating: number };
    package_images?: { id: string; image_url: string; is_primary: boolean }[];
    detailed_itenary?: string;
  }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Clean up tags
        const cleanedData = {
          ...data,
          tags: data.tags ? data.tags.map(cleanTag) : [],
          agency: data.agency?.[0] || undefined,
        };

        // If this is the Arunachal package, use the detailed itinerary
        const itinerary = cleanedData.title?.toLowerCase().includes('arunachal') 
          ? arunachalItinerary 
          : cleanedData.detailed_itenary;

        setPkg({
          ...cleanedData,
          detailed_itenary: itinerary
        });
        if (data.start_date_2) {
          setSelectedStartDate(Object.keys(data.start_date_2)[0]);
        }
      } catch (error) {
        console.error('Error fetching package:', error);
        navigate('/');
      }
    };

    fetchPackage();
  }, [id, navigate]);

  // Add console log for the current package state
  useEffect(() => {
    console.log('Current package state:', pkg);
  }, [pkg]);

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

  if (!pkg) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  const images = pkg.package_images?.map(img => img.image_url) || [pkg.image_url?.[0]];

  const isBookingDisabled = Boolean(
    !selectedStartDate || 
    !pkg.start_date_2 ||
    Object.keys(pkg.start_date_2).length === 0 ||
    Object.keys(pkg.start_date_2).every(date => new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) ||
    (selectedStartDate && pkg.start_date_2[selectedStartDate] === 0)
  );

  const handleBooking = () => {
    if (selectedStartDate) {
      const message = `Hi, I want to book the Trip: ${pkg.title}%0A%0ATrip Date: ${selectedStartDate}%0A%0A(Experience Code: ${pkg.id})`;
      const BOOKING_LINK = `${import.meta.env.VITE_WHATSAPP_LINK}/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${message}`;
      window.open(BOOKING_LINK, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Carousel */}
      <div className="relative h-[60vh] bg-gray-900">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`${pkg.title} ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}

        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent h-32" />
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative pb-16">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{pkg.title}</h1>

              {pkg.agency && (
                <div className="flex items-start space-x-2">
                  <Building2 className="h-5 w-5 text-[#1c5d5e] mt-0.5" />
                  <div>
                    <p className="text-gray-700 font-medium">{pkg.agency.name}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(pkg.agency.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        ({pkg.agency.rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6 py-4 border-y">
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-2 text-[#1c5d5e]" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-1 text-gray-600">{pkg.duration} days</span>
                </div>
              
                <div className="flex items-center text-gray-700">
                  <Users className="h-5 w-5 mr-2 text-[#1c5d5e]" />
                  <span className="font-medium">Group Size:</span>
                  <span className="ml-1 text-gray-600">{pkg.group_size} people</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Overview</h2>
                <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
              </div>

              {/* Itinerary Section */}
              {pkg.detailed_itenary && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Itinerary</h2>
                  <div className="space-y-4">
                    {pkg.detailed_itenary.split('\n').map((item: string, index: number) => {
                      const [day, ...details] = item.split(':');
                      const description = details.join(':').trim();
                      return (
                        <div key={index} className="flex flex-col space-y-1">
                          <span className="text-base font-medium text-[#1c5d5e]">{day}</span>
                          {description && (
                            <p className="text-gray-600 leading-relaxed">{description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-6 sticky top-4">
                <div className="space-y-6">
                  {/* Price Information */}
                  <div className="bg-[#1c5d5e]/5 rounded-lg p-4">
                    <div className="flex flex-col gap-2 mb-2">
                      <div className="text-gray-700">
                        <span className="font-medium">Booking Advance: </span>
                        <span className="text-[#1c5d5e] font-semibold">₹ {pkg.advance?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Price per person: </span>
                        <span className="text-[#1c5d5e] font-semibold">₹ {pkg.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-sm text-[#1c5d5e] text-center">
                      Pay only booking advance to confirm your spot
                    </div>
                  </div>

                  {/* Available Dates */}
                  <div>
                    <div className="flex items-center text-gray-700 mb-3">
                      <Calendar className="h-5 w-5 mr-2 text-[#1c5d5e]" />
                      <span className="font-medium">Available Dates</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {pkg.start_date_2 && Object.entries(pkg.start_date_2).map(([date, slots]: [string, number]) => {
                        const isPast = new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
                        const isSoldOut = slots === 0;
                        const dateObj = new Date(date);
                        
                        return (
                          <div key={date} className="flex flex-col items-center">
                            <button
                              onClick={() => !isPast && !isSoldOut && setSelectedStartDate(date)}
                              disabled={isPast || isSoldOut}
                              aria-disabled={isPast || isSoldOut}
                              className={`text-sm py-1 px-2.5 rounded-md transition-colors whitespace-nowrap ${
                                isPast || isSoldOut
                                  ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                  : selectedStartDate === date
                                  ? 'bg-[#1c5d5e] text-white'
                                  : 'bg-[#FFF9E7] text-gray-800 hover:bg-[#1c5d5e] hover:text-white'
                              }`}
                            >
                              {`${String(dateObj.getDate()).padStart(2, '0')} ${dateObj.toLocaleDateString('en-GB', { month: 'short' })} ${dateObj.getFullYear().toString().slice(-2)}`}
                            </button>
                            {!isPast && (
                              <span className={`text-xs mt-1 ${isSoldOut ? 'text-red-500' : 'text-gray-500'}`}>
                                {isSoldOut ? 'Sold Out' : `${slots} slots left`}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={handleBooking}
                    disabled={isBookingDisabled}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                      isBookingDisabled
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1c5d5e] hover:bg-[#164445] shadow-sm'
                    }`}
                  >
                    Book Now
                  </button>

                  {!isBookingDisabled && (
                    <p className="text-sm text-[#1c5d5e] text-center">
                      Click 'Book Now' to reserve your spot through WhatsApp • Pay ₹ {pkg.advance?.toLocaleString() || '0'} now
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 