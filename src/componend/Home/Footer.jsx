import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react';

// কাস্টম লিংক কলাম ডেটা
const servicesLinks = [
  { 
    title: "Creative Design", 
    links: ["Branding", "UI/UX", "Motion Graphics", "Photography", "Videography"] 
  },
  { 
    title: "Development", 
    links: ["Web Dev", "Mobile Apps", "Backend", "Data Analytics", "Cloud Services"] 
  },
  { 
    title: "Digital Marketing", 
    links: ["SEO/SEM", "Social Media", "Email Mktg", "PPC Campaigns", "Content Strategy"] 
  },
];

const navigationLinks = [
  { 
    title: "MAP", 
    links: ["Route Planner", "Coverage", "Logistics Hubs"] 
  },
  { 
    title: "LEARN", 
    links: ["Our Blog", "Tutorials", "Webinars", "Case Studies", "FAQ"] 
  },
  { 
    title: "COMPANY", 
    links: ["About Us", "Our Team", "Careers", "Press", "Contact"] 
  },
];

// ছোট লিংক আইটেম কম্পোনেন্ট
const FooterLinkItem = ({ text }) => (
  <a 
    href="#" 
    className="text-xs text-gray-400 hover:text-blue-400 transition-colors duration-200 block py-[2px]"
    onClick={(e) => e.preventDefault()}
  >
    {text}
  </a>
);

// কলাম গ্রুপ কম্পোনেন্ট
const LinkColumnGroup = ({ title, data }) => (
  <div className="mb-6 lg:mb-0">
    <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-700 pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 gap-y-2">
      {data.map((col, index) => (
        <div key={index} className="mb-4">
          <p className="text-sm font-medium text-blue-400 mb-1">{col.title}</p>
          <ul className="space-y-0.5">
            {col.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <FooterLinkItem text={link} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);


// মূল ফুটার কম্পোনেন্ট
const FooterComponent = () => {
  return (
    <footer 
      className="relative text-white pt-16 pb-8 font-sans border-t border-gray-800 overflow-hidden min-h-[1000px]"
    >
      {/* Background Image (Clear, no blur) */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=80)`,
        }}
      ></div>
      
      {/* আধুনিক, গাঢ় ওভারলে: কালোকে প্রধান্য দিয়ে সামান্য নীল আভা */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/80 to-blue-900/40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- টপ সেকশন: CTA বা মেইন হেডিং --- */}
        <div className="text-center mb-20 border-b border-gray-800 pb-8 mt-32">
          {/* 🚀 মেইন হেডিং: বড় সাইজ, বোল্ড ফন্ট, আধুনিক লেটার স্পেসিং */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-400 mb-4 drop-shadow-2xl tracking-tight">
            Your creative team's creative team™
          </h2>
          {/* 📝 সাব-টেক্সট: বড় সাইজ, ভালো কনট্রাস্ট, ওয়াইডার ম্যাক্স-উইথ */}
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto font-light">
            Let's collaborate and bring your next big project to life with our expert team.
          </p>
          <button 
            className="inline-flex items-center px-5 py-2.5 text-sm bg-blue-700 text-gray-300 font-semibold rounded-full hover:bg-blue-600 transition duration-300 shadow-lg shadow-blue-700/50"
            onClick={() => console.log('যোগাযোগ বাটনে ক্লিক করা হয়েছে')}
          >
            Contact Us <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
        
        {/* 🎯 এখানে দুটি বর্ডার যোগ করা হয়েছে */}
        <div className="flex justify-between items-center mb-10 mt-10"> {/* mb-10 লিংক কলাম থেকে বর্ডারের দূরত্ব */}
          <div className="flex-grow border-t border-gray-700"></div> {/* বাম বর্ডার */}
          <div className="w-8"></div> {/* মাঝখানে ফাঁকা */}
          <div className="flex-grow border-t border-gray-700"></div> {/* ডান বর্ডার */}
        </div>

        {/* --- মিডল সেকশন: লিঙ্ক কলামস --- */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-32"> 
          
          {/* সার্ভিসেস কলাম গ্রুপ */}
          <LinkColumnGroup title="Services" data={servicesLinks} />
          
          {/* নেভিগেশন কলাম গ্রুপ */}
          <LinkColumnGroup title="Navigation" data={navigationLinks} />
          
        </div>

        {/* --- বটম সেকশন: কপিরাইট এবং সোশ্যাল মিডিয়া --- */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          
          {/* লোগো ও কপিরাইট */}
          <div className="text-center md:text-left mb-3 md:mb-0">
            <h4 className="text-xl font-bold text-blue-400">SuperSide</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              © {new Date().getFullYear()} SuperSide. All rights reserved.
            </p>
          </div>

          {/* সোশ্যাল মিডিয়া আইকন */}
          <div className="flex space-x-3">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
              <a 
                key={index}
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200 p-1.5 border border-gray-700 hover:border-blue-700 rounded-full"
                aria-label={Icon.name}
                onClick={(e) => e.preventDefault()}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

// অ্যাপ কম্পোনেন্ট, যা রেন্ডার করবে
const App = () => <FooterComponent />;
export default App;