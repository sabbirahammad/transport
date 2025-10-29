import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Save, X, Calendar, Package, MapPin,
  Truck, FileText, CheckCircle,
  AlertCircle, TrendingUp, User, Hash, Weight
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function AciBillrecord() {
  const { category } = useParams();
  const [activeCategory, setActiveCategory] = useState(category || 'motorcycle');
  const [formData, setFormData] = useState({
    date: '',
    product: '',
    portfolio: '',
    truckNumber: '',
    challanNo: '',
    from: '',
    destination: '',
    quantity: 0,
    bodyFare: 0,
    fuelCost: 0
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Category names mapping
  const categoryNames = {
    motorcycle: 'Motorcycle',
    music: 'Music',
    tyre: 'Tyre',
    yamaha: 'Yamaha Lube & Parts',
    tractor: 'Tractor',
    harvester: 'Harvester',
    spanner: 'Spanner & Wrench',
    extraBill: 'Extra Bill'
  };

  useEffect(() => {
    if (category && categoryNames[category]) {
      setActiveCategory(category);
    }
  }, [category]);

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

    if (!formData.product.trim()) {
      newErrors.product = 'Product is required';
    }

    if (!formData.portfolio.trim()) {
      newErrors.portfolio = 'Portfolio is required';
    }

    if (!formData.truckNumber.trim()) {
      newErrors.truckNumber = 'Truck number is required';
    }

    if (!formData.challanNo.trim()) {
      newErrors.challanNo = 'Challan number is required';
    }

    if (!formData.from.trim()) {
      newErrors.from = 'From location is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    // Trip Details Validation
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    // Financial Validation
    if (!formData.bodyFare || formData.bodyFare <= 0) {
      newErrors.bodyFare = 'Body fare must be greater than 0';
    }

    if (formData.fuelCost < 0) {
      newErrors.fuelCost = 'Fuel cost must be 0 or greater';
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
          product: '',
          portfolio: '',
          truckNumber: '',
          challanNo: '',
          from: '',
          destination: '',
          quantity: 0,
          bodyFare: 0,
          fuelCost: 0
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
      product: '',
      portfolio: '',
      truckNumber: '',
      challanNo: '',
      from: '',
      destination: '',
      quantity: 0,
      bodyFare: 0,
      fuelCost: 0
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bill Record Added Successfully!</h2>
            <p className="text-gray-600">The new bill record has been added to the system.</p>
          </div>
          <div className="space-y-3">
            <Link
              to={`/brand/aci/bill/${activeCategory}`}
              className="w-full block text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Back to ACI Bill
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full block text-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Add Another Record
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-8 py-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <Link
            to={`/brand/aci/bill/${activeCategory}`}
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            <span>Back to ACI Bill</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-2xl font-bold">Add New {categoryNames[activeCategory]} Bill Record</h1>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Bill Information Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 transform transition-all duration-300 hover:shadow-3xl">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-12 h-12 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Bill Record Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new bill record for {categoryNames[activeCategory]}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
            {/* Basic Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="inline w-4 h-4 mr-2 text-blue-600" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Product */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Package className="inline w-4 h-4 mr-2 text-blue-600" />
                    Product *
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.product ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                    placeholder="e.g., Honda CB150R"
                  />
                  {errors.product && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.product}
                    </p>
                  )}
                </div>

                {/* Portfolio */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <TrendingUp className="inline w-4 h-4 mr-2 text-blue-600" />
                    Portfolio *
                  </label>
                  <input
                    type="text"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.portfolio ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                    placeholder="e.g., Sports Bike"
                  />
                  {errors.portfolio && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.portfolio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Route Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Route Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="inline w-4 h-4 mr-2 text-green-600" />
                    From *
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                      errors.from ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                    }`}
                    placeholder="e.g., Dhaka"
                  />
                  {errors.from && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.from}
                    </p>
                  )}
                </div>

                {/* Destination */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="inline w-4 h-4 mr-2 text-green-600" />
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                      errors.destination ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
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

                {/* Truck Number */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Truck className="inline w-4 h-4 mr-2 text-green-600" />
                    Truck Number *
                  </label>
                  <input
                    type="text"
                    name="truckNumber"
                    value={formData.truckNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                      errors.truckNumber ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                    }`}
                    placeholder="e.g., DHK-METRO-1234"
                  />
                  {errors.truckNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.truckNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Details Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Trip Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Challan No */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Hash className="inline w-4 h-4 mr-2 text-purple-600" />
                    Challan No *
                  </label>
                  <input
                    type="text"
                    name="challanNo"
                    value={formData.challanNo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.challanNo ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                    }`}
                    placeholder="e.g., CH-2024-001"
                  />
                  {errors.challanNo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.challanNo}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Weight className="inline w-4 h-4 mr-2 text-purple-600" />
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                      errors.quantity ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-purple-300'
                    }`}
                    placeholder="e.g., 25"
                  />
                  {errors.quantity && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.quantity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Financial Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Body Fare */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <TrendingUp className="inline w-4 h-4 mr-2 text-orange-600" />
                    Body Fare *
                  </label>
                  <input
                    type="number"
                    name="bodyFare"
                    value={formData.bodyFare}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                      errors.bodyFare ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300'
                    }`}
                    placeholder="e.g., 15000"
                  />
                  {errors.bodyFare && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.bodyFare}
                    </p>
                  )}
                </div>

                {/* Fuel Cost */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <TrendingUp className="inline w-4 h-4 mr-2 text-orange-600" />
                    Fuel Cost
                  </label>
                  <input
                    type="number"
                    name="fuelCost"
                    value={formData.fuelCost}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                      errors.fuelCost ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300'
                    }`}
                    placeholder="e.g., 3000"
                  />
                  {errors.fuelCost && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.fuelCost}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Error Display */}
            {errors.submit && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
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
            <div className="flex gap-4 mt-10 pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-300 font-semibold ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105'
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
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
              >
                Clear Form
              </button>

              <Link
                to={`/brand/aci/bill/${activeCategory}`}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold inline-flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </Link>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Important Notes:</h3>
            <div className="text-sm text-blue-700 space-y-3">
              <div>
                <strong>Required Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                  <li>All fields marked with * are mandatory</li>
                  <li>Basic details: Date, product, portfolio, truck number, challan number</li>
                  <li>Route details: From and destination locations</li>
                  <li>Trip details: Quantity of items</li>
                  <li>Financial details: Body fare is required, fuel cost optional</li>
                </ul>
              </div>
              <div>
                <strong>Financial Calculations:</strong>
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                  <li>Ensure all amounts are entered correctly</li>
                  <li>Body fare represents the main transportation cost</li>
                  <li>Fuel cost is additional and optional</li>
                  <li>Quantity affects the total transportation requirements</li>
                </ul>
              </div>
              <div>
                <strong>Category Specific:</strong>
                <ul className="list-disc list-inside ml-2 mt-2 space-y-1">
                  <li>This form is specific to {categoryNames[activeCategory]} category</li>
                  <li>Product and portfolio should match the selected category</li>
                  <li>Challan number must be unique for each bill record</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}