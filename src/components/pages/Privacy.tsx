import React from 'react';

export function Privacy() {
  return (
    <div className="min-h-screen bg-background-light pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-[#0f424c] via-yellow-300 to-yellow-200 bg-clip-text text-transparent">Privacy Policy</h1>
        
        <div className="space-y-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information Collection</h2>
            <p className="text-gray-600">We collect personal information necessary for booking and communication purposes, including name, email, phone number, and payment details. This information is stored securely.</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use of Information</h2>
            <p className="text-gray-600">Your information is used to process bookings, communicate about trips, and improve our services. We do not sell or share your personal information with third parties except as required for booking purposes.</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
            <p className="text-gray-600">We implement appropriate security measures to protect your personal information. However, no internet transmission is completely secure, and we cannot guarantee absolute security.</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies</h2>
            <p className="text-gray-600">We use cookies to improve your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences.</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-600">You have the right to access, correct, or delete your personal information. Contact us to exercise these rights or ask questions about our privacy practices.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 