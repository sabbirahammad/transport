import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, Filter, Download,
  Edit2, Trash2, Eye, AlertCircle,
  ChevronLeft, ChevronRight, X, TrendingUp, DollarSign, FileText, Printer, Loader2, ArrowLeft
} from 'lucide-react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


export default function CustomBillList() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [tripData, setTripData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();
  
  const customerId = location.state?.customerId || id;

  // Fetch field selections on component mount
  useEffect(() => {
    const fetchFieldSelections = async () => {
      try {
        setLoadingFields(true);
        console.log('Fetching field selections for customer:', customerId);
        
        const response = customerId
          ? await api.getBillFieldSelections(customerId)
          : await api.getBillFieldSelections();
          
        console.log('Bill field selections response:', response);
        if (response.data.length > 0) {
          const latestSelection = response.data[response.data.length - 1];
          const savedFields = latestSelection.selectedFields;
          console.log('Saved fields:', savedFields);
          setSelectedFields(savedFields);
        } else {
          console.log('No bill field selections found');
          setSelectedFields([]);
        }
      } catch (err) {
        console.error('Error fetching bill field selections:', err);
        setError('Failed to fetch bill field selections.');
        setSelectedFields([]);
      } finally {
        setLoadingFields(false);
      }
    };

    fetchFieldSelections();
  }, [customerId]);

  // Fetch bills on component mount
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        console.log('Fetching bills for customer:', customerId);
        
        const response = customerId
          ? await api.getBills(customerId)
          : await api.getBills();
          
        console.log('Bills data:', response);
        setTripData(response.data);
      } catch (err) {
        setError('Failed to fetch bills. Please try again.');
        console.error('Error fetching bills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [customerId]);

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.getAllCustomers();
        setCustomers(response.data);
        
        // Set selected customer if customerId is available
        if (customerId) {
          const customer = response.data.find(c => c.id === customerId);
          if (customer) {
            setSelectedCustomer({
              id: customer.id,
              name: customer.customerName,
              address: customer.address
            });
          }
        } else if (location.state?.selectedCustomer) {
          setSelectedCustomer(location.state.selectedCustomer);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };

    fetchCustomers();
  }, [customerId, location.state?.selectedCustomer]);

  // Define all possible fields with labels (matching BillFieldSelector fieldDefinitions)
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

  // Filter selected fields that exist in allFields
  const validSelectedFields = selectedFields
    .map(fieldKey => allFields.find(f => f.key === fieldKey))
    .filter(field => field !== undefined);

  // Table columns: first 11 selected fields, plus actions
  const tableColumns = validSelectedFields.slice(0, 11);

  // Calculate totals for stats
  const totalRecords = tripData.length;
  const totalAmount = tripData.reduce((sum, item) => sum + (item.totalAmount || item.financial?.total || 0), 0);
  const totalProfit = tripData.reduce((sum, item) => sum + (item.financial?.profit || 0), 0);

  const stats = [
    { label: 'Total Records', value: totalRecords.toString(), icon: TrendingUp, color: 'blue' },
    { label: 'Total Amount', value: `৳${totalAmount.toLocaleString()}`, icon: DollarSign, color: 'green' },
    { label: 'Total Profit', value: `৳${totalProfit.toLocaleString()}`, icon: DollarSign, color: 'purple' }
  ];

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleView = (item) => {
    setViewingItem({ ...item });
    setShowViewModal(true);
  };

  const handleUpdate = async () => {
    try {
      await api.updateBill(editingItem.id, editingItem);
      setTripData(tripData.map(item =>
        item.id === editingItem.id ? editingItem : item
      ));
      setShowEditModal(false);
      setEditingItem(null);
    } catch (err) {
      setError('Failed to update bill. Please try again.');
      console.error('Error updating bill:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.deleteBill(id);
        setTripData(tripData.filter(item => item.id !== id));
      } catch (err) {
        setError('Failed to delete bill. Please try again.');
        console.error('Error deleting bill:', err);
      }
    }
  };

  const handleSelectAll = () => {
    const currentPageItems = getCurrentPageItems();
    const currentPageIds = currentPageItems.map(item => item.id);
    const allSelected = currentPageIds.every(id => selectedItems.includes(id));

    if (allSelected) {
      setSelectedItems(selectedItems.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedItems([...new Set([...selectedItems, ...currentPageIds])]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const filteredData = tripData.filter(item => {
    const searchStr = searchTerm.toLowerCase();
    return tableColumns.some(col => {
      if (!col || !col.key) return false;
      // Handle nested financial fields
      const value = col.key.includes('.')
        ? item[col.key.split('.')[0]]?.[col.key.split('.')[1]]
        : item[col.key];
      return value?.toString().toLowerCase().includes(searchStr);
    });
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getCurrentPageItems = () => {
    return filteredData.slice(startIndex, endIndex);
  };

  const currentPageItems = getCurrentPageItems();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedItems([]);
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
    setSelectedItems([]);
  }, [searchTerm]);

  // Export Functions
  const exportToExcel = () => {
    const data = selectedItems.length > 0
      ? tripData.filter(item => selectedItems.includes(item.id))
      : tripData;

    const headers = ['ID', ...tableColumns.map(col => col?.label || 'Unknown')];

    const worksheet = XLSX.utils.json_to_sheet(data.map(item => {
      const row = { 'ID': item.id };
      tableColumns.forEach(col => {
        if (!col || !col.key) return;
        // Handle nested financial fields
        const value = col.key.includes('.')
          ? item[col.key.split('.')[0]]?.[col.key.split('.')[1]]
          : item[col.key];
        // Handle 'unknown' values and format numbers
        if (value === 'unknown' || value === null || value === undefined) {
          row[col.label] = '';
        } else if (typeof value === 'number') {
          row[col.label] = value;
        } else {
          row[col.label] = value;
        }
      });
      return row;
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bill Records');
    XLSX.writeFile(workbook, 'custom_bills.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = selectedItems.length > 0
      ? tripData.filter(item => selectedItems.includes(item.id))
      : tripData;

    doc.setFontSize(18);
    doc.text('Custom Bill Records', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    const tableData = data.map(item => {
      const row = [item.id];
      tableColumns.forEach(col => {
        if (!col || !col.key) {
          row.push('');
          return;
        }
        // Handle nested financial fields
        const value = col.key.includes('.')
          ? item[col.key.split('.')[0]]?.[col.key.split('.')[1]]
          : item[col.key];
        // Handle 'unknown' values and format numbers
        if (value === 'unknown' || value === null || value === undefined) {
          row.push('');
        } else if (typeof value === 'number') {
          row.push(`৳${value.toLocaleString()}`);
        } else {
          row.push(value);
        }
      });
      return row;
    });

    const head = ['ID', ...tableColumns.map(col => col?.label || 'Unknown')];
    doc.autoTable({
      head: [head],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 }
    });

    doc.save('custom_bills.pdf');
  };

  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Custom Bill List</title>
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

  if (loadingFields || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={64} className="mx-auto mb-4 text-indigo-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Bill Data...</h2>
          <p className="text-gray-600">Please wait while we fetch the data.</p>
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
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
            {customerId && (
              <button
                onClick={() => navigate('/customers')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Customers
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isSubmitted = localStorage.getItem('billFieldsSubmitted') === 'true';

  if (validSelectedFields.length === 0 || !isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Fields Selected</h2>
          <p className="text-gray-600 mb-4">Please select fields in BillField component first.</p>
          <button
            onClick={() => {
              localStorage.removeItem('billFieldsSubmitted');
              if (customerId) {
                navigate(`/customer/${customerId}/bill-field`);
              } else {
                navigate('/bill-field');
              }
            }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to BillField
          </button>
        </div>
      </div>
    );
  }

  if (tripData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bill Data Found</h2>
          <p className="text-gray-600 mb-4">Create your first bill to get started.</p>
          <button
            onClick={() => navigate('/add-bill')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add First Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-white text-2xl font-bold">
              {selectedCustomer ? `${selectedCustomer.name} - Bills` : 'Custom Bill Records'}
            </h1>
            {selectedCustomer && (
              <p className="text-white/80 text-sm">{selectedCustomer.address}</p>
            )}
          </div>
          {customerId && (
            <button
              onClick={() => navigate('/customers')}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Customers</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
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

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Action Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Bill Records
              </h2>
              <Link
                to="/add-bill"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} />
                <span className="font-medium">Add Bill</span>
              </Link>
            </div>

            {/* Search Bar and Export */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search bills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download size={18} />
                  <span>Export</span>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                  <button onClick={exportToExcel} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <FileText size={16} /> Export to Excel
                  </button>
                  <button onClick={exportToPDF} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <FileText size={16} /> Export to PDF
                  </button>
                  <button onClick={handlePrint} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                    <Printer size={16} /> Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto" ref={printRef}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={currentPageItems.length > 0 && currentPageItems.every(item => selectedItems.includes(item.id))}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SL No</th>
                  {tableColumns.map(col => (
                    <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageItems.length > 0 ? (
                  currentPageItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                      {tableColumns.map(col => (
                        <td key={col?.key || 'unknown'} className="px-4 py-3 text-sm">
                          {(() => {
                            if (!col || !col.key) return '';
                            // Handle nested financial fields
                            const value = col.key.includes('.')
                              ? item[col.key.split('.')[0]]?.[col.key.split('.')[1]]
                              : item[col.key];
                            // Handle 'unknown' values and format numbers
                            if (value === 'unknown' || value === null || value === undefined) return '';
                            return typeof value === 'number' ? `৳${value.toLocaleString()}` : value;
                          })()}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(item)}
                            className="p-1.5 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye size={16} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 hover:bg-green-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={16} className="text-green-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
                    <td colSpan={tableColumns.length + 3} className="px-4 py-12 text-center text-gray-500">
                      <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredData.length)}</strong> of <strong>{filteredData.length}</strong>
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
                      currentPage === page ? 'bg-indigo-600 text-white' : 'border hover:bg-gray-50'
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

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Bill Record</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-indigo-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {validSelectedFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {field.key === 'date' ? (
                      <input
                        type="date"
                        value={(() => {
                          const value = field.key.includes('.')
                            ? editingItem[field.key.split('.')[0]]?.[field.key.split('.')[1]]
                            : editingItem[field.key];
                          return (value && value !== 'unknown') ? value : '';
                        })()}
                        onChange={(e) => {
                          if (field.key.includes('.')) {
                            const [obj, prop] = field.key.split('.');
                            setEditingItem({
                              ...editingItem,
                              [obj]: {
                                ...editingItem[obj],
                                [prop]: e.target.value
                              }
                            });
                          } else {
                            setEditingItem({...editingItem, [field.key]: e.target.value});
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    ) : (
                      <input
                        type={(() => {
                          const value = field.key.includes('.')
                            ? editingItem[field.key.split('.')[0]]?.[field.key.split('.')[1]]
                            : editingItem[field.key];
                          return typeof value === 'number' ? 'number' : 'text';
                        })()}
                        value={(() => {
                          const value = field.key.includes('.')
                            ? editingItem[field.key.split('.')[0]]?.[field.key.split('.')[1]]
                            : editingItem[field.key];
                          return (value && value !== 'unknown') ? value : '';
                        })()}
                        onChange={(e) => {
                          if (field.key.includes('.')) {
                            const [obj, prop] = field.key.split('.');
                            setEditingItem({
                              ...editingItem,
                              [obj]: {
                                ...editingItem[obj],
                                [prop]: Number(e.target.value)
                              }
                            });
                          } else {
                            const value = field.key.includes('.') ? Number(e.target.value) : e.target.value;
                            setEditingItem({...editingItem, [field.key]: value});
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700"
                >
                  Update Record
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

      {/* View Modal */}
      {showViewModal && viewingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Bill Record Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-indigo-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {validSelectedFields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {(() => {
                      if (!field || !field.key) return 'N/A';
                      // Handle nested financial fields
                      const value = field.key.includes('.')
                        ? viewingItem[field.key.split('.')[0]]?.[field.key.split('.')[1]]
                        : viewingItem[field.key];
                      // Handle 'unknown' values and format numbers
                      if (value === 'unknown' || value === null || value === undefined) return '';
                      return typeof value === 'number' ? `৳${value.toLocaleString()}` : value;
                    })()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}