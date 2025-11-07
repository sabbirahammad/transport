

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Search, Plus, Filter, Download,
//   Edit2, Trash2, Eye, Truck, DollarSign,
//   TrendingUp, FileText, Printer, AlertCircle,
//   ChevronLeft, ChevronRight, X, Loader2, ArrowLeft, User, Package
// } from 'lucide-react';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import * as XLSX from 'xlsx';

// const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

// export default function CustomTripList({  }) {
//   const { id } = useParams(); // This is customerId from URL
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Use propId if provided, otherwise use urlId


//   // State management
//   const [customer, setCustomer] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [activeProductId, setActiveProductId] = useState(null);
//   const [productId, setProductId] = useState(null); // ✅ Add productId state
//   const [productName, setProductName] = useState('')
//   const [customerId, setCustomerId] = useState(null);
//   const [trips, setTrips] = useState([]);
//   const [selectedFields, setSelectedFields] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setdata] = useState()

//   // UI state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedTrips, setSelectedTrips] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [editingTrip, setEditingTrip] = useState(null);
//   const [viewingTrip, setViewingTrip] = useState(null);
//   const [chack, setchack] = useState()

//   const itemsPerPage = 10;
//   const printRef = useRef();

//   console.log('Product ID:', productId);
//   console.log('Active Product ID:', activeProductId);
//   console.log('Customer ID (from params):', id);
//   console.log('Customer ID (state):', customerId);
//   console.log(productName)
//   console.log(data)
//   // Initial data fetch
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // ✅ Get data from navigation state first
//         const stateProductId = location.state?.productId;
//         const stateProductName = location.state?.productName;
//         const stateSelectedCustomer = location.state?.selectedCustomer;
//         const stateSuccessMessage = location.state?.successMessage;
//         const stateCustomerId = location.state?.customerId;

//         // Determine customer ID to use (prioritize state.customerId, then state.selectedCustomer.id, fallback to params)
//         const customerIdToUse = stateCustomerId || (stateSelectedCustomer ? stateSelectedCustomer.id : null) || id;

//         setCustomerId(customerIdToUse);

//         if (stateProductId) {
//           setProductId(stateProductId);
//           setActiveProductId(stateProductId);
//         }
//         if (stateProductName) {
//           setProductName(stateProductName)
//         }
//         if (stateSelectedCustomer) {
//           setCustomer(stateSelectedCustomer);
//         }
//         if (stateSuccessMessage) {
//           // Handle success message if needed
//         }

//         if (!customerIdToUse) {
//           setError('Customer ID is required');
//           setLoading(false);
//           return;
//         }

//         // 1. ✅ Fetch customer details using customerId - only if not already set from state
//         if (!customer) {
//           const customerRes = await fetch(`${API_BASE_URL}/customer/${customerIdToUse}`);
//           if (!customerRes.ok) {
//             throw new Error('Customer not found with ID ' + customerIdToUse);
//           }
//           const customerData = await customerRes.json();
//         setchack(customerData)
//           setCustomer({
//             id: customerData.id,
//             name: customerData.customerName || customerData.name || 'Unknown',
//             address: customerData.address || ''
//           });
//         }

//         // 2. Fetch all products for this customer
//         // 2. Fetch all products for this customer
//         const productsRes = await fetch(`${API_BASE_URL}/products?company_id=${customerIdToUse}`);
//         const productsData = await productsRes.json();

//         const productsArray = Array.isArray(productsData)
//           ? productsData
//           : (productsData.data || []);

//         // ✅ Filter only company_id matched products
//         const filteredProducts = productsArray.filter(
//           (item) => item.company_id == customerIdToUse
//         );

//         setProducts(filteredProducts);


//         // 3. Set initial active product (use state first, then fallback to latest)
//         let finalProductId = stateProductId;
//         if (!finalProductId && productsArray.length > 0) {
//           finalProductId = productsArray[productsArray.length - 1].id;
//         }

//         if (finalProductId) {
//           setActiveProductId(finalProductId);
//           setProductId(finalProductId);
//           const selectedProduct = productsArray.find(p => p.id == finalProductId);
//           setProductName(selectedProduct?.name || '');
//         }

//         // 4. Fetch trips for this product
//         if (finalProductId) {
//           await fetchTrips(finalProductId);
//         }

//         // 5. Fetch selected fields for active product
//         if (finalProductId) {
//           await fetchSelectedFields(finalProductId);
//         }

//       } catch (err) {
//         console.error('Error fetching initial data:', err);
//         setError(err.message || 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, [id, location.state]); // ✅ Add location.state as dependency
//   console.log(products)
//   console.log(chack)
//   // Fetch selected fields when active product changes
//   const fetchSelectedFields = async (productId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${productId}/trip-fields`);
//       if (response.ok) {
//         const data = await response.json();
//         setdata(data)

//         let fieldsArray = [];
//         if (Array.isArray(data)) {
//           fieldsArray = data;
//         } else if (data.data && Array.isArray(data.data)) {
//           fieldsArray = data.data;
//         } else if (data.trip_fields && Array.isArray(data.trip_fields)) {
//           fieldsArray = data.trip_fields;
//         } else if (typeof data === 'object' && data.trip_fields) {
//           fieldsArray = Array.isArray(data.trip_fields) ? data.trip_fields : [];
//         } else if (data.note && data.note.trip_fields && Array.isArray(data.note.trip_fields)) {
//           fieldsArray = data.note.trip_fields;
//         }

//         setSelectedFields(fieldsArray);
//         console.log('Selected fields set to:', fieldsArray);
//       } else {
//         setSelectedFields([]);
//       }
//     } catch (err) {
//       console.error('Error fetching selected fields:', err);
//       setSelectedFields([]);
//     }
//   };

//   // Fetch trips using GET /api/v1/products/:productId/trips
//   const fetchTrips = async (productId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${productId}/trips`);
//       if (response.ok) {
//         const data = await response.json();
//         let tripsArray = [];

//         if (Array.isArray(data)) {
//           tripsArray = data;
//         } else if (data.data && Array.isArray(data.data)) {
//           tripsArray = data.data;
//         } else if (data.trips && Array.isArray(data.trips)) {
//           tripsArray = data.trips;
//         } else if (typeof data === 'object' && data.trips) {
//           tripsArray = Array.isArray(data.trips) ? data.trips : [];
//         } else if (data.note && data.note.trips && Array.isArray(data.note.trips)) {
//           tripsArray = data.note.trips;
//         }

