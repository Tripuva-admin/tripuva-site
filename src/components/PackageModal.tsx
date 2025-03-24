import React from 'react';
import { Package } from '../types/database.types';
import { X, Calendar, Users, Clock, IndianRupee, Star, Building2 } from 'lucide-react';

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
      window.open(pkg.booking_link, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 z-10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
          <img
            src={primaryImage}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 overflow-y-auto p-6 md:p-8">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Start Date: {new Date(pkg.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>Duration: {pkg.duration} days</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <span>Group Size: {pkg.group_size} people</span>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-600">{pkg.description}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg md:text-xl font-semibold">Price per person</span>
              <div className="flex items-center text-xl md:text-2xl font-bold text-primary">
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
                className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-600 transition-colors duration-200"
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