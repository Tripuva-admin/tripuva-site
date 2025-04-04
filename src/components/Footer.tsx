import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Tripuva</h3>
            <p className="text-gray-300">
              Your trusted partner for unforgettable travel experiences across India.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/legal/terms" className="text-gray-300 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/legal/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/legal/refund" className="text-gray-300 hover:text-white">Refund Policy</Link></li>
              <li><Link to="/legal/disclaimer" className="text-gray-300 hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: info@tripuva.com</li>
              <li className="text-gray-300">Phone: +91 1234567890</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Tripuva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 