//         setTrips(tripsArray);
//         console.log('Trips fetched:', tripsArray);
//       } else {
//         throw new Error(`Failed to fetch trips: ${response.status}`);
//       }
//     } catch (err) {
//       console.error('Error fetching trips:', err);
//       setError('Failed to load trips data');
//       setTrips([]);
//     }
//   };

//   // Handle product tab change
//   const handleProductChange = async (productId) => {
//     const selectedProduct = products.find(p => p.id == productId);
//     setActiveProductId(productId);
//     setProductId(productId);
//     setProductName(selectedProduct?.name || '');
//     setCurrentPage(1);
//     setSelectedTrips([]);
//     await fetchSelectedFields(productId);
//     await fetchTrips(productId);
//   };

//   // All possible fields definition
//   const allFields = [
//     { key: 'id', label: 'ID' },
//     { key: 'brandName', label: 'Brand Name' },
//     { key: 'companyName', label: 'Company Name' },
//     { key: 'category', label: 'Category' },
//     { key: 'productName', label: 'Product Name' },
//     { key: 'date', label: 'Date' },
//     { key: 'tripType', label: 'Trip Type' },
//     { key: 'tripNo', label: 'Trip No' },
//     { key: 'invoiceNo', label: 'Invoice No' },
//     { key: 'vehicleName', label: 'Vehicle Name' },
//     { key: 'vehicleNo', label: 'Vehicle No' },
//     { key: 'engineNo', label: 'Engine No' },
//     { key: 'chassisNo', label: 'Chassis No' },
//     { key: 'driverName', label: 'Driver Name' },
//     { key: 'driverMobile', label: 'Driver Mobile' },
//     { key: 'helperName', label: 'Helper Name' },
//     { key: 'truckSize', label: 'Truck Size' },
//     { key: 'fuelType', label: 'Fuel Type' },
//     { key: 'fuelCost', label: 'Fuel Cost' },
//     { key: 'loadPoint', label: 'Load Point' },
//     { key: 'unloadPoint', label: 'Unload Point' },
//     { key: 'destination', label: 'Destination' },
//     { key: 'route', label: 'Route' },
//     { key: 'district', label: 'District' },
//     { key: 'quantity', label: 'Quantity' },
//     { key: 'weight', label: 'Weight' },
//     { key: 'transportType', label: 'Transport Type' },
//     { key: 'unitPrice', label: 'Unit Price' },
//     { key: 'totalRate', label: 'Total Rate' },
//     { key: 'cash', label: 'Cash' },
//     { key: 'advance', label: 'Advance' },
//     { key: 'due', label: 'Due' },
//     { key: 'billNo', label: 'Bill No' },
//     { key: 'billDate', label: 'Bill Date' },
//     { key: 'paymentType', label: 'Payment Type' },
//     { key: 'remarks', label: 'Remarks' },
//     { key: 'status', label: 'Status' },
//     { key: 'createdBy', label: 'Created By' },
//     { key: 'approvedBy', label: 'Approved By' },
//     { key: 'createdAt', label: 'Created At' },
//     { key: 'updatedAt', label: 'Updated At' }
//   ];

//   // Get valid selected fields with labels
//   const validSelectedFields = selectedFields
//     .map(fieldKey => {
//       const field = allFields.find(f => f.key === fieldKey);
//       if (field) return field;
//       return { key: fieldKey, label: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1) };
//     })
//     .filter(Boolean);

//   // Table columns - limit to maximum 10 columns
//   const tableColumns = validSelectedFields.slice(0, 10);

//   // Get active product info
//   const activeProduct = products.find(p => p.id == activeProductId);

//   // Filter trips by active product
//   const filteredTrips = trips
//     .filter(trip => {
//       return String(trip.product_id) === String(activeProductId);
//     })
//     .filter(trip => {
//       if (!searchTerm) return true;
//       return validSelectedFields.some(col =>
//         String(trip[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     })
//     .filter(trip => {
//       if (filterStatus === 'all') return true;
//       return (trip.status || '').toLowerCase() === filterStatus.toLowerCase();
//     });

//   // Calculate stats
//   const totalRecords = filteredTrips.length;
//   const totalAmount = filteredTrips.reduce((sum, item) =>
//     sum + (Number(item.totalAmount) || Number(item.total) || Number(item.totalRate) || 0), 0
//   );
//   const totalProfit = filteredTrips.reduce((sum, item) =>
//     sum + (Number(item.profit) || 0), 0
//   );

//   const stats = [
//     { label: 'Total Records', value: totalRecords.toString(), icon: TrendingUp, color: 'blue' },
//     { label: 'Total Amount', value: `৳${totalAmount.toLocaleString()}`, icon: DollarSign, color: 'green' },
//     { label: 'Total Profit', value: `৳${totalProfit.toLocaleString()}`, icon: DollarSign, color: 'purple' }
//   ];

//   // Pagination
//   const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentPageTrips = filteredTrips.slice(startIndex, endIndex);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     setSelectedTrips([]);
//   };

//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) pages.push(i);
//         pages.push('...');
//         pages.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pages.push(1);
//         pages.push('...');
//         for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
//       } else {
//         pages.push(1);
//         pages.push('...');
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
//         pages.push('...');
//         pages.push(totalPages);
//       }
//     }
//     return pages;
//   };

//   // Selection handlers
//   const handleSelectAll = () => {
//     const currentPageIds = currentPageTrips.map(t => t.id);
//     const allSelected = currentPageIds.every(id => selectedTrips.includes(id));
//     setSelectedTrips(allSelected
//       ? selectedTrips.filter(id => !currentPageIds.includes(id))
//       : [...new Set([...selectedTrips, ...currentPageIds])]
//     );
//   };

//   const handleSelectTrip = (id) => {
//     setSelectedTrips(prev =>
//       prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
//     );
//   };

//   // CRUD handlers
//   const handleViewTrip = (trip) => {
//     setViewingTrip({ ...trip });
//     setShowViewModal(true);
//   };

//   const handleEditTrip = (trip) => {
//     setEditingTrip({ ...trip });
//     setShowEditModal(true);
//   };

//   const handleUpdateTrip = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${productId}/trips/${editingTrip.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editingTrip),
//       });
//       if (!response.ok) throw new Error('Failed to update trip');

