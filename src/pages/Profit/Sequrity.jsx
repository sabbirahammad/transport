import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, ArrowLeft, AlertCircle, CheckCircle, Truck, Shield, Eye, EyeOff
} from 'lucide-react';

export default function Security() {
  const navigate = useNavigate();

  // State for password and UI
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate processing
    setTimeout(() => {
      if (password === 'sabbir') {
        navigate('/profit');
      } else {
        setError('Incorrect password. Please try again.');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Dynamic Transport Truck Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 animate-bounce">
          <Truck className="w-32 h-32 text-green-600" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse">
          <Truck className="w-24 h-24 text-emerald-600 transform rotate-12" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-bounce delay-1000">
          <Truck className="w-28 h-28 text-green-500" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-pulse delay-500">
          <Truck className="w-20 h-20 text-emerald-500 transform -rotate-12" />
        </div>
        {/* Additional truck elements for dynamic effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin opacity-20">
          <Truck className="w-40 h-40 text-green-400" />
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 px-4 sm:px-8 py-4 sm:py-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Security Access</h1>
              <p className="text-green-100 text-sm">Enter password to access profit records</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-8 py-8 sm:py-16">
        <div className="max-w-md mx-auto">
          {/* Security Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Password</h2>
                <p className="text-gray-600">Please provide the access password to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Lock className="inline w-4 h-4 mr-2 text-green-600" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-green-300'
                      }`}
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl transition-all transform hover:scale-105 font-bold text-lg shadow-lg ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Access Profit Records</span>
                    </>
                  )}
                </button>
              </form>

              {/* Help Text */}
              <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-bold text-green-800">Security Notice</h3>
                </div>
                <p className="text-sm text-green-700">
                  This area is restricted. Please enter the correct password to access profit management features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}