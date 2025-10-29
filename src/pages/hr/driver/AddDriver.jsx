import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Calendar, Phone, CheckCircle, Upload, MapPin, CreditCard, Heart, IdCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddDriver() {
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
       `http://192.168.0.106:8080/uploads/drivers/${imagePath}`,
       `http://192.168.0.106:8080/uploads/${imagePath}`,
       `http://192.168.0.106:8080/static/${imagePath}`,
       `http://192.168.0.106:8080/${imagePath}`
     ];
 
     // Return the first path (you may need to adjust this based on your backend structure)
     return possiblePaths[0];
   };
 
   // Helper function to get reliable placeholder image
   const getPlaceholderImage = () => {
     // Use a simple gray background as fallback instead of external service
     return "data:image/svg+xml;base64," + btoa(`
       <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
         <rect width="100" height="100" fill="#f3f4f6"/>
         <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">No Image</text>
       </svg>
     `);
   };

   // Helper function to handle image errors
   const handleImageError = (e) => {
     console.log('Image failed to load:', e.target.src);
     // Use reliable SVG placeholder instead of external service
     e.target.src = getPlaceholderImage();
     // Remove the error handler to prevent infinite loops
     e.target.onError = null;
   };

   const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    mobile: '',
    emergency: '',
    address: '',

    // License Information
    license: '',
    expired: '',

    // Personal Information
    nid: '',
    joiningDate: '',

    // Employment Information
    vehicleAssigned: '',

    // System Information
    status: 'Active',
    image: getPlaceholderImage(),
    imageFile: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.image && formData.image.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image);
      }
    };
  }, [formData.image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

  const validateForm = () => {
    const newErrors = {};

    // Basic Information Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Driver name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number is invalid';
    }

    if (!formData.emergency.trim()) {
      newErrors.emergency = 'Emergency contact is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.emergency)) {
      newErrors.emergency = 'Emergency contact is invalid';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // License Information Validation
    if (!formData.license.trim()) {
      newErrors.license = 'License number is required';
    }

    if (!formData.expired) {
      newErrors.expired = 'License expiry date is required';
    }

    // Personal Information Validation
    if (!formData.nid.trim()) {
      newErrors.nid = 'NID number is required';
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }

    // Employment Information Validation
    if (!formData.vehicleAssigned.trim()) {
      newErrors.vehicleAssigned = 'Vehicle assignment is required';
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
       submitData.append('driver_name', formData.name);
       submitData.append('mobile', formData.mobile);
       submitData.append('emergency', formData.emergency);
       submitData.append('address', formData.address);
       submitData.append('license', formData.license);
       submitData.append('expired', formData.expired ? `${formData.expired}T00:00:00Z` : '');
       submitData.append('nid', formData.nid);
       submitData.append('joining_date', formData.joiningDate ? `${formData.joiningDate}T00:00:00Z` : '');
       submitData.append('status', formData.status);

       // Append image file if available, otherwise send empty string
       if (formData.imageFile) {
         submitData.append('image', formData.imageFile);
         console.log('Appending image file to FormData:', formData.imageFile.name);
       } else {
         submitData.append('image', '');
         console.log('No image file, appending empty string');
       }

       // Log FormData contents for debugging
       console.log('FormData contents:');
       for (let [key, value] of submitData.entries()) {
         console.log(key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
       }

       // Make API call to add driver
       console.log('Sending FormData to API:', {
         driver_name: formData.name,
         mobile: formData.mobile,
         emergency: formData.emergency,
         address: formData.address,
         license: formData.license,
         expired: formData.expired,
         nid: formData.nid,
         joining_date: formData.joiningDate,
         status: formData.status,
         imageFilePresent: !!formData.imageFile,
         imageFileName: formData.imageFile?.name,
         imageFileSize: formData.imageFile?.size
       });

       const response = await fetch('http://192.168.0.106:8080/api/v1/driver', {
         method: 'POST',
         body: submitData // FormData automatically sets Content-Type with boundary
       });

       if (!response.ok) {
         const errorText = await response.text();
         console.error('API Error Response:', errorText);
         throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
       }
 
       const result = await response.json();
       console.log('Driver added successfully:', result);

       setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        // Clean up object URL if it exists
        if (formData.image && formData.image.startsWith('blob:')) {
          URL.revokeObjectURL(formData.image);
        }

        setFormData({
          // Basic Information
          name: '',
          mobile: '',
          emergency: '',
          address: '',

          // License Information
          license: '',
          expired: '',

          // Personal Information
          nid: '',
          joiningDate: '',

          // Employment Information
          vehicleAssigned: '',

          // System Information
          status: 'Active',
          image: getPlaceholderImage(),
          imageFile: null
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
       console.error('Error adding driver:', error);

       // Handle different types of errors
       let errorMessage = 'Failed to add driver. Please try again.';

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
    if (formData.image && formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }

    setFormData({
      // Basic Information
      name: '',
      mobile: '',
      emergency: '',
      address: '',

      // License Information
      license: '',
      expired: '',

      // Personal Information
      nid: '',
      joiningDate: '',

      // Employment Information
      vehicleAssigned: '',

      // System Information
      status: 'Active',
      image: getPlaceholderImage(),
      imageFile: null // This will store the actual file for form submission (keeping for backward compatibility)
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Driver Added Successfully!</h2>
            <p className="text-gray-600">The new driver has been added to the system.</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/driver"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Driver List
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Another Driver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            to="/driver"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Driver List</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">Add New Driver</h1>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Image Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={getImageUrl(formData.image)}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100"
                  onError={handleImageError}
                />
                <button
                  type="button"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                  title="Change Photo"
                >
                  <User size={16} />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Driver Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new driver</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {/* Profile Image Upload Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Image</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={getImageUrl(formData.image)}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100"
                    onError={handleImageError}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData(prev => ({
                          ...prev,
                          imageFile: file,
                          image: URL.createObjectURL(file) // Use object URL for preview instead of base64
                        }));
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Upload size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Click on the image to upload a new photo</p>
                  <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 2MB)</p>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Driver Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter driver name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mobile ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter mobile number"
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Emergency Contact *
                  </label>
                  <input
                    type="tel"
                    name="emergency"
                    value={formData.emergency}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergency ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter emergency contact"
                  />
                  {errors.emergency && (
                    <p className="mt-1 text-sm text-red-600">{errors.emergency}</p>
                  )}
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number *
                  </label>
                  <input
                    type="text"
                    name="license"
                    value={formData.license}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.license ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter license number"
                  />
                  {errors.license && (
                    <p className="mt-1 text-sm text-red-600">{errors.license}</p>
                  )}
                </div>
              </div>

              {/* Address - Full Width */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>

            {/* License Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">License Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* License Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    License Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="expired"
                    value={formData.expired}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.expired ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.expired && (
                    <p className="mt-1 text-sm text-red-600">{errors.expired}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal & Employment Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal & Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NID Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IdCard className="inline w-4 h-4 mr-1" />
                    NID Number *
                  </label>
                  <input
                    type="text"
                    name="nid"
                    value={formData.nid}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nid ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter NID number"
                  />
                  {errors.nid && (
                    <p className="mt-1 text-sm text-red-600">{errors.nid}</p>
                  )}
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.joiningDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.joiningDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.joiningDate}</p>
                  )}
                </div>

                {/* Vehicle Assigned */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Truck className="inline w-4 h-4 mr-1" />
                    Vehicle Assigned *
                  </label>
                  <select
                    name="vehicleAssigned"
                    value={formData.vehicleAssigned}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehicleAssigned ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Vehicle</option>
                    <option value="Truck-001 (Toyota)">Truck-001 (Toyota)</option>
                    <option value="Truck-002 (Hino)">Truck-002 (Hino)</option>
                    <option value="Truck-003 (Isuzu)">Truck-003 (Isuzu)</option>
                    <option value="Van-001 (Suzuki)">Van-001 (Suzuki)</option>
                    <option value="Pickup-001 (Mitsubishi)">Pickup-001 (Mitsubishi)</option>
                  </select>
                  {errors.vehicleAssigned && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleAssigned}</p>
                  )}
                </div>
              </div>
            </div>

            {/* System Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Error Display */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errors.submit}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Driver...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Add Driver</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Form
              </button>

              <Link
                to="/driver"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Important Notes:</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <div>
                <strong>Required Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>All fields marked with * are mandatory</li>
                  <li>Basic details: Name, mobile, emergency contact, address</li>
                  <li>License details: License number and expiry date</li>
                  <li>Employment details: NID, joining date, vehicle assignment</li>
                </ul>
              </div>
              <div>
                <strong>License Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Ensure license number is accurate and up to date</li>
                  <li>Set expiry date to receive renewal reminders</li>
                  <li>Expired licenses will be highlighted in red</li>
                </ul>
              </div>
              <div>
                <strong>Vehicle Assignment:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Assign appropriate vehicle based on driver capability</li>
                  <li>Update assignment when vehicle changes</li>
                  <li>Ensure proper documentation for assignments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
