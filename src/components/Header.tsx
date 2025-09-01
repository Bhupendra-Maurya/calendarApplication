
import React from 'react';
import { getMonthName } from '../utils/dateHelpers';

interface HeaderProps {
  currentMonth: {
    year: number;
    month: number;
    id: string;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ currentMonth }) => {
  if (!currentMonth) {
    return (
      <header className="header">
        <h1>Calendar</h1>
      </header>
    );
  }

  return (
    <header className="header">
      <h1>
        {getMonthName(currentMonth.month)} {currentMonth.year}
      </h1>
    </header>
  );
};

export default Header;