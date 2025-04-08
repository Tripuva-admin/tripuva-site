import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Make sure your Supabase client is correctly configured

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
      <div className="flex text-yellow-500 text-2xl">
        {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
        {halfStar && <span key="half">☆</span>}
        {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`}>☆</span>)}
      </div>
    );
  };

  return (
    <div className="mt-6 mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Traveler Reviews</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : errorMsg ? (
        <p className="text-center text-red-500">{errorMsg}</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review) => (
            <div key={review.review_id} className="bg-white rounded-xl shadow-md p-4">
            
              <h4 className="text-md font-semibold text-gray-800 mb-1">
                {review.review_customer_name}
              </h4>

              <p className="text-[#1c5d5e] font-medium text-md mb-1">
                Trip: {review.review_package_name}
              </p>

              <p className="text-sm text-gray-500 mb-1 italic">
                By: {review.rating_package_by_agency}
              </p>

              <div className="flex items-center mb-1">
                {renderStars(review.review_rating)}
                <span className="ml-2 text-sm text-gray-500">
                  {review.review_rating.toFixed(1)}
                </span>
              </div>

              <p className="text-md text-gray-700">{review.review_comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
