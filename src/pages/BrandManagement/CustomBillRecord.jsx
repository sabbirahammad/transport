// import React, { useState, useEffect } from 'react';
// import {
//   ArrowLeft, Save, X, Calendar, Truck, MapPin,
//   DollarSign, FileText, CheckCircle,
//   AlertCircle, TrendingUp, User, Package, Settings
// } from 'lucide-react';
// import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useProduct } from '../../context/ProductContext';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function CustomBillRecord({
//   selectedFields = [],
//   onClose,
//   onSubmit,
//   productName,
//   customer,
//   productId
// }) {
//     const { id: customerId } = useParams(); // Get customer ID from URL params
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { apiStates } = useProduct();

//     const [formData, setFormData] = useState({});
//     const [errors, setErrors] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isSuccess, setIsSuccess] = useState(false);
    
//     // Product auto-suggest states
//     const [showProductSuggestions, setShowProductSuggestions] = useState(false);
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [highlightedIndex, setHighlightedIndex] = useState(-1);
//     const [productInput, setProductInput] = useState('');
//     const [selectedProduct, setSelectedProduct] = useState(null);

//     // Vehicle field mapping for data keys
//     const vehicleFieldMapping = {
//       vehicle_name: 'vehicle_name',
//       vehicle_no: 'vehicle_no',
//       driver_name: 'driver_name',
//       size: 'size',
//       driver_contact: 'driver_contact'
//     };

//     // Get vehicle data from context
//     const vehicleData = apiStates.vehicle.data || [];
//     const vehicleSuggestions = Array.isArray(vehicleData) ? vehicleData : (vehicleData.data || []);

//     // Reusable AutocompleteInput component
//     const AutocompleteInput = ({ label, value, onChange, suggestions, placeholder, icon: Icon }) => {
//       const [showSuggestions, setShowSuggestions] = useState(false);
//       const [filteredSuggestions, setFilteredSuggestions] = useState([]);

//       useEffect(() => {
//         if (value && suggestions.length > 0) {
//           const filtered = suggestions.filter(item =>
//             item.toLowerCase().includes(value.toLowerCase())
//           );
//           setFilteredSuggestions(filtered);
//         } else {
//           setFilteredSuggestions(suggestions);
//         }
//       }, [value, suggestions]);

//       const handleSelect = (selectedValue) => {
//         onChange(selectedValue);
//         setShowSuggestions(false);
//       };

//       return (
//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
//           <div className="relative">
//             {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />}
//             <input
//               type="text"
//               value={value}
//               onChange={(e) => onChange(e.target.value)}
//               onFocus={() => setShowSuggestions(true)}
//               onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//               placeholder={placeholder}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//             />
//           </div>
//           {showSuggestions && filteredSuggestions.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
//             >
//               {filteredSuggestions.map((suggestion, index) => (
//                 <motion.div
//                   key={index}
//                   onClick={() => handleSelect(suggestion)}
//                   className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                   whileHover={{ backgroundColor: '#f0f9ff' }}
//                 >
//                   <span className="text-gray-700">{suggestion}</span>
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
//         </div>
//       );
//     };

//    // Get data from navigation state
//    const billId = location.state?.billId;
//    const stateProductId = location.state?.productId;
//    const stateProductName = location.state?.productName;
//    const stateCustomer = location.state?.selectedCustomer;
//    const billData = location.state?.billData;

//    // Use props if provided, otherwise fall back to state
//    const currentProductId = productId || stateProductId;
//    const currentProductName = productName || stateProductName;
//    const currentCustomer = customer || stateCustomer;

//    // All possible fields definition (matching Go struct)
//    const allFields = [
//      { key: 'product_id', label: 'Product ID', type: 'number', required: true, section: 'basic' },
//      { key: 'category', label: 'Category', type: 'text', section: 'basic' },
//      { key: 'vehicle_name', label: 'Vehicle Name', type: 'text', section: 'basic' },
//      { key: 'vehicle_no', label: 'Vehicle No', type: 'text', section: 'basic' },
//      { key: 'customer_name', label: 'Customer Name', type: 'text', section: 'basic' },
//      { key: 'challan_no', label: 'Challan No', type: 'text', section: 'basic' },
//      { key: 'distributor_name', label: 'Distributor Name', type: 'text', section: 'basic' },
//      { key: 'dealer_name', label: 'Dealer Name', type: 'text', section: 'basic' },
//      { key: 'driver_name', label: 'Driver Name', type: 'text', section: 'basic' },
//      { key: 'size', label: 'Size', type: 'text', section: 'basic' },
//      { key: 'driver_contact', label: 'Driver Contact', type: 'text', section: 'basic' },
//      { key: 'from_location', label: 'From Location', type: 'text', section: 'route' },
//      { key: 'destination', label: 'Destination', type: 'text', section: 'route' },
//      { key: 'product', label: 'Product', type: 'text', section: 'cargo' },
//      { key: 'portfolio', label: 'Portfolio', type: 'text', section: 'cargo' },
//      { key: 'goods', label: 'Goods', type: 'text', section: 'cargo' },
//      { key: 'quantity', label: 'Quantity', type: 'number', section: 'cargo' },
//      { key: 'bike_qty', label: 'Bike Qty', type: 'number', section: 'cargo' },
//      { key: 'vehicle_size', label: 'Vehicle Size', type: 'text', section: 'cargo' },
//      { key: 'status', label: 'Status', type: 'text', section: 'cargo' },
//      { key: 'unload_charge', label: 'Unload Charge', type: 'number', section: 'financial' },
//      { key: 'vehicle_rent_with_vat_tax', label: 'Vehicle Rent with VAT Tax', type: 'number', section: 'financial' },
//      { key: 'vehicle_rent', label: 'Vehicle Rent', type: 'number', section: 'financial' },
//      { key: 'dropping', label: 'Dropping', type: 'number', section: 'financial' },
//      { key: 'alt5', label: 'Alt5', type: 'number', section: 'financial' },
//      { key: 'vat10', label: 'VAT 10%', type: 'number', section: 'financial' },
//      { key: 'total_rate', label: 'Total Rate', type: 'number', section: 'financial' },
//      { key: 'advance', label: 'Advance', type: 'number', section: 'financial' },
//      { key: 'due', label: 'Due', type: 'number', section: 'financial' },
//      { key: 'total', label: 'Total', type: 'number', section: 'financial' },
//      { key: 'profit', label: 'Profit', type: 'number', section: 'financial' },
//      { key: 'body_fare', label: 'Body Fare', type: 'number', section: 'financial' },
//      { key: 'fuel_cost', label: 'Fuel Cost', type: 'number', section: 'financial' },
//      { key: 'amount', label: 'Amount', type: 'number', section: 'financial' },
//      { key: 'total_amount', label: 'Total Amount', type: 'number', section: 'financial' },
//      { key: 'do_number', label: 'DO Number', type: 'text', section: 'documents' },
//      { key: 'co_number', label: 'CO Number', type: 'text', section: 'documents' }
//    ];


