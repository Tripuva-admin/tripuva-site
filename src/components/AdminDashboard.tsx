import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Agency } from '../types/database.types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

var AVAILABLE_TAGS: any[]
var parsedConfig : any

const tags_response = await supabase
  .from('tags')
  .select('*');

if (tags_response.error) {
  console.error("Error fetching data:", tags_response.error);
} else if (Array.isArray(tags_response.data)) {
  AVAILABLE_TAGS = tags_response.data.map(item => item.tag_name);
} else {
  console.warn("Unexpected response format:", tags_response);
}

const config_response = await supabase
  .from('config')
  .select('*')

if (config_response.error) {
  console.error("Error fetching data:", config_response.error);
} else {
  var parsedConfig = Object.fromEntries(
    config_response.data.map(item => {
      try {
        // First, try to parse as is
        try {
          return [item.config_key, JSON.parse(item.config_value)];
        } catch (e) {
          // If that fails, try to fix common JSON issues
          const formattedValue = item.config_value
            .replace(/(\w+):/g, '"$1":') // Fix unquoted keys
            .replace(/'([^']*)'/g, '"$1"') // Convert single quotes to double quotes
            .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
            .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":'); // Ensure keys are quoted

          try {
            return [item.config_key, JSON.parse(formattedValue)];
          } catch (e) {
            console.error("Error parsing JSON for:", item.config_key, "Value:", item.config_value);
            return [item.config_key, null];
          }
        }
      } catch (err) {
        console.error("Error processing config item:", item.config_key, err);
        return [item.config_key, null];
      }
    }));
}

const tableHeaders = parsedConfig['admin_package_header_list']

const generateAlphanumericId = (length = 7): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous chars (0,1,I,O)
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

interface PackageData {
  id?: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  group_size: number;
  image: string;
  start_date_2: { [key: string]: number };
  agency_id: string;
  status: 'open' | 'closed';
  package_id?: string;
  booking_link: string;
  tags: string[];
  ranking: number;
  advance: number;
  created_at?: string;
  updated_at?: string;
}

const initialFormData: PackageData = {
  title: '',
  description: '',
  duration: 0,
  price: 0,
  group_size: 0,
  image: '',
  start_date_2: {},
  agency_id: '',
  status: 'open',
  booking_link: '',
  tags: [],
  ranking: 0,
  advance: 0
};

export function AdminDashboard() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showAgencyForm, setShowAgencyForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<PackageData>(initialFormData);
  const [packageImages, setPackageImages] = useState<string[]>(['']);
  const [newAgency, setNewAgency] = useState({ name: '', rating: 5 });
  const [tempDate, setTempDate] = useState('');
  const [tempSlots, setTempSlots] = useState(1);
  const [activeTab, setActiveTab] = useState<'packages' | 'agencies'>('packages');
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('packages')
      .select(`
        *,
        agency:agencies(name),
        package_images(id, image_url, is_primary)
      `)
      .order('ranking', { ascending: false });

    if (error) throw error;
    setPackages(data || []);
  };

  const fetchAgencies = async () => {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('name');

    if (error) throw error;
    setAgencies(data || []);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPackages(),
        fetchAgencies()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('agencies')
        .insert([newAgency]);

      if (error) throw error;

      setNewAgency(parsedConfig['init_create_agency_form_data']);
      setShowAgencyForm(false);
      await fetchAgencies();
    } catch (error) {
      console.error('Error creating agency:', error);
      alert('Failed to create agency. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let packageId = editingPackage?.id;

      // Ensure start_date_2 is properly formatted
      const formattedStartDate2 = Object.entries(formData.start_date_2).reduce((acc, [date, slots]) => {
        if (date && slots > 0) {
          acc[date] = slots;
        }
        return acc;
      }, {} as { [key: string]: number });

      if (editingPackage) {
        const { error } = await supabase
          .from('packages')
          .update({
            ...formData,
            start_date_2: formattedStartDate2
          })
          .eq('id', editingPackage.id);

        if (error) {
          console.error('Error updating package:', error);
          throw new Error(`Failed to update package: ${error.message}`);
        }
      } else {
        const { data, error } = await supabase
          .from('packages')
          .insert([{ 
            ...formData,
            start_date_2: formattedStartDate2,
            package_id: generateAlphanumericId()
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating package:', error);
          throw new Error(`Failed to create package: ${error.message}`);
        }
        packageId = data.id;
      }

      // Handle package images
      if (packageId) {
        // Delete existing images if editing
        if (editingPackage) {
          const { error: deleteError } = await supabase
            .from('package_images')
            .delete()
            .eq('package_id', packageId);

          if (deleteError) {
            console.error('Error deleting existing images:', deleteError);
            throw new Error(`Failed to delete existing images: ${deleteError.message}`);
          }
        }

        // Insert new images
        const imagesToInsert = packageImages
          .filter(url => url.trim() !== '')
          .map((url, index) => ({
            package_id: packageId,
            image_url: url,
            is_primary: index === 0
          }));

        if (imagesToInsert.length > 0) {
          const { error: imageError } = await supabase
            .from('package_images')
            .insert(imagesToInsert);

          if (imageError) {
            console.error('Error inserting new images:', imageError);
            throw new Error(`Failed to insert new images: ${imageError.message}`);
          }
        }
      }

      setShowPackageForm(false);
      setEditingPackage(null);
      setFormData({
        title: '',
        description: '',
        duration: 0,
        price: 0,
        group_size: 0,
        image: '',
        start_date_2: {},
        agency_id: '',
        status: 'open',
        booking_link: '',
        tags: [],
        ranking: 0,
        advance: 0
      });
      setPackageImages(['']);
      await fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      alert(error instanceof Error ? error.message : 'An unknown error occurred while saving the package');
    }
  };


  const handleEdit = (pkg: Package & { package_images?: { image_url: string }[] }) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      duration: pkg.duration,
      price: pkg.price || 0,
      group_size: pkg.group_size || 0,
      image: pkg.image || '',
      start_date_2: pkg.start_date_2 || {},
      agency_id: pkg.agency_id || '',
      status: pkg.status || 'open',
      package_id: pkg.package_id || '',
      booking_link: pkg.booking_link || '',
      tags: pkg.tags || [],
      ranking: pkg.ranking || 1000,
      advance: pkg.advance || 0
    });
    setPackageImages(
      pkg.package_images?.map(img => img.image_url) || [pkg.image || '']
    );
    setShowPackageForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }

    try {
      // First delete all package images
      const { error: imageError } = await supabase
        .from('package_images')
        .delete()
        .eq('package_id', id);

      if (imageError) {
        console.error('Error deleting package images:', imageError);
        throw new Error('Failed to delete package images');
      }

      // Then delete the package
      const { error: packageError } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (packageError) {
        console.error('Error deleting package:', packageError);
        throw new Error('Failed to delete package');
      }

      await fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete package. Please try again.');
    }
  };

  const addImageField = () => {
    setPackageImages([...packageImages, '']);
  };

  const removeImageField = (index: number) => {
    const newImages = packageImages.filter((_, i) => i !== index);
    if (newImages.length === 0) newImages.push('');
    setPackageImages(newImages);
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...packageImages];
    newImages[index] = value;
    setPackageImages(newImages);
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleTagDelete = (tagToDelete: string) => {
    if (tagToDelete) {
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToDelete),
      }));
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        e.currentTarget.value = '';
      }
    }
  };

  const handleDeleteAgency = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agency? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('agencies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting agency:', error);
        throw new Error('Failed to delete agency');
      }

      await fetchAgencies();
    } catch (error) {
      console.error('Error deleting agency:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete agency. Please try again.');
    }
  };

  const handleEditAgency = (agency: Agency) => {
    setEditingAgency(agency);
    setNewAgency({
      name: agency.name,
      rating: agency.rating
    });
    setShowAgencyForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowAgencyForm(true)}
                className="w-full sm:w-auto bg-white text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 border border-gray-300 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Agency
              </button>
              <button
                onClick={() => {
                  setEditingPackage(null);
                  setFormData(initialFormData);
                  setPackageImages(['']);
                  setShowPackageForm(true);
                }}
                className="w-full sm:w-auto bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('packages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'packages'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-all duration-200`}
              >
                Packages ({packages.length})
              </button>
              <button
                onClick={() => setActiveTab('agencies')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'agencies'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-all duration-200`}
              >
                Agencies ({agencies.length})
              </button>
            </nav>
          </div>

          {activeTab === 'packages' ? (
            // Existing Package List
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">Travel Packages</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableHeaders.map((header: { align: any; label: string; }, index: React.Key | null | undefined) => (
                        <th
                          key={index}
                          className={`px-6 py-3 text-${header.align} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {packages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50 transition-all duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img 
                              src={(pkg as any).package_images?.[0]?.image_url || pkg.image} 
                              alt={pkg.title} 
                              className="h-12 w-12 rounded-lg object-cover shadow-sm ring-1 ring-gray-200" 
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{pkg.description}</div>
                              {pkg.tags && pkg.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {pkg.tags.map(tag => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 text-sm text-gray-500">
                          {(pkg as any).agency?.name || 'No Agency'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {pkg.duration} days
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          ₹{pkg.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {pkg.group_size}
                        </td>
                        <td className="px-2 py-4 text-sm text-gray-500">
                          {Object.entries(pkg.start_date_2 || {}).map(([date, slots]) => (
                            <span key={date} className="inline-block mr-2 bg-gray-100 px-2 py-1 rounded-full text-xs ring-1 ring-gray-200">
                              {new Date(date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: '2-digit'
                              })} ({slots} slots)
                            </span>
                          ))}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pkg.status === 'open'
                              ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
                              : 'bg-red-100 text-red-800 ring-1 ring-red-200'
                          }`}>
                            {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(pkg)}
                              className="text-primary hover:text-primary-700 p-1.5 rounded-lg hover:bg-primary-50 transition-all duration-200"
                              title="Edit Package"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(pkg.id)}
                              className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
                              title="Delete Package"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Agencies List
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">Travel Agencies</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agency Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Packages
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agencies.map((agency) => (
                      <tr key={agency.id} className="hover:bg-gray-50 transition-all duration-150">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{agency.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500">{agency.rating.toFixed(1)}</span>
                            <div className="ml-2 flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(agency.rating)
                                      ? 'text-yellow-400'
                                      : i < agency.rating
                                      ? 'text-yellow-200'
                                      : 'text-gray-200'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {packages.filter(pkg => pkg.agency_id === agency.id).length} packages
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditAgency(agency)}
                              className="text-primary hover:text-primary-700 p-1.5 rounded-lg hover:bg-primary-50 transition-all duration-200"
                              title="Edit Agency"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAgency(agency.id)}
                              className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
                              title="Delete Agency"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Package Form Modal */}
        {showPackageForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingPackage ? 'Edit Package' : 'Create New Package'}
                </h3>
                <button
                  onClick={() => {
                    setShowPackageForm(false);
                    setEditingPackage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-all duration-200 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400"
                      placeholder="Enter package title"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Agency</label>
                    <select
                      required
                      value={formData.agency_id}
                      onChange={(e) => setFormData({ ...formData, agency_id: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
                    >
                      <option value="">Select an agency</option>
                      {agencies.map(agency => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name} (Rating: {agency.rating})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 resize-y"
                      placeholder="Enter package description"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Duration (days)</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.duration || ''}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value ? Number(e.target.value) : 0 })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 pl-4 pr-12"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">days</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : 0 })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 pl-8"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Group Size</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.group_size || ''}
                        onChange={(e) => setFormData({ ...formData, group_size: e.target.value ? Number(e.target.value) : 1 })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        placeholder="1"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">people</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Start Dates & Slots</label>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <input
                          type="date"
                          value={tempDate}
                          onChange={(e) => setTempDate(e.target.value)}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Slots"
                          min={1}
                          value={tempSlots}
                          onChange={(e) => setTempSlots(parseInt(e.target.value))}
                          className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (tempDate && tempSlots > 0) {
                            const formatted = new Date(tempDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            });
                            setFormData(prev => ({
                              ...prev,
                              start_date_2: {
                                ...prev.start_date_2,
                                [formatted]: tempSlots,
                              },
                            }));
                            setTempDate('');
                            setTempSlots(1);
                          }
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Object.entries(formData.start_date_2 || {}).map(([date, slots]) => (
                        <div
                          key={date}
                          className="flex items-center bg-primary/5 text-sm rounded-full px-3 py-1.5 border border-primary/10 group hover:bg-primary/10 transition-all duration-200"
                        >
                          <span className="mr-2 text-primary-700">
                            {date} ({slots} slots)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...formData.start_date_2 };
                              delete updated[date];
                              setFormData(prev => ({
                                ...prev,
                                start_date_2: updated
                              }));
                            }}
                            className="text-primary-600 hover:text-primary-800 text-xs transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Status</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'open' | 'closed' })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Ranking (1-10000)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10000"
                      value={formData.ranking || ''}
                      onChange={(e) => setFormData({ ...formData, ranking: e.target.value ? Number(e.target.value) : 0 })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="1000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Advance Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.advance || ''}
                        onChange={(e) => setFormData({ ...formData, advance: e.target.value ? Number(e.target.value) : 0 })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 pl-8"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Tags</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {AVAILABLE_TAGS.map(tag => (
                        <label key={tag} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.tags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                            className="rounded-md border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 h-4 w-4"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-semibold text-gray-700">Package Images</label>
                      <button
                        type="button"
                        onClick={addImageField}
                        className="text-primary hover:text-primary-700 text-sm flex items-center transition-all duration-200 px-2 py-1 rounded-lg hover:bg-primary-50"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Image
                      </button>
                    </div>
                    <div className="space-y-3">
                      {packageImages.map((url, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="url"
                            required
                            value={url}
                            onChange={(e) => updateImageField(index, e.target.value)}
                            placeholder="Enter image URL"
                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                          />
                          {packageImages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageField(index)}
                              className="text-red-600 hover:text-red-800 transition-all duration-200 p-2 rounded-lg hover:bg-red-50"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 italic">
                      Add multiple image URLs. The first image will be used as the primary image.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPackageForm(false);
                      setEditingPackage(null);
                    }}
                    className="px-6 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium flex items-center"
                  >
                    {editingPackage ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Package
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Package
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Agency Form Modal */}
        {showAgencyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Agency</h3>
                <button
                  onClick={() => setShowAgencyForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-all duration-200 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateAgency} className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Agency Name</label>
                    <input
                      type="text"
                      required
                      value={newAgency.name}
                      onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="Enter agency name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Rating (0-5)</label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="0"
                        max="5"
                        step="0.1"
                        value={newAgency.rating}
                        onChange={(e) => setNewAgency({ ...newAgency, rating: Number(e.target.value) })}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 pr-12"
                        placeholder="5.0"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">/ 5.0</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAgencyForm(false)}
                    className="px-6 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Agency
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}