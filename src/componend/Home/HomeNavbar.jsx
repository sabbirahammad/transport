import React, { useState, useEffect } from 'react';
import { Menu, X, Truck, MapPin, Phone, Mail, Globe, MessageCircle, Send } from 'lucide-react';
import i1 from '../../assets/i1.jpeg'
import i2 from '../../assets/i2.jpeg'
import i3 from '../../assets/i3.jpeg'
import i4 from '../../assets/i4.jpeg'

export default function TruckLagbeNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const suggestedMessages = [
    "আমি একটি ট্রাক বুক করতে চাই",
    "মূল্য কত?",
    "ট্রাক মালিক কীভাবে হব?",
    "বিদ্যমান বুকিং এর জন্য সহায়তা"
  ];

  const handleSendMessage = (message) => {
    if (message.trim()) {
      setChatMessages(prev => [...prev, { text: message, sender: 'user' }]);
      setCurrentMessage('');
      // Simulate support response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { text: 'ধন্যবাদ! আপনার প্রশ্নের উত্তর দিচ্ছি।', sender: 'support' }]);
      }, 1000);
    }
  };

  const handleStartChat = () => {
    setChatStarted(true);
    setChatMessages([{ text: 'Hello, how may I help you today?', sender: 'support' }]);
  };

  const heroImages = [
    "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80",
   i1,
   i2
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const navLinks = [
    { id: 'home', label: 'হোম', labelEn: 'Home' },
    { id: 'services', label: 'সার্ভিস', labelEn: 'Services' },
    { id: 'truck-owner', label: 'ট্রাক মালিক', labelEn: 'Truck Owner' },
    { id: 'blog', label: 'ব্লগ', labelEn: 'Blog' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-900 shadow-2xl'
            : 'bg-gray-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setIsChatOpen(!isChatOpen)}>
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">MS TRADING</span>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveLink(link.id)}
                  className={`text-base font-medium transition-all duration-300 ${
                    activeLink === link.id
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Business Login Button */}
              <button className="flex items-center space-x-2 px-4 py-2 text-white hover:text-gray-200 transition-colors">
                <div className="w-5 h-5 border-2 border-white rounded"></div>
                <span className="font-medium">বিজনেস লগইন</span>
              </button>

              {/* Language Selector */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg" 
                    alt="Bangladesh Flag"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-medium">বাংলা</span>
              </button>

              {/* Login Button */}
              <button className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                লগ ইন
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-all"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-6 bg-gray-800 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveLink(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  activeLink === link.id
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="font-medium">{link.label}</span>
              </button>
            ))}

            <div className="pt-4 border-t border-gray-700 space-y-3">
              <button className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 rounded-lg transition-all flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white rounded"></div>
                <span className="font-medium">বিজনেস লগইন</span>
              </button>
              
              <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg" 
                    alt="Bangladesh Flag"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-white font-medium">বাংলা</span>
              </button>

              <button className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all">
                লগ ইন
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Blur Effect */}
        <div className="absolute inset-0 bottom-10">
          <img
            src={heroImages[currentImageIndex]}
            alt="Trucks on highway"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>
{/* Hero Chatbox */}
{isChatOpen && (
<div className="absolute bottom-16 right-10 max-w-sm w-full bg-gradient-to-br from-black/95 to-gray-900/95 rounded-2xl shadow-2xl border border-blue-500/50 overflow-hidden min-h-[300px]">
  {/* Header */}
  <div className="flex items-center justify-between bg-blue-700 px-4 py-3">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
        {/* Replace with your logo */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg"
          alt="Logo"
          className="w-8 h-8 object-cover rounded-full"
        />
      </div>
      <div>
        <h3 className="text-white font-semibold text-sm">ICC Communication</h3>
        <p className="text-green-400 text-xs">online</p>
      </div>
    </div>
    <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-300 transition-all">
      ✕
    </button>
  </div>

  {/* Message Body */}
  <div className="px-4 py-6 space-y-4 bg-black">
    <div className="flex items-start space-x-2">
      <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-sm">
        S
      </div>
      <div className="bg-gray-900 text-white px-4 py-4 rounded-xl shadow-md max-w-xs mb-6">
        <p className="text-sm font-medium">Support Team</p>
        <p className="text-xs mt-2">Hello, how may I help you today?</p>
      </div>
    </div>
  </div>

  {/* Start Chat Button */}
  <div className="px-4 py-3 bg-black flex justify-center">
    <button className="w-full bg-blue-700 text-white font-semibold py-2 rounded-xl hover:bg-blue-800 transition-all shadow-lg">
      Start Chat
    </button>
  </div>

  {/* Footer */}
  <div className="px-4 py-2 text-center text-gray-400 text-xs">
    ⚡ by WaTheta
  </div>
</div>
)}

{/* Customer Service Card */}
<div className="absolute bottom-16 left-10 w-48 bg-gradient-to-br from-blue-700 to-gray-900 rounded-2xl shadow-2xl border border-blue-500/50 p-4">
  <h3 className="text-white font-semibold text-sm">Customer Service</h3>
  <p className="text-gray-300 text-xs mt-2">+880 1234 567890</p>
</div>

{/* WhatsApp Button */}
<div className="absolute bottom-4 right-10">
  <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:bg-blue-800 transition-all hover:scale-110">
    <MessageCircle size={48} />
  </button>
</div>

        {/* Hero Content */}
        

        {/* Truck Search Section */}
       
      </section>

      {/* Additional Content */}

    </div>
  );
}