//    // Get valid selected fields with labels and types
//    const validSelectedFields = selectedFields.length > 0
//      ? selectedFields.map(fieldKey => {
//          const field = allFields.find(f => f.key === fieldKey);
//          if (field) return field;
//          return { key: fieldKey, label: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1), type: 'text', section: 'basic' };
//        }).filter(Boolean)
//      : allFields.filter(field => field.key !== 'id'); // Exclude id field

//   // Group fields by section
//   const groupedFields = validSelectedFields.reduce((acc, field) => {
//     const section = field.section || 'basic';
//     if (!acc[section]) acc[section] = [];
//     acc[section].push(field);
//     return acc;
//   }, {});

//   // Section titles
//   const sectionTitles = {
//     basic: 'Basic Information',
//     route: 'Route Information',
//     cargo: 'Cargo Details',
//     financial: 'Financial Information',
//     documents: 'Documents'
//   };

//    // Handle product input changes for auto-suggest
//    const handleProductInputChange = (value) => {
//      if (!selectedProduct) {
//        setProductInput(value);
//        const products = apiStates.product?.data?.data || [];
//        if (value.trim() === '') {
//          setFilteredProducts(products);
//          setShowProductSuggestions(true);
//          setHighlightedIndex(-1);
//        } else {
//          const filtered = products.filter(product =>
//            product.name?.toLowerCase().includes(value.toLowerCase()) ||
//            product.category?.toLowerCase().includes(value.toLowerCase())
//          );
//          setFilteredProducts(filtered);
//          setShowProductSuggestions(true);
//          setHighlightedIndex(-1);
//        }
//      }
//    };

//    // Handle product selection from suggestions
//    const handleProductSelect = (product) => {
//      setSelectedProduct(product);
//      setFormData(prev => ({
//        ...prev,
//        product: product.name,
//        category: product.category || prev.category,
//        // Auto-fill other related fields if available
//        portfolio: product.portfolio || prev.portfolio,
//        goods: product.goods || prev.goods
//      }));
//      setProductInput(product.name);
//      setShowProductSuggestions(false);
//      setHighlightedIndex(-1);

//      // Clear any product-related errors
//      if (errors.product) {
//        setErrors(prev => ({
//          ...prev,
//          product: ''
//        }));
//      }
//    };

//   // Handle keyboard navigation for product suggestions
//   const handleProductKeyDown = (e) => {
//     if (!showProductSuggestions || filteredProducts.length === 0) return;

//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault();
//         setHighlightedIndex(prev =>
//           prev < filteredProducts.length - 1 ? prev + 1 : 0
//         );
//         break;
//       case 'ArrowUp':
//         e.preventDefault();
//         setHighlightedIndex(prev =>
//           prev > 0 ? prev - 1 : filteredProducts.length - 1
//         );
//         break;
//       case 'Enter':
//         e.preventDefault();
//         if (highlightedIndex >= 0 && highlightedIndex < filteredProducts.length) {
//           handleProductSelect(filteredProducts[highlightedIndex]);
//         }
//         break;
//       case 'Escape':
//         setShowProductSuggestions(false);
//         setHighlightedIndex(-1);
//         break;
//     }
//   };

//    const handleInputChange = (e) => {
//      const { name, value } = e.target;

//      setFormData(prev => ({
//        ...prev,
//        [name]: value
//      }));

//      // Handle product field auto-suggest
//      if (name === 'product') {
//        handleProductInputChange(value);
//      }

//      // Clear error when user starts typing
//      if (errors[name]) {
//        setErrors(prev => ({
//          ...prev,
//          [name]: ''
//        }));
//      }

//      // Clear submit error when user starts typing
//      if (errors.submit) {
//        setErrors(prev => ({
//          ...prev,
//          submit: ''
//        }));
//      }
//    };

//    const validateForm = () => {
//      const newErrors = {};

//      // Validation - check required fields
//      validSelectedFields.forEach(field => {
//        const value = formData[field.key];
//        if (field.required) {
//          if (!value || value.trim() === '') {
//            newErrors[field.key] = `${field.label} is required`;
//          }
//        }
//        if (field.type === 'number' && value !== undefined && value !== '' && isNaN(Number(value))) {
//          newErrors[field.key] = `${field.label} must be a valid number`;
//        }
//      });