//       // Update the trip in the local state immediately
//       setTrips(trips.map(t => t.id === editingTrip.id ? editingTrip : t));
//       setShowEditModal(false);
//       setEditingTrip(null);

//       // Refresh trips from API to ensure consistency
//       await fetchTrips(productId);
//     } catch (err) {
//       console.error('Error updating trip:', err);
//       alert('Failed to update trip');
//     }
//   };

//   const handleDeleteTrip = async (tripId) => {
//     if (!window.confirm('Are you sure you want to delete this trip?')) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${productId}/trips/${tripId}`, {
//         method: 'DELETE'
//       });
//       if (!response.ok) throw new Error('Failed to delete trip');

//       // Remove the trip from local state immediately
//       setTrips(trips.filter(t => t.id !== tripId));

//       // Refresh trips from API to ensure consistency
//       await fetchTrips(productId);
//     } catch (err) {
//       console.error('Error deleting trip:', err);
//       alert('Failed to delete trip');
//     }
//   };

//   // Export functions
//   const exportToExcel = () => {
//     const data = selectedTrips.length > 0
//       ? filteredTrips.filter(t => selectedTrips.includes(t.id))
//       : filteredTrips;

//     const worksheet = XLSX.utils.json_to_sheet(data.map(t => {
//       const row = { 'Product': activeProduct?.name || '' };
//       tableColumns.forEach(col => {
//         row[col.label] = t[col.key] || '';
//       });
//       return row;
//     }));

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Trips');
//     XLSX.writeFile(workbook, `${activeProduct?.name || 'trips'}_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     const data = selectedTrips.length > 0
//       ? filteredTrips.filter(t => selectedTrips.includes(t.id))
//       : filteredTrips;

//     doc.setFontSize(18);
//     doc.text(`${activeProduct?.name || 'Trip'} Records`, 14, 22);
//     doc.setFontSize(11);
//     doc.text(`Customer: ${customer?.name || ''}`, 14, 30);
//     doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 36);

//     const tableData = data.map(t => {
//       const row = [activeProduct?.name || ''];
//       tableColumns.forEach(col => {
//         const value = t[col.key];
//         row.push(typeof value === 'number' ? `৳${value.toLocaleString()}` : (value || ''));
//       });
//       return row;
//     });

//     doc.autoTable({
//       head: [['Product', ...tableColumns.map(col => col.label)]],
//       body: tableData,
//       startY: 42,
//       theme: 'grid',
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [37, 99, 235] }
//     });

//     doc.save(`${activeProduct?.name || 'trips'}.pdf`);
//   };

//   const handlePrint = () => {
//     window.print();
//   };
// console.log(customerId)
//   // Reset page on filter change
//   useEffect(() => {
//     setCurrentPage(1);
//     setSelectedTrips([]);
//   }, [searchTerm, filterStatus, activeProductId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 size={64} className="mx-auto mb-4 text-blue-600 animate-spin" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
//           <p className="text-gray-600">Fetching trip data</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle size={64} className="mx-auto mb-4 text-red-400" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (validSelectedFields.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">No Fields Selected</h2>
//           <p className="text-gray-600 mb-4">Please configure trip fields for {activeProduct?.name || 'this product'}</p>
//           <button
//             onClick={() => navigate(`/customer/${id}/trip-field`, {
//               state: {
//                 selectedCustomer: customer,
//                 productName: activeProduct?.name,
//                 productId: activeProductId
//               }
//             })}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//           >
//             Configure Fields
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Enhanced Header */}
//       <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-white/20 rounded-xl">
//               <Truck className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-white text-3xl font-bold">Custom Trip Management</h1>
//               <p className="text-blue-100 text-sm">Manage and monitor custom trips</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Product Category Tabs */}
//       <div className="bg-white border-b border-gray-200 px-8 shadow-sm">
//         <div className="flex flex-wrap gap-1">
//           {products.map(product => (
//             <button
//               key={product.id}
//               onClick={() => handleProductChange(product.id)}
//               className={`px-4 py-4 font-semibold text-sm transition-all whitespace-nowrap ${activeProductId == product.id
//                   ? 'bg-blue-900 text-white border-b-4 border-blue-600'
//                   : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//             >
//               {product.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="px-4 sm:px-8 py-4 sm:py-8">
//         {/* Enhanced Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {stats.map((stat, idx) => (
//             <div key={idx} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-3 bg-gradient-to-r ${stat.color === 'blue' ? 'from-blue-500 to-blue-600' : stat.color === 'green' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} rounded-xl shadow-lg`}>
//                   <stat.icon className="text-white" size={24} />
//                 </div>
//                 <div className="text-right">
//                   <span className={`text-sm font-bold ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : 'text-purple-600'}`}>
//                     +5%
//                   </span>
//                   <div className="text-xs text-gray-500">vs last month</div>
//                 </div>
//               </div>
//               <div className="mb-2">
//                 <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
//                 <p className="text-sm font-medium text-gray-600">{stat.label}</p>
//               </div>
//               <p className="text-xs text-gray-500">All time records</p>
//             </div>
//           ))}
//         </div>

//         {/* Enhanced Main Content Card */}
//         <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
//           {/* Enhanced Action Bar */}
//           <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-8 border-b border-gray-200">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-100 rounded-xl">
//                   <Truck className="w-8 h-8 text-blue-600" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">Custom Trip Records</h2>
//                   <p className="text-gray-600">Manage all your custom trips in one place</p>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => navigate(`/add-trip/${productId}`, {
//                     state: {
//                       productId: productId,
//                       productName: productName,
//                       customerName:chack.note.customerName,
//                       selectedCustomer: customer,
//                       customerId: customerId
//                     }
//                   })}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <Plus size={18} />
//                   Add Trip
//                 </button>
//                 <button
//                   onClick={() => navigate(`/customer/${productId}/bill`,{
//                         state: {
//                       productId: productId,
//                       productName: productName,
//                       selectedCustomer: customer,
//                       customerId: customerId,
//                       customerName:chack.note.customerName
//                     }
//                   })}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
//                 >
//                   <ArrowLeft size={18} />
//                   Bill
//                 </button>
//               </div>
//             </div>

