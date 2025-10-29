import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, MapPin, Truck, Package, CheckCircle, TrendingUp, Users, Calendar, Weight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddPricing() {
  const [formData, setFormData] = useState({
    // Basic Information
    customer: '',
    vehicleCategory: '',
    size: '',

    // Route Information
    loadPoint: '',
    unloadPoint: '',

    // Pricing Information
    rate: '',
    weight: '',

    // Additional Information
    notes: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const customers = ['Rahman Enterprise', 'Rahim Trading', 'Hasan Logistics', 'Ali Brothers', 'Salam Transport'];
  const vehicleCategories = ['Covered Van', 'Open Truck', 'Trailer', 'Pickup', 'Container'];
  const sizes = ['8 Feet', '10 Feet', '12 Feet', '14 Feet', '20 Feet', '40 Feet'];
  const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Mymensingh', 'Rangpur', 'Barisal'];
  const weightOptions = ['1 Ton', '2 Ton', '3 Ton', '5 Ton', '8 Ton', '10 Ton', '15 Ton', '20 Ton', '25 Ton', '30 Ton'];

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
    if (!formData.customer.trim()) {
      newErrors.customer = 'Customer selection is required';
    }

    if (!formData.vehicleCategory.trim()) {
      newErrors.vehicleCategory = 'Vehicle category is required';
    }

    if (!formData.size.trim()) {
      newErrors.size = 'Vehicle size is required';
    }

    // Route Information Validation
    if (!formData.loadPoint.trim()) {
      newErrors.loadPoint = 'Load point is required';
    }

    if (!formData.unloadPoint.trim()) {
      newErrors.unloadPoint = 'Unload point is required';
    }

    // Pricing Information Validation
    if (!formData.rate.trim()) {
      newErrors.rate = 'Rate is required';
    } else if (isNaN(formData.rate) || parseFloat(formData.rate) <= 0) {
      newErrors.rate = 'Rate must be a valid positive number';
    }

    if (!formData.weight.trim()) {
      newErrors.weight = 'Weight capacity is required';
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
      // Prepare data for API submission
      const submitData = {
        customer: formData.customer,
        vehicleCategory: formData.vehicleCategory,
        size: formData.size,
        loadPoint: formData.loadPoint,
        unloadPoint: formData.unloadPoint,
        rate: parseFloat(formData.rate),
        weight: formData.weight,
        notes: formData.notes,
        status: formData.status,
        createdDate: new Date().toISOString().split('T')[0]
      };

      // Log for debugging
      console.log('Submitting pricing data:', submitData);

      // Simulate API call - replace with actual API endpoint
      // const response = await fetch('http://your-api-endpoint/api/v1/route-pricing', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(submitData)
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const result = await response.json();
      // console.log('Pricing added successfully:', result);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          customer: '',
          vehicleCategory: '',
          size: '',
          loadPoint: '',
          unloadPoint: '',
          rate: '',
          weight: '',
          notes: '',
          status: 'Active'
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding pricing:', error);

      let errorMessage = 'Failed to add pricing. Please try again.';

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

      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      customer: '',
      vehicleCategory: '',
      size: '',
      loadPoint: '',
      unloadPoint: '',
      rate: '',
      weight: '',
      notes: '',
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pricing Added Successfully!</h2>
            <p className="text-gray-600">The new route pricing has been added to the system.</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/customer/route-pricing"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Route Pricing
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Another Pricing
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
            to="/customer/route-pricing"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Route Pricing</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">Add New Route Pricing</h1>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Info Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="text-blue-600" size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Route Pricing Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new route pricing</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Customer *
                  </label>
                  <select
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.customer ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.customer && (
                    <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
                  )}
                </div>

                {/* Vehicle Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Truck className="inline w-4 h-4 mr-1" />
                    Vehicle Category *
                  </label>
                  <select
                    name="vehicleCategory"
                    value={formData.vehicleCategory}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehicleCategory ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Vehicle Category</option>
                    {vehicleCategories.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  {errors.vehicleCategory && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleCategory}</p>
                  )}
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Size *
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.size ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Size</option>
                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.size && (
                    <p className="mt-1 text-sm text-red-600">{errors.size}</p>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Weight className="inline w-4 h-4 mr-1" />
                    Weight Capacity *
                  </label>
                  <select
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.weight ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Weight</option>
                    {weightOptions.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Route Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Load Point */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1 text-green-600" />
                    Load Point *
                  </label>
                  <select
                    name="loadPoint"
                    value={formData.loadPoint}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.loadPoint ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Load Point</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {errors.loadPoint && (
                    <p className="mt-1 text-sm text-red-600">{errors.loadPoint}</p>
                  )}
                </div>

                {/* Unload Point */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1 text-red-600" />
                    Unload Point *
                  </label>
                  <select
                    name="unloadPoint"
                    value={formData.unloadPoint}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.unloadPoint ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Unload Point</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {errors.unloadPoint && (
                    <p className="mt-1 text-sm text-red-600">{errors.unloadPoint}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Rate (৳) *
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.rate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter rate amount"
                    min="0"
                    step="0.01"
                  />
                  {errors.rate && (
                    <p className="mt-1 text-sm text-red-600">{errors.rate}</p>
                  )}
                </div>

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
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any additional notes or special conditions"
                />
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
                    <span>Adding Pricing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Add Pricing</span>
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
                to="/customer/route-pricing"
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
                  <li>Customer and vehicle details must be specified</li>
                  <li>Route points (load and unload locations) are required</li>
                  <li>Rate must be a positive number</li>
                </ul>
              </div>
              <div>
                <strong>Pricing Guidelines:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Set competitive rates based on distance and weight</li>
                  <li>Consider fuel costs, vehicle maintenance, and driver wages</li>
                  <li>Factor in seasonal demand and market conditions</li>
                  <li>Review and update rates regularly to remain competitive</li>
                </ul>
              </div>
              <div>
                <strong>Weight Considerations:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Select appropriate weight capacity for the vehicle type</li>
                  <li>Consider legal weight limits for different routes</li>
                  <li>Heavy loads may require special permits or escorts</li>
                  <li>Factor weight restrictions for bridges and roads</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}