//      setErrors(newErrors);
//      return Object.keys(newErrors).length === 0;
//    };

//    const handleSubmit = async (e) => {
//      e.preventDefault();

//      if (!validateForm()) {
//        return;
//      }

//      setIsSubmitting(true);

//      try {
//        // Prepare the data for submission - format according to Go struct
//        const payload = {};

//        // Always include product_id as required field
//        payload.product_id = Number(customerId);

//        // Map form fields to Go struct fields
//        validSelectedFields.forEach(field => {
//          const value = formData[field.key];
//          if (field.type === 'number' && value !== undefined && value !== '') {
//            payload[field.key] = Number(value);
//          } else if (value !== undefined && value !== '') {
//            payload[field.key] = value;
//          } else {
//            // Set optional fields to null if empty
//            payload[field.key] = null;
//          }
//        });

//        console.log('Submitting payload:', payload);

//        // Send POST request to backend API
//        const response = await axios.post('http://192.168.0.106:8080/api/v1/bills', payload, {
//          headers: {
//            'Content-Type': 'application/json'
//          }
//        });

//        console.log('Bill created successfully:', response.data);
//        setIsSuccess(true);

//        // Reset form after successful submission
//        setTimeout(() => {
//          setFormData({});
//          setIsSuccess(false);
//          // Navigate back to bill list instead of calling onClose
//          navigate(`/customer/${customerId}/custom-bill-list`);
//        }, 2000);

//      } catch (error) {
//        console.error('Error creating bill:', error);
//        console.error('Error response:', error.response?.data);
//        setErrors(prev => ({
//          ...prev,
//          submit: error.response?.data?.message || error.response?.data?.error || 'Failed to create bill. Please try again.'
//        }));
//      } finally {
//        setIsSubmitting(false);
//      }
//    };

//   const handleCancel = () => {
//     setFormData({});
//     setErrors({});
//     setShowProductSuggestions(false);
//     setFilteredProducts([]);
//     setHighlightedIndex(-1);
//     setProductInput('');
//     setSelectedProduct(null);
//   };

//   // Helper function to get unique values for vehicle fields
//   const getVehicleFieldOptions = (fieldKey) => {
//     const vehicles = apiStates.vehicle?.data?.data || [];
//     const dataKey = vehicleFieldMapping[fieldKey];
//     if (!dataKey) return [];

//     const uniqueValues = [...new Set(vehicles.map(vehicle => vehicle[dataKey]).filter(Boolean))];
//     return uniqueValues.sort();
//   };

//   // Handler for vehicle field dropdown changes
//   const handleVehicleFieldChange = (fieldKey, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [fieldKey]: value
//     }));

//     if (errors[fieldKey]) {
//       setErrors(prev => ({
//         ...prev,
//         [fieldKey]: ''
//       }));
//     }

//     if (errors.submit) {
//       setErrors(prev => ({
//         ...prev,
//         submit: ''
//       }));
//     }
//   };

//    // Check if a field should be disabled based on product selection
//    const isFieldDisabled = (fieldKey) => {
//      // Product field is never disabled
//      if (fieldKey === 'product') return false;

//      // Related fields that depend on product selection
//      const productDependentFields = ['category', 'portfolio', 'goods'];

//      // If it's a product-dependent field and no product is selected, disable it
//      if (productDependentFields.includes(fieldKey) && !selectedProduct) {
//        return true;
//      }

//      return false;
//    };

//    const getIconForField = (fieldKey) => {
//      if (fieldKey.includes('amount') || fieldKey.includes('rate') || fieldKey.includes('rent') || fieldKey.includes('charge') || fieldKey.includes('fare') || fieldKey.includes('cost') || fieldKey.includes('vat') || fieldKey.includes('alt') || fieldKey.includes('dropping') || fieldKey.includes('advance') || fieldKey.includes('due') || fieldKey.includes('total') || fieldKey.includes('profit')) {
//        return <DollarSign className="inline w-4 h-4 mr-1" />;
//      }
//      if (fieldKey.includes('vehicle')) {
//        return <Truck className="inline w-4 h-4 mr-1" />;
//      }
//      if (fieldKey.includes('destination') || fieldKey.includes('from_location')) {
//        return <MapPin className="inline w-4 h-4 mr-1" />;
//      }
//      if (fieldKey.includes('date')) {
//        return <Calendar className="inline w-4 h-4 mr-1" />;
//      }
//      if (fieldKey.includes('driver') || fieldKey.includes('customer') || fieldKey.includes('dealer') || fieldKey.includes('distributor')) {
//        return <User className="inline w-4 h-4 mr-1" />;
//      }
//      if (fieldKey.includes('product') || fieldKey.includes('goods') || fieldKey.includes('portfolio') || fieldKey.includes('quantity') || fieldKey.includes('bike_qty') || fieldKey.includes('vehicle_size')) {
//        return <Package className="inline w-4 h-4 mr-1" />;
//      }
//      if (fieldKey.includes('do_number') || fieldKey.includes('co_number') || fieldKey.includes('challan_no')) {
//        return <FileText className="inline w-4 h-4 mr-1" />;
//      }
//      return <Settings className="inline w-4 h-4 mr-1" />;
//    };


//    if (isSuccess) {
//      return (
//        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
//            <div className="mb-6">
//              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//              <h2 className="text-2xl font-bold text-gray-800 mb-2">Bill Record Added Successfully!</h2>
//              <p className="text-gray-600">The new bill record has been added to the system.</p>
//            </div>
//            <div className="space-y-3">
//              {onClose ? (
//                <button
//                  onClick={() => {
//                    setIsSuccess(false);
//                    onClose();
//                  }}
//                  className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                >
//                  Close
//                </button>
//              ) : (
//                <Link
//                  to={`/customer/${customerId}/custom-bill-list`}
//                  className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                >
//                  Back to Bill List
//                </Link>
//              )}
//              <button
//                onClick={() => setIsSuccess(false)}
//                className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//              >
//                Add Another Record
//              </button>
//            </div>
//          </div>
//        </div>
//      );
//    }

