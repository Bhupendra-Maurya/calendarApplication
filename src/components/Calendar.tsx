import React, { useMemo } from 'react';
import { getJournalEntriesForDate, type JournalEntry } from '../utils/dateHelpers';
import type { MonthInfo } from '../hooks/useInfiniteScroll';
import DayCell from './DayCell';

interface CalendarProps {
  months: MonthInfo[];
  journalEntries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
  currentMonth: MonthInfo | null;
}

interface ContinuousDayInfo {
  day: number;
  date: Date;
  monthInfo: MonthInfo;
  monthId: string;
}

const Calendar: React.FC<CalendarProps> = ({
  months,
  journalEntries,
  onEntryClick,
}) => {
  // Generate continuous days across all months
  const continuousDays = useMemo(() => {
    const days: ContinuousDayInfo[] = [];
    
    months.forEach((monthInfo) => {
      const year = monthInfo.year;
      const month = monthInfo.month;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Add all days for this month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          day,
          date: new Date(year, month, day),
          monthInfo,
          monthId: monthInfo.id
        });
      }
    });
    
    return days;
  }, [months]);

  return (
    <div className="calendar-months">
      <div className="continuous-days-grid">
        {continuousDays.map((dayInfo, index) => {
          const dayEntries = getJournalEntriesForDate(journalEntries, dayInfo.date);
          const today = new Date();
          const isActualCurrentMonth = dayInfo.monthInfo.year === today.getFullYear() && 
            dayInfo.monthInfo.month === today.getMonth();
          
          return (
            <div
              key={`${dayInfo.monthId}-${dayInfo.day}`}
              data-month-id={dayInfo.monthId}
              className={index === 0 ? "month-start" : ""}
            >
              <DayCell
                day={dayInfo.day}
                date={dayInfo.date}
                isCurrentMonth={true} 
                isPrevMonth={false} 
                journalEntries={dayEntries}
                onEntryClick={onEntryClick}
                isActualCurrentMonth={isActualCurrentMonth}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;