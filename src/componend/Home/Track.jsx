import React, { useState } from 'react';
import { Aperture, Target, Users, TrendingUp } from 'lucide-react';
import i1 from '../../assets/i1.jpeg'
import i2 from '../../assets/i2.jpeg'
import i3 from '../../assets/i3.jpeg'
import i4 from '../../assets/i4.jpeg'
// ডেটা কাঠামো: কার্ডের বিষয়বস্তু এবং সংশ্লিষ্ট আইকন
const trackData = [
  {
    id: 1,
    title: "দ্রুত প্রজেক্ট ট্র্যাকিং",
    description: "আপনার কাজের অগ্রগতির রিয়েল-টাইম ওভারভিউ পান এবং সময়মতো লক্ষ্য অর্জন করুন।",
    icon: Aperture,
    imagePlaceholder: i1
  },
  {
    id: 2,
    title: "ডেডলাইন ব্যবস্থাপনা",
    description: "গুরুত্বপূর্ণ সময়সীমা বা ডেডলাইন ট্র্যাক করুন যাতে কোনো কাজই মিস না হয়।",
    icon: Target,
    imagePlaceholder: i2
  },
  {
    id: 3,
    title: "টাস্ক বরাদ্দ",
    description: "টিম সদস্যদের মধ্যে কাজগুলি সহজেই বিতরণ করুন এবং তাদের দায়িত্ব বুঝে নিন।",
    icon: Users,
    imagePlaceholder: i3
  },
  {
    id: 4,
    title: "পারফরম্যান্স বিশ্লেষণ",
    description: "ডেটা-ভিত্তিক বিশ্লেষণ ব্যবহার করে আপনার টিমের কাজের পারফরম্যান্স উন্নত করুন।",
    icon: TrendingUp,
    imagePlaceholder: i4
  },
];

// একক কার্ড কম্পোনেন্ট
const TrackCard = ({ item, isReversed }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  // লেআউট নির্ধারণ: কার্ড-ছবি (default) অথবা ছবি-কার্ড (reversed)
  // ছোট করার জন্য এখানে flex-col, lg:flex-row/flex-row-reverse ব্যবহার করা হয়েছে
  const layoutClasses = isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row';

  // হভার এফেক্ট এর জন্য বর্ডার ক্লাস
  // bg-black এর পরিবর্তে bg-gray-800 ব্যবহার করা হয়েছে
  const borderClass = isHovered 
    ? 'border-blue-700 lg:border-l-4 shadow-2xl shadow-blue-700/30' // Shadow stronger on hover
    : 'border-transparent lg:border-l-0 shadow-lg shadow-gray-900/10';

  return (
    <div 
      className={`flex flex-col ${layoutClasses} overflow-hidden rounded-2xl transition-all duration-500 transform ease-in-out bg-gray-800 border border-gray-700 
      group hover:scale-[1.02] ${borderClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: 'transform, box-shadow' }}
    >
      {/* বাম/ডান দিকের কার্ড কন্টেন্ট */}
      <div 
        className={`w-full lg:w-1/2 p-5 md:p-8 text-white flex flex-col justify-center transition-all duration-300`}
      >
        <div className="flex items-center space-x-3 mb-3">
          <Icon className="w-7 h-7 text-blue-400" />
          <h3 className="text-2xl font-bold text-white tracking-wide">{item.title}</h3>
        </div>
        <p className="text-md text-gray-400 leading-relaxed">
          {item.description}
        </p>
        <button 
          className="mt-5 self-start px-4 py-2 text-sm font-medium rounded-full bg-blue-700 hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          onClick={() => console.log(`বিস্তারিত দেখতে চান: ${item.title}`)}
        >
          বিস্তারিত জানুন
        </button>
      </div>

      {/* বাম/ডান দিকের ইমেজ প্লেসহোল্ডার */}
      <div className="w-full lg:w-1/2 min-h-[250px] lg:min-h-0 bg-gray-700 flex items-center justify-center overflow-hidden">
        <img
          src={item.imagePlaceholder}
          alt={`Visual representation for ${item.title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          // প্লেসহোল্ডার ইমেজ লোড না হলে বিকল্প টেক্সট প্রদর্শন
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/0f172a/94a3b8?text=Image+Unavailable"; }}
        />
      </div>
    </div>
  );
};


// মূল কম্পোনেন্ট যা ব্যবহারকারী দেখতে পাবে
const TrackImportant = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-10 lg:p-16 font-sans">
      <header className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-3">
          গুরুত্বপূর্ণ বিষয়গুলো ট্র্যাক করুন
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          আমাদের অনন্য, সরলীকৃত ফিচারগুলোর মাধ্যমে আপনার প্রজেক্টের প্রতিটি ধাপ কার্যকরভাবে পরিচালনা করুন।
        </p>
      </header>

      {/* কন্টেন্টকে কেন্দ্রে এবং ছোট আকারে রাখার জন্য max-width ও centering */}
      <main className="max-w-6xl mx-auto space-y-12 md:space-y-16"> 
        {trackData.map((item, index) => (
          <TrackCard 
            key={item.id} 
            item={item} 
            // রো-ভিত্তিক লেআউট পরিবর্তন 
            isReversed={index % 2 !== 0} 
          />
        ))}
      </main>

    </div>
  );
};

// অ্যাপ কম্পোনেন্ট, যা রেন্ডার করবে
const App = () => <TrackImportant />;
export default App;