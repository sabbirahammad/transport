import React, { useState, useEffect } from 'react';
import { User, Truck, MapPin, DollarSign, Search, X, CheckCircle, Loader2, AlertCircle, Package, FileText, Calendar } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '../../context/ProductContext';

// API base URL
const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

export default function BillField() {
  const { id } = useParams(); // This is customerId from URL
  const location = useLocation();
  const { apiStates } = useProduct();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [productName, setProductName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fieldDefinitions, setFieldDefinitions] = useState({});
  const [productId, setProductId] = useState(null);
  const [chack, setchack] = useState();

  // Vehicle autocomplete states
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');

  const navigate = useNavigate();

  // Fetch field selections on mount
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ PRIORITIZE location.state for productId, productName, selectedCustomer, and successMessage
        const state = location.state;
        let currentProductId = null;
        let currentProductName = '';
        let currentSelectedCustomer = null;
        let currentSuccessMessage = '';

        if (state) {
          currentProductId = state.productId || null;
          currentProductName = state.productName || '';
          currentSelectedCustomer = state.selectedCustomer || null;
          currentSuccessMessage = state.successMessage || '';

          // Set state immediately
          setProductId(currentProductId);
          setProductName(currentProductName);
          setSelectedCustomer(currentSelectedCustomer);
          setSuccessMessage(currentSuccessMessage);
        }

        // 1. Get customer (for display) - only if not already set from state
        if (id && !currentSelectedCustomer) {
          try {
            // Use singular endpoint /customer (not /customers)
            const customerRes = await fetch(`${API_BASE_URL}/products/${productId}`);
            if (customerRes.ok) {
              const customerData = await customerRes.json();
              currentSelectedCustomer = {
                id: customerData.id,
                name: customerData.customerName || customerData.name || 'Unknown',
                address: customerData.address || ''
              };
              setSelectedCustomer(currentSelectedCustomer);
            }
          } catch (err) {
            console.error('Customer fetch failed:', err);
          }
        }

        // 2. ✅ FETCH PRODUCT ID FROM /products API (latest product for this customer) - only if not set from state
        if (!currentProductId && id) {
          try {
            const productsRes = await fetch(`${API_BASE_URL}/products?company_id=${id}`);
            if (productsRes.ok) {
              const productsData = await productsRes.json();
              const products = Array.isArray(productsData) ? productsData : (productsData.data || []);
              setchack(products)
              if (products.length > 0) {
                // Get the latest product (last in array)
                const latestProduct = products[products.length - 1];
                currentProductId = latestProduct.id;
                currentProductName = latestProduct.name || latestProduct.productName || '';

                // Set state
                setProductId(currentProductId);
                setProductName(currentProductName);
              } else {
                // No products found for this customer
                setError('No products found for this customer. Please create a product first.');
                setFieldDefinitions(defaultFieldDefinitions);
                setLoading(false);
                return;
              }
            } else {
              setError('Failed to fetch products for this customer.');
              setFieldDefinitions(defaultFieldDefinitions);
              setLoading(false);
              return;
            }
          } catch (productsErr) {
            console.error('Products fetch failed:', productsErr);
            setError('Failed to load products. Please try again.');
            setFieldDefinitions(defaultFieldDefinitions);
            setLoading(false);
            return;
          }
        }
console.log(currentProductId)
        // 3. Load selected fields using the productId (from state or fetched)
        if (currentProductId) {
          try {
            const fieldsRes = await fetch(`${API_BASE_URL}/products/${id}/bill-fields`);
            if (fieldsRes.ok) {
              const fieldsData = await fieldsRes.json();
              let fieldsArray = [];

              if (Array.isArray(fieldsData)) {
                fieldsArray = fieldsData;
              } else if (fieldsData && fieldsData.bill_fields && Array.isArray(fieldsData.bill_fields)) {
                fieldsArray = fieldsData.bill_fields;
              } else if (fieldsData && fieldsData.note && fieldsData.note.bill_fields && Array.isArray(fieldsData.note.bill_fields)) {
                fieldsArray = fieldsData.note.bill_fields;
              }

              setSelectedFields(fieldsArray);
              console.log('Selected bill fields loaded:', fieldsArray);
            }
          } catch (fieldsErr) {
            console.log('No bill fields found for product:', currentProductId);
          }
        }

        if (!id && !currentProductId) {
          setError('Customer ID is required');
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize. Please try again.');
      } finally {
        setFieldDefinitions(defaultFieldDefinitions);
        setLoading(false);
      }
    };

    init();
  }, [id, location.state]);
