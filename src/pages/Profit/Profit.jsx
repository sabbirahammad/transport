import React, { useState, useRef } from 'react';
import {
  Search, Plus, Filter, Download, Upload, RefreshCw,
  Edit2, Trash2, Eye, Phone, Mail, MapPin, DollarSign,
  TrendingUp, FileText, Printer, MoreVertical, AlertCircle,
  Users, User, ChevronLeft, ChevronRight, X, Activity,
  Clock, Gauge, Fuel, Calendar, Camera, Settings,
  BarChart3, PieChart, Star, Award, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function ProfitList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfits, setSelectedProfits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProfit, setEditingProfit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProfitId, setViewingProfitId] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();

  // API base URL
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // Profit state
  const [profits, setProfits] = useState([
    {
      id: 1,
      customerName: 'John Smith',
      investment: 50000,
      status: 'Active',
      customer_id: 1,
      profit_amount: 7500,
      investment_date: '2024-01-15',
      maturity_date: '2025-01-15',
      interest_rate: 15.0,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      investment: 75000,
      status: 'Active',
      customer_id: 2,
      profit_amount: 11250,
      investment_date: '2024-02-20',
      maturity_date: '2025-02-20',
      interest_rate: 15.0,
      created_at: '2024-02-20T10:00:00Z',
      updated_at: '2024-02-20T10:00:00Z',
    },
    {
      id: 3,
      customerName: 'Michael Brown',
      investment: 100000,
      status: 'Active',
      customer_id: 3,
      profit_amount: 15000,
      investment_date: '2024-03-10',
      maturity_date: '2025-03-10',
      interest_rate: 15.0,
      created_at: '2024-03-10T10:00:00Z',
      updated_at: '2024-03-10T10:00:00Z',
    },
    {
      id: 4,
      customerName: 'Emily Davis',
      investment: 25000,
      status: 'Inactive',
      customer_id: 4,
      profit_amount: 3750,
      investment_date: '2024-04-05',
      maturity_date: '2025-04-05',
      interest_rate: 15.0,
      created_at: '2024-04-05T10:00:00Z',
      updated_at: '2024-04-05T10:00:00Z',
    },
    {
      id: 5,
      customerName: 'David Wilson',
      investment: 60000,
      status: 'Active',
      customer_id: 5,
      profit_amount: 9000,
      investment_date: '2024-05-12',
      maturity_date: '2025-05-12',
      interest_rate: 15.0,
      created_at: '2024-05-12T10:00:00Z',
      updated_at: '2024-05-12T10:00:00Z',
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(5);

  // Fetch profits from API
  const fetchProfits = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/profit?page=${page}&page_size=${itemsPerPage}`;
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
      console.log('Profit API Response:', data);

      // Handle different API response structures
      const profitsData = data.profits || data.data || data.results || [];
      console.log('Raw API response:', data);
      console.log('Profits data array:', profitsData);

      // Map API response to expected fields
      const mappedProfits = profitsData.map((profit, index) => {
        console.log(`Profit ${index}:`, profit);

        const mappedProfit = {
          id: profit.id,
          customerName: profit.customer_name || 'N/A',
          investment: profit.investment || 0,
          status: profit.status || 'Active',
          // Keep additional fields for internal use
          customer_id: profit.customer_id,
          profit_amount: profit.profit_amount,
          investment_date: profit.investment_date,
          maturity_date: profit.maturity_date,
          interest_rate: profit.interest_rate,
          created_at: profit.created_at,
          updated_at: profit.updated_at,
        };

        console.log(`Mapped profit ${index}:`, mappedProfit);
        return mappedProfit;
      });

      setProfits(mappedProfits);
      setTotalPages(data.total_pages || Math.ceil((data.total || data.count || 0) / itemsPerPage));
      setTotalItems(data.total || data.count || 0);
    } catch (err) {
      console.error('Error fetching profits:', err);
      setError(err.message);
      // Fallback to empty array
      setProfits([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Total Profits',
      value: totalItems.toString(),
      icon: DollarSign,
      color: 'green',
      trend: '+12',
      bgGradient: 'from-green-500 to-green-600',
      description: 'All profit records'
    },
    {
      label: 'Total Investment',
      value: `$${profits.reduce((sum, p) => sum + (p.investment || 0), 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'blue',
      trend: '+8',
      bgGradient: 'from-blue-500 to-blue-600',
      description: 'Combined investments'
    },
    {
      label: 'Active Investments',
      value: profits.filter(p => p.status === 'Active').length.toString(),
      icon: Activity,
      color: 'purple',
      trend: '+15',
      bgGradient: 'from-purple-500 to-purple-600',
      description: 'Currently active'
    },
    {
      label: 'Avg. Investment',
      value: `$${profits.length > 0 ? Math.round(profits.reduce((sum, p) => sum + (p.investment || 0), 0) / profits.length).toLocaleString() : '0'}`,
      icon: BarChart3,
      color: 'orange',
      trend: '+5',
      bgGradient: 'from-orange-500 to-orange-600',
      description: 'Average per record'
    }
  ];

  const handleEditProfit = (profit) => {
    setEditingProfit({
      ...profit,
      // Ensure all fields are included
      customerName: profit.customerName || '',
      investment: profit.investment || '',
      profit_amount: profit.profit_amount || '',
      investment_date: profit.investment_date || '',
      maturity_date: profit.maturity_date || '',
      interest_rate: profit.interest_rate || '',
      status: profit.status === 'Active' ? 'active' : profit.status === 'Inactive' ? 'inactive' : profit.status,
    });
    setShowEditModal(true);
  };

  const handleViewProfit = (profit) => {
    setViewingProfitId(profit.id);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingProfitId(null);
  };

  const handleUpdateProfit = async () => {
    try {
      const formData = new FormData();

      // Append all fields
      formData.append('customer_name', editingProfit.customerName || '');
      formData.append('investment', editingProfit.investment || '');
      formData.append('profit_amount', editingProfit.profit_amount || '');
      formData.append('investment_date', editingProfit.investment_date ? `${editingProfit.investment_date}T00:00:00Z` : '');
      formData.append('maturity_date', editingProfit.maturity_date ? `${editingProfit.maturity_date}T00:00:00Z` : '');
      formData.append('interest_rate', editingProfit.interest_rate || '');
      formData.append('status', editingProfit.status === 'active' ? 'Active' : editingProfit.status === 'inactive' ? 'Inactive' : editingProfit.status);

      console.log('Updating profit with FormData:', {
        id: editingProfit.id,
        customer_name: editingProfit.customerName,
        investment: editingProfit.investment
      });

      const response = await fetch(`${API_BASE_URL}/profit/${editingProfit.id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update response:', result);

      // Update local state
      const updatedProfit = {
        ...editingProfit,
        ...result.data,
        customerName: result.data?.customer_name || editingProfit.customerName,
        investment: result.data?.investment || editingProfit.investment,
        status: result.data?.status || (editingProfit.status === 'active' ? 'Active' : editingProfit.status === 'inactive' ? 'Inactive' : editingProfit.status),
      };

      setProfits(profits.map(p => p.id === editingProfit.id ? updatedProfit : p));
      setShowEditModal(false);
      setEditingProfit(null);
    } catch (error) {
      console.error('Error updating profit:', error);
      alert('Failed to update profit record. Please try again.');
    }
  };

  const handleDeleteProfit = async (id) => {
    if (window.confirm('Are you sure you want to delete this profit record?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/profit/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove from local state
        setProfits(profits.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting profit:', error);
        alert('Failed to delete profit record. Please try again.');
      }
    }
  };

  const handleSelectAll = () => {
    const currentPageProfits = getCurrentPageProfits();
    const currentPageIds = currentPageProfits.map(p => p.id);
    const allSelected = currentPageIds.every(id => selectedProfits.includes(id));

    if (allSelected) {
      setSelectedProfits(selectedProfits.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedProfits([...new Set([...selectedProfits, ...currentPageIds])]);
    }
  };

  const handleSelectProfit = (id) => {
    if (selectedProfits.includes(id)) {
      setSelectedProfits(selectedProfits.filter(pid => pid !== id));
    } else {
      setSelectedProfits([...selectedProfits, id]);
    }
  };

  const filteredProfits = profits.filter(profit => {
    const matchesSearch = profit.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profit.investment?.toString().includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || profit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPagesCalc = Math.ceil(filteredProfits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getCurrentPageProfits = () => {
    return filteredProfits.slice(startIndex, endIndex);
  };

  const currentPageProfits = getCurrentPageProfits();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedProfits([]);
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
    fetchProfits(currentPage, searchTerm, filterStatus);
  }, [currentPage, searchTerm, filterStatus]);

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = selectedProfits.length > 0
      ? profits.filter(p => selectedProfits.includes(p.id))
      : profits;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(p => ({
      'SL No': p.id,
      'Customer Name': p.customerName,
      'Investment': p.investment,
      'Status': p.status
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Profits');
    XLSX.writeFile(workbook, 'profits.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dataToExport = selectedProfits.length > 0
      ? profits.filter(p => selectedProfits.includes(p.id))
      : profits;

    // Add title
    doc.setFontSize(18);
    doc.text('Profit Records', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = dataToExport.map(p => [
      p.id,
      p.customerName,
      `$${p.investment}`,
      p.status
    ]);

    // Create table
    autoTable(doc, {
      head: [['SL No', 'Customer Name', 'Investment', 'Status']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 }
    });

    doc.save('profits.pdf');
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);

    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Profit Records</title>
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
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">Profit Management</h1>
              <p className="text-green-100 text-sm">Manage and monitor profit records</p>
            </div>
          </div>
          <Link
            to="/add-profit"
            className="flex items-center gap-3 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            <Plus size={20} />
            <span>Add Profit Record</span>
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
          <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 sm:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Profit Records</h2>
                  <p className="text-gray-600">Manage all profit records in one place</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <p className="text-sm text-gray-500">Total Records</p>
                  <p className="text-2xl font-bold text-green-600">{totalItems}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] sm:min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by customer name or investment amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-3 border-2 rounded-xl transition-all ${
                    showFilters
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <Filter size={18} />
                  <span className="font-medium">Filters</span>
                </button>

                {/* Enhanced Export Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all font-medium">
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border-2 border-gray-200 hidden group-hover:block z-20">
                    <button
                      onClick={exportToExcel}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 flex items-center gap-3 transition-colors"
                    >
                      <FileText size={16} className="text-green-600" />
                      <div>
                        <div className="font-medium text-gray-800">Export to Excel</div>
                        <div className="text-xs text-gray-500">Download as .xlsx file</div>
                      </div>
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 flex items-center gap-3 transition-colors"
                    >
                      <FileText size={16} className="text-red-600" />
                      <div>
                        <div className="font-medium text-gray-800">Export to PDF</div>
                        <div className="text-xs text-gray-500">Download as .pdf file</div>
                      </div>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-green-50 flex items-center gap-3 transition-colors"
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
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading profit records...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="px-6 py-12 text-center">
              <div className="text-red-600 mb-4">
                <AlertCircle size={48} className="mx-auto mb-3 text-red-300" />
                <p className="text-lg font-medium">Error loading profit records</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => fetchProfits(currentPage, searchTerm, filterStatus)}
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
                  <thead className="bg-gradient-to-r from-green-900 to-emerald-900 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold">SL No</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Customer Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Investment</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentPageProfits.length > 0 ? (
                      currentPageProfits.map((profit, idx) => (
                        <tr key={profit.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-green-600">{startIndex + idx + 1}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">{profit.customerName || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">${profit.investment?.toLocaleString() || '0'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewProfit(profit)}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                                title="View Details"
                              >
                                <Eye size={16} className="text-blue-600 group-hover:text-blue-700" />
                              </button>
                              <button
                                onClick={() => handleEditProfit(profit)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                                title="Edit Profit Record"
                              >
                                <Edit2 size={16} className="text-green-600 group-hover:text-green-700" />
                              </button>
                              <button
                                onClick={() => handleDeleteProfit(profit.id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                title="Delete Profit Record"
                              >
                                <Trash2 size={16} className="text-red-600 group-hover:text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <DollarSign className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xl font-semibold text-gray-600 mb-2">No profit records found</p>
                              <p className="text-sm text-gray-500">
                                {searchTerm || filterStatus !== 'all'
                                  ? 'Try adjusting your search or filter criteria'
                                  : 'No profit records available at the moment'
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
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-bold text-green-600">{startIndex + 1}-{Math.min(endIndex, filteredProfits.length)}</span> of <span className="font-bold text-gray-800">{totalItems}</span> profit records
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
                        : 'text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50'
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
                              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105'
                              : 'border-2 border-gray-300 hover:border-green-400 hover:bg-green-50'
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
                        : 'text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50'
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
      {showEditModal && editingProfit && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-full sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 text-white px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between sticky top-0 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Edit2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Profit Record</h2>
                  <p className="text-green-100 text-sm">Update profit record details</p>
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
              {/* Customer Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={editingProfit.customerName || ''}
                      onChange={(e) => setEditingProfit({...editingProfit, customerName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($)</label>
                    <input
                      type="number"
                      value={editingProfit.investment || ''}
                      onChange={(e) => setEditingProfit({...editingProfit, investment: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Enter investment amount"
                    />
                  </div>
                </div>
              </div>

              {/* Profit Details Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profit Amount ($)</label>
                    <input
                      type="number"
                      value={editingProfit.profit_amount || ''}
                      onChange={(e) => setEditingProfit({...editingProfit, profit_amount: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Enter profit amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProfit.interest_rate || ''}
                      onChange={(e) => setEditingProfit({...editingProfit, interest_rate: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                      placeholder="Enter interest rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editingProfit.status === 'Active' ? 'Active' : editingProfit.status === 'Inactive' ? 'Inactive' : editingProfit.status}
                      onChange={(e) => setEditingProfit({...editingProfit, status: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Date</label>
                    <input
                      type="date"
                      value={editingProfit.investment_date || ''}
                      onChange={(e) => setEditingProfit({...editingProfit, investment_date: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maturity Date</label>
                    <input
                      type="date"
                      value={editingProfit.maturity_date || ''}
                      onChange={(e) => setEditingProfit({...editingProfit, maturity_date: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateProfit}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-900 to-green-800 text-white rounded-lg hover:from-green-800 hover:to-green-700"
                >
                  Update Profit Record
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
      {showViewModal && viewingProfitId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-full sm:max-w-4xl max-h-[90vh] overflow-auto">
            <div className="bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 text-white px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Profit Record Details</h2>
                  <p className="text-green-100 text-sm">View complete profit record information</p>
                </div>
              </div>
              <button
                onClick={handleCloseViewModal}
                className="hover:bg-white/20 p-2 rounded-xl transition-all transform hover:scale-105"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {(() => {
                const profit = profits.find(p => p.id === viewingProfitId);
                if (!profit) return <div>Profit record not found</div>;

                return (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                          <p className="text-lg font-semibold text-gray-800">{profit.customerName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Investment Amount</p>
                          <p className="text-lg font-semibold text-green-600">${profit.investment?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Profit Amount</p>
                          <p className="text-lg font-semibold text-green-600">${profit.profit_amount?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Interest Rate</p>
                          <p className="text-lg font-semibold text-gray-800">{profit.interest_rate || '0'}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Date Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Date Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Investment Date</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {profit.investment_date ? new Date(profit.investment_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Maturity Date</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {profit.maturity_date ? new Date(profit.maturity_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Information */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gray-600" />
                        Status Information
                      </h3>
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                          profit.status === 'Active'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {profit.status === 'Active' ? (
                            <Activity className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                          {profit.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}