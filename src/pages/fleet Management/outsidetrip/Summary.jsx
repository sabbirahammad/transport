import React, { useState, useRef } from 'react';
import {
  Search, Filter, Download, RefreshCw,
  TrendingUp, FileText, Printer, AlertCircle,
  Truck, Activity, DollarSign, Calendar,
  BarChart3, PieChart, Star, Award, Zap
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Summary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const printRef = useRef();

  // API base URL
  const API_BASE_URL = 'http://192.168.0.106:8080/api/v1';

  // Summary state
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available vehicles and months for filtering
  const [vehicles, setVehicles] = useState([]);
  const [months, setMonths] = useState([]);

  // Fetch summary data
  const fetchSummary = async (vehicleNumber, month) => {
    if (!vehicleNumber || !month) return;

    try {
      setLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/vehicles/${encodeURIComponent(vehicleNumber)}/months/${encodeURIComponent(month)}/summary`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Summary API Response:', data);

      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err.message);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available vehicles
  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicle?page=1&page_size=1000`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const vehiclesData = data.vehicles || data.data || data.results || [];
      setVehicles(vehiclesData.map(v => ({
        number: v.vehicle_no || v.vehicle_number,
        name: v.vehicle_name
      })));
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  // Generate months for the current year and previous years
  const generateMonths = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const months = [];

    for (let year = currentYear; year >= currentYear - 2; year--) {
      for (let month = 12; month >= 1; month--) {
        const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
        months.push(`${monthName} ${year}`);
      }
    }

    setMonths(months);
  };

  React.useEffect(() => {
    fetchVehicles();
    generateMonths();
  }, []);

  React.useEffect(() => {
    if (selectedVehicle && selectedMonth) {
      fetchSummary(selectedVehicle, selectedMonth);
    }
  }, [selectedVehicle, selectedMonth]);

  const stats = summary ? [
    {
      label: 'Total Rent',
      value: summary.total_rent?.toLocaleString() || '0',
      icon: DollarSign,
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
      description: 'Total rent earned'
    },
    {
      label: 'Total Advance',
      value: summary.total_advance?.toLocaleString() || '0',
      icon: TrendingUp,
      color: 'green',
      bgGradient: 'from-green-500 to-green-600',
      description: 'Total advance paid'
    },
    {
      label: 'Total Trip Cost',
      value: summary.total_trip_cost?.toLocaleString() || '0',
      icon: Activity,
      color: 'orange',
      bgGradient: 'from-orange-500 to-orange-600',
      description: 'Total trip costs'
    },
    {
      label: 'Trip Count',
      value: summary.trip_count?.toString() || '0',
      icon: Truck,
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600',
      description: 'Number of trips'
    }
  ] : [];

  // Export to Excel
  const exportToExcel = () => {
    if (!summary) return;

    const dataToExport = [{
      'Vehicle Number': summary.vehicle_number,
      'Month': summary.month,
      'Total Rent': summary.total_rent,
      'Total Advance': summary.total_advance,
      'Total Trip Cost': summary.total_trip_cost,
      'Total Diesel': summary.total_diesel,
      'Total Extra Cost': summary.total_extra_cost,
      'Total Diesel Taka': summary.total_diesel_taka,
      'Total Commission': summary.total_commission,
      'Trip Count': summary.trip_count
    }];

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicle Summary');
    XLSX.writeFile(workbook, `vehicle_summary_${summary.vehicle_number}_${summary.month}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    if (!summary) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Vehicle Monthly Summary', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = [
      ['Vehicle Number', summary.vehicle_number],
      ['Month', summary.month],
      ['Total Rent', `৳${summary.total_rent?.toLocaleString() || '0'}`],
      ['Total Advance', `৳${summary.total_advance?.toLocaleString() || '0'}`],
      ['Total Trip Cost', `৳${summary.total_trip_cost?.toLocaleString() || '0'}`],
      ['Total Diesel', summary.total_diesel?.toString() || '0'],
      ['Total Extra Cost', `৳${summary.total_extra_cost?.toLocaleString() || '0'}`],
      ['Total Diesel Taka', `৳${summary.total_diesel_taka?.toLocaleString() || '0'}`],
      ['Total Commission', `৳${summary.total_commission?.toLocaleString() || '0'}`],
      ['Trip Count', summary.trip_count?.toString() || '0']
    ];

    autoTable(doc, {
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [37, 99, 235] },
        1: { fillColor: [240, 240, 240] }
      }
    });

    doc.save(`vehicle_summary_${summary.vehicle_number}_${summary.month}.pdf`);
  };

  // Print functionality
  const handlePrint = () => {
    if (!summary) return;

    const printContent = printRef.current.cloneNode(true);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Vehicle Monthly Summary</title>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">Vehicle Monthly Summary</h1>
              <p className="text-blue-100 text-sm">View monthly summary by vehicle and month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-8">
        {/* Enhanced Stats Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${stat.bgGradient} rounded-xl shadow-lg`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${stat.trend?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend || '+0'}%
                    </span>
                    <div className="text-xs text-gray-500">vs last month</div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                </div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Main Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Enhanced Action Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Monthly Summary</h2>
                  <p className="text-gray-600">Select vehicle and month to view summary</p>
                </div>
              </div>
              {summary && (
                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-500">Vehicle: {summary.vehicle_number}</p>
                    <p className="text-sm text-gray-500">Month: {summary.month}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Search and Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] sm:min-w-[300px] relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search vehicles..."
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

                {summary && (
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
                )}
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.filter(v =>
                      v.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      v.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((vehicle, idx) => (
                      <option key={idx} value={vehicle.number}>
                        {vehicle.number} - {vehicle.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Month</option>
                    {months.map((month, idx) => (
                      <option key={idx} value={month}>{month}</option>
                    ))}
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
                <span>Loading summary...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="px-6 py-12 text-center">
              <div className="text-red-600 mb-4">
                <AlertCircle size={48} className="mx-auto mb-3 text-red-300" />
                <p className="text-lg font-medium">Error loading summary</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => selectedVehicle && selectedMonth && fetchSummary(selectedVehicle, selectedMonth)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Summary Display */}
          {!loading && !error && summary && (
            <div className="p-4 sm:p-8" ref={printRef}>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Summary Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="text-blue-600" size={20} />
                      <span className="font-medium text-gray-700">Vehicle Number</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{summary.vehicle_number}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="text-green-600" size={20} />
                      <span className="font-medium text-gray-700">Month</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{summary.month}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="text-purple-600" size={20} />
                      <span className="font-medium text-gray-700">Trip Count</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{summary.trip_count}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="text-blue-600" size={20} />
                      <span className="font-medium text-gray-700">Total Rent</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">৳{summary.total_rent?.toLocaleString()}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="text-green-600" size={20} />
                      <span className="font-medium text-gray-700">Total Advance</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">৳{summary.total_advance?.toLocaleString()}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="text-orange-600" size={20} />
                      <span className="font-medium text-gray-700">Total Trip Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">৳{summary.total_trip_cost?.toLocaleString()}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="text-yellow-600" size={20} />
                      <span className="font-medium text-gray-700">Total Diesel</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{summary.total_diesel}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="text-red-600" size={20} />
                      <span className="font-medium text-gray-700">Total Extra Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">৳{summary.total_extra_cost?.toLocaleString()}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="text-purple-600" size={20} />
                      <span className="font-medium text-gray-700">Total Diesel Taka</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">৳{summary.total_diesel_taka?.toLocaleString()}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="text-indigo-600" size={20} />
                      <span className="font-medium text-gray-700">Total Commission</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">৳{summary.total_commission?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Selection State */}
          {!loading && !error && !summary && (
            <div className="px-6 py-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-600 mb-2">Select Vehicle and Month</p>
                  <p className="text-sm text-gray-500">
                    Choose a vehicle and month from the filters above to view the summary
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}