import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Alert } from '../Alert';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you soon.',
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-[#0f424c] via-yellow-300 to-yellow-200 bg-clip-text text-transparent">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-[#1c5d5e] mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  <p className="mt-1 text-gray-600">
                    Zoo Road<br />
                    Guwahati, Assam 781005<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-[#1c5d5e] mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-600">+91 93959 29602</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 text-[#1c5d5e] mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600">tripuva@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-6 w-6 text-[#1c5d5e] mt-1" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                  <p className="mt-1 text-gray-600">
                    All Days Open
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
            {status.type && (
              <Alert
                variant={status.type}
                message={status.message}
                className="mb-6"
              />
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1c5d5e] focus:ring-[#1c5d5e]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1c5d5e] focus:ring-[#1c5d5e]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1c5d5e] focus:ring-[#1c5d5e]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1c5d5e] focus:ring-[#1c5d5e]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1c5d5e] text-white py-2 px-4 rounded-md hover:bg-[#0f424c] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}