//    return (
//      <div className="min-h-screen bg-gray-50">
//        {/* Header */}
//        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-4 shadow-lg">
//          <div className="flex items-center gap-4">
//            {onClose ? (
//              <button
//                onClick={onClose}
//                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
//              >
//                <ArrowLeft size={20} />
//                <span>Back to Custom Bill List</span>
//              </button>
//            ) : (
//              <Link
//                to={`/customer/${customerId}/custom-bill-list`}
//                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
//              >
//                <ArrowLeft size={20} />
//                <span>Back to Custom Bill List</span>
//              </Link>
//            )}
//            <div className="h-6 w-px bg-blue-300"></div>
//            <h1 className="text-white text-xl font-semibold">Add New Custom Bill Record</h1>
//          </div>
//        </div>

//        <div className="px-8 py-6">
//          <div className="max-w-4xl mx-auto">
//            {/* Bill Information Section */}
//            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
//              <div className="flex items-center gap-6">
//                <div className="relative">
//                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                    <FileText className="w-10 h-10 text-white" />
//                  </div>
//                </div>
//                <div>
//                  <h2 className="text-xl font-bold text-gray-800">Custom Bill Record Information</h2>
//                  <p className="text-gray-600">Fill in the details below to add a new bill record</p>
//                  {currentCustomer && (
//                    <p className="text-sm text-gray-500 mt-1">Customer: {currentCustomer.name}</p>
//                  )}
//                </div>
//              </div>
//            </div>

//           {/* Vehicle Autocomplete Section */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               <Truck className="h-5 w-5 text-indigo-600 mr-2" />
//               Vehicle Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <AutocompleteInput
//                 label="Vehicle Number"
//                 value={formData.vehicle_no || ''}
//                 onChange={(value) => setFormData(prev => ({ ...prev, vehicle_no: value }))}
//                 suggestions={vehicleSuggestions.map(v => v.vehicle_no || v.number || '').filter(Boolean)}
//                 placeholder="Enter vehicle number"
//                 icon={Truck}
//               />
//               <AutocompleteInput
//                 label="Vehicle Name"
//                 value={formData.vehicle_name || ''}
//                 onChange={(value) => setFormData(prev => ({ ...prev, vehicle_name: value }))}
//                 suggestions={vehicleSuggestions.map(v => v.vehicle_name || v.name || '').filter(Boolean)}
//                 placeholder="Enter vehicle name"
//                 icon={Truck}
//               />
//               <AutocompleteInput
//                 label="Driver Name"
//                 value={formData.driver_name || ''}
//                 onChange={(value) => setFormData(prev => ({ ...prev, driver_name: value }))}
//                 suggestions={vehicleSuggestions.map(v => v.driver_name || v.driver || '').filter(Boolean)}
//                 placeholder="Enter driver name"
//                 icon={User}
//               />
//               <AutocompleteInput
//                 label="Driver Phone"
//                 value={formData.driver_contact || ''}
//                 onChange={(value) => setFormData(prev => ({ ...prev, driver_contact: value }))}
//                 suggestions={vehicleSuggestions.map(v => v.driver_contact || v.phone || '').filter(Boolean)}
//                 placeholder="Enter driver phone"
//                 icon={User}
//               />
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
//              {/* Basic Information Section */}
//              {groupedFields.basic && groupedFields.basic.length > 0 && (
//                <div className="mb-8">
//                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    {groupedFields.basic.map(field => (
//                      <div key={field.key}>
//                        <label className="block text-sm font-medium text-gray-700 mb-2">
//                          {getIconForField(field.key)}
//                          {field.label} {field.required ? '*' : ''}
//                        </label>
//                        {['vehicle_name', 'vehicle_no', 'driver_name', 'size', 'driver_contact'].includes(field.key) ? (
//                          <select
//                            name={field.key}
//                            value={formData[field.key] || ''}
//                            onChange={(e) => handleVehicleFieldChange(field.key, e.target.value)}
//                            disabled={isFieldDisabled(field.key)}
//                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                              errors[field.key] ? 'border-red-300' : 'border-gray-300'
//                            } ${isFieldDisabled(field.key) ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
//                          >
//                            <option value="">Select {field.label}</option>
//                            {getVehicleFieldOptions(field.key).map((option, index) => (
//                              <option key={index} value={option}>
//                                {option}
//                              </option>
//                            ))}
//                          </select>
//                        ) : field.key === 'product' ? (
//                         <div className="relative">
//                           <input
//                             type={field.type || 'text'}
//                             name={field.key}
//                             value={productInput}
//                             onChange={(e) => handleProductInputChange(e.target.value)}
//                             onClick={() => {
//                               if (!selectedProduct) {
//                                 const products = apiStates.product?.data?.data || [];
//                                 setFilteredProducts(products);
//                                 setShowProductSuggestions(true);
//                                 setHighlightedIndex(-1);
//                               }
//                             }}
//                             onFocus={() => {
//                               if (!selectedProduct) {
//                                 const products = apiStates.product?.data?.data || [];
//                                 setFilteredProducts(products);
//                                 setShowProductSuggestions(true);
//                                 setHighlightedIndex(-1);
//                               }
//                             }}
//                             onBlur={() => {
//                               setTimeout(() => setShowProductSuggestions(false), 200);
//                             }}
//                             onKeyDown={handleProductKeyDown}
//                             readOnly={!!selectedProduct}
//                             className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                               errors[field.key] ? 'border-red-300' : 'border-gray-300'
//                             } ${selectedProduct ? 'bg-gray-100 cursor-pointer' : ''}`}
//                             placeholder={selectedProduct ? selectedProduct.name : `Click to select ${field.label.toLowerCase()}`}
//                           />
//                           {showProductSuggestions && (
//                             <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                               {filteredProducts.length > 0 ? (
//                                 filteredProducts.map((product, index) => (
//                                   <div
//                                     key={product.id || index}
//                                     className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
//                                       index === highlightedIndex ? 'bg-blue-100' : ''
//                                     }`}
//                                     onMouseDown={(e) => {
//                                       e.preventDefault();
//                                       handleProductSelect(product);
//                                     }}
//                                   >
//                                     <div className="font-medium text-gray-900">{product.name}</div>
//                                     {product.category && (
//                                       <div className="text-sm text-gray-500">{product.category}</div>
//                                     )}
//                                   </div>
//                                 ))
//                               ) : (
//                                 <div className="px-4 py-2 text-gray-500">No records found</div>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <input
//                           type={field.type}
//                           name={field.key}
//                           value={formData[field.key] || ''}
//                           onChange={handleInputChange}
//                           disabled={isFieldDisabled(field.key)}
//                           className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                             errors[field.key] ? 'border-red-300' : 'border-gray-300'
//                           } ${isFieldDisabled(field.key) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//                           placeholder={isFieldDisabled(field.key) ? 'Select a product first' : `Enter ${field.label.toLowerCase()}`}
//                         />
//                       )}
//                       {errors[field.key] && (
//                         <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//              {/* Route Information Section */}
//              {groupedFields.route && groupedFields.route.length > 0 && (
//                <div className="mb-8">
//                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Information</h3>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    {groupedFields.route.map(field => (
//                      <div key={field.key}>
//                        <label className="block text-sm font-medium text-gray-700 mb-2">
//                          {getIconForField(field.key)}
//                          {field.label} {field.required ? '*' : ''}
//                        </label>
//                        <input
//                          type={field.type}
//                          name={field.key}
//                          value={formData[field.key] || ''}
//                          onChange={handleInputChange}
//                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
//                          }`}
//                          placeholder={`Enter ${field.label.toLowerCase()}`}
//                        />
//                        {errors[field.key] && (
//                          <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
//                        )}
//                      </div>
//                    ))}
//                  </div>
//                </div>
//              )}

