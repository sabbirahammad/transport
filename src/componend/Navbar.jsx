import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Search, User, ChevronDown, Menu, X, Truck, BarChart3, Users, ShoppingCart, FileText, Settings, LogOut
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: BarChart3 },
    { label: 'Vehicles', path: '/vehicle', icon: Truck },
    { label: 'Trips', path: '/Triplist', icon: Truck },
    { label: 'Purchase', path: '/purchase', icon: ShoppingCart },
    { label: 'Profile', path: '/settings', icon: User },
  ];

  const profileOptions = [
    { label: 'Account', path: '/settings' },
    { label: 'Settings', path: '/settings' },
    { label: 'Logout', action: () => console.log('Logout') },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleScroll = () => {
      // Check scroll on the main content area
      const mainContent = document.querySelector('.flex-1.overflow-auto');
      if (mainContent) {
        const scrollTop = mainContent.scrollTop;
        setIsScrolled(scrollTop > 0);
      }
    };

    // Use a timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      const mainContent = document.querySelector('.flex-1.overflow-auto');
      if (mainContent) {
        mainContent.addEventListener('scroll', handleScroll);
        // Check initial state
        handleScroll();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const mainContent = document.querySelector('.flex-1.overflow-auto');
      if (mainContent) {
        mainContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <nav className={`shadow-lg border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'bg-blue-700' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md">
                T
              </div>
            </div>
            <span className={`ml-3 text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-gray-800'}`}>TransportPro</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? isScrolled ? 'bg-blue-800 text-white shadow-sm' : 'bg-blue-100 text-blue-700 shadow-sm'
                      : isScrolled ? 'text-white hover:bg-blue-800 hover:text-blue-100' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`
                }
              >
                <item.icon size={18} className="mr-2" />
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search vehicles or trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                aria-label="Search"
              />
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isScrolled ? 'text-white hover:bg-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
            >
              <User size={20} className="mr-2" />
              <span className="hidden md:block text-sm font-medium">Profile</span>
              <ChevronDown size={16} className="ml-2" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                {profileOptions.map((option) => (
                  <div key={option.label}>
                    {option.path ? (
                      <NavLink
                        to={option.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {option.label}
                      </NavLink>
                    ) : (
                      <button
                        onClick={() => {
                          option.action();
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {option.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isScrolled ? 'text-white hover:bg-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search vehicles or trips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Search"
                />
              </div>
            </div>
            {/* Mobile Menu Items */}
            <div className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isScrolled ? 'bg-blue-800 text-white shadow-sm' : 'bg-blue-100 text-blue-700 shadow-sm'
                        : isScrolled ? 'text-white hover:bg-blue-800 hover:text-blue-100' : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;