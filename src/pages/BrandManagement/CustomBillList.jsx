import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, Filter, Download,
  Edit2, Trash2, Eye, AlertCircle,
  ChevronLeft, ChevronRight, X, TrendingUp, DollarSign, FileText, Printer, Loader2, ArrowLeft, User, Package
} from 'lucide-react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import CustomBillRecord from './CustomBillRecord';

// API base URL
const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

export default function CustomBillList() {
  const { id } = useParams(); // This is productId from URL
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [customer, setCustomer] = useState(null);
  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState('');
  const [bills, setBills] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBills, setSelectedBills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBillRecordModal, setShowBillRecordModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [viewingBill, setViewingBill] = useState(null);
  const [customerId, setcustomerId] = useState()

  const itemsPerPage = 10;
  const printRef = useRef();

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Helper function to set nested object values
  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
    return obj;
  };

  // Initial data fetch
  useEffect(() => {
    fetchInitialData();
  }, [id, location.state]);

  // Fetch all initial data
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get data from navigation state first
      const stateProductId = location.state?.productId;
      const stateProductName = location.state?.productName;
      const stateSelectedCustomer = location.state?.selectedCustomer;
      const stateCustomerId = location.state?.customerId;

      if (stateProductId) setProductId(stateProductId);
      if (stateProductName) setProductName(stateProductName);
      if (stateSelectedCustomer) setCustomer(stateSelectedCustomer);
      if (stateCustomerId) setcustomerId(stateCustomerId);

      if (!id) {
        setError('Product ID is required');
        return;
      }

      // 1. Fetch product details
      const productRes = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!productRes.ok) {
        throw new Error(`Product not found with ID ${id}`);
      }
      const productData = await productRes.json();
      setProduct(productData);
      setProductId(productData.id);
      setProductName(productData.name || productData.productName || '');

      // 2. Fetch customer details
      if (productData.company_id) {
        const customerRes = await fetch(`${API_BASE_URL}/customer/${productData.company_id}`);
        if (customerRes.ok) {
          const customerData = await customerRes.json();
          setCustomer({
            id: customerData.id,
            name: customerData.customerName || customerData.name || 'Unknown',
            address: customerData.address || ''
          });
        }
      }

      // 3. Fetch bill fields
      await fetchBillFields();

      // 4. Fetch bills using GET /api/v1/bills (we'll filter by product_id)
      await fetchBills();

    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };
console.log(customerId)
  // Fetch bill fields for the product
  const fetchBillFields = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/bill-fields`);
      if (response.ok) {
        const data = await response.json();
        let fieldsArray = [];

        if (Array.isArray(data)) {
          fieldsArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          fieldsArray = data.data;
        } else if (data.bill_fields && Array.isArray(data.bill_fields)) {
          fieldsArray = data.bill_fields;
        } else if (typeof data === 'object' && data.bill_fields) {
          fieldsArray = Array.isArray(data.bill_fields) ? data.bill_fields : [];
        } else if (data.note && data.note.bill_fields && Array.isArray(data.note.bill_fields)) {
          fieldsArray = data.note.bill_fields;
        }

        setSelectedFields(fieldsArray);
      } else {
        setSelectedFields([]);
      }
    } catch (err) {
      console.error('Error fetching bill fields:', err);
      setSelectedFields([]);
    }
  };

  // Fetch bills using GET /api/v1/products/:id/bills
  const fetchBills = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/bills`);
      if (response.ok) {
        const data = await response.json();
        let billsArray = [];

        if (Array.isArray(data)) {
          billsArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          billsArray = data.data;
        } else if (data.bills && Array.isArray(data.bills)) {
          billsArray = data.bills;
        } else if (typeof data === 'object' && data.bills) {
          billsArray = Array.isArray(data.bills) ? data.bills : [];
        } else if (data.note && data.note.bills && Array.isArray(data.note.bills)) {
          billsArray = data.note.bills;
        }

        setBills(billsArray);
      } else {
        throw new Error(`Failed to fetch bills: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError('Failed to load bills data');
      setBills([]);
    }
  };

  // Debug logs
  console.log('Selected Fields:', selectedFields);
  console.log('Bills Data:', bills);
  console.log('Product ID:', id);

  // All possible fields definition (matching BillField component)
  const allFields = [
    { key: 'id', label: 'ID' },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date' },
    { key: 'challanNo', label: 'Challan No' },
    { key: 'status', label: 'Status' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'distributorName', label: 'Distributor Name' },
    { key: 'dealerName', label: 'Dealer Name' },
    { key: 'vehicleNo', label: 'Vehicle No' },
    { key: 'driverName', label: 'Driver Name' },
    { key: 'vehicleSize', label: 'Vehicle Size' },
    { key: 'from', label: 'From' },
    { key: 'destination', label: 'Destination' },
    { key: 'portfolio', label: 'Portfolio' },
    { key: 'product', label: 'Product' },
    { key: 'goods', label: 'Goods' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'bikeQty', label: 'Bike Qty' },
    { key: 'financial.unloadCharge', label: 'Unload Charge' },
    { key: 'financial.vehicleRentWithVATTax', label: 'Vehicle Rent with VAT Tax' },
    { key: 'financial.vehicleRent', label: 'Vehicle Rent' },
    { key: 'financial.dropping', label: 'Dropping' },
    { key: 'financial.alt5', label: 'Alt5' },
    { key: 'financial.vat10', label: 'VAT 10%' },
    { key: 'financial.totalRate', label: 'Total Rate' },
    { key: 'financial.advance', label: 'Advance' },
    { key: 'financial.due', label: 'Due' },
    { key: 'financial.total', label: 'Total' },
    { key: 'financial.profit', label: 'Profit' },
    { key: 'financial.bodyFare', label: 'Body Fare' },
    { key: 'financial.fuelCost', label: 'Fuel Cost' },
    { key: 'financial.amount', label: 'Amount' },
    { key: 'totalAmount', label: 'Total Amount' }
  ];

  // Get valid selected fields with labels
  const validSelectedFields = selectedFields
    .map(fieldKey => {
      // Try to find exact match first
      const field = allFields.find(f => f.key === fieldKey);
      if (field) return field;
      
      // If not found, create a field object with formatted label
      const label = fieldKey
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      
      return { key: fieldKey, label };
    });

  console.log('Valid Selected Fields:', validSelectedFields);

  // Table columns
  const tableColumns = validSelectedFields;

  // Filter bills by product
  const filteredBills = bills
    .filter(bill => {
      if (!searchTerm) return true;
      return tableColumns.some(col => {
        const value = getNestedValue(bill, col.key);
        return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
      });
    })
    .filter(bill => {
      if (filterStatus === 'all') return true;
      return (bill.status || '').toLowerCase() === filterStatus.toLowerCase();
    });

  // Calculate stats
  const totalRecords = filteredBills.length;
  const totalAmount = filteredBills.reduce((sum, item) =>
    sum + (Number(item.totalAmount) || Number(item.financial?.total) || Number(item.financial?.amount) || 0), 0
  );
  const totalProfit = filteredBills.reduce((sum, item) =>
    sum + (Number(item.financial?.profit) || 0), 0
  );

  const stats = [
    { label: 'Total Records', value: totalRecords.toString(), icon: TrendingUp, color: 'blue' },
    { label: 'Total Amount', value: `৳${totalAmount.toLocaleString()}`, icon: DollarSign, color: 'green' },
    { label: 'Total Profit', value: `৳${totalProfit.toLocaleString()}`, icon: DollarSign, color: 'purple' }
  ];

  // Pagination
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageBills = filteredBills.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedBills([]);
  };

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

  // Selection handlers
  const handleSelectAll = () => {
    const currentPageIds = currentPageBills.map(b => b.id);
    const allSelected = currentPageIds.every(id => selectedBills.includes(id));
    setSelectedBills(allSelected
      ? selectedBills.filter(id => !currentPageIds.includes(id))
      : [...new Set([...selectedBills, ...currentPageIds])]
    );
  };

  const handleSelectBill = (id) => {
    setSelectedBills(prev =>
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  // CRUD handlers
  const handleViewBill = (bill) => {
    setViewingBill({ ...bill });
    setShowViewModal(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill({ ...bill });
    setShowEditModal(true);
  };

  const handleUpdateBill = async () => {
    try {
      setOperationLoading(true);
      const response = await fetch(`${API_BASE_URL}/bills/${editingBill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBill),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update bill: ${response.status}`);
      }

      // Update the bill in the local state immediately
      setBills(bills.map(b => b.id === editingBill.id ? editingBill : b));
      setShowEditModal(false);
      setEditingBill(null);

      // Refresh bills from API to ensure consistency
      await fetchBills();
    } catch (err) {
      console.error('Error updating bill:', err);
      alert(`Update failed: ${err.message}`);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteBill = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill? This action cannot be undone.')) return;

    try {
      setOperationLoading(true);
      const response = await fetch(`${API_BASE_URL}/bills/${billId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete bill: ${response.status}`);
      }

      // Remove the bill from local state immediately
      setBills(bills.filter(b => b.id !== billId));

      // Refresh bills from API to ensure consistency
      await fetchBills();
    } catch (err) {
      console.error('Error deleting bill:', err);
      alert(`Delete failed: ${err.message}`);
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCreateBillRecord = async (formData) => {
    try {
      setOperationLoading(true);
      console.log('Creating bill record:', formData);

      // POST the bill data to the API - use the general bills endpoint
      const response = await fetch(`${API_BASE_URL}/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create bill record: ${response.status}`);
      }

      const newBill = await response.json();

      // Add the new bill to the bills state immediately
      setBills(prevBills => [...prevBills, newBill]);

      // Refresh the bills from API to ensure consistency
      await fetchBills();

    } catch (error) {
      console.error('Error creating bill record:', error);
      throw error; // Re-throw to let the modal handle the error
    } finally {
      setOperationLoading(false);
    }
  };

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedBills([]);
  }, [searchTerm, filterStatus]);

  // Refresh bills when selectedFields change
  useEffect(() => {
    if (selectedFields.length > 0 && id) {
      fetchBills();
    }
  }, [selectedFields]);

  // Handle loading overlay for operations
  const LoadingOverlay = () => (
    operationLoading && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex items-center gap-3">
          <Loader2 size={24} className="animate-spin text-blue-600" />
          <span className="text-gray-800">Processing...</span>
        </div>
      </div>
    )
  );

  // Export functions
  const exportToExcel = () => {
    const data = selectedBills.length > 0
      ? filteredBills.filter(b => selectedBills.includes(b.id))
      : filteredBills;

    const worksheet = XLSX.utils.json_to_sheet(data.map(b => {
      const row = { 'Product': productName || '' };
      tableColumns.forEach(col => {
        const value = getNestedValue(b, col.key);
        row[col.label] = value || '';
      });
      return row;
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bills');
    XLSX.writeFile(workbook, `${productName || 'bills'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = selectedBills.length > 0
      ? filteredBills.filter(b => selectedBills.includes(b.id))
      : filteredBills;

    doc.setFontSize(18);
    doc.text(`${productName || 'Bill'} Records`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Customer: ${customer?.name || ''}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 36);

    const tableData = data.map(b => {
      const row = [productName || ''];
      tableColumns.forEach(col => {
        const value = getNestedValue(b, col.key);
        row.push(typeof value === 'number' ? `৳${value.toLocaleString()}` : (value || ''));
      });
      return row;
    });

    doc.autoTable({
      head: [['Product', ...tableColumns.map(col => col.label)]],
      body: tableData,
      startY: 42,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`${productName || 'bills'}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={64} className="mx-auto mb-4 text-blue-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
          <p className="text-gray-600">Fetching bill data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (validSelectedFields.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Fields Selected</h2>
          <p className="text-gray-600 mb-4">Please configure bill fields for {productName || 'this product'}</p>
          <button
            onClick={() => navigate(`/customer/${id}/bill-field`, {
              state: {
                selectedCustomer: customer,
                productName: productName,
                productId: productId
              }
            })}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Configure Fields
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingOverlay />

      {/* Product Category Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 shadow-sm">
        <div className="flex flex-wrap gap-1">
          <button className="px-4 py-4 font-semibold text-sm bg-blue-900 text-white border-b-4 border-blue-600">
            {productName || 'Bill Records'}
          </button>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <stat.icon className={`text-${stat.color}-600`} size={20} />
                </div>
              </div>
              <p className="text-gray-600 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="text-blue-600" />
                  Bill List
                </h2>

                {/* Customer & Product Info */}
                <div className="mt-3 space-y-2">
                  {customer && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-semibold text-gray-800">{customer.name}</span>
                    </div>
                  )}
                  {product && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Product:</span>
                      <span className="font-semibold text-gray-800">{productName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBillRecordModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus size={18} />
                  Bill Record Name
                </button>
                <button
                  onClick={() => navigate(`/customer/${id}/trips`, {
                    state: {
                      productId: productId,
                      productName: productName,
                      selectedCustomer: customer
                    }
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <ArrowLeft size={18} />
                  Back to Trips
                </button>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search bills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={18} />
                Filters
              </button>

              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download size={18} />
                  Export
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                  <button onClick={exportToExcel} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <FileText size={16} /> Excel
                  </button>
                  <button onClick={exportToPDF} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <FileText size={16} /> PDF
                  </button>
                  <button onClick={handlePrint} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <Printer size={16} /> Print
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto" ref={printRef}>
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={currentPageBills.length > 0 && currentPageBills.every(b => selectedBills.includes(b.id))}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SL</th>
                  {tableColumns.map(col => (
                    <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageBills.length > 0 ? (
                  currentPageBills.map((bill, idx) => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedBills.includes(bill.id)}
                          onChange={() => handleSelectBill(bill.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                      {tableColumns.map(col => {
                        const value = getNestedValue(bill, col.key);
                        return (
                          <td key={col.key} className="px-4 py-3 text-sm">
                            {col.key === 'challanNo' ? (
                              <button
                                onClick={() => navigate(`/customer/${customer?.id}/custombillrecord`, {
                                  state: {
                                    billId: bill.id,
                                    productId: id,
                                    productName: productName,
                                    selectedCustomer: customer,
                                    billData: bill
                                  }
                                })}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                              >
                                {value || '-'}
                              </button>
                            ) : (
                              typeof value === 'number'
                                ? `৳${value.toLocaleString()}`
                                : (value || '-')
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewBill(bill)}
                            className="p-1.5 hover:bg-blue-50 rounded"
                          >
                            <Eye size={16} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEditBill(bill)}
                            className="p-1.5 hover:bg-green-50 rounded"
                          >
                            <Edit2 size={16} className="text-green-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteBill(bill.id)}
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
                    <td colSpan={tableColumns.length + 3} className="px-4 py-12 text-center text-gray-500">
                      <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No bills found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredBills.length)}</strong> of <strong>{filteredBills.length}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 border rounded text-sm flex items-center gap-1 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {getPageNumbers().map((page, idx) => (
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 rounded text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  )
                ))}

                <button
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 border rounded text-sm flex items-center gap-1 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && viewingBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Bill Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {validSelectedFields.map(field => {
                const value = getNestedValue(viewingBill, field.key);
                return (
                  <div key={field.key} className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {typeof value === 'number'
                        ? `৳${value.toLocaleString()}`
                        : (value || 'N/A')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Bill</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validSelectedFields.map(field => {
                  const value = getNestedValue(editingBill, field.key);
                  return (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {field.key === 'date' || field.key === 'billDate' || field.key === 'createdAt' || field.key === 'updatedAt' ? (
                        <input
                          type="date"
                          value={value || ''}
                          onChange={(e) => {
                            const updated = { ...editingBill };
                            setNestedValue(updated, field.key, e.target.value);
                            setEditingBill(updated);
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : field.key === 'status' ? (
                        <select
                          value={value || ''}
                          onChange={(e) => {
                            const updated = { ...editingBill };
                            setNestedValue(updated, field.key, e.target.value);
                            setEditingBill(updated);
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Status</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                        </select>
                      ) : field.key === 'remarks' ? (
                        <textarea
                          value={value || ''}
                          onChange={(e) => {
                            const updated = { ...editingBill };
                            setNestedValue(updated, field.key, e.target.value);
                            setEditingBill(updated);
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                      ) : (
                        <input
                          type={typeof value === 'number' ? 'number' : 'text'}
                          value={value || ''}
                          onChange={(e) => {
                            const updated = { ...editingBill };
                            const val = typeof value === 'number'
                              ? Number(e.target.value)
                              : e.target.value;
                            setNestedValue(updated, field.key, val);
                            setEditingBill(updated);
                          }}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateBill}
                  className="px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                  Update Bill
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

      {/* Bill Record Modal */}
      {showBillRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CustomBillRecord
              selectedFields={selectedFields}
              onClose={() => setShowBillRecordModal(false)}
              onSubmit={handleCreateBillRecord}
              productName={productName}
              customer={customer}
              productId={productId}
            />
          </div>
        </div>
      )}
    </div>
  );
}