console.log(chack)
  console.log('Product Name:', productName);
  console.log('Product ID:', productId);
  console.log('Customer ID (from params):', id);

  const sectionIcons = {
    basic: FileText,
    vehicle: Truck,
    financial: DollarSign,
    additional: Calendar
  };

  // Get vehicle data from context
  const vehicleData = apiStates.vehicle.data || [];
  const vehicleSuggestions = Array.isArray(vehicleData) ? vehicleData : (vehicleData.data || []);

  // Reusable AutocompleteInput component
  const AutocompleteInput = ({ label, value, onChange, suggestions, placeholder, icon: Icon }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    useEffect(() => {
      if (value && suggestions.length > 0) {
        const filtered = suggestions.filter(item =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions(suggestions);
      }
    }, [value, suggestions]);

    const handleSelect = (selectedValue) => {
      onChange(selectedValue);
      setShowSuggestions(false);
    };

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                whileHover={{ backgroundColor: '#f0f9ff' }}
              >
                <span className="text-gray-700">{suggestion}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    );
  };

  // Complete field definitions based on the API structure
  const defaultFieldDefinitions = {
    basic: [
      { key: 'id', label: 'ID', type: 'string' },
      { key: 'category', label: 'Category', type: 'string' },
      { key: 'date', label: 'Date', type: 'string' },
      { key: 'challanNo', label: 'Challan No', type: 'string' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'customerName', label: 'Customer Name', type: 'string' },
      { key: 'distributorName', label: 'Distributor Name', type: 'string' },
      { key: 'dealerName', label: 'Dealer Name', type: 'string' }
    ],
    vehicle: [
      { key: 'vehicleNo', label: 'Vehicle No', type: 'string' },
      { key: 'driverName', label: 'Driver Name', type: 'string' },
      { key: 'vehicleSize', label: 'Vehicle Size', type: 'string' },
      { key: 'from', label: 'From', type: 'string' },
      { key: 'destination', label: 'Destination', type: 'string' },
      { key: 'portfolio', label: 'Portfolio', type: 'string' },
      { key: 'product', label: 'Product', type: 'string' },
      { key: 'goods', label: 'Goods', type: 'string' },
      { key: 'quantity', label: 'Quantity', type: 'number' },
      { key: 'bikeQty', label: 'Bike Qty', type: 'number' }
    ],
    financial: [
      { key: 'financial.unloadCharge', label: 'Unload Charge', type: 'number' },
      { key: 'financial.vehicleRentWithVATTax', label: 'Vehicle Rent with VAT Tax', type: 'number' },
      { key: 'financial.vehicleRent', label: 'Vehicle Rent', type: 'number' },
      { key: 'financial.dropping', label: 'Dropping', type: 'number' },
      { key: 'financial.alt5', label: 'Alt5', type: 'number' },
      { key: 'financial.vat10', label: 'VAT 10%', type: 'number' },
      { key: 'financial.totalRate', label: 'Total Rate', type: 'number' },
      { key: 'financial.advance', label: 'Advance', type: 'number' },
      { key: 'financial.due', label: 'Due', type: 'number' },
      { key: 'financial.total', label: 'Total', type: 'number' },
      { key: 'financial.profit', label: 'Profit', type: 'number' },
      { key: 'financial.bodyFare', label: 'Body Fare', type: 'number' },
      { key: 'financial.fuelCost', label: 'Fuel Cost', type: 'number' },
      { key: 'financial.amount', label: 'Amount', type: 'number' },
      { key: 'totalAmount', label: 'Total Amount', type: 'number' }
    ]
  };

  const handleCheckboxChange = (field) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const removeSelectedField = (field) => {
    setSelectedFields(prev => prev.filter(f => f !== field));
  };

  const handleNext = async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field before proceeding.');
      return;
    }

    if (!productId) {
      setError('Product ID not found. Please try again.');
      return;
    }

    try {
      setSaving(true);

      // Send selectedFields directly as array of strings
      const requestBody = {
        bill_fields: selectedFields
      };

      console.log('Sending bill fields data:', requestBody);

      const response = await fetch(`${API_BASE_URL}/products/${id}/bill-fields`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PUT request failed:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccessMessage('Bill fields saved successfully!');
      setTimeout(() => {
        // ✅ Navigate to bills page with customerId (since URL expects customerId)
        navigate(`/customer/${id}/bill`, {
          state: {
            productId: productId,
            productName: productName,
            selectedCustomer: selectedCustomer
          }
        });
      }, 1000);

    } catch (err) {
      console.error('BillField: Error in handleNext:', err);
      setError('Failed to save field selections. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredFields = (fields) => {
    return fields.filter(field => field.label.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={64} className="mx-auto mb-4 text-indigo-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Field Selections...</h2>
          <p className="text-gray-600">Please wait while we fetch your preferences.</p>
        </div>
      </div>
    );
  }

  if (error && !saving) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold">Select Bill Fields</h2>
                <p className="text-indigo-100 mt-2">Choose the fields you want to include in your bill report</p>

                {/* Customer and Product Info */}
                {selectedCustomer && (
                  <div className="mt-4 space-y-2">
                    <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center mb-2">
                        <User className="h-5 w-5 mr-2 text-indigo-200" />
                        <span className="text-sm text-indigo-100">Customer:</span>
                      </div>
                      <p className="font-semibold text-white text-lg ml-7">{selectedCustomer.name}</p>
                    </div>

                    {productName && (
                      <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center mb-2">
                          <Package className="h-5 w-5 mr-2 text-indigo-200" />
                          <span className="text-sm text-indigo-100">Product:</span>
                        </div>
                        <p className="font-semibold text-white text-lg ml-7">{productName}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {selectedCustomer && (
                <button
                  onClick={() => navigate('/customers')}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Back to Customers
                </button>
              )}
            </div>

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 text-center"
              >
                <p className="text-green-100 text-sm flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {successMessage}
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && saving && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 text-center mt-3"
              >
                <p className="text-red-100 text-sm flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </p>
              </motion.div>
            )}
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Field Selection */}
          <div className="p-8">
            {Object.entries(fieldDefinitions).map(([sectionKey, fields]) => {
              const IconComponent = sectionIcons[sectionKey];
              const filtered = filteredFields(fields);
              if (filtered.length === 0) return null;

              return (
                <div
                  key={sectionKey}
                  className="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 shadow-lg border border-gray-200"
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className="h-6 w-6 text-indigo-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)} Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(field => (
                      <motion.div
                        key={field.key}
                        onClick={() => handleCheckboxChange(field.key)}
                        className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-indigo-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        animate={{
                          borderColor: selectedFields.includes(field.key) ? '#4f46e5' : '#e5e7eb',
                          backgroundColor: selectedFields.includes(field.key) ? '#f0f9ff' : '#ffffff'
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className={`w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-all flex-shrink-0 ${
                            selectedFields.includes(field.key)
                              ? 'bg-indigo-600 border-indigo-600'
                              : 'border-gray-300 hover:border-indigo-400'
                          }`}
                          animate={{
                            scale: selectedFields.includes(field.key) ? 1.1 : 1,
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <AnimatePresence>
                            {selectedFields.includes(field.key) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              >
                                <CheckCircle className="w-3 h-3 text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        <span className="text-gray-700 font-medium">{field.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Selected Fields Display */}
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">Selected Fields</span>
                <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-sm">{selectedFields.length}</span>
              </h3>
              {selectedFields.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedFields.map(field => {
                    const fieldObj = Object.values(fieldDefinitions).flat().find(f => f.key === field);
                    return (
                      <span
                        key={field}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                      >
                        {fieldObj?.label}
                        <button
                          onClick={() => removeSelectedField(field)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No fields selected yet. Choose some above!</p>
              )}
            </div>

            {/* Next Button */}
            <div className="mt-8 flex justify-end">
              <motion.button
                onClick={handleNext}
                disabled={selectedFields.length === 0 || saving}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                whileHover={{ scale: selectedFields.length > 0 && !saving ? 1.05 : 1 }}
                whileTap={{ scale: selectedFields.length > 0 && !saving ? 0.95 : 1 }}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}