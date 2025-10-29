import React, { useState } from 'react';
import { ArrowLeft, Calendar, FileText, Truck, DollarSign, Package, Hash, Building, Image, CheckCircle, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddPurchase() {
  const [formData, setFormData] = useState({
    // Basic Information
    orderId: '',
    supplierName: '',
    orderDate: '',
    deliveryDate: '',

    // Purchase Details
    items: '',
    quantity: '',
    category: '',
    totalAmount: '',

    // Additional Information
    vehicleNo: '',
    notes: '',

    // System Information
    paymentStatus: 'Pending',
    billImage: 'https://via.placeholder.com/150x150?text=Bill+Image',
    billImageFile: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = [
    'Automotive Parts',
    'Vehicle Parts',
    'Engine Parts',
    'Brake System',
    'Lubricants',
    'Electrical Parts',
    'Body Parts',
    'Accessories',
    'Tools & Equipment',
    'Other'
  ];

  const paymentStatuses = ['Paid', 'Pending', 'Overdue'];

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
    if (!formData.orderId.trim()) {
      newErrors.orderId = 'Order ID is required';
    }

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Supplier name is required';
    }

    if (!formData.orderDate) {
      newErrors.orderDate = 'Order date is required';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    }

    // Purchase Details Validation
    if (!formData.items.trim()) {
      newErrors.items = 'Items description is required';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.totalAmount) {
      newErrors.totalAmount = 'Total amount is required';
    } else if (isNaN(formData.totalAmount) || parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Total amount must be a valid positive number';
    }

    // Additional Information Validation
    if (!formData.vehicleNo.trim()) {
      newErrors.vehicleNo = 'Vehicle number is required';
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
      // Prepare data for API - format dates properly for API
      const submitData = {
        order_id: formData.orderId,
        supplier_name: formData.supplierName,
        order_date: formData.orderDate ? `${formData.orderDate}T00:00:00Z` : null,
        delivery_date: formData.deliveryDate ? `${formData.deliveryDate}T00:00:00Z` : null,
        items: formData.items,
        quantity: formData.quantity,
        category: formData.category,
        total_amount: parseFloat(formData.totalAmount),
        vehicle_no: formData.vehicleNo,
        notes: formData.notes,
        payment_status: formData.paymentStatus,
        bill_image: formData.billImage
      };

      // Make API call to add purchase
      const response = await fetch('http://192.168.0.106:8080/api/v1/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Purchase added successfully:', result);

      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          // Basic Information
          orderId: '',
          supplierName: '',
          orderDate: '',
          deliveryDate: '',

          // Purchase Details
          items: '',
          quantity: '',
          category: '',
          totalAmount: '',

          // Additional Information
          vehicleNo: '',
          notes: '',

          // System Information
          paymentStatus: 'Pending',
          billImage: 'https://via.placeholder.com/150x150?text=Bill+Image',
          billImageFile: null
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding purchase:', error);

      // Handle different types of errors
      let errorMessage = 'Failed to add purchase. Please try again.';

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
      // Basic Information
      orderId: '',
      supplierName: '',
      orderDate: '',
      deliveryDate: '',

      // Purchase Details
      items: '',
      quantity: '',
      category: '',
      totalAmount: '',

      // Additional Information
      vehicleNo: '',
      notes: '',

      // System Information
      paymentStatus: 'Pending',
      billImage: 'https://via.placeholder.com/150x150?text=Bill+Image',
      billImageFile: null
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Added Successfully!</h2>
            <p className="text-gray-600">The new purchase has been added to the system.</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/purchase"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Purchase List
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Another Purchase
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
            to="/purchase"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Purchase List</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">Add New Purchase</h1>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Bill Image Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={formData.billImage}
                  alt="Bill"
                  className="w-20 h-20 rounded-lg object-cover ring-4 ring-blue-100"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData(prev => ({ ...prev, billImageFile: file }));
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setFormData(prev => ({ ...prev, billImage: e.target.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Upload size={16} />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Purchase Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new purchase</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {/* Bill Image Upload Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill Image</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={formData.billImage}
                    alt="Bill"
                    className="w-32 h-32 rounded-lg object-cover ring-4 ring-blue-100"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData(prev => ({ ...prev, billImageFile: file }));
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setFormData(prev => ({ ...prev, billImage: e.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Upload size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Click on the image to upload bill image</p>
                  <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="inline w-4 h-4 mr-1" />
                    Order ID *
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.orderId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter order ID"
                  />
                  {errors.orderId && (
                    <p className="mt-1 text-sm text-red-600">{errors.orderId}</p>
                  )}
                </div>

                {/* Supplier Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline w-4 h-4 mr-1" />
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.supplierName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter supplier name"
                  />
                  {errors.supplierName && (
                    <p className="mt-1 text-sm text-red-600">{errors.supplierName}</p>
                  )}
                </div>

                {/* Order Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Order Date *
                  </label>
                  <input
                    type="date"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.orderDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.orderDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.orderDate}</p>
                  )}
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Delivery Date *
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.deliveryDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.deliveryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Purchase Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Items */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="inline w-4 h-4 mr-1" />
                    Items *
                  </label>
                  <textarea
                    name="items"
                    value={formData.items}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.items ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter items purchased (e.g., Engine Oil, Brake Pads, Filters)"
                  />
                  {errors.items && (
                    <p className="mt-1 text-sm text-red-600">{errors.items}</p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.quantity ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter quantity (e.g., 50 units)"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Total Amount (৳) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.totalAmount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter total amount"
                  />
                  {errors.totalAmount && (
                    <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
                  )}
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paymentStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Truck className="inline w-4 h-4 mr-1" />
                    Vehicle No *
                  </label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehicleNo ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter vehicle number"
                  />
                  {errors.vehicleNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleNo}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter additional notes or comments"
                  />
                </div>
              </div>
            </div>

            {/* Submit Error Display */}
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
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
                    <span>Adding Purchase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Add Purchase</span>
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
                to="/purchase"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Important Notes:</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <div>
                <strong>Required Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>All fields marked with * are mandatory</li>
                  <li>Basic details: Order ID, supplier name, order date, delivery date</li>
                  <li>Purchase details: Items, quantity, category, total amount</li>
                  <li>Additional: Vehicle number</li>
                </ul>
              </div>
              <div>
                <strong>Bill Image:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Upload clear image of the purchase bill</li>
                  <li>Supported formats: JPG, PNG, GIF (Max 5MB)</li>
                  <li>Image will be stored for record keeping</li>
                </ul>
              </div>
              <div>
                <strong>Payment Status:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Set appropriate payment status</li>
                  <li>Update status as payments are made</li>
                  <li>Overdue items will be highlighted in red</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}