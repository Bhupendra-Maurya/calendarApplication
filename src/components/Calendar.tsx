// import React, { useMemo } from 'react';
// import { getMonthData, getJournalEntriesForDate, type JournalEntry } from '../utils/dateHelpers';
// import type { MonthInfo } from '../hooks/useInfiniteScroll';
// import DayCell from './DayCell';

// interface CalendarProps {
//   months: MonthInfo[];
//   journalEntries: JournalEntry[];
//   onEntryClick: (entry: JournalEntry) => void;
//   currentMonth: MonthInfo | null;
// }

// const Calendar: React.FC<CalendarProps> = ({
//   months,
//   journalEntries,
//   onEntryClick,
//   currentMonth
// }) => {
//   const renderMonth = useMemo(() => (monthInfo: MonthInfo) => {
//     const monthData = getMonthData(monthInfo.year, monthInfo.month);
    
//     return (
//       <div 
//         key={monthInfo.id} 
//         className="month-grid"
//         data-month-id={monthInfo.id}
//       >
//         <div className="days-grid">
//           {monthData.map((dayInfo, index) => {
//             const dayEntries = getJournalEntriesForDate(journalEntries, dayInfo.date);
//             return (
//               <DayCell
//                 key={`${monthInfo.id}-${index}`}
//                 day={dayInfo.day}
//                 date={dayInfo.date}
//                 isCurrentMonth={dayInfo.isCurrentMonth}
//                 isPrevMonth={dayInfo.isPrevMonth}
//                 journalEntries={dayEntries}
//                 onEntryClick={onEntryClick}
//                 isActualCurrentMonth={currentMonth ? monthInfo.year === currentMonth.year && monthInfo.month === currentMonth.month && dayInfo.isCurrentMonth : false}
//               />
//             );
//           })}
//         </div>
//       </div>
//     );
//   }, [journalEntries, onEntryClick]);

//   return (
//     <div className="calendar-months">
//       {months.map(renderMonth)}
//     </div>
//   );
// };

// export default Calendar;



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
  currentMonth
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
          const isActualCurrentMonth = currentMonth ? 
            dayInfo.monthInfo.year === currentMonth.year && 
            dayInfo.monthInfo.month === currentMonth.month : false;
          
          return (
            <div
              key={`${dayInfo.monthId}-${dayInfo.day}`}
              data-month-id={dayInfo.monthId}
              className={index === 0 ? "month-start" : ""}
            >
              <DayCell
                day={dayInfo.day}
                date={dayInfo.date}
                isCurrentMonth={true} // Always true since we're only showing actual month days
                isPrevMonth={false} // Not relevant for continuous view
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