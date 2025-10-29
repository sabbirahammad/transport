import React, { useState } from 'react';
import { ArrowLeft, Building, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddDealer() {
  const [formData, setFormData] = useState({
    dealer_name: '',
    destination: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1/dealer';

  // Demo mode for development when backend is not available
  const DEMO_MODE = false; // Set to false when backend is running

  // Mock API function for demo mode
  const mockApiCall = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful API response
        const newDealer = {
          id: Date.now(), // Generate unique ID
          dealer_name: data.dealer_name,
          destination: data.destination,
          status: data.status,
          created_at: new Date().toISOString()
        };
        resolve({ data: newDealer });
      }, 1000); // Simulate network delay
    });
  };

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
  };

  const validateForm = () => {
    const newErrors = {};

    // Dealer Information Validation
    if (!formData.dealer_name.trim()) {
      newErrors.dealer_name = 'Dealer name is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
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
    setSubmitError(null);

    try {
      let result;

      if (DEMO_MODE) {
        // Use mock API for demo mode
        result = await mockApiCall(formData);
        console.log('New dealer created (Demo Mode):', result);
      } else {
        // Use real API when backend is available
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        result = await response.json();
        console.log('New dealer created:', result);
      }

      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          dealer_name: '',
          destination: '',
          status: 'Active'
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding dealer:', error);

      if (DEMO_MODE) {
        setSubmitError('Demo mode error. Please check the console for details.');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setSubmitError('Cannot connect to server. Please check if the backend server is running.');
      } else if (error.message.includes('HTTP error!')) {
        setSubmitError(`Server error: ${error.message}. Please try again or contact support.`);
      } else {
        setSubmitError('Failed to add dealer. Please check your input and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      dealer_name: '',
      destination: '',
      status: 'Active'
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dealer Added Successfully!</h2>
            <p className="text-gray-600">The new dealer has been added to the system.</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/dealer"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dealer List
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Another Dealer
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
            to="/dealer"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dealer List</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">Add New Dealer</h1>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Demo Mode Banner */}
          {DEMO_MODE && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-yellow-800 font-medium">Demo Mode Active</p>
                  <p className="text-yellow-700 text-sm">Using mock data since backend server is not available</p>
                </div>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Dealer Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new dealer</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">

            {/* Dealer Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dealer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dealer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline w-4 h-4 mr-1" />
                    Dealer Name *
                  </label>
                  <input
                    type="text"
                    name="dealer_name"
                    value={formData.dealer_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dealer_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter dealer name"
                  />
                  {errors.dealer_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.dealer_name}</p>
                  )}
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.destination ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter destination"
                  />
                  {errors.destination && (
                    <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
                  )}
                </div>

                {/* Status */}
                <div className="md:col-span-2">
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
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800">{submitError}</p>
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
                    <span>Adding Dealer...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Add Dealer</span>
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
                to="/dealer"
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
                  <li>Dealer name and destination are required</li>
                  <li>Status will default to "Active" if not specified</li>
                </ul>
              </div>
              <div>
                <strong>Dealer Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Enter the official registered name of the dealer</li>
                  <li>Specify the primary destination/location they serve</li>
                  <li>Set appropriate status based on current relationship</li>
                </ul>
              </div>
              <div>
                <strong>Backend Model Structure:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li><code className="bg-gray-100 px-1 rounded">dealer_name</code> (string, required)</li>
                  <li><code className="bg-gray-100 px-1 rounded">destination</code> (string, required)</li>
                  <li><code className="bg-gray-100 px-1 rounded">status</code> (string, default: "Active")</li>
                </ul>
              </div>
              <div>
                <strong>Demo Mode:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Currently running in demo mode (no backend required)</li>
                  <li>Set <code className="bg-gray-100 px-1 rounded">DEMO_MODE = false</code> when backend is ready</li>
                  <li>Mock data is stored temporarily in browser memory</li>
                </ul>
              </div>
              <div>
                <strong>After Submission:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Dealer will be added to the main dealer list</li>
                  <li>You can edit or update details later</li>
                  <li>All information will be stored securely</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}