export function About() {
  return (
    <div className="pt-12 pb-12">
      <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-700 mb-8">About Us</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-6">
            Welcome to Tripuva, your premier destination for unforgettable group travel experiences across India. Founded in 2024, we've made it our mission to connect like-minded travelers and create memories that last a lifetime.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Born from a passion for travel and community, Tripuva emerged from the belief that the best journeys are those shared with others. Our founders, seasoned travelers themselves, recognized the need for a platform that not only offers exceptional travel experiences but also fosters meaningful connections between fellow adventurers.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At Tripuva, we strive to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>Create immersive travel experiences that showcase India's rich cultural heritage</li>
            <li>Foster meaningful connections between travelers from diverse backgrounds</li>
            <li>Support local communities and promote sustainable tourism practices</li>
            <li>Provide safe, well-organized, and memorable group adventures</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated Experiences</h3>
              <p className="text-gray-600">Each trip is thoughtfully designed to offer the perfect blend of adventure, culture, and comfort.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Guides</h3>
              <p className="text-gray-600">Our local guides are passionate about sharing their knowledge and creating authentic experiences.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-gray-600">We partner only with the best travel agencies and accommodations to ensure your comfort and safety.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Focus</h3>
              <p className="text-gray-600">We believe in creating lasting friendships through shared adventures and experiences.</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Commitment</h2>
          <p className="text-gray-600 mb-6">
            We are committed to providing exceptional travel experiences while maintaining the highest standards of customer service, safety, and sustainability. Every trip is an opportunity to create lasting memories and forge new friendships.
          </p>
        </div>
      </div>
    </div>
  );
}