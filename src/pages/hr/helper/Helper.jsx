import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function HelperPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHelpers, setSelectedHelpers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHelper, setEditingHelper] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingHelper, setViewingHelper] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();

  const [helpers, setHelpers] = useState([
    {
      id: 1,
      image: 'https://i.pravatar.cc/100?img=1',
      name: 'Ahmed Hassan',
      mobile: '+8801712345678',
      address: '123 Main St, Dhaka, Bangladesh',
      emergency: '+8801812345678',
      salary: '25000',
      assignedVehicle: 'Truck-001',
      status: 'Active',
      nid: '1234567890123',
      joiningDate: '2023-01-15',
      vehicleAssigned: 'Truck-001',
      experience: '3'
    },
    {
      id: 2,
      image: 'https://i.pravatar.cc/100?img=2',
      name: 'Fatima Begum',
      mobile: '+8801712345679',
      address: '456 Oak Ave, Chittagong, Bangladesh',
      emergency: '+8801812345679',
      salary: '22000',
      assignedVehicle: 'Van-002',
      status: 'Active',
      nid: '1234567890124',
      joiningDate: '2022-08-22',
      vehicleAssigned: 'Van-002',
      experience: '5'
    },
    {
      id: 3,
      image: 'https://i.pravatar.cc/100?img=3',
      name: 'Rahim Khan',
      mobile: '+8801712345680',
      address: '789 Pine St, Sylhet, Bangladesh',
      emergency: '+8801812345680',
      salary: '28000',
      assignedVehicle: 'Truck-003',
      status: 'Active',
      nid: '1234567890125',
      joiningDate: '2023-03-10',
      vehicleAssigned: 'Truck-003',
      experience: '7'
    },
    {
      id: 4,
      image: 'https://i.pravatar.cc/100?img=4',
      name: 'Nasrin Akter',
      mobile: '+8801712345681',
      address: '321 Elm St, Khulna, Bangladesh',
      emergency: '+8801812345681',
      salary: '24000',
      assignedVehicle: 'Van-004',
      status: 'Active',
      nid: '1234567890126',
      joiningDate: '2021-11-05',
      vehicleAssigned: 'Van-004',
      experience: '4'
    },
    {
      id: 5,
      image: 'https://i.pravatar.cc/100?img=5',
      name: 'Kamal Hossain',
      mobile: '+8801712345682',
      address: '654 Cedar St, Rajshahi, Bangladesh',
      emergency: '+8801812345682',
      salary: '26000',
      assignedVehicle: 'Truck-005',
      status: 'Inactive',
      nid: '1234567890127',
      joiningDate: '2023-06-18',
      vehicleAssigned: 'Truck-005',
      experience: '2'
    },
    {
      id: 6,
      image: 'https://i.pravatar.cc/100?img=6',
      name: 'Sabina Yasmin',
      mobile: '+8801712345683',
      address: '987 Maple St, Barisal, Bangladesh',
      emergency: '+8801812345683',
      salary: '23000',
      assignedVehicle: 'Van-006',
      status: 'Active',
      nid: '1234567890128',
      joiningDate: '2022-04-12',
      vehicleAssigned: 'Van-006',
      experience: '6'
    },
    {
      id: 7,
      image: 'https://i.pravatar.cc/100?img=7',
      name: 'Babul Mia',
      mobile: '+8801712345684',
      address: '147 Birch St, Rangpur, Bangladesh',
      emergency: '+8801812345684',
      salary: '27000',
      assignedVehicle: 'Truck-007',
      status: 'On Leave',
      nid: '1234567890129',
      joiningDate: '2023-09-01',
      vehicleAssigned: 'Truck-007',
      experience: '8'
    },
    {
      id: 8,
      image: 'https://i.pravatar.cc/100?img=8',
      name: 'Rina Khatun',
      mobile: '+8801712345685',
      address: '258 Willow St, Mymensingh, Bangladesh',
      emergency: '+8801812345685',
      salary: '25000',
      assignedVehicle: 'Van-008',
      status: 'Active',
      nid: '1234567890130',
      joiningDate: '2022-12-20',
      vehicleAssigned: 'Van-008',
      experience: '3'
    }
  ]);

  const stats = [
    { label: 'Total Helpers', value: helpers.length, color: 'blue', trend: '+8' },
    { label: 'Active Helpers', value: helpers.filter(h => h.status === 'Active').length, color: 'green', trend: '+6' },
    { label: 'On Leave', value: helpers.filter(h => h.status === 'On Leave').length, color: 'orange', trend: '0' },
    { label: 'Inactive', value: helpers.filter(h => h.status === 'Inactive').length, color: 'red', trend: '-1' }
  ];

  const filteredHelpers = helpers.filter(helper => {
    const ms = helper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               helper.mobile.includes(searchTerm) ||
               helper.assignedVehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
               helper.address.toLowerCase().includes(searchTerm.toLowerCase());
    const fs = filterStatus === 'all' || helper.status.toLowerCase() === filterStatus.toLowerCase();
    return ms && fs;
  });

  const totalPages = Math.ceil(filteredHelpers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageHelpers = filteredHelpers.slice(startIndex, endIndex);

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

  const handleViewHelper = (helper) => {
    setViewingHelper({ ...helper });
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Truck Background */}
      <div className="absolute inset-0 z-0 opacity-30 overflow-hidden pointer-events-none">
        <div className="relative w-full h-screen bg-gradient-to-b bg-white flex justify-center items-center">

          {/* Truck + Wheels Group — Centered */}
          <div className="flex flex-col items-center">

            {/* Truck Body */}
            <div className="flex items-end space-x-1">

              {/* Cab */}
              <div className="relative w-36 h-28 bg-yellow-500 rounded-l-xl rounded-tl-xl shadow-lg border-r-2 border-gray-800">
                {/* Windshield */}
                <div className="absolute top-3 left-3 w-24 h-12 bg-blue-900/30 rounded-tl-md"></div>
                {/* Grille */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-14 h-5 bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold tracking-tight">EICHER</span>
                </div>
                {/* Headlights */}
                <div className="absolute bottom-3 left-3 w-2.5 h-2.5 bg-amber-300 rounded-full"></div>
                <div className="absolute bottom-3 left-8 w-2.5 h-2.5 bg-amber-300 rounded-full"></div>
              </div>

              {/* Container */}
              <div className="relative w-52 h-24 bg-blue-600 rounded-r-xl border-2 border-yellow-400">
                {/* Stripes */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-16 bg-blue-400"
                    style={{ left: `${i * 16 + 12}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Wheels — Directly below truck, centered */}
            <div className="flex space-x-6 mt-1">
              <div className="w-10 h-10 bg-gray-900 rounded-full border-2 border-gray-700 relative">
                <div className="absolute inset-1 bg-gray-800 rounded-full"></div>
              </div>
              <div className="w-10 h-10 bg-gray-900 rounded-full border-2 border-gray-700 relative">
                <div className="absolute inset-1 bg-gray-800 rounded-full"></div>
              </div>
              <div className="w-10 h-10 bg-gray-900 rounded-full border-2 border-gray-700 relative">
                <div className="absolute inset-1 bg-gray-800 rounded-full"></div>
              </div>
              <div className="w-10 h-10 bg-gray-900 rounded-full border-2 border-gray-700 relative">
                <div className="absolute inset-1 bg-gray-800 rounded-full"></div>
              </div>
            </div>

          </div>

          {/* Optional: Ground shadow */}
          <div className="absolute bottom-0 w-full h-6 bg-black opacity-20 blur-md"></div>

        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${getStatColor(s.color).split(' ')[0]}`}>
                  <svg className={`${getStatColor(s.color).split(' ')[1]} w-5 h-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">All Helper Information</h2>
              </div>
              <Link
                to="/add-helper"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Add Helper</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[300px] relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, mobile, vehicle..."
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
                  <option value="on leave">On Leave</option>
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
                      checked={currentPageHelpers.length > 0 && currentPageHelpers.every(h => selectedHelpers.includes(h.id))}
                      onChange={() => {
                        const ids = currentPageHelpers.map(h => h.id);
                        const all = ids.every(id => selectedHelpers.includes(id));
                        setSelectedHelpers(all ? selectedHelpers.filter(id => !ids.includes(id)) : [...new Set([...selectedHelpers, ...ids])]);
                      }}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SL No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mobile</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Emergency</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Salary</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Assigned Vehicle</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageHelpers.length > 0 ? currentPageHelpers.map((helper, idx) => (
                  <tr key={helper.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedHelpers.includes(helper.id)}
                        onChange={() => setSelectedHelpers(selectedHelpers.includes(helper.id) ? selectedHelpers.filter(id => id !== helper.id) : [...selectedHelpers, helper.id])}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3">
                      <img src={helper.image} alt={helper.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200" />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{helper.name}</td>
                    <td className="px-4 py-3 text-sm">{helper.mobile}</td>
                    <td className="px-4 py-3 text-sm">{helper.address}</td>
                    <td className="px-4 py-3 text-sm">{helper.emergency}</td>
                    <td className="px-4 py-3 text-sm">৳{helper.salary}</td>
                    <td className="px-4 py-3 text-sm font-medium">{helper.assignedVehicle}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(helper.status)}`}>
                        {helper.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewHelper(helper)}
                          className="p-1.5 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => { setEditingHelper({...helper}); setShowEditModal(true); }}
                          className="p-1.5 hover:bg-green-50 rounded"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => { if (window.confirm('Are you sure?')) setHelpers(helpers.filter(h => h.id !== helper.id)); }}
                          className="p-1.5 hover:bg-red-50 rounded"
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
                    <td colSpan="11" className="px-4 py-12 text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium">No helper found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredHelpers.length)}</strong> of <strong>{filteredHelpers.length}</strong>
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
                  onClick={() => {setCurrentPage(pg); setSelectedHelpers([]);}}
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
      {showEditModal && editingHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Helper Information</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Basic Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editingHelper.name || ''}
                      onChange={(e) => setEditingHelper({...editingHelper, name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                    <input
                      type="tel"
                      value={editingHelper.mobile || ''}
                      onChange={(e) => setEditingHelper({...editingHelper, mobile: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      value={editingHelper.emergency || ''}
                      onChange={(e) => setEditingHelper({...editingHelper, emergency: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                    <input
                      type="number"
                      value={editingHelper.salary || ''}
                      onChange={(e) => setEditingHelper({...editingHelper, salary: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={editingHelper.address || ''}
                    onChange={(e) => setEditingHelper({...editingHelper, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Vehicle</label>
                    <input
                      type="text"
                      value={editingHelper.assignedVehicle || ''}
                      onChange={(e) => setEditingHelper({...editingHelper, assignedVehicle: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editingHelper.status || ''}
                      onChange={(e) => setEditingHelper({...editingHelper, status: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setHelpers(helpers.map(h => h.id === editingHelper.id ? editingHelper : h));
                    setShowEditModal(false);
                    setEditingHelper(null);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700"
                >
                  Update Helper
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
      {showViewModal && viewingHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-900 to-green-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Complete Helper Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-green-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Helper Image and Basic Info */}
              <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <img src={viewingHelper.image} alt={viewingHelper.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-green-300 shadow-lg" />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{viewingHelper.name || 'N/A'}</h3>
                  <p className="text-xl text-gray-600 mb-3">Helper</p>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(viewingHelper.status)}`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {viewingHelper.status === 'Active' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {viewingHelper.status === 'Inactive' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                        {viewingHelper.status === 'On Leave' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                      {viewingHelper.status || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">Helper ID: #{viewingHelper.id}</span>
                  </div>
                </div>
              </div>

              {/* Complete Information in Tabs Style */}
              <div className="space-y-6">
                {/* Basic Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Mobile</p>
                        <p className="font-semibold text-gray-800">{viewingHelper.mobile || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Emergency Contact</p>
                        <p className="font-semibold text-gray-800">{viewingHelper.emergency || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="font-semibold text-gray-800">{viewingHelper.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    Employment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Salary</p>
                        <p className="font-semibold text-gray-800">৳{(viewingHelper.salary || '0').toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m0 0v6m0-6h-6" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Joining Date</p>
                        <p className="font-semibold text-gray-800">
                          {viewingHelper.joiningDate ? new Date(viewingHelper.joiningDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="font-semibold text-gray-800">{viewingHelper.experience || 'N/A'} years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Assigned Vehicle</p>
                        <p className="font-semibold text-gray-800">{viewingHelper.assignedVehicle || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Mobile Number</p>
                        <p className="font-semibold text-gray-800 text-lg">{viewingHelper.mobile || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Emergency Contact</p>
                        <p className="font-semibold text-gray-800 text-lg">{viewingHelper.emergency || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-blue-600">{viewingHelper.assignedVehicle || 'N/A'}</div>
                  <div className="text-sm text-blue-800">Vehicle</div>
                </div>
                <div className={`border rounded-lg p-4 text-center ${
                  viewingHelper.status === 'Active' ? 'bg-green-50 border-green-200' :
                  viewingHelper.status === 'Inactive' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className={`text-xl font-bold ${
                    viewingHelper.status === 'Active' ? 'text-green-600' :
                    viewingHelper.status === 'Inactive' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {viewingHelper.status || 'Unknown'}
                  </div>
                  <div className={`text-sm ${
                    viewingHelper.status === 'Active' ? 'text-green-800' :
                    viewingHelper.status === 'Inactive' ? 'text-red-800' :
                    'text-yellow-800'
                  }`}>
                    Status
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {viewingHelper.joiningDate ? new Date(viewingHelper.joiningDate).getFullYear() : 'N/A'}
                  </div>
                  <div className="text-sm text-purple-800">Join Year</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-orange-600">৳{(viewingHelper.salary || '0').toLocaleString()}</div>
                  <div className="text-sm text-orange-800">Monthly Salary</div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
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
