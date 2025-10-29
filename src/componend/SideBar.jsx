import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, Users, ShoppingCart, Package, FileText, BarChart3,
  Settings, Bell, Mail, Calendar, Image, Video, Music, File,
  CreditCard, Tag, Truck, Store, UserCircle, Lock, Database,
  Layers, Code, Palette, Globe, MessageSquare, Heart, Star,
  TrendingUp, DollarSign, Search, ChevronDown, ChevronRight,
  Menu, X, LogOut, HelpCircle
} from 'lucide-react';

export default function Deshboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    {
      id: 'users',
      label: 'Fleet Management',
      icon: Users,
      submenu: [
        { id: 'Customer', label: 'Customer', icon: Users, path: '/customerproduct' },
        { id: 'Vehicle', label: 'Vehicle Management', icon: Users, path: '/vehicle' },
        { id: 'Premiafix', label: 'Premiafix', icon: Truck, path: '/brand/premiaflix' },
        { id: 'Mahindra', label: 'Mahindra', icon: Truck, path: '/mahindra' },
        { id: 'Hatim', label: 'Hatim', icon: Truck, path: '/brand/hatim' },
      ]
    },
    {
      id: 'hr',
      label: 'HR Management',
      icon: ShoppingCart,
      submenu: [
        { id: 'imployee', label: 'Imployee List', icon: Package, path: '/imployee' },
        { id: 'driver', label: 'Driver List', icon: ShoppingCart, path: '/driver' },
        { id: 'helper', label: 'Helper List', icon: Tag, path: '/helper' },
        { id: 'mechanic', label: 'Mechanic', icon: Database, path: '/mechanic' },
        { id: 'accountant', label: 'Accountant', icon: Database, path: '/addtrip' },
        { id: 'manager', label: 'Manager List', icon: Database, path: '/customers' },
      ]
    },
    {
      id: 'purchase',
      label: 'Purchase Management',
      icon: FileText,
      submenu: [
        { id: 'purchaselist', label: 'Purchase List', icon: FileText, path: '/purchase' },
        { id: 'pages', label: 'Pages', icon: File, path: '/pages' },
        { id: 'media', label: 'Media Library', icon: Image, path: '/media' },
        { id: 'comments', label: 'Comments', icon: MessageSquare, path: '/comments' }
      ]
    },
    {
      id: 'customer',
      label: 'Customer',
      icon: Users,
      submenu: [
        { id: 'customer-list', label: 'Customer List', icon: Users, path: '/customer' },
        { id: 'Pricing', label: 'Customer Pricing', icon: BarChart3, path: '/customer-pricing' },
        { id: 'Dealer', label: 'Dealer List', icon: DollarSign, path: '/dealer' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      submenu: [
        { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
        { id: 'traffic', label: 'Traffic', icon: TrendingUp, path: '/traffic' },
        { id: 'revenue', label: 'Revenue', icon: DollarSign, path: '/revenue' }
      ]
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: Mail,
      submenu: [
        { id: 'messages', label: 'Messages', icon: Mail, path: '/messages' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
        { id: 'chat', label: 'Live Chat', icon: MessageSquare, path: '/chat' }
      ]
    },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
    {
      id: 'finance',
      label: 'Finance',
      icon: CreditCard,
      submenu: [
        { id: 'payments', label: 'Payments', icon: CreditCard, path: '/payments' },
        { id: 'invoices', label: 'Invoices', icon: FileText, path: '/invoices' },
        { id: 'transactions', label: 'Transactions', icon: DollarSign, path: '/transactions' }
      ]
    },
    {
      id: 'shipping',
      label: 'Shipping',
      icon: Truck,
      submenu: [
        { id: 'shipments', label: 'Shipments', icon: Truck, path: '/shipments' },
        { id: 'carriers', label: 'Carriers', icon: Store, path: '/carriers' }
      ]
    },
    {
      id: 'design',
      label: 'Design',
      icon: Palette,
      submenu: [
        { id: 'themes', label: 'Themes', icon: Palette, path: '/themes' },
        { id: 'templates', label: 'Templates', icon: Layers, path: '/templates' },
        { id: 'customization', label: 'Customization', icon: Code, path: '/customization' }
      ]
    },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star, path: '/reviews' },
    { id: 'favorites', label: 'Favorites', icon: Heart, path: '/favorites' },
    { id: 'seo', label: 'SEO Tools', icon: Globe, path: '/seo' },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      submenu: [
        { id: 'general', label: 'General', icon: Settings, path: '/settings' },
        { id: 'security', label: 'Security', icon: Lock, path: '/security' },
        { id: 'integrations', label: 'Integrations', icon: Layers, path: '/integrations' }
      ]
    }
  ];

  const toggleMenu = (id) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filterMenuItems = (items) => {
    if (!searchQuery) return items;
    
    return items.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
      const submenuMatch = item.submenu?.some(sub => 
        sub.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return labelMatch || submenuMatch;
    });
  };

  const filteredMenuItems = filterMenuItems(menuItems);

  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-gray-900 to-gray-950 text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
              A
            </div>
            <span className="font-bold text-xl tracking-tight">AdminPro</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-800 rounded-xl transition-colors duration-200"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/70 backdrop-blur-sm rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 transition-all"
            />
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {filteredMenuItems.map((item) => (
          <div key={item.id} className="mb-1">
            {/* Parent Menu Item */}
            {item.path && !item.submenu ? (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 shadow-lg'
                      : 'hover:bg-gray-800/50'
                  } ${collapsed ? 'justify-center px-0' : ''}`
                }
                title={collapsed ? item.label : ''}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg text-gray-400 group-hover:text-white">
                    <item.icon size={20} className="flex-shrink-0" />
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-medium text-gray-300">
                      {item.label}
                    </span>
                  )}
                </div>
              </NavLink>
            ) : (
              <button
                onClick={() => toggleMenu(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group hover:bg-gray-800/50 ${
                  collapsed ? 'justify-center px-0' : ''
                }`}
                title={collapsed ? item.label : ''}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg text-gray-400 group-hover:text-white">
                    <item.icon size={20} className="flex-shrink-0" />
                  </div>
                  {!collapsed && (
                    <span className="text-sm font-medium text-gray-300">
                      {item.label}
                    </span>
                  )}
                </div>
                {!collapsed && item.submenu && (
                  <div className={`transition-transform duration-300 ${
                    expandedMenus[item.id] ? 'rotate-180' : ''
                  }`}>
                    <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-300" />
                  </div>
                )}
              </button>
            )}

            {/* Submenu */}
            {!collapsed && item.submenu && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedMenus[item.id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-4 mt-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <NavLink
                      key={subItem.id}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                          isActive
                            ? "bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500"
                            : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                        }`
                      }
                    >
                      <subItem.icon size={16} className="flex-shrink-0" />
                      <span>{subItem.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        {!collapsed ? (
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-800 transition-colors text-sm text-gray-300 hover:text-white">
              <HelpCircle size={18} />
              <span>Help & Support</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-900/30 text-red-400 transition-colors text-sm">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button className="w-full p-2.5 rounded-xl hover:bg-gray-800 transition-colors" title="Help">
              <HelpCircle size={20} className="text-gray-400" />
            </button>
            <button className="w-full p-2.5 rounded-xl hover:bg-red-900/30 text-red-400 transition-colors" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}