import React, { useState } from 'react';
import {
  ArrowLeft, Save, X, Calendar, Truck, MapPin,
  Package, DollarSign, FileText, CheckCircle,
  AlertCircle, TrendingUp, Weight, User
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddTripName() {
  const [formData, setFormData] = useState({
    date: '',
    cash: 0,
    destination: '',
    vehicleNo: '',
    driverName: '',
    totalRate: 0,
    advance: 0,
    due: 0,
    total: 0,
    profit: 0
  });

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

    if (!formData.cash || formData.cash <= 0) {
      newErrors.cash = 'Cash must be greater than 0';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.vehicleNo.trim()) {
      newErrors.vehicleNo = 'Vehicle number is required';
    }

    if (!formData.driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }

    // Financial Validation
    if (!formData.totalRate || formData.totalRate <= 0) {
      newErrors.totalRate = 'Total rate must be greater than 0';
    }

    if (!formData.advance || formData.advance < 0) {
      newErrors.advance = 'Advance amount is required';
    }

    if (!formData.due || formData.due < 0) {
      newErrors.due = 'Due amount is required';
    }

    if (!formData.total || formData.total <= 0) {
      newErrors.total = 'Total amount must be greater than 0';
    }

    if (!formData.profit || formData.profit < 0) {
      newErrors.profit = 'Profit amount is required';
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
          cash: 0,
          destination: '',
          vehicleNo: '',
          driverName: '',
          totalRate: 0,
          advance: 0,
          due: 0,
          total: 0,
          profit: 0
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding trip:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to add trip. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      date: '',
      cash: 0,
      destination: '',
      vehicleNo: '',
      driverName: '',
      totalRate: 0,
      advance: 0,
      due: 0,
      total: 0,
      profit: 0
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Added Successfully!</h2>
            <p className="text-gray-600">The new trip has been added to the system.</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/mahindra"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Trip List
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Another Trip
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
            to="/mahindra"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Trip List</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">Add New Trip</h1>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Trip Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Truck className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Trip Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new trip record</p>
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
                    Trip Date *
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

                {/* Cash */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Cash *
                  </label>
                  <input
                    type="number"
                    name="cash"
                    value={formData.cash}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cash ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 5000"
                  />
                  {errors.cash && (
                    <p className="mt-1 text-sm text-red-600">{errors.cash}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Route Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="e.g., Dhaka"
                  />
                  {errors.destination && (
                    <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
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

            {/* Driver Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Driver Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.driverName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., John Doe"
                  />
                  {errors.driverName && (
                    <p className="mt-1 text-sm text-red-600">{errors.driverName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Total Rate *
                  </label>
                  <input
                    type="number"
                    name="totalRate"
                    value={formData.totalRate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.totalRate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 15000"
                  />
                  {errors.totalRate && (
                    <p className="mt-1 text-sm text-red-600">{errors.totalRate}</p>
                  )}
                </div>

                {/* Advance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Advance Amount *
                  </label>
                  <input
                    type="number"
                    name="advance"
                    value={formData.advance}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.advance ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 2000"
                  />
                  {errors.advance && (
                    <p className="mt-1 text-sm text-red-600">{errors.advance}</p>
                  )}
                </div>

                {/* Due */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Due Amount *
                  </label>
                  <input
                    type="number"
                    name="due"
                    value={formData.due}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.due ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 13000"
                  />
                  {errors.due && (
                    <p className="mt-1 text-sm text-red-600">{errors.due}</p>
                  )}
                </div>

                {/* Total */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Total Amount *
                  </label>
                  <input
                    type="number"
                    name="total"
                    value={formData.total}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.total ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 15000"
                  />
                  {errors.total && (
                    <p className="mt-1 text-sm text-red-600">{errors.total}</p>
                  )}
                </div>

                {/* Profit */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    Profit *
                  </label>
                  <input
                    type="number"
                    name="profit"
                    value={formData.profit}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.profit ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 2000"
                  />
                  {errors.profit && (
                    <p className="mt-1 text-sm text-red-600">{errors.profit}</p>
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
                    <span>Adding Trip...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Add Trip</span>
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
                to="/mahindra"
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
                  <li>Trip details: Date, cash, destination, vehicle number, driver name</li>
                  <li>Financial details: Total rate, advance, due, total, and profit</li>
                </ul>
              </div>
              <div>
                <strong>Financial Calculations:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Ensure all amounts are entered correctly</li>
                  <li>Advance and due should relate to the total rate</li>
                  <li>Profit is calculated based on the total and costs</li>
                </ul>
              </div>
              <div>
                <strong>Route and Driver Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Specify accurate destination and vehicle details</li>
                  <li>Driver name is required for record keeping</li>
                  <li>Vehicle number should match the fleet records</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}