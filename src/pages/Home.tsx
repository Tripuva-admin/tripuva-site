import React from 'react';
import { CategoryTiles } from '../components/CategoryTiles';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto pt-20 pb-16 px-4 sm:pt-24 sm:pb-20 sm:px-6 lg:pt-28 lg:pb-24 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Discover Your Next Adventure
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl">
              Explore handpicked destinations and create unforgettable memories with our curated travel experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore by Category
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find your perfect getaway from our collection of unique experiences
          </p>
        </div>
        <CategoryTiles />
      </section>
    </div>
  );
} 