//              {/* Cargo Details Section */}
//              {groupedFields.cargo && groupedFields.cargo.length > 0 && (
//                <div className="mb-8">
//                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Cargo Details</h3>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    {groupedFields.cargo.map(field => (
//                      <div key={field.key}>
//                        <label className="block text-sm font-medium text-gray-700 mb-2">
//                          {getIconForField(field.key)}
//                          {field.label} {field.required ? '*' : ''}
//                        </label>
//                        <input
//                          type={field.type}
//                          name={field.key}
//                          value={formData[field.key] || ''}
//                          onChange={handleInputChange}
//                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
//                          }`}
//                          placeholder={`Enter ${field.label.toLowerCase()}`}
//                        />
//                        {errors[field.key] && (
//                          <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
//                        )}
//                      </div>
//                    ))}
//                  </div>
//                </div>
//              )}

//              {/* Financial Information Section */}
//              {groupedFields.financial && groupedFields.financial.length > 0 && (
//                <div className="mb-8">
//                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    {groupedFields.financial.map(field => (
//                      <div key={field.key}>
//                        <label className="block text-sm font-medium text-gray-700 mb-2">
//                          {getIconForField(field.key)}
//                          {field.label} {field.required ? '*' : ''}
//                        </label>
//                        <input
//                          type={field.type}
//                          name={field.key}
//                          value={formData[field.key] || ''}
//                          onChange={handleInputChange}
//                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
//                          }`}
//                          placeholder={`Enter ${field.label.toLowerCase()}`}
//                        />
//                        {errors[field.key] && (
//                          <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
//                        )}
//                      </div>
//                    ))}
//                  </div>
//                </div>
//              )}

//              {/* Documents Section */}
//              {groupedFields.documents && groupedFields.documents.length > 0 && (
//                <div className="mb-8">
//                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                    {groupedFields.documents.map(field => (
//                      <div key={field.key}>
//                        <label className="block text-sm font-medium text-gray-700 mb-2">
//                          {getIconForField(field.key)}
//                          {field.label} {field.required ? '*' : ''}
//                        </label>
//                        <input
//                          type={field.type}
//                          name={field.key}
//                          value={formData[field.key] || ''}
//                          onChange={handleInputChange}
//                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
//                          }`}
//                          placeholder={`Enter ${field.label.toLowerCase()}`}
//                        />
//                        {errors[field.key] && (
//                          <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
//                        )}
//                      </div>
//                    ))}
//                  </div>
//                </div>
//              )}

//             {/* Submit Error Display */}
//             {errors.submit && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <AlertCircle className="h-5 w-5 text-red-400" />
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-red-800">Error</h3>
//                     <div className="mt-2 text-sm text-red-700">
//                       <p>{errors.submit}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//              {/* Form Actions */}
//              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
//                <button
//                  type="submit"
//                  disabled={isSubmitting}
//                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-colors ${
//                    isSubmitting
//                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
//                      : 'bg-blue-600 text-white hover:bg-blue-700'
//                  }`}
//                >
//                  {isSubmitting ? (
//                    <>
//                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                      <span>Creating Bill...</span>
//                    </>
//                  ) : (
//                    <>
//                      <CheckCircle size={18} />
//                      <span>Create Bill</span>
//                    </>
//                  )}
//                </button>

