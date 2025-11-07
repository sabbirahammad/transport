import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, Plus, ArrowLeft, CheckCircle, AlertCircle, Loader,
  MapPin, DollarSign, Fuel, User, Phone, Calendar, FileText, Zap
} from 'lucide-react';
import { useProduct } from '../../../context/ProductContext';

export default function AddOutsideTrip() {
  const navigate = useNavigate();
  const { apiStates } = useProduct();

  // Extract vehicle data safely
  const vehicles = Array.isArray(apiStates.vehicle?.data?.data)
    ? apiStates.vehicle.data.data
    : Array.isArray(apiStates.vehicle?.data)
      ? apiStates.vehicle.data
      : [];

  const vehicleLoading = apiStates.vehicle?.loading || false;

  const [formData, setFormData] = useState({
    loadPoint: '',
    unloadPoint: '',
    rent: '',
    advance: '',
    tripCost: '',
    diesel: '',
    extraCost: '',
    dieselTaka: '',
    pamp: '',
    commission: '',
    month: '',
    vehicleName: '',
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Suggestions state
  const [vehicleSuggestions, setVehicleSuggestions] = useState([]);
  const [driverSuggestions, setDriverSuggestions] = useState([]);
  const [showVehicleSuggestions, setShowVehicleSuggestions] = useState(false);
  const [showDriverSuggestions, setShowDriverSuggestions] = useState(false);
  const [showVehicleNameSuggestions, setShowVehicleNameSuggestions] = useState(false);
  const [showDriverPhoneSuggestions, setShowDriverPhoneSuggestions] = useState(false);

  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // Reset suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowVehicleSuggestions(false);
      setShowDriverSuggestions(false);
      setShowVehicleNameSuggestions(false);
      setShowDriverPhoneSuggestions(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Load vehicle suggestions on component load
  useEffect(() => {
    if (vehicles.length > 0) {
      setVehicleSuggestions(vehicles);
    } else if (!vehicleLoading && apiStates.vehicle?.error) {
      console.error('Vehicle API error:', apiStates.vehicle.error);
      setVehicleSuggestions([]);
    }
  }, [vehicles, vehicleLoading, apiStates.vehicle?.error]);

  // Handle regular input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Vehicle Number with suggestions
  const handleVehicleNumberChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, vehicleNumber: value }));

    if (value.trim()) {
      const filtered = vehicles.filter(vehicle =>
        (vehicle.vehicle_no || '').toString().toLowerCase().includes(value.toLowerCase())
      );
      setVehicleSuggestions(filtered);
      setShowVehicleSuggestions(true);
    } else {
      setVehicleSuggestions([]);
      setShowVehicleSuggestions(false);
    }
  };
  // Handle Driver Name with suggestions
  const handleDriverNameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, driverName: value }));

    if (value.trim()) {
      const filtered = vehicles.filter(vehicle =>
        (vehicle.driver_name || '').toString().toLowerCase().includes(value.toLowerCase())
      );
      setDriverSuggestions(filtered);
      setShowDriverSuggestions(true);
    } else {
      setDriverSuggestions([]);
      setShowDriverSuggestions(false);
    }
  };

  // Handle Vehicle Name with suggestions
  const handleVehicleNameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, vehicleName: value }));

    if (value.trim()) {
      const filtered = vehicles.filter(vehicle =>
        (vehicle.vehicle_name || vehicle.owner || '').toString().toLowerCase().includes(value.toLowerCase())
      );
      setVehicleSuggestions(filtered);
      setShowVehicleNameSuggestions(true);
    } else {
      setVehicleSuggestions([]);
      setShowVehicleNameSuggestions(false);
    }
  };

  // Handle Driver Phone with suggestions
  const handleDriverPhoneChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, driverPhone: value }));

    if (value.trim()) {
      const filtered = vehicles.filter(vehicle =>
        (vehicle.driver_contact || vehicle.mobile || '').toString().toLowerCase().includes(value.toLowerCase())
      );
      setDriverSuggestions(filtered);
      setShowDriverPhoneSuggestions(true);
    } else {
      setDriverSuggestions([]);
      setShowDriverPhoneSuggestions(false);
    }
  };


  // Select a vehicle from suggestions
  const selectVehicle = (vehicle) => {
    setFormData({
      ...formData,
      vehicleNumber: vehicle.vehicle_no || vehicle.vehicle_number || '',
      vehicleName: vehicle.vehicle_name || vehicle.owner || '',
      driverName: vehicle.driver_name || '',
      driverPhone: vehicle.driver_contact || vehicle.mobile || '',
      licenseNumber: vehicle.license_number || '',
      vehicleType: vehicle.vehicle_type || ''
    });
    setShowVehicleSuggestions(false);
    setVehicleSuggestions([]);
  };

  // Select a driver from suggestions
  const selectDriver = (vehicle) => {
    setFormData({
      ...formData,
      driverName: vehicle.driver_name || '',
      driverPhone: vehicle.driver_contact || vehicle.mobile || ''
    });
    setShowDriverSuggestions(false);
    setDriverSuggestions([]);
  };

  // Select vehicle name from suggestions
  const selectVehicleName = (vehicle) => {
    setFormData({
      ...formData,
      vehicleName: vehicle.vehicle_name || vehicle.owner || '',
      vehicleNumber: vehicle.vehicle_no || vehicle.vehicle_number || '',
      driverName: vehicle.driver_name || '',
      driverPhone: vehicle.driver_contact || vehicle.mobile || '',
      licenseNumber: vehicle.license_number || '',
      vehicleType: vehicle.vehicle_type || ''
    });
    setShowVehicleNameSuggestions(false);
    setVehicleSuggestions([]);
  };

  // Select driver phone from suggestions
  const selectDriverPhone = (vehicle) => {
    setFormData({
      ...formData,
      driverPhone: vehicle.driver_contact || vehicle.mobile || '',
      driverName: vehicle.driver_name || '',
      vehicleNumber: vehicle.vehicle_no || vehicle.vehicle_number || '',
      vehicleName: vehicle.vehicle_name || vehicle.owner || '',
      licenseNumber: vehicle.license_number || '',
      vehicleType: vehicle.vehicle_type || ''
    });
    setShowDriverPhoneSuggestions(false);
    setDriverSuggestions([]);
  };


  // Validation
  const validateForm = () => {
    if (!formData.loadPoint.trim()) return 'Load Point is required';
    if (!formData.unloadPoint.trim()) return 'Unload Point is required';
    if (!formData.rent || isNaN(formData.rent) || parseFloat(formData.rent) < 0) return 'Valid Rent amount is required';
    if (!formData.advance || isNaN(formData.advance) || parseFloat(formData.advance) < 0) return 'Valid Advance amount is required';
    if (!formData.tripCost || isNaN(formData.tripCost) || parseFloat(formData.tripCost) < 0) return 'Valid Trip Cost is required';
    if (!formData.diesel || isNaN(formData.diesel) || parseFloat(formData.diesel) < 0) return 'Valid Diesel amount is required';
    if (!formData.extraCost || isNaN(formData.extraCost) || parseFloat(formData.extraCost) < 0) return 'Valid Extra Cost is required';
    if (!formData.dieselTaka || isNaN(formData.dieselTaka) || parseFloat(formData.dieselTaka) < 0) return 'Valid Diesel Taka is required';
    if (!formData.commission || isNaN(formData.commission) || parseFloat(formData.commission) < 0) return 'Valid Commission is required';
    if (!formData.month.trim()) return 'Month is required';
    if (!formData.vehicleName.trim()) return 'Vehicle Name is required';
    if (!formData.vehicleNumber.trim()) return 'Vehicle Number is required';
    if (!formData.driverName.trim()) return 'Driver Name is required';
    if (!formData.driverPhone.trim()) return 'Driver Phone is required';
    return null;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        load_point: formData.loadPoint.trim(),
        unload_point: formData.unloadPoint.trim(),
        rent: parseFloat(formData.rent),
        advance: parseFloat(formData.advance),
        trip_cost: parseFloat(formData.tripCost),
        diesel: parseFloat(formData.diesel),
        extra_cost: parseFloat(formData.extraCost),
        diesel_taka: parseFloat(formData.dieselTaka),
        pamp: formData.pamp.trim(),
        commission: parseFloat(formData.commission),
        month: formData.month.trim(),
        vehicle_name: formData.vehicleName.trim(),
        vehicle_number: formData.vehicleNumber.trim(),
        driver_name: formData.driverName.trim(),
        driver_phone: formData.driverPhone.trim(),
        ...(formData.note.trim() && { note: formData.note.trim() })
      };

      const response = await fetch(`${API_BASE_URL}/outside-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setToastMessage('Outside trip added successfully!');
      setToastType('success');
      setShowToast(true);

      setTimeout(() => {
        navigate('/outside');
      }, 2500);
    } catch (err) {
      console.error('Error adding trip:', err);
      setError(err.message || 'Failed to add trip. Please try again.');
      setToastMessage('Failed to add trip. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/outside');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Add Outside Trip</h1>
              <p className="text-blue-100 text-sm">Create a new outside trip record</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative px-4 sm:px-8 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 p-6 sm:p-8 border-b border-gray-200/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Trip Details</h2>
                  <p className="text-gray-600">Fill in the trip information below</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Trip Info */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Trip Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Load Point */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      Load Point <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="loadPoint"
                        value={formData.loadPoint}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter load point"
                        required
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Unload Point */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-500" />
                      Unload Point <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="unloadPoint"
                        value={formData.unloadPoint}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter unload point"
                        required
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Rent */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      Rent (৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="rent"
                        value={formData.rent}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Advance */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      Advance (৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="advance"
                        value={formData.advance}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Trip Cost */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      Trip Cost (৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="tripCost"
                        value={formData.tripCost}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Diesel */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-orange-500" />
                      Diesel <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="diesel"
                        value={formData.diesel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                      <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Extra Cost */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-red-500" />
                      Extra Cost (৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="extraCost"
                        value={formData.extraCost}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Diesel Taka */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-yellow-500" />
                      Diesel Taka (৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="dieselTaka"
                        value={formData.dieselTaka}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Pamp */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-500" />
                      Pamp
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pamp"
                        value={formData.pamp}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter pamp"
                      />
                      <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Commission */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-pink-500" />
                      Commission (৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="commission"
                        value={formData.commission}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Month */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-500" />
                      Month <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="month"
                        value={formData.month}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., January 2024"
                        required
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle & Driver */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Vehicle & Driver Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vehicle Name with Suggestions */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-cyan-500" />
                      Vehicle Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="vehicleName"
                        value={formData.vehicleName}
                        onChange={handleVehicleNameChange}
                        onFocus={() => {
                          if (vehicles.length > 0) {
                            setVehicleSuggestions(vehicles);
                            setShowVehicleNameSuggestions(true);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Start typing vehicle name"
                        required
                      />
                      <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      {vehicleLoading && (
                        <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                      )}

                      {showVehicleNameSuggestions && vehicleSuggestions.length > 0 && (
                        <div
                          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {vehicleSuggestions.map((vehicle, idx) => (
                            <div
                              key={vehicle.id || idx}
                              onClick={() => selectVehicleName(vehicle)}
                              className="px-4 py-3 hover:bg-cyan-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-800">{vehicle.vehicle_name || vehicle.owner}</div>
                              <div className="text-sm text-gray-500">{vehicle.vehicle_no || vehicle.vehicle_number}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showVehicleNameSuggestions && vehicleSuggestions.length === 0 && formData.vehicleName.trim() && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                          {vehicleLoading ? 'Loading vehicles...' : 'No vehicle found'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Number with Suggestions */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-500" />
                      Vehicle Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                     <input
                       type="text"
                       name="vehicleNumber"
                       value={formData.vehicleNumber}
                       onChange={handleVehicleNumberChange}
                       onFocus={() => {
                         if (vehicles.length > 0) {
                           setVehicleSuggestions(vehicles);
                           setShowVehicleSuggestions(true);
                         }
                       }}
                       onClick={(e) => e.stopPropagation()}
                       className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                       placeholder="Start typing vehicle number"
                       required
                     />
                      <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      {vehicleLoading && (
                        <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                      )}

                      {showVehicleSuggestions && vehicleSuggestions.length > 0 && (
                        <div
                          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {vehicleSuggestions.map((vehicle, idx) => (
                            <div
                              key={vehicle.id || idx}
                              onClick={() => selectVehicle(vehicle)}
                              className="px-4 py-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-800">{vehicle.vehicle_no || vehicle.vehicle_number}</div>
                              <div className="text-sm text-gray-500">{vehicle.vehicle_name || vehicle.owner}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showVehicleSuggestions && vehicleSuggestions.length === 0 && formData.vehicleNumber.trim() && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                          {vehicleLoading ? 'Loading vehicles...' : 'No vehicle found'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Driver Name with Suggestions */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-violet-500" />
                      Driver Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="driverName"
                        value={formData.driverName}
                        onChange={handleDriverNameChange}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Start typing driver name (optional)"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                      {showDriverSuggestions && driverSuggestions.length > 0 && (
                        <div
                          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {driverSuggestions.map((vehicle, idx) => (
                            <div
                              key={vehicle.id || idx}
                              onClick={() => selectDriver(vehicle)}
                              className="px-4 py-3 hover:bg-violet-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-800">{vehicle.driver_name}</div>
                              <div className="text-sm text-gray-500">{vehicle.vehicle_no || vehicle.vehicle_number}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showDriverSuggestions && driverSuggestions.length === 0 && formData.driverName.trim() && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                          No driver found
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Driver Phone with Suggestions */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-rose-500" />
                      Driver Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="driverPhone"
                        value={formData.driverPhone}
                        onChange={handleDriverPhoneChange}
                        onFocus={() => {
                          if (vehicles.length > 0) {
                            setDriverSuggestions(vehicles);
                            setShowDriverPhoneSuggestions(true);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                        placeholder="Start typing driver phone"
                        required
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      {vehicleLoading && (
                        <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                      )}

                      {showDriverPhoneSuggestions && driverSuggestions.length > 0 && (
                        <div
                          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {driverSuggestions.map((vehicle, idx) => (
                            <div
                              key={vehicle.id || idx}
                              onClick={() => selectDriverPhone(vehicle)}
                              className="px-4 py-3 hover:bg-rose-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-800">{vehicle.driver_contact || vehicle.mobile}</div>
                              <div className="text-sm text-gray-500">{vehicle.driver_name}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showDriverPhoneSuggestions && driverSuggestions.length === 0 && formData.driverPhone.trim() && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500">
                          {vehicleLoading ? 'Loading vehicles...' : 'No driver found'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg shadow-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <label className="text-lg font-semibold text-gray-800">Additional Notes</label>
                </div>
                <div className="relative">
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                    placeholder="Enter any additional notes (optional)"
                  />
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 disabled:opacity-50 font-bold text-lg shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      Adding Trip...
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Add Trip
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 font-bold text-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-full duration-500">
          <div className={`flex items-center gap-4 px-8 py-5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            toastType === 'success'
              ? 'bg-gradient-to-r from-green-50/90 to-emerald-50/90 border-green-200/50 text-green-800'
              : 'bg-gradient-to-r from-red-50/90 to-pink-50/90 border-red-200/50 text-red-800'
          }`}>
            <div className={`p-3 rounded-full ${
              toastType === 'success'
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-red-500 to-pink-600'
            }`}>
              {toastType === 'success' ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <AlertCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <p className="font-semibold text-lg">{toastMessage}</p>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 hover:opacity-70 p-2 rounded-full hover:bg-black/10"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}