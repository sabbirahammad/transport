import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Calendar, Briefcase, Phone, CheckCircle, Upload, MapPin, CreditCard, Building, Heart, IdCard, DollarSign, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://192.168.0.106:8080/api/v1/employee';

export default function AddEmployee() {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee, isEdit } = location.state || {};

  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    email: '',
    mobile: '',
    birthDate: '',
    gender: '',
    bloodGroup: '',

    // Employment Information
    designation: '',
    employmentType: '',
    branchName: '',
    joinDate: '',
    salary: '',
    paymentMethod: '',
    role: '',

    // Personal Information
    nid: '',
    address: '',

    // System Information
    status: 'Active',
    image: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 50) + 1}`,
    imageFile: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notification, setNotification] = useState(null);

  // Populate form data if editing
  useEffect(() => {
    if (isEdit && employee) {
      setFormData({
        fullName: employee.fullName || '',
        email: employee.email || '',
        mobile: employee.mobile || '',
        birthDate: employee.birthDate || '',
        gender: employee.gender || '',
        bloodGroup: employee.bloodGroup || '',
        designation: employee.designation || '',
        employmentType: employee.employmentType || '',
        branchName: employee.branchName || '',
        joinDate: employee.joinDate || '',
        salary: employee.salary || '',
        paymentMethod: employee.paymentMethod || '',
        role: employee.role || '',
        nid: employee.nid || '',
        address: employee.address || '',
        status: employee.status || 'Active',
        image: employee.image || `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 50) + 1}`,
        imageFile: null
      });
    }
  }, [isEdit, employee]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal Information Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number is invalid';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }

    if (!formData.nid.trim()) {
      newErrors.nid = 'NID is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Employment Information Validation
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.employmentType) {
      newErrors.employmentType = 'Employment type is required';
    }

    if (!formData.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    if (!formData.joinDate) {
      newErrors.joinDate = 'Join date is required';
    }

    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || formData.salary <= 0) {
      newErrors.salary = 'Salary must be a valid positive number';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeData = {
        full_name: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        birth_date: formData.birthDate,
        gender: formData.gender,
        blood_group: formData.bloodGroup,
        designation: formData.designation,
        employment_type: formData.employmentType,
        branch_name: formData.branchName,
        join_date: formData.joinDate,
        salary: parseFloat(formData.salary),
        payment_method: formData.paymentMethod,
        nid: formData.nid,
        address: formData.address,
        status: formData.status,
        image: formData.image,
        role: formData.role
      };

      let response;
      if (isEdit) {
        // Update existing employee
        response = await fetch(`${API_BASE_URL}/${employee.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData),
        });
      } else {
        // Add new employee
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData),
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'add'} employee`);
      }

      const result = await response.json();
      console.log(`${isEdit ? 'Updated' : 'Added'} employee:`, result);

      showNotification(`Employee ${isEdit ? 'updated' : 'added'} successfully`, 'success');

      // Redirect to employee list after success
      setTimeout(() => {
        navigate('/employee');
      }, 1500);

    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'adding'} employee:`, error);
      showNotification(`Failed to ${isEdit ? 'update' : 'add'} employee`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      // Basic Information
      fullName: '',
      email: '',
      mobile: '',
      birthDate: '',
      gender: '',
      bloodGroup: '',

      // Employment Information
      designation: '',
      employmentType: '',
      branchName: '',
      joinDate: '',
      salary: '',
      paymentMethod: '',
      role: '',

      // Personal Information
      nid: '',
      address: '',

      // System Information
      status: 'Active',
      image: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 50) + 1}`,
      imageFile: null
    });
    setErrors({});
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {notification.type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            to="/employee"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Employee List</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Image Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100"
                />
                <button
                  type="button"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                  title="Change Photo"
                >
                  <User size={16} />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Employee Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new employee</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {/* Profile Image Upload Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Image</h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData(prev => ({ ...prev, imageFile: file }));
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setFormData(prev => ({ ...prev, image: e.target.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Upload size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Click on the image to upload a new photo</p>
                  <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 2MB)</p>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mobile ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter mobile number"
                  />
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Birth Date *
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.birthDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.gender ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Heart className="inline w-4 h-4 mr-1" />
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.bloodGroup ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && (
                    <p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>
                  )}
                </div>

                {/* NID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IdCard className="inline w-4 h-4 mr-1" />
                    National ID (NID) *
                  </label>
                  <input
                    type="text"
                    name="nid"
                    value={formData.nid}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nid ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter NID number"
                  />
                  {errors.nid && (
                    <p className="mt-1 text-sm text-red-600">{errors.nid}</p>
                  )}
                </div>
              </div>

              {/* Address - Full Width */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter full address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Employment Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" />
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.designation ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter designation"
                  />
                  {errors.designation && (
                    <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
                  )}
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.employmentType ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Employment Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                    <option value="Consultant">Consultant</option>
                  </select>
                  {errors.employmentType && (
                    <p className="mt-1 text-sm text-red-600">{errors.employmentType}</p>
                  )}
                </div>

                {/* Branch Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="inline w-4 h-4 mr-1" />
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.branchName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter branch name"
                  />
                  {errors.branchName && (
                    <p className="mt-1 text-sm text-red-600">{errors.branchName}</p>
                  )}
                </div>

                {/* Join Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Join Date *
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.joinDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.joinDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.joinDate}</p>
                  )}
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-1" />
                    Salary *
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.salary ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter salary amount"
                  />
                  {errors.salary && (
                    <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="inline w-4 h-4 mr-1" />
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.paymentMethod ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Mobile Banking">Mobile Banking</option>
                  </select>
                  {errors.paymentMethod && (
                    <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.role ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter role"
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
              </div>
            </div>

            {/* System Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
             <button
               type="submit"
               disabled={isSubmitting}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-colors ${
                 isSubmitting
                   ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                   : 'bg-blue-600 text-white hover:bg-blue-700'
               }`}
             >
               {isSubmitting ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   <span>{isEdit ? 'Updating Employee...' : 'Adding Employee...'}</span>
                 </>
               ) : (
                 <>
                   <CheckCircle size={18} />
                   <span>{isEdit ? 'Update Employee' : 'Add Employee'}</span>
                 </>
               )}
             </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Form
              </button>

              <Link
                to="/employee"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Important Notes:</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <div>
                <strong>Required Information:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>All fields marked with * are mandatory</li>
                  <li>Personal details: Name, email, mobile, birth date, gender, blood group, NID, address</li>
                  <li>Employment details: Designation, type, branch, join date, salary, payment method</li>
                </ul>
              </div>
              <div>
                <strong>Image Upload:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Click on the profile image to upload a photo</li>
                  <li>Supported formats: JPG, PNG, GIF (Max 2MB)</li>
                  <li>Image will be displayed immediately after selection</li>
                </ul>
              </div>
              <div>
                <strong>After Submission:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li>Employee will be added to the main employee list</li>
                  <li>You can edit or update details later</li>
                  <li>All information will be stored securely</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}