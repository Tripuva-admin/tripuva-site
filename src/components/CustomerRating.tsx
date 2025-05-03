import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Make sure your Supabase client is correctly configured
import { Alert } from './Alert';

// ✅ Define the Review type
type Review = {
  review_id: string;
  review_customer_name: string;
  review_package_name: string;
  rating_package_by_agency: string;
  review_rating: number;
  review_comment: string;
};

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      console.log('Fetching reviews from Supabase...');

      const { data, error } = await supabase
        .from('review')
        .select('*')
        .order('review_package_name', { ascending: false });

      if (error) {
        console.error('❌ Error fetching reviews:', error);
        setErrorMsg('Failed to fetch reviews. Please try again later.');
      } else {
        console.log('✅ Reviews fetched:', data);
        setReviews(data as Review[]);
      }

      setLoading(false);
    };

    fetchReviews();
  }, []);

  // ⭐ Render star icons for ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex text-yellow-400 text-2xl">
        {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
        {halfStar && <span key="half">☆</span>}
        {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`}>☆</span>)}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1c5d5e] border-t-transparent"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-4">
        <Alert
          variant="error"
          message={errorMsg}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="font-fjallaone text-2xl font-semibold text-gray-800 tracking-widest text-center mb-8 bg-gradient-to-r">
        CUSTOMER REVIEWS
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.review_id}
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="mb-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {review.review_package_name}
              </h3>
              <div className="text-sm text-gray-500">
              {review.rating_package_by_agency}
              </div>
            </div>
            
            <div className="mb-1">
              {renderStars(review.review_rating)}
            </div>
            
            <p className="text-gray-600 mb-1">{review.review_comment}</p>
            
            <div className="text-sm text-gray-500">
              - {review.review_customer_name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
