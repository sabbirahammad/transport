import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Truck, Eye, CheckCircle, Upload, User, Phone, Calendar, MapPin,
  CreditCard, Gauge, Fuel, FileText, AlertCircle, Edit2, Trash2, Camera,
  RefreshCw, Info, Star, Activity, Clock, Shield, FileCheck, Car
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VehicleDetails({ vehicleId, onClose }) {
  const [vehicle, setVehicle] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // API base URL
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // Helper function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return getPlaceholderImage();
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
      return imagePath;
    }

    // If it's a relative path from the backend, construct full URL
    if (imagePath.startsWith('/')) {
      return `http://192.168.0.106:8080${imagePath}`;
    }

    // For backend-relative paths - try multiple possible locations
    const possiblePaths = [
      `http://192.168.0.106:8080/uploads/vehicles/${imagePath}`,
      `http://192.168.0.106:8080/uploads/${imagePath}`,
      `http://192.168.0.106:8080/static/${imagePath}`,
      `http://192.168.0.106:8080/${imagePath}`
    ];

    return possiblePaths[0];
  };

  // Helper function to get reliable placeholder image
  const getPlaceholderImage = () => {
    return "data:image/svg+xml;base64," + btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="200" fill="url(#grad1)" rx="12"/>
        <circle cx="150" cy="80" r="25" fill="#cbd5e1"/>
        <rect x="100" y="120" width="100" height="40" rx="8" fill="#cbd5e1"/>
        <circle cx="120" cy="140" r="8" fill="#94a3b8"/>
        <circle cx="180" cy="140" r="8" fill="#94a3b8"/>
        <text x="150" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#64748b">Vehicle Image</text>
      </svg>
    `);
  };

  // Helper function to handle image errors
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.src = getPlaceholderImage();
    e.target.onError = null;
  };

  // Fetch vehicle details from API
  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch vehicle details
      const vehicleResponse = await fetch(`${API_BASE_URL}/vehicle/${vehicleId}`);
      if (!vehicleResponse.ok) {
        throw new Error(`HTTP error! status: ${vehicleResponse.status}`);
      }

      const vehicleData = await vehicleResponse.json();
      console.log('Vehicle details raw response:', vehicleData);

      // Handle different API response structures
      let vehicleInfo = vehicleData;
      if (vehicleData.data) {
        vehicleInfo = vehicleData.data;
      } else if (vehicleData.vehicle) {
        vehicleInfo = vehicleData.vehicle;
      } else if (vehicleData.result) {
        vehicleInfo = vehicleData.result;
      }

      console.log('Processed vehicle info:', vehicleInfo);
      console.log('Vehicle info keys:', Object.keys(vehicleInfo || {}));

      // Fetch driver details if driver_id exists
      let driverData = null;
      if (vehicleInfo.driver_id) {
        try {
          const driverResponse = await fetch(`${API_BASE_URL}/driver/${vehicleInfo.driver_id}`);
          if (driverResponse.ok) {
            const rawDriverData = await driverResponse.json();
            console.log('Raw driver response:', rawDriverData);

            // Handle different driver response structures
            if (rawDriverData.data) {
              driverData = rawDriverData.data;
            } else if (rawDriverData.driver) {
              driverData = rawDriverData.driver;
            } else {
              driverData = rawDriverData;
            }

            // Normalize driver data
            if (driverData) {
              driverData = {
                id: driverData.id,
                driver_name: driverData.driver_name || driverData.name || driverData.driverName || 'N/A',
                driver_contact: driverData.driver_contact || driverData.phone || driverData.contact || 'N/A',
                address: driverData.address || 'N/A',
                ...driverData
              };
            }

            console.log('Normalized driver data:', driverData);
          }
        } catch (err) {
          console.error('Error fetching driver details:', err);
        }
      } else if (vehicleInfo.driver_name || vehicleInfo.driver_contact) {
        // If no driver_id but driver info is in vehicle object
        driverData = {
          id: null,
          driver_name: vehicleInfo.driver_name || 'N/A',
          driver_contact: vehicleInfo.driver_contact || 'N/A',
          address: 'N/A' // Address not available in vehicle object
        };
        console.log('Driver data from vehicle object:', driverData);
      }

      // Ensure all required fields are present with fallbacks
      const normalizedVehicle = {
        id: vehicleInfo.id,
        vehicle_name: vehicleInfo.vehicle_name || vehicleInfo.name || vehicleInfo.vehicleName || 'N/A',
        vehicle_no: vehicleInfo.vehicle_no || vehicleInfo.vehicleNo || vehicleInfo.registration_number || 'N/A',
        category: vehicleInfo.category || 'N/A',
        size: vehicleInfo.size || 'N/A',
        brand: vehicleInfo.brand || 'N/A',
        model: vehicleInfo.model || 'N/A',
        year: vehicleInfo.year || 'N/A',
        mileage: vehicleInfo.mileage || 'N/A',
        fule_capacity: vehicleInfo.fule_capacity || vehicleInfo.fuel_capacity || vehicleInfo.fuelCapacity || 'N/A',
        registration_date: vehicleInfo.registration_date || vehicleInfo.registrationDate || 'N/A',
        insurance_expiry: vehicleInfo.insurance_expiry || vehicleInfo.insuranceExpiry || 'N/A',
        fitness_expiry: vehicleInfo.fitness_expiry || vehicleInfo.fitnessExpiry || 'N/A',
        tax_token_expiry: vehicleInfo.tax_token_expiry || vehicleInfo.taxTokenExpiry || 'N/A',
        permit_expiry: vehicleInfo.permit_expiry || vehicleInfo.permitExpiry || 'N/A',
        status: vehicleInfo.status || 'Unknown',
        driver_id: vehicleInfo.driver_id || vehicleInfo.driverId || null,
        image_url: vehicleInfo.image_url || vehicleInfo.imageUrl || vehicleInfo.vehicle_photo || vehicleInfo.vehiclePhoto || vehicleInfo.image || null,
        created_at: vehicleInfo.created_at || vehicleInfo.createdAt || 'N/A',
        updated_at: vehicleInfo.updated_at || vehicleInfo.updatedAt || 'N/A',
        ...vehicleInfo
      };

      console.log('Normalized vehicle data:', normalizedVehicle);
      setVehicle(normalizedVehicle);
      setDriver(driverData);
    } catch (err) {
      console.error('Error fetching vehicle details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId]);

  // Helper functions
  const getStatusColor = (status) => {
    if (status === 'active' || status === 'Active') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'inactive' || status === 'Inactive') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const getStatusIcon = (status) => {
    if (status === 'active' || status === 'Active') return <Activity className="w-4 h-4" />;
    if (status === 'inactive' || status === 'Inactive') return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getDocumentStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'unknown', color: 'bg-gray-100 text-gray-700', text: 'Not Set' };

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'bg-red-100 text-red-700', text: 'Expired' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', color: 'bg-orange-100 text-orange-700', text: `Expires in ${daysUntilExpiry} days` };
    } else {
      return { status: 'valid', color: 'bg-green-100 text-green-700', text: 'Valid' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading vehicle details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Vehicle</h3>
          <p className="text-gray-600 mb-2">There was a problem loading the vehicle details.</p>
          <p className="text-sm text-red-600 mb-6 font-mono">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchVehicleDetails}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Vehicle List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Vehicle Not Found</h3>
          <p className="text-gray-600 mb-6">Unable to load vehicle details. The vehicle may not exist or there was an error fetching the data.</p>
          <div className="space-y-3">
            <button
              onClick={fetchVehicleDetails}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Vehicle List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 px-8 py-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="flex items-center gap-3 text-white hover:text-blue-200 transition-all transform hover:scale-105"
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium">Back to Vehicle List</span>
          </button>
          <div className="h-8 w-px bg-gradient-to-b from-white/20 to-white/40"></div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Vehicle Details</h1>
              <p className="text-blue-100 text-sm">Comprehensive vehicle information and status</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Vehicle Header Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="relative group">
                  <img
                    src={getImageUrl(vehicle.image_url || vehicle.vehicle_photo || vehicle.image)}
                    alt={vehicle.vehicle_name || 'Vehicle'}
                    className="w-40 h-32 rounded-2xl object-cover ring-4 ring-blue-100 shadow-xl transition-transform group-hover:scale-105"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h2 className="text-4xl font-bold text-gray-800">{vehicle.vehicle_name || 'N/A'}</h2>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(vehicle.status)}`}>
                      {getStatusIcon(vehicle.status)}
                      {vehicle.status === 'active' ? 'Active' : vehicle.status === 'inactive' ? 'Inactive' : vehicle.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-gray-500">Vehicle No</p>
                        <p className="font-semibold text-gray-800">{vehicle.vehicle_no || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="font-semibold text-gray-800">{vehicle.category || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-gray-500">Size</p>
                        <p className="font-semibold text-gray-800">{vehicle.size || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-gray-500">Year</p>
                        <p className="font-semibold text-gray-800">{vehicle.year || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Vehicle ID</div>
                <div className="text-2xl font-bold text-blue-600">#{vehicle.id}</div>
              </div>
            </div>
          </div>

          {/* Tabbed Interface */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Tab Navigation */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <div className="flex">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'driver', label: 'Driver Info', icon: User },
                  { id: 'documents', label: 'Documents', icon: FileText },
                  { id: 'specifications', label: 'Specifications', icon: Gauge }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8">
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Vehicle Overview</h3>
                    <p className="text-gray-600">Complete summary of vehicle information</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center border border-blue-200">
                      <Truck className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-blue-800">{vehicle.category || 'N/A'}</div>
                      <div className="text-sm text-blue-600">Category</div>
                    </div>
                    <div className={`rounded-xl p-6 text-center border-2 ${getStatusColor(vehicle.status)}`}>
                      <div className="text-2xl font-bold mb-3">
                        {getStatusIcon(vehicle.status)}
                      </div>
                      <div className="text-2xl font-bold">{vehicle.status === 'active' ? 'Active' : vehicle.status === 'inactive' ? 'Inactive' : vehicle.status}</div>
                      <div className="text-sm">Status</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200">
                      <Gauge className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-purple-800">{vehicle.mileage || 'N/A'}</div>
                      <div className="text-sm text-purple-600">Mileage (km/l)</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 text-center border border-green-200">
                      <Fuel className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-green-800">{vehicle.fule_capacity || vehicle.fuleCapacity || 'N/A'}</div>
                      <div className="text-sm text-green-600">Fuel Capacity (L)</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'driver' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Driver Information</h3>
                    <p className="text-gray-600">Details about the assigned driver</p>
                  </div>

                  {driver ? (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-gray-800">{driver.driver_name || driver.name || 'N/A'}</h4>
                          <p className="text-blue-600 font-medium">Assigned Driver</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-3 mb-2">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-700">Mobile Number</span>
                          </div>
                          <p className="text-lg text-gray-800">{driver.driver_contact || 'N/A'}</p>
                        </div>
                        <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-700">Address</span>
                          </div>
                          <p className="text-lg text-gray-800">{driver.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-600 mb-2">No Driver Assigned</h4>
                      <p className="text-gray-500">This vehicle does not have an assigned driver.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Technical Specifications</h3>
                    <p className="text-gray-600">Detailed technical information about the vehicle</p>
                  </div>

                  {/* Vehicle Specifications */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8 border border-green-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Truck className="w-6 h-6 text-green-600" />
                      Vehicle Specifications
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white/70 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Truck className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-700">Brand</span>
                        </div>
                        <p className="text-lg text-gray-800">{vehicle.brand || 'N/A'}</p>
                      </div>

                      <div className="bg-white/70 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Car className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-700">Model</span>
                        </div>
                        <p className="text-lg text-gray-800">{vehicle.model || 'N/A'}</p>
                      </div>

                      <div className="bg-white/70 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-700">Year</span>
                        </div>
                        <p className="text-lg text-gray-800">{vehicle.year || 'N/A'}</p>
                      </div>

                      <div className="bg-white/70 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Gauge className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-700">Mileage</span>
                        </div>
                        <p className="text-lg text-gray-800">{vehicle.mileage || 'N/A'} km/l</p>
                      </div>

                      <div className="bg-white/70 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Fuel className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-700">Fuel Capacity</span>
                        </div>
                        <p className="text-lg text-gray-800">{vehicle.fule_capacity || vehicle.fuleCapacity || 'N/A'} L</p>
                      </div>

                      <div className="bg-white/70 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-700">Registration Date</span>
                        </div>
                        <p className="text-lg text-gray-800">{formatDate(vehicle.registration_date)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Document Information</h3>
                    <p className="text-gray-600">Status and expiry dates of all vehicle documents</p>
                  </div>

                  {/* Document Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Shield className="w-6 h-6 text-blue-600" />
                          <span className="font-semibold text-gray-700">Insurance</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentStatus(vehicle.insurance_expiry).color}`}>
                          {getDocumentStatus(vehicle.insurance_expiry).text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Expiry Date</p>
                      <p className="text-lg font-semibold text-gray-800">{formatDate(vehicle.insurance_expiry)}</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-300 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <FileCheck className="w-6 h-6 text-green-600" />
                          <span className="font-semibold text-gray-700">Fitness Certificate</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentStatus(vehicle.fitness_expiry).color}`}>
                          {getDocumentStatus(vehicle.fitness_expiry).text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Expiry Date</p>
                      <p className="text-lg font-semibold text-gray-800">{formatDate(vehicle.fitness_expiry)}</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-purple-600" />
                          <span className="font-semibold text-gray-700">Tax Token</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentStatus(vehicle.tax_token_expiry).color}`}>
                          {getDocumentStatus(vehicle.tax_token_expiry).text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Expiry Date</p>
                      <p className="text-lg font-semibold text-gray-800">{formatDate(vehicle.tax_token_expiry)}</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-orange-300 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Truck className="w-6 h-6 text-orange-600" />
                          <span className="font-semibold text-gray-700">Vehicle Permit</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentStatus(vehicle.permit_expiry).color}`}>
                          {getDocumentStatus(vehicle.permit_expiry).text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Expiry Date</p>
                      <p className="text-lg font-semibold text-gray-800">{formatDate(vehicle.permit_expiry)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Information Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              System Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                  <span className="font-semibold text-gray-700">Created Date</span>
                </div>
                <p className="text-lg text-gray-800">{formatDate(vehicle.created_at)}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                  <span className="font-semibold text-gray-700">Last Updated</span>
                </div>
                <p className="text-lg text-gray-800">{formatDate(vehicle.updated_at)}</p>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Info className="w-6 h-6 text-gray-600" />
                  <span className="font-semibold text-gray-700">Record Status</span>
                </div>
                <p className="text-lg text-gray-800">Active Record</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-10 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center gap-2"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}