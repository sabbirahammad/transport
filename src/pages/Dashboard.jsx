import React from 'react';
import {
  Car,
  Users,
  Package,
  Wrench,
  AlertTriangle,
  Calendar,
  Shield,
  FileCheck,
  Plus,
  UserPlus,
  ClipboardList,
  FileText,
  MapPin,
  Bell,
  TrendingUp,
  DollarSign,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Mock data for charts and tables
const tripData = [
  { name: 'Mon', trips: 20 },
  { name: 'Tue', trips: 35 },
  { name: 'Wed', trips: 25 },
  { name: 'Thu', trips: 40 },
  { name: 'Fri', trips: 30 },
  { name: 'Sat', trips: 45 },
  { name: 'Sun', trips: 15 },
];

const fuelData = [
  { name: 'Jan', usage: 400 },
  { name: 'Feb', usage: 300 },
  { name: 'Mar', usage: 500 },
  { name: 'Apr', usage: 280 },
  { name: 'May', usage: 590 },
  { name: 'Jun', usage: 320 },
];

const incomeExpenseData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

const vehicleStatusData = [
  { name: 'Active', value: 60, color: '#10B981' },
  { name: 'In Maintenance', value: 20, color: '#F59E0B' },
  { name: 'Idle', value: 20, color: '#EF4444' },
];

const vehicleTableData = [
  { id: 1, vehicleNo: 'ABC-123', driver: 'John Doe', category: 'Truck', status: 'Active' },
  { id: 2, vehicleNo: 'XYZ-456', driver: 'Jane Smith', category: 'Van', status: 'In Maintenance' },
  { id: 3, vehicleNo: 'DEF-789', driver: 'Mike Johnson', category: 'Car', status: 'Active' },
  { id: 4, vehicleNo: 'GHI-012', driver: 'Sarah Wilson', category: 'Truck', status: 'Idle' },
];

const expiryData = [
  { type: 'License', expiry: '2023-12-15', daysLeft: 5 },
  { type: 'Insurance', expiry: '2023-12-20', daysLeft: 10 },
  { type: 'Fitness', expiry: '2023-12-10', daysLeft: 0 },
  { type: 'Permit', expiry: '2023-12-25', daysLeft: 15 },
];

const activities = [
  { id: 1, message: 'New vehicle added: ABC-123', time: '2 hours ago' },
  { id: 2, message: 'Driver changed for XYZ-456', time: '4 hours ago' },
  { id: 3, message: 'Maintenance completed for DEF-789', time: '1 day ago' },
  { id: 4, message: 'Alert: License expiring soon', time: '2 days ago' },
];

const Dashboard = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'In Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Idle':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your fleet operations.</p>
        </div>

        {/* Key Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">120</p>
              </div>
              <Car className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Drivers</p>
                <p className="text-2xl font-bold text-gray-900">85</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Running Trips</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Wrench className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Performance (Weekly)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tripData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="trips" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Usage Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#8884d8" />
                <Bar dataKey="expense" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Vehicle Overview Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Overview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicleTableData.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.vehicleNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.driver}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          vehicle.status
                        )}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                      <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Upcoming Expiry Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Expiries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {expiryData.map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <AlertTriangle className={`h-6 w-6 mr-3 ${item.daysLeft <= 5 ? 'text-red-500' : 'text-yellow-500'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.type} Expiry</p>
                  <p className="text-xs text-gray-500">{item.expiry} ({item.daysLeft} days left)</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Map View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Vehicle Locations</h3>
          <div className="h-64 rounded-lg overflow-hidden">
            <MapContainer center={[23.8103, 90.4125]} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[23.8103, 90.4125]}>
                <Popup>Vehicle ABC-123</Popup>
              </Marker>
              <Marker position={[23.8203, 90.4225]}>
                <Popup>Vehicle XYZ-456</Popup>
              </Marker>
            </MapContainer>
          </div>
        </motion.div>

        {/* Recent Activities and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <Bell className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Add Vehicle
              </button>
              <button className="flex items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300">
                <UserPlus className="h-5 w-5 mr-2" />
                Add Driver
              </button>
              <button className="flex items-center justify-center p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-300">
                <ClipboardList className="h-5 w-5 mr-2" />
                Create Trip
              </button>
              <button className="flex items-center justify-center p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300">
                <FileText className="h-5 w-5 mr-2" />
                Generate Report
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;