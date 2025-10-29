import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Truck, MapPin, DollarSign, Search, Check, Loader2, AlertCircle, ArrowLeft, Package } from 'lucide-react';

// API base URL
const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

const TripField = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [productName, setProductName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Field categories for Trip Fields
  const tripFieldCategories = [
    {
      title: 'Basic Information',
      icon: User,
      fields: [
        { key: 'brandName', label: 'Brand Name' },
        { key: 'category', label: 'Category' },
        { key: 'date', label: 'Date' }
      ]
    },
    {
      title: 'Vehicle Information',
      icon: Truck,
      fields: [
        { key: 'vehicleNo', label: 'Vehicle Number' },
        { key: 'driverName', label: 'Driver Name' },
        { key: 'dealerName', label: 'Dealer Name' },
        { key: 'doSi', label: 'DO/SI' },
        { key: 'coU', label: 'CO/U' },
        { key: 'vehicleSize', label: 'Vehicle Size' }
      ]
    },
    {
      title: 'Trip Information',
      icon: MapPin,
      fields: [
        { key: 'loadPoint', label: 'Load Point' },
        { key: 'unloadPoint', label: 'Unload Point' },
        { key: 'destination', label: 'Destination' },
        { key: 'portfolio', label: 'Portfolio' },
        { key: 'goods', label: 'Goods' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'bikeQty', label: 'Bike Quantity' }
      ]
    },
    {
      title: 'Financial Information',
      icon: DollarSign,
      fields: [
        { key: 'cash', label: 'Cash' },
        { key: 'advance', label: 'Advance' },
        { key: 'due', label: 'Due' },
        { key: 'totalRate', label: 'Total Rate' },
        { key: 'total', label: 'Total' },
        { key: 'profit', label: 'Profit' },
        { key: 'unloadCharge', label: 'Unload Charge' },
        { key: 'vehicleRateWithVatTax', label: 'Vehicle Rate with VAT/Tax' },
        { key: 'vehicleRent', label: 'Vehicle Rent' },
        { key: 'dropping', label: 'Dropping' },
        { key: 'alt5', label: 'Alt 5' },
        { key: 'vat', label: 'VAT' },
        { key: 'vat10', label: 'VAT 10%' },
        { key: 'extraCost', label: 'Extra Cost' },
        { key: 'totalAmount', label: 'Total Amount' }
      ]
    }
  ];

  // Field categories for Bill Fields
  const billFieldCategories = [
    {
      title: 'Customer Information',
      icon: User,
      fields: [
        { key: 'customerName', label: 'Customer Name' },
        { key: 'customerAddress', label: 'Customer Address' },
        { key: 'customerPhone', label: 'Customer Phone' }
      ]
    },
    {
      title: 'Bill Details',
      icon: DollarSign,
      fields: [
        { key: 'challanNo', label: 'Challan Number' },
        { key: 'date', label: 'Date' },
        { key: 'totalRate', label: 'Total Rate' },
        { key: 'advance', label: 'Advance' },
        { key: 'due', label: 'Due' },
        { key: 'total', label: 'Total' },
        { key: 'profit', label: 'Profit' }
      ]
    }
  ];

  // Determine if this is for trip fields or bill fields based on URL
  const isBillField = location.pathname.includes('/bill-field');
  const fieldCategories = isBillField ? billFieldCategories : tripFieldCategories;

  // Auto-select customer from state or fetch from URL
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);

        // Check if customer data is passed via state (from Customer component)
        if (location.state?.selectedCustomer) {
          setSelectedCustomer(location.state.selectedCustomer);
          setSuccessMessage(location.state.successMessage || '');
          setTimeout(() => setSuccessMessage(''), 5000);
        } else if (id) {
          // Fetch customer data from API using ID
          const response = await fetch(`${API_BASE_URL}/customers/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSelectedCustomer({
            id: data.id,
            name: data.customerName || data.name || '',
            address: data.address || '',
            slug: data.slug || ''
          });
        }

        // Fetch product name for this customer (company_id)
        if (id) {
          try {
            const productsResponse = await fetch(`${API_BASE_URL}/products?company_id=${id}`);
            if (productsResponse.ok) {
              const productsData = await productsResponse.json();
              // Get the most recent product for this customer
              if (Array.isArray(productsData) && productsData.length > 0) {
                const latestProduct = productsData[productsData.length - 1];
                setProductName(latestProduct.name || '');
              }
            }
          } catch (err) {
            console.error('Error fetching product:', err);
            // Don't set error state, just log it - product is optional
          }
        }

        // Fetch existing field selections for this customer
        if (id) {
          const resource = isBillField ? 'billFieldSelections' : 'fieldSelections';
          const response = await fetch(`${API_BASE_URL}/${resource}?customerId=${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const latestSelection = data[data.length - 1];
            setSelectedFields(latestSelection.selectedFields || []);
          }
        }
      } catch (err) {
        setError('Failed to load customer data or field selections.');
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, [id, location.state, isBillField]);

  const handleFieldToggle = (fieldKey) => {
    setSelectedFields(prev =>
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleSave = async () => {
    if (selectedFields.length === 0 || !selectedCustomer) return;

    try {
      setSaving(true);
      const fieldSelectionData = {
        selectedFields,
        customerId: selectedCustomer.id,
        createdAt: new Date().toISOString()
      };

      const resource = isBillField ? 'billFieldSelections' : 'fieldSelections';
      // Check if field selection already exists for this customer
      const response = await fetch(`${API_BASE_URL}/${resource}?customerId=${selectedCustomer.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const existing = Array.isArray(data) ? data.find(s => s.customerId === selectedCustomer.id) : null;

      if (existing) {
        await fetch(`${API_BASE_URL}/${resource}/${existing.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fieldSelectionData),
        });
      } else {
        await fetch(`${API_BASE_URL}/${resource}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fieldSelectionData),
        });
      }

      // Navigate to next step based on field type
      if (isBillField) {
        navigate(`/customer/${selectedCustomer.id}/trips`);
      } else {
        navigate(`/customer/${selectedCustomer.id}/bill-field`);
      }
    } catch (err) {
      setError('Failed to save field selections. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = fieldCategories.map(category => ({
    ...category,
    fields: category.fields.filter(field =>
      field.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.fields.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="animate-spin h-8 w-8" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !selectedCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/customers')}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => navigate('/customers')}
              className="mr-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-4xl font-bold text-gray-800">
              {isBillField ? 'Bill Field Selection' : 'Trip Field Selection'}
            </h1>
          </div>
          <p className="text-gray-600">
            {isBillField ? 'Select fields for bills' : 'Select fields for trips'} for {selectedCustomer?.name}
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center"
            >
              <Check className="h-5 w-5 mr-2" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Customer Info with Product Name */}
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl mb-8 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Selected Customer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-indigo-100">Customer Name</p>
                  <p className="font-medium text-lg">{selectedCustomer.name}</p>
                  <p className="text-indigo-100 text-sm">{selectedCustomer.address}</p>
                </div>
              </div>
              
              {productName && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-100">Product Name</p>
                    <p className="font-medium text-lg">{productName}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Field Categories */}
        <div className="space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <category.icon className="h-6 w-6 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.fields.map((field) => (
                  <motion.div
                    key={field.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedFields.includes(field.key)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => handleFieldToggle(field.key)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{field.label}</span>
                      {selectedFields.includes(field.key) && (
                        <Check className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Fields Summary */}
        {selectedFields.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Selected Fields ({selectedFields.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedFields.map((fieldKey) => {
                const field = fieldCategories
                  .flatMap(cat => cat.fields)
                  .find(f => f.key === fieldKey);
                return (
                  <motion.span
                    key={fieldKey}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {field?.label}
                    <button
                      onClick={() => handleFieldToggle(fieldKey)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSave}
            disabled={selectedFields.length === 0 || saving || !selectedCustomer}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center mx-auto"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Saving...
              </>
            ) : (
              `Save ${isBillField ? 'Bill' : 'Trip'} Field Selection`
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TripField;