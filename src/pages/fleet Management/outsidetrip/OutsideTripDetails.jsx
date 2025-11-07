import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Truck, MapPin, DollarSign, Calendar,
  User, Phone, Fuel, Settings, ChevronRight,
  Clock, Activity, AlertCircle
} from 'lucide-react';

export default function OutsideTripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/outside-trip/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Trip details:', data);

        // Handle different API response structures (similar to the list endpoint)
        const tripData = data.data || data.note;

        // Map API response to expected fields
        const mappedTrip = {
          id: tripData.id,
          loadPoint: tripData.load_point || 'N/A',
          unloadPoint: tripData.unload_point || 'N/A',
          rent: tripData.rent || 0,
          advance: tripData.advance || 0,
          tripCost: tripData.trip_cost || 0,
          diesel: tripData.diesel || 0,
          extraCost: tripData.extra_cost || 0,
          dieselTaka: tripData.diesel_taka || 0,
          pamp: tripData.pamp || 'N/A',
          commission: tripData.commission || 0,
          month: tripData.month || 'N/A',
          vehicleName: tripData.vehicle_name || 'N/A',
          vehicleNumber: tripData.vehicle_number || 'N/A',
          driverName: tripData.driver_name || 'N/A',
          driverPhone: tripData.driver_phone || 'N/A',
          created_at: tripData.created_at,
          updated_at: tripData.updated_at,
        };

        setTrip(mappedTrip);
      } catch (err) {
        console.error('Error fetching trip details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTripDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-xl font-semibold mb-2">Error loading trip details</p>
          <p className="text-gray-600">{error}</p>
          <Link
            to="/outside"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Trips
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Truck size={64} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-xl">Trip not found</p>
          <Link
            to="/outside"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/outside"
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div className="p-3 bg-white/20 rounded-xl">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Trip Details</h1>
              <p className="text-blue-100 text-sm">Detailed information for Trip #{trip.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Trip Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <DollarSign className="text-white" size={24} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 mb-1">৳{trip.rent?.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-600">Total Rent</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                  <Activity className="text-white" size={24} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 mb-1">৳{trip.tripCost?.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-600">Trip Cost</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                  <Fuel className="text-white" size={24} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 mb-1">{trip.diesel}</p>
                <p className="text-sm font-medium text-gray-600">Diesel (L)</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                  <DollarSign className="text-white" size={24} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 mb-1">৳{trip.advance?.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-600">Advance</p>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trip Information */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Trip Information</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Load Point</span>
                  <span className="text-gray-800 font-semibold">{trip.loadPoint}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Unload Point</span>
                  <span className="text-gray-800 font-semibold">{trip.unloadPoint}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Month</span>
                  <span className="text-gray-800 font-semibold">{trip.month}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Pamp</span>
                  <span className="text-gray-800 font-semibold">{trip.pamp}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Commission</span>
                  <span className="text-gray-800 font-semibold">৳{trip.commission?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Extra Cost</span>
                  <span className="text-gray-800 font-semibold">৳{trip.extraCost?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Vehicle & Driver Information */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Vehicle & Driver</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Vehicle Name</span>
                  <span className="text-gray-800 font-semibold">{trip.vehicleName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Vehicle Number</span>
                  <span className="text-gray-800 font-semibold">{trip.vehicleNumber}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Driver Name</span>
                  <span className="text-gray-800 font-semibold">{trip.driverName}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Driver Phone</span>
                  <span className="text-gray-800 font-semibold">{trip.driverPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Financial Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <p className="text-2xl font-bold text-blue-600 mb-1">৳{trip.rent?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                <p className="text-2xl font-bold text-red-600 mb-1">৳{(trip.tripCost + trip.extraCost + trip.dieselTaka)?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Expenses</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <p className="text-2xl font-bold text-green-600 mb-1">৳{(trip.rent - trip.tripCost - trip.extraCost - trip.dieselTaka)?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Net Profit</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Timestamps</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Created At</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(trip.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Updated At</p>
                <p className="text-lg font-semibold text-gray-800">
                  {new Date(trip.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}