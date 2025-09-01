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

    return stars.slice(0, 5); // Max 5 stars
  };

  return (
    <div className={cellClassName}>
      <div className="day-number">{day}</div>
      {dayEntries.map((entry, index) => (
        <div
          key={index}
          className="journal-entry"
          onClick={() => onEntryClick(entry)}
          title={entry.description.substring(0, 100) + "..."}
          // style={{
          //   backgroundImage: `url(${entry.imgUrl})`,
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          //   backgroundRepeat: "no-repeat",
          // }}
        >
          <div>{entry.categories[0] || "Journal"}</div>
          <div className="journal-entry-rating">
            {renderStars(entry.rating).map((star, i) => (
              <span key={i} className="star">
                {star}
              </span>
            ))}
            <span style={{ fontSize: "0.6875rem", marginLeft: "0.25rem" }}>
              {entry.rating}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DayCell;
