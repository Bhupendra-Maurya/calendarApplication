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
  const allDays = useMemo(() => {
    return months.flatMap(monthInfo => {
      const monthData = getMonthData(monthInfo.year, monthInfo.month);
      return monthData.map((dayInfo, index) => ({
        ...dayInfo,
        monthInfo,
        key: `${monthInfo.id}-${index}`
      }));
    });
  }, [months]);

  return (
    <div className="calendar-months">
      <div className="days-grid" data-month-id="continuous">
        {allDays.map((dayInfo) => {
          const dayEntries = getJournalEntriesForDate(journalEntries, dayInfo.date);
          return (
            <DayCell
              key={dayInfo.key}
              day={dayInfo.day}
              date={dayInfo.date}
              isCurrentMonth={dayInfo.isCurrentMonth}
              isPrevMonth={dayInfo.isPrevMonth}
              journalEntries={dayEntries}
              onEntryClick={onEntryClick}
              isActualCurrentMonth={currentMonth ? dayInfo.monthInfo.year === currentMonth.year && dayInfo.monthInfo.month === currentMonth.month && dayInfo.isCurrentMonth : false}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;