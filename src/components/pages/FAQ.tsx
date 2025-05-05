export function FAQ() {
  const faqs = [
    {
      question: "How do I book a trip?",
      answer: "Booking a trip is easy! Simply browse our available packages, click on the one you're interested in, and click the 'Book Now' button. This will connect you with our team via WhatsApp to complete your booking."
    },
    {
      question: "What's included in the package price?",
      answer: "Our package prices typically include accommodation, transportation during the trip, guided tours, and some meals as specified in the package details. Flights to and from the starting point are usually not included."
    },
    {
      question: "How many people are in a group?",
      answer: "Our group sizes vary by package but typically range from 8 to 20 people. The exact group size is always specified in the package details."
    },
    {
      question: "What's your cancellation policy?",
      answer: "We offer full refunds for cancellations made 30 days or more before the trip start date. Cancellations made 15-29 days before receive a 50% refund. Cancellations made less than 15 days before are non-refundable."
    },
    {
      question: "Is it safe to travel in a group?",
      answer: "Yes! We prioritize safety in all our trips. Our guides are experienced professionals, and we work only with trusted partners. We also maintain all necessary safety protocols and insurance coverage."
    },
    {
      question: "What should I pack for the trip?",
      answer: "We provide a detailed packing list specific to your chosen package after booking. Generally, you'll need comfortable clothing, walking shoes, and any personal items. Some trips may require specific gear, which will be clearly communicated."
    },
    {
      question: "Can I join a trip as a solo traveler?",
      answer: "Absolutely! Many of our travelers join solo. It's a great way to meet new people and share experiences with like-minded travelers."
    },
    {
      question: "Do you accommodate dietary restrictions?",
      answer: "Yes, we can accommodate most dietary restrictions. Please inform us of your requirements when booking so we can make necessary arrangements."
    },
    {
      question: "What's the payment process?",
      answer: "We typically require a 30% deposit to secure your booking, with the remaining balance due 30 days before the trip start date. Payment details will be provided during the booking process."
    },
    {
      question: "Do I need travel insurance?",
      answer: "While not mandatory, we strongly recommend purchasing travel insurance to cover unexpected events. We can suggest reliable insurance providers if needed."
    }
  ];

  return (
    <div className="font-instrumentsans pt-12 pb-12">
      <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8">
        <h1 className="font-bold text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}