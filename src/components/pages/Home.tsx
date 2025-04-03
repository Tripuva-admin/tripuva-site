import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Travel background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-comfortaa">
            Travel Together, Create Memories
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Join our group trips and explore India's hidden gems with fellow travelers. From the majestic Himalayas to the serene backwaters of Kerala, we've got your next adventure covered.
          </p>
          <div className="mt-10">
            <Link
              to="#packages"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100"
            >
              Explore Packages
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-text-dark mb-6 font-comfortaa">Find Your Perfect Trip</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-text-muted mb-2">
                Destination
              </label>
              <input
                type="text"
                id="destination"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Where do you want to go?"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-text-muted mb-2">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="₹"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-text-muted mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-text-muted hover:bg-gray-50"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 