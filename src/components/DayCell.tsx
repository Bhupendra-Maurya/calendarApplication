import React from "react";
import {
  type JournalEntry,
  getJournalEntriesForDate,
  isSameDay,
} from "../utils/dateHelpers";

interface DayCellProps {
  day: number;
  date: Date;
  isCurrentMonth: boolean;
  isPrevMonth: boolean;
  journalEntries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  date,
  isCurrentMonth,
  journalEntries,
  onEntryClick,
}) => {
  const isToday = isSameDay(date, new Date());
  const dayEntries = getJournalEntriesForDate(journalEntries, date);

  const cellClassName = [
    "day-cell",
    !isCurrentMonth && "other-month",
    isToday && "today",
  ]
    .filter(Boolean)
    .join(" ");

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }

    if (hasHalfStar) {
      stars.push("☆");
    }

    return stars.slice(0, 5);
  };

  return (
    <div className={cellClassName}>
      <div className="day-number">{day}</div>
      {isCurrentMonth && dayEntries.map((entry, index) => (
        <div key={index} className="journal-entry" onClick={() => onEntryClick(entry)}>
          <div className="stars">
            {renderStars(entry.rating).map((star, i) => (
              <span key={i} className="star">
                {star}
              </span>
            ))}
          </div>
          {entry.imgUrl && (
            <img 
              src={entry.imgUrl} 
              alt="Journal entry" 
              className="entry-image"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DayCell;