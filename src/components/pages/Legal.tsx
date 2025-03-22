import React from 'react';
import { useParams } from 'react-router-dom';

export function Legal() {
  const { page } = useParams();
  
  const content = {
    terms: {
      title: "Terms & Conditions",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By accessing and using Tripuva's services, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, you may not use our services."
        },
        {
          title: "2. Booking and Payment",
          content: "All bookings are subject to availability. A deposit is required to confirm your booking. Full payment must be made 30 days prior to the trip start date. Prices are subject to change without notice."
        },
        {
          title: "3. Cancellation Policy",
          content: "Cancellations made 30 days or more before the trip start date receive a full refund. Cancellations 15-29 days before receive 50% refund. Cancellations less than 15 days before are non-refundable."
        },
        {
          title: "4. Travel Insurance",
          content: "While not mandatory, we strongly recommend purchasing comprehensive travel insurance. Tripuva is not responsible for any losses, damages, or injuries during the trip."
        },
        {
          title: "5. Liability",
          content: "Tripuva acts as a travel coordinator and is not liable for the actions of third-party service providers. We make every effort to ensure the accuracy of information but cannot guarantee it."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      sections: [
        {
          title: "1. Information Collection",
          content: "We collect personal information necessary for booking and communication purposes, including name, email, phone number, and payment details. This information is stored securely."
        },
        {
          title: "2. Use of Information",
          content: "Your information is used to process bookings, communicate about trips, and improve our services. We do not sell or share your personal information with third parties except as required for booking purposes."
        },
        {
          title: "3. Data Security",
          content: "We implement appropriate security measures to protect your personal information. However, no internet transmission is completely secure, and we cannot guarantee absolute security."
        },
        {
          title: "4. Cookies",
          content: "We use cookies to improve your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences."
        },
        {
          title: "5. Your Rights",
          content: "You have the right to access, correct, or delete your personal information. Contact us to exercise these rights or ask questions about our privacy practices."
        }
      ]
    },
    refund: {
      title: "Refund Policy",
      sections: [
        {
          title: "1. Cancellation Refunds",
          content: "Full refund for cancellations 30+ days before trip start. 50% refund for cancellations 15-29 days before. No refund for cancellations less than 15 days before."
        },
        {
          title: "2. Trip Modifications",
          content: "If we modify a trip significantly, you may choose between an alternative trip or a full refund. Minor changes do not qualify for refunds."
        },
        {
          title: "3. Processing Time",
          content: "Refunds are processed within 7-10 business days. The time to receive funds depends on your payment method and financial institution."
        },
        {
          title: "4. Partial Services",
          content: "No refunds for unused services during a trip, including accommodations, activities, or meals that you choose not to utilize."
        },
        {
          title: "5. Force Majeure",
          content: "In cases of force majeure (natural disasters, political unrest, etc.), we may offer credit for future trips instead of refunds."
        }
      ]
    },
    disclaimer: {
      title: "Disclaimer",
      sections: [
        {
          title: "1. General Disclaimer",
          content: "The information provided on our website and during trips is for general guidance only. Tripuva makes no warranties about the accuracy or completeness of this information."
        },
        {
          title: "2. Third-Party Services",
          content: "We partner with reliable third-party service providers but are not responsible for their actions or services. Any issues should be addressed directly with the provider."
        },
        {
          title: "3. Travel Risks",
          content: "Travel involves inherent risks. Participants acknowledge these risks and agree to follow safety guidelines and instructions from tour leaders."
        },
        {
          title: "4. Medical Conditions",
          content: "Participants are responsible for disclosing relevant medical conditions and ensuring they are fit for travel. Consult your doctor before booking active trips."
        },
        {
          title: "5. Content Usage",
          content: "Photos and content on our website are for informational purposes. Actual experiences may vary. All content is protected by copyright laws."
        }
      ]
    }
  };

  const pageContent = content[page as keyof typeof content];

  if (!pageContent) {
    return <div>Page not found</div>;
  }

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{pageContent.title}</h1>
        
        <div className="space-y-8">
          {pageContent.sections.map((section, index) => (
            <div key={index} className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}