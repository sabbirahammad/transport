import React, { useState, useRef } from 'react';
import {
  Search, Plus, Filter, Download, Upload, RefreshCw,
  Edit2, Trash2, Eye, Phone, Mail, MapPin, DollarSign,
  TrendingUp, FileText, Printer, MoreVertical, AlertCircle,
  Users, User, ChevronLeft, ChevronRight, X, Truck, Activity,
  Clock, Gauge, Fuel, Calendar, Camera, Settings,
  BarChart3, PieChart, Star, Award, Zap, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Outsidetrip() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();

  // API base URL
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // Trip state
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch trips from API
  const fetchTrips = async (page = 1, search = '', filter = 'all') => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/outside-trip`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Outside Trip API Response:', data);

      // Handle different API response structures
      const tripsData = data.trips || data.data || data.results || [];
      console.log('Raw API response:', data);
      console.log('Trips data array:', tripsData);

      // Map API response to expected fields
      const mappedTrips = tripsData.map((trip, index) => ({
        id: trip.id,
        loadPoint: trip.load_point || 'N/A',
        unloadPoint: trip.unload_point || 'N/A',
        rent: trip.rent || 0,
        advance: trip.advance || 0,
        tripCost: trip.trip_cost || 0,
        diesel: trip.diesel || 0,
        extraCost: trip.extra_cost || 0,
        dieselTaka: trip.diesel_taka || 0,
        pamp: trip.pamp || 'N/A',
        commission: trip.commission || 0,
        month: trip.month || 'N/A',
        vehicleName: trip.vehicle_name || 'N/A',
        vehicleNumber: trip.vehicle_number || 'N/A',
        driverName: trip.driver_name || 'N/A',
        driverPhone: trip.driver_phone || 'N/A',
        created_at: trip.created_at,
        updated_at: trip.updated_at,
      }));

      setTrips(mappedTrips);
      setTotalPages(data.total_pages || Math.ceil((data.total || data.count || 0) / itemsPerPage));
      setTotalItems(data.total || data.count || 0);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError(err.message);
      setTrips([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Trips',
      value: totalItems.toString(),
      icon: Truck,
      color: 'blue',
      trend: '+5',
      bgGradient: 'from-blue-500 to-blue-600',
      description: 'All outside trips'
    },
    {
      label: 'Active Trips',
      value: trips.length.toString(),
      icon: Activity,
      color: 'green',
      trend: '+3',
      bgGradient: 'from-green-500 to-green-600',
      description: 'Currently active'
    },
    {
      label: 'Total Revenue',
      value: trips.reduce((sum, trip) => sum + (trip.rent || 0), 0).toLocaleString(),
      icon: DollarSign,
      color: 'purple',
      trend: '+8',
      bgGradient: 'from-purple-500 to-purple-600',
      description: 'Total trip revenue'
    },
    {
      label: 'Avg Trip Cost',
      value: trips.length > 0 ? Math.round(trips.reduce((sum, trip) => sum + (trip.tripCost || 0), 0) / trips.length).toLocaleString() : '0',
      icon: TrendingUp,
      color: 'orange',
      trend: '+2',
      bgGradient: 'from-orange-500 to-orange-600',
      description: 'Average cost per trip'
    }
  ];

  const handleEditTrip = (trip) => {
    setEditingTrip({
      ...trip,
      loadPoint: trip.loadPoint || '',
      unloadPoint: trip.unloadPoint || '',
      rent: trip.rent || 0,
      advance: trip.advance || 0,
      tripCost: trip.tripCost || 0,
      diesel: trip.diesel || 0,
      extraCost: trip.extraCost || 0,
      dieselTaka: trip.dieselTaka || 0,
      pamp: trip.pamp || '',
      commission: trip.commission || 0,
      month: trip.month || '',
      vehicleName: trip.vehicleName || '',
      vehicleNumber: trip.vehicleNumber || '',
      driverName: trip.driverName || '',
      driverPhone: trip.driverPhone || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateTrip = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/outside-trip/${editingTrip.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          load_point: editingTrip.loadPoint,
          unload_point: editingTrip.unloadPoint,
          rent: parseFloat(editingTrip.rent) || 0,
          advance: parseFloat(editingTrip.advance) || 0,
          trip_cost: parseFloat(editingTrip.tripCost) || 0,
          diesel: parseFloat(editingTrip.diesel) || 0,
          extra_cost: parseFloat(editingTrip.extraCost) || 0,
          diesel_taka: parseFloat(editingTrip.dieselTaka) || 0,
          pamp: editingTrip.pamp,
          commission: parseFloat(editingTrip.commission) || 0,
          month: editingTrip.month,
          vehicle_name: editingTrip.vehicleName,
          vehicle_number: editingTrip.vehicleNumber,
          driver_name: editingTrip.driverName,
          driver_phone: editingTrip.driverPhone,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update response:', result);

      // Update local state
      const updatedTrip = {
        ...editingTrip,
        ...result.data,
      };

      setTrips(trips.map(t => t.id === editingTrip.id ? updatedTrip : t));
      setShowEditModal(false);
      setEditingTrip(null);
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip. Please try again.');
    }
  };

  const handleDeleteTrip = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/outside-trip/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from local state
        setTrips(trips.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete trip. Please try again.');
      }
    }
  };

  const handleSelectAll = () => {
    const currentPageTrips = getCurrentPageTrips();
    const currentPageIds = currentPageTrips.map(t => t.id);
    const allSelected = currentPageIds.every(id => selectedTrips.includes(id));

    if (allSelected) {
      setSelectedTrips(selectedTrips.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedTrips([...new Set([...selectedTrips, ...currentPageIds])]);
    }
  };

  const handleSelectTrip = (id) => {
    if (selectedTrips.includes(id)) {
      setSelectedTrips(selectedTrips.filter(tid => tid !== id));
    } else {
      setSelectedTrips([...selectedTrips, id]);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.loadPoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.unloadPoint?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPagesCalc = Math.ceil(filteredTrips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getCurrentPageTrips = () => {
    return filteredTrips.slice(startIndex, endIndex);
  };

  const currentPageTrips = getCurrentPageTrips();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedTrips([]);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPagesCalc <= maxVisiblePages) {
      for (let i = 1; i <= totalPagesCalc; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPagesCalc);
      } else if (currentPage >= totalPagesCalc - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPagesCalc - 3; i <= totalPagesCalc; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPagesCalc);
      }
    }
    return pages;
  };

  // Initial load and when filters change
  React.useEffect(() => {
    fetchTrips(currentPage, searchTerm, filterStatus);
  }, [currentPage, searchTerm, filterStatus]);

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = selectedTrips.length > 0
      ? trips.filter(t => selectedTrips.includes(t.id))
      : trips;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(t => ({
      'SL No': t.id,
      'Load Point': t.loadPoint,
      'Unload Point': t.unloadPoint,
      'Rent': t.rent,
      'Advance': t.advance,
      'Trip Cost': t.tripCost,
      'Diesel': t.diesel,
      'Extra Cost': t.extraCost,
      'Vehicle Name': t.vehicleName,
      'Driver Name': t.driverName,
      'Month': t.month
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Outside Trips');
    XLSX.writeFile(workbook, 'outside_trips.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dataToExport = selectedTrips.length > 0
      ? trips.filter(t => selectedTrips.includes(t.id))
      : trips;

    // Add title
    doc.setFontSize(18);
    doc.text('Outside Trips List', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = dataToExport.map(t => [
      t.id,
      t.loadPoint,
      t.unloadPoint,
      t.rent,
      t.advance,
      t.tripCost,
      t.diesel,
      t.extraCost,
      t.vehicleName,
      t.driverName,
      t.month
    ]);

    // Create table
    autoTable(doc, {
      head: [['SL No', 'Load Point', 'Unload Point', 'Rent', 'Advance', 'Trip Cost', 'Diesel', 'Extra Cost', 'Vehicle Name', 'Driver Name', 'Month']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], fontSize: 9 }
    });

    doc.save('outside_trips.pdf');
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);

    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Outside Trips List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
            .stat-card { border: 1px solid #ddd; padding: 10px; border-radius: 5px; text-align: center; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Outside Trip Management</h1>
              <p className="text-blue-100 text-sm">Manage and monitor outside trip records</p>
            </div>
          </div>
          <Link
            to="/add-outside-trip"
            className="flex items-center gap-3 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            <Plus size={20} />
            <span>Add Trip</span>
          </Link>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.bgGradient} rounded-xl shadow-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}%
                  </span>
                  <div className="text-xs text-gray-500">vs last month</div>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Enhanced Main Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Enhanced Action Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Outside Trips</h2>
                  <p className="text-gray-600">Manage all outside trip records</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <p className="text-sm text-gray-500">Total Trips</p>
                  <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] sm:min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by driver name, vehicle name, load point, unload point..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                />
              </div>

              {/* Enhanced Export Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all font-medium">
                  <Download size={18} />
                  <span>Export</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border-2 border-gray-200 hidden group-hover:block z-20">
                  <button
                    onClick={exportToExcel}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 transition-colors"
                  >
                    <FileText size={16} className="text-green-600" />
                    <div>
                      <div className="font-medium text-gray-800">Export to Excel</div>
                      <div className="text-xs text-gray-500">Download as .xlsx file</div>
                    </div>
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 transition-colors"
                  >
                    <FileText size={16} className="text-red-600" />
                    <div>
                      <div className="font-medium text-gray-800">Export to PDF</div>
                      <div className="text-xs text-gray-500">Download as .pdf file</div>
                    </div>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 transition-colors"
                  >
                    <Printer size={16} className="text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-800">Print Report</div>
                      <div className="text-xs text-gray-500">Print current view</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading trips...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="px-6 py-12 text-center">
              <div className="text-red-600 mb-4">
                <AlertCircle size={48} className="mx-auto mb-3 text-red-300" />
                <p className="text-lg font-medium">Error loading trips</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => fetchTrips(currentPage, searchTerm, filterStatus)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Enhanced Table */}
          {!loading && !error && (
            <div className="overflow-hidden" ref={printRef}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                    <tr>
                      <th className="px-3 py-4 text-left text-xs font-bold">SL No</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Load Point</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Unload Point</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Rent</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Advance</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Trip Cost</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Diesel</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Extra Cost</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Vehicle Name</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Driver Name</th>
                      <th className="px-3 py-4 text-left text-xs font-bold">Month</th>
                      <th className="px-3 py-4 text-center text-xs font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentPageTrips.length > 0 ? (
                      currentPageTrips.map((trip, idx) => (
                        <tr key={trip.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-600">{startIndex + idx + 1}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">{trip.loadPoint || 'N/A'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">{trip.unloadPoint || 'N/A'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">৳{trip.rent?.toLocaleString() || '0'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">৳{trip.advance?.toLocaleString() || '0'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">৳{trip.tripCost?.toLocaleString() || '0'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">{trip.diesel || '0'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">৳{trip.extraCost?.toLocaleString() || '0'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">{trip.vehicleName || 'N/A'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">{trip.driverName || 'N/A'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <span className="text-xs font-medium text-gray-800">{trip.month || 'N/A'}</span>
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex items-center justify-center gap-1">
                              <Link
                                to={`/outside/${trip.id}`}
                                className="p-1 hover:bg-blue-100 rounded-lg transition-colors group"
                                title="View Details"
                              >
                                <Info size={14} className="text-blue-600 group-hover:text-blue-700" />
                              </Link>
                              <button
                                onClick={() => handleEditTrip(trip)}
                                className="p-1 hover:bg-green-100 rounded-lg transition-colors group"
                                title="Edit Trip"
                              >
                                <Edit2 size={14} className="text-green-600 group-hover:text-green-700" />
                              </button>
                              <button
                                onClick={() => handleDeleteTrip(trip.id)}
                                className="p-1 hover:bg-red-100 rounded-lg transition-colors group"
                                title="Delete Trip"
                              >
                                <Trash2 size={14} className="text-red-600 group-hover:text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <Truck className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xl font-semibold text-gray-600 mb-2">No trips found</p>
                              <p className="text-sm text-gray-500">
                                {searchTerm
                                  ? 'Try adjusting your search criteria'
                                  : 'No outside trips available at the moment'
                                }
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Enhanced Pagination */}
          {!loading && !error && (
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-bold text-blue-600">{startIndex + 1}-{Math.min(endIndex, filteredTrips.length)}</span> of <span className="font-bold text-gray-800">{totalItems}</span> trips
                  </div>
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPagesCalc}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed border-gray-200'
                        : 'text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                              : 'border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => currentPage < totalPagesCalc && setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPagesCalc}
                    className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all ${
                      currentPage === totalPagesCalc
                        ? 'text-gray-400 cursor-not-allowed border-gray-200'
                        : 'text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Edit Modal */}
      {showEditModal && editingTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-full sm:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 text-white px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between sticky top-0 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Edit2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Outside Trip</h2>
                  <p className="text-blue-100 text-sm">Update trip details and information</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="hover:bg-white/20 p-2 rounded-xl transition-all transform hover:scale-105"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {/* Trip Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Load Point</label>
                    <input
                      type="text"
                      value={editingTrip.loadPoint || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, loadPoint: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter load point"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unload Point</label>
                    <input
                      type="text"
                      value={editingTrip.unloadPoint || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, unloadPoint: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter unload point"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rent (৳)</label>
                    <input
                      type="number"
                      value={editingTrip.rent || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, rent: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Advance (৳)</label>
                    <input
                      type="number"
                      value={editingTrip.advance || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, advance: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trip Cost (৳)</label>
                    <input
                      type="number"
                      value={editingTrip.tripCost || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, tripCost: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diesel</label>
                    <input
                      type="number"
                      value={editingTrip.diesel || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, diesel: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Extra Cost (৳)</label>
                    <input
                      type="number"
                      value={editingTrip.extraCost || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, extraCost: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diesel Taka (৳)</label>
                    <input
                      type="number"
                      value={editingTrip.dieselTaka || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, dieselTaka: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pamp</label>
                    <input
                      type="text"
                      value={editingTrip.pamp || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, pamp: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter pamp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commission (৳)</label>
                    <input
                      type="number"
                      value={editingTrip.commission || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, commission: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                    <input
                      type="text"
                      value={editingTrip.month || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, month: e.target.value})}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name</label>
                    <input
                      type="text"
                      value={editingTrip.vehicleName || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, vehicleName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter vehicle name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number</label>
                    <input
                      type="text"
                      value={editingTrip.vehicleNumber || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, vehicleNumber: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter vehicle number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                    <input
                      type="text"
                      value={editingTrip.driverName || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, driverName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter driver name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driver Phone</label>
                    <input
                      type="text"
                      value={editingTrip.driverPhone || ''}
                      onChange={(e) => setEditingTrip({...editingTrip, driverPhone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter driver phone"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateTrip}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700"
                >
                  Update Trip
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}