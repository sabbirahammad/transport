import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DealerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDealers, setSelectedDealers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDealer, setEditingDealer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingDealer, setViewingDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 10;
  const printRef = useRef();

  const [dealers, setDealers] = useState([]);
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1/dealer';

  // Fetch dealers from API
  const fetchDealers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}?page=1&page_size=20`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      setDealers(data.data || data || []);
    } catch (err) {
      console.error('Error fetching dealers:', err);

      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to server. Please check if the backend server is running.');
      } else if (err.message.includes('HTTP error!')) {
        setError(`Server error: ${err.message}. Please try again or contact support.`);
      } else {
        setError('Failed to load dealers. Please check your connection and try again.');
      }

      // Fallback to sample data if API fails
      setDealers([
        {
          id: 1,
          dealer_name: 'ABC Trading Company',
          destination: 'Dhaka',
          status: 'Active'
        },
        {
          id: 2,
          dealer_name: 'XYZ Corporation',
          destination: 'Chittagong',
          status: 'Active'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch dealers after updates/deletes to ensure fresh data
  const refetchDealers = async () => {
    await fetchDealers();
  };
console.log(dealers)
  // Delete dealer
  const deleteDealer = async (dealerId) => {
    if (!window.confirm('Are you sure you want to delete this dealer?')) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/${dealerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove dealer from local state after successful API call
      setDealers(dealers.filter(dealer => dealer.id !== dealerId));

      // Refetch data to ensure consistency with server state
      await refetchDealers();
    } catch (err) {
      console.error('Error deleting dealer:', err);

      let errorMessage = 'Failed to delete dealer. Please try again.';
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Please check if the backend server is running.';
      } else if (err.message.includes('HTTP error! status:')) {
        const statusCode = err.message.match(/status: (\d+)/)?.[1];
        if (statusCode === '400') {
          errorMessage = 'Invalid request. Please check the dealer data and try again.';
        } else if (statusCode === '401') {
          errorMessage = 'Unauthorized access. Please check your permissions.';
        } else if (statusCode === '404') {
          errorMessage = 'Dealer not found. It may have already been deleted.';
        } else if (statusCode === '500') {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = `Server error (${statusCode}). Please try again.`;
        }
      }

      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Update dealer
  const updateDealer = async (updatedDealer) => {
    // Basic validation
    if (!updatedDealer.dealer_name || updatedDealer.dealer_name.trim() === '') {
      alert('Dealer name is required');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/${updatedDealer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDealer),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Update dealer in local state after successful API call
      setDealers(dealers.map(dealer =>
        dealer.id === updatedDealer.id ? result.data || result : dealer
      ));

      // Refetch data to ensure consistency with server state
      await refetchDealers();

      setShowEditModal(false);
      setEditingDealer(null);
    } catch (err) {
      console.error('Error updating dealer:', err);

      let errorMessage = 'Failed to update dealer. Please try again.';
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Please check if the backend server is running.';
      } else if (err.message.includes('HTTP error! status:')) {
        const statusCode = err.message.match(/status: (\d+)/)?.[1];
        if (statusCode === '400') {
          errorMessage = 'Invalid data provided. Please check all fields and try again.';
        } else if (statusCode === '401') {
          errorMessage = 'Unauthorized access. Please check your permissions.';
        } else if (statusCode === '404') {
          errorMessage = 'Dealer not found. It may have been deleted by another user.';
        } else if (statusCode === '500') {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = `Server error (${statusCode}). Please try again.`;
        }
      }

      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const stats = [
    { label: 'Total Dealers', value: dealers.length, color: 'blue', trend: '+8' },
    { label: 'Active Dealers', value: dealers.filter(d => d.status === 'Active').length, color: 'green', trend: '+5' },
    { label: 'On Hold', value: dealers.filter(d => d.status === 'On Hold').length, color: 'orange', trend: '+2' },
    { label: 'Inactive', value: dealers.filter(d => d.status === 'Inactive').length, color: 'red', trend: '-1' }
  ];

  const filteredDealers = dealers.filter(dealer => {
    const dealerName = dealer.dealer_name || '';
    const destination = dealer.destination || '';
    const status = dealer.status || '';

    const matchesSearch = dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredDealers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageDealers = filteredDealers.slice(startIndex, endIndex);

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

  const handleViewDealer = (dealer) => {
    setViewingDealer({ ...dealer });
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                <h2 className="text-xl font-bold text-gray-800">All Dealer Information</h2>
              </div>
              <Link
                to="/add-dealer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Add Dealer</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[300px] relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by dealer name, destination..."
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
                  <option value="on hold">On Hold</option>
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
                      checked={currentPageDealers.length > 0 && currentPageDealers.every(d => selectedDealers.includes(d.id))}
                      onChange={() => {
                        const ids = currentPageDealers.map(d => d.id);
                        const all = ids.every(id => selectedDealers.includes(id));
                        setSelectedDealers(all ? selectedDealers.filter(id => !ids.includes(id)) : [...new Set([...selectedDealers, ...ids])]);
                      }}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SL No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Dealer Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Destination</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                        <span>Loading dealers...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium text-red-600">{error}</p>
                      <button
                        onClick={fetchDealers}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : currentPageDealers.length > 0 ? currentPageDealers.map((dealer, idx) => (
                  <tr key={dealer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedDealers.includes(dealer.id)}
                        onChange={() => setSelectedDealers(selectedDealers.includes(dealer.id) ? selectedDealers.filter(id => id !== dealer.id) : [...selectedDealers, dealer.id])}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium">{dealer.dealer_name}</td>
                    <td className="px-4 py-3 text-sm">{dealer.destination}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dealer.status)}`}>
                        {dealer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDealer(dealer)}
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
                            setEditingDealer({...dealer});
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
                          onClick={() => deleteDealer(dealer.id)}
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
                    <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium">No dealer found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredDealers.length)}</strong> of <strong>{filteredDealers.length}</strong>
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
                  onClick={() => {setCurrentPage(pg); setSelectedDealers([]);}}
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
      </div>

      {/* Edit Modal */}
      {showEditModal && editingDealer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Dealer Information</h2>
              <button onClick={() => {
                setShowEditModal(false);
                setEditingDealer(null);
              }} className="hover:bg-blue-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Dealer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dealer Name *</label>
                    <input
                      type="text"
                      value={editingDealer.dealer_name || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, dealer_name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter dealer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                    <input
                      type="text"
                      value={editingDealer.destination || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, destination: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter destination"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editingDealer.status || ''}
                      onChange={(e) => setEditingDealer({...editingDealer, status: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => updateDealer(editingDealer)}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Dealer'}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingDealer(null);
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
      {showViewModal && viewingDealer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-900 to-green-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Dealer Details</h2>
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
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{viewingDealer.dealer_name || 'N/A'}</h3>
                  <p className="text-xl text-gray-600 mb-3">{viewingDealer.destination || 'No destination'}</p>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(viewingDealer.status)}`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {viewingDealer.status === 'Active' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {viewingDealer.status === 'Inactive' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                        {viewingDealer.status === 'On Hold' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                      {viewingDealer.status || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">Dealer ID: #{viewingDealer.id}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Dealer Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Dealer Name</p>
                        <p className="font-semibold text-gray-800">{viewingDealer.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="font-semibold text-gray-800">{viewingDealer.destination || 'N/A'}</p>
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
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${getStatusColor(viewingDealer.status).replace('text-', 'bg-').replace('-700', '-50')} border ${getStatusColor(viewingDealer.status).replace('text-', 'border-').replace('-700', '-200')}`}>
                      <svg className={`w-5 h-5 ${getStatusColor(viewingDealer.status).split(' ')[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {viewingDealer.status === 'Active' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {viewingDealer.status === 'Inactive' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                        {viewingDealer.status === 'On Hold' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Current Status</p>
                        <p className={`font-semibold ${getStatusColor(viewingDealer.status).split(' ')[1]}`}>
                          {viewingDealer.status || 'Unknown'}
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
    </div>
  );
}