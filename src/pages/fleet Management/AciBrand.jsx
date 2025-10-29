// AciBrand.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Plus, Filter, Download,
  Edit2, Trash2, Eye, Truck, DollarSign,
  TrendingUp, FileText, Printer, AlertCircle,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function AciBrand() {
  const [activeCategory, setActiveCategory] = useState('motorcycle');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [viewingTrip, setViewingTrip] = useState(null);
  const itemsPerPage = 10;
  const printRef = useRef();

  // Motorcycle Data (using TripList structure)
  const [motorcycleTrips, setMotorcycleTrips] = useState([
    {
      id: 1,
      date: '2024-06-10',
      vehicleNo: 'DHK-METRO-1234',
      dealerName: 'Motorcycle Dealer Ltd',
      doSi: 'DO-2024-001',
      coU: 'CO-2024-001',
      destination: 'Chittagong',
      bike: 25,
      unloadCharge: 1500,
      vehicleRateWithVatTax: 13500,
      totalAmount: 15000,
      extraCost: 0,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-06-11',
      vehicleNo: 'DHK-METRO-5678',
      dealerName: 'Bike World Ltd',
      doSi: 'DO-2024-002',
      coU: 'CO-2024-002',
      destination: 'Sylhet',
      bike: 18,
      unloadCharge: 1200,
      vehicleRateWithVatTax: 10800,
      totalAmount: 12000,
      extraCost: 200,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-06-12',
      vehicleNo: 'DHK-METRO-9012',
      dealerName: 'Speed Motors',
      doSi: 'DO-2024-003',
      coU: 'CO-2024-003',
      destination: 'Khulna',
      bike: 32,
      unloadCharge: 1800,
      vehicleRateWithVatTax: 16200,
      totalAmount: 18000,
      extraCost: 0,
      status: 'Pending'
    }
  ]);

  // Music Data
  const [musicTrips, setMusicTrips] = useState([
    {
      id: 1,
      date: '2024-06-10',
      vehicleNo: 'DHK-METRO-5678',
      dealerName: 'Music Instruments Ltd',
      doSi: 'DO-2024-002',
      coU: 'CO-2024-002',
      destination: 'Sylhet',
      bike: 100,
      unloadCharge: 800,
      vehicleRateWithVatTax: 7200,
      totalAmount: 8000,
      extraCost: 0,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-06-11',
      vehicleNo: 'DHK-METRO-3456',
      dealerName: 'Harmony Music Store',
      doSi: 'DO-2024-009',
      coU: 'CO-2024-009',
      destination: 'Rajshahi',
      bike: 75,
      unloadCharge: 600,
      vehicleRateWithVatTax: 5400,
      totalAmount: 6000,
      extraCost: 100,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-06-12',
      vehicleNo: 'DHK-METRO-7890',
      dealerName: 'Sound Gallery',
      doSi: 'DO-2024-010',
      coU: 'CO-2024-010',
      destination: 'Barisal',
      bike: 50,
      unloadCharge: 500,
      vehicleRateWithVatTax: 4500,
      totalAmount: 5000,
      extraCost: 0,
      status: 'Pending'
    }
  ]);

  // Tyre Data
  const [tyreTrips, setTyreTrips] = useState([
    {
      id: 1,
      date: '2024-06-10',
      vehicleNo: 'DHK-METRO-9012',
      dealerName: 'Tyre World Ltd',
      doSi: 'DO-2024-003',
      coU: 'CO-2024-003',
      destination: 'Khulna',
      bike: 50,
      unloadCharge: 1200,
      vehicleRateWithVatTax: 10800,
      totalAmount: 12000,
      extraCost: 0,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-06-11',
      vehicleNo: 'DHK-METRO-1357',
      dealerName: 'Premium Tyres Ltd',
      doSi: 'DO-2024-011',
      coU: 'CO-2024-011',
      destination: 'Rangpur',
      bike: 80,
      unloadCharge: 1500,
      vehicleRateWithVatTax: 13500,
      totalAmount: 15000,
      extraCost: 300,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-06-12',
      vehicleNo: 'DHK-METRO-2468',
      dealerName: 'Wheel Masters',
      doSi: 'DO-2024-012',
      coU: 'CO-2024-012',
      destination: 'Mymensingh',
      bike: 65,
      unloadCharge: 1100,
      vehicleRateWithVatTax: 9900,
      totalAmount: 11000,
      extraCost: 0,
      status: 'Pending'
    }
  ]);

  // Yamaha Lube & Parts Data
  const [yamahaTrips, setYamahaTrips] = useState([
    {
      id: 1,
      date: '2024-06-10',
      vehicleNo: 'DHK-METRO-3456',
      dealerName: 'Yamaha Parts Center',
      doSi: 'DO-2024-004',
      coU: 'CO-2024-004',
      destination: 'Rajshahi',
      bike: 200,
      unloadCharge: 1000,
      vehicleRateWithVatTax: 9000,
      totalAmount: 10000,
      extraCost: 0,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-06-11',
      vehicleNo: 'DHK-METRO-8642',
      dealerName: 'Bike Parts Pro',
      doSi: 'DO-2024-013',
      coU: 'CO-2024-013',
      destination: 'Comilla',
      bike: 150,
      unloadCharge: 800,
      vehicleRateWithVatTax: 7200,
      totalAmount: 8000,
      extraCost: 200,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-06-12',
      vehicleNo: 'DHK-METRO-9753',
      dealerName: 'Motor Accessories Ltd',
      doSi: 'DO-2024-014',
      coU: 'CO-2024-014',
      destination: 'Bogura',
      bike: 120,
      unloadCharge: 700,
      vehicleRateWithVatTax: 6300,
      totalAmount: 7000,
      extraCost: 0,
      status: 'Pending'
    }
  ]);

  // Tractor Data
  const [tractorTrips, setTractorTrips] = useState([
    {
      id: 1,
      date: '2024-06-10',
      vehicleNo: 'DHK-METRO-7890',
      dealerName: 'Agri Machinery Ltd',
      doSi: 'DO-2024-005',
      coU: 'CO-2024-005',
      destination: 'Rangpur',
      bike: 5,
      unloadCharge: 2500,
      vehicleRateWithVatTax: 22500,
      totalAmount: 25000,
      extraCost: 0,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-06-11',
      vehicleNo: 'DHK-METRO-1598',
      dealerName: 'Farm Equipment Co',
      doSi: 'DO-2024-015',
      coU: 'CO-2024-015',
      destination: 'Dinajpur',
      bike: 8,
      unloadCharge: 3000,
      vehicleRateWithVatTax: 27000,
      totalAmount: 30000,
      extraCost: 500,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-06-12',
      vehicleNo: 'DHK-METRO-3579',
      dealerName: 'Agro Tech Ltd',
      doSi: 'DO-2024-016',
      coU: 'CO-2024-016',
      destination: 'Pabna',
      bike: 6,
      unloadCharge: 2200,
      vehicleRateWithVatTax: 19800,
      totalAmount: 22000,
      extraCost: 0,
      status: 'Pending'
    }
  ]);

  // Harvester Data
  const [harvesterTrips, setHarvesterTrips] = useState([
    {
      id: 1,
      date: '2024-06-10',
      vehicleNo: 'DHK-METRO-2468',
      dealerName: 'Farm Equipment Ltd',
      doSi: 'DO-2024-006',
      coU: 'CO-2024-006',
      destination: 'Barisal',
      bike: 3,
      unloadCharge: 3500,
      vehicleRateWithVatTax: 31500,
      totalAmount: 35000,
      extraCost: 0,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-06-11',
      vehicleNo: 'DHK-METRO-4826',
      dealerName: 'Harvest Pro Ltd',
      doSi: 'DO-2024-017',
      coU: 'CO-2024-017',
      destination: 'Jessore',
      bike: 4,
      unloadCharge: 4000,
      vehicleRateWithVatTax: 36000,
      totalAmount: 40000,
      extraCost: 800,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-06-12',
      vehicleNo: 'DHK-METRO-6137',
      dealerName: 'Agri Solutions',
      doSi: 'DO-2024-018',
      coU: 'CO-2024-018',
      destination: 'Kushtia',
      bike: 2,
      unloadCharge: 2800,
      vehicleRateWithVatTax: 25200,
      totalAmount: 28000,
      extraCost: 0,
      status: 'Pending'
    }
  ]);

  // Spanner & Wrench Data
  const [spannerTrips, setSpannerTrips] = useState([
    {
      id: 1,
      date: '2024-06-10',
      vehicleNo: 'DHK-METRO-1357',
      dealerName: 'Tools & Equipment Ltd',
      doSi: 'DO-2024-007',
      coU: 'CO-2024-007',
      destination: 'Mymensingh',
      bike: 75,
      unloadCharge: 600,
      vehicleRateWithVatTax: 5400,
      totalAmount: 6000,
      extraCost: 0,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-06-11',
      vehicleNo: 'DHK-METRO-7264',
      dealerName: 'Industrial Tools Co',
      doSi: 'DO-2024-019',
      coU: 'CO-2024-019',
      destination: 'Tangail',
      bike: 90,
      unloadCharge: 800,
      vehicleRateWithVatTax: 7200,
      totalAmount: 8000,
      extraCost: 150,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-06-12',
      vehicleNo: 'DHK-METRO-8395',
      dealerName: 'Workshop Supplies Ltd',
      doSi: 'DO-2024-020',
      coU: 'CO-2024-020',
      destination: 'Narayanganj',
      bike: 60,
      unloadCharge: 500,
      vehicleRateWithVatTax: 4500,
      totalAmount: 5000,
      extraCost: 0,
      status: 'Pending'
    }
  ]);

  // Extra Bill Data
  const [extraBillTrips, setExtraBillTrips] = useState([
    {
      id: 1,
      date: '2024-06-10',
      vehicleNo: 'DHK-METRO-8642',
      dealerName: 'General Trading Ltd',
      doSi: 'DO-2024-008',
      coU: 'CO-2024-008',
      destination: 'Comilla',
      bike: 150,
      unloadCharge: 900,
      vehicleRateWithVatTax: 8100,
      totalAmount: 9000,
      extraCost: 0,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-06-11',
      vehicleNo: 'DHK-METRO-9517',
      dealerName: 'Commercial Goods Ltd',
      doSi: 'DO-2024-021',
      coU: 'CO-2024-021',
      destination: 'Feni',
      bike: 200,
      unloadCharge: 1200,
      vehicleRateWithVatTax: 10800,
      totalAmount: 12000,
      extraCost: 300,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-06-12',
      vehicleNo: 'DHK-METRO-1470',
      dealerName: 'Business Supplies Co',
      doSi: 'DO-2024-022',
      coU: 'CO-2024-022',
      destination: 'Noakhali',
      bike: 100,
      unloadCharge: 700,
      vehicleRateWithVatTax: 6300,
      totalAmount: 7000,
      extraCost: 0,
      status: 'Pending'
    }
  ]);

  const categories = {
    motorcycle: { name: 'Motorcycle', data: motorcycleTrips, setData: setMotorcycleTrips },
    music: { name: 'Music', data: musicTrips, setData: setMusicTrips },
    tyre: { name: 'Tyre', data: tyreTrips, setData: setTyreTrips },
    yamaha: { name: 'Yamaha Lube & Parts', data: yamahaTrips, setData: setYamahaTrips },
    tractor: { name: 'Tractor', data: tractorTrips, setData: setTractorTrips },
    harvester: { name: 'Harvester', data: harvesterTrips, setData: setHarvesterTrips },
    spanner: { name: 'Spanner & Wrench', data: spannerTrips, setData: setSpannerTrips },
    extraBill: { name: 'Extra Bill', data: extraBillTrips, setData: setExtraBillTrips }
  };

  const currentTrips = categories[activeCategory].data;
  const setCurrentTrips = categories[activeCategory].setData;

  // Stats
  const totalTrips = currentTrips.length;
  const completedTrips = currentTrips.filter(t => t.status === 'Completed').length;
  const totalRevenue = currentTrips.reduce((sum, t) => sum + t.bodyFare + t.fuelCost, 0);

  const stats = [
    { label: 'Total Trips', value: totalTrips.toString(), icon: Truck, color: 'blue', trend: '+2' },
    { label: 'Completed', value: completedTrips.toString(), icon: TrendingUp, color: 'green', trend: '+1' },
    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'orange', trend: '+15' }
  ];

  // Handlers
  const handleEditTrip = (trip) => {
    setEditingTrip({ ...trip });
    setShowEditModal(true);
  };

  const handleViewTrip = (trip) => {
    setViewingTrip({ ...trip });
    setShowViewModal(true);
  };

  const handleUpdateTrip = () => {
    setCurrentTrips(currentTrips.map(t => t.id === editingTrip.id ? editingTrip : t));
    setShowEditModal(false);
    setEditingTrip(null);
  };

  const handleDeleteTrip = (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setCurrentTrips(currentTrips.filter(t => t.id !== id));
    }
  };

  const handleSelectAll = () => {
    const currentPageTrips = getCurrentPageTrips();
    const currentPageIds = currentPageTrips.map(t => t.id);
    const allSelected = currentPageIds.every(id => selectedTrips.includes(id));

    if (allSelected) {
      setSelectedTrips(selectedTrips.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedTrips([...new Set([...selectedTrips, ...currentPageIds])]);
    }
  };

  const handleSelectTrip = (id) => {
    if (selectedTrips.includes(id)) {
      setSelectedTrips(selectedTrips.filter(tid => tid !== id));
    } else {
      setSelectedTrips([...selectedTrips, id]);
    }
  };

  const filteredTrips = currentTrips.filter(trip => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = trip.vehicleNo.toLowerCase().includes(search) ||
      trip.dealerName.toLowerCase().includes(search) ||
      trip.destination.toLowerCase().includes(search) ||
      trip.doSi.toLowerCase().includes(search);

    const matchesStatus = filterStatus === 'all' || trip.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getCurrentPageTrips = () => filteredTrips.slice(startIndex, endIndex);
  const currentPageTrips = getCurrentPageTrips();

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

  useEffect(() => {
    setCurrentPage(1);
    setSelectedTrips([]);
  }, [activeCategory, searchTerm, filterStatus]);

  // Export Functions
  const exportToExcel = () => {
    const data = selectedTrips.length > 0
      ? currentTrips.filter(t => selectedTrips.includes(t.id))
      : currentTrips;

    const headers = ['ID', 'Date', 'Dealer', 'Category', 'Truck Number', 'DO(SI)', 'From', 'Destination', 'Quantity', 'Vehicle Rate', 'Unload Charge', 'Total', 'Status'];

    const worksheet = XLSX.utils.json_to_sheet(data.map(t => ({
      'ID': t.id,
      'Date': t.date,
      'Dealer': t.dealerName,
      'Category': categories[activeCategory].name,
      'Truck Number': t.vehicleNo,
      'DO(SI)': t.doSi,
      'From': 'Dhaka',
      'Destination': t.destination,
      'Quantity': t.bike,
      'Vehicle Rate': t.vehicleRateWithVatTax,
      'Unload Charge': t.unloadCharge,
      'Total': t.totalAmount,
      'Status': t.status
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trips');
    XLSX.writeFile(workbook, `aci_${activeCategory}_trips.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = selectedTrips.length > 0
      ? currentTrips.filter(t => selectedTrips.includes(t.id))
      : currentTrips;

    doc.setFontSize(18);
    doc.text(`ACI Brand Records - ${categories[activeCategory].name}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = data.map(t => [
      t.id,
      t.date,
      t.dealerName,
      t.destination,
      t.vehicleNo,
      `৳${t.totalAmount.toLocaleString()}`,
      t.status
    ]);

    doc.autoTable({
      head: [['ID', 'Date', 'Dealer', 'Destination', 'Truck No', 'Total Amount', 'Status']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 }
    });

    doc.save(`aci_${activeCategory}_trips.pdf`);
  };

  const handlePrint = () => {
    const printContent = printRef.current.cloneNode(true);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ACI Brand List - ${categories[activeCategory].name}</title>
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
      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 px-8 shadow-sm">
        <div className="flex flex-wrap gap-1">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-4 font-semibold text-sm transition-all whitespace-nowrap ${
                activeCategory === key
                  ? 'bg-blue-900 text-white border-b-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <stat.icon className={`text-${stat.color}-600`} size={20} />
                </div>
                <span className={`text-xs font-semibold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}%
                </span>
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
              <div className="flex items-center gap-2">
                <Truck className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-800">
                  {categories[activeCategory].name} Trips
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/create-trip/${activeCategory}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  <span className="font-medium">Add Trip</span>
                </Link>
                <Link
                  to={`/brand/aci/bill/${activeCategory}`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={18} />
                  <span className="font-medium">Bill</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by vehicle no, dealer, destination..."
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
                  <Filter size={18} />
                  <span>Filters</span>
                </button>

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

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto" ref={printRef}>
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={currentPageTrips.length > 0 && currentPageTrips.every(t => selectedTrips.includes(t.id))}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">SL No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Dealer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Truck Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">DO(SI)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">From</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Destination</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Vehicle Rate</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Unload Charge</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentPageTrips.length > 0 ? (
                  currentPageTrips.map((trip, idx) => (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedTrips.includes(trip.id)}
                          onChange={() => handleSelectTrip(trip.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3 text-sm">{trip.date}</td>
                      <td className="px-4 py-3 text-sm">{trip.dealerName}</td>
                      <td className="px-4 py-3 text-sm">{categories[activeCategory].name}</td>
                      <td className="px-4 py-3 text-sm font-medium">{trip.vehicleNo}</td>
                      <td className="px-4 py-3 text-sm">{trip.doSi}</td>
                      <td className="px-4 py-3 text-sm">Dhaka</td>
                      <td className="px-4 py-3 text-sm">{trip.destination}</td>
                      <td className="px-4 py-3 text-sm">{trip.bike}</td>
                      <td className="px-4 py-3 text-sm">৳{trip.vehicleRateWithVatTax.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">৳{trip.unloadCharge.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trip.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewTrip(trip)}
                            className="p-1.5 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye size={16} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleEditTrip(trip)}
                            className="p-1.5 hover:bg-green-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={16} className="text-green-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrip(trip.id)}
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
                    <td colSpan="14" className="px-4 py-12 text-center text-gray-500">
                      <AlertCircle size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">No trips found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredTrips.length)}</strong> of <strong>{filteredTrips.length}</strong>
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

      {/* View Modal */}
      {showViewModal && viewingTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Trip Details</h2>
              <button onClick={() => setShowViewModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(viewingTrip).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {typeof value === 'number' && key !== 'id' && key !== 'quantity' ? `৳${value.toLocaleString()}` : value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <h2 className="text-xl font-semibold">Edit Trip</h2>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={editingTrip.date}
                    onChange={(e) => setEditingTrip({...editingTrip, date: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle No</label>
                  <input
                    type="text"
                    value={editingTrip.vehicleNo}
                    onChange={(e) => setEditingTrip({...editingTrip, vehicleNo: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dealer Name</label>
                  <input
                    type="text"
                    value={editingTrip.dealerName}
                    onChange={(e) => setEditingTrip({...editingTrip, dealerName: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DO (SI)</label>
                  <input
                    type="text"
                    value={editingTrip.doSi}
                    onChange={(e) => setEditingTrip({...editingTrip, doSi: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CO (U)</label>
                  <input
                    type="text"
                    value={editingTrip.coU}
                    onChange={(e) => setEditingTrip({...editingTrip, coU: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    value={editingTrip.destination}
                    onChange={(e) => setEditingTrip({...editingTrip, destination: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={editingTrip.bike}
                    onChange={(e) => setEditingTrip({...editingTrip, bike: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unload Charge</label>
                  <input
                    type="number"
                    value={editingTrip.unloadCharge}
                    onChange={(e) => setEditingTrip({...editingTrip, unloadCharge: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Rate (with VAT+Tax)</label>
                  <input
                    type="number"
                    value={editingTrip.vehicleRateWithVatTax}
                    onChange={(e) => setEditingTrip({...editingTrip, vehicleRateWithVatTax: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Extra Cost</label>
                  <input
                    type="number"
                    value={editingTrip.extraCost || 0}
                    onChange={(e) => setEditingTrip({...editingTrip, extraCost: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                  <input
                    type="number"
                    value={editingTrip.totalAmount}
                    onChange={(e) => setEditingTrip({...editingTrip, totalAmount: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editingTrip.status}
                    onChange={(e) => setEditingTrip({...editingTrip, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
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