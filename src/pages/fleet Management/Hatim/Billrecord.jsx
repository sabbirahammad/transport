import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Save, X, Calendar, Truck, MapPin,
  DollarSign, FileText, CheckCircle,
  AlertCircle, TrendingUp, User
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function Billrecord() {
  const { category } = useParams();
  const [activeCategory, setActiveCategory] = useState(category || 'hatimPubail');
  const [formData, setFormData] = useState({
    date: '',
    vehicleNo: '',
    distributorName: '',
    destination: '',
    goods: '',
    amount: 0,
    status: 'Pending'
  });

  useEffect(() => {
    if (category && categories[category]) {
      setActiveCategory(category);
    }
  }, [category]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.vehicleNo.trim()) {
      newErrors.vehicleNo = 'Vehicle number is required';
    }

    if (!formData.distributorName.trim()) {
      newErrors.distributorName = 'Distributor name is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    // Category specific validation
    if (activeCategory === 'hatimRupganj' && !formData.goods.trim()) {
      newErrors.goods = 'Goods is required for Hatim Rupganj';
    }

    // Financial Validation
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
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
      // Here you would typically send the data to your backend
      console.log('Form Data:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          date: '',
          vehicleNo: '',
          distributorName: '',
          destination: '',
          goods: '',
          amount: 0,
          status: 'Pending'
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding bill record:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to add bill record. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      date: '',
      vehicleNo: '',
      distributorName: '',
      destination: '',
      goods: '',
      amount: 0,
      status: 'Pending'
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bill Record Added Successfully!</h2>
            <p className="text-gray-600">The new bill record has been added to the system.</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/hatimbill"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Hatim Bill
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Another Record
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categories = {
    hatimPubail: { name: 'Hatim Pubail' },
    hatimRupganj: { name: 'Hatim Rupganj' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-4 font-semibold text-sm transition-all whitespace-nowrap ${
                activeCategory === key
                  ? 'bg-blue-900 text-white border-b-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            to="/hatimbill"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Hatim Bill</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">Add New Bill Record - {categories[activeCategory].name}</h1>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Bill Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Bill Record Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new bill record</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                {/* Vehicle No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Truck className="inline w-4 h-4 mr-1" />
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehicleNo ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., DHA-1111"
                  />
                  {errors.vehicleNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleNo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Route Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Distributor Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Distributor Name *
                  </label>
                  <input
                    type="text"
                    name="distributorName"
                    value={formData.distributorName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.distributorName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Pubail Distributor Ltd"
                  />
                  {errors.distributorName && (
                    <p className="mt-1 text-sm text-red-600">{errors.distributorName}</p>
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
                    placeholder="e.g., Chittagong"
                  />
                  {errors.destination && (
                    <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Goods - only for hatimRupganj */}
                {activeCategory === 'hatimRupganj' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="inline w-4 h-4 mr-1" />
                      Goods
                    </label>
                    <input
                      type="text"
                      name="goods"
                      value={formData.goods}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Electronics"
                    />
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Amount */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.amount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 15000"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Error Display */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
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
                    <span>Adding Record...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Add Record</span>
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
                to="/hatimbill"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <X size={18} />
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
                  <li>Basic details: Date, vehicle number, distributor name, destination</li>
                  <li>Financial details: Amount is required</li>
                </ul>
              </div>
              <div>
                <strong>Bill Calculations:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Ensure amount is entered correctly</li>
                  <li>Status indicates whether the bill is pending or completed</li>
                  <li>Goods field is optional for additional details</li>
                </ul>
              </div>
              <div>
                <strong>Route Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Specify accurate distributor and destination</li>
                  <li>Vehicle number helps track the specific vehicle</li>
                  <li>Date represents the bill generation or trip date</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}