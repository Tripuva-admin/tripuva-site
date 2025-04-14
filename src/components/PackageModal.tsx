import React,{ useState, useEffect } from 'react';
import { Package } from '../types/database.types';
import { X, Calendar, Users, Clock, IndianRupee, Star, Building2, Users2, Receipt, CircleDollarSign, ExternalLink, ArrowRight } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface PackageModalProps {
  package: Package & { 
    agency?: { name: string; rating: number };
    package_images?: { id: string; image_url: string; is_primary: boolean }[];
    listings?: { id: string; start_date: string }[];
    package_id?: string;
  };
  onClose: () => void;
  userId?: string;
}

export function PackageModal({ package: pkg, onClose }: PackageModalProps) {
  const primaryImage = pkg.package_images?.find(img => img.is_primary)?.image_url || pkg.image_url;
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const images = pkg.package_images?.map(img => img.image_url) || [pkg.image_url];
  const [transitionDirection, setTransitionDirection] = useState<'left'|'right'>('right');
  const navigate = useNavigate();
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Auto-scrolling effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAutoPlaying && images.length > 1) {
      intervalId = setInterval(() => {
        setTransitionDirection('right');
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoPlaying, images.length]);

  useEffect(() => {
    if (pkg?.start_date_2) {
      const dates = Object.keys(pkg.start_date_2).filter(
        (date) => pkg.start_date_2[date] > 0
      );
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    }
  }, [pkg]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setTransitionDirection('left');
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setTransitionDirection('right');
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

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleBookNow = () => {
    if (!selectedDate || !pkg?.start_date_2) return;
    
    const availableSpots = pkg.start_date_2[selectedDate];
    if (availableSpots <= 0) {
      toast.error('No spots available for selected date');
      return;
    }

    const message = `Hi, I want to book the Trip: ${pkg.title}%0A%0ATrip Date: ${selectedDate}%0A%0A(Experience Code: ${pkg.package_id || ''})`;
    const BOOKING_LINK = `${import.meta.env.VITE_WHATSAPP_LINK}/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${message}`;
    
    console.log('Booking Link:', BOOKING_LINK);
    console.log('Selected Date:', selectedDate);
    console.log('Package:', pkg);
    
    window.open(BOOKING_LINK, '_blank');
  };

  const handleViewItinerary = () => {
    navigate(`/package/${pkg.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl flex flex-col md:flex-row relative shadow-xl overflow-hidden max-h-[calc(100vh-32px)]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white z-10 shadow-md"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-full md:w-1/2 h-[250px] md:h-auto flex-shrink-0 relative overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-y-auto md:overflow-y-hidden">
              <div className="h-full md:h-auto">
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
                    style={{ zIndex: index === currentIndex ? 1 : 0 }}
                  >
                    <img
                      src={image || '/placeholder-image.jpg'}
                      alt={`${pkg.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                ))}
              </div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-10"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors z-10"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
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

            <div className="w-full md:w-1/2 flex flex-col max-h-[calc(100vh-250px-32px)] md:max-h-[calc(100vh-32px)]">
              <div className="flex-1 overflow-y-auto px-4 py-4 md:p-8">
                <div className="flex flex-col mb-3 md:mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">{pkg.title}</h2>
                  
                  {pkg.agency && (
                    <div className="mt-2 flex items-start space-x-2">
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
                </div>

                <div className="space-y-3 mb-4 md:mb-6">
                  <div className="flex items-center text-gray-700">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-2 text-[#1c5d5e]" />
                      <span className="font-medium text-sm md:text-base">Available Dates:</span>
                    </div>
                    {pkg.start_date_2 && Object.keys(pkg.start_date_2).some(date => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0))) && (
                      <span className="ml-3 text-sm text-[#1c5d5e] italic">Choose your departure</span>
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
                                <span className="text-[#1c5d5e] text-sm">Missed these dates? Stay tuned for upcoming departures!</span>
                              </div>
                            )}
                            {Object.entries(pkg.start_date_2).map(([date, slots]: [string, number]) => {
                              const isPast = new Date(date) < new Date(new Date().setHours(0, 0, 0, 0));
                              const isSoldOut = slots === 0;
                              const dateObj = new Date(date);
                              
                              return (
                                <div key={date} className="flex flex-col items-center">
                                  <button
                                    onClick={() => !isPast && !isSoldOut && handleDateSelect(date)}
                                    disabled={isPast || isSoldOut}
                                    aria-disabled={isPast || isSoldOut}
                                    className={`text-sm py-1 px-2.5 rounded-md transition-colors whitespace-nowrap ${
                                      isPast || isSoldOut
                                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                        : selectedDate === date
                                          ? 'bg-[#004e4f] text-white border border-[#004e4f]'
                                          : 'bg-[#fffbea] border border-yellow-300 text-[#92400e] hover:bg-[#1c5d5e] hover:text-white'
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
                          </>
                        );
                      })()
                    ) : (
                      <span className="text-[#1c5d5e] text-sm">
                        Exciting departures being planned - Check back soon!
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 mr-2 text-[#1c5d5e]" />
                    <span className="font-medium text-sm md:text-base">Duration:</span>
                    <span className="ml-1 text-gray-600 text-sm md:text-base">{pkg.duration} days</span>
                  </div>
                
                  <div className="flex items-center text-gray-700">
                    <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 text-[#1c5d5e]" />
                    <span className="font-medium text-sm md:text-base">Group Size:</span>
                    <span className="ml-1 text-gray-600 text-sm md:text-base">{pkg.group_size} people</span>
                  </div>
                </div>

                {/* Price Information Section */}
                <div className="bg-[#1c5d5e]/5 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
                    <div className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">Booking Advance: </span>
                      <span className="text-[#1c5d5e] font-semibold">₹ {pkg.advance?.toLocaleString()}</span>
                    </div>
                    <div className="text-gray-700 text-sm md:text-base">
                      <span className="font-medium">Price per person: </span>
                      <span className="text-[#1c5d5e] font-semibold">₹ {pkg.price?.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-[#1c5d5e] text-center">Pay only booking advance to confirm your spot</p>
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-800 leading-relaxed">{pkg.description}</p>
                </div>

                {/* Itinerary Section */}
                {pkg.itenary && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Your Journey</span>
                      <Link 
                        to={`/package/${pkg.id}`}
                        onClick={onClose}
                        className="bg-[#1c5d5e] p-2 rounded-lg flex items-center text-white text-sm"
                      >
                        View full itinerary <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {pkg.itenary.split('\n').map((item: string, index: number) => {
                        const [day, ...details] = item.split(':');
                        const description = details.join(':').trim();
                        return (
                          <div key={index} className="flex items-center space-x-3 bg-[#1c5d5e]/5 rounded-lg p-3">
                            <div className="flex-shrink-0 w-11 h-11 bg-[#1c5d5e] rounded-full flex items-center justify-center text-white font-normal text-xs">
                              {`Day ${index + 1}`}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <span className="text-sm font-medium text-[#1c5d5e] block">{day}</span>
                              {description && (
                                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Fixed Booking Section */}
              <div className="border-t bg-white">
                <div className="p-4">
                  <button
                    onClick={handleBookNow}
                    disabled={!selectedDate || Object.keys(pkg.start_date_2).every(date => new Date(date) < new Date(new Date().setHours(0, 0, 0, 0)))}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      !selectedDate || Object.keys(pkg.start_date_2).every(date => new Date(date) < new Date(new Date().setHours(0, 0, 0, 0)))
                        ? 'bg-gray-100 text-gray-900 cursor-not-allowed'
                        : 'bg-[#1c5d5e] hover:bg-[#164445] text-white shadow-sm'
                    }`}
                  >
                    {availableDates.length === 0
                      ? 'Exciting departures being planned - Check back soon!'
                      : Object.keys(pkg.start_date_2).every(date => new Date(date) < new Date(new Date().setHours(0, 0, 0, 0)))
                        ? 'All dates have passed - Check back for new dates!'
                        : !selectedDate
                          ? 'Select a date to book'
                          : 'Book Now'
                    }
                  </button>

                  {selectedDate && !Object.keys(pkg.start_date_2).every(date => new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) && (
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
    </div>
  );
}