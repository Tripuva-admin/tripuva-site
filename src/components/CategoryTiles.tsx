import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface CategoryTile {
  title: string;
  subtitle: string;
  image: string;
  location: string;
  type: string;
}

const categories: CategoryTile[] = [
  {
    title: "Experience the magic of snowy escapes",
    subtitle: "MOUNTAIN",
    image: "/images/categories/mountain.jpg",
    location: "Manali",
    type: "mountain"
  },
  {
    title: "Discover the Scotland of the East",
    subtitle: "HIGHLAND",
    image: "/images/categories/highland.jpg",
    location: "Shillong",
    type: "highland"
  },
  {
    title: "Unwind in the serene beauty of pine forests",
    subtitle: "HIDDEN GEM",
    image: "/images/categories/hidden-gem.jpg",
    location: "Jibhi",
    type: "hidden-gem"
  },
  {
    title: "Breathe in the calm of the mini Switzerland of India",
    subtitle: "ADVENTURE",
    image: "/images/categories/adventure.jpg",
    location: "Chopta",
    type: "adventure"
  }
];

export function CategoryTiles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get('type');

  const handleCategoryClick = (categoryType: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedType === categoryType) {
      // If clicking the same category, remove the type filter
      searchParams.delete('type');
    } else {
      // If clicking a different category, set the new type filter
      searchParams.set('type', categoryType);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {categories.map((category, index) => {
        const isSelected = selectedType === category.type;
        return (
          <Link
            key={index}
            to={`/packages?type=${category.type}`}
            onClick={(e) => handleCategoryClick(category.type, e)}
            className={`group relative overflow-hidden rounded-xl aspect-[4/5] shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] transition-all duration-300 ${
              isSelected ? 'ring-4 ring-primary ring-offset-2 shadow-[0_8px_40px_rgb(0,0,0,0.16)]' : ''
            }`}
          >
            {/* Image with overlay */}
            <div className="absolute inset-0">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60 ${
                isSelected ? 'bg-black/40' : ''
              }`} />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
              {/* Top badge */}
              <div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg ${
                  isSelected 
                    ? 'bg-primary text-white' 
                    : 'bg-white/10 backdrop-blur-sm'
                } text-sm font-medium`}>
                  {category.subtitle}
                </span>
              </div>

              {/* Bottom content */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold leading-snug">
                  {category.title}
                </h3>
                <div className="flex items-center text-sm font-medium text-white/90">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {category.location}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
} 