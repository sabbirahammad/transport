import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, Filter, Download, Upload, RefreshCw,
  Edit2, Trash2, Eye, Phone, Mail, MapPin, DollarSign,
  TrendingUp, FileText, Printer, MoreVertical, AlertCircle,
  Users, ChevronLeft, ChevronRight, X, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 10;
  const printRef = useRef();

  // API base URL - Update this to match your backend server
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // State for customers data
  const [customers, setCustomers] = useState([]);

  // Fetch customers from API with pagination
  const fetchCustomers = async (page = 1, pageSize = 20) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/customer?page=${page}&page_size=${pageSize}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)

      // Handle different response formats (array or paginated object)
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
        // Paginated response format - transform data
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

      // Provide more specific error messages based on the error type
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Unable to connect to the server. Please ensure your backend server is running and try again.');
      } else if (err.message.includes('404')) {
        setError('API endpoint not found. The backend server may not be running or the customer endpoint doesn\'t exist. Showing sample data in demo mode.');
      } else if (err.message.includes('500')) {
        setError('Server error occurred. Please check your backend server logs.');
      } else {
        setError(`Failed to fetch customers: ${err.message}`);
      }

      setCustomers([]);

      // If it's a connection error or API not found, show sample data for demonstration purposes
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('404')) {
        // Sample data for demonstration when server is not available
        const sampleData = [
          {
            id: 1,
            customerName: 'Rahman Enterprise',
            mobile: '01812-345678',
            email: 'rahman@enterprise.com',
            address: 'Uttara, Dhaka',
            openingBalance: 50000,
            dueBalance: 35000,
            receivedMoney: 8800,
            totalTrips: 78,
            status: 'Active',
            joiningDate: '2023-11-20'
          },
        ];
        setCustomers(sampleData);
        setError(null);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  // Update customer
  const updateCustomer = async (updatedCustomer) => {
    try {
      // Check if we're in demo mode (sample data)
      const isDemoMode = customers.length > 0 && (customers[0].customerName === 'Rahman Enterprise' || customers[0].name === 'Rahman Enterprise');

      if (isDemoMode) {
        // In demo mode, update locally and force re-render
        const newCustomers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
        setCustomers([...newCustomers]); // Create new array to trigger re-render
        setDataVersion(prev => prev + 1); // Force re-render
        return true;
      }

      // For non-demo mode, try API but handle failures gracefully
      try {
        const response = await fetch(`${API_BASE_URL}/customer/${updatedCustomer.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCustomer),
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('API endpoint not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updated = await response.json();
        const updatedCustomerData = updated.data || updated;
        
        // Create new array to trigger re-render
        const newCustomers = customers.map(c => c.id === updatedCustomerData.id ? updatedCustomerData : c);
        setCustomers([...newCustomers]);
        return true;
      } catch (apiError) {
        console.warn('API update failed, falling back to demo mode:', apiError);

        // If API fails, fall back to demo mode behavior
        const newCustomers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
        setCustomers([...newCustomers]); // Create new array to trigger re-render

        setError('Backend server not available. Changes saved locally in demo mode.');
        setTimeout(() => setError(null), 3000);

        return true;
      }
    } catch (err) {
      console.error('Unexpected error updating customer:', err);

      // Final fallback - update locally
      const newCustomers = customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c);
      setCustomers([...newCustomers]);

      if (err.message.includes('404') || err.message.includes('API endpoint not found')) {
        setError('Backend API not available. Changes saved locally.');
      } else {
        setError('Failed to update customer. Changes saved locally as fallback.');
      }

      setTimeout(() => setError(null), 3000);
      return true;
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    try {
      // Check if we're in demo mode (sample data)
      const isDemoMode = customers.length > 0 && (customers[0].customerName === 'Rahman Enterprise' || customers[0].name === 'Rahman Enterprise');

      if (isDemoMode) {
        // In demo mode, delete locally and force re-render
        const newCustomers = customers.filter(c => c.id !== id);
        setCustomers([...newCustomers]); // Create new array to trigger re-render
        setDataVersion(prev => prev + 1); // Force re-render
        return true;
      }

      // For non-demo mode, try API but handle failures gracefully
      try {
        const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('API endpoint not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newCustomers = customers.filter(c => c.id !== id);
        setCustomers([...newCustomers]);
        return true;
      } catch (apiError) {
        console.warn('API delete failed, falling back to demo mode:', apiError);

        // If API fails, fall back to demo mode behavior
        const newCustomers = customers.filter(c => c.id !== id);
        setCustomers([...newCustomers]);

        setError('Backend server not available. Customer deleted locally in demo mode.');
        setTimeout(() => setError(null), 3000);

        return true;
      }
    } catch (err) {
      console.error('Unexpected error deleting customer:', err);

      // Final fallback - delete locally
      const newCustomers = customers.filter(c => c.id !== id);
      setCustomers([...newCustomers]);

      if (err.message.includes('404') || err.message.includes('API endpoint not found')) {
        setError('Backend API not available. Customer deleted locally.');
      } else {
        setError('Failed to delete customer. Customer removed locally as fallback.');
      }

      setTimeout(() => setError(null), 3000);
      return true;
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  // Initial data fetch
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Check if we're in demo mode
  const isDemoMode = customers.length > 0 && (customers[0].customerName === 'Rahman Enterprise' || customers[0].name === 'Rahman Enterprise');

  // Calculate stats safely with dependency on data changes
  const stats = React.useMemo(() => {
    const customerList = customers || [];
    return [
      {
        label: 'Total Customers',
        value: loading ? '...' : customerList.length.toString(),
        icon: Users,
        color: 'blue',
        trend: '+12'
      },
      {
        label: 'Active Customers',
        value: loading ? '...' : customerList.filter(c => c?.status === 'Active').length.toString(),
        icon: TrendingUp,
        color: 'green',
        trend: '+8'
      },
      {
        label: 'Total Outstanding',
        value: loading ? '...' : `৳${customerList.reduce((sum, c) => sum + (c?.dueBalance || 0), 0).toLocaleString()}`,
        icon: DollarSign,
        color: 'orange',
        trend: '-5'
      },
      {
        label: 'This Month Revenue',
        value: loading ? '...' : `৳${customerList.reduce((sum, c) => sum + (c?.receivedMoney || 0), 0).toLocaleString()}`,
        icon: TrendingUp,
        color: 'purple',
        trend: '+15'
      }
    ];
  }, [customers, loading]);

  const handleEditCustomer = (customer) => {
    setEditingCustomer({ ...customer });
    setShowEditModal(true);
  };

  const handleViewCustomer = (customer) => {
    setViewingCustomer({ ...customer });
    setShowViewModal(true);
  };

  const handleUpdateCustomer = async () => {
    setUpdating(true);
    const success = await updateCustomer(editingCustomer);
    setUpdating(false);
    if (success) {
      setShowEditModal(false);
      setEditingCustomer(null);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
  };

  const handleSelectAll = () => {
    const currentPageIds = currentPageCustomers.map(c => c.id);
    const allSelected = currentPageIds.every(id => selectedCustomers.includes(id));
    
    if (allSelected) {
      setSelectedCustomers(selectedCustomers.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedCustomers([...new Set([...selectedCustomers, ...currentPageIds])]);
    }
  };

  const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(cid => cid !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const filteredCustomers = React.useMemo(() => {
    return (customers || []).filter(customer => {
      if (!customer) return false;
      const matchesSearch = (customer.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (customer.mobile || '').includes(searchTerm) ||
                           (customer.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || (customer.status || '').toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, filterStatus]);

  // Pagination with React.useMemo for better performance
  const paginationData = React.useMemo(() => {
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageCustomers = filteredCustomers.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentPageCustomers
    };
  }, [filteredCustomers, currentPage, itemsPerPage]);

  const { totalPages, startIndex, endIndex, currentPageCustomers } = paginationData;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedCustomers([]);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
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

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = selectedCustomers.length > 0
      ? (customers || []).filter(c => selectedCustomers.includes(c.id))
      : (customers || []);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(c => ({
      'Customer ID': c.id,
      'Name': c.name || '',
      'Mobile': c.mobile || '',
      'Email': c.email || '',
      'Address': c.address || '',
      'Opening Balance': c.openingBalance || 0,
      'Due Balance': c.dueBalance || 0,
      'Received Money': c.receivedMoney || 0,
      'Total Trips': c.totalTrips || 0,
      'Status': c.status || '',
      'Joining Date': c.joiningDate || ''
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    XLSX.writeFile(workbook, 'customers.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dataToExport = selectedCustomers.length > 0
      ? (customers || []).filter(c => selectedCustomers.includes(c.id))
      : (customers || []);

    doc.setFontSize(18);
    doc.text('Customer List', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableData = dataToExport.map(c => [
      c.id,
      c.name || '',
      c.mobile || '',
      c.email || '',
      c.address || '',
      `৳${(c.dueBalance || 0).toLocaleString()}`,
      c.status || ''
    ]);

    doc.autoTable({
      head: [['ID', 'Name', 'Mobile', 'Email', 'Address', 'Due Balance', 'Status']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 }
    });

    doc.save('customers.pdf');
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Customer List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <stat.icon className={`text-${stat.color}-600`} size={20} />
                </div>
                <span className={`text-xs font-semibold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}%
                </span>
              </div>
              <p className="text-gray-600 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">All Customer Information</h2>
                {isDemoMode && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    Demo Mode
                  </span>
                )}
              </div>
              <Link to="/create-customer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus size={18} />
                <span className="font-medium">Add Customer</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, mobile, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={loading || refreshing}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>
                
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                    <button 
                      onClick={exportToExcel}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileText size={16} />
                      Export to Excel
                    </button>
                    <button 
                      onClick={exportToPDF}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileText size={16} />
                      Export to PDF
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Printer size={16} />
                      Print
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
                    disabled={loading}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-800 font-medium">Connection Error</p>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
                >
                  {refreshing ? 'Retrying...' : 'Retry Connection'}
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="mx-6 mb-4 p-8 bg-white rounded-lg border border-gray-100">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={24} />
                <p className="text-gray-600">Loading customers...</p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto" ref={printRef}>
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={currentPageCustomers.length > 0 && currentPageCustomers.every(c => selectedCustomers.includes(c.id))}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SL</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mobile</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Due Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Received</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trips</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!loading && currentPageCustomers.length > 0 ? (
                  currentPageCustomers.map((customer, idx) => (
                    <tr key={`${customer.id}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs">
                            {customer.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-sm font-medium">{customer.name || ''}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{customer.mobile || ''}</td>
                      <td className="px-4 py-3 text-sm">{customer.email || ''}</td>
                      <td className="px-4 py-3 text-sm">{customer.address || ''}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${(customer.dueBalance || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ৳{(customer.dueBalance || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                        ৳{(customer.receivedMoney || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">{customer.totalTrips || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (customer.status || '') === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {customer.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewCustomer(customer)}
                            className="p-1.5 hover:bg-blue-50 rounded"
                          >
                            <Eye size={16} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="p-1.5 hover:bg-green-50 rounded"
                          >
                            <Edit2 size={16} className="text-green-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="p-1.5 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-4 py-12 text-center text-gray-500">
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <Loader2 className="animate-spin text-blue-600" size={48} />
                          <div>
                            <p className="text-lg font-medium text-gray-700">Loading customers...</p>
                            <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
                          <p className="text-lg font-medium">
                            {isDemoMode ? 'Sample Data Loaded' : 'No customer found'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {isDemoMode
                              ? 'Currently showing sample data. Start your backend server to load real data.'
                              : (searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'No customers available at the moment'
                              )
                            }
                          </p>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)}</strong> of <strong>{filteredCustomers.length}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 border rounded text-sm flex items-center gap-1 ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
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
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Customer Information</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={editingCustomer.name || ''}
                    onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                  <input
                    type="tel"
                    value={editingCustomer.mobile || ''}
                    onChange={(e) => setEditingCustomer({...editingCustomer, mobile: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={editingCustomer.address || ''}
                    onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opening Balance</label>
                  <input
                    type="number"
                    value={editingCustomer.openingBalance || ''}
                    onChange={(e) => setEditingCustomer({...editingCustomer, openingBalance: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editingCustomer.status || 'Active'}
                    onChange={(e) => setEditingCustomer({...editingCustomer, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateCustomer}
                  disabled={updating}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updating && <Loader2 size={16} className="animate-spin" />}
                  {updating ? 'Updating...' : (isDemoMode ? 'Update (Demo)' : 'Update Customer')}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={updating}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && viewingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-900 to-green-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Customer Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-green-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                  {viewingCustomer.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{viewingCustomer.name || 'N/A'}</h3>
                  <p className="text-gray-600">{viewingCustomer.email || 'No email provided'}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    (viewingCustomer.status || '') === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {viewingCustomer.status || 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Information</label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone size={18} className="text-gray-500" />
                        <span className="text-gray-800">{viewingCustomer.mobile || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail size={18} className="text-gray-500" />
                        <span className="text-gray-800">{viewingCustomer.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-gray-500" />
                        <span className="text-gray-800">{viewingCustomer.address || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Financial Information</label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Opening Balance:</span>
                        <span className="font-semibold text-gray-800">৳{(viewingCustomer.openingBalance || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Balance:</span>
                        <span className={`font-semibold ${(viewingCustomer.dueBalance || 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ৳{(viewingCustomer.dueBalance || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Received Money:</span>
                        <span className="font-semibold text-green-600">৳{(viewingCustomer.receivedMoney || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Trip Information</label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Trips:</span>
                        <span className="font-bold text-lg text-blue-600">{viewingCustomer.totalTrips || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Information</label>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer ID:</span>
                        <span className="font-semibold text-gray-800">#{viewingCustomer.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joining Date:</span>
                        <span className="font-semibold text-gray-800">
                          {viewingCustomer.joiningDate ? new Date(viewingCustomer.joiningDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold ${
                          (viewingCustomer.status || '') === 'Active' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {viewingCustomer.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">৳{(viewingCustomer.dueBalance || 0).toLocaleString()}</div>
                  <div className="text-sm text-blue-800">Outstanding Amount</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">৳{(viewingCustomer.receivedMoney || 0).toLocaleString()}</div>
                  <div className="text-sm text-green-800">Total Received</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{viewingCustomer.totalTrips || 0}</div>
                  <div className="text-sm text-purple-800">Total Trips</div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}