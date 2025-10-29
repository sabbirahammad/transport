import React, { useState, useRef } from 'react';
import {
  Search, Plus, Filter, Download,
  Edit2, Trash2, AlertCircle,
  ChevronLeft, ChevronRight, X, TrendingUp, DollarSign
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export default function AciBrandBill() {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();

  // Category names mapping
  const categoryNames = {
    motorcycle: 'Motorcycle',
    music: 'Music',
    tyre: 'Tyre',
    yamaha: 'Yamaha Lube & Parts',
    tractor: 'Tractor',
    harvester: 'Harvester',
    spanner: 'Spanner & Wrench',
    extraBill: 'Extra Bill'
  };

  // Sample data for the bill component
  const [billData, setBillData] = useState([
    {
      id: 1,
      date: '2024-10-01',
      product: 'Honda CB150R',
      portfolio: 'Sports Bike',
      truckNumber: 'DHK-METRO-1234',
      challanNo: 'CH-2024-001',
      from: 'Dhaka',
      destination: 'Chittagong',
      quantity: 25,
      bodyFare: 15000,
      fuelCost: 3000
    },
    {
      id: 2,
      date: '2024-10-02',
      product: 'Guitar Strings',
      portfolio: 'Musical Instruments',
      truckNumber: 'DHK-METRO-5678',
      challanNo: 'CH-2024-002',
      from: 'Dhaka',
      destination: 'Sylhet',
      quantity: 100,
      bodyFare: 8000,
      fuelCost: 2500
    },
    {
      id: 3,
      date: '2024-10-03',
      product: 'Michelin Pilot Sport',
      portfolio: 'Premium Tyres',
      truckNumber: 'DHK-METRO-9012',
      challanNo: 'CH-2024-003',
      from: 'Dhaka',
      destination: 'Khulna',
      quantity: 50,
      bodyFare: 12000,
      fuelCost: 2800
    }
  ]);

  // Calculate totals for stats
  const totalAmount = billData.reduce((sum, item) => sum + item.bodyFare + item.fuelCost, 0);
  const totalTrips = billData.length;

  const stats = [
    { label: 'Total Trips', value: totalTrips.toString(), icon: TrendingUp, color: 'blue' },
    { label: 'Total Revenue', value: `৳${totalAmount.toLocaleString()}`, icon: DollarSign, color: 'green' },
    { label: 'This Month', value: `৳${(totalAmount * 0.6).toLocaleString()}`, icon: TrendingUp, color: 'purple' }
  ];

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    setBillData(billData.map(item =>
      item.id === editingItem.id ? editingItem : item
    ));
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setBillData(billData.filter(item => item.id !== id));
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

  const filteredData = billData.filter(item => {
    const searchStr = searchTerm.toLowerCase();
    return item.product.toLowerCase().includes(searchStr) ||
           item.portfolio.toLowerCase().includes(searchStr) ||
           item.truckNumber.toLowerCase().includes(searchStr) ||
           item.destination.toLowerCase().includes(searchStr) ||
           item.challanNo.toLowerCase().includes(searchStr);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-white text-2xl font-bold">
              {categoryNames[category] || 'ACI Brand'} - Bill Records
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
                {categoryNames[category] || 'ACI Brand'} Bill Records
              </h2>
              <Link
                to={`/acibillrecord/${category}`}
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
                  placeholder="Search by product, portfolio, truck number, destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={18} />
                <span>Filters</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download size={18} />
                <span>Export</span>
              </button>
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
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Portfolio</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Truck Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Challan No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">From</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Destination</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Body Fare</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fuel Cost</th>
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
                      <td className="px-4 py-3 text-sm">{item.date}</td>
                      <td className="px-4 py-3 text-sm">{item.product}</td>
                      <td className="px-4 py-3 text-sm">{item.portfolio}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.truckNumber}</td>
                      <td className="px-4 py-3 text-sm">{item.challanNo}</td>
                      <td className="px-4 py-3 text-sm">{item.from}</td>
                      <td className="px-4 py-3 text-sm">{item.destination}</td>
                      <td className="px-4 py-3 text-sm">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm">৳{item.bodyFare.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">৳{item.fuelCost.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                  <input
                    type="text"
                    value={editingItem.product}
                    onChange={(e) => setEditingItem({...editingItem, product: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                  <input
                    type="text"
                    value={editingItem.portfolio}
                    onChange={(e) => setEditingItem({...editingItem, portfolio: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Truck Number</label>
                  <input
                    type="text"
                    value={editingItem.truckNumber}
                    onChange={(e) => setEditingItem({...editingItem, truckNumber: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <input
                    type="text"
                    value={editingItem.from}
                    onChange={(e) => setEditingItem({...editingItem, from: e.target.value})}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Fare</label>
                  <input
                    type="number"
                    value={editingItem.bodyFare}
                    onChange={(e) => setEditingItem({...editingItem, bodyFare: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Cost</label>
                  <input
                    type="number"
                    value={editingItem.fuelCost}
                    onChange={(e) => setEditingItem({...editingItem, fuelCost: Number(e.target.value)})}
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
    </div>
  );
}