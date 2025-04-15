import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking, Profile } from '../types/database.types';
import { User, Calendar, Users, IndianRupee, Clock, Edit, Mail } from 'lucide-react';

interface ExtendedBooking extends Booking {
  package: {
    title: string;
    image: string;
    duration: number;
    price: number;
  };
}

export function UserAccount() {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<ExtendedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
        setFormData({
          name: profileData.name,
          email: profileData.email
        });

        // Fetch bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            package:packages(title, image, duration, price)
          `)
          .eq('user_id', user.id)
          .order('booking_date', { ascending: false });

        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email
        })
        .eq('id', profile?.id);

      if (error) throw error;

      setProfile({
        ...profile!,
        name: formData.name,
        email: formData.email
      });
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              My Bookings
            </button>
          </nav>
        </div>

        {/* Profile Section */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              )}
            </div>
            <div className="p-6">
              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProfile(false);
                        setFormData({
                          name: profile?.name || '',
                          email: profile?.email || ''
                        });
                      }}
                      className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Name</div>
                      <div className="mt-1 text-sm text-gray-900">{profile?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Email</div>
                      <div className="mt-1 text-sm text-gray-900">{profile?.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">You haven't made any bookings yet.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-48">
                      <img
                        src={booking.package.image}
                        alt={booking.package.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.package.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-5 w-5 mr-2" />
                          <span>{booking.package.duration} days</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-5 w-5 mr-2" />
                          <span>{booking.number_of_people} people</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <IndianRupee className="h-5 w-5 mr-2" />
                          <span>₹{booking.total_price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}