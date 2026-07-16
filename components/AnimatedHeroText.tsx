import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const heroContent = [
  {
    id: 1,
    main: "Bangun Tidur Kepala Pusing? Pegal?",
    highlight: "Sakit Pinggang? Leher Kaku?"
  },
  {
    id: 2,
    main: "Bukan Salah Badanmu.",
    highlight: "Masalahnya ada di Matras mu."
  },
  {
    id: 3,
    main: "Upgrade ke 'Matras Sehat'",
    highlight: "'Tulang Aman', Tidur Nyaman"
  }
];

const AnimatedHeroText: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    // PERBAIKAN 1: Gunakan min-h agar tinggi menyesuaikan jika teks panjang di HP
    <div className="relative min-h-[200px] flex items-center justify-start">
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full text-left"
        >
          {/* PERBAIKAN 2: Styling Teks Utama */}
          <h1 className="font-bold text-white leading-tight">
            {/* Main Text: Putih */}
            <span className="block text-3xl md:text-5xl lg:text-6xl mb-2">
              {heroContent[index].main}
            </span>
            
            {/* Highlight Text: Biru Muda (Agar kontras) */}
            <span className="block text-3xl md:text-5xl lg:text-6xl text-blue-200">
              {heroContent[index].highlight}
            </span>
          </h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedHeroText;