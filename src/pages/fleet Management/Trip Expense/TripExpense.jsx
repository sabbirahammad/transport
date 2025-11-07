import React, { useState, useRef } from 'react';
import {
  Search, Plus, Filter, Download, Upload, RefreshCw,
  Edit2, Trash2, Eye, Phone, Mail, MapPin, DollarSign,
  TrendingUp, FileText, Printer, MoreVertical, AlertCircle,
  Users, User, ChevronLeft, ChevronRight, X, Truck, Activity,
  Clock, Gauge, Fuel, Calendar, Camera, Settings,
  BarChart3, PieChart, Star, Award, Zap, Receipt
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function TripExpense() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatingExpense, setUpdatingExpense] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();

  // API base URL
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // Expense state
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch expenses from API
  const fetchExpenses = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/trip-expenses?page=${page}&page_size=${itemsPerPage}`;
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
      console.log('Trip Expense API Response:', data);

      // Handle different API response structures
      const expensesData = data.expenses || data.data || data.results || [];
      console.log('Raw API response:', data);
      console.log('Expenses data array:', expensesData);

      // Map API response to expected fields
      const mappedExpenses = expensesData.map((expense, index) => {
        console.log(`Expense ${index}:`, expense);

        return {
          id: expense.id,
          slNo: expense.id,
          tripCost: expense.trip_cost || expense.tripCost || 0,
          extraCost: expense.extra_cost || expense.extraCost || null,
          tripId: expense.trip_id || expense.tripId,
          tripName: expense.trip_name || expense.tripName || 'N/A',
          vehicleNo: expense.vehicle_no || expense.vehicleNo || 'N/A',
          driverName: expense.driver_name || expense.driverName || 'N/A',
          date: expense.date || expense.trip_date || 'N/A',
          status: expense.status || 'Active',
          created_at: expense.created_at,
          updated_at: expense.updated_at,
        };
      });

      setExpenses(mappedExpenses);
      setTotalPages(data.total_pages || Math.ceil((data.total || data.count || 0) / itemsPerPage));
      setTotalItems(data.total || data.count || 0);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.message);
      // Fallback to empty array
      setExpenses([]);
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
      description: 'All trip expenses'
    },
    {
      label: 'Total Trip Cost',
      value: `$${expenses.reduce((sum, exp) => sum + (exp.tripCost || 0), 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      trend: '+12',
      bgGradient: 'from-green-500 to-green-600',
      description: 'Combined trip costs'
    },
    {
      label: 'Total Extra Cost',
      value: `$${expenses.reduce((sum, exp) => sum + (exp.extraCost || 0), 0).toLocaleString()}`,
      icon: Receipt,
      color: 'orange',
      trend: '+8',
      bgGradient: 'from-orange-500 to-orange-600',
      description: 'Additional expenses'
    },
    {
      label: 'Avg Cost per Trip',
      value: totalItems > 0 ? `$${(expenses.reduce((sum, exp) => sum + (exp.tripCost || 0) + (exp.extraCost || 0), 0) / totalItems).toFixed(0)}` : '$0',
      icon: TrendingUp,
      color: 'purple',
      trend: '+6',
      bgGradient: 'from-purple-500 to-purple-600',
      description: 'Average expense per trip'
    }
  ];

  const handleUpdateExpense = (expense) => {
    setUpdatingExpense({
      ...expense,
      extraCost: expense.extraCost || ''
    });
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdatingExpense(null);
  };

  const handleUpdateExtraCost = async () => {
    try {
      const formData = new FormData();
      formData.append('extra_cost', updatingExpense.extraCost || '');

      const response = await fetch(`${API_BASE_URL}/trip-expenses/${updatingExpense.id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update response:', result);

      // Update local state
      const updatedExpense = {
        ...updatingExpense,
        extraCost: parseFloat(updatingExpense.extraCost) || null,
        updated_at: new Date().toISOString()
      };

      setExpenses(expenses.map(exp => exp.id === updatingExpense.id ? updatedExpense : exp));
      setShowUpdateModal(false);
      setUpdatingExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update extra cost. Please try again.');
    }
  };

  const handleAddExtraCost = (expense) => {
    setUpdatingExpense({
      ...expense,
      extraCost: ''
    });
    setShowUpdateModal(true);
  };

  const handleSelectAll = () => {
    const currentPageExpenses = getCurrentPageExpenses();
    const currentPageIds = currentPageExpenses.map(exp => exp.id);
    const allSelected = currentPageIds.every(id => selectedExpenses.includes(id));

    if (allSelected) {
      setSelectedExpenses(selectedExpenses.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedExpenses([...new Set([...selectedExpenses, ...currentPageIds])]);
    }
  };

  const handleSelectExpense = (id) => {
    if (selectedExpenses.includes(id)) {
      setSelectedExpenses(selectedExpenses.filter(vid => vid !== id));
    } else {
      setSelectedExpenses([...selectedExpenses, id]);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.tripName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.driverName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || expense.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPagesCalc = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getCurrentPageExpenses = () => {
    return filteredExpenses.slice(startIndex, endIndex);
  };

  const currentPageExpenses = getCurrentPageExpenses();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedExpenses([]);
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
    fetchExpenses(currentPage, searchTerm, filterStatus);
  }, [currentPage, searchTerm, filterStatus]);

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = selectedExpenses.length > 0
      ? expenses.filter(exp => selectedExpenses.includes(exp.id))
      : expenses;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(exp => ({
      'SL No': exp.slNo,
      'Trip Name': exp.tripName,
      'Vehicle No': exp.vehicleNo,
      'Driver Name': exp.driverName,
      'Trip Cost': exp.tripCost,
      'Extra Cost': exp.extraCost || 0,
      'Total Cost': (exp.tripCost || 0) + (exp.extraCost || 0),
      'Date': exp.date
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trip Expenses');
    XLSX.writeFile(workbook, 'trip_expenses.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dataToExport = selectedExpenses.length > 0
      ? expenses.filter(exp => selectedExpenses.includes(exp.id))
      : expenses;

    // Add title
    doc.setFontSize(18);
    doc.text('Trip Expenses', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Prepare table data
    const tableData = dataToExport.map(exp => [
      exp.slNo,
      exp.tripName,
      exp.vehicleNo,
      exp.driverName,
      `$${exp.tripCost || 0}`,
      `$${exp.extraCost || 0}`,
      `$${(exp.tripCost || 0) + (exp.extraCost || 0)}`,
      exp.date
    ]);

    // Create table
    autoTable(doc, {
      head: [['SL No', 'Trip Name', 'Vehicle No', 'Driver Name', 'Trip Cost', 'Extra Cost', 'Total Cost', 'Date']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 }
    });

    doc.save('trip_expenses.pdf');
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);

    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Trip Expenses</title>
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
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">Trip Expense Management</h1>
              <p className="text-blue-100 text-sm">Track and manage trip expenses</p>
            </div>
          </div>
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
                  <Receipt className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Trip Expenses</h2>
                  <p className="text-gray-600">Manage all trip expense records</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <p className="text-sm text-gray-500">Total Expenses</p>
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
                  placeholder="Search by trip name, vehicle number, or driver name..."
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
                    <option value="Completed">Completed</option>
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
                <span>Loading trip expenses...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="px-6 py-12 text-center">
              <div className="text-red-600 mb-4">
                <AlertCircle size={48} className="mx-auto mb-3 text-red-300" />
                <p className="text-lg font-medium">Error loading trip expenses</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => fetchExpenses(currentPage, searchTerm, filterStatus)}
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
                      <th className="px-6 py-4 text-left text-sm font-bold">Trip Cost</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Extra Cost</th>
                      <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentPageExpenses.length > 0 ? (
                      currentPageExpenses.map((expense, idx) => (
                        <tr key={expense.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-blue-600">{startIndex + idx + 1}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-800">${expense.tripCost || 0}</span>
                          </td>
                          <td className="px-6 py-4">
                            {expense.extraCost ? (
                              <span className="font-medium text-gray-800">${expense.extraCost}</span>
                            ) : (
                              <button
                                onClick={() => handleAddExtraCost(expense)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Add Cost
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleUpdateExpense(expense)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                                title="Update Extra Cost"
                              >
                                <Edit2 size={16} className="text-green-600 group-hover:text-green-700" />
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
                              <Receipt className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xl font-semibold text-gray-600 mb-2">No trip expenses found</p>
                              <p className="text-sm text-gray-500">
                                {searchTerm || filterStatus !== 'all'
                                  ? 'Try adjusting your search or filter criteria'
                                  : 'No trip expenses available at the moment'
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
                    Showing <span className="font-bold text-blue-600">{startIndex + 1}-{Math.min(endIndex, filteredExpenses.length)}</span> of <span className="font-bold text-gray-800">{totalItems}</span> expenses
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

      {/* Update Extra Cost Modal */}
      {showUpdateModal && updatingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 text-white px-6 py-4 flex items-center justify-between sticky top-0 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Edit2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Update Extra Cost</h2>
                  <p className="text-blue-100 text-sm">Trip: {updatingExpense.tripName}</p>
                </div>
              </div>
              <button
                onClick={handleCloseUpdateModal}
                className="hover:bg-white/20 p-2 rounded-xl transition-all transform hover:scale-105"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Extra Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={updatingExpense.extraCost}
                  onChange={(e) => setUpdatingExpense({...updatingExpense, extraCost: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter extra cost amount"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdateExtraCost}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all font-medium"
                >
                  Update
                </button>
                <button
                  onClick={handleCloseUpdateModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
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