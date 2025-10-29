import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Calendar, MapPin, DollarSign, Truck, CheckCircle, Upload, IdCard, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddHelper() {
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    mobile: '',
    emergency: '',
    address: '',

    // Employment Information
    salary: '',
    assignedVehicle: '',
    joiningDate: '',
    experience: '',

    // Personal Information
    nid: '',

    // System Information
    status: 'Active',
    image: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 50) + 1}`,
    imageFile: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

    // Basic Information Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number is invalid';
    }

    if (!formData.emergency.trim()) {
      newErrors.emergency = 'Emergency contact is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.emergency)) {
      newErrors.emergency = 'Emergency contact is invalid';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Employment Information Validation
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || formData.salary <= 0) {
      newErrors.salary = 'Salary must be a valid positive number';
    }

    if (!formData.assignedVehicle.trim()) {
      newErrors.assignedVehicle = 'Assigned vehicle is required';
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }

    if (!formData.experience) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(formData.experience) || formData.experience < 0) {
      newErrors.experience = 'Experience must be a valid number';
    }

    // Personal Information Validation
    if (!formData.nid.trim()) {
      newErrors.nid = 'NID is required';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would send this data to your backend
      console.log('New helper data:', formData);

      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          // Basic Information
          name: '',
          mobile: '',
          emergency: '',
          address: '',

          // Employment Information
          salary: '',
          assignedVehicle: '',
          joiningDate: '',
          experience: '',

          // Personal Information
          nid: '',

          // System Information
          status: 'Active',
          image: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 50) + 1}`,
          imageFile: null
        });
        setIsSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error adding helper:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      // Basic Information
      name: '',
      mobile: '',
      emergency: '',
      address: '',

      // Employment Information
      salary: '',
      assignedVehicle: '',
      joiningDate: '',
      experience: '',

      // Personal Information
      nid: '',

      // System Information
      status: 'Active',
      image: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 50) + 1}`,
      imageFile: null
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Helper Added Successfully!</h2>
            <p className="text-gray-600">The new helper has been added to the system.</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/helper"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Helper List
            </Link>
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full block text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add Another Helper
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            to="/helper"
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Helper List</span>
          </Link>
          <div className="h-6 w-px bg-blue-300"></div>
          <h1 className="text-white text-xl font-semibold">Add New Helper</h1>
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
                <h2 className="text-xl font-bold text-gray-800">Helper Information</h2>
                <p className="text-gray-600">Fill in the details below to add a new helper</p>
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

            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Emergency Contact *
                  </label>
                  <input
                    type="tel"
                    name="emergency"
                    value={formData.emergency}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.emergency ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter emergency contact"
                  />
                  {errors.emergency && (
                    <p className="mt-1 text-sm text-red-600">{errors.emergency}</p>
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

                {/* Assigned Vehicle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Truck className="inline w-4 h-4 mr-1" />
                    Assigned Vehicle *
                  </label>
                  <input
                    type="text"
                    name="assignedVehicle"
                    value={formData.assignedVehicle}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.assignedVehicle ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter assigned vehicle"
                  />
                  {errors.assignedVehicle && (
                    <p className="mt-1 text-sm text-red-600">{errors.assignedVehicle}</p>
                  )}
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.joiningDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.joiningDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.joiningDate}</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="inline w-4 h-4 mr-1" />
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.experience ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter years of experience"
                  />
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <IdCard className="inline w-4 h-4 mr-1" />
                    NID Number *
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
                    <span>Adding Helper...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Add Helper</span>
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
                to="/helper"
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
                  <li>Basic details: Name, mobile, emergency contact, address</li>
                  <li>Employment details: Salary, assigned vehicle, joining date, experience</li>
                  <li>Personal details: NID number</li>
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
                  <li>Helper will be added to the main helper list</li>
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