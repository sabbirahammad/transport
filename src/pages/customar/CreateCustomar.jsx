import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AddCustomer() {
  const navigate = useNavigate();

  // API Configuration - Update this URL to match your backend server
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1/customer';
  // Alternative URLs to try if above doesn't work:
  // const API_BASE_URL = 'http://localhost:8080/api/v1/customer';
  // const API_BASE_URL = 'http://127.0.0.1:8080/api/v1/customer';

  // Quick CORS fix for development - Install browser extension:
  // https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelclofddfdlhnmhfkomi

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    mobile: '',
    email: '',
    address: '',
    openingBalance: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile is required';
    } else if (!/^01[0-9]{9}$/.test(formData.mobile.replace(/-/g, ''))) {
      newErrors.mobile = 'Invalid mobile number format (use 01XXXXXXXXX)';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.openingBalance) {
      newErrors.openingBalance = 'Opening balance is required';
    } else if (isNaN(formData.openingBalance) || Number(formData.openingBalance) < 0) {
      newErrors.openingBalance = 'Invalid amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      setDebugInfo('');

      try {
        // Prepare data for API - Match your Go struct exactly
        const customerData = {
          date: formData.date,
          customer_name: formData.customerName.trim(),
          mobile: formData.mobile.trim(),
          email: formData.email.trim() || '',
          address: formData.address.trim(),
          opening_balance: formData.openingBalance.toString(),
          status: formData.status
        };

        const debugMsg = `Sending to: ${API_BASE_URL}\nData: ${JSON.stringify(customerData, null, 2)}`;
        console.log('🔍 DEBUG:', debugMsg);
        setDebugInfo(debugMsg);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(customerData),
          signal: controller.signal,
          credentials: 'omit' // Don't send cookies
        });

        clearTimeout(timeoutId);

        console.log('✅ Response Status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error Response:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Success Response:', result);

        // Success - reset form and navigate
        setFormData({
          date: new Date().toISOString().split('T')[0],
          customerName: '',
          mobile: '',
          email: '',
          address: '',
          openingBalance: '',
          status: 'Active'
        });
        setErrors({});

        alert('✅ Customer added successfully!');
        navigate('/customer');

      } catch (error) {
        console.error('❌ API Error:', error);

        let errorMsg = '';

        if (error.name === 'AbortError') {
          errorMsg = '⏱️ Request timeout (10s). Backend server not responding.\n\nCheck if:\n1. Backend server is running\n2. Correct IP/Port: ' + API_BASE_URL;
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMsg = '🌐 Network Error - Cannot reach backend server\n\nTroubleshooting:\n1. Is backend running? npm start\n2. Check IP address (try localhost if on same machine)\n3. Backend must have CORS enabled\n\nAPI Endpoint: ' + API_BASE_URL;
        } else {
          errorMsg = '❌ Error: ' + error.message;
        }

        setSubmitError(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Customer Information</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse"></div>
                  API: {API_BASE_URL.split('/').pop()}
                </div>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-8">
            {/* Row 1 - Date, Name, Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  className={`w-full px-4 py-2.5 border ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="01700000000"
                  className={`w-full px-4 py-2.5 border ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>
            </div>

            {/* Row 2 - Email, Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className={`w-full px-4 py-2.5 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className={`w-full px-4 py-2.5 border ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Row 3 - Opening Balance, Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Opening Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Balance <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="openingBalance"
                  value={formData.openingBalance}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-4 py-2.5 border ${
                    errors.openingBalance ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.openingBalance && (
                  <p className="text-red-500 text-xs mt-1">{errors.openingBalance}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Debug Info */}
            {debugInfo && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600 text-xs font-mono whitespace-pre-wrap">{debugInfo}</p>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm whitespace-pre-wrap font-mono">{submitError}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 font-medium rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:from-blue-800 hover:to-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
              <button
                onClick={() => navigate('/customer')}
                disabled={isSubmitting}
                className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}