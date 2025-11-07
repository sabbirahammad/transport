// FeatureCardSection.jsx
import React from 'react';
import { Rocket, ThumbsUp, Shield, UserCheck } from 'lucide-react';
import i1 from '../../assets/i1.jpeg'

export default function FeatureCardSection() {
  const features = [
    {
      icon: <Rocket className="w-8 h-8 text-blue-700" />,
      title: "দ্রুত বুকিং",
      description: "মাত্র কয়েক সেকেন্ডে আপনার ট্রিপ বুক করুন"
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-blue-700" />,
      title: "সেরা রেট",
      description: "মার্কেটের তুলনায় সেরা রেট উপভোগ করুন"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-700" />,
      title: "সুরক্ষিত ডেলিভারি",
      description: "আপনার মালামালের নিরাপদ ডেলিভারি নিশ্চিত করুন"
    },
    {
      icon: <UserCheck className="w-8 h-8 text-blue-700" />,
      title: "ভেরিফাইড ড্রাইভার",
      description: "অসংখ্য ভেরিফাইড ড্রাইভার রয়েছে আপনার ট্রিপের অপেক্ষায়"
    }
  ];

  return (
    <div className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-white text-sm font-medium uppercase tracking-wider">ট্রাক ভাড়া করার সবচেয়ে সহজ উপায়</h2>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left Big Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-800 to-blue-700 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-4">
              যেকোনো প্রয়োজনে <br />
              মালামাল পরিবহন হবে নিশ্চিতে
            </h3>
            
            {/* Image Placeholder - Replace with actual image */}
            <div className="mt-6 flex items-center justify-center">
              <img 
                src={i1} 
                alt="Mobile App Screenshot"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Right 4 Cards */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800 hover:bg-gray-700 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-700"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-white font-semibold text-lg">{feature.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}