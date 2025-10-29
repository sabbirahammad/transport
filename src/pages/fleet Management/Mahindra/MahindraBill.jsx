import React, { useState, useRef } from 'react';
import {
  Search, Plus, Filter, Download,
  Edit2, Trash2, Eye, AlertCircle,
  ChevronLeft, ChevronRight, X, TrendingUp, DollarSign, FileText, Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function MahindraBill() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();

  // Mahindra Bill Data
  const [mahindraBillData, setMahindraBillData] = useState([
    {
      id: 1,
      challanNo: 'CH-2024-001',
      customerName: 'ABC Corporation',
      destination: 'Dhaka',
      vehicleNo: 'DHA-1111',
      driverName: 'John Doe',
      totalRate: 15000,
      advance: 2000,
      due: 13000,
      total: 15000,
      profit: 2000
    },
    {
      id: 2,
      challanNo: 'CH-2024-002',
      customerName: 'XYZ Ltd',
      destination: 'Chittagong',
      vehicleNo: 'DHA-2222',
      driverName: 'Jane Smith',
      totalRate: 12000,
      advance: 1500,
      due: 10500,
      total: 12000,
      profit: 1500
    },
    {
      id: 3,
      challanNo: 'CH-2024-003',
      customerName: 'PQR Industries',
      destination: 'Sylhet',
      vehicleNo: 'DHA-3333',
      driverName: 'Bob Johnson',
      totalRate: 18000,
      advance: 2500,
      due: 15500,
      total: 18000,
      profit: 2500
    }
  ]);

  // Calculate totals for stats
  const totalRecords = mahindraBillData.length;
  const totalAmount = mahindraBillData.reduce((sum, item) => sum + item.total, 0);
  const totalProfit = mahindraBillData.reduce((sum, item) => sum + item.profit, 0);

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

  const handleUpdate = () => {
    setMahindraBillData(mahindraBillData.map(item =>
      item.id === editingItem.id ? editingItem : item
    ));
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setMahindraBillData(mahindraBillData.filter(item => item.id !== id));
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

  const filteredData = mahindraBillData.filter(item => {
    const searchStr = searchTerm.toLowerCase();
    return item.challanNo.toLowerCase().includes(searchStr) ||
            item.customerName.toLowerCase().includes(searchStr) ||
            item.destination.toLowerCase().includes(searchStr) ||
            item.vehicleNo.toLowerCase().includes(searchStr) ||
            item.driverName.toLowerCase().includes(searchStr);
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
      ? mahindraBillData.filter(item => selectedItems.includes(item.id))
      : mahindraBillData;

    const headers = ['ID', 'Challan No', 'Customer Name', 'Destination', 'Vehicle No', 'Driver Name', 'Total Rate', 'Advance', 'Due', 'Total', 'Profit'];

    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
      'ID': item.id,
      'Challan No': item.challanNo,
      'Customer Name': item.customerName,
      'Destination': item.destination,
      'Vehicle No': item.vehicleNo,
      'Driver Name': item.driverName,
      'Total Rate': item.totalRate,
      'Advance': item.advance,
      'Due': item.due,
      'Total': item.total,
      'Profit': item.profit
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mahindra Bill Records');
    XLSX.writeFile(workbook, 'mahindra_bills.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = selectedItems.length > 0
      ? mahindraBillData.filter(item => selectedItems.includes(item.id))
      : mahindraBillData;

    doc.setFontSize(18);
    doc.text('Mahindra Bill Records', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = data.map(item => [
      item.id,
      item.challanNo,
      item.customerName,
      item.destination,
      item.vehicleNo,
      item.driverName,
      `৳${item.totalRate.toLocaleString()}`,
      `৳${item.advance.toLocaleString()}`,
      `৳${item.due.toLocaleString()}`,
      `৳${item.total.toLocaleString()}`,
      `৳${item.profit.toLocaleString()}`
    ]);

    doc.autoTable({
      head: [['ID', 'Challan No', 'Customer Name', 'Destination', 'Vehicle No', 'Driver Name', 'Total Rate', 'Advance', 'Due', 'Total', 'Profit']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 }
    });

    doc.save('mahindra_bills.pdf');
  };

  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Mahindra Bill List</title>
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-white text-2xl font-bold">
              Mahindra Bill Records
            </h1>
          </div>
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
                Mahindra Bill Records
              </h2>
              <Link
                to="/mahindrabillrecord"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                <span className="font-medium">Add Record</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by challan no, customer name, destination, vehicle no, driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <thead className="bg-blue-900 text-white">
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
                  <th className="px-4 py-3 text-left text-sm font-semibold">Challan No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Customer Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Destination</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Vehicle No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Driver Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total Rate</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Advance</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Due</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Profit</th>
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
                      <td className="px-4 py-3 text-sm">{item.challanNo}</td>
                      <td className="px-4 py-3 text-sm">{item.customerName}</td>
                      <td className="px-4 py-3 text-sm">{item.destination}</td>
                      <td className="px-4 py-3 text-sm">{item.vehicleNo}</td>
                      <td className="px-4 py-3 text-sm">{item.driverName}</td>
                      <td className="px-4 py-3 text-sm">৳{item.totalRate.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">৳{item.advance.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">৳{item.due.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">৳{item.total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">৳{item.profit.toLocaleString()}</td>
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
                    <td colSpan="13" className="px-4 py-12 text-center text-gray-500">
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

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Record</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Challan No</label>
                  <input
                    type="text"
                    value={editingItem.challanNo}
                    onChange={(e) => setEditingItem({...editingItem, challanNo: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={editingItem.customerName}
                    onChange={(e) => setEditingItem({...editingItem, customerName: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    value={editingItem.destination}
                    onChange={(e) => setEditingItem({...editingItem, destination: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle No</label>
                  <input
                    type="text"
                    value={editingItem.vehicleNo}
                    onChange={(e) => setEditingItem({...editingItem, vehicleNo: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                  <input
                    type="text"
                    value={editingItem.driverName}
                    onChange={(e) => setEditingItem({...editingItem, driverName: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Rate</label>
                  <input
                    type="number"
                    value={editingItem.totalRate}
                    onChange={(e) => setEditingItem({...editingItem, totalRate: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advance</label>
                  <input
                    type="number"
                    value={editingItem.advance}
                    onChange={(e) => setEditingItem({...editingItem, advance: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due</label>
                  <input
                    type="number"
                    value={editingItem.due}
                    onChange={(e) => setEditingItem({...editingItem, due: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                  <input
                    type="number"
                    value={editingItem.total}
                    onChange={(e) => setEditingItem({...editingItem, total: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profit</label>
                  <input
                    type="number"
                    value={editingItem.profit}
                    onChange={(e) => setEditingItem({...editingItem, profit: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700"
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
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Record Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Challan No</label>
                <p className="mt-1 text-sm text-gray-900">{viewingItem.challanNo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <p className="mt-1 text-sm text-gray-900">{viewingItem.customerName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <p className="mt-1 text-sm text-gray-900">{viewingItem.destination}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle No</label>
                <p className="mt-1 text-sm text-gray-900">{viewingItem.vehicleNo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                <p className="mt-1 text-sm text-gray-900">{viewingItem.driverName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Rate</label>
                <p className="mt-1 text-sm text-gray-900">৳{viewingItem.totalRate.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advance</label>
                <p className="mt-1 text-sm text-gray-900">৳{viewingItem.advance.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due</label>
                <p className="mt-1 text-sm text-gray-900">৳{viewingItem.due.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                <p className="mt-1 text-sm text-gray-900">৳{viewingItem.total.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profit</label>
                <p className="mt-1 text-sm text-gray-900">৳{viewingItem.profit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}