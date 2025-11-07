import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Loader2, AlertCircle, User, ArrowLeft, Edit2 } from 'lucide-react';

// API base URL
const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';
// const API_BASE_URL = 'http://localhost:5000';

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const Customer = () => {
  const { id, name } = useParams();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ selectedCustomerId: '', customerId: '', customerName: '', name: '' });
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState('');
  const [customername, setcustomername] = useState();
  const navigate = useNavigate();

  // Fetch customers on mount and handle customer details view
  useEffect(() => {
    const initializeComponent = async () => {
      await fetchCustomers();

      // If accessed via /customer/:id/:name route, fetch specific customer and products
      if (id && name) {
        try {
          // ✅ FIX: Use singular endpoint /customer (not /customers)
          const response = await fetch(`${API_BASE_URL}/customer/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
        
          const transformedData = {
            id: data.id,
            name: data.customerName || data.name || '',
            mobile: data.mobile || '',
            email: data.email || '',
            address: data.address || '',
            openingBalance: data.openingBalance || 0,
            dueBalance: data.dueBalance || 0,
            receivedMoney: data.receivedMoney || 0,
            totalTrips: data.totalTrips || 0,
            status: data.status || 'Active',
            joiningDate: data.joiningDate || new Date().toISOString().split('T')[0]
          };
          setSelectedCustomer(transformedData);

          // Fetch products for this customer
          const customerIdToUse = id;
          console.log(customerIdToUse)
          const productsRes = await fetch(`${API_BASE_URL}/products?company_id=${customerIdToUse}`);
          const productsData = await productsRes.json();

          const productsArray = Array.isArray(productsData)
            ? productsData
            : (productsData.data || []);

          const filteredProducts = productsArray.filter(
            (item) => item.company_id == customerIdToUse
          );

          setProducts(filteredProducts);
        } catch (err) {
          console.error('Error fetching customer details:', err);
          setError('Failed to fetch customer details.');
        }
      }
    };

    initializeComponent();
  }, [id, name]);
console.log(selectedCustomer)
console.log(name)
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      // ✅ FIX: Use singular endpoint /customer (not /customers)
      const response = await fetch(`${API_BASE_URL}/customer`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      if (Array.isArray(data)) {
        // Transform data to match expected format
        const transformedData = data.map(item => ({
          id: item.id,
          name: item.customerName || item.name || '',
          mobile: item.mobile || '',
          email: item.email || '',
          address: item.address || '',
          openingBalance: item.openingBalance || 0,
          dueBalance: item.dueBalance || 0,
          receivedMoney: item.receivedMoney || 0,
          totalTrips: item.totalTrips || 0,
          status: item.status || 'Active',
          joiningDate: item.joiningDate || new Date().toISOString().split('T')[0]
        }));
        setCustomers(transformedData);
      } else if (data && data.data && Array.isArray(data.data)) {
        const transformedData = data.data.map(item => ({
          id: item.id,
          name: item.customerName || item.name || '',
          mobile: item.mobile || '',
          email: item.email || '',
          address: item.address || '',
          openingBalance: item.openingBalance || 0,
          dueBalance: item.dueBalance || 0,
          receivedMoney: item.receivedMoney || 0,
          totalTrips: item.totalTrips || 0,
          status: item.status || 'Active',
          joiningDate: item.joiningDate || new Date().toISOString().split('T')[0]
        }));
        setCustomers(transformedData);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to fetch customers. Please try again.');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };


  const handleNameChange = (e) => {
    setFormData({
      ...formData,
      name: e.target.value
    });
    setErrorMessage(''); // Clear errors on change
  };

  // ✅ FIXED: handleCreateProduct function
const handleCreateProduct = async (e) => {
  e.preventDefault();
  if (!formData.selectedCustomerId || !formData.name.trim()) {
    setErrorMessage('Please select a customer and enter a name.');
    return;
  }

  try {
    setCreating(true);
    setErrorMessage('');
    const productData = {
      name: formData.name.trim(),
      company_id: parseInt(formData.customerId, 10)
    };
    console.log('Sending product ', productData);
    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${errorData.message || JSON.stringify(errorData)}`;
      } catch (e) {
        const errorText = await response.text();
        errorMessage += ` - ${errorText}`;
      }
      throw new Error(errorMessage);
    }
    
    // ✅ Handle different response formats
    let createdProductId = null;
    let createdProduct = null;
    
    try {
      // Try to parse as JSON first
      createdProduct = await response.json();
      console.log('Created product response (JSON):', createdProduct);
      
      // Try different ways to extract ID
      createdProductId = 
        createdProduct.id || 
        createdProduct.data?.id || 
        createdProduct.product_id ||
        createdProduct._id;
    } catch (jsonError) {
      // If JSON parsing fails, it might be plain text
      const textResponse = await response.text();
      console.log('Created product response (Text):', textResponse);
      
      // Try to extract ID from text response (if it contains ID)
      const idMatch = textResponse.match(/id[:\s]*["']?(\d+)["']?/i);
      if (idMatch) {
        createdProductId = parseInt(idMatch[1], 10);
      }
    }
    
    // ✅ If still no ID, fetch the latest product for this customer
    if (!createdProductId) {
      console.log('No ID in response, fetching latest product...');
      const productsResponse = await fetch(`${API_BASE_URL}/products?company_id=${formData.customerId}`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const products = Array.isArray(productsData) ? productsData : (productsData.data || []);
        if (products.length > 0) {
          // Sort by ID descending to get the latest
          products.sort((a, b) => (b.id || 0) - (a.id || 0));
          createdProductId = products[0].id;
        }
      }
    }
    
    if (!createdProductId) {
      throw new Error('Product ID could not be determined from API response');
    }

    setSuccessMessage(`Product '${formData.name}' has been created successfully for customer '${formData.customerName}'.`);

    // Navigate to trip-field page with product details
    navigate(`/customer/${formData.customerId}/trip-field`, {
      state: {
        productId: createdProductId,
        productName: formData.name,
        selectedCustomer: {
          id: formData.customerId,
          name: formData.customerName
        },
        successMessage: `Product '${formData.name}' created successfully!`
      }
    });
    
    // Reset form and close modal after a short delay
    setTimeout(() => {
      setFormData({ selectedCustomerId: '', customerId: '', customerName: '', name: '' });
      setIsModalOpen(false);
      setSuccessMessage('');
    }, 2000);
  } catch (err) {
    console.error('Error creating product:', err);
    setErrorMessage('Failed to create product. Please try again.');
  } finally {
    setCreating(false);
  }
};
  const handleCustomerClick = (customer) => {
    const slug = generateSlug(customer.name);
    navigate(`/customer/${customer.id}/${slug}`, {
      state: {
        selectedCustomer: {
          id: customer.id,
          name: customer.name,
          address: customer.address,
          slug
        },
        successMessage: `Customer '${customer.name}' has been selected for trip creation.`
      }
    });
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selectedCustomer = customers.find(c => c.id == selectedId);
    setFormData({
      selectedCustomerId: selectedId,
      customerId: selectedId,
      customerName: selectedCustomer ? selectedCustomer.name : '',
      name: formData.name // Preserve name
    });
    setErrorMessage(''); // Clear any previous errors
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="animate-spin h-8 w-8" />
          <span>Loading customers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchCustomers}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
            {id && (
              <button
                onClick={() => navigate('/customers')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Back to Customers
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show customer details if accessed via /customer/:id/:name route
  if (id && name && selectedCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate('/customers')}
                className="mr-4 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                <User className="h-8 w-8 text-purple-400" />
                Customer Details
              </h1>
            </div>
          </motion.div>

          {/* Customer Details Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg"
          >
            <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6 mx-auto">
              <span className="text-white font-bold text-3xl">
                {getInitials(name)}
              </span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {name}
              </h2>
              <p className="text-gray-300 text-lg mb-4">{selectedCustomer.address}</p>
              <div className="flex items-center justify-center">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCustomer.status === 'Active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            {/* Notification */}
            {notification && (
              <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 text-center">
                {notification}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              {/* <button
                onClick={() => navigate(`/customer/${selectedCustomer.id}/trip-field`)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Trip
              </button>

              <button
                onClick={() => navigate(`/customer/${selectedCustomer.id}/bill-field`)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Edit2 className="h-5 w-5" />
                Manage Bills
              </button> */}

              <button
                onClick={() => {
                  if (products.length > 0) {
                    const firstProductId = products[0].id;
                    navigate(`/customer/${firstProductId}/trips`,{
                        state: {
                      productId: firstProductId,
                      productName: products[0].name,
                      customerId: id,
                      customerName: selectedCustomer.name
                    }
                  });
                  } else {
                    setNotification('Please create a new product');
                    setTimeout(() => setNotification(''), 3000);
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <User className="h-5 w-5" />
                View Trips
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-400" />
            Customer Management
          </h1>
          <p className="text-gray-300">Manage your customers and create new ones</p>
        </motion.div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Customer Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
              <Plus className="h-12 w-12 mb-4 group-hover:rotate-90 transition-transform duration-300" />
              <h3 className="text-xl font-semibold mb-2">Create New Product</h3>
              <p className="text-green-100 text-center">Add a new product to your list</p>
            </div>
          </motion.div>

          {/* Existing Customers */}
          <AnimatePresence>
            {customers.map((customer) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group cursor-pointer"
                onClick={() => handleCustomerClick(customer)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4 mx-auto">
                    <span className="text-white font-bold text-xl">
                      {getInitials(customer.name)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 text-center">
                    {customer.name}
                  </h3>
                  <p className="text-gray-300 text-center mb-2">{customer.address}</p>
                  <div className="flex items-center justify-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {customers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <User className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">No customers yet</h3>
            <p className="text-gray-500 mb-6">Start by creating your first customer</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Create Customer
            </button>
          </motion.div>
        )}
      </div>

      {/* Create Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-xl">
                <h2 className="text-2xl font-bold">Create New Product</h2>
              </div>
              <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Customer *
                  </label>
                  <select
                    value={formData.selectedCustomerId}
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    value={formData.customerId}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    placeholder="Auto-filled from selected customer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Creating...
                      </>
                    ) : (
                      'Create Product'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({ selectedCustomerId: '', customerId: '', customerName: '', name: '' });
                      setSuccessMessage('');
                      setErrorMessage('');
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customer;