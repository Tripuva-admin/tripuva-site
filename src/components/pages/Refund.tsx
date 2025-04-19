export function Refund() {
  return (
    <div className="min-h-screen bg-background-light pt-12 pb-10">
      <div className="max-w-4xl mx-auto px-6 sm:px-6 lg:px-8">
        <h1 className="font-montserrat font-bold text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
        
        <div className="space-y-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Cancellation Refunds</h2>
            <p className="text-gray-600">Full refund for cancellations 30+ days before trip start. 50% refund for cancellations 15-29 days before. No refund for cancellations less than 15 days before.</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Trip Modifications</h2>
            <p className="text-gray-600">If we modify a trip significantly, you may choose between an alternative trip or a full refund. Minor changes do not qualify for refunds.</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Processing Time</h2>
            <p className="text-gray-600">Refunds are processed within 7-10 business days. The time to receive funds depends on your payment method and financial institution.</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Partial Services</h2>
            <p className="text-gray-600">No refunds for unused services during a trip, including accommodations, activities, or meals that you choose not to utilize.</p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Force Majeure</h2>
            <p className="text-gray-600">In cases of force majeure (natural disasters, political unrest, etc.), we may offer credit for future trips instead of refunds.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 