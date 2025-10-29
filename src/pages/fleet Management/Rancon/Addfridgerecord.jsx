import React, { useState } from 'react';
import {
  ArrowLeft, Save, X, Calendar, Truck, MapPin,
  DollarSign, FileText, CheckCircle,
  AlertCircle, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Addfridgerecord() {
  const [formData, setFormData] = useState({
    date: '',
    vehicleNo: '',
    from: '',
    destinations: '',
    vehicleSize: '',
    vehicleRent: 0,
    dropping: 0,
    alt5: 0,
    vat10: 0,
    totalAmount: 0
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

    // Auto-calculate total amount
    if (['vehicleRent', 'dropping', 'alt5', 'vat10'].includes(name)) {
      const rent = parseFloat(formData.vehicleRent) || 0;
      const drop = parseFloat(formData.dropping) || 0;
      const alt = parseFloat(formData.alt5) || 0;
      const vat = parseFloat(formData.vat10) || 0;
      const total = rent + drop + alt + vat;
      setFormData(prev => ({ ...prev, totalAmount: total }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic Information Validation
    if (!formData.date.trim()) {
      newErrors.date = 'Date is required';
    }

    if (!formData.vehicleNo.trim()) {
      newErrors.vehicleNo = 'Vehicle number is required';
    }

    if (!formData.from.trim()) {
      newErrors.from = 'From location is required';
    }

    if (!formData.destinations.trim()) {
      newErrors.destinations = 'Destinations are required';
    }

    if (!formData.vehicleSize.trim()) {
      newErrors.vehicleSize = 'Vehicle size is required';
    }

    // Financial Validation
    if (!formData.vehicleRent || formData.vehicleRent <= 0) {
      newErrors.vehicleRent = 'Vehicle rent must be greater than 0';
    }

    if (formData.dropping < 0) {
      newErrors.dropping = 'Dropping must be 0 or greater';
    }

    if (formData.alt5 < 0) {
      newErrors.alt5 = '5% ALT must be 0 or greater';
    }

    if (formData.vat10 < 0) {
      newErrors.vat10 = '10% VAT must be 0 or greater';
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
          from: '',
          destinations: '',
          vehicleSize: '',
          vehicleRent: 0,
          dropping: 0,
          alt5: 0,
          vat10: 0,
          totalAmount: 0
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding fridge record:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to add fridge record. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      date: '',
      vehicleNo: '',
      from: '',
      destinations: '',
      vehicleSize: '',
      vehicleRent: 0,
      dropping: 0,
      alt5: 0,
      vat10: 0,
      totalAmount: 0
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Fridge Record Added Successfully!</h2>
            <p className="text-gray-600">The new fridge record has been added to the system.</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/sujukibill"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Suzuki Bill
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            to="/sujukibill"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Suzuki Bill</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">Add New Fridge Record</h1>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Fridge Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Fridge Record Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new fridge record</p>
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
                    Vehicle No *
                  </label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehicleNo ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., DHA-1234"
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
                {/* From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    From *
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.from ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Dhaka"
                  />
                  {errors.from && (
                    <p className="mt-1 text-sm text-red-600">{errors.from}</p>
                  )}
                </div>

                {/* Destinations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Destinations *
                  </label>
                  <input
                    type="text"
                    name="destinations"
                    value={formData.destinations}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.destinations ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Chittagong"
                  />
                  {errors.destinations && (
                    <p className="mt-1 text-sm text-red-600">{errors.destinations}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Size *
                  </label>
                  <select
                    name="vehicleSize"
                    value={formData.vehicleSize}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehicleSize ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                  {errors.vehicleSize && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleSize}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Rent */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Vehicle Rent *
                  </label>
                  <input
                    type="number"
                    name="vehicleRent"
                    value={formData.vehicleRent}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehicleRent ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 15000"
                  />
                  {errors.vehicleRent && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleRent}</p>
                  )}
                </div>

                {/* Dropping */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Dropping
                  </label>
                  <input
                    type="number"
                    name="dropping"
                    value={formData.dropping}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dropping ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 2000"
                  />
                  {errors.dropping && (
                    <p className="mt-1 text-sm text-red-600">{errors.dropping}</p>
                  )}
                </div>

                {/* 5% ALT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    5% ALT
                  </label>
                  <input
                    type="number"
                    name="alt5"
                    value={formData.alt5}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.alt5 ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 750"
                  />
                  {errors.alt5 && (
                    <p className="mt-1 text-sm text-red-600">{errors.alt5}</p>
                  )}
                </div>

                {/* 10% VAT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    10% VAT
                  </label>
                  <input
                    type="number"
                    name="vat10"
                    value={formData.vat10}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vat10 ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 1500"
                  />
                  {errors.vat10 && (
                    <p className="mt-1 text-sm text-red-600">{errors.vat10}</p>
                  )}
                </div>

                {/* Total Amount */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    Total Amount (Auto-calculated)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
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
                to="/sujukibill"
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
                  <li>Basic details: Date, vehicle no, from, destinations, vehicle size</li>
                  <li>Financial details: Vehicle rent is required, others optional</li>
                </ul>
              </div>
              <div>
                <strong>Financial Calculations:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Total amount is automatically calculated</li>
                  <li>Ensure all amounts are entered correctly</li>
                  <li>Vehicle rent represents the base rental cost</li>
                  <li>Dropping, ALT, and VAT are additional charges</li>
                </ul>
              </div>
              <div>
                <strong>Route Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Specify accurate from and destination locations</li>
                  <li>Vehicle size helps categorize the rental</li>
                  <li>Vehicle number is unique for each record</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}