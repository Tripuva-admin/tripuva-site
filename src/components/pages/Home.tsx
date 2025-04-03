import { Link } from 'react-router-dom';
import { Search, Calendar, DollarSign, RefreshCw, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Travel background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 font-comfortaa">
            Explore India's Hidden Gems
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Join group trips to discover the most beautiful and unique destinations across India.
          </p>
          <Link
            to="/packages"
            className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-md transition-all duration-200 text-lg font-medium inline-flex items-center"
          >
            Explore Travel Packages
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-text-dark mb-6 font-comfortaa">Find Your Perfect Trip</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                <input
                  type="text"
                  placeholder="Destination"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                <input
                  type="number"
                  placeholder="Max Price"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-5 w-5" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-all duration-200 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 