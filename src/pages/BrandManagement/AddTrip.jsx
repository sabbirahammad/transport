import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Save, X, Calendar, Truck, MapPin,
  DollarSign, FileText, CheckCircle,
  AlertCircle, TrendingUp, User, Package, Settings
} from 'lucide-react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';

export default function AddTrip() {
    const { customerId: paramCustomerId, productId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
   const [customerId, setCustomerId] = useState(null);
   const [formData, setFormData] = useState({});
   const [selectedFields, setSelectedFields] = useState([]);
   const [loading, setLoading] = useState(true);
   const [errors, setErrors] = useState({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSuccess, setIsSuccess] = useState(false);

   // Get data from navigation state
   const stateProductName = location.state?.productName;
   const stateCustomer = location.state?.selectedCustomer;
   const stateCustomerId = location.state?.customerId;

  // Set customerId state when component mounts or location state changes
  useEffect(() => {
    // Try multiple sources for customerId: navigation state first, then URL params
    const customerIdToUse = stateCustomerId || stateCustomer?.id || paramCustomerId;

    if (customerIdToUse) {
      setCustomerId(customerIdToUse);
      console.log('Customer ID set from navigation state or URL params:', customerIdToUse);
    } else {
      console.warn('No customer ID found in navigation state or URL params');
    }
  }, [stateCustomerId, stateCustomer, paramCustomerId]);

  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';
console.log(productId)
console.log(stateCustomerId)
  // All possible fields definition (matching CustomTripList)
  const allFields = [
    { key: 'id', label: 'ID' },
    { key: 'brandName', label: 'Brand Name' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'category', label: 'Category' },
    { key: 'productName', label: 'Product Name' },
    { key: 'date', label: 'Date', type: 'date', section: 'basic' },
    { key: 'tripType', label: 'Trip Type', type: 'text', section: 'basic' },
    { key: 'tripNo', label: 'Trip No', type: 'text', section: 'basic' },
    { key: 'invoiceNo', label: 'Invoice No', type: 'text', section: 'basic' },
    { key: 'vehicleName', label: 'Vehicle Name', type: 'text', section: 'basic' },
    { key: 'vehicleNo', label: 'Vehicle No', type: 'text', section: 'basic' },
    { key: 'engineNo', label: 'Engine No', type: 'text', section: 'basic' },
    { key: 'chassisNo', label: 'Chassis No', type: 'text', section: 'basic' },
    { key: 'driverName', label: 'Driver Name', type: 'text', section: 'basic' },
    { key: 'driverMobile', label: 'Driver Mobile', type: 'text', section: 'basic' },
    { key: 'helperName', label: 'Helper Name', type: 'text', section: 'basic' },
    { key: 'truckSize', label: 'Truck Size', type: 'text', section: 'basic' },
    { key: 'fuelType', label: 'Fuel Type', type: 'text', section: 'basic' },
    { key: 'fuelCost', label: 'Fuel Cost', type: 'number', section: 'financial' },
    { key: 'loadPoint', label: 'Load Point', type: 'text', section: 'route' },
    { key: 'unloadPoint', label: 'Unload Point', type: 'text', section: 'route' },
    { key: 'destination', label: 'Destination', type: 'text', section: 'route' },
    { key: 'route', label: 'Route', type: 'text', section: 'route' },
    { key: 'district', label: 'District', type: 'text', section: 'route' },
    { key: 'quantity', label: 'Quantity', type: 'number', section: 'cargo' },
    { key: 'weight', label: 'Weight', type: 'number', section: 'cargo' },
    { key: 'transportType', label: 'Transport Type', type: 'text', section: 'cargo' },
    { key: 'unitPrice', label: 'Unit Price', type: 'number', section: 'financial' },
    { key: 'totalRate', label: 'Total Rate', type: 'number', section: 'financial' },
    { key: 'cash', label: 'Cash', type: 'number', section: 'financial' },
    { key: 'advance', label: 'Advance', type: 'number', section: 'financial' },
    { key: 'due', label: 'Due', type: 'number', section: 'financial' },
    { key: 'billNo', label: 'Bill No', type: 'text', section: 'documents' },
    { key: 'billDate', label: 'Bill Date', type: 'date', section: 'documents' },
    { key: 'paymentType', label: 'Payment Type', type: 'text', section: 'financial' },
    { key: 'remarks', label: 'Remarks', type: 'textarea', section: 'basic' },
    { key: 'status', label: 'Status', type: 'select', section: 'basic' },
    { key: 'createdBy', label: 'Created By', type: 'text', section: 'basic' },
    { key: 'approvedBy', label: 'Approved By', type: 'text', section: 'basic' }
  ];

  // Fetch selected fields when component mounts
  useEffect(() => {
    const fetchSelectedFields = async () => {

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products/${productId}/trip-fields`);
        if (response.ok) {
          const data = await response.json();

          let fieldsArray = [];
          if (Array.isArray(data)) {
            fieldsArray = data;
          } else if (data.data && Array.isArray(data.data)) {
            fieldsArray = data.data;
          } else if (data.trip_fields && Array.isArray(data.trip_fields)) {
            fieldsArray = data.trip_fields;
          } else if (typeof data === 'object' && data.trip_fields) {
            fieldsArray = Array.isArray(data.trip_fields) ? data.trip_fields : [];
          } else if (data.note && data.note.trip_fields && Array.isArray(data.note.trip_fields)) {
            fieldsArray = data.note.trip_fields;
          }

          setSelectedFields(fieldsArray);
        } else {
          setSelectedFields([]);
        }
      } catch (err) {
        console.error('Error fetching selected fields:', err);
        setSelectedFields([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchSelectedFields();
    }
  }, [productId]);

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

    // Validation - check required fields (you can add required logic here if needed)
    validSelectedFields.forEach(field => {
      const value = formData[field.key];
      if (field.key === 'product_id') {
        // product_id is always required
        if (!productId) {
          newErrors[field.key] = 'Product ID is required';
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
      // Prepare the data for submission - format according to backend expectations
      const payload = {};

      // Always include product_id as number
      payload.product_id = Number(productId);

      // Map form fields to backend expected format
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

      console.log('Submitting payload to:', `${API_BASE_URL}/trips`, payload);

      // Send POST request with JSON
      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            // Keep default error message
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Trip created successfully:', result);

      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({});
        setIsSuccess(false);
        // Navigate back to trip list with success message
        navigate(`/customer/${productId}/trips`, {
          state: {
            successMessage: 'Trip added successfully!',
            selectedCustomer: stateCustomer,
            customerId:customerId,
            productId: productId,
            productName: stateProductName,
            
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Error creating trip:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to create trip. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
console.log(stateCustomer)
  const handleCancel = () => {
    setFormData({});
    setErrors({});
  };
console.log(customerId)
  const getIconForField = (fieldKey) => {
    if (fieldKey.includes('amount') || fieldKey.includes('rate') || fieldKey.includes('cost') || fieldKey.includes('advance') || fieldKey.includes('due') || fieldKey.includes('total') || fieldKey.includes('profit') || fieldKey.includes('cash') || fieldKey.includes('fuel') || fieldKey.includes('unitPrice')) {
      return <DollarSign className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('vehicle') || fieldKey.includes('truck')) {
      return <Truck className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('destination') || fieldKey.includes('route') || fieldKey.includes('loadPoint') || fieldKey.includes('unloadPoint') || fieldKey.includes('district')) {
      return <MapPin className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('date') || fieldKey.includes('billDate')) {
      return <Calendar className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('driver') || fieldKey.includes('helper') || fieldKey.includes('createdBy') || fieldKey.includes('approvedBy')) {
      return <User className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('product') || fieldKey.includes('quantity') || fieldKey.includes('weight') || fieldKey.includes('transportType') || fieldKey.includes('category')) {
      return <Package className="inline w-4 h-4 mr-1" />;
    }
    if (fieldKey.includes('billNo') || fieldKey.includes('invoiceNo') || fieldKey.includes('tripNo')) {
      return <FileText className="inline w-4 h-4 mr-1" />;
    }
    return <Settings className="inline w-4 h-4 mr-1" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
          <p className="text-gray-600">Fetching trip fields</p>
        </div>
      </div>
    );
  }

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
              to={`/customer/${productId}/trips`}
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
            to={`/customer/${stateCustomerId}/trips`}
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
                {stateCustomer && (
                  <p className="text-sm text-gray-500 mt-1">Customer: {stateCustomer.name}</p>
                )}
                {stateProductName && (
                  <p className="text-sm text-gray-500">Product: {stateProductName}</p>
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
                        {field.label}
                      </label>
                      {field.type === 'date' ? (
                        <input
                          type="date"
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      ) : field.type === 'select' && field.key === 'status' ? (
                        <select
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
                          } bg-white`}
                        >
                          <option value="">Select Status</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          rows="3"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
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
                        {field.label}
                      </label>
                      <input
                        type={field.type || 'text'}
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
                        {field.label}
                      </label>
                      <input
                        type={field.type || 'text'}
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
                        {field.label}
                      </label>
                      <input
                        type={field.type || 'text'}
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
                        {field.label}
                      </label>
                      {field.type === 'date' ? (
                        <input
                          type="date"
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      )}
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
                to={`/customer/${stateCustomerId}/trips`}
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
                <strong>Dynamic Fields:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Input fields are generated based on selected trip fields for this product</li>
                  <li>All fields are optional unless specified as required</li>
                </ul>
              </div>
              <div>
                <strong>Data Types:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Use appropriate formats for dates and numbers</li>
                  <li>Financial fields accept numeric values</li>
                </ul>
              </div>
              <div>
                <strong>API Integration:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Data will be sent as JSON to POST /api/v1/trips</li>
                  <li>Product ID is automatically included as a number</li>
                  <li>Number fields are converted to numbers, others remain as strings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}