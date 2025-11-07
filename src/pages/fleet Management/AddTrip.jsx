import React, { useState } from 'react';
import {
  Plus, X, Truck, Save, ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    load_point: '',
    unload_point: '',
    rent: '',
    advance: '',
    trip_cost: '',
    diesel: '',
    extra_cost: '',
    diesel_taka: '',
    pamp: '',
    commission: '',
    month: '',
    vehicle_name: '',
    vehicle_number: '',
    driver_name: '',
    driver_phone: ''
  });

  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/outside-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          load_point: formData.load_point,
          unload_point: formData.unload_point,
          rent: parseFloat(formData.rent) || 0,
          advance: parseFloat(formData.advance) || 0,
          trip_cost: parseFloat(formData.trip_cost) || 0,
          diesel: parseFloat(formData.diesel) || 0,
          extra_cost: parseFloat(formData.extra_cost) || 0,
          diesel_taka: parseFloat(formData.diesel_taka) || 0,
          pamp: formData.pamp,
          commission: parseFloat(formData.commission) || 0,
          month: formData.month,
          vehicle_name: formData.vehicle_name,
          vehicle_number: formData.vehicle_number,
          driver_name: formData.driver_name,
          driver_phone: formData.driver_phone,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Trip added successfully:', result);

      // Reset form
      setFormData({
        load_point: '',
        unload_point: '',
        rent: '',
        advance: '',
        trip_cost: '',
        diesel: '',
        extra_cost: '',
        diesel_taka: '',
        pamp: '',
        commission: '',
        month: '',
        vehicle_name: '',
        vehicle_number: '',
        driver_name: '',
        driver_phone: ''
      });

      // Navigate back to trips list
      navigate('/outsidetrip');
    } catch (error) {
      console.error('Error adding trip:', error);
      alert('Failed to add trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">Add Outside Trip</h1>
              <p className="text-blue-100 text-sm">Create a new outside trip record</p>
            </div>
          </div>
          <Link
            to="/outsidetrip"
            className="flex items-center gap-3 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            <ArrowLeft size={20} />
            <span>Back to Trips</span>
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-8">
        {/* Enhanced Main Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Enhanced Action Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Trip Information</h2>
                <p className="text-gray-600">Fill in the details for the new outside trip</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-8">
            {/* Trip Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Load Point *</label>
                  <input
                    type="text"
                    name="load_point"
                    value={formData.load_point}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter load point"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unload Point *</label>
                  <input
                    type="text"
                    name="unload_point"
                    value={formData.unload_point}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter unload point"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rent (৳) *</label>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advance (৳)</label>
                  <input
                    type="number"
                    name="advance"
                    value={formData.advance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trip Cost (৳)</label>
                  <input
                    type="number"
                    name="trip_cost"
                    value={formData.trip_cost}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diesel</label>
                  <input
                    type="number"
                    name="diesel"
                    value={formData.diesel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Extra Cost (৳)</label>
                  <input
                    type="number"
                    name="extra_cost"
                    value={formData.extra_cost}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diesel Taka (৳)</label>
                  <input
                    type="number"
                    name="diesel_taka"
                    value={formData.diesel_taka}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pamp</label>
                  <input
                    type="text"
                    name="pamp"
                    value={formData.pamp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter pamp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission (৳)</label>
                  <input
                    type="number"
                    name="commission"
                    value={formData.commission}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                  <input
                    type="text"
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., January 2024"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle & Driver Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle & Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name *</label>
                  <input
                    type="text"
                    name="vehicle_name"
                    value={formData.vehicle_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter vehicle name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number *</label>
                  <input
                    type="text"
                    name="vehicle_number"
                    value={formData.vehicle_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter vehicle number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name *</label>
                  <input
                    type="text"
                    name="driver_name"
                    value={formData.driver_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter driver name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Driver Phone</label>
                  <input
                    type="text"
                    name="driver_phone"
                    value={formData.driver_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter driver phone"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Trip</span>
                  </>
                )}
              </button>
              <Link
                to="/outsidetrip"
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}