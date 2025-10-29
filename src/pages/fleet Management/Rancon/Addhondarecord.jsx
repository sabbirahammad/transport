import React, { useState } from 'react';
import {
  ArrowLeft, Save, X, Calendar, Truck, MapPin,
  DollarSign, FileText, CheckCircle,
  AlertCircle, TrendingUp, User, Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Addhondarecord() {
  const [formData, setFormData] = useState({
    date: '',
    vehicleNo: '',
    dealerName: '',
    doSL: '',
    coU: '',
    destination: '',
    bikeQty: 0,
    unloadCharge: 0,
    vehicleRentWithVATTax: 0,
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
    if (['unloadCharge', 'vehicleRentWithVATTax'].includes(name)) {
      const unload = parseFloat(formData.unloadCharge) || 0;
      const rent = parseFloat(formData.vehicleRentWithVATTax) || 0;
      const total = unload + rent;
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

    if (!formData.dealerName.trim()) {
      newErrors.dealerName = 'Dealer name is required';
    }

    if (!formData.doSL.trim()) {
      newErrors.doSL = 'DO (SL) is required';
    }

    if (!formData.coU.trim()) {
      newErrors.coU = 'CO (U) is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    // Financial Validation
    if (!formData.bikeQty || formData.bikeQty <= 0) {
      newErrors.bikeQty = 'Bike quantity must be greater than 0';
    }

    if (formData.unloadCharge < 0) {
      newErrors.unloadCharge = 'Unload charge must be 0 or greater';
    }

    if (formData.vehicleRentWithVATTax < 0) {
      newErrors.vehicleRentWithVATTax = 'Vehicle rent must be 0 or greater';
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
          dealerName: '',
          doSL: '',
          coU: '',
          destination: '',
          bikeQty: 0,
          unloadCharge: 0,
          vehicleRentWithVATTax: 0,
          totalAmount: 0
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding Honda record:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to add Honda record. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      date: '',
      vehicleNo: '',
      dealerName: '',
      doSL: '',
      coU: '',
      destination: '',
      bikeQty: 0,
      unloadCharge: 0,
      vehicleRentWithVATTax: 0,
      totalAmount: 0
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center transform transition-all duration-300 scale-100">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Honda Record Added Successfully!</h2>
            <p className="text-gray-600 text-lg">The new Honda record has been added to the system.</p>
          </div>
          <div className="space-y-4">
            <Link
              to="/honda/honda"
              className="w-full block text-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              Back to Suzuki Honda
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full block text-center px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              Add Another Record
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-8 py-6 shadow-xl">
        <div className="flex items-center gap-6">
          <Link
            to="/honda/honda"
            className="flex items-center gap-3 text-white hover:text-blue-200 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">Back to Suzuki Honda</span>
          </Link>
          <div className="h-8 w-px bg-blue-300"></div>
          <h1 className="text-white text-2xl font-semibold">Add New Honda Record</h1>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Honda Information Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Honda Record Information</h2>
                <p className="text-gray-600 text-lg">Fill in the details below to add a new Honda record</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transform transition-all duration-300 hover:shadow-xl">
            {/* Basic Information Section */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Vehicle No */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    Vehicle No *
                  </label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 ${
                      errors.vehicleNo ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., DHA-1234"
                  />
                  {errors.vehicleNo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.vehicleNo}
                    </p>
                  )}
                </div>

                {/* Dealer Name */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Dealer Name *
                  </label>
                  <input
                    type="text"
                    name="dealerName"
                    value={formData.dealerName}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 ${
                      errors.dealerName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Rahman Motors"
                  />
                  {errors.dealerName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.dealerName}
                    </p>
                  )}
                </div>

                {/* DO (SL) */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    DO (SL) *
                  </label>
                  <input
                    type="text"
                    name="doSL"
                    value={formData.doSL}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 ${
                      errors.doSL ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., DO-001"
                  />
                  {errors.doSL && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.doSL}
                    </p>
                  )}
                </div>

                {/* CO (U) */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    CO (U) *
                  </label>
                  <input
                    type="text"
                    name="coU"
                    value={formData.coU}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 ${
                      errors.coU ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., CO-101"
                  />
                  {errors.coU && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.coU}
                    </p>
                  )}
                </div>

                {/* Destination */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 ${
                      errors.destination ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Chittagong"
                  />
                  {errors.destination && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.destination}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-blue-600" />
                Vehicle Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bike Qty */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Bike Qty *
                  </label>
                  <input
                    type="number"
                    name="bikeQty"
                    value={formData.bikeQty}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 ${
                      errors.bikeQty ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 25"
                  />
                  {errors.bikeQty && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.bikeQty}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Unload Charge */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Unload Charge
                  </label>
                  <input
                    type="number"
                    name="unloadCharge"
                    value={formData.unloadCharge}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 ${
                      errors.unloadCharge ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 5000"
                  />
                  {errors.unloadCharge && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.unloadCharge}
                    </p>
                  )}
                </div>

                {/* Vehicle Rent with VAT+Tax */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Vehicle Rent (with VAT+Tax)
                  </label>
                  <input
                    type="number"
                    name="vehicleRentWithVATTax"
                    value={formData.vehicleRentWithVATTax}
                    onChange={handleInputChange}
                    className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400 ${
                      errors.vehicleRentWithVATTax ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 22000"
                  />
                  {errors.vehicleRentWithVATTax && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.vehicleRentWithVATTax}
                    </p>
                  )}
                </div>

                {/* Total Amount */}
                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Total Amount (Auto-calculated)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    readOnly
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Submit Error Display */}
            {errors.submit && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{errors.submit}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-6 mt-10 pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-medium ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Record...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Add Record</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Clear Form
              </button>

              <Link
                to="/honda/honda"
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 inline-flex items-center gap-2 font-medium"
              >
                <X size={20} />
                Cancel
              </Link>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Important Notes:</h3>
            <div className="text-sm text-blue-700 space-y-3">
              <div>
                <strong>Required Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                  <li>All fields marked with * are mandatory</li>
                  <li>Basic details: Date, vehicle no, dealer name, DO (SL), CO (U), destination</li>
                  <li>Vehicle details: Bike quantity is required</li>
                  <li>Financial details: Unload charge and vehicle rent are optional but recommended</li>
                </ul>
              </div>
              <div>
                <strong>Financial Calculations:</strong>
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                  <li>Total amount is automatically calculated from unload charge and vehicle rent</li>
                  <li>Ensure all amounts are entered correctly</li>
                  <li>Vehicle rent includes VAT and tax as per the field name</li>
                </ul>
              </div>
              <div>
                <strong>Record Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                  <li>Specify accurate dealer and destination details</li>
                  <li>DO (SL) and CO (U) are unique identifiers for the record</li>
                  <li>Bike quantity helps track the number of units transported</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}