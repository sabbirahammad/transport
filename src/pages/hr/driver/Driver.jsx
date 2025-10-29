import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DriverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingDriver, setViewingDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;
  const printRef = useRef();

  // API base URL
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

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
      `http://192.168.0.106:8080/uploads/drivers/${imagePath}`,
      `http://192.168.0.106:8080/uploads/${imagePath}`,
      `http://192.168.0.106:8080/static/${imagePath}`,
      `http://192.168.0.106:8080/${imagePath}`
    ];

    // Return the first path (you may need to adjust this based on your backend structure)
    return possiblePaths[0];
  };

  // Helper function to get reliable placeholder image
  const getPlaceholderImage = () => {
    // Use a simple gray background as fallback instead of external service
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
    // Use reliable SVG placeholder instead of external service
    e.target.src = getPlaceholderImage();
    // Remove the error handler to prevent infinite loops
    e.target.onError = null;
  };

  // Fetch drivers from API
  const fetchDrivers = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/driver?page=${page}&page_size=${itemsPerPage}`;
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
      console.log('API Response data:', data);

      // Assuming API returns data in this format, adjust as needed
      const driversData = data.drivers || data.data || data.results || [];
      console.log('Drivers data:', driversData);

      // Log image data for debugging
      driversData.forEach(driver => {
        console.log(`Driver ${driver.id} image:`, driver.image);
      });

      setDrivers(driversData);
      setTotalPages(data.total_pages || Math.ceil((data.total || data.count || 0) / itemsPerPage));
      setTotalItems(data.total || data.count || 0);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.message);
      // Fallback to empty array
      setDrivers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };
console.log(drivers)
  // Initial load and when filters change
  useEffect(() => {
    fetchDrivers(currentPage, searchTerm, filterStatus);
  }, [currentPage, searchTerm, filterStatus]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (editingDriver?.imagePreview && editingDriver.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(editingDriver.imagePreview);
      }
    };
  }, [editingDriver?.imagePreview]);

  const stats = [
    { label: 'Total Drivers', value: totalItems, color: 'blue', trend: '+8' },
    { label: 'Active Drivers', value: drivers.filter(d => d.status === 'Active').length, color: 'green', trend: '+5' },
    { label: 'On Leave', value: drivers.filter(d => d.status === 'On Leave').length, color: 'orange', trend: '0' },
    { label: 'Inactive', value: drivers.filter(d => d.status === 'Inactive').length, color: 'red', trend: '-1' }
  ];

  // Since we're filtering on the server-side, we use all drivers for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageDrivers = drivers.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-700';
    if (status === 'Inactive') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      orange: 'bg-orange-50 text-orange-600',
      red: 'bg-red-50 text-red-600'
    };
    return colors[color] || 'bg-gray-50 text-gray-600';
  };

  const handleViewDriver = (driver) => {
    setViewingDriver({ ...driver });
    setShowViewModal(true);
  };

  const handleEditDriver = (driver) => {
    setEditingDriver({
      ...driver,
      imageFile: null, // For handling new image uploads
      imagePreview: driver.image // Keep original image for preview
    });
    setShowEditModal(true);
  };

  const handleUpdateDriver = async () => {
    try {
      // Prepare FormData for API submission
      const submitData = new FormData();
      submitData.append('driver_name', editingDriver.driver_name || editingDriver.name);
      submitData.append('mobile', editingDriver.mobile);
      submitData.append('emergency', editingDriver.emergency);
      submitData.append('address', editingDriver.address);
      submitData.append('license', editingDriver.license);
      submitData.append('expired', editingDriver.expired || '');
      submitData.append('status', editingDriver.status);
      submitData.append('nid', editingDriver.nid || '');
      submitData.append('joining_date', editingDriver.joining_date || editingDriver.joiningDate || '');
      submitData.append('vehicle_assigned', editingDriver.vehicle_assigned || editingDriver.vehicleAssigned || '');

      // Append image file if a new one is selected
      if (editingDriver.imageFile) {
        submitData.append('image', editingDriver.imageFile);
      }

      console.log('Updating driver with FormData:', {
        id: editingDriver.id,
        driver_name: editingDriver.driver_name || editingDriver.name,
        mobile: editingDriver.mobile,
        hasImageFile: !!editingDriver.imageFile
      });

      const response = await fetch(`${API_BASE_URL}/driver/${editingDriver.id}`, {
        method: 'PUT',
        body: submitData // FormData automatically sets Content-Type with boundary
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update response:', result);

      // Update local state after successful API call
      const updatedDriver = {
        ...editingDriver,
        // Use the response data if available, otherwise use editingDriver
        ...result.data,
        // Ensure image path is properly handled
        image: result.data?.image || editingDriver.image
      };

      console.log('Updated driver data:', updatedDriver);

      // Clean up object URL if it was created for preview
      if (editingDriver.imagePreview && editingDriver.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(editingDriver.imagePreview);
      }

      setDrivers(drivers.map(d => d.id === editingDriver.id ? updatedDriver : d));
      setShowEditModal(false);
      setEditingDriver(null);
    } catch (error) {
      console.error('Error updating driver:', error);
      alert('Failed to update driver. Please try again.');
    }
  };

  const handleDeleteDriver = async (id) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/driver/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from local state after successful API call
        setDrivers(drivers.filter(d => d.id !== id));
      } catch (error) {
        console.error('Error deleting driver:', error);
        alert('Failed to delete driver. Please try again.');
      }
    }
  };

  const handleSelectAll = () => {
    const currentPageIds = currentPageDrivers.map(d => d.id);
    const allSelected = currentPageIds.every(id => selectedDrivers.includes(id));

    if (allSelected) {
      setSelectedDrivers(selectedDrivers.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedDrivers([...new Set([...selectedDrivers, ...currentPageIds])]);
    }
  };

  const handleSelectDriver = (id) => {
    if (selectedDrivers.includes(id)) {
      setSelectedDrivers(selectedDrivers.filter(did => did !== id));
    } else {
      setSelectedDrivers([...selectedDrivers, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <svg className={`text-${stat.color}-600 w-5 h-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span className={`text-xs font-semibold ${stat.trend.startsWith('+') ? 'text-green-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                  {stat.trend}%
                </span>
              </div>
              <p className="text-gray-600 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Action Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="text-blue-600 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">All Driver Information</h2>
              </div>
              <Link
                to="/add-driver"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Add Driver</span>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[300px] relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, mobile, license..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>Filters</span>
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Export</span>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export to Excel
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export to PDF
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on leave">On Leave</option>
                </select>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading drivers...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="px-6 py-12 text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">Error loading drivers</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => fetchDrivers(currentPage, searchTerm, filterStatus)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="overflow-x-auto" ref={printRef}>
              <table className="w-full">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={currentPageDrivers.length > 0 && currentPageDrivers.every(d => selectedDrivers.includes(d.id))}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">SL</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Mobile</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Emergency</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">License</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Expired</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentPageDrivers.length > 0 ? (
                    currentPageDrivers.map((driver, idx) => (
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedDrivers.includes(driver.id)}
                            onChange={() => handleSelectDriver(driver.id)}
                            className="w-4 h-4 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                        <td className="px-4 py-3">
                          <img src={getImageUrl(driver.image)} alt={driver.name || 'Driver'} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200" onError={handleImageError} />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{driver.driver_name || driver.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{driver.mobile || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{driver.address || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{driver.emergency || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm font-medium">{driver.license || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            driver.expired && new Date(driver.expired) < new Date() ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {driver.expired ? new Date(driver.expired).toLocaleDateString() : 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                            {driver.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDriver(driver)}
                              className="p-1.5 hover:bg-blue-50 rounded"
                              title="View Details"
                            >
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEditDriver(driver)}
                              className="p-1.5 hover:bg-green-50 rounded"
                              title="Edit"
                            >
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteDriver(driver.id)}
                              className="p-1.5 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="px-4 py-12 text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <p className="text-lg font-medium">No driver found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchTerm || filterStatus !== 'all'
                            ? 'Try adjusting your search or filter criteria'
                            : 'No drivers available at the moment'
                          }
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <strong>{startIndex + 1}-{Math.min(endIndex, drivers.length)}</strong> of <strong>{totalItems}</strong>
              </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 border rounded text-sm flex items-center gap-1 ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded text-sm ${
                      currentPage === page ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 border rounded text-sm flex items-center gap-1 ${
                  currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Driver Information</h2>
              <button onClick={() => {
                // Clean up blob URL if it exists
                if (editingDriver.imagePreview && editingDriver.imagePreview.startsWith('blob:')) {
                  URL.revokeObjectURL(editingDriver.imagePreview);
                }
                setShowEditModal(false);
                setEditingDriver(null);
              }} className="hover:bg-blue-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {/* Profile Image Upload Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Image</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={getImageUrl(editingDriver.imagePreview || editingDriver.image)}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100"
                      onError={handleImageError}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditingDriver(prev => ({
                            ...prev,
                            imageFile: file,
                            imagePreview: URL.createObjectURL(file)
                          }));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Click on the image to upload a new photo</p>
                    <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 2MB)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                  <input
                    type="text"
                    value={editingDriver.driver_name || editingDriver.name}
                    onChange={(e) => setEditingDriver({...editingDriver, driver_name: e.target.value, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                  <input
                    type="tel"
                    value={editingDriver.mobile}
                    onChange={(e) => setEditingDriver({...editingDriver, mobile: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    value={editingDriver.emergency}
                    onChange={(e) => setEditingDriver({...editingDriver, emergency: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <input
                    type="text"
                    value={editingDriver.license}
                    onChange={(e) => setEditingDriver({...editingDriver, license: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry Date</label>
                  <input
                    type="date"
                    value={editingDriver.expired}
                    onChange={(e) => setEditingDriver({...editingDriver, expired: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editingDriver.status}
                    onChange={(e) => setEditingDriver({...editingDriver, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={editingDriver.address}
                  onChange={(e) => setEditingDriver({...editingDriver, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateDriver}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700"
                >
                  Update Driver
                </button>
                <button
                  onClick={() => {
                    // Clean up blob URL if it exists
                    if (editingDriver.imagePreview && editingDriver.imagePreview.startsWith('blob:')) {
                      URL.revokeObjectURL(editingDriver.imagePreview);
                    }
                    setShowEditModal(false);
                    setEditingDriver(null);
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-900 to-green-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Driver Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-green-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Driver Image and Basic Info */}
              <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <img src={getImageUrl(viewingDriver.image)} alt={viewingDriver.driver_name || viewingDriver.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-green-300 shadow-lg" onError={handleImageError} />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{viewingDriver.driver_name || viewingDriver.name || 'N/A'}</h3>
                  <p className="text-xl text-gray-600 mb-3">License: {viewingDriver.license || 'N/A'}</p>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(viewingDriver.status)}`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {viewingDriver.status === 'Active' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {viewingDriver.status === 'Inactive' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                        {viewingDriver.status === 'On Leave' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                      {viewingDriver.status || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">Driver ID: #{viewingDriver.id}</span>
                  </div>
                </div>
              </div>

              {/* Complete Information */}
              <div className="space-y-6">
                {/* Contact Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Mobile Number</p>
                        <p className="font-semibold text-gray-800">{viewingDriver.mobile || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Emergency Contact</p>
                        <p className="font-semibold text-gray-800">{viewingDriver.emergency || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="font-semibold text-gray-800">{viewingDriver.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* License Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    License Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">License Number</p>
                        <p className="font-semibold text-gray-800">{viewingDriver.license || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m0 0v6m0-6h-6" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">License Expiry</p>
                        <p className={`font-semibold ${
                          new Date(viewingDriver.expired) < new Date() ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {new Date(viewingDriver.expired).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          {new Date(viewingDriver.expired) < new Date() && ' (Expired)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    Employment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m0 0v6m0-6h-6" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Joining Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(viewingDriver.joining_date || viewingDriver.joiningDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Vehicle Assigned</p>
                        <p className="font-semibold text-gray-800">{viewingDriver.vehicle_assigned || viewingDriver.vehicleAssigned || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5M10 6V4a2 2 0 012-2h2a2 2 0 012 2v2M10 6h4" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">National ID (NID)</p>
                        <p className="font-semibold text-gray-800">{viewingDriver.n_id || viewingDriver.nid || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-blue-600">{viewingDriver.license || 'N/A'}</div>
                  <div className="text-sm text-blue-800">License No</div>
                </div>
                <div className={`border rounded-lg p-4 text-center ${
                  viewingDriver.status === 'Active' ? 'bg-green-50 border-green-200' :
                  viewingDriver.status === 'Inactive' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className={`text-xl font-bold ${
                    viewingDriver.status === 'Active' ? 'text-green-600' :
                    viewingDriver.status === 'Inactive' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {viewingDriver.status || 'Unknown'}
                  </div>
                  <div className={`text-sm ${
                    viewingDriver.status === 'Active' ? 'text-green-800' :
                    viewingDriver.status === 'Inactive' ? 'text-red-800' :
                    'text-yellow-800'
                  }`}>
                    Status
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className={`text-xl font-bold ${
                    new Date(viewingDriver.expired) < new Date() ? 'text-red-600' : 'text-purple-600'
                  }`}>
                    {new Date(viewingDriver.expired).getFullYear()}
                  </div>
                  <div className="text-sm text-purple-800">License Year</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-orange-600">
                    {new Date(viewingDriver.joiningDate).getFullYear()}
                  </div>
                  <div className="text-sm text-orange-800">Join Year</div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}