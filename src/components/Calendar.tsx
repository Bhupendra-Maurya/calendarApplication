import React from 'react';
import { getMonthData, type JournalEntry } from '../utils/dateHelpers';
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

  const renderMonth = (monthInfo: MonthInfo) => {
    const monthData = getMonthData(monthInfo.year, monthInfo.month);
    
    return (
      <div 
        key={monthInfo.id} 
        className="month-grid"
        data-month-id={monthInfo.id}
      >
        <div className="days-grid">
          {monthData.map((dayInfo, index) => (
            <DayCell
              key={`${monthInfo.id}-${index}`}
              day={dayInfo.day}
              date={dayInfo.date}
              isCurrentMonth={dayInfo.isCurrentMonth}
              isPrevMonth={dayInfo.isPrevMonth}
              journalEntries={journalEntries}
              onEntryClick={onEntryClick}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-months">
      {months.map(renderMonth)}
    </div>
  );
};

export default Calendar;