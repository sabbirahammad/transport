import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Save, X, Calendar, Truck, MapPin,
  DollarSign, FileText, CheckCircle,
  AlertCircle, TrendingUp, User, Package, Settings
} from 'lucide-react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CustomBillRecord({
  selectedFields = [],
  onClose,
  onSubmit,
  productName,
  customer,
  productId
}) {
  const { id: customerId } = useParams(); // Get customer ID from URL params
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get data from navigation state
  const billId = location.state?.billId;
  const stateProductId = location.state?.productId;
  const stateProductName = location.state?.productName;
  const stateCustomer = location.state?.selectedCustomer;
  const billData = location.state?.billData;

  // Use props if provided, otherwise fall back to state
  const currentProductId = productId || stateProductId;
  const currentProductName = productName || stateProductName;
  const currentCustomer = customer || stateCustomer;
console.log(customerId)
  // All possible fields definition (matching Go struct)
  const allFields = [
    { key: 'product_id', label: 'Product ID', type: 'number', required: true, section: 'basic' },
    { key: 'category', label: 'Category', type: 'text', section: 'basic' },
    { key: 'vehicle_no', label: 'Vehicle No', type: 'text', section: 'basic' },
    { key: 'customer_name', label: 'Customer Name', type: 'text', section: 'basic' },
    { key: 'challan_no', label: 'Challan No', type: 'text', section: 'basic' },
    { key: 'distributor_name', label: 'Distributor Name', type: 'text', section: 'basic' },
    { key: 'dealer_name', label: 'Dealer Name', type: 'text', section: 'basic' },
    { key: 'driver_name', label: 'Driver Name', type: 'text', section: 'basic' },
    { key: 'from_location', label: 'From Location', type: 'text', section: 'route' },
    { key: 'destination', label: 'Destination', type: 'text', section: 'route' },
    { key: 'product', label: 'Product', type: 'text', section: 'cargo' },
    { key: 'portfolio', label: 'Portfolio', type: 'text', section: 'cargo' },
    { key: 'goods', label: 'Goods', type: 'text', section: 'cargo' },
    { key: 'quantity', label: 'Quantity', type: 'number', section: 'cargo' },
    { key: 'bike_qty', label: 'Bike Qty', type: 'number', section: 'cargo' },
    { key: 'vehicle_size', label: 'Vehicle Size', type: 'text', section: 'cargo' },
    { key: 'status', label: 'Status', type: 'text', section: 'cargo' },
    { key: 'unload_charge', label: 'Unload Charge', type: 'number', section: 'financial' },
    { key: 'vehicle_rent_with_vat_tax', label: 'Vehicle Rent with VAT Tax', type: 'number', section: 'financial' },
    { key: 'vehicle_rent', label: 'Vehicle Rent', type: 'number', section: 'financial' },
    { key: 'dropping', label: 'Dropping', type: 'number', section: 'financial' },
    { key: 'alt5', label: 'Alt5', type: 'number', section: 'financial' },
    { key: 'vat10', label: 'VAT 10%', type: 'number', section: 'financial' },
    { key: 'total_rate', label: 'Total Rate', type: 'number', section: 'financial' },
    { key: 'advance', label: 'Advance', type: 'number', section: 'financial' },
    { key: 'due', label: 'Due', type: 'number', section: 'financial' },
    { key: 'total', label: 'Total', type: 'number', section: 'financial' },
    { key: 'profit', label: 'Profit', type: 'number', section: 'financial' },
    { key: 'body_fare', label: 'Body Fare', type: 'number', section: 'financial' },
    { key: 'fuel_cost', label: 'Fuel Cost', type: 'number', section: 'financial' },
    { key: 'amount', label: 'Amount', type: 'number', section: 'financial' },
    { key: 'total_amount', label: 'Total Amount', type: 'number', section: 'financial' },
    { key: 'do_number', label: 'DO Number', type: 'text', section: 'documents' },
    { key: 'co_number', label: 'CO Number', type: 'text', section: 'documents' }
  ];

  // Get valid selected fields with labels and types
  const validSelectedFields = selectedFields.length > 0
    ? selectedFields.map(fieldKey => {
        const field = allFields.find(f => f.key === fieldKey);
        if (field) return field;
        return { key: fieldKey, label: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1), type: 'text', section: 'basic' };
      }).filter(Boolean)
    : allFields.filter(field => field.key !== 'id'); // Exclude id field

  // Group fields by section
  const groupedFields = validSelectedFields.reduce((acc, field) => {
    const section = field.section || 'basic';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {});

  // Section titles
  const sectionTitles = {
    basic: 'Basic Information',
    route: 'Route Information',
    cargo: 'Cargo Details',
    financial: 'Financial Information',
    documents: 'Documents'
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

  const validateForm = () => {
    const newErrors = {};

    // Validation - check required fields
    validSelectedFields.forEach(field => {
      const value = formData[field.key];
      if (field.required) {
        if (!value || value.trim() === '') {
          newErrors[field.key] = `${field.label} is required`;
        }
      }
      if (field.type === 'number' && value !== undefined && value !== '' && isNaN(Number(value))) {
        newErrors[field.key] = `${field.label} must be a valid number`;
      }
    });

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
      // Prepare the data for submission - format according to Go struct
      const payload = {};

      // Always include product_id as required field
      payload.product_id = Number(customerId);

      // Map form fields to Go struct fields
      validSelectedFields.forEach(field => {
        const value = formData[field.key];
        if (field.type === 'number' && value !== undefined && value !== '') {
          payload[field.key] = Number(value);
        } else if (value !== undefined && value !== '') {
          payload[field.key] = value;
        } else {
          // Set optional fields to null if empty
          payload[field.key] = null;
        }
      });

      console.log('Submitting payload:', payload);

      // Send POST request to backend API
      const response = await axios.post('http://192.168.0.106:8080/api/v1/bills', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Bill created successfully:', response.data);
      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({});
        setIsSuccess(false);
        // Navigate back to bill list instead of calling onClose
        navigate(`/customer/${customerId}/custom-bill-list`);
      }, 2000);

    } catch (error) {
      console.error('Error creating bill:', error);
      console.error('Error response:', error.response?.data);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || error.response?.data?.error || 'Failed to create bill. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setErrors({});
  };

  const getIconForField = (fieldKey) => {
    if (fieldKey.includes('amount') || fieldKey.includes('rate') || fieldKey.includes('rent') || fieldKey.includes('charge') || fieldKey.includes('fare') || fieldKey.includes('cost') || fieldKey.includes('vat') || fieldKey.includes('alt') || fieldKey.includes('dropping') || fieldKey.includes('advance') || fieldKey.includes('due') || fieldKey.includes('total') || fieldKey.includes('profit')) {
      return <DollarSign className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('vehicle')) {
      return <Truck className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('destination') || fieldKey.includes('from_location')) {
      return <MapPin className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('date')) {
      return <Calendar className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('driver') || fieldKey.includes('customer') || fieldKey.includes('dealer') || fieldKey.includes('distributor')) {
      return <User className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('product') || fieldKey.includes('goods') || fieldKey.includes('portfolio') || fieldKey.includes('quantity') || fieldKey.includes('bike_qty') || fieldKey.includes('vehicle_size')) {
      return <Package className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('do_number') || fieldKey.includes('co_number') || fieldKey.includes('challan_no')) {
      return <FileText className="inline w-4 h-4 mr-1" />;
    }
    return <Settings className="inline w-4 h-4 mr-1" />;
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
            {onClose ? (
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            ) : (
              <Link
                to={`/customer/${customerId}/custom-bill-list`}
                className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Bill List
              </Link>
            )}
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
          {onClose ? (
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Custom Bill List</span>
            </button>
          ) : (
            <Link
              to={`/customer/${customerId}/custom-bill-list`}
              className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Custom Bill List</span>
            </Link>
          )}
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">Add New Custom Bill Record</h1>
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
                <h2 className="text-xl font-bold text-gray-800">Custom Bill Record Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new bill record</p>
                {currentCustomer && (
                  <p className="text-sm text-gray-500 mt-1">Customer: {currentCustomer.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {/* Basic Information Section */}
            {groupedFields.basic && groupedFields.basic.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedFields.basic.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getIconForField(field.key)}
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[field.key] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                      {errors[field.key] && (
                        <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Route Information Section */}
            {groupedFields.route && groupedFields.route.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedFields.route.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getIconForField(field.key)}
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[field.key] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                      {errors[field.key] && (
                        <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cargo Details Section */}
            {groupedFields.cargo && groupedFields.cargo.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cargo Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedFields.cargo.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getIconForField(field.key)}
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[field.key] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                      {errors[field.key] && (
                        <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Information Section */}
            {groupedFields.financial && groupedFields.financial.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedFields.financial.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getIconForField(field.key)}
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[field.key] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                      {errors[field.key] && (
                        <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Section */}
            {groupedFields.documents && groupedFields.documents.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedFields.documents.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {getIconForField(field.key)}
                        {field.label} {field.required ? '*' : ''}
                      </label>
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[field.key] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                      {errors[field.key] && (
                        <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                    <span>Creating Bill...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Create Bill</span>
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

              {onClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              ) : (
                <Link
                  to={`/customer/${customerId}/custom-bill-list`}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </Link>
              )}
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Important Notes:</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <div>
                <strong>Required Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Fields marked with * are mandatory (Product ID is required)</li>
                  <li>Fill in all relevant details for accurate record keeping</li>
                </ul>
              </div>
              <div>
                <strong>Data Types:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Use appropriate formats for numbers</li>
                  <li>Financial fields accept numeric values only</li>
                </ul>
              </div>
              <div>
                <strong>API Integration:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Data will be sent to the backend API at POST /api/v1/bills</li>
                  <li>Empty optional fields will be set to null</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}