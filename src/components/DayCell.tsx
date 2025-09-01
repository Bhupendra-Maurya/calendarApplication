import React from 'react';
import { motion } from 'framer-motion';
import { type JournalEntry, getJournalEntriesForDate, isSameDay } from '../utils/dateHelpers';

interface DayCellProps {
  day: number;
  date: Date;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  journalEntries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
  index: number;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  date,
  isCurrentMonth,
  journalEntries,
  onEntryClick,
  index
}) => {
  const isToday = isSameDay(date, new Date());
  const dayEntries = getJournalEntriesForDate(journalEntries, date);
  
  const cellClassName = [
    'day-cell',
    !isCurrentMonth && 'other-month',
    isToday && 'today'
  ].filter(Boolean).join(' ');

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    
    if (hasHalfStar) {
      stars.push('☆');
    }

    return stars.slice(0, 5);
  };

  return (
    <motion.div 
      className={cellClassName}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.02,
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className="day-number"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.02 + 0.1 }}
      >
        {day}
      </motion.div>
      {dayEntries.map((entry, entryIndex) => (
        <motion.div
          key={entryIndex}
          className="journal-entry"
          onClick={() => onEntryClick(entry)}
          title={entry.description.substring(0, 100) + '...'}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.02 + 0.2 + entryIndex * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.05,
            y: -2,
            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div>{entry.categories[0] || 'Journal'}</div>
          <div className="journal-entry-rating">
            {renderStars(entry.rating).map((star, i) => (
              <span key={i} className="star">{star}</span>
            ))}
            <span style={{ fontSize: '0.6875rem', marginLeft: '0.25rem' }}>
              {entry.rating}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DayCell;