//             {/* Customer & Product Info */}
//             <div className="mb-6 p-4 bg-white rounded-xl border border-gray-100">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {customer && (
//                   <div className="flex items-center gap-3">
//                     <User className="h-5 w-5 text-gray-500" />
//                     <div>
//                       <span className="text-sm text-gray-600">Customer:</span>
//                       <span className="font-semibold text-gray-800 ml-2">{chack.note.customerName}</span>
//                     </div>
//                   </div>
//                 )}
//                 {activeProduct && (
//                   <div className="flex items-center gap-3">
//                     <Package className="h-5 w-5 text-gray-500" />
//                     <div>
//                       <span className="text-sm text-gray-600">Product:</span>
//                       <span className="font-semibold text-gray-800 ml-2">{productName}</span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Enhanced Search and Filters */}
//             <div className="flex flex-wrap items-center gap-4">
//               <div className="flex-1 min-w-[200px] sm:min-w-[300px] relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search by trip details, vehicle, driver, or any field..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
//                 />
//               </div>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className={`flex items-center gap-2 px-6 py-3 border-2 rounded-xl transition-all ${
//                     showFilters
//                       ? 'border-blue-500 bg-blue-50 text-blue-700'
//                       : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//                   }`}
//                 >
//                   <Filter size={18} />
//                   <span className="font-medium">Filters</span>
//                 </button>

//                 {/* Enhanced Export Dropdown */}
//                 <div className="relative group">
//                   <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all font-medium">
//                     <Download size={18} />
//                     <span>Export</span>
//                   </button>
//                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border-2 border-gray-200 hidden group-hover:block z-20">
//                     <button
//                       onClick={exportToExcel}
//                       className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 transition-colors"
//                     >
//                       <FileText size={16} className="text-green-600" />
//                       <div>
//                         <div className="font-medium text-gray-800">Export to Excel</div>
//                         <div className="text-xs text-gray-500">Download as .xlsx file</div>
//                       </div>
//                     </button>
//                     <button
//                       onClick={exportToPDF}
//                       className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 transition-colors"
//                     >
//                       <FileText size={16} className="text-red-600" />
//                       <div>
//                         <div className="font-medium text-gray-800">Export to PDF</div>
//                         <div className="text-xs text-gray-500">Download as .pdf file</div>
//                       </div>
//                     </button>
//                     <button
//                       onClick={handlePrint}
//                       className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 transition-colors"
//                     >
//                       <Printer size={16} className="text-purple-600" />
//                       <div>
//                         <div className="font-medium text-gray-800">Print Report</div>
//                         <div className="text-xs text-gray-500">Print current view</div>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {showFilters && (
//               <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Status</option>
//                     <option value="Completed">Completed</option>
//                     <option value="Pending">Pending</option>
//                   </select>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="px-6 py-12 text-center">
//               <div className="inline-flex items-center gap-2 text-gray-600">
//                 <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                 <span>Loading trips...</span>
//               </div>
//             </div>
//           )}

//           {/* Error State */}
//           {error && (
//             <div className="px-6 py-12 text-center">
//               <div className="text-red-600 mb-4">
//                 <AlertCircle size={48} className="mx-auto mb-3 text-red-300" />
//                 <p className="text-lg font-medium">Error loading trips</p>
//                 <p className="text-sm">{error}</p>
//               </div>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Try Again
//               </button>
//             </div>
//           )}

