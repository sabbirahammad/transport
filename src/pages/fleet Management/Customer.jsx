// import React, { useState, useEffect } from 'react';
// import { Sparkles, Plus, Users, Loader2, AlertCircle } from 'lucide-react';

// export default function Customer() {
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [formData, setFormData] = useState({ name: '', address: '' });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // API base URL - Same as in CustomerList
//   const API_BASE_URL = '';

//   // Fetch customers from API
//   const fetchCustomers = async (page = 1, pageSize = 20) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(`${API_BASE_URL}/customer?page=${page}&page_size=${pageSize}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Handle different response formats (array or paginated object)
//       if (Array.isArray(data)) {
//         const transformedData = data.map(item => ({
//           id: item.id,
//           name: item.customerName || item.name || '',
//           address: item.address || ''
//         }));
//         setCustomers(transformedData);
//       } else if (data && data.data && Array.isArray(data.data)) {
//         const transformedData = data.data.map(item => ({
//           id: item.id,
//           name: item.customerName || item.name || '',
//           address: item.address || ''
//         }));
//         setCustomers(transformedData);
//       } else {
//         setCustomers([]);
//       }
//     } catch (err) {
//       console.error('Error fetching customers:', err);
//       setError(`Failed to fetch customers: ${err.message}`);
//       setCustomers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create customer API
//   const createCustomer = async (customerData) => {
//     try {
//       setIsSubmitting(true);
//       const response = await fetch(`${API_BASE_URL}/customer`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           customer_name: customerData.name,
//           address: customerData.address,
//           mobile: '',
//           email: '',
//           opening_balance: '0',
//           status: 'Active'
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       return result;
//     } catch (err) {
//       console.error('Error creating customer:', err);
//       throw err;
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const handleCreateClick = () => {
//     setShowCreateModal(true);
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.name && formData.address) {
//       try {
//         await createCustomer(formData);
//         setFormData({ name: '', address: '' });
//         setShowCreateModal(false);
//         fetchCustomers(); // Refresh the list
//       } catch (err) {
//         alert('Failed to create customer: ' + err.message);
//       }
//     }
//   };

//   const allCards = [
//     ...customers.map(customer => ({ ...customer, type: 'customer' })),
//     { name: 'Create New Customer', type: 'create', id: 'create' }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//       {/* Animated Background Logo */}
//       <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
//         <div className="text-white text-9xl font-bold transform rotate-12 scale-150 animate-pulse">
//           CUSTOMERS
//         </div>
//       </div>
      
//       {/* Floating particles effect */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full bg-white opacity-10"
//             style={{
//               width: Math.random() * 6 + 2 + 'px',
//               height: Math.random() * 6 + 2 + 'px',
//               left: Math.random() * 100 + '%',
//               top: Math.random() * 100 + '%',
//               animation: `float ${Math.random() * 10 + 10}s linear infinite`,
//               animationDelay: Math.random() * 5 + 's'
//             }}
//           />
//         ))}
//       </div>

//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0) translateX(0); }
//           25% { transform: translateY(-20px) translateX(10px); }
//           50% { transform: translateY(-40px) translateX(-10px); }
//           75% { transform: translateY(-20px) translateX(5px); }
//         }
        
//         @keyframes shimmer {
//           0% { background-position: -1000px 0; }
//           100% { background-position: 1000px 0; }
//         }
        
//         .shimmer {
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
//           background-size: 1000px 100%;
//           animation: shimmer 3s infinite;
//         }
//       `}</style>

//       <div className="relative z-10 container mx-auto px-4 py-16">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 mb-4">
//             <Sparkles className="text-yellow-400" size={32} />
//             <h1 className="text-5xl md:text-6xl font-bold text-white">
//               Our Customers
//             </h1>
//             <Sparkles className="text-yellow-400" size={32} />
//           </div>
//           <p className="text-xl text-purple-200">Excellence in Every Service</p>
//         </div>

//         {/* Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {allCards.map((item, index) => (
//             <div
//               key={item.id || index}
//               onMouseEnter={() => setHoveredCard(index)}
//               onMouseLeave={() => setHoveredCard(null)}
//               onClick={item.type === 'create' ? handleCreateClick : undefined}
//               className={`
//                 relative group cursor-pointer transition-all duration-500 transform
//                 ${hoveredCard === index ? 'scale-105 z-20' : 'scale-100'}
//                 ${hoveredCard !== null && hoveredCard !== index ? 'scale-95 opacity-70' : 'opacity-100'}
//               `}
//             >
//               <div
//                 className={`
//                   relative h-64 rounded-2xl shadow-2xl overflow-hidden
//                   ${item.type === 'create' 
//                     ? 'bg-gradient-to-br from-green-500 to-green-600' 
//                     : 'bg-white'}
//                   ${hoveredCard === index ? 'shadow-purple-500/50' : ''}
//                   transition-all duration-500
//                 `}
//               >
//                 {/* Shimmer effect on hover */}
//                 {hoveredCard === index && (
//                   <div className="absolute inset-0 shimmer" />
//                 )}
                
//                 {/* Card Content */}
//                 <div className="relative h-full flex flex-col items-center justify-center p-8">
//                   {item.type === 'create' ? (
//                     <>
//                       <Plus className="text-white text-6xl mb-4" />
//                       <div className="text-2xl font-bold text-center text-white">
//                         {item.name}
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mb-4">
//                         {item.name?.charAt(0) || '?'}
//                       </div>
//                       <div className="text-2xl font-bold text-center text-black">
//                         {item.name}
//                       </div>
//                       <div className="text-sm text-gray-600 text-center mt-2">
//                         {item.address}
//                       </div>
//                     </>
//                   )}
                   
//                   {/* Decorative elements */}
//                   <div className={`
//                     mt-6 w-20 h-1 rounded-full transition-all duration-300
//                     ${item.type === 'create' 
//                       ? 'bg-white' 
//                       : 'bg-gradient-to-r from-purple-500 to-pink-500'}
//                     ${hoveredCard === index ? 'w-32' : 'w-20'}
//                   `} />
                   
//                   {hoveredCard === index && (
//                     <div className={`
//                       mt-4 text-sm font-medium animate-pulse
//                       ${item.type === 'create' ? 'text-white' : 'text-gray-600'}
//                     `}>
//                       {item.type === 'create' ? 'Add New Customer' : 'View Details'}
//                     </div>
//                   )}
//                 </div>

//                 {/* Corner accent */}
//                 <div className={`
//                   absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 rotate-45
//                   ${item.type === 'create' 
//                     ? 'bg-white/20' 
//                     : 'bg-gradient-to-br from-purple-200 to-pink-200'}
//                   transition-all duration-500
//                   ${hoveredCard === index ? 'scale-150 opacity-70' : 'scale-100 opacity-50'}
//                 `} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer accent */}
//         <div className="text-center mt-16">
//           <div className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
//             <p className="text-white font-medium">Premium Customers, Exceptional Value</p>
//           </div>
//         </div>
//       </div>

//       {/* Create Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//             <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 flex items-center justify-between">
//               <h2 className="text-xl font-semibold">Create New Customer</h2>
//               <button onClick={() => setShowCreateModal(false)} className="hover:bg-green-700 p-1 rounded">
//                 ×
//               </button>
//             </div>
//             <form onSubmit={handleFormSubmit} className="p-6">
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleFormChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   required
//                 />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Path (Address)</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleFormChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                   required
//                 />
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//                 >
//                   {isSubmitting && <Loader2 size={16} className="animate-spin" />}
//                   {isSubmitting ? 'Creating...' : 'Create'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateModal(false)}
//                   className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BrandCards() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  
  const brands = [
    { name: 'Rancon', color: 'white', path: '/Triplist' },
    { name: 'ACI', color: 'black', path: '/brand/aci' },
    { name: 'Premiaflix', color: 'white', path: '/brand/premiaflix' },
    { name: 'Mahindra Tractor', color: 'black', path: '/brand/mahindra' },
    { name: 'Hatim', color: 'white', path: '/brand/hatim' }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="text-white text-9xl font-bold transform rotate-12 scale-150 animate-pulse">
          BRANDS
        </div>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: Math.random() * 5 + 's'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(5px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="text-yellow-400" size={32} />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Our Brands
            </h1>
            <Sparkles className="text-yellow-400" size={32} />
          </div>
          <p className="text-xl text-purple-200">Excellence in Every Product</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {brands.map((brand, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(brand.path)}
              className={`
                relative group cursor-pointer transition-all duration-500 transform
                ${hoveredCard === index ? 'scale-105 z-20' : 'scale-100'}
                ${hoveredCard !== null && hoveredCard !== index ? 'scale-95 opacity-70' : 'opacity-100'}
              `}
            >
              <div
                className={`
                  relative h-64 rounded-2xl shadow-2xl overflow-hidden
                  ${brand.color === 'white' 
                    ? 'bg-white' 
                    : 'bg-gradient-to-br from-black via-gray-900 to-black'}
                  ${hoveredCard === index ? 'shadow-purple-500/50' : ''}
                  transition-all duration-500
                `}
              >
                {/* Shimmer effect on hover */}
                {hoveredCard === index && (
                  <div className="absolute inset-0 shimmer" />
                )}
                
                {/* Card Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-8">
                  <div className={`
                    text-4xl font-bold text-center transition-all duration-300
                    ${brand.color === 'white' ? 'text-black' : 'text-white'}
                    ${hoveredCard === index ? 'scale-110' : 'scale-100'}
                  `}>
                    {brand.name}
                  </div>
                  
                  {/* Decorative elements */}
                  <div className={`
                    mt-6 w-20 h-1 rounded-full transition-all duration-300
                    ${brand.color === 'white' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-yellow-400 to-orange-500'}
                    ${hoveredCard === index ? 'w-32' : 'w-20'}
                  `} />
                  
                  {hoveredCard === index && (
                    <div className={`
                      mt-4 text-sm font-medium animate-pulse
                      ${brand.color === 'white' ? 'text-gray-600' : 'text-gray-300'}
                    `}>
                      Trusted Quality
                    </div>
                  )}
                </div>

                {/* Corner accent */}
                <div className={`
                  absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 rotate-45
                  ${brand.color === 'white' 
                    ? 'bg-gradient-to-br from-purple-200 to-pink-200' 
                    : 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30'}
                  transition-all duration-500
                  ${hoveredCard === index ? 'scale-150 opacity-70' : 'scale-100 opacity-50'}
                `} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer accent */}
        <div className="text-center mt-16">
          <div className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <p className="text-white font-medium">Premium Brands, Exceptional Value</p>
          </div>
        </div>
      </div>
    </div>
  );
}
