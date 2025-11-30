import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_TEXTS = [
  {
    id: 1,
    text: "Bangun Tidur Pegal?",
    highlight: "Sakit Pinggang & Leher Kaku?"
  },
  {
    id: 2,
    text: "Bukan salah badanmu.",
    highlight: "Masalahnya ada di kasurmu."
  },
  {
    id: 3,
    text: "Upgrade ke 'Kasur Sehat'.",
    highlight: "Tulang Aman, Tidur Nyaman."
  }
];

const AnimatedHeroText: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % HERO_TEXTS.length);
    }, 4000); // 4 seconds per slide

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[180px] md:min-h-[220px] flex items-center justify-center text-center mb-6">
      <AnimatePresence mode="wait">
        <motion.h1
          key={HERO_TEXTS[index].id}
          initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
        >
          {HERO_TEXTS[index].text}
          <span className="block text-blue-100 mt-2">
            {HERO_TEXTS[index].highlight}
          </span>
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedHeroText;