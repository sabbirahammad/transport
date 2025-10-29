import React, { useState, useRef } from 'react';
import { 
  Search, Plus, Filter, Download, Upload, RefreshCw, 
  Edit2, Trash2, Eye, Phone, Mail, MapPin, DollarSign,
  TrendingUp, FileText, Printer, MoreVertical, AlertCircle, 
  Users, ChevronLeft, ChevronRight, X, Truck, Package
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';

export default function RoutePricing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const itemsPerPage = 10;
  const printRef = useRef();

  // Sample route pricing data
  const [pricingData, setPricingData] = useState([
    {
      id: 1,
      customer: 'Rahman Enterprise',
      vehicleCategory: 'Covered Van',
      size: '10 Feet',
      loadPoint: 'Dhaka',
      unloadPoint: 'Chittagong',
      rate: 12000,
      weight: '5 Ton',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      customer: 'Rahim Trading',
      vehicleCategory: 'Open Truck',
      size: '12 Feet',
      loadPoint: 'Dhaka',
      unloadPoint: 'Sylhet',
      rate: 8500,
      weight: '8 Ton',
      createdDate: '2024-02-20'
    },
    {
      id: 3,
      customer: 'Hasan Logistics',
      vehicleCategory: 'Covered Van',
      size: '14 Feet',
      loadPoint: 'Chittagong',
      unloadPoint: 'Dhaka',
      rate: 15000,
      weight: '10 Ton',
      createdDate: '2024-03-10'
    },
    {
      id: 4,
      customer: 'Ali Brothers',
      vehicleCategory: 'Trailer',
      size: '20 Feet',
      loadPoint: 'Dhaka',
      unloadPoint: 'Khulna',
      rate: 25000,
      weight: '20 Ton',
      createdDate: '2024-04-05'
    },
    {
      id: 5,
      customer: 'Salam Transport',
      vehicleCategory: 'Pickup',
      size: '8 Feet',
      loadPoint: 'Dhaka',
      unloadPoint: 'Mymensingh',
      rate: 5500,
      weight: '2 Ton',
      createdDate: '2024-05-12'
    }
  ]);

  const [newPricing, setNewPricing] = useState({
    customer: '',
    vehicleCategory: '',
    size: '',
    loadPoint: '',
    unloadPoint: '',
    rate: '',
    weight: ''
  });

  const customers = ['Rahman Enterprise', 'Rahim Trading', 'Hasan Logistics', 'Ali Brothers', 'Salam Transport'];
  const vehicleCategories = ['Covered Van', 'Open Truck', 'Trailer', 'Pickup', 'Container'];
  const sizes = ['8 Feet', '10 Feet', '12 Feet', '14 Feet', '20 Feet', '40 Feet'];
  const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Mymensingh', 'Rangpur', 'Barisal'];
  const weightOptions = ['1 Ton', '2 Ton', '3 Ton', '5 Ton', '8 Ton', '10 Ton', '15 Ton', '20 Ton', '25 Ton', '30 Ton'];

  const stats = [
    { label: 'Total Routes', value: pricingData.length.toString(), icon: MapPin, color: 'blue', trend: '+5' },
    { label: 'Customers', value: new Set(pricingData.map(p => p.customer)).size.toString(), icon: Users, color: 'green', trend: '+3' },
    { label: 'Avg Rate', value: '৳' + Math.round(pricingData.reduce((sum, p) => sum + p.rate, 0) / pricingData.length).toLocaleString(), icon: DollarSign, color: 'orange', trend: '+8' },
    { label: 'Vehicle Types', value: new Set(pricingData.map(p => p.vehicleCategory)).size.toString(), icon: Truck, color: 'purple', trend: '+2' }
  ];

  const handleAddPricing = () => {
    if (!newPricing.customer || !newPricing.vehicleCategory || !newPricing.size ||
        !newPricing.loadPoint || !newPricing.unloadPoint || !newPricing.rate || !newPricing.weight) {
      alert('Please fill all fields');
      return;
    }

    const pricing = {
      id: pricingData.length + 1,
      ...newPricing,
      rate: Number(newPricing.rate),
      createdDate: new Date().toISOString().split('T')[0]
    };

    setPricingData([...pricingData, pricing]);
    setShowAddModal(false);
    setNewPricing({
      customer: '',
      vehicleCategory: '',
      size: '',
      loadPoint: '',
      unloadPoint: '',
      rate: '',
      weight: ''
    });
  };

  const handleEditPricing = (pricing) => {
    setEditingPricing({ ...pricing });
    setShowEditModal(true);
  };

  const handleUpdatePricing = () => {
    setPricingData(pricingData.map(p => 
      p.id === editingPricing.id ? editingPricing : p
    ));
    setShowEditModal(false);
    setEditingPricing(null);
  };

  const handleDeletePricing = (id) => {
    if (window.confirm('Are you sure you want to delete this pricing?')) {
      setPricingData(pricingData.filter(p => p.id !== id));
    }
  };

  const handleSelectAll = () => {
    const currentPagePricing = getCurrentPagePricing();
    const currentPageIds = currentPagePricing.map(p => p.id);
    const allSelected = currentPageIds.every(id => selectedPricing.includes(id));
    
    if (allSelected) {
      setSelectedPricing(selectedPricing.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedPricing([...new Set([...selectedPricing, ...currentPageIds])]);
    }
  };

  const handleSelectPricing = (id) => {
    if (selectedPricing.includes(id)) {
      setSelectedPricing(selectedPricing.filter(pid => pid !== id));
    } else {
      setSelectedPricing([...selectedPricing, id]);
    }
  };

  const filteredPricing = pricingData.filter(pricing => {
    const matchesSearch = pricing.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pricing.loadPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pricing.unloadPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pricing.vehicleCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomer = filterCustomer === 'all' || pricing.customer === filterCustomer;
    const matchesVehicle = filterVehicle === 'all' || pricing.vehicleCategory === filterVehicle;
    return matchesSearch && matchesCustomer && matchesVehicle;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPricing.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const getCurrentPagePricing = () => {
    return filteredPricing.slice(startIndex, endIndex);
  };

  const currentPagePricing = getCurrentPagePricing();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedPricing([]);
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
  }, [searchTerm, filterCustomer, filterVehicle]);

  // Export to Excel
  const exportToExcel = () => {
    const dataToExport = selectedPricing.length > 0 
      ? pricingData.filter(p => selectedPricing.includes(p.id))
      : pricingData;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(p => ({
      'Customer': p.customer,
      'Vehicle Category': p.vehicleCategory,
      'Size': p.size,
      'Weight': p.weight,
      'Load Point': p.loadPoint,
      'Unload Point': p.unloadPoint,
      'Rate': p.rate,
      'Created Date': p.createdDate
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Route Pricing');
    XLSX.writeFile(workbook, 'route-pricing.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dataToExport = selectedPricing.length > 0 
      ? pricingData.filter(p => selectedPricing.includes(p.id))
      : pricingData;

    doc.setFontSize(18);
    doc.text('Customer Route Pricing', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableData = dataToExport.map(p => [
      p.customer,
      p.vehicleCategory,
      p.size,
      p.weight,
      p.loadPoint,
      p.unloadPoint,
      `৳${p.rate.toLocaleString()}`
    ]);

    doc.autoTable({
      head: [['Customer', 'Vehicle Category', 'Size', 'Weight', 'Load Point', 'Unload Point', 'Rate']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 }
    });

    doc.save('route-pricing.pdf');
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Customer Route Pricing</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #1e3a8a; color: white; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Customer Route Pricing</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Stats Cards */}
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

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Action Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Customer Route Pricing</h2>
              </div>
            <Link to={'/add-pricing'}>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                <span className="font-medium">Add Pricing</span>
              </button>
            </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by customer, location, vehicle..."
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
                  <Filter size={18} />
                  <span>Filters</span>
                </button>
                
                {/* Export Dropdown */}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select 
                    value={filterCustomer}
                    onChange={(e) => setFilterCustomer(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Customers</option>
                    {customers.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select 
                    value={filterVehicle}
                    onChange={(e) => setFilterVehicle(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Vehicle Types</option>
                    {vehicleCategories.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto" ref={printRef}>
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  {/* <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={currentPagePricing.length > 0 && currentPagePricing.every(p => selectedPricing.includes(p.id))}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th> */}
                  <th className="px-4 py-3 text-left text-sm font-semibold">SL</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Vehicle Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Weight</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Load Point</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Unload Point</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rate</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPagePricing.length > 0 ? (
                  currentPagePricing.map((pricing, idx) => (
                    <tr key={pricing.id} className="hover:bg-gray-50">
                      {/* <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedPricing.includes(pricing.id)}
                          onChange={() => handleSelectPricing(pricing.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td> */}
                      <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs">
                            {pricing.customer.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{pricing.customer}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{pricing.vehicleCategory}</td>
                      <td className="px-4 py-3 text-sm">{pricing.size}</td>
                      <td className="px-4 py-3 text-sm font-medium">{pricing.weight}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-green-600" />
                          {pricing.loadPoint}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-red-600" />
                          {pricing.unloadPoint}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-green-600">
                          ৳{pricing.rate.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEditPricing(pricing)}
                            className="p-1.5 hover:bg-green-50 rounded" 
                            title="Edit"
                          >
                            <Edit2 size={16} className="text-green-600" />
                          </button>
                          <button 
                            onClick={() => handleDeletePricing(pricing.id)}
                            className="p-1.5 hover:bg-red-50 rounded" 
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-4 py-12 text-center text-gray-500">
                      <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No customer found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredPricing.length)}</strong> of <strong>{filteredPricing.length}</strong>
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Add Route Pricing</h2>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
                  <select
                    value={newPricing.customer}
                    onChange={(e) => setNewPricing({...newPricing, customer: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Category *</label>
                  <select
                    value={newPricing.vehicleCategory}
                    onChange={(e) => setNewPricing({...newPricing, vehicleCategory: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicleCategories.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                  <select
                    value={newPricing.size}
                    onChange={(e) => setNewPricing({...newPricing, size: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Size</option>
                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight *</label>
                  <select
                    value={newPricing.weight}
                    onChange={(e) => setNewPricing({...newPricing, weight: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Weight</option>
                    {weightOptions.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate (৳) *</label>
                  <input
                    type="number"
                    value={newPricing.rate}
                    onChange={(e) => setNewPricing({...newPricing, rate: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter rate"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Load Point *</label>
                  <select
                    value={newPricing.loadPoint}
                    onChange={(e) => setNewPricing({...newPricing, loadPoint: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Load Point</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unload Point *</label>
                  <select
                    value={newPricing.unloadPoint}
                    onChange={(e) => setNewPricing({...newPricing, unloadPoint: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Unload Point</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddPricing}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700"
                >
                  Add Pricing
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Route Pricing</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                  <select
                    value={editingPricing.customer}
                    onChange={(e) => setEditingPricing({...editingPricing, customer: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {customers.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Category</label>
                  <select
                    value={editingPricing.vehicleCategory}
                    onChange={(e) => setEditingPricing({...editingPricing, vehicleCategory: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {vehicleCategories.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <select
                    value={editingPricing.size}
                    onChange={(e) => setEditingPricing({...editingPricing, size: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                  <select
                    value={editingPricing.weight}
                    onChange={(e) => setEditingPricing({...editingPricing, weight: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {weightOptions.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate (৳)</label>
                  <input
                    type="number"
                    value={editingPricing.rate}
                    onChange={(e) => setEditingPricing({...editingPricing, rate: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Load Point</label>
                  <select
                    value={editingPricing.loadPoint}
                    onChange={(e) => setEditingPricing({...editingPricing, loadPoint: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unload Point</label>
                  <select
                    value={editingPricing.unloadPoint}
                    onChange={(e) => setEditingPricing({...editingPricing, unloadPoint: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleUpdatePricing}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700"
                >
                  Update Pricing
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