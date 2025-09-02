import React, { useMemo } from 'react';
import { getMonthData, getJournalEntriesForDate, type JournalEntry } from '../utils/dateHelpers';
import type { MonthInfo } from '../hooks/useInfiniteScroll';
import DayCell from './DayCell';

interface CalendarProps {
  months: MonthInfo[];
  journalEntries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
  currentMonth: MonthInfo | null;
}

const Calendar: React.FC<CalendarProps> = ({
  months,
  journalEntries,
  onEntryClick,
  currentMonth
}) => {
  const renderMonth = useMemo(() => (monthInfo: MonthInfo) => {
    const monthData = getMonthData(monthInfo.year, monthInfo.month);
    
    return (
      <div 
        key={monthInfo.id} 
        className="month-grid"
        data-month-id={monthInfo.id}
      >
        <div className="days-grid">
          {monthData.map((dayInfo, index) => {
            const dayEntries = getJournalEntriesForDate(journalEntries, dayInfo.date);
            return (
              <DayCell
                key={`${monthInfo.id}-${index}`}
                day={dayInfo.day}
                date={dayInfo.date}
                isCurrentMonth={dayInfo.isCurrentMonth}
                isPrevMonth={dayInfo.isPrevMonth}
                journalEntries={dayEntries}
                onEntryClick={onEntryClick}
                isActualCurrentMonth={currentMonth ? monthInfo.year === currentMonth.year && monthInfo.month === currentMonth.month && dayInfo.isCurrentMonth : false}
              />
            );
          })}
        </div>
      </div>
    );
  }, [journalEntries, onEntryClick]);

  return (
    <div className="calendar-months">
      {months.map(renderMonth)}
    </div>
  );
};

export default Calendar;