//                <button
//                  type="button"
//                  onClick={handleCancel}
//                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                >
//                  Clear Form
//                </button>

//                {onClose ? (
//                  <button
//                    type="button"
//                    onClick={onClose}
//                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
//                  >
//                    <X size={18} />
//                    Cancel
//                  </button>
//                ) : (
//                  <Link
//                    to={`/customer/${customerId}/custom-bill-list`}
//                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
//                  >
//                    <X size={18} />
//                    Cancel
//                  </Link>
//                )}
//              </div>
//           </form>

//            {/* Help Text */}
//            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
//              <h3 className="text-sm font-medium text-blue-800 mb-2">Important Notes:</h3>
//              <div className="text-sm text-blue-700 space-y-2">
//                <div>
//                  <strong>Required Information:</strong>
//                  <ul className="list-disc list-inside ml-2 mt-1">
//                    <li>Fields marked with * are mandatory (Product ID is required)</li>
//                    <li>Fill in all relevant details for accurate record keeping</li>
//                  </ul>
//                </div>
//                <div>
//                  <strong>Data Types:</strong>
//                  <ul className="list-disc list-inside ml-2 mt-1">
//                    <li>Use appropriate formats for numbers</li>
//                    <li>Financial fields accept numeric values only</li>
//                  </ul>
//                </div>
//                <div>
//                  <strong>API Integration:</strong>
//                  <ul className="list-disc list-inside ml-2 mt-1">
//                    <li>Data will be sent to the backend API at POST /api/v1/bills</li>
//                    <li>Empty optional fields will be set to null</li>
//                  </ul>
//                </div>
//              </div>
//            </div>
//         </div>
//       </div>
//     </div>
//   );
// }







