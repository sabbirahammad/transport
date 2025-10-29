import React, { useState, useRef } from 'react';
import {
  Search, Plus, Filter, Download, Upload, RefreshCw,
  Edit2, Trash2, Eye, Phone, Mail, MapPin, DollarSign,
  TrendingUp, FileText, Printer, MoreVertical, AlertCircle,
  Users, User, ChevronLeft, ChevronRight, X, Truck, Activity,
  Clock, Gauge, Fuel, Calendar, Camera, Settings,
  BarChart3, PieChart, Star, Award, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import VehicleDetails from './VehicleDetails';

// Helper function to get proper image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return getPlaceholderImage();
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // If it's a relative path from the backend, construct full URL
  if (imagePath.startsWith('/')) {
    return `http://192.168.0.106:8080${imagePath}`;
  }

  // For backend-relative paths - try multiple possible locations
  const possiblePaths = [
    `http://192.168.0.106:8080/uploads/vehicles/${imagePath}`,
    `http://192.168.0.106:8080/uploads/${imagePath}`,
    `http://192.168.0.106:8080/static/${imagePath}`,
    `http://192.168.0.106:8080/${imagePath}`
  ];

  // Return the first path (you may need to adjust this based on your backend structure)
  return possiblePaths[0];
};

// Helper function to get reliable placeholder image
const getPlaceholderImage = () => {
  return "data:image/svg+xml;base64," + btoa(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#f3f4f6"/>
      <text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">No Image</text>
    </svg>
  `);
};

// Helper function to handle image errors
const handleImageError = (e) => {
  console.log('Image failed to load:', e.target.src);
  e.target.src = getPlaceholderImage();
  e.target.onError = null;
};

export default function VehicleList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingVehicleId, setViewingVehicleId] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();

  // API base URL
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // Vehicle state
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch vehicles from API
  const fetchVehicles = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/vehicle?page=${page}&page_size=${itemsPerPage}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Vehicle API Response:', data);

      // Handle different API response structures
      const vehiclesData = data.vehicles || data.data || data.results || [];
      console.log('Raw API response:', data);
      console.log('Vehicles data array:', vehiclesData);

      // Map API response to expected fields - only include required fields
      const mappedVehicles = vehiclesData.map((vehicle, index) => {
        console.log(`Vehicle ${index}:`, vehicle);
        console.log(`Vehicle ${index} driver_name:`, vehicle.driver_name);

        const mappedVehicle = {
          id: vehicle.id,
          driverName: vehicle.driver_name || 'N/A',
          vehicleName: vehicle.vehicle_name || 'N/A',
          category: vehicle.category || 'N/A',
          size: vehicle.size || 'N/A',
          vehicleNo: vehicle.vehicle_no || 'N/A',
          status: vehicle.status || 'Active',
          mobileNumber: vehicle.driver_contact || '',
          // Keep additional fields for internal use but don't display them in table
          driver_id: vehicle.driver_id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          mileage: vehicle.mileage,
          fule_capacity: vehicle.fule_capacity || vehicle.fuel_capacity,
          registration_date: vehicle.registration_date,
          insurance_expiry: vehicle.insurance_expiry,
          fitness_expiry: vehicle.fitness_expiry,
          tax_token_expiry: vehicle.tax_token_expiry,
          permit_expiry: vehicle.permit_expiry,
          image_url: vehicle.image_url,
          created_at: vehicle.created_at,
          updated_at: vehicle.updated_at,
        };

        console.log(`Mapped vehicle ${index}:`, mappedVehicle);
        return mappedVehicle;
      });

      setVehicles(mappedVehicles);
      setTotalPages(data.total_pages || Math.ceil((data.total || data.count || 0) / itemsPerPage));
      setTotalItems(data.total || data.count || 0);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.message);
      // Fallback to empty array
      setVehicles([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Vehicles',
      value: totalItems.toString(),
      icon: Truck,
      color: 'blue',
      trend: '+5',
      bgGradient: 'from-blue-500 to-blue-600',
      description: 'All registered vehicles'
    },
    {
      label: 'Active Vehicles',
      value: vehicles.filter(v => v.status === 'Active').length.toString(),
      icon: Activity,
      color: 'green',
      trend: '+3',
      bgGradient: 'from-green-500 to-green-600',
      description: 'Currently operational'
    },
    {
      label: 'Under Maintenance',
      value: vehicles.filter(v => v.status === 'Inactive').length.toString(),
      icon: Settings,
      color: 'orange',
      trend: '-1',
      bgGradient: 'from-orange-500 to-orange-600',
      description: 'Currently unavailable'
    },
    {
      label: 'Fleet Efficiency',
      value: '94%',
      icon: Zap,
      color: 'purple',
      trend: '+8',
      bgGradient: 'from-purple-500 to-purple-600',
      description: 'Average uptime'
    }
  ];

  const handleEditVehicle = (vehicle) => {
    // Combine data from both Vehicle and CreateVehicle models
    setEditingVehicle({
      ...vehicle,
      // Ensure all fields from CreateVehicle are included
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      mileage: vehicle.mileage || '',
      fuleCapacity: vehicle.fule_capacity || vehicle.fuleCapacity || '',
      registrationDate: vehicle.registration_date || vehicle.registrationDate || '',
      insuranceExpiry: vehicle.insurance_expiry|| vehicle.insurance_expiry || '',
      fitnessExpiry: vehicle.fitness_expiry || vehicle.fitnessExpiry || '',
      taxTokenExpiry: vehicle.tax_token_expiry || vehicle.taxTokenExpiry || '',
      permitExpiry: vehicle.permit_expiry || vehicle.permitExpiry || '',
      vehiclePhoto: vehicle.image_url || vehicle.vehicle_photo || vehicle.image || '',
      vehiclePhotoFile: null,
      // Ensure status is properly mapped
      status: vehicle.status === 'Active' ? 'active' : vehicle.status === 'Inactive' ? 'inactive' : vehicle.status,
      mobileNumber: vehicle.mobileNumber || vehicle.driver_contact || ''
    });
    setShowEditModal(true);
  };

  const handleViewVehicle = (vehicle) => {
    setViewingVehicleId(vehicle.id);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingVehicleId(null);
  };

  const handleUpdateVehicle = async () => {
    try {

      // Always use FormData to match creation API
      const formData = new FormData();

      // Append all fields with proper formatting
      formData.append('driver_name', editingVehicle.driverName || '');
      formData.append('driver_contact', editingVehicle.mobileNumber || '');
      formData.append('brand', editingVehicle.brand || '');
      formData.append('model', editingVehicle.model || '');
      formData.append('vehicle_name', editingVehicle.vehicle_name || editingVehicle.vehicleName || '');
      formData.append('category', editingVehicle.category || '');
      formData.append('size', editingVehicle.size || '');
      formData.append('vehicle_no', editingVehicle.vehicleNo || editingVehicle.vehicle_no || '');
      formData.append('year', editingVehicle.year || '');
      formData.append('mileage', editingVehicle.mileage || '');
      formData.append('fuel_capacity', editingVehicle.fuleCapacity || editingVehicle.fule_capacity || ''); // Corrected field name
      formData.append('registration_date', editingVehicle.registrationDate || editingVehicle.registration_date ? `${editingVehicle.registrationDate || editingVehicle.registration_date}T00:00:00Z` : '');
      formData.append('insurance_expiry', editingVehicle.insuranceExpiry || editingVehicle.insurance_expiry ? `${editingVehicle.insuranceExpiry || editingVehicle.insurance_expiry}T00:00:00Z` : '');
      formData.append('fitness_expiry', editingVehicle.fitnessExpiry || editingVehicle.fitness_expiry ? `${editingVehicle.fitnessExpiry || editingVehicle.fitness_expiry}T00:00:00Z` : '');
      formData.append('tax_token_expiry', editingVehicle.taxTokenExpiry || editingVehicle.tax_token_expiry ? `${editingVehicle.taxTokenExpiry || editingVehicle.tax_token_expiry}T00:00:00Z` : '');
      formData.append('permit_expiry', editingVehicle.permitExpiry || editingVehicle.permit_expiry ? `${editingVehicle.permitExpiry || editingVehicle.permit_expiry}T00:00:00Z` : '');
      formData.append('status', editingVehicle.status === 'active' ? 'Active' : editingVehicle.status === 'inactive' ? 'Inactive' : editingVehicle.status);
      formData.append('driver_id', editingVehicle.driver_id || '');

      // Append image file if available, else empty string
      if (editingVehicle.vehiclePhotoFile) {
        formData.append('image', editingVehicle.vehiclePhotoFile);
      } else {
        formData.append('image', '');
      }

      console.log('Updating vehicle with FormData:', {
        id: editingVehicle.id,
        vehicle_name: editingVehicle.vehicle_name || editingVehicle.vehicleName,
        category: editingVehicle.category,
        brand: editingVehicle.brand,
        model: editingVehicle.model,
        hasImageFile: !!editingVehicle.vehiclePhotoFile
      });

      const response = await fetch(`${API_BASE_URL}/vehicle/${editingVehicle.id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update response:', result);

      // Update local state with mapped data
      const updatedVehicle = {
        ...editingVehicle,
        // Use response data if available, otherwise use editingVehicle
        ...result.data,
        // Ensure all fields are properly mapped
        vehicle_name: result.data?.vehicle_name || editingVehicle.vehicle_name || editingVehicle.vehicleName,
        category: result.data?.category || editingVehicle.category,
        size: result.data?.size || editingVehicle.size,
        vehicle_no: result.data?.vehicle_no || editingVehicle.vehicleNo || editingVehicle.vehicle_no,
        brand: result.data?.brand || editingVehicle.brand,
        model: result.data?.model || editingVehicle.model,
        year: result.data?.year || editingVehicle.year,
        mileage: result.data?.mileage || editingVehicle.mileage,
        fule_capacity: result.data?.fule_capacity || editingVehicle.fuleCapacity || editingVehicle.fule_capacity,
        status: result.data?.status || (editingVehicle.status === 'active' ? 'Active' : editingVehicle.status === 'inactive' ? 'Inactive' : editingVehicle.status),
        driver_id: result.data?.driver_id || editingVehicle.driver_id,
        driverName: editingVehicle.driverName,
        mobileNumber: editingVehicle.mobileNumber,
        vehicleNo: editingVehicle.vehicleNo || editingVehicle.vehicle_no,
        // Handle image URL properly
        image_url: result.data?.image_url || editingVehicle.image_url,
        vehicle_photo: result.data?.vehicle_photo || editingVehicle.vehicle_photo,
        image: result.data?.image || editingVehicle.image,
      };

      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? updatedVehicle : v));
      setShowEditModal(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Failed to update vehicle. Please try again.');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/vehicle/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from local state
        setVehicles(vehicles.filter(v => v.id !== id));
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Failed to delete vehicle. Please try again.');
      }
    }
  };

  const handleSelectAll = () => {
    const currentPageVehicles = getCurrentPageVehicles();
    const currentPageIds = currentPageVehicles.map(v => v.id);
    const allSelected = currentPageIds.every(id => selectedVehicles.includes(id));
    
    if (allSelected) {
      setSelectedVehicles(selectedVehicles.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedVehicles([...new Set([...selectedVehicles, ...currentPageIds])]);
    }
  };

  const handleSelectVehicle = (id) => {
    if (selectedVehicles.includes(id)) {
      setSelectedVehicles(selectedVehicles.filter(vid => vid !== id));
    } else {
      setSelectedVehicles([...selectedVehicles, id]);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vehicle.size?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPagesCalc = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getCurrentPageVehicles = () => {
    return filteredVehicles.slice(startIndex, endIndex);
  };

  const currentPageVehicles = getCurrentPageVehicles();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedVehicles([]);
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
    fetchVehicles(currentPage, searchTerm, filterStatus);
  }, [currentPage, searchTerm, filterStatus]);

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = selectedVehicles.length > 0
      ? vehicles.filter(v => selectedVehicles.includes(v.id))
      : vehicles;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(v => ({
      'SL No': v.id,
      'Driver Name': v.driverName,
      'Vehicle Name': v.vehicleName,
      'Category': v.category,
      'Size': v.size,
      'Vehicle No': v.vehicleNo,
      'Status': v.status
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicles');
    XLSX.writeFile(workbook, 'vehicles.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dataToExport = selectedVehicles.length > 0
      ? vehicles.filter(v => selectedVehicles.includes(v.id))
      : vehicles;

    // Add title
    doc.setFontSize(18);
    doc.text('Vehicle List', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = dataToExport.map(v => [
      v.id,
      v.driverName,
      v.vehicleName,
      v.category,
      v.size,
      v.vehicleNo,
      v.status
    ]);

    // Create table
    autoTable(doc, {
      head: [['SL No', 'Driver Name', 'Vehicle Name', 'Category', 'Size', 'Vehicle No', 'Status']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 }
    });

    doc.save('vehicles.pdf');
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Vehicle List</title>
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
              <h1 className="text-white text-3xl font-bold">Fleet Management</h1>
              <p className="text-blue-100 text-sm">Manage and monitor your vehicle fleet</p>
            </div>
          </div>
          <Link
            to="/create-vehicle"
            className="flex items-center gap-3 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            <Plus size={20} />
            <span>Add Vehicle</span>
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
                  <h2 className="text-2xl font-bold text-gray-800">Vehicle Fleet</h2>
                  <p className="text-gray-600">Manage all your vehicles in one place</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <p className="text-sm text-gray-500">Total Vehicles</p>
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
                  placeholder="Search by driver name, vehicle name, category, size, or vehicle number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-3 border-2 rounded-xl transition-all ${
                    showFilters
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <Filter size={18} />
                  <span className="font-medium">Filters</span>
                </button>

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

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading vehicles...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="px-6 py-12 text-center">
              <div className="text-red-600 mb-4">
                <AlertCircle size={48} className="mx-auto mb-3 text-red-300" />
                <p className="text-lg font-medium">Error loading vehicles</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => fetchVehicles(currentPage, searchTerm, filterStatus)}
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
                      <th className="px-6 py-4 text-left text-sm font-bold">SL No</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Driver Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Vehicle Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Size</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Vehicle No</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentPageVehicles.length > 0 ? (
                      currentPageVehicles.map((vehicle, idx) => (
                        <tr key={vehicle.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-blue-600">{startIndex + idx + 1}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">{vehicle.driverName || vehicle.driver_name || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">{vehicle.vehicleName || vehicle.vehicle_name || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">{vehicle.category || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">{vehicle.size || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">{vehicle.vehicleNo || vehicle.vehicle_no || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${
                              vehicle.status === 'Active'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                              {vehicle.status === 'Active' ? (
                                <Activity className="w-4 h-4" />
                              ) : (
                                <Clock className="w-4 h-4" />
                              )}
                              {vehicle.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewVehicle(vehicle)}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                                title="View Details"
                              >
                                <Eye size={16} className="text-blue-600 group-hover:text-blue-700" />
                              </button>
                              <button
                                onClick={() => handleEditVehicle(vehicle)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                                title="Edit Vehicle"
                              >
                                <Edit2 size={16} className="text-green-600 group-hover:text-green-700" />
                              </button>
                              <button
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                title="Delete Vehicle"
                              >
                                <Trash2 size={16} className="text-red-600 group-hover:text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <Truck className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xl font-semibold text-gray-600 mb-2">No vehicles found</p>
                              <p className="text-sm text-gray-500">
                                {searchTerm || filterStatus !== 'all'
                                  ? 'Try adjusting your search or filter criteria'
                                  : 'No vehicles available at the moment'
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
                    Showing <span className="font-bold text-blue-600">{startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)}</span> of <span className="font-bold text-gray-800">{totalItems}</span> vehicles
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
      {showEditModal && editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-full sm:max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 text-white px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between sticky top-0 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Edit2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Vehicle Information</h2>
                  <p className="text-blue-100 text-sm">Update vehicle details and specifications</p>
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
              {/* Driver Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                    <input
                      type="text"
                      value={editingVehicle.driverName || 'N/A'}
                      onChange={(e) => setEditingVehicle({...editingVehicle, driverName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="text"
                      value={editingVehicle.mobileNumber || 'N/A'}
                      onChange={(e) => setEditingVehicle({...editingVehicle, mobileNumber: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Image Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Image</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={getImageUrl(editingVehicle.vehiclePhoto || editingVehicle.image_url || editingVehicle.image)}
                      alt="Vehicle"
                      className="w-20 h-20 rounded-lg object-cover ring-4 ring-blue-100"
                      onError={handleImageError}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditingVehicle(prev => ({
                            ...prev,
                            vehiclePhotoFile: file,
                            vehiclePhoto: URL.createObjectURL(file)
                          }));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Upload size={16} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Click on the image to upload a new photo</p>
                    <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 2MB)</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Details Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <input
                      type="text"
                      value={editingVehicle.brand || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, brand: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Toyota, Honda, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={editingVehicle.model || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, model: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Hiace, Bolero, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name *</label>
                    <input
                      type="text"
                      value={editingVehicle.vehicle_name || editingVehicle.vehicleName || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, vehicle_name: e.target.value, vehicleName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Vehicle Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <input
                      type="text"
                      value={editingVehicle.category || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, category: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Truck, Minibus, Pickup"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                    <input
                      type="text"
                      value={editingVehicle.size || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, size: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="15 Seater, Heavy Duty"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Number *</label>
                    <input
                      type="text"
                      value={editingVehicle.vehicleNo || editingVehicle.vehicle_no || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, vehicleNo: e.target.value, vehicle_no: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Dhaka-1234"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Details Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year of Manufacture</label>
                    <input
                      type="number"
                      value={editingVehicle.year || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, year: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km/l)</label>
                    <input
                      type="number"
                      value={editingVehicle.mileage || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, mileage: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Capacity (liters)</label>
                    <input
                      type="number"
                      value={editingVehicle.fuleCapacity || editingVehicle.fule_capacity || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, fuleCapacity: e.target.value, fule_capacity: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>

              {/* Document Expiry Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Expiry Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Date</label>
                    <input
                      type="date"
                      value={editingVehicle.registrationDate || editingVehicle.registration_date || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, registrationDate: e.target.value, registration_date: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Expiry</label>
                    <input
                      type="date"
                      value={editingVehicle.insuranceExpiry || editingVehicle.insurance_expiry || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, insuranceExpiry: e.target.value, insurance_expiry: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Expiry</label>
                    <input
                      type="date"
                      value={editingVehicle.fitnessExpiry || editingVehicle.fitness_expiry || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, fitnessExpiry: e.target.value, fitness_expiry: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Token Expiry</label>
                    <input
                      type="date"
                      value={editingVehicle.taxTokenExpiry || editingVehicle.tax_token_expiry || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, taxTokenExpiry: e.target.value, tax_token_expiry: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permit Expiry</label>
                    <input
                      type="date"
                      value={editingVehicle.permitExpiry || editingVehicle.permit_expiry || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, permitExpiry: e.target.value, permit_expiry: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* System Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editingVehicle.status === 'Active' ? 'Active' : editingVehicle.status === 'Inactive' ? 'Inactive' : editingVehicle.status}
                      onChange={(e) => setEditingVehicle({...editingVehicle, status: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driver ID</label>
                    <input
                      type="number"
                      value={editingVehicle.driver_id || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, driver_id: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateVehicle}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700"
                >
                  Update Vehicle
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

      {/* Enhanced View Details Modal */}
      {showViewModal && viewingVehicleId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-full sm:max-w-7xl max-h-[90vh] overflow-auto">
            <VehicleDetails
              vehicleId={viewingVehicleId}
              onClose={handleCloseViewModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}