//           {/* Enhanced Table */}
//           {!loading && !error && (
//             <div className="overflow-hidden" ref={printRef}>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-sm font-bold">
//                         <input
//                           type="checkbox"
//                           checked={currentPageTrips.length > 0 && currentPageTrips.every(t => selectedTrips.includes(t.id))}
//                           onChange={handleSelectAll}
//                           className="w-4 h-4 rounded"
//                         />
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-bold">SL No</th>
//                       {tableColumns.map(col => (
//                         <th key={col.key} className="px-6 py-4 text-left text-sm font-bold">
//                           {col.label}
//                         </th>
//                       ))}
//                       <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {currentPageTrips.length > 0 ? (
//                       currentPageTrips.map((trip, idx) => (
//                         <tr key={trip.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
//                           <td className="px-6 py-4">
//                             <input
//                               type="checkbox"
//                               checked={selectedTrips.includes(trip.id)}
//                               onChange={() => handleSelectTrip(trip.id)}
//                               className="w-4 h-4 rounded"
//                             />
//                           </td>
//                           <td className="px-6 py-4">
//                             <div className="flex items-center gap-3">
//                               <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                                 <span className="text-sm font-bold text-blue-600">{startIndex + idx + 1}</span>
//                               </div>
//                             </div>
//                           </td>
//                           {tableColumns.map(col => (
//                             <td key={col.key} className="px-6 py-4">
//                               <span className="font-medium text-gray-800">
//                                 {typeof trip[col.key] === 'number'
//                                   ? `৳${trip[col.key].toLocaleString()}`
//                                   : (trip[col.key] || 'N/A')}
//                               </span>
//                             </td>
//                           ))}
//                           <td className="px-6 py-4">
//                             <div className="flex items-center justify-center gap-2">
//                               <button
//                                 onClick={() => handleViewTrip(trip)}
//                                 className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
//                                 title="View Details"
//                               >
//                                 <Eye size={16} className="text-blue-600 group-hover:text-blue-700" />
//                               </button>
//                               <button
//                                 onClick={() => handleEditTrip(trip)}
//                                 className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
//                                 title="Edit Trip"
//                               >
//                                 <Edit2 size={16} className="text-green-600 group-hover:text-green-700" />
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteTrip(trip.id)}
//                                 className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
//                                 title="Delete Trip"
//                               >
//                                 <Trash2 size={16} className="text-red-600 group-hover:text-red-700" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={validSelectedFields.length + 3} className="px-6 py-16 text-center">
//                           <div className="flex flex-col items-center gap-4">
//                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
//                               <Truck className="w-8 h-8 text-gray-400" />
//                             </div>
//                             <div>
//                               <p className="text-xl font-semibold text-gray-600 mb-2">No trips found</p>
//                               <p className="text-sm text-gray-500">
//                                 {searchTerm || filterStatus !== 'all'
//                                   ? 'Try adjusting your search or filter criteria'
//                                   : 'No trips available at the moment'
//                                 }
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Enhanced Pagination */}
//           {!loading && !error && (
//             <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div className="text-sm text-gray-600">
//                     Showing <span className="font-bold text-blue-600">{startIndex + 1}-{Math.min(endIndex, filteredTrips.length)}</span> of <span className="font-bold text-gray-800">{totalRecords}</span> trips
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     Page {currentPage} of {totalPages}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all ${
//                       currentPage === 1
//                         ? 'text-gray-400 cursor-not-allowed border-gray-200'
//                         : 'text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//                     }`}
//                   >
//                     <ChevronLeft size={16} />
//                     Previous
//                   </button>

//                   <div className="flex items-center gap-1">
//                     {getPageNumbers().map((page, idx) => (
//                       page === '...' ? (
//                         <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">...</span>
//                       ) : (
//                         <button
//                           key={page}
//                           onClick={() => handlePageChange(page)}
//                           className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                             currentPage === page
//                               ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
//                               : 'border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//                           }`}
//                         >
//                           {page}
//                         </button>
//                       )
//                     ))}
//                   </div>

//                   <button
//                     onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all ${
//                       currentPage === totalPages
//                         ? 'text-gray-400 cursor-not-allowed border-gray-200'
//                         : 'text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
//                     }`}
//                   >
//                     Next
//                     <ChevronRight size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Enhanced View Details Modal */}
//       {showViewModal && viewingTrip && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-full sm:max-w-7xl max-h-[90vh] overflow-auto">
//             <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 text-white px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between sticky top-0 rounded-t-2xl">
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-white/20 rounded-lg">
//                   <Eye className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold">Trip Details</h2>
//                   <p className="text-blue-100 text-sm">View complete trip information</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="hover:bg-white/20 p-2 rounded-xl transition-all transform hover:scale-105"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="p-4 sm:p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {validSelectedFields.map(field => (
//                   <div key={field.key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       {field.label}
//                     </label>
//                     <p className="text-sm text-gray-900 font-medium">
//                       {typeof viewingTrip[field.key] === 'number'
//                         ? `৳${viewingTrip[field.key].toLocaleString()}`
//                         : (viewingTrip[field.key] || 'N/A')}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Enhanced Edit Modal */}
//       {showEditModal && editingTrip && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-full sm:max-w-7xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 text-white px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between sticky top-0 rounded-t-2xl">
//               <div className="flex items-center gap-4">
//                 <div className="p-2 bg-white/20 rounded-lg">
//                   <Edit2 className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold">Edit Trip Information</h2>
//                   <p className="text-blue-100 text-sm">Update trip details and specifications</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="hover:bg-white/20 p-2 rounded-xl transition-all transform hover:scale-105"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="p-4 sm:p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {validSelectedFields.map(field => (
//                   <div key={field.key}>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {field.label}
//                     </label>
//                     {field.key === 'date' || field.key === 'billDate' || field.key === 'createdAt' || field.key === 'updatedAt' ? (
//                       <input
//                         type="date"
//                         value={editingTrip[field.key] || ''}
//                         onChange={(e) => setEditingTrip({ ...editingTrip, [field.key]: e.target.value })}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                       />
//                     ) : field.key === 'status' ? (
//                       <select
//                         value={editingTrip[field.key] || ''}
//                         onChange={(e) => setEditingTrip({ ...editingTrip, [field.key]: e.target.value })}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                       >
//                         <option value="">Select Status</option>
//                         <option value="Completed">Completed</option>
//                         <option value="Pending">Pending</option>
//                         <option value="In Progress">In Progress</option>
//                       </select>
//                     ) : field.key === 'remarks' ? (
//                       <textarea
//                         value={editingTrip[field.key] || ''}
//                         onChange={(e) => setEditingTrip({ ...editingTrip, [field.key]: e.target.value })}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         rows="3"
//                       />
//                     ) : (
//                       <input
//                         type={typeof editingTrip[field.key] === 'number' ? 'number' : 'text'}
//                         value={editingTrip[field.key] || ''}
//                         onChange={(e) => {
//                           const val = typeof editingTrip[field.key] === 'number'
//                             ? Number(e.target.value)
//                             : e.target.value;
//                           setEditingTrip({ ...editingTrip, [field.key]: val });
//                         }}
//                         className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="flex gap-3 mt-6">
//                 <button
//                   onClick={handleUpdateTrip}
//                   className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700"
//                 >
//                   Update Trip
//                 </button>
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, Filter, Download,
  Edit2, Trash2, Eye, Truck, DollarSign,
  TrendingUp, FileText, Printer, AlertCircle,
  ChevronLeft, ChevronRight, X, Loader2, ArrowLeft, User, Package
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

export default function CustomTripList({  }) {
  const { id } = useParams(); // This is customerId from URL
  const navigate = useNavigate();
  const location = useLocation();

  // Use propId if provided, otherwise use urlId


  // State management
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeProductId, setActiveProductId] = useState(null);
  const [productId, setProductId] = useState(null); // ✅ Add productId state
  const [productName, setProductName] = useState('')
  const [customerId, setCustomerId] = useState(null);
  const [trips, setTrips] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setdata] = useState()

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [viewingTrip, setViewingTrip] = useState(null);
  const [chack, setchack] = useState()

  const itemsPerPage = 10;
  const printRef = useRef();

  console.log('Product ID:', productId);
  console.log('Active Product ID:', activeProductId);
  console.log('Customer ID (from params):', id);
  console.log('Customer ID (state):', customerId);
  console.log(productName)
  console.log(data)
  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Get data from navigation state first
        const stateProductId = location.state?.productId;
        const stateProductName = location.state?.productName;
        const stateSelectedCustomer = location.state?.selectedCustomer;
        const stateSuccessMessage = location.state?.successMessage;
        const stateCustomerId = location.state?.customerId;

        // Determine customer ID to use (prioritize state.customerId, then state.selectedCustomer.id, fallback to params)
        const customerIdToUse = stateCustomerId || (stateSelectedCustomer ? stateSelectedCustomer.id : null) || id;

        setCustomerId(customerIdToUse);

        if (stateProductId) {
          setProductId(stateProductId);
          setActiveProductId(stateProductId);
        }
        if (stateProductName) {
          setProductName(stateProductName)
        }
        if (stateSelectedCustomer) {
          setCustomer(stateSelectedCustomer);
        }
        if (stateSuccessMessage) {
          // Handle success message if needed
        }

        if (!customerIdToUse) {
          setError('Customer ID is required');
          setLoading(false);
          return;
        }

        // 1. ✅ Fetch customer details using customerId - only if not already set from state
        if (!customer) {
          const customerRes = await fetch(`${API_BASE_URL}/customer/${customerIdToUse}`);
          if (!customerRes.ok) {
            throw new Error('Customer not found with ID ' + customerIdToUse);
          }
          const customerData = await customerRes.json();
        setchack(customerData)
          setCustomer({
            id: customerData.id,
            name: customerData.customerName || customerData.name || 'Unknown',
            address: customerData.address || ''
          });
        }

        // 2. Fetch all products for this customer
        // 2. Fetch all products for this customer
        const productsRes = await fetch(`${API_BASE_URL}/products?company_id=${customerIdToUse}`);
        const productsData = await productsRes.json();

        const productsArray = Array.isArray(productsData)
          ? productsData
          : (productsData.data || []);

        // ✅ Filter only company_id matched products
        const filteredProducts = productsArray.filter(
          (item) => item.company_id == customerIdToUse
        );

        setProducts(filteredProducts);


        // 3. Set initial active product (use state first, then fallback to latest)
        let finalProductId = stateProductId;
        if (!finalProductId && productsArray.length > 0) {
          finalProductId = productsArray[productsArray.length - 1].id;
        }

        if (finalProductId) {
          setActiveProductId(finalProductId);
          setProductId(finalProductId);
          const selectedProduct = productsArray.find(p => p.id == finalProductId);
          setProductName(selectedProduct?.name || '');
        }

        // 4. Fetch trips for this product
        if (finalProductId) {
          await fetchTrips(finalProductId);
        }

        // 5. Fetch selected fields for active product
        if (finalProductId) {
          await fetchSelectedFields(finalProductId);
        }

      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, location.state]); // ✅ Add location.state as dependency
  console.log(products)
  console.log(chack)
  // Fetch selected fields when active product changes
  const fetchSelectedFields = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/trip-fields`);
      if (response.ok) {
        const data = await response.json();
        setdata(data)

        let fieldsArray = [];
        if (Array.isArray(data)) {
          fieldsArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          fieldsArray = data.data;
        } else if (data.trip_fields && Array.isArray(data.trip_fields)) {
          fieldsArray = data.trip_fields;
        } else if (typeof data === 'object' && data.trip_fields) {
          fieldsArray = Array.isArray(data.trip_fields) ? data.trip_fields : [];
        } else if (data.note && data.note.trip_fields && Array.isArray(data.note.trip_fields)) {
          fieldsArray = data.note.trip_fields;
        }

        setSelectedFields(fieldsArray);
        console.log('Selected fields set to:', fieldsArray);
      } else {
        setSelectedFields([]);
      }
    } catch (err) {
      console.error('Error fetching selected fields:', err);
      setSelectedFields([]);
    }
  };

  // Fetch trips using GET /api/v1/products/:productId/trips
  const fetchTrips = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/trips`);
      if (response.ok) {
        const data = await response.json();
        let tripsArray = [];

        if (Array.isArray(data)) {
          tripsArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          tripsArray = data.data;
        } else if (data.trips && Array.isArray(data.trips)) {
          tripsArray = data.trips;
        } else if (typeof data === 'object' && data.trips) {
          tripsArray = Array.isArray(data.trips) ? data.trips : [];
        } else if (data.note && data.note.trips && Array.isArray(data.note.trips)) {
          tripsArray = data.note.trips;
        }

        // Function to convert snake_case to camelCase
        const toCamelCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

        // Convert all trip objects from snake_case to camelCase
        tripsArray = tripsArray.map(trip => {
          const converted = {};
          for (const key in trip) {
            converted[toCamelCase(key)] = trip[key];
          }
          return converted;
        });

        setTrips(tripsArray);
        console.log('Trips fetched:', tripsArray);
      } else {
        throw new Error(`Failed to fetch trips: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load trips data');
      setTrips([]);
    }
  };

  // Handle product tab change
  const handleProductChange = async (productId) => {
    const selectedProduct = products.find(p => p.id == productId);
    setActiveProductId(productId);
    setProductId(productId);
    setProductName(selectedProduct?.name || '');
    setCurrentPage(1);
    setSelectedTrips([]);
    await fetchSelectedFields(productId);
    await fetchTrips(productId);
  };

  // All possible fields definition
  const allFields = [
    { key: 'id', label: 'ID' },
    { key: 'brandName', label: 'Brand Name' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'category', label: 'Category' },
    { key: 'productName', label: 'Product Name' },
    { key: 'date', label: 'Date' },
    { key: 'tripType', label: 'Trip Type' },
    { key: 'tripNo', label: 'Trip No' },
    { key: 'invoiceNo', label: 'Invoice No' },
    { key: 'vehicleName', label: 'Vehicle Name' },
    { key: 'vehicleNo', label: 'Vehicle No' },
    { key: 'engineNo', label: 'Engine No' },
    { key: 'chassisNo', label: 'Chassis No' },
    { key: 'driverName', label: 'Driver Name' },
    { key: 'driverMobile', label: 'Driver Mobile' },
    { key: 'helperName', label: 'Helper Name' },
    { key: 'truckSize', label: 'Truck Size' },
    { key: 'fuelType', label: 'Fuel Type' },
    { key: 'fuelCost', label: 'Fuel Cost' },
    { key: 'loadPoint', label: 'Load Point' },
    { key: 'unloadPoint', label: 'Unload Point' },
    { key: 'destination', label: 'Destination' },
    { key: 'route', label: 'Route' },
    { key: 'district', label: 'District' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'weight', label: 'Weight' },
    { key: 'transportType', label: 'Transport Type' },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'totalRate', label: 'Total Rate' },
    { key: 'cash', label: 'Cash' },
    { key: 'advance', label: 'Advance' },
    { key: 'due', label: 'Due' },
    { key: 'billNo', label: 'Bill No' },
    { key: 'billDate', label: 'Bill Date' },
    { key: 'paymentType', label: 'Payment Type' },
    { key: 'remarks', label: 'Remarks' },
    { key: 'status', label: 'Status' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'approvedBy', label: 'Approved By' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'updatedAt', label: 'Updated At' }
  ];

  // Get valid selected fields with labels
  const validSelectedFields = selectedFields
    .map(fieldKey => {
      const field = allFields.find(f => f.key === fieldKey);
      if (field) return field;
      return { key: fieldKey, label: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1) };
    })
    .filter(Boolean);

  // Table columns - limit to maximum 10 columns
  const tableColumns = validSelectedFields.slice(0, 10);

  // Get active product info
  const activeProduct = products.find(p => p.id == activeProductId);

  // Filter trips by active product
  const filteredTrips = trips
    .filter(trip => {
      return String(trip.productId) === String(activeProductId);
    })
    .filter(trip => {
      if (!searchTerm) return true;
      return validSelectedFields.some(col =>
        String(trip[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter(trip => {
      if (filterStatus === 'all') return true;
      return (trip.status || '').toLowerCase() === filterStatus.toLowerCase();
    });

  // Calculate stats
  const totalRecords = filteredTrips.length;
  const totalAmount = filteredTrips.reduce((sum, item) =>
    sum + (Number(item.totalAmount) || Number(item.total) || Number(item.totalRate) || 0), 0
  );
  const totalProfit = filteredTrips.reduce((sum, item) =>
    sum + (Number(item.profit) || 0), 0
  );

  const stats = [
    { label: 'Total Records', value: totalRecords.toString(), icon: TrendingUp, color: 'blue' },
    { label: 'Total Amount', value: `৳${totalAmount.toLocaleString()}`, icon: DollarSign, color: 'green' },
    { label: 'Total Profit', value: `৳${totalProfit.toLocaleString()}`, icon: DollarSign, color: 'purple' }
  ];

  // Pagination
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageTrips = filteredTrips.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedTrips([]);
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
    const currentPageIds = currentPageTrips.map(t => t.id);
    const allSelected = currentPageIds.every(id => selectedTrips.includes(id));
    setSelectedTrips(allSelected
      ? selectedTrips.filter(id => !currentPageIds.includes(id))
      : [...new Set([...selectedTrips, ...currentPageIds])]
    );
  };

  const handleSelectTrip = (id) => {
    setSelectedTrips(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  // CRUD handlers
  const handleViewTrip = (trip) => {
    setViewingTrip({ ...trip });
    setShowViewModal(true);
  };

  const handleEditTrip = (trip) => {
    setEditingTrip({ ...trip });
    setShowEditModal(true);
  };

  const handleUpdateTrip = async () => {
    try {
      // Function to convert camelCase to snake_case
      const toSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

      // Convert editingTrip from camelCase to snake_case for API
      const payload = {};
      for (const key in editingTrip) {
        payload[toSnakeCase(key)] = editingTrip[key];
      }

      const response = await fetch(`${API_BASE_URL}/products/${productId}/trips/${editingTrip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update trip');

      // Update the trip in the local state immediately
      setTrips(trips.map(t => t.id === editingTrip.id ? editingTrip : t));
      setShowEditModal(false);
      setEditingTrip(null);

      // Refresh trips from API to ensure consistency
      await fetchTrips(productId);
    } catch (err) {
      console.error('Error updating trip:', err);
      alert('Failed to update trip');
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/trips/${tripId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete trip');

      // Remove the trip from local state immediately
      setTrips(trips.filter(t => t.id !== tripId));

      // Refresh trips from API to ensure consistency
      await fetchTrips(productId);
    } catch (err) {
      console.error('Error deleting trip:', err);
      alert('Failed to delete trip');
    }
  };

  // Export functions
  const exportToExcel = () => {
    const data = selectedTrips.length > 0
      ? filteredTrips.filter(t => selectedTrips.includes(t.id))
      : filteredTrips;

    const worksheet = XLSX.utils.json_to_sheet(data.map(t => {
      const row = { 'Product': activeProduct?.name || '' };
      tableColumns.forEach(col => {
        row[col.label] = t[col.key] || '';
      });
      return row;
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trips');
    XLSX.writeFile(workbook, `${activeProduct?.name || 'trips'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = selectedTrips.length > 0
      ? filteredTrips.filter(t => selectedTrips.includes(t.id))
      : filteredTrips;

    doc.setFontSize(18);
    doc.text(`${activeProduct?.name || 'Trip'} Records`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Customer: ${customer?.name || ''}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 36);

    const tableData = data.map(t => {
      const row = [activeProduct?.name || ''];
      tableColumns.forEach(col => {
        const value = t[col.key];
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

    doc.save(`${activeProduct?.name || 'trips'}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };
console.log(customerId)
  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedTrips([]);
  }, [searchTerm, filterStatus, activeProductId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={64} className="mx-auto mb-4 text-blue-600 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
          <p className="text-gray-600">Fetching trip data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Fields Selected</h2>
          <p className="text-gray-600 mb-4">Please configure trip fields for {activeProduct?.name || 'this product'}</p>
          <button
            onClick={() => navigate(`/customer/${id}/trip-field`, {
              state: {
                selectedCustomer: customer,
                productName: activeProduct?.name,
                productId: activeProductId
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">Custom Trip Management</h1>
              <p className="text-blue-100 text-sm">Manage and monitor custom trips</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Category Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {products.map(product => (
            <button
              key={product.id}
              onClick={() => handleProductChange(product.id)}
              className={`px-4 py-4 font-semibold text-sm transition-all whitespace-nowrap ${activeProductId == product.id
                  ? 'bg-blue-900 text-white border-b-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {product.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color === 'blue' ? 'from-blue-500 to-blue-600' : stat.color === 'green' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} rounded-xl shadow-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : 'text-purple-600'}`}>
                    +5%
                  </span>
                  <div className="text-xs text-gray-500">vs last month</div>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              </div>
              <p className="text-xs text-gray-500">All time records</p>
            </div>
          ))}
        </div>

        {/* Enhanced Main Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Enhanced Action Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Custom Trip Records</h2>
                  <p className="text-gray-600">Manage all your custom trips in one place</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/add-trip/${productId}`, {
                    state: {
                      productId: productId,
                      productName: productName,
                      customerName:chack.note.customerName,
                      selectedCustomer: customer,
                      customerId: customerId
                    }
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Trip
                </button>
                <button
                  onClick={() => navigate(`/customer/${productId}/bill`,{
                        state: {
                      productId: productId,
                      productName: productName,
                      selectedCustomer: customer,
                      customerId: customerId,
                      customerName:chack.note.customerName
                    }
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <ArrowLeft size={18} />
                  Bill
                </button>
              </div>
            </div>

            {/* Customer & Product Info */}
            <div className="mb-6 p-4 bg-white rounded-xl border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Customer:</span>
                      <span className="font-semibold text-gray-800 ml-2">{chack.note.customerName}</span>
                    </div>
                  </div>
                )}
                {activeProduct && (
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-600">Product:</span>
                      <span className="font-semibold text-gray-800 ml-2">{productName}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] sm:min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by trip details, vehicle, driver, or any field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-3 border-2 rounded-xl transition-all ${
                    showFilters
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <Filter size={18} />
                  <span className="font-medium">Filters</span>
                </button>

                {/* Enhanced Export Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all font-medium">
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 border-2 border-gray-200 hidden group-hover:block z-20">
                    <button
                      onClick={exportToExcel}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 transition-colors"
                    >
                      <FileText size={16} className="text-green-600" />
                      <div>
                        <div className="font-medium text-gray-800">Export to Excel</div>
                        <div className="text-xs text-gray-500">Download as .xlsx file</div>
                      </div>
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 transition-colors"
                    >
                      <FileText size={16} className="text-red-600" />
                      <div>
                        <div className="font-medium text-gray-800">Export to PDF</div>
                        <div className="text-xs text-gray-500">Download as .pdf file</div>
                      </div>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center gap-3 transition-colors"
                    >
                      <Printer size={16} className="text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-800">Print Report</div>
                        <div className="text-xs text-gray-500">Print current view</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading trips...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="px-6 py-12 text-center">
              <div className="text-red-600 mb-4">
                <AlertCircle size={48} className="mx-auto mb-3 text-red-300" />
                <p className="text-lg font-medium">Error loading trips</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Enhanced Table */}
          {!loading && !error && (
            <div className="overflow-hidden" ref={printRef}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold">
                        <input
                          type="checkbox"
                          checked={currentPageTrips.length > 0 && currentPageTrips.every(t => selectedTrips.includes(t.id))}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold">SL No</th>
                      {tableColumns.map(col => (
                        <th key={col.key} className="px-6 py-4 text-left text-sm font-bold">
                          {col.label}
                        </th>
                      ))}
                      <th className="px-6 py-4 text-center text-sm font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentPageTrips.length > 0 ? (
                      currentPageTrips.map((trip, idx) => (
                        <tr key={trip.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedTrips.includes(trip.id)}
                              onChange={() => handleSelectTrip(trip.id)}
                              className="w-4 h-4 rounded"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-blue-600">{startIndex + idx + 1}</span>
                              </div>
                            </div>
                          </td>
                          {tableColumns.map(col => (
                            <td key={col.key} className="px-6 py-4">
                              <span className="font-medium text-gray-800">
                                {typeof trip[col.key] === 'number'
                                  ? `৳${trip[col.key].toLocaleString()}`
                                  : (trip[col.key] || 'N/A')}
                              </span>
                            </td>
                          ))}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewTrip(trip)}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                                title="View Details"
                              >
                                <Eye size={16} className="text-blue-600 group-hover:text-blue-700" />
                              </button>
                              <button
                                onClick={() => handleEditTrip(trip)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                                title="Edit Trip"
                              >
                                <Edit2 size={16} className="text-green-600 group-hover:text-green-700" />
                              </button>
                              <button
                                onClick={() => handleDeleteTrip(trip.id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                title="Delete Trip"
                              >
                                <Trash2 size={16} className="text-red-600 group-hover:text-red-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={validSelectedFields.length + 3} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <Truck className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xl font-semibold text-gray-600 mb-2">No trips found</p>
                              <p className="text-sm text-gray-500">
                                {searchTerm || filterStatus !== 'all'
                                  ? 'Try adjusting your search or filter criteria'
                                  : 'No trips available at the moment'
                                }
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Enhanced Pagination */}
          {!loading && !error && (
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-bold text-blue-600">{startIndex + 1}-{Math.min(endIndex, filteredTrips.length)}</span> of <span className="font-bold text-gray-800">{totalRecords}</span> trips
                  </div>
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed border-gray-200'
                        : 'text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                              : 'border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed border-gray-200'
                        : 'text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced View Details Modal */}
      {showViewModal && viewingTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-full sm:max-w-7xl max-h-[90vh] overflow-auto">
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 text-white px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between sticky top-0 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Trip Details</h2>
                  <p className="text-blue-100 text-sm">View complete trip information</p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="hover:bg-white/20 p-2 rounded-xl transition-all transform hover:scale-105"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {validSelectedFields.map(field => (
                  <div key={field.key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <p className="text-sm text-gray-900 font-medium">
                      {typeof viewingTrip[field.key] === 'number'
                        ? `৳${viewingTrip[field.key].toLocaleString()}`
                        : (viewingTrip[field.key] || 'N/A')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Edit Modal */}
      {showEditModal && editingTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-full sm:max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 text-white px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between sticky top-0 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Edit2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Edit Trip Information</h2>
                  <p className="text-blue-100 text-sm">Update trip details and specifications</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="hover:bg-white/20 p-2 rounded-xl transition-all transform hover:scale-105"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {validSelectedFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {field.key === 'date' || field.key === 'billDate' || field.key === 'createdAt' || field.key === 'updatedAt' ? (
                      <input
                        type="date"
                        value={editingTrip[field.key] || ''}
                        onChange={(e) => setEditingTrip({ ...editingTrip, [field.key]: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    ) : field.key === 'status' ? (
                      <select
                        value={editingTrip[field.key] || ''}
                        onChange={(e) => setEditingTrip({ ...editingTrip, [field.key]: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">Select Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                      </select>
                    ) : field.key === 'remarks' ? (
                      <textarea
                        value={editingTrip[field.key] || ''}
                        onChange={(e) => setEditingTrip({ ...editingTrip, [field.key]: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={typeof editingTrip[field.key] === 'number' ? 'number' : 'text'}
                        value={editingTrip[field.key] || ''}
                        onChange={(e) => {
                          const val = typeof editingTrip[field.key] === 'number'
                            ? Number(e.target.value)
                            : e.target.value;
                          setEditingTrip({ ...editingTrip, [field.key]: val });
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateTrip}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg hover:from-blue-800 hover:to-blue-700"
                >
                  Update Trip
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
