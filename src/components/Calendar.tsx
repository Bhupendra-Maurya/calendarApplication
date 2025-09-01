import React from 'react';
import { motion } from 'framer-motion';
import { getMonthData, getMonthName, type JournalEntry } from '../utils/dateHelpers';
import type { MonthInfo } from '../hooks/useInfiniteScroll';
import DayCell from './DayCell';

interface CalendarProps {
  months: MonthInfo[];
  journalEntries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  months,
  journalEntries,
  onEntryClick
}) => {
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderMonth = (monthInfo: MonthInfo, index: number) => {
    const monthData = getMonthData(monthInfo.year, monthInfo.month);
    
    return (
      <motion.div 
        key={monthInfo.id} 
        className="month-grid"
        data-month-id={monthInfo.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          ease: "easeOut" 
        }}
      >
        <motion.h2 
          className="month-title"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          {getMonthName(monthInfo.month)} {monthInfo.year}
        </motion.h2>
        
        <motion.div 
          className="days-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
        >
          {dayHeaders.map((day, dayIndex) => (
            <motion.div 
              key={day} 
              className="day-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 + 0.4 + dayIndex * 0.05 
              }}
            >
              {day}
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="days-grid"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
        >
          {monthData.map((dayInfo, dayIndex) => (
            <DayCell
              key={`${monthInfo.id}-${dayIndex}`}
              day={dayInfo.day}
              date={dayInfo.date}
              isCurrentMonth={dayInfo.isCurrentMonth}
              isPrevMonth={dayInfo.isPrevMonth}
              journalEntries={journalEntries}
              onEntryClick={onEntryClick}
              index={dayIndex}
            />
          ))}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="calendar-months">
      {months.map(renderMonth)}
    </div>
  );
};

export default Calendar;