import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Save, X, Calendar, Truck, MapPin,
  DollarSign, FileText, CheckCircle,
  AlertCircle, TrendingUp, User, Package, Settings
} from 'lucide-react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useProduct } from '../../context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomBillRecord({
  selectedFields = [],
  onClose,
  onSubmit,
  productName,
  customer,
  productId
}) {
    const { id: customerId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { apiStates } = useProduct();

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Product auto-suggest states
    const [showProductSuggestions, setShowProductSuggestions] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [productInput, setProductInput] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Vehicle field mapping for data keys
    const vehicleFieldMapping = {
      vehicle_no: 'vehicle_no',
      driver_name: 'driver_name',
      vehicle_size: 'vehicle_size'
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

   const billId = location.state?.billId;
   const stateProductId = location.state?.productId;
   const stateProductName = location.state?.productName;
   const stateCustomer = location.state?.selectedCustomer;
   const billData = location.state?.billData;

   const currentProductId = productId || stateProductId;
   const currentProductName = productName || stateProductName;
   const currentCustomer = customer || stateCustomer;

   // All possible fields definition
   const allFields = [
     { key: 'product_id', label: 'Product ID', type: 'number', required: true, section: 'basic' },
     { key: 'category', label: 'Category', type: 'text', section: 'basic' },
     { key: 'vehicle_no', label: 'Vehicle No', type: 'text', section: 'basic' },
     { key: 'customer_name', label: 'Customer Name', type: 'text', section: 'basic' },
     { key: 'challan_no', label: 'Challan No', type: 'text', section: 'basic' },
     { key: 'distributor_name', label: 'Distributor Name', type: 'text', section: 'basic' },
     { key: 'dealer_name', label: 'Dealer Name', type: 'text', section: 'basic' },
     { key: 'driver_name', label: 'Driver Name', type: 'text', section: 'basic' },
     { key: 'vehicle_size', label: 'Vehicle Size', type: 'text', section: 'basic' },
     { key: 'from', label: 'From', type: 'text', section: 'route' },
     { key: 'destination', label: 'Destination', type: 'text', section: 'route' },
     { key: 'product', label: 'Product', type: 'text', section: 'cargo' },
     { key: 'portfolio', label: 'Portfolio', type: 'text', section: 'cargo' },
     { key: 'goods', label: 'Goods', type: 'text', section: 'cargo' },
     { key: 'quantity', label: 'Quantity', type: 'number', section: 'cargo' },
     { key: 'bike_qty', label: 'Bike Qty', type: 'number', section: 'cargo' },
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

   const validSelectedFields = selectedFields.length > 0
     ? selectedFields.map(fieldKey => {
         // Strip financial. prefix when finding field definition
         const cleanFieldKey = fieldKey.replace(/^financial\./, '');
         const field = allFields.find(f => f.key === cleanFieldKey);
         if (field) return { ...field, key: fieldKey }; // Keep original key for form data access
         return { key: fieldKey, label: cleanFieldKey.charAt(0).toUpperCase() + cleanFieldKey.slice(1), type: 'text', section: 'basic' };
       }).filter(Boolean)
     : allFields.filter(field => field.key !== 'id');

  const groupedFields = validSelectedFields.reduce((acc, field) => {
    const section = field.section || 'basic';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {});

  const sectionTitles = {
    basic: 'Basic Information',
    route: 'Route Information',
    cargo: 'Cargo Details',
    financial: 'Financial Information',
    documents: 'Documents'
  };

   const handleProductInputChange = (value) => {
     if (!selectedProduct) {
       setProductInput(value);
       const products = apiStates.product?.data?.data || [];
       if (value.trim() === '') {
         setFilteredProducts(products);
         setShowProductSuggestions(true);
         setHighlightedIndex(-1);
       } else {
         const filtered = products.filter(product =>
           product.name?.toLowerCase().includes(value.toLowerCase()) ||
           product.category?.toLowerCase().includes(value.toLowerCase())
         );
         setFilteredProducts(filtered);
         setShowProductSuggestions(true);
         setHighlightedIndex(-1);
       }
     }
   };

   const handleProductSelect = (product) => {
     setSelectedProduct(product);
     setFormData(prev => ({
       ...prev,
       product_id: product.id,
       product: product.name,
       category: product.category || prev.category,
       portfolio: product.portfolio || prev.portfolio,
       goods: product.goods || prev.goods
     }));
     setProductInput(product.name);
     setShowProductSuggestions(false);
     setHighlightedIndex(-1);

     if (errors.product) {
       setErrors(prev => ({
         ...prev,
         product: ''
       }));
     }
   };

  const handleProductKeyDown = (e) => {
    if (!showProductSuggestions || filteredProducts.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredProducts.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredProducts.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredProducts.length) {
          handleProductSelect(filteredProducts[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowProductSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

   const handleInputChange = (e) => {
     const { name, value } = e.target;

     setFormData(prev => ({
       ...prev,
       [name]: value
     }));

     if (name === 'product') {
       handleProductInputChange(value);
     }

     if (errors[name]) {
       setErrors(prev => ({
         ...prev,
         [name]: ''
       }));
     }

     if (errors.submit) {
       setErrors(prev => ({
         ...prev,
         submit: ''
       }));
     }
   };

   const validateForm = () => {
     const newErrors = {};

     validSelectedFields.forEach(field => {
       const value = formData[field.key];
       if (field.required) {
         if (!value || (typeof value === 'string' && value.trim() === '')) {
           newErrors[field.key] = `${field.label} is required`;
         }
       }
       if (field.type === 'number' && value !== undefined && value !== '' && value !== null && isNaN(Number(value))) {
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
       const payload = {};

       // Always include product_id (using customerId as per your backend)
       payload.product_id = Number(customerId);

       // Map form data to exact backend field names matching the JSON model
       const fieldMapping = {
         'financial.advance': 'advance',
         'financial.alt5': 'alt5',
         'financial.amount': 'amount',
         'financial.bodyFare': 'body_fare',
         'financial.dropping': 'dropping',
         'financial.due': 'due',
         'financial.fuelCost': 'fuel_cost',
         'financial.profit': 'profit',
         'financial.total': 'total',
         'financial.totalRate': 'total_rate',
         'financial.unloadCharge': 'unload_charge',
         'financial.vat10': 'vat10',
         'financial.vehicleRent': 'vehicle_rent',
         'financial.vehicleRentWithVATTax': 'vehicle_rent_with_vat_tax',
         'bikeQty': 'bike_qty',
         'challanNo': 'challan_no',
         'customerName': 'customer_name',
         'dealerName': 'dealer_name',
         'distributorName': 'distributor_name',
         'driverName': 'driver_name',
         'vehicleNo': 'vehicle_no',
         'vehicleSize': 'vehicle_size',
         'totalAmount': 'total_amount',
         'product_id': 'product_id',
         'quantity': 'quantity',
         'status': 'status',
         'product': 'product',
         'destination': 'destination',
         'from': 'from',
         'date': 'date',
         'id': 'id',
         'category': 'category',
         'co_number': 'co_number',
         'do_number': 'do_number',
         'dropping': 'dropping',
         'goods': 'goods',
         'portfolio': 'portfolio'
       };

       // Map all form data to backend model
       Object.keys(formData).forEach(key => {
         const value = formData[key];

         // Skip if value is undefined, null, or empty string
         if (value === undefined || value === null || value === '') {
           return;
         }

         // Get the backend key from mapping
         const backendKey = fieldMapping[key];
         if (!backendKey) return; // Skip unmapped fields

         // Define which fields should be strings (not numbers)
         const stringFields = [
           'challan_no', 'customer_name', 'dealer_name', 'distributor_name',
           'driver_name', 'vehicle_no', 'vehicle_size', 'product', 'destination',
           'from', 'status', 'date'
         ];

         // Convert to appropriate type
         if (stringFields.includes(backendKey)) {
           // Always treat as string
           const stringValue = String(value).trim();
           if (stringValue !== '') {
             payload[backendKey] = stringValue;
           }
         } else if (typeof value === 'number' || !isNaN(Number(value))) {
           const numValue = Number(value);
           if (!isNaN(numValue)) {
             payload[backendKey] = numValue;
           }
         } else {
           const trimmedValue = String(value).trim();
           if (trimmedValue !== '') {
             payload[backendKey] = trimmedValue;
           }
         }
       });

       console.log('Submitting payload:', payload);
       console.log('Customer ID:', customerId);

       const response = await axios.post('http://192.168.0.106:8080/api/v1/bills', payload, {
         headers: {
           'Content-Type': 'application/json'
         }
       });

       console.log('Bill created successfully:', response.data);
       setIsSuccess(true);

       setTimeout(() => {
         setFormData({});
         setIsSuccess(false);
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
    setShowProductSuggestions(false);
    setFilteredProducts([]);
    setHighlightedIndex(-1);
    setProductInput('');
    setSelectedProduct(null);
  };

  const getVehicleFieldOptions = (fieldKey) => {
    const vehicles = apiStates.vehicle?.data?.data || [];
    const dataKey = vehicleFieldMapping[fieldKey];
    if (!dataKey) return [];

    const uniqueValues = [...new Set(vehicles.map(vehicle => vehicle[dataKey]).filter(Boolean))];
    return uniqueValues.sort();
  };

  const handleVehicleFieldChange = (fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));

    if (errors[fieldKey]) {
      setErrors(prev => ({
        ...prev,
        [fieldKey]: ''
      }));
    }

    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: ''
      }));
    }
  };

   const isFieldDisabled = (fieldKey) => {
     if (fieldKey === 'product') return false;
     const productDependentFields = ['category', 'portfolio', 'goods'];
     if (productDependentFields.includes(fieldKey) && !selectedProduct) {
       return true;
     }
     return false;
   };

   const isFieldHidden = (fieldKey) => {
     // Always show category, portfolio, goods fields
     if (['category', 'portfolio', 'goods'].includes(fieldKey)) {
       return false;
     }
     // Hide fields that are not in the selected fields or are auto-filled
     if (!selectedFields.includes(fieldKey)) {
       return true;
     }
     return false;
   };

   const getIconForField = (fieldKey) => {
     if (fieldKey.includes('amount') || fieldKey.includes('total_rate') || fieldKey.includes('rent') || fieldKey.includes('unload_charge') || fieldKey.includes('fare') || fieldKey.includes('fuel_cost') || fieldKey.includes('vat10') || fieldKey.includes('alt5') || fieldKey.includes('dropping') || fieldKey.includes('advance') || fieldKey.includes('due') || fieldKey.includes('total') || fieldKey.includes('profit')) {
       return <DollarSign className="inline w-4 h-4 mr-1" />;
     }
     if (fieldKey.includes('vehicle_no')) {
       return <Truck className="inline w-4 h-4 mr-1" />;
     }
     if (fieldKey.includes('destination') || fieldKey.includes('distributor_name')) {
       return <MapPin className="inline w-4 h-4 mr-1" />;
     }
     if (fieldKey.includes('date')) {
       return <Calendar className="inline w-4 h-4 mr-1" />;
     }
     if (fieldKey.includes('driver_name') || fieldKey.includes('customer_name') || fieldKey.includes('dealer_name') || fieldKey.includes('distributor_name')) {
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


          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
             {groupedFields.basic && groupedFields.basic.length > 0 && (
               <div className="mb-8">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {groupedFields.basic.filter(field => !isFieldHidden(field.key)).map(field => (
                       <div key={field.key}>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           {getIconForField(field.key)}
                           {field.label} {field.required ? '*' : ''}
                         </label>
                         {field.key === 'product' ? (
                        <div className="relative">
                          <input
                            type={field.type || 'text'}
                            name={field.key}
                            value={productInput}
                            onChange={(e) => handleProductInputChange(e.target.value)}
                            onClick={() => {
                              if (!selectedProduct) {
                                const products = apiStates.product?.data?.data || [];
                                setFilteredProducts(products);
                                setShowProductSuggestions(true);
                                setHighlightedIndex(-1);
                              }
                            }}
                            onFocus={() => {
                              if (!selectedProduct) {
                                const products = apiStates.product?.data?.data || [];
                                setFilteredProducts(products);
                                setShowProductSuggestions(true);
                                setHighlightedIndex(-1);
                              }
                            }}
                            onBlur={() => {
                              setTimeout(() => setShowProductSuggestions(false), 200);
                            }}
                            onKeyDown={handleProductKeyDown}
                            readOnly={!!selectedProduct}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[field.key] ? 'border-red-300' : 'border-gray-300'
                            } ${selectedProduct ? 'bg-gray-100 cursor-pointer' : ''}`}
                            placeholder={selectedProduct ? selectedProduct.name : `Click to select ${field.label.toLowerCase()}`}
                          />
                          {showProductSuggestions && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {filteredProducts.length > 0 ? (
                                filteredProducts.map((product, index) => (
                                  <div
                                    key={product.id || index}
                                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                                      index === highlightedIndex ? 'bg-blue-100' : ''
                                    }`}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleProductSelect(product);
                                    }}
                                  >
                                    <div className="font-medium text-gray-900">{product.name}</div>
                                    {product.category && (
                                      <div className="text-sm text-gray-500">{product.category}</div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-gray-500">No records found</div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : ['vehicle_no', 'driver_name', 'vehicle_size'].includes(field.key) ? (
                        <AutocompleteInput
                          label={field.label}
                          value={formData[field.key] || ''}
                          onChange={(value) => setFormData(prev => ({ ...prev, [field.key]: value }))}
                          suggestions={vehicleSuggestions.map(v => v[field.key] || v[field.key.replace('_', '')] || '').filter(Boolean)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          icon={field.key.includes('vehicle') ? Truck : User}
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleInputChange}
                          disabled={isFieldDisabled(field.key)}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[field.key] ? 'border-red-300' : 'border-gray-300'
                          } ${isFieldDisabled(field.key) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder={isFieldDisabled(field.key) ? 'Select a product first' : `Enter ${field.label.toLowerCase()}`}
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
                         disabled={isFieldDisabled(field.key)}
                         className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                           errors[field.key] ? 'border-red-300' : 'border-gray-300'
                         } ${isFieldDisabled(field.key) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                         placeholder={isFieldDisabled(field.key) ? 'Select a product first' : `Enter ${field.label.toLowerCase()}`}
                       />
                       {errors[field.key] && (
                         <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
                       )}
                     </div>
                   ))}
                 </div>
               </div>
             )}

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
                   <li>Empty fields will not be included in submission</li>
                 </ul>
               </div>
               <div>
                 <strong>API Integration:</strong>
                 <ul className="list-disc list-inside ml-2 mt-1">
                   <li>Data will be sent to the backend API at POST /api/v1/bills</li>
                   <li>Only filled fields will be submitted</li>
                 </ul>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}