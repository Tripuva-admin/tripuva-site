import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Agency } from '../types/database.types';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { API_URL } from '../config';
import { Alert } from '../components/ui/alert';

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

interface Admin {
  id: string;
  email: string;
  name: string;
}

export function AdminDashboard() {
  const { addNotification, removeNotification, notifications } = useNotification();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showAgencyForm, setShowAgencyForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Package>>({
    title: '',
    description: '',
    duration: 1,
    price: 0,
    group_size: 1,
    image: '',
    start_date: [],
    agency_id: '',
    status: 'open',
    package_id: '',
    booking_link: '',
    tags: [],
    ranking: 1000,
    advance: 0
  });
  const [packageImages, setPackageImages] = useState<string[]>(['']);
  const [newAgency, setNewAgency] = useState({ 
    name: '', 
    rating: 5,
    logo_url: ''
  });

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
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/admin/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAdmin(data);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    addNotification('info', 'Logged out', 'You have been successfully logged out.');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('agencies')
        .insert([newAgency])
        .select()
        .single();

      if (error) throw error;

      setAgencies([...agencies, data]);
      setShowAgencyForm(false);
      addNotification('success', 'Agency created successfully');
    } catch (error: any) {
      console.error('Error creating agency:', error);
      addNotification('error', 'Failed to create agency: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      setPackages([...packages, data]);
      setShowPackageForm(false);
      addNotification('success', 'Package created successfully');
    } catch (error: any) {
      console.error('Error creating package:', error);
      addNotification('error', 'Failed to create package: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('packages')
        .update(formData)
        .eq('id', editingPackage?.id);

      if (error) throw error;

      setPackages(packages.map(pkg => 
        pkg.id === editingPackage?.id ? { ...pkg, ...formData } : pkg
      ));
      setShowPackageForm(false);
      setEditingPackage(null);
      addNotification('success', 'Package updated successfully');
    } catch (error: any) {
      console.error('Error updating package:', error);
      addNotification('error', 'Failed to update package: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPackages(packages.filter(pkg => pkg.id !== id));
      addNotification('success', 'Package deleted successfully');
    } catch (error: any) {
      console.error('Error deleting package:', error);
      addNotification('error', 'Failed to delete package: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: Package & { package_images?: { image_url: string }[] }) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      description: pkg.description,
      duration: pkg.duration,
      price: pkg.price,
      group_size: pkg.group_size,
      image: pkg.image,
      start_date: pkg.start_date,
      agency_id: pkg.agency_id || '',
      status: pkg.status,
      package_id: pkg.package_id,
      booking_link: pkg.booking_link || '',
      tags: pkg.tags || [],
      ranking: pkg.ranking || 1000,
      advance: pkg.advance || 0
    });
    setPackageImages(
      pkg.package_images?.map(img => img.image_url) || [pkg.image]
    );
    setShowPackageForm(true);
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

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      tags: prev.tags ? [...prev.tags, value] : [value]
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const [tempDate, setTempDate] = useState('');

  const handleAddStartDate = () => {
    if (tempDate) {
      setFormData(prev => ({
        ...prev,
        start_date: Array.isArray(prev.start_date) ? [...prev.start_date, tempDate] : [tempDate]
      }));
      setTempDate('');
    }
  };

  const handleRemoveStartDate = (dateToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      start_date: Array.isArray(prev.start_date) ? prev.start_date.filter(date => date !== dateToRemove) : []
    }));
  };

  const [tempTag, setTempTag] = useState('');

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setShowAgencyForm(true)}
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Agency
            </button>
            <button
              onClick={() => {
                setEditingPackage(null);
                setFormData({
                  title: '',
                  description: '',
                  duration: 1,
                  price: 0,
                  group_size: 1,
                  image: '',
                  start_date: [],
                  agency_id: '',
                  status: 'open',
                  package_id: '',
                  booking_link: '',
                  tags: [],
                  ranking: 1000,
                  advance: 0
                });
                setPackageImages(['']);
                setShowPackageForm(true);
              }}
              className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Package
            </button>
          </div>
        </div>

        {/* Package List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
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
                  <tr key={pkg.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={(pkg as any).package_images?.[0]?.image_url || pkg.image} 
                          alt={pkg.title} 
                          className="h-10 w-10 rounded-md object-cover" 
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{pkg.description}</div>
                          {pkg.tags && pkg.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {pkg.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
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
                      {Array.isArray(pkg.start_date)
                        ? pkg.start_date.map((date, index) => (
                            <span key={index} className="inline-block mr-2">
                              {new Date(date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: '2-digit'
                              })}
                            </span>
                          ))
                        : new Date(pkg.start_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: '2-digit'
                          })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pkg.status === 'open'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="text-primary hover:text-primary-700 p-1 rounded-full hover:bg-primary-50"
                          title="Edit Package"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
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

        {/* Package Form Modal */}
        {showPackageForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingPackage ? 'Edit Package' : 'Create New Package'}
                </h3>
                <button
                  onClick={() => {
                    setShowPackageForm(false);
                    setEditingPackage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={editingPackage ? handleUpdatePackage : handleCreatePackage} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-primary focus:outline-none focus:bg-gray-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Agency</label>
                    <select
                      required
                      value={formData.agency_id}
                      onChange={(e) => setFormData({ ...formData, agency_id: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:bg-gray-100 focus:ring-primary"
                    >
                      <option value="">Select an agency</option>
                      {agencies.map(agency => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name} (Rating: {agency.rating})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:bg-gray-100 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:bg-gray-100 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:bg-gray-100 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Group Size</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.group_size}
                      onChange={(e) => setFormData({ ...formData, group_size: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:bg-gray-100 focus:ring-primary"
                    />
                  </div>

                  {/* Start Dates */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Dates</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="date"
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={handleAddStartDate}
                        className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary-600"
                      >
                        Add Date
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(formData.start_date) && formData.start_date.map((date: string, index: number) => (
                        <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded">
                          <span className="text-sm">{date}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveStartDate(date)}
                            className="ml-2 text-red-500 hover:text-red-700 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'open' | 'closed' })}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:bg-gray-100 focus:ring-primary"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ranking (1-10000)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10000"
                      value={formData.ranking}
                      onChange={(e) => setFormData({ ...formData, ranking: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:bg-gray-100 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Advance Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.advance}
                      onChange={(e) => setFormData({ ...formData, advance: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:bg-gray-100 focus:ring-primary"
                    />
                  </div>

                  {/* Tags */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {AVAILABLE_TAGS.map(tag => (
                        <label key={tag} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.tags?.includes(tag)}
                            onChange={() => {
                              setFormData(prev => ({
                                ...prev,
                                tags: prev.tags?.includes(tag)
                                  ? prev.tags.filter(t => t !== tag)
                                  : [...(prev.tags || []), tag]
                              }));
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">{tag}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Package Images</label>
                      <button
                        type="button"
                        onClick={addImageField}
                        className="text-primary hover:text-primary-700 text-sm flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Image
                      </button>
                    </div>
                    {packageImages.map((url, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => updateImageField(index, e.target.value)}
                            placeholder="Image URL"
                            className="w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:outline-none focus:bg-gray-100 focus:ring-primary"
                          />
                        </div>
                        {packageImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <p className="text-sm text-gray-500 mt-1">
                      Add multiple images by entering URLs. The first image will be used as the primary image.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPackageForm(false);
                      setEditingPackage(null);
                    }}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-700"
                  >
                    {editingPackage ? 'Update Package' : 'Create Package'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Agency Form Modal */}
        {showAgencyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add New Agency</h3>
                <button
                  onClick={() => setShowAgencyForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateAgency} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Agency Logo URL</label>
                  <input
                    type="text"
                    value={newAgency.logo_url}
                    onChange={(e) => setNewAgency({ ...newAgency, logo_url: e.target.value })}
                    placeholder="Enter logo URL"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Agency Name</label>
                  <input
                    type="text"
                    required
                    value={newAgency.name}
                    onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="5"
                    step="0.1"
                    value={newAgency.rating}
                    onChange={(e) => setNewAgency({ ...newAgency, rating: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAgencyForm(false)}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-700"
                  >
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