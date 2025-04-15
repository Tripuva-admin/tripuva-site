import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Users, Clock, Star, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

interface PackageDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  group_size: number;
  image_url: string;
  itenary: string;
  detailed_itenary?: string;
  inclusion?: string;
  exclusion?: string;
  start_date_2: Record<string, number>;
  location: string;
  ranking?: number;
  advance?: number;
  agency?: { name: string; rating: number; };
  package_images?: { id: string; image_url: string; is_primary: boolean; is_landscape: boolean; }[];
}

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [bookingOptions, setBookingOptions] = useState<{ date: string; spots: number }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPackage() {
      setIsLoading(true);
      if (!id) return;
      
      try {
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
              is_primary,
              is_landscape
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setPkg(data);
          
          // Debug logs for itinerary
          console.log('Detailed Itinerary:', data.detailed_itenary);
          
          // Handle images - only use landscape images
          const imageUrls = data.package_images
            ?.filter((img: { is_landscape: boolean }) => img.is_landscape)
            .map((img: { image_url: string }) => img.image_url) || [data.image_url];
          setImages(imageUrls.filter(Boolean));
          
          // Extract available dates
          const dates = Object.entries(data.start_date_2 || {})
            .filter(([_, spots]) => {
              const spotsNum = Number(spots);
              return !isNaN(spotsNum) && spotsNum > 0;
            })
            .map(([date]) => date);
            
          setAvailableDates(dates);
          if (dates.length > 0) {
            setSelectedDate(dates[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching package:', error);
        setError('Failed to load package details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPackage();
  }, [id]);

  const handleBooking = () => {
    if (!selectedDate || !pkg?.start_date_2) return;
    
    const availableSpots = Number(pkg.start_date_2[selectedDate]);
    if (isNaN(availableSpots) || availableSpots <= 0) {
      alert('No spots available for selected date');
      return;
    }

    const message = `Hi, I want to book the Trip: ${pkg.title}%0A%0ATrip Date: ${selectedDate}%0A%0A(Experience Code: ${pkg.id})`;
    const BOOKING_LINK = `${import.meta.env.VITE_WHATSAPP_LINK}/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${message}`;
    
    window.open(BOOKING_LINK, '_blank');
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

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error || !pkg) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{error || 'Package not found'}</div>;
  }

  const primaryImage = pkg.package_images?.find(img => img.is_primary && img.is_landscape)?.image_url || 
                      pkg.package_images?.find(img => img.is_landscape)?.image_url ||
                      pkg.image_url;
  
  console.log('Primary Image:', primaryImage);
  console.log('Package Images for Carousel:', pkg.package_images?.filter(img => img.is_landscape).map(img => img.image_url) || [primaryImage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Gallery Section */}
      <div className="relative h-[65vh] bg-gray-900 overflow-hidden">
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={5000}
          showStatus={false}
          showArrows={true}
          selectedItem={currentImageIndex}
          onChange={setCurrentImageIndex}
          className="h-full"
          renderArrowPrev={(clickHandler, hasPrev) => (
            <button
              onClick={clickHandler}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
          )}
          renderArrowNext={(clickHandler, hasNext) => (
            <button
              onClick={clickHandler}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          )}
          renderIndicator={(clickHandler, isSelected, index) => (
            <button
              className={`w-2 h-2 rounded-full mx-1 transition-all ${
                isSelected ? 'bg-white w-4' : 'bg-white/50'
              }`}
              onClick={clickHandler}
              key={index}
              aria-label={`Go to slide ${index + 1}`}
            />
          )}
        >
          {images.map((image, index) => (
            <div key={index} className="h-[65vh] relative">
              <img
                src={image}
                alt={`${pkg.title} - View ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          ))}
        </Carousel>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-10 pt-20 text-white z-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{pkg.title}</h1>
            {pkg.agency && (
              <div className="flex items-center space-x-4">
                <Building2 className="h-5 w-5" />
                <span className="font-medium">{pkg.agency.name}</span>
                <div className="flex items-center">
                  {renderStars(pkg.agency.rating)}
                  <span className="ml-2">({pkg.agency.rating.toFixed(1)})</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Introduction Card */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Experience Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{pkg.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Clock className="h-5 w-5 text-[#1c5d5e]" />
                  <span className="text-sm md:text-base">{pkg.duration} days</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="h-5 w-5 text-[#1c5d5e]" />
                  <span className="text-sm md:text-base">{pkg.group_size} people</span>
                </div>
              </div>
            </div>

            {/* Itinerary Timeline */}
            {pkg.detailed_itenary && (
              <div className="bg-white rounded-2xl p-5 md:p-8 shadow-xl">
                <h2 className="text-xl md:text-2xl font-semibold mb-8">Day-by-Day Adventure</h2>
                <div className="relative">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-[#1c5d5e]/20" />
                  
                  <div className="space-y-8">
                    {pkg.detailed_itenary.split('\n').reduce((acc: { day: string; activities: string[] }[], line: string) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return acc;
                      
                      if (trimmedLine.startsWith('Day')) {
                        acc.push({
                          day: trimmedLine,
                          activities: []
                        });
                      } else if (trimmedLine.startsWith('-') && acc.length > 0) {
                        acc[acc.length - 1].activities.push(trimmedLine.substring(1).trim());
                      }
                      return acc;
                    }, []).map((dayGroup, index) => (
                      <div key={index} className="relative flex gap-6">
                        {/* Timeline Circle */}
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#1c5d5e] flex items-center justify-center z-10">
                          <span className="text-white font-medium text-sm">{index + 1}</span>
                        </div>
                        
                        {/* Content Card */}
                        <div className="flex-1 bg-[#F8F8F8] rounded-xl p-4 shadow-sm">
                          <h3 className="text-[#1c5d5e] font-medium text-lg mb-3">{dayGroup.day}</h3>
                          <div className="space-y-2">
                            {dayGroup.activities.map((activity: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#1c5d5e] mt-2 flex-shrink-0" />
                                <p className="text-gray-600 leading-relaxed">{activity}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>)}

            {/* Itinerary Inclusion */}
            {pkg.inclusion && (
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">What's Included</h2>

              <div className="space-y-2">
                {pkg.inclusion.split('\n').filter(Boolean).map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    {/* Bullet Point (matches the one in itinerary) */}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1c5d5e] mt-3 flex-shrink-0" />
                    <p className="text-gray-700 leading-relaxed">{item.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Itinerary Exclusion */}
            {pkg.exclusion && (
              <div className="bg-white rounded-2xl p-5 md:p-8 shadow-xl">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">What's not Included</h2>

                <div className="space-y-2">
                  {pkg.exclusion.split('\n').filter(Boolean).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      {/* Bullet Point (matches the one in itinerary) */}
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1c5d5e] mt-3 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{item.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1 relative">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Price Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Booking Advance</span>
                      <span className="text-xl font-semibold">₹ {pkg.advance?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Price per person</span>
                      <span>₹ {pkg.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Available Dates</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {pkg.start_date_2 && Object.entries(pkg.start_date_2).map(([date, slots]: [string, number]) => {
                      const isPast = new Date(date) < new Date(new Date().setHours(0, 0, 0));
                      const isSoldOut = slots === 0;
                      const dateObj = new Date(date);
                      
                      return (
                        <div key={date} className="flex flex-col items-center">
                          <button
                            onClick={() => !isPast && !isSoldOut && setSelectedDate(date)}
                            disabled={isPast || isSoldOut}
                            aria-disabled={isPast || isSoldOut}
                            className={`w-full text-sm py-2 px-2 rounded transition-colors ${
                              isPast || isSoldOut
                                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                        : selectedDate === date
                                          ? 'bg-gradient-to-r from-[#FFC74C] to-[#FFD639] text-gray-800 border border-yellow-400'
                                          : 'bg-[#fffbea] border border-[#F0DDC3] text-[#92400e] hover:bg-gradient-to-r from-[#FFC74C] to-[#FFD639] hover:text-gray-800'
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

                <button
                  onClick={handleBooking}
                  disabled={!selectedDate}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                    !selectedDate
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-[#1c5d5e] hover:bg-[#164445] shadow-sm'
                  }`}
                >
                  {availableDates.length === 0
                    ? 'Exciting departures being planned - Check back soon!'
                    : !selectedDate
                      ? 'Select a date to book'
                      : 'Book Now'
                  }
                </button>
                {selectedDate && (
                    <p className="text-sm text-[#1c5d5e] mt-2 text-center">
                      Click 'Book Now' to reserve your spot through WhatsApp • <span className="font-bold">PAY ₹ {pkg.advance?.toLocaleString() || 1} NOW</span>
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;