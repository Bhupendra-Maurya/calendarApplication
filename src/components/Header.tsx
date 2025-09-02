import React from "react";
import { getMonthName } from "../utils/dateHelpers";

interface HeaderProps {
  currentMonth: {
    year: number;
    month: number;
    id: string;
  } | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentMonth, searchQuery, onSearchChange }) => {
  if (!currentMonth) {
    return (
      <header className="header">
        <h1>Calendar</h1>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="back-button">←</button>
        <span className="header-title">my hair diary</span>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="header-search"
      />
      <h1>
        {currentMonth
          ? `${getMonthName(currentMonth.month).substring(0, 3)} ${
              currentMonth.year
            }`
          : "Calendar"}
      </h1>
    </header>
  );
};

export default Header;
