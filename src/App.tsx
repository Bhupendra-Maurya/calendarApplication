import React from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import JournalModal from './components/JournalModal';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useCalendar } from './hooks/useCalendar';

const App: React.FC = () => {
  const { containerRef, months, currentMonth, showMonthIndicator } = useInfiniteScroll();
  const {
    journalEntries,
    allEntries,
    searchQuery,
    setSearchQuery,
    selectedEntry,
    isModalOpen,
    openJournalEntry,
    closeJournalEntry,
    goToPreviousEntry,
    goToNextEntry,
    canGoToPrevious,
    canGoToNext
  } = useCalendar();

  return (
    <div className="app">
      <Header 
        currentMonth={currentMonth} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="fixed-days-header">
        <div className="day-header">Sun</div>
        <div className="day-header">Mon</div>
        <div className="day-header">Tue</div>
        <div className="day-header">Wed</div>
        <div className="day-header">Thu</div>
        <div className="day-header">Fri</div>
        <div className="day-header">Sat</div>
      </div>
      
      {showMonthIndicator && currentMonth && (
        <div className="floating-month-indicator">
          {currentMonth.month === 0 ? 'January' : 
           currentMonth.month === 1 ? 'February' :
           currentMonth.month === 2 ? 'March' :
           currentMonth.month === 3 ? 'April' :
           currentMonth.month === 4 ? 'May' :
           currentMonth.month === 5 ? 'June' :
           currentMonth.month === 6 ? 'July' :
           currentMonth.month === 7 ? 'August' :
           currentMonth.month === 8 ? 'September' :
           currentMonth.month === 9 ? 'October' :
           currentMonth.month === 10 ? 'November' : 'December'} {currentMonth.year}
        </div>
      )}
      
      <div ref={containerRef} className="calendar-container">
        <Calendar
          months={months}
          journalEntries={searchQuery ? journalEntries : allEntries}
          onEntryClick={openJournalEntry}
        />
      </div>

      <JournalModal
        entry={selectedEntry}
        isOpen={isModalOpen}
        onClose={closeJournalEntry}
        onPrevious={goToPreviousEntry}
        onNext={goToNextEntry}
        canGoToPrevious={canGoToPrevious}
        canGoToNext={canGoToNext}
      />
    </div>
  );
};

export default App;