import React, { useState, useEffect, useRef } from 'react';
import {
  DollarSign, Plus, ArrowLeft, Upload, Search, CheckCircle, User, Phone, Calendar,
  CreditCard, Car, Gauge, Fuel, FileText, AlertCircle, X, Camera, Save,
  RefreshCw, Info, Star, TrendingUp, BarChart3, PieChart, Award, Zap
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function AddProfit() {
  const navigate = useNavigate();

  // API base URL
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // State for customers
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Form state management
  const [formData, setFormData] = useState({
    // Customer Information
    customerName: '',
    customerContact: '',
    customerId: '',

    // Investment Information
    investment: '',
    managerName: '',
    investmentDate: '',
    maturityDate: '',

    // System Information
    status: 'Active',
  });

  // UI state management
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Fetch customers from API
  const fetchCustomers = async (search = '') => {
    try {
      setLoadingCustomers(true);
      let url = `${API_BASE_URL}/customer?page=1&page_size=50`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const customersData = data.customers || data.data || data.results || [];
      setCustomers(customersData);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };
console.log(customers)
  // Fetch customers on mount and when search term changes
  useEffect(() => {
    fetchCustomers(customerSearchTerm);
  }, [customerSearchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCustomerDropdown && !event.target.closest('.customer-dropdown')) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCustomerDropdown]);

  const handleCustomerSelect = (customer) => {
    setFormData({
      ...formData,
      customerName: customer.customerName || customer.customer_name || customer.name,
      customerContact: customer.contact || customer.mobile,
      customerId: customer.id
    });
    setShowCustomerDropdown(false);
    setCustomerSearchTerm('');
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

    // Customer Information Validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerContact.trim()) {
      newErrors.customerContact = 'Customer contact is required';
    } else if (!/^(\+88|88|01)[0-9]{9}$/.test(formData.customerContact.replace(/\s+/g, ''))) {
      newErrors.customerContact = 'Please enter a valid Bangladeshi mobile number';
    }

    // Investment Information Validation
    if (!formData.investment || formData.investment <= 0) {
      newErrors.investment = 'Investment amount must be greater than 0';
    }

    if (!formData.managerName.trim()) {
      newErrors.managerName = 'Manager name is required';
    }

    // Date Validation
    if (formData.investmentDate) {
      const investmentDate = new Date(formData.investmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (investmentDate > today) {
        newErrors.investmentDate = 'Investment date cannot be in the future';
      }
    }

    if (formData.maturityDate && formData.investmentDate) {
      const maturityDate = new Date(formData.maturityDate);
      const investmentDate = new Date(formData.investmentDate);
      if (maturityDate <= investmentDate) {
        newErrors.maturityDate = 'Maturity date must be after investment date';
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
      // Prepare data for API submission
      const submitData = {
        customer_name: formData.customerName,
        customer_contact: formData.customerContact,
        customer_id: formData.customerId,
        investment: parseFloat(formData.investment),
        manager_name: formData.managerName,
        investment_date: formData.investmentDate ? `${formData.investmentDate}T00:00:00Z` : null,
        maturity_date: formData.maturityDate ? `${formData.maturityDate}T00:00:00Z` : null,
        status: formData.status,
      };

      console.log('Submitting profit data:', submitData);

      const response = await fetch(`${API_BASE_URL}/profit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Profit record added successfully:', result);

      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          customerName: '',
          customerContact: '',
          customerId: '',
          investment: '',
          managerName: '',
          investmentDate: '',
          maturityDate: '',
          status: 'Active',
        });
        setIsSuccess(false);
        navigate('/profit');
      }, 2000);

    } catch (error) {
      console.error('Error adding profit record:', error);

      // Handle different types of errors
      let errorMessage = 'Failed to add profit record. Please try again.';

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
    setFormData({
      customerName: '',
      customerContact: '',
      customerId: '',
      investment: '',
      managerName: '',
      investmentDate: '',
      maturityDate: '',
      status: 'Active',
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
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Profit Record Added Successfully!</h2>
            <p className="text-gray-600 text-lg">The new profit record has been added to the system and is ready for use.</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-gray-800">{formData.customerName}</span>
            </div>
            <p className="text-sm text-gray-600">Investment: ${parseFloat(formData.investment).toLocaleString()}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {formData.status}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Manager: {formData.managerName}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/profit"
              className="w-full block text-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 font-semibold shadow-lg"
            >
              View Profit Records
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                handleCancel();
              }}
              className="w-full block text-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
            >
              Add Another Record
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <Link
            to="/profit"
            className="flex items-center gap-3 text-white hover:text-green-200 transition-all transform hover:scale-105"
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <ArrowLeft size={20} />
            </div>
            <span className="font-medium">Back to Profit Records</span>
          </Link>
          <div className="h-8 w-px bg-gradient-to-b from-white/20 to-white/40"></div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Add New Profit Record</h1>
              <p className="text-green-100 text-sm">Create a new profit record in the system</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Form with Tabs */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Tab Navigation */}
            <div className="bg-gradient-to-r from-gray-50 to-green-50 border-b border-gray-200">
              <div className="flex">
                {[
                  { id: 'basic', label: 'Basic Information', icon: User },
                  { id: 'investment', label: 'Investment Details', icon: DollarSign },
                  { id: 'review', label: 'Review & Submit', icon: CheckCircle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-green-600 text-white shadow-lg'
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
                    <p className="text-gray-600">Enter the customer details for this profit record</p>
                  </div>

                  {/* Customer Information Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      Customer Information
                      <Info className="w-4 h-4 text-gray-400" />
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Enhanced Customer Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <User className="inline w-4 h-4 mr-2 text-green-600" />
                          Customer Name *
                        </label>
                        <div className="relative customer-dropdown">
                          <input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => {
                              setFormData({ ...formData, customerName: e.target.value });
                              setCustomerSearchTerm(e.target.value);
                              setShowCustomerDropdown(true);
                            }}
                            onFocus={() => setShowCustomerDropdown(true)}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                              errors.customerName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                            }`}
                            placeholder="Search and select customer from existing list"
                          />
                          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          {showCustomerDropdown && (
                            <div className="absolute z-20 w-full mt-2 bg-white border-2 border-green-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                              {loadingCustomers ? (
                                <div className="px-4 py-3 text-green-600 flex items-center gap-2">
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Loading customers...
                                </div>
                              ) : customers.length > 0 ? (
                                customers.map((customer) => (
                                  <div
                                    key={customer.id}
                                    onClick={() => handleCustomerSelect(customer)}
                                    className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="font-semibold text-gray-800">{customer.customerName || customer.customer_name || customer.name}</div>
                                    <div className="text-sm text-gray-500">{customer.contact || customer.mobile}</div>
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-gray-500">No customers found</div>
                              )}
                            </div>
                          )}
                        </div>
                        {errors.customerName && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.customerName}
                          </p>
                        )}
                      </div>

                      {/* Enhanced Customer Contact */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Phone className="inline w-4 h-4 mr-2 text-green-600" />
                          Customer Contact *
                        </label>
                        <input
                          type="tel"
                          name="customerContact"
                          value={formData.customerContact}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                            errors.customerContact ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                          }`}
                          placeholder="01XXXXXXXXX"
                          readOnly
                        />
                        {errors.customerContact && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.customerContact}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('investment')}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-semibold flex items-center gap-2"
                    >
                      Next: Investment Details
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'investment' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Investment Details</h3>
                    <p className="text-gray-600">Enter the investment and profit information</p>
                  </div>

                  {/* Investment Details Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      Investment Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Investment Amount */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <DollarSign className="inline w-4 h-4 mr-2 text-blue-600" />
                          Investment Amount ($) *
                        </label>
                        <input
                          type="number"
                          name="investment"
                          value={formData.investment}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.investment ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                          }`}
                          placeholder="Enter investment amount"
                          min="0"
                          step="0.01"
                        />
                        {errors.investment && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.investment}
                          </p>
                        )}
                      </div>

                      {/* Manager Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <User className="inline w-4 h-4 mr-2 text-blue-600" />
                          Manager Name *
                        </label>
                        <input
                          type="text"
                          name="managerName"
                          value={formData.managerName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                            errors.managerName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                          }`}
                          placeholder="Enter manager name"
                        />
                        {errors.managerName && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.managerName}
                          </p>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Status
                        </label>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              value="Active"
                              checked={formData.status === 'Active'}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-green-600 focus:ring-green-500"
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
                              className="h-5 w-5 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-gray-700 font-medium">Inactive</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Information Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 border border-orange-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      Date Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Investment Date */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Calendar className="inline w-4 h-4 mr-2 text-orange-600" />
                          Investment Date
                        </label>
                        <input
                          type="date"
                          name="investmentDate"
                          value={formData.investmentDate}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                            errors.investmentDate ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300'
                          }`}
                        />
                        {errors.investmentDate && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.investmentDate}
                          </p>
                        )}
                      </div>

                      {/* Maturity Date */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          <Calendar className="inline w-4 h-4 mr-2 text-orange-600" />
                          Maturity Date
                        </label>
                        <input
                          type="date"
                          name="maturityDate"
                          value={formData.maturityDate}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
                            errors.maturityDate ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300'
                          }`}
                        />
                        {errors.maturityDate && (
                          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.maturityDate}
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
                      onClick={() => setActiveTab('review')}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-semibold shadow-lg flex items-center gap-2"
                    >
                      Next: Review & Submit
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'review' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Review & Submit</h3>
                    <p className="text-gray-600">Review all information before submitting</p>
                  </div>

                  {/* Review Section */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-gray-600" />
                      Review Information
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Information Review */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-green-600" />
                          Customer Information
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">{formData.customerName || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Contact:</span>
                            <span className="font-medium">{formData.customerContact || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Investment Information Review */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-blue-600" />
                          Investment Information
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Investment:</span>
                            <span className="font-medium">${parseFloat(formData.investment || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Manager:</span>
                            <span className="font-medium">{formData.managerName || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${formData.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                              {formData.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date Information Review */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          Date Information
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Investment Date:</span>
                            <span className="font-medium">
                              {formData.investmentDate ? new Date(formData.investmentDate).toLocaleDateString() : 'Not specified'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Maturity Date:</span>
                            <span className="font-medium">
                              {formData.maturityDate ? new Date(formData.maturityDate).toLocaleDateString() : 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Summary Review */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                          Summary
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Investment Amount:</span>
                            <span className="font-medium text-green-600">
                              ${parseFloat(formData.investment || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Manager:</span>
                            <span className="font-medium text-blue-600">
                              {formData.managerName || 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('investment')}
                      className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous: Investment Details
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
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Adding Profit Record...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Add Profit Record</span>
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
                to="/profit"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold inline-flex items-center gap-2"
              >
                Cancel
              </Link>
            </div>

            {/* Enhanced Help Text */}
            <div className="mt-4 sm:mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-green-800">Important Guidelines</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-green-700">
                <div className="bg-white/50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Required Information
                  </h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Customer name and contact are mandatory</li>
                    <li>• Investment amount must be greater than 0</li>
                    <li>• Use valid Bangladeshi mobile number format</li>
                    <li>• Investment date cannot be in the future</li>
                  </ul>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Investment Guidelines
                  </h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Search and select from existing customers</li>
                    <li>• Maturity date must be after investment date</li>
                    <li>• Interest rate should be between 0-100%</li>
                    <li>• Review all information before submitting</li>
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