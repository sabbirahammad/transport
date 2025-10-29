import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function EmployeePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();

  const [employees, setEmployees] = useState([
    {
      id: 1,
      image: 'https://i.pravatar.cc/100?img=1',
      fullName: 'John Anderson',
      email: 'john@company.com',
      mobile: '+1 (555) 123-4567',
      birthDate: '1990-05-15',
      gender: 'Male',
      bloodGroup: 'O+',
      nid: '1234567890123',
      address: '123 Main St, New York, NY 10001',
      designation: 'Senior Developer',
      employmentType: 'Full-time',
      branchName: 'Head Office',
      joinDate: '2023-01-15',
      salary: '75000',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    },
    {
      id: 2,
      image: 'https://i.pravatar.cc/100?img=2',
      fullName: 'Sarah Mitchell',
      email: 'sarah@company.com',
      mobile: '+1 (555) 234-5678',
      birthDate: '1988-12-22',
      gender: 'Female',
      bloodGroup: 'A+',
      nid: '1234567890124',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      designation: 'Product Manager',
      employmentType: 'Full-time',
      branchName: 'Main Branch',
      joinDate: '2022-08-22',
      salary: '85000',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    },
    {
      id: 3,
      image: 'https://i.pravatar.cc/100?img=3',
      fullName: 'Michael Chen',
      email: 'michael@company.com',
      mobile: '+1 (555) 345-6789',
      birthDate: '1992-03-10',
      gender: 'Male',
      bloodGroup: 'B+',
      nid: '1234567890125',
      address: '789 Pine St, Chicago, IL 60601',
      designation: 'UI/UX Designer',
      employmentType: 'Full-time',
      branchName: 'Design Studio',
      joinDate: '2023-03-10',
      salary: '65000',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    },
    {
      id: 4,
      image: 'https://i.pravatar.cc/100?img=4',
      fullName: 'Emily Rodriguez',
      email: 'emily@company.com',
      mobile: '+1 (555) 456-7890',
      birthDate: '1985-11-05',
      gender: 'Female',
      bloodGroup: 'AB+',
      nid: '1234567890126',
      address: '321 Elm St, Houston, TX 77001',
      designation: 'Team Lead',
      employmentType: 'Full-time',
      branchName: 'Head Office',
      joinDate: '2021-11-05',
      salary: '90000',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    },
    {
      id: 5,
      image: 'https://i.pravatar.cc/100?img=5',
      fullName: 'David Thompson',
      email: 'david@company.com',
      mobile: '+1 (555) 567-8901',
      birthDate: '1987-06-18',
      gender: 'Male',
      bloodGroup: 'O-',
      nid: '1234567890127',
      address: '654 Cedar St, Phoenix, AZ 85001',
      designation: 'Backend Developer',
      employmentType: 'Full-time',
      branchName: 'Tech Hub',
      joinDate: '2023-06-18',
      salary: '70000',
      paymentMethod: 'Bank Transfer',
      status: 'Inactive'
    },
    {
      id: 6,
      image: 'https://i.pravatar.cc/100?img=6',
      fullName: 'Jessica Williams',
      email: 'jessica@company.com',
      mobile: '+1 (555) 678-9012',
      birthDate: '1991-04-12',
      gender: 'Female',
      bloodGroup: 'A-',
      nid: '1234567890128',
      address: '987 Maple St, Philadelphia, PA 19101',
      designation: 'QA Engineer',
      employmentType: 'Full-time',
      branchName: 'Quality Assurance',
      joinDate: '2022-04-12',
      salary: '55000',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    },
    {
      id: 7,
      image: 'https://i.pravatar.cc/100?img=7',
      fullName: 'Robert Taylor',
      email: 'robert@company.com',
      mobile: '+1 (555) 789-0123',
      birthDate: '1989-09-01',
      gender: 'Male',
      bloodGroup: 'B-',
      nid: '1234567890129',
      address: '147 Birch St, San Antonio, TX 78201',
      designation: 'DevOps Engineer',
      employmentType: 'Full-time',
      branchName: 'Operations',
      joinDate: '2023-09-01',
      salary: '80000',
      paymentMethod: 'Bank Transfer',
      status: 'On Leave'
    },
    {
      id: 8,
      image: 'https://i.pravatar.cc/100?img=8',
      fullName: 'Amanda Lee',
      email: 'amanda@company.com',
      mobile: '+1 (555) 890-1234',
      birthDate: '1993-12-20',
      gender: 'Female',
      bloodGroup: 'O+',
      nid: '1234567890130',
      address: '258 Willow St, San Diego, CA 92101',
      designation: 'Marketing Specialist',
      employmentType: 'Full-time',
      branchName: 'Marketing',
      joinDate: '2022-12-20',
      salary: '60000',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    },
    {
      id: 9,
      image: 'https://i.pravatar.cc/100?img=9',
      fullName: 'James Wilson',
      email: 'james@company.com',
      mobile: '+1 (555) 901-2345',
      birthDate: '1986-05-14',
      gender: 'Male',
      bloodGroup: 'AB-',
      nid: '1234567890131',
      address: '369 Spruce St, Dallas, TX 75201',
      designation: 'Frontend Developer',
      employmentType: 'Full-time',
      branchName: 'Tech Hub',
      joinDate: '2023-05-14',
      salary: '72000',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    },
    {
      id: 10,
      image: 'https://i.pravatar.cc/100?img=10',
      fullName: 'Maria Garcia',
      email: 'maria@company.com',
      mobile: '+1 (555) 012-3456',
      birthDate: '1984-07-22',
      gender: 'Female',
      bloodGroup: 'A+',
      nid: '1234567890132',
      address: '741 Ash St, San Jose, CA 95101',
      designation: 'HR Manager',
      employmentType: 'Full-time',
      branchName: 'Human Resources',
      joinDate: '2023-07-22',
      salary: '78000',
      paymentMethod: 'Bank Transfer',
      status: 'Active'
    },
    {
      id: 11,
      image: 'https://i.pravatar.cc/100?img=11',
      fullName: 'Tom Brown',
      email: 'tom@company.com',
      mobile: '+1 (555) 123-4568',
      birthDate: '1990-11-30',
      gender: 'Male',
      bloodGroup: 'O+',
      nid: '1234567890133',
      address: '852 Poplar St, Austin, TX 73301',
      designation: 'System Analyst',
      employmentType: 'Full-time',
      branchName: 'IT Department',
      joinDate: '2022-11-30',
      salary: '68000',
      paymentMethod: 'Bank Transfer',
      status: 'Inactive'
    }
  ]);

  const stats = [
    { label: 'Total Employees', value: employees.length, color: 'blue', trend: '+12' },
    { label: 'Active Employees', value: employees.filter(e => e.status === 'Active').length, color: 'green', trend: '+8' },
    { label: 'On Leave', value: employees.filter(e => e.status === 'On Leave').length, color: 'orange', trend: '0' },
    { label: 'Inactive', value: employees.filter(e => e.status === 'Inactive').length, color: 'red', trend: '-2' }
  ];

  const filteredEmployees = employees.filter(emp => {
    const ms = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || emp.mobile.includes(searchTerm) || emp.email.toLowerCase().includes(searchTerm.toLowerCase()) || emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const fs = filterStatus === 'all' || emp.status.toLowerCase() === filterStatus.toLowerCase();
    return ms && fs;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageEmployees = filteredEmployees.slice(startIndex, endIndex);

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

  const handleViewEmployee = (employee) => {
    setViewingEmployee({ ...employee });
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
                  <svg className={`${getStatColor(s.color).split(' ')[1]} w-5 h-5`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <span className={`text-xs font-semibold ${s.trend.startsWith('+') ? 'text-green-600' : s.trend.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>{s.trend}%</span>
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
                <svg className="text-blue-600 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <h2 className="text-xl font-bold text-gray-800">All Employee Information</h2>
              </div>
              <Link
                to="/add-employee"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span className="font-medium">Add Employee</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[300px] relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search by name, mobile, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  <span>Filters</span>
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Export</span>
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Export to Excel
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Export to PDF
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                  <th className="px-4 py-3 text-left"><input type="checkbox" checked={currentPageEmployees.length > 0 && currentPageEmployees.every(e => selectedEmployees.includes(e.id))} onChange={() => {
                    const ids = currentPageEmployees.map(e => e.id);
                    const all = ids.every(id => selectedEmployees.includes(id));
                    setSelectedEmployees(all ? selectedEmployees.filter(id => !ids.includes(id)) : [...new Set([...selectedEmployees, ...ids])]);
                  }} className="w-4 h-4 rounded" /></th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SL</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Full Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Join Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Designation</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mobile</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageEmployees.length > 0 ? currentPageEmployees.map((emp, idx) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><input type="checkbox" checked={selectedEmployees.includes(emp.id)} onChange={() => setSelectedEmployees(selectedEmployees.includes(emp.id) ? selectedEmployees.filter(id => id !== emp.id) : [...selectedEmployees, emp.id])} className="w-4 h-4 rounded" /></td>
                    <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                    <td className="px-4 py-3"><img src={emp.image} alt={emp.fullName} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200" /></td>
                    <td className="px-4 py-3 text-sm font-medium">{emp.fullName}</td>
                    <td className="px-4 py-3 text-sm">{emp.email}</td>
                    <td className="px-4 py-3 text-sm">{new Date(emp.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="px-4 py-3 text-sm font-medium">{emp.designation}</td>
                    <td className="px-4 py-3 text-sm">{emp.mobile}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emp.status)}`}>{emp.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleViewEmployee(emp)} className="p-1.5 hover:bg-blue-50 rounded" title="View Details">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={() => { setEditingEmployee({...emp}); setShowEditModal(true); }} className="p-1.5 hover:bg-green-50 rounded" title="Edit">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => { if (window.confirm('Are you sure?')) setEmployees(employees.filter(e => e.id !== emp.id)); }} className="p-1.5 hover:bg-red-50 rounded" title="Delete">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="10" className="px-4 py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-lg font-medium">No employee found</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)}</strong> of <strong>{filteredEmployees.length}</strong></div>
            <div className="flex items-center gap-2">
              <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-1.5 border rounded text-sm flex items-center gap-1 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Previous
              </button>
              {getPageNumbers().map((pg, i) => pg === '...' ? <span key={`ellipsis-${i}`} className="px-2 text-gray-500">...</span> : <button key={pg} onClick={() => {setCurrentPage(pg); setSelectedEmployees([]);}} className={`px-3 py-1.5 rounded text-sm ${currentPage === pg ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}>{pg}</button>)}
              <button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className={`px-3 py-1.5 border rounded text-sm flex items-center gap-1 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}>
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Employee Information</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label><input type="text" value={editingEmployee.fullName || ''} onChange={(e) => setEditingEmployee({...editingEmployee, fullName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" value={editingEmployee.email || ''} onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label><input type="tel" value={editingEmployee.mobile || ''} onChange={(e) => setEditingEmployee({...editingEmployee, mobile: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label><input type="date" value={editingEmployee.birthDate || ''} onChange={(e) => setEditingEmployee({...editingEmployee, birthDate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Gender</label><select value={editingEmployee.gender || ''} onChange={(e) => setEditingEmployee({...editingEmployee, gender: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label><select value={editingEmployee.bloodGroup || ''} onChange={(e) => setEditingEmployee({...editingEmployee, bloodGroup: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"><option value="">Select Blood Group</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">National ID</label><input type="text" value={editingEmployee.nid || ''} onChange={(e) => setEditingEmployee({...editingEmployee, nid: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Address</label><input type="text" value={editingEmployee.address || ''} onChange={(e) => setEditingEmployee({...editingEmployee, address: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Employment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Designation</label><input type="text" value={editingEmployee.designation || ''} onChange={(e) => setEditingEmployee({...editingEmployee, designation: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label><select value={editingEmployee.employmentType || ''} onChange={(e) => setEditingEmployee({...editingEmployee, employmentType: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"><option value="">Select Employment Type</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option><option value="Intern">Intern</option><option value="Consultant">Consultant</option></select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Branch Name</label><input type="text" value={editingEmployee.branchName || ''} onChange={(e) => setEditingEmployee({...editingEmployee, branchName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label><input type="date" value={editingEmployee.joinDate || ''} onChange={(e) => setEditingEmployee({...editingEmployee, joinDate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Salary</label><input type="number" value={editingEmployee.salary || ''} onChange={(e) => setEditingEmployee({...editingEmployee, salary: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label><select value={editingEmployee.paymentMethod || ''} onChange={(e) => setEditingEmployee({...editingEmployee, paymentMethod: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"><option value="">Select Payment Method</option><option value="Bank Transfer">Bank Transfer</option><option value="Cash">Cash</option><option value="Check">Check</option><option value="Mobile Banking">Mobile Banking</option></select></div>
                </div>
              </div>

              {/* System Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">System Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Status</label><select value={editingEmployee.status || ''} onChange={(e) => setEditingEmployee({...editingEmployee, status: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="On Leave">On Leave</option></select></div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button onClick={() => { setEmployees(employees.map(e => e.id === editingEmployee.id ? editingEmployee : e)); setShowEditModal(false); setEditingEmployee(null); }} className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700">Update Employee</button>
                <button onClick={() => setShowEditModal(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-900 to-green-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Complete Employee Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-green-700 p-1 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6">
              {/* Employee Image and Basic Info */}
              <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <img src={viewingEmployee.image} alt={viewingEmployee.fullName} className="w-24 h-24 rounded-full object-cover ring-4 ring-green-300 shadow-lg" />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{viewingEmployee.fullName || 'N/A'}</h3>
                  <p className="text-xl text-gray-600 mb-3">{viewingEmployee.designation || 'No designation'}</p>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(viewingEmployee.status)}`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {viewingEmployee.status === 'Active' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {viewingEmployee.status === 'Inactive' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                        {viewingEmployee.status === 'On Leave' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      </svg>
                      {viewingEmployee.status || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">Employee ID: #{viewingEmployee.id}</span>
                  </div>
                </div>
              </div>

              {/* Complete Information in Tabs Style */}
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m0 0v6m0-6h-6" /></svg>
                      <div>
                        <p className="text-xs text-gray-500">Birth Date</p>
                        <p className="font-semibold text-gray-800">
                          {viewingEmployee.birthDate ? new Date(viewingEmployee.birthDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <div>
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="font-semibold text-gray-800">{viewingEmployee.gender || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      <div>
                        <p className="text-xs text-gray-500">Blood Group</p>
                        <p className="font-semibold text-gray-800">{viewingEmployee.bloodGroup || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5M10 6V4a2 2 0 012-2h2a2 2 0 012 2v2M10 6h4" /></svg>
                      <div>
                        <p className="text-xs text-gray-500">National ID</p>
                        <p className="font-semibold text-gray-800">{viewingEmployee.nid || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="font-semibold text-gray-800">{viewingEmployee.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employment Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" /></svg>
                    Employment Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" /></svg>
                      <div>
                        <p className="text-xs text-gray-500">Employment Type</p>
                        <p className="font-semibold text-gray-800">{viewingEmployee.employmentType || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      <div>
                        <p className="text-xs text-gray-500">Branch</p>
                        <p className="font-semibold text-gray-800">{viewingEmployee.branchName || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m0 0v6m0-6h-6" /></svg>
                      <div>
                        <p className="text-xs text-gray-500">Join Date</p>
                        <p className="font-semibold text-gray-800">
                          {viewingEmployee.joinDate ? new Date(viewingEmployee.joinDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                      <div>
                        <p className="text-xs text-gray-500">Salary</p>
                        <p className="font-semibold text-gray-800">${(viewingEmployee.salary || '0').toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="font-semibold text-gray-800">{viewingEmployee.paymentMethod || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Contact Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-semibold text-gray-800 text-lg">{viewingEmployee.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <div>
                        <p className="text-sm text-gray-500">Mobile Number</p>
                        <p className="font-semibold text-gray-800 text-lg">{viewingEmployee.mobile || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-blue-600">{viewingEmployee.designation || 'N/A'}</div>
                  <div className="text-sm text-blue-800">Position</div>
                </div>
                <div className={`border rounded-lg p-4 text-center ${
                  viewingEmployee.status === 'Active' ? 'bg-green-50 border-green-200' :
                  viewingEmployee.status === 'Inactive' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className={`text-xl font-bold ${
                    viewingEmployee.status === 'Active' ? 'text-green-600' :
                    viewingEmployee.status === 'Inactive' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {viewingEmployee.status || 'Unknown'}
                  </div>
                  <div className={`text-sm ${
                    viewingEmployee.status === 'Active' ? 'text-green-800' :
                    viewingEmployee.status === 'Inactive' ? 'text-red-800' :
                    'text-yellow-800'
                  }`}>
                    Status
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {viewingEmployee.joinDate ? new Date(viewingEmployee.joinDate).getFullYear() : 'N/A'}
                  </div>
                  <div className="text-sm text-purple-800">Join Year</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-orange-600">${(viewingEmployee.salary || '0').toLocaleString()}</div>
                  <div className="text-sm text-orange-800">Annual Salary</div>
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