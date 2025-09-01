import React from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import JournalModal from './components/JournalModal';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useCalendar } from './hooks/useCalendar';
import './styles/calendar.css';

const App: React.FC = () => {
  const { containerRef, months, currentMonth } = useInfiniteScroll();
  const {
    journalEntries,
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
      <Header currentMonth={currentMonth} />
      
      <div ref={containerRef} className="calendar-container">
        <Calendar
          months={months}
          journalEntries={journalEntries}
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