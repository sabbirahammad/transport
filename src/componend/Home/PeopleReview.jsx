import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Star } from 'lucide-react';

// রিভিউ ডেটা
const reviewData = [
  {
    id: 1,
    name: "আরিয়ানা ইসলাম",
    title: "টিম লিড",
    review: "অসাধারণ সাপোর্ট এবং একটি শক্তিশালী ফিচার সেট।",
    image: "https://placehold.co/80x80/a5f3fc/1e293b?text=AI",
    rating: 5,
  },
  {
    id: 2,
    name: "মিহির আহমেদ",
    title: "স্টার্টআপ ফাউন্ডার",
    review: "এই পণ্যটি আমাদের কাজের ধারা পরিবর্তন করেছে।",
    image: "https://placehold.co/80x80/f9a8d4/1e293b?text=MA",
    rating: 5,
  },
  {
    id: 3,
    name: "রিনা চাকমা",
    title: "ডিজাইনার",
    review: "সিম্পল, ইউজার-ফ্রেন্ডলি এবং সুন্দর।",
    image: "https://placehold.co/80x80/fcd34d/1e293b?text=RC",
    rating: 5,
  },
];

// স্টার রেটিং
const StarRating = ({ rating }) => (
  <div className="flex items-center space-x-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`}
      />
    ))}
  </div>
);

// কথা বলার অ্যানিমেশন
const AnimatedPerson = ({ statement, delay = 0 }) => {
  const words = statement.split(' ');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    if (currentWordIndex < words.length) {
      const timer = setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentWordIndex, words.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="flex items-center gap-4"
    >
      {/* মানুষের মুখ */}
      <div className="relative">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </motion.div>
        </div>
        {/* মুখের নিচে ছোট ডট অ্যানিমেশন (কথা বলার ইফেক্ট) */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: delay + 0.5 }}
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1"
        >
          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
        </motion.div>
      </div>

      {/* স্পিচ বাবল */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
        className="relative bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none max-w-xs shadow-xl border border-gray-700"
      >
        <div className="text-sm text-gray-300 leading-relaxed">
          {words.slice(0, currentWordIndex).join(' ')}
          {currentWordIndex < words.length && (
            <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse"></span>
          )}
        </div>
        {/* বাবলের টেইল */}
        <div className="absolute left-0 top-3 -translate-x-full w-0 h-0 
          border-t-[12px] border-t-transparent 
          border-r-[16px] border-r-gray-800 
          border-b-[12px] border-b-transparent"></div>
      </motion.div>
    </motion.div>
  );
};

const PeopleTalk = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // ১০ সেকেন্ডে রিভিউ চেঞ্জ
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviewData.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // কথা বলার ডেটা
  const talkStatements = [
    "এটির এপিআই খুবই পরিষ্কার এবং ইন্টিগ্রেশন ছিল সহজ।",
    "অবশেষে এমন একটি টুল পেলাম যা আমাকে বিশৃঙ্খলা ছাড়াই ওভারভিউ দেয়।"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* হেডার */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-3">
            লোকেরা আমাদের সম্পর্কে কী বলে
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            আমাদের গ্রাহকদের অভিজ্ঞতা শুনুন – তারা কেন আমাদের বেছে নিয়েছেন।
          </p>
        </motion.header>

        {/* মেইন কন্টেন্ট: ২ কলাম */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* বাম: ২ জনের কথা বলার অ্যানিমেশন */}
          <div className="space-y-12">
            <AnimatedPerson statement={talkStatements[0]} delay={0.5} />
            <div className="flex justify-end">
              <AnimatedPerson statement={talkStatements[1]} delay={1.2} />
            </div>
          </div>

          {/* ডান: রিভিউ কার্ড – ছোট, রো আকারে, অটো চেঞ্জ */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center lg:text-left">
              গ্রাহকের রিভিউ
            </h3>

            <div className="relative h-28 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReviewIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg flex items-center gap-4 h-full"
                >
                  <img
                    src={reviewData[currentReviewIndex].image}
                    alt={reviewData[currentReviewIndex].name}
                    className="w-14 h-14 rounded-full border-2 border-blue-600 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{reviewData[currentReviewIndex].name}</h4>
                    <p className="text-xs text-blue-400">{reviewData[currentReviewIndex].title}</p>
                    <StarRating rating={reviewData[currentReviewIndex].rating} />
                    <p className="text-gray-400 text-sm italic mt-1 line-clamp-2">
                      "{reviewData[currentReviewIndex].review}"
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ইন্ডিকেটর ডট */}
            <div className="flex justify-center gap-2 mt-4">
              {reviewData.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: i === currentReviewIndex ? 1.4 : 1,
                    backgroundColor: i === currentReviewIndex ? '#3B82F6' : '#4B5563'
                  }}
                  className="w-2 h-2 rounded-full bg-gray-600"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleTalk;