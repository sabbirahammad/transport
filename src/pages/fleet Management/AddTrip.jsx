import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';

export default function AddTrip() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Basic fields
    sl: '',
    date: new Date().toISOString().split('T')[0],
    cash: '',

    // Trip details
    destination: '',
    totalRate: '',
    advance: '',
    due: '',
    total: '',
    vat: '',
    profit: '',

    // Vehicle information
    vehicleNo: '',
    dealerName: '',
    doSi: '',
    coU: '',

    // Additional details
    bike: '',
    unloadCharge: '',
    vehicleRateWithVatTax: '',
    totalAmount: '',
    extraCost: '',

    // Status
    status: 'Pending'
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.sl.trim()) newErrors.sl = 'SL is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.cash) {
      newErrors.cash = 'Cash is required';
    } else if (isNaN(formData.cash) || Number(formData.cash) < 0) {
      newErrors.cash = 'Invalid cash amount';
    }

    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.totalRate) {
      newErrors.totalRate = 'Total rate is required';
    } else if (isNaN(formData.totalRate) || Number(formData.totalRate) < 0) {
      newErrors.totalRate = 'Invalid total rate';
    }
    if (!formData.advance) {
      newErrors.advance = 'Advance is required';
    } else if (isNaN(formData.advance) || Number(formData.advance) < 0) {
      newErrors.advance = 'Invalid advance amount';
    }
    if (!formData.due) {
      newErrors.due = 'Due amount is required';
    } else if (isNaN(formData.due) || Number(formData.due) < 0) {
      newErrors.due = 'Invalid due amount';
    }
    if (!formData.total) {
      newErrors.total = 'Total is required';
    } else if (isNaN(formData.total) || Number(formData.total) < 0) {
      newErrors.total = 'Invalid total amount';
    }
    if (!formData.vat) {
      newErrors.vat = 'VAT is required';
    } else if (isNaN(formData.vat) || Number(formData.vat) < 0) {
      newErrors.vat = 'Invalid VAT amount';
    }
    if (!formData.profit) {
      newErrors.profit = 'Profit is required';
    } else if (isNaN(formData.profit) || Number(formData.profit) < 0) {
      newErrors.profit = 'Invalid profit amount';
    }

    if (!formData.vehicleNo.trim()) newErrors.vehicleNo = 'Vehicle number is required';
    if (!formData.dealerName.trim()) newErrors.dealerName = 'Dealer name is required';
    if (!formData.doSi.trim()) newErrors.doSi = 'DO (SI) is required';
    if (!formData.coU.trim()) newErrors.coU = 'CO (U) is required';

    if (!formData.bike) {
      newErrors.bike = 'Bike quantity is required';
    } else if (isNaN(formData.bike) || Number(formData.bike) < 0) {
      newErrors.bike = 'Invalid bike quantity';
    }
    if (!formData.unloadCharge) {
      newErrors.unloadCharge = 'Unload charge is required';
    } else if (isNaN(formData.unloadCharge) || Number(formData.unloadCharge) < 0) {
      newErrors.unloadCharge = 'Invalid unload charge';
    }
    if (!formData.vehicleRateWithVatTax) {
      newErrors.vehicleRateWithVatTax = 'Vehicle rate is required';
    } else if (isNaN(formData.vehicleRateWithVatTax) || Number(formData.vehicleRateWithVatTax) < 0) {
      newErrors.vehicleRateWithVatTax = 'Invalid vehicle rate';
    }
    if (!formData.totalAmount) {
      newErrors.totalAmount = 'Total amount is required';
    } else if (isNaN(formData.totalAmount) || Number(formData.totalAmount) < 0) {
      newErrors.totalAmount = 'Invalid total amount';
    }
    if (!formData.extraCost) {
      newErrors.extraCost = 'Extra cost is required';
    } else if (isNaN(formData.extraCost) || Number(formData.extraCost) < 0) {
      newErrors.extraCost = 'Invalid extra cost';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Trip added:', formData);
      alert('Trip added successfully!');

      // Reset form
      setFormData({
        sl: '',
        date: new Date().toISOString().split('T')[0],
        cash: '',
        destination: '',
        totalRate: '',
        advance: '',
        due: '',
        total: '',
        vat: '',
        profit: '',
        vehicleNo: '',
        dealerName: '',
        doSi: '',
        coU: '',
        bike: '',
        unloadCharge: '',
        vehicleRateWithVatTax: '',
        totalAmount: '',
        extraCost: '',
        status: 'Pending'
      });
      setErrors({});

      // Navigate back to trip list
      navigate('/trips');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add New Trip</h2>
              <button
                onClick={() => navigate('/trips')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Trips
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sl"
                    value={formData.sl}
                    onChange={handleChange}
                    placeholder="Enter SL"
                    className={`w-full px-4 py-2.5 border ${
                      errors.sl ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.sl && (
                    <p className="text-red-500 text-xs mt-1">{errors.sl}</p>
                  )}
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cash <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="cash"
                    value={formData.cash}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.cash ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.cash && (
                    <p className="text-red-500 text-xs mt-1">{errors.cash}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Trip Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Enter destination"
                    className={`w-full px-4 py-2.5 border ${
                      errors.destination ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.destination && (
                    <p className="text-red-500 text-xs mt-1">{errors.destination}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Rate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalRate"
                    value={formData.totalRate}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.totalRate ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.totalRate && (
                    <p className="text-red-500 text-xs mt-1">{errors.totalRate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="advance"
                    value={formData.advance}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.advance ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.advance && (
                    <p className="text-red-500 text-xs mt-1">{errors.advance}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="due"
                    value={formData.due}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.due ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.due && (
                    <p className="text-red-500 text-xs mt-1">{errors.due}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="total"
                    value={formData.total}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.total ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.total && (
                    <p className="text-red-500 text-xs mt-1">{errors.total}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    20% VAT <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="vat"
                    value={formData.vat}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.vat ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.vat && (
                    <p className="text-red-500 text-xs mt-1">{errors.vat}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="profit"
                    value={formData.profit}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.profit ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.profit && (
                    <p className="text-red-500 text-xs mt-1">{errors.profit}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleChange}
                    placeholder="DHK-METRO-1234"
                    className={`w-full px-4 py-2.5 border ${
                      errors.vehicleNo ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.vehicleNo && (
                    <p className="text-red-500 text-xs mt-1">{errors.vehicleNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dealer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dealerName"
                    value={formData.dealerName}
                    onChange={handleChange}
                    placeholder="Enter dealer name"
                    className={`w-full px-4 py-2.5 border ${
                      errors.dealerName ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.dealerName && (
                    <p className="text-red-500 text-xs mt-1">{errors.dealerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DO (SI) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="doSi"
                    value={formData.doSi}
                    onChange={handleChange}
                    placeholder="DO-2024-001"
                    className={`w-full px-4 py-2.5 border ${
                      errors.doSi ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.doSi && (
                    <p className="text-red-500 text-xs mt-1">{errors.doSi}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CO (U) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="coU"
                    value={formData.coU}
                    onChange={handleChange}
                    placeholder="CO-2024-001"
                    className={`w-full px-4 py-2.5 border ${
                      errors.coU ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.coU && (
                    <p className="text-red-500 text-xs mt-1">{errors.coU}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bike <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bike"
                    value={formData.bike}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.bike ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.bike && (
                    <p className="text-red-500 text-xs mt-1">{errors.bike}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unload Charge <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="unloadCharge"
                    value={formData.unloadCharge}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.unloadCharge ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.unloadCharge && (
                    <p className="text-red-500 text-xs mt-1">{errors.unloadCharge}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Rate (VAT + Tax) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="vehicleRateWithVatTax"
                    value={formData.vehicleRateWithVatTax}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.vehicleRateWithVatTax ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.vehicleRateWithVatTax && (
                    <p className="text-red-500 text-xs mt-1">{errors.vehicleRateWithVatTax}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.totalAmount ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.totalAmount && (
                    <p className="text-red-500 text-xs mt-1">{errors.totalAmount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Extra Cost <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="extraCost"
                    value={formData.extraCost}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full px-4 py-2.5 border ${
                      errors.extraCost ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.extraCost && (
                    <p className="text-red-500 text-xs mt-1">{errors.extraCost}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-medium rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all shadow-sm flex items-center gap-2"
              >
                <Save size={18} />
                Save Trip
              </button>
              <button
                onClick={() => navigate('/trips')}
                className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}