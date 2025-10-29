import React, { useState, useEffect, useRef } from 'react';
import {
  Truck, Plus, ArrowLeft, Upload, Search, CheckCircle, User, Phone, Calendar,
  CreditCard, Car, Gauge, Fuel, FileText, AlertCircle, X, Camera, Save,
  RefreshCw, Info, Star
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateVehicle() {
  const navigate = useNavigate();

  // API base URL
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // Helper function to get reliable placeholder image
  const getPlaceholderImage = () => {
    return "data:image/svg+xml;base64," + btoa(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#grad1)"/>
        <circle cx="100" cy="80" r="30" fill="#d1d5db"/>
        <rect x="60" y="120" width="80" height="40" rx="8" fill="#d1d5db"/>
        <circle cx="75" cy="140" r="8" fill="#9ca3af"/>
        <circle cx="125" cy="140" r="8" fill="#9ca3af"/>
        <text x="100" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Vehicle Image</text>
      </svg>
    `);
  };

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

  // Helper function to handle image errors
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.src = getPlaceholderImage();
    e.target.onError = null;
  };

  // State for drivers
  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [driverSearchTerm, setDriverSearchTerm] = useState('');
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);

  // Form state management
  const [formData, setFormData] = useState({
    // Driver Information
    driverName: '',
    driverContact: '',
    driverId: '',

    // Vehicle Basic Information
    brand: '',
    model: '',
    vehicleName: '',
    category: '',
    size: '',
    vehicleNo: '',

    // Technical Specifications
    year: '',
    mileage: '',
    fuelCapacity: '',

    // Document Information
    registrationDate: '',
    insuranceExpiry: '',
    fitnessExpiry: '',
    taxTokenExpiry: '',
    permitExpiry: '',

    // System Information
    status: 'Active',

    // Media
    vehiclePhoto: getPlaceholderImage(),
    vehiclePhotoFile: null,
  });

  // UI state management
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.vehiclePhoto && formData.vehiclePhoto.startsWith('blob:')) {
        URL.revokeObjectURL(formData.vehiclePhoto);
      }
    };
  }, [formData.vehiclePhoto]);

  // Fetch drivers from API
  const fetchDrivers = async (search = '') => {
    try {
      setLoadingDrivers(true);
      let url = `${API_BASE_URL}/driver?page=1&page_size=50`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const driversData = data.drivers || data.data || data.results || [];
      setDrivers(driversData);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  };

  // Fetch drivers on mount and when search term changes
  useEffect(() => {
    fetchDrivers(driverSearchTerm);
  }, [driverSearchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDriverDropdown && !event.target.closest('.driver-dropdown')) {
        setShowDriverDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDriverDropdown]);

  const handleDriverSelect = (driver) => {
    setFormData({
      ...formData,
      driverName: driver.driver_name || driver.name,
      driverContact: driver.mobile
    });
    setShowDriverDropdown(false);
    setDriverSearchTerm('');
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'vehiclePhoto' && files && files[0]) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          vehiclePhoto: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          vehiclePhoto: 'Image size must be less than 2MB'
        }));
        return;
      }

      // Clean up previous object URL to prevent memory leaks
      if (formData.vehiclePhoto && formData.vehiclePhoto.startsWith('blob:')) {
        URL.revokeObjectURL(formData.vehiclePhoto);
      }

      setFormData(prev => ({
        ...prev,
        vehiclePhotoFile: file,
        vehiclePhoto: URL.createObjectURL(file)
      }));

      console.log('Image file selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear submit error when user starts typing
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

  // Enhanced validation function
  const validateForm = () => {
    const newErrors = {};

    // Driver Information Validation
    if (!formData.driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }

    if (!formData.driverContact.trim()) {
      newErrors.driverContact = 'Driver contact is required';
    } else if (!/^(\+88|88|01)[0-9]{9}$/.test(formData.driverContact.replace(/\s+/g, ''))) {
      newErrors.driverContact = 'Please enter a valid Bangladeshi mobile number';
    }

    // Vehicle Basic Information Validation
    if (!formData.vehicleName.trim()) {
      newErrors.vehicleName = 'Vehicle name is required';
    } else if (formData.vehicleName.length < 2) {
      newErrors.vehicleName = 'Vehicle name must be at least 2 characters';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Vehicle category is required';
    }

    if (!formData.size.trim()) {
      newErrors.size = 'Vehicle size is required';
    }

    if (!formData.vehicleNo.trim()) {
      newErrors.vehicleNo = 'Vehicle number is required';
    } else if (!/^[A-Za-z]{2}-[0-9]{4}$/.test(formData.vehicleNo.trim())) {
      newErrors.vehicleNo = 'Vehicle number must be in format: XX-1234';
    }

    // Technical Specifications Validation
    if (formData.year && (formData.year < 1990 || formData.year > new Date().getFullYear() + 1)) {
      newErrors.year = `Year must be between 1990 and ${new Date().getFullYear() + 1}`;
    }

    if (formData.mileage && (formData.mileage < 1 || formData.mileage > 100)) {
      newErrors.mileage = 'Mileage must be between 1 and 100 km/l';
    }

    if (formData.fuelCapacity && (formData.fuelCapacity < 10 || formData.fuelCapacity > 500)) {
      newErrors.fuelCapacity = 'Fuel capacity must be between 10 and 500 liters';
    }

    // Document Date Validation
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (formData.insuranceExpiry) {
      const insuranceDate = new Date(formData.insuranceExpiry);
      if (insuranceDate < currentDate) {
        newErrors.insuranceExpiry = 'Insurance expiry date cannot be in the past';
      }
    }

    if (formData.fitnessExpiry) {
      const fitnessDate = new Date(formData.fitnessExpiry);
      if (fitnessDate < currentDate) {
        newErrors.fitnessExpiry = 'Fitness expiry date cannot be in the past';
      }
    }

    if (formData.taxTokenExpiry) {
      const taxDate = new Date(formData.taxTokenExpiry);
      if (taxDate < currentDate) {
        newErrors.taxTokenExpiry = 'Tax token expiry date cannot be in the past';
      }
    }

    if (formData.permitExpiry) {
      const permitDate = new Date(formData.permitExpiry);
      if (permitDate < currentDate) {
        newErrors.permitExpiry = 'Permit expiry date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare FormData for API submission
      const submitData = new FormData();
      submitData.append('driver_name', formData.driverName);
      submitData.append('driver_contact', formData.driverContact);
      submitData.append('brand', formData.brand);
      submitData.append('model', formData.model);
      submitData.append('vehicle_name', formData.vehicleName);
      submitData.append('category', formData.category);
      submitData.append('size', formData.size);
      submitData.append('vehicle_no', formData.vehicleNo);
      submitData.append('year', formData.year);
      submitData.append('mileage', formData.mileage);
      submitData.append('fuel_capacity', formData.fuelCapacity);
      submitData.append('registration_date', formData.registrationDate ? `${formData.registrationDate}T00:00:00Z` : '');
      submitData.append('insurance_expiry', formData.insuranceExpiry ? `${formData.insuranceExpiry}T00:00:00Z` : '');
      submitData.append('fitness_expiry', formData.fitnessExpiry ? `${formData.fitnessExpiry}T00:00:00Z` : '');
      submitData.append('tax_token_expiry', formData.taxTokenExpiry ? `${formData.taxTokenExpiry}T00:00:00Z` : '');
      submitData.append('permit_expiry', formData.permitExpiry ? `${formData.permitExpiry}T00:00:00Z` : '');
      submitData.append('status', formData.status);

      // Append image file if available
      if (formData.vehiclePhotoFile) {
        submitData.append('image', formData.vehiclePhotoFile);
        console.log('Appending vehicle photo file to FormData:', formData.vehiclePhotoFile.name);
      } else {
        submitData.append('image', '');
        console.log('No vehicle photo file, appending empty string');
      }

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      }

      const response = await fetch(`${API_BASE_URL}/vehicle`, {
        method: 'POST',
        body: submitData // FormData automatically sets Content-Type with boundary
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Vehicle added successfully:', result);

      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        // Clean up object URL if it exists
        if (formData.vehiclePhoto && formData.vehiclePhoto.startsWith('blob:')) {
          URL.revokeObjectURL(formData.vehiclePhoto);
        }

        setFormData({
          driverName: '',
          driverContact: '',
          brand: '',
          model: '',
          vehicleName: '',
          category: '',
          size: '',
          vehicleNo: '',
          year: '',
          mileage: '',
          fuelCapacity: '',
          registrationDate: '',
          insuranceExpiry: '',
          fitnessExpiry: '',
          taxTokenExpiry: '',
          permitExpiry: '',
          status: 'Active',
          vehiclePhoto: getPlaceholderImage(),
          vehiclePhotoFile: null
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding vehicle:', error);

      // Handle different types of errors
      let errorMessage = 'Failed to add vehicle. Please try again.';

      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('HTTP error! status:')) {
        const statusCode = error.message.match(/status: (\d+)/)?.[1];
        if (statusCode === '400') {
          errorMessage = 'Invalid data provided. Please check all fields and try again.';
        } else if (statusCode === '401') {
          errorMessage = 'Unauthorized access. Please check your permissions.';
        } else if (statusCode === '500') {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = `Server error (${statusCode}). Please try again.`;
        }
      }

      // Set error state to show error message to user
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Clean up object URL if it exists
    if (formData.vehiclePhoto && formData.vehiclePhoto.startsWith('blob:')) {
      URL.revokeObjectURL(formData.vehiclePhoto);
    }

    setFormData({
      driverName: '',
      driverContact: '',
      brand: '',
      model: '',
      vehicleName: '',
      category: '',
      size: '',
      vehicleNo: '',
      year: '',
      mileage: '',
      fuelCapacity: '',
      registrationDate: '',
      insuranceExpiry: '',
      fitnessExpiry: '',
      taxTokenExpiry: '',
      permitExpiry: '',
      status: 'Active',
      vehiclePhoto: getPlaceholderImage(),
      vehiclePhotoFile: null
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center transform animate-fade-in">
          <div className="mb-8">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Vehicle Added Successfully!</h2>
            <p className="text-gray-600 text-lg">The new vehicle has been added to the system and is ready for use.</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Truck className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-800">{formData.vehicleName}</span>
            </div>
            <p className="text-sm text-gray-600">Vehicle No: {formData.vehicleNo}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {formData.status}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {formData.category}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/vehicle"
              className="w-full block text-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 font-semibold shadow-lg"
            >
              View Vehicle List
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                // Reset form
                handleCancel();
              }}
              className="w-full block text-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
            >
              Add Another Vehicle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <Link
            to="/vehicle"
            className="flex items-center gap-3 text-white hover:text-blue-200 transition-all transform hover:scale-105"
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium">Back to Vehicle List</span>
          </Link>
          <div className="h-8 w-px bg-gradient-to-b from-white/20 to-white/40"></div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Add New Vehicle</h1>
              <p className="text-blue-100 text-sm">Create a new vehicle in the system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Vehicle Image Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-4">
                  {/* Main image display */}
                  <div className="relative">
                    <img
                      src={getImageUrl(formData.vehiclePhoto)}
                      alt="Vehicle"
                      className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg transition-all ${
                        formData.vehiclePhotoFile
                          ? 'ring-4 ring-green-300'
                          : 'ring-4 ring-blue-100'
                      } ${errors.vehiclePhoto ? 'ring-red-300' : ''}`}
                      onError={handleImageError}
                    />

                    {/* Selected file indicator */}
                    {formData.vehiclePhotoFile && (
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={handleImageButtonClick}
                    className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 font-medium ${
                      formData.vehiclePhotoFile
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {formData.vehiclePhotoFile ? 'Change Photo' : 'Upload Photo'}
                  </button>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    name="vehiclePhoto"
                    onChange={handleInputChange}
                    className="hidden"
                    title="Upload vehicle image (JPG, PNG, GIF, WebP - Max 2MB)"
                  />

                  {/* Remove image button */}
                  {formData.vehiclePhotoFile && (
                    <button
                      type="button"
                      onClick={() => {
                        // Clean up object URL
                        if (formData.vehiclePhoto && formData.vehiclePhoto.startsWith('blob:')) {
                          URL.revokeObjectURL(formData.vehiclePhoto);
                        }
                        setFormData(prev => ({
                          ...prev,
                          vehiclePhoto: getPlaceholderImage(),
                          vehiclePhotoFile: null
                        }));
                        setErrors(prev => ({
                          ...prev,
                          vehiclePhoto: ''
                        }));
                      }}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                      title="Remove selected image"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Vehicle Information</h2>
                  <p className="text-gray-600 mb-4">Fill in the comprehensive details below to add a new vehicle to the fleet</p>

                  {/* Upload button for better accessibility */}
                  <button
                    type="button"
                    onClick={handleImageButtonClick}
                    className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium flex items-center gap-2"
                  >
                    <Camera size={16} />
                    {formData.vehiclePhotoFile ? 'Change Vehicle Photo' : 'Upload Vehicle Photo'}
                  </button>

                  {/* Selected file info */}
                  {formData.vehiclePhotoFile && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Image selected:</span>
                        <span className="text-sm">{formData.vehiclePhotoFile.name}</span>
                        <span className="text-xs text-green-600">
                          ({(formData.vehiclePhotoFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Image error display */}
                  {errors.vehiclePhoto && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle size={16} />
                        <span className="text-sm">{errors.vehiclePhoto}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Step 1: Basic Information
                    </span>
                    <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">
                      Step 2: Technical Details
                    </span>
                    <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm">
                      Step 3: Documents & Review
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Progress</div>
                <div className="text-2xl font-bold text-blue-600">33%</div>
              </div>
            </div>
          </div>

          {/* Enhanced Form with Tabs */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Tab Navigation */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <div className="flex">
                {[
                  { id: 'basic', label: 'Basic Information', icon: Truck },
                  { id: 'technical', label: 'Technical Details', icon: Gauge },
                  { id: 'documents', label: 'Documents & Review', icon: FileText }
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

            <div className="p-4 sm:p-8">
              {/* Tab Content */}
              {activeTab === 'basic' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Basic Information</h3>
                    <p className="text-gray-600">Enter the fundamental details of the vehicle</p>
                  </div>

                  {/* Driver Information Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Driver Information
                      <Info className="w-4 h-4 text-gray-400" />
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Enhanced Driver Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <User className="inline w-4 h-4 mr-2 text-blue-600" />
                          Driver Name *
                        </label>
                        <div className="relative driver-dropdown">
                          <input
                            type="text"
                            value={formData.driverName}
                            onChange={(e) => {
                              setFormData({ ...formData, driverName: e.target.value });
                              setDriverSearchTerm(e.target.value);
                              setShowDriverDropdown(true);
                            }}
                            onFocus={() => setShowDriverDropdown(true)}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                              errors.driverName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                            }`}
                            placeholder="Search and select driver from existing list"
                          />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          {showDriverDropdown && (
                            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-blue-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                              {loadingDrivers ? (
                                <div className="px-4 py-3 text-blue-600 flex items-center gap-2">
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Loading drivers...
                                </div>
                              ) : drivers.length > 0 ? (
                                drivers.map((driver) => (
                                  <div
                                    key={driver.id}
                                    onClick={() => handleDriverSelect(driver)}
                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="font-semibold text-gray-800">{driver.driver_name || driver.name}</div>
                                    <div className="text-sm text-gray-500">{driver.mobile}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-gray-500">No drivers found</div>
                              )}
                            </div>
                          )}
                        </div>
                        {errors.driverName && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.driverName}
                          </p>
                        )}
                      </div>

                      {/* Enhanced Driver Contact */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Phone className="inline w-4 h-4 mr-2 text-blue-600" />
                          Driver Contact *
                        </label>
                        <input
                          type="tel"
                          name="driverContact"
                          value={formData.driverContact}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.driverContact ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                          }`}
                          placeholder="01XXXXXXXXX"
                          readOnly
                        />
                        {errors.driverContact && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.driverContact}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Basic Details Section */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 sm:p-6 border border-green-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-green-600" />
                      Vehicle Basic Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Brand */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Truck className="inline w-4 h-4 mr-2 text-green-600" />
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                          placeholder="Toyota, Honda, Mahindra"
                        />
                      </div>

                      {/* Model */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Car className="inline w-4 h-4 mr-2 text-green-600" />
                          Model
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={formData.model}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                          placeholder="Hiace, Bolero, X-Corolla"
                        />
                      </div>

                      {/* Vehicle Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Truck className="inline w-4 h-4 mr-2 text-green-600" />
                          Vehicle Name *
                        </label>
                        <input
                          type="text"
                          name="vehicleName"
                          value={formData.vehicleName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                            errors.vehicleName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                          }`}
                          placeholder="Enter vehicle name"
                        />
                        {errors.vehicleName && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.vehicleName}
                          </p>
                        )}
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Car className="inline w-4 h-4 mr-2 text-green-600" />
                          Category *
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                            errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                          }`}
                          placeholder="Truck, Minibus, Pickup"
                        />
                        {errors.category && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.category}
                          </p>
                        )}
                      </div>

                      {/* Size */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Gauge className="inline w-4 h-4 mr-2 text-green-600" />
                          Size *
                        </label>
                        <input
                          type="text"
                          name="size"
                          value={formData.size}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                            errors.size ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                          }`}
                          placeholder="15 Seater, Heavy Duty"
                        />
                        {errors.size && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.size}
                          </p>
                        )}
                      </div>

                      {/* Vehicle Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <CreditCard className="inline w-4 h-4 mr-2 text-green-600" />
                          Vehicle Number *
                        </label>
                        <input
                          type="text"
                          name="vehicleNo"
                          value={formData.vehicleNo}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                            errors.vehicleNo ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                          }`}
                          placeholder="XX-1234"
                        />
                        {errors.vehicleNo && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.vehicleNo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('technical')}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center gap-2"
                    >
                      Next: Technical Details
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Technical Details</h3>
                    <p className="text-gray-600">Enter the technical specifications and capabilities</p>
                  </div>

                  {/* Technical Specifications Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-purple-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-purple-600" />
                      Technical Specifications
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Year of Manufacture */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Calendar className="inline w-4 h-4 mr-2 text-purple-600" />
                          Year of Manufacture
                        </label>
                        <input
                          type="number"
                          name="year"
                          value={formData.year}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                            errors.year ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                          }`}
                          placeholder="2020"
                          min="1990"
                          max={new Date().getFullYear() + 1}
                        />
                        {errors.year && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.year}
                          </p>
                        )}
                      </div>

                      {/* Mileage */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Gauge className="inline w-4 h-4 mr-2 text-purple-600" />
                          Mileage (km/l)
                        </label>
                        <input
                          type="number"
                          name="mileage"
                          value={formData.mileage}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                            errors.mileage ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                          }`}
                          placeholder="12"
                          min="1"
                          max="100"
                        />
                        {errors.mileage && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.mileage}
                          </p>
                        )}
                      </div>

                      {/* Fuel Capacity */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Fuel className="inline w-4 h-4 mr-2 text-purple-600" />
                          Fuel Capacity (liters)
                        </label>
                        <input
                          type="number"
                          name="fuelCapacity"
                          value={formData.fuelCapacity}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${
                            errors.fuelCapacity ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                          }`}
                          placeholder="50"
                          min="10"
                          max="500"
                        />
                        {errors.fuelCapacity && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.fuelCapacity}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('basic')}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous: Basic Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('documents')}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center gap-2"
                    >
                      Next: Documents & Review
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Documents & Review</h3>
                    <p className="text-gray-600">Enter document expiry dates and review all information</p>
                  </div>

                  {/* Document Information Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 border border-orange-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      Document Expiry Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Registration Date */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Calendar className="inline w-4 h-4 mr-2 text-orange-600" />
                          Registration Date
                        </label>
                        <input
                          type="date"
                          name="registrationDate"
                          value={formData.registrationDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-orange-300"
                        />
                      </div>

                      {/* Insurance Expiry */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <FileText className="inline w-4 h-4 mr-2 text-orange-600" />
                          Insurance Expiry
                        </label>
                        <input
                          type="date"
                          name="insuranceExpiry"
                          value={formData.insuranceExpiry}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                            errors.insuranceExpiry ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300'
                          }`}
                        />
                        {errors.insuranceExpiry && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.insuranceExpiry}
                          </p>
                        )}
                      </div>

                      {/* Fitness Expiry */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <FileText className="inline w-4 h-4 mr-2 text-orange-600" />
                          Fitness Expiry
                        </label>
                        <input
                          type="date"
                          name="fitnessExpiry"
                          value={formData.fitnessExpiry}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                            errors.fitnessExpiry ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300'
                          }`}
                        />
                        {errors.fitnessExpiry && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.fitnessExpiry}
                          </p>
                        )}
                      </div>

                      {/* Tax Token Expiry */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <FileText className="inline w-4 h-4 mr-2 text-orange-600" />
                          Tax Token Expiry
                        </label>
                        <input
                          type="date"
                          name="taxTokenExpiry"
                          value={formData.taxTokenExpiry}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                            errors.taxTokenExpiry ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300'
                          }`}
                        />
                        {errors.taxTokenExpiry && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.taxTokenExpiry}
                          </p>
                        )}
                      </div>

                      {/* Permit Expiry */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <FileText className="inline w-4 h-4 mr-2 text-orange-600" />
                          Permit Expiry
                        </label>
                        <input
                          type="date"
                          name="permitExpiry"
                          value={formData.permitExpiry}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                            errors.permitExpiry ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300'
                          }`}
                        />
                        {errors.permitExpiry && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.permitExpiry}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* System Information Section */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-gray-600" />
                      System Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Status */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Vehicle Status
                        </label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="Active"
                              checked={formData.status === 'Active'}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 font-medium">Active</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="Inactive"
                              checked={formData.status === 'Inactive'}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 font-medium">Inactive</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('technical')}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous: Technical Details
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Error Display */}
            {errors.submit && (
              <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-1">Submission Error</h3>
                    <div className="text-sm text-red-700">
                      <p>{errors.submit}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-wrap gap-4 pt-8 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all transform hover:scale-105 font-bold text-lg shadow-lg ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Adding Vehicle...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Add Vehicle</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
              >
                Clear Form
              </button>

              <Link
                to="/vehicle"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold inline-flex items-center gap-2"
              >
                Cancel
              </Link>
            </div>

            {/* Enhanced Help Text */}
            <div className="mt-4 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-800">Important Guidelines</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-700">
                <div className="bg-white/50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Required Information
                  </h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• All fields marked with * are mandatory</li>
                    <li>• Driver details: Name and contact information</li>
                    <li>• Vehicle details: Name, category, size, and registration number</li>
                    <li>• Use format XX-1234 for vehicle numbers</li>
                  </ul>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    Technical Information
                  </h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Ensure vehicle specifications are accurate</li>
                    <li>• Set expiry dates to receive renewal reminders</li>
                    <li>• Upload clear vehicle photos (JPG, PNG, GIF, WebP - Max 2MB)</li>
                    <li>• Verify all measurements and capacities</li>
                  </ul>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Driver Assignment
                  </h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Search and select from existing drivers</li>
                    <li>• Contact information will be auto-filled</li>
                    <li>• Ensure driver has valid license and documents</li>
                    <li>• Verify driver contact number format</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
