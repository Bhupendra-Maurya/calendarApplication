
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMonthName } from '../utils/dateHelpers';

interface HeaderProps {
  currentMonth: {
    year: number;
    month: number;
    id: string;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ currentMonth }) => {
  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentMonth?.id || 'default'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentMonth ? `${getMonthName(currentMonth.month)} ${currentMonth.year}` : 'Calendar'}
        </motion.h1>
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;