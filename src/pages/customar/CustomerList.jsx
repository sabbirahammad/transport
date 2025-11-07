import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search, Plus, Edit2, Trash2, Eye,
  CheckCircle, XCircle, AlertCircle, Loader2
} from 'lucide-react';

const API_BASE_URL = 'http://192.168.0.106:8080/api/v1/customer';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 10;
  const printRef = useRef();

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}?page=1&page_size=20`);
      const data = response.data;
      console.log(data);

      // Handle the API response structure: { data: [...], meta: {...} }
      const customerData = data.data || data || [];
      setCustomers(Array.isArray(customerData) ? customerData : []);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch customers after updates/deletes to ensure fresh data
  const refetchCustomers = async () => {
    await fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter(customer => {
    const customerName = customer.customerName || '';
    const mobile = customer.mobile || '';
    const email = customer.email || '';
    const address = customer.address || '';

    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageCustomers = filteredCustomers.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const p = [], max = 5;
    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) p.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) p.push(i);
        p.push('...');
        p.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        p.push(1);
        p.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) p.push(i);
      } else {
        p.push(1);
        p.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) p.push(i);
        p.push('...');
        p.push(totalPages);
      }
    }
    return p;
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const stats = [
    { label: 'Total Customers', value: customers.length, color: 'blue', trend: '+8' },
    { label: 'Active Customers', value: customers.filter(c => c.status === 'Active').length, color: 'green', trend: '+5' },
    { label: 'Inactive Customers', value: customers.filter(c => c.status === 'Inactive').length, color: 'red', trend: '-1' }
  ];

  const getStatColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600'
    };
    return colors[color] || 'bg-gray-50 text-gray-600';
  };

  const getStatusColor = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-700';
    if (status === 'Inactive') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const handleViewCustomer = (customer) => {
    setViewingCustomer({ ...customer });
    setShowViewModal(true);
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setEditingCustomer({ ...customer });
    setShowEditModal(true);
  };

  // Handle update customer
  const handleUpdateCustomer = async () => {
    try {
      await axios.put(`${API_BASE_URL}/${editingCustomer.id}`, editingCustomer);
      setCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c));
      setShowEditModal(false);
      setEditingCustomer(null);
      setMessage({ type: 'success', text: 'Customer updated successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error updating customer:', error);
      setMessage({ type: 'error', text: 'Failed to update customer' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = async () => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      setSubmitting(true);
      await axios.delete(`${API_BASE_URL}/${deletingCustomer.id}`);
      setCustomers(customers.filter(c => c.id !== deletingCustomer.id));
      setShowDeleteModal(false);
      setDeletingCustomer(null);
      setMessage({ type: 'success', text: 'Customer deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error deleting customer:', error);
      setMessage({ type: 'error', text: 'Failed to delete customer' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input change in edit modal
  const handleInputChange = (field, value) => {
    setEditingCustomer({ ...editingCustomer, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={64} className="mx-auto mb-4 text-blue-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
          <p className="text-gray-600">Fetching customer data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${getStatColor(s.color).split(' ')[0]}`}>
                  <svg className={`${getStatColor(s.color).split(' ')[1]} w-5 h-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className={`text-xs font-semibold ${s.trend.startsWith('+') ? 'text-green-600' : s.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                  {s.trend}%
                </span>
              </div>
              <p className="text-gray-600 text-xs mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="text-blue-600 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">All Customer Information</h2>
              </div>
              <Link
                to="/create-customer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Add Customer</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[300px] relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by customer name, phone, email, or address..."
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
                </select>
              </div>
            )}
          </div>

          <div className="overflow-x-auto" ref={printRef}>
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={currentPageCustomers.length > 0 && currentPageCustomers.every(c => selectedCustomers.includes(c.id))}
                      onChange={() => {
                        const ids = currentPageCustomers.map(c => c.id);
                        const all = ids.every(id => selectedCustomers.includes(id));
                        setSelectedCustomers(all ? selectedCustomers.filter(id => !ids.includes(id)) : [...new Set([...selectedCustomers, ...ids])]);
                      }}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SL No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                        <span>Loading customers...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium text-red-600">{error}</p>
                      <button
                        onClick={fetchCustomers}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : currentPageCustomers.length > 0 ? currentPageCustomers.map((customer, idx) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => setSelectedCustomers(selectedCustomers.includes(customer.id) ? selectedCustomers.filter(id => id !== customer.id) : [...selectedCustomers, customer.id])}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium">{customer.customerName}</td>
                    <td className="px-4 py-3 text-sm">{customer.mobile}</td>
                    <td className="px-4 py-3 text-sm">{customer.email}</td>
                    <td className="px-4 py-3 text-sm">{customer.address}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="p-1.5 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setEditingCustomer({...customer});
                            setShowEditModal(true);
                          }}
                          className="p-1.5 hover:bg-green-50 rounded"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setDeletingCustomer(customer);
                            setShowDeleteModal(true);
                          }}
                          disabled={submitting}
                          className="p-1.5 hover:bg-red-50 rounded disabled:opacity-50"
                          title="Delete"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium">No customer found</p>
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
                className={`px-3 py-1.5 border rounded text-sm flex items-center gap-1 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              {getPageNumbers().map((pg, i) => pg === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-gray-500">...</span>
              ) : (
                <button
                  key={pg}
                  onClick={() => {setCurrentPage(pg); setSelectedCustomers([]);}}
                  className={`px-3 py-1.5 rounded text-sm ${currentPage === pg ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 border rounded text-sm flex items-center gap-1 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {message.type === 'success' && <CheckCircle size={20} />}
            {message.type === 'error' && <XCircle size={20} />}
            {message.type === 'info' && <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Customer Information</h2>
              <button onClick={() => {
                setShowEditModal(false);
                setEditingCustomer(null);
              }} className="hover:bg-blue-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      value={editingCustomer.customerName || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, customerName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={editingCustomer.mobile || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, mobile: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editingCustomer.email || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={editingCustomer.address || ''}
                      onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter address"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleUpdateCustomer}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Customer'}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCustomer(null);
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
      {showViewModal && viewingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-900 to-green-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Customer Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-green-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{viewingCustomer.customerName || 'N/A'}</h3>
                  <p className="text-xl text-gray-600 mb-3">{viewingCustomer.mobile || 'No phone'}</p>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(viewingCustomer.status || 'Active')}`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {viewingCustomer.status === 'Active' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {viewingCustomer.status === 'Inactive' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                      </svg>
                      {viewingCustomer.status || 'Active'}
                    </span>
                    <span className="text-sm text-gray-500">Customer ID: #{viewingCustomer.id}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Customer Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Customer Name</p>
                        <p className="font-semibold text-gray-800">{viewingCustomer.customerName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-800">{viewingCustomer.mobile || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-semibold text-gray-800">{viewingCustomer.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="font-semibold text-gray-800">{viewingCustomer.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status Information
                  </h4>
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${getStatusColor(viewingCustomer.status || 'Active').replace('text-', 'bg-').replace('-700', '-50')} border ${getStatusColor(viewingCustomer.status || 'Active').replace('text-', 'border-').replace('-700', '-200')}`}>
                      <svg className={`w-5 h-5 ${getStatusColor(viewingCustomer.status || 'Active').split(' ')[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {viewingCustomer.status === 'Active' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {viewingCustomer.status === 'Inactive' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Current Status</p>
                        <p className={`font-semibold ${getStatusColor(viewingCustomer.status || 'Active').split(' ')[1]}`}>
                          {viewingCustomer.status || 'Active'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-red-900 to-red-800 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Delete Customer</h2>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingCustomer(null);
                }}
                className="hover:bg-red-700 p-1 rounded"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">You are about to delete:</p>
                <p className="font-semibold text-gray-800">{deletingCustomer.customerName}</p>
                <p className="text-sm text-gray-600">{deletingCustomer.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCustomer}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? 'Deleting...' : 'Delete Customer'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingCustomer(null);
                  }}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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