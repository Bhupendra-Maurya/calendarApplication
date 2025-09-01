import { useState, useEffect, useCallback } from 'react';
import { type JournalEntry, getAllJournalEntries, parseDate } from '../utils/dateHelpers';

export const useCalendar = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [currentEntryIndex, setCurrentEntryIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load journal entries on mount
  useEffect(() => {
    const entries = getAllJournalEntries();
    // Sort entries by date
    entries.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    setJournalEntries(entries);
  }, []);

  // Open journal entry modal
  const openJournalEntry = useCallback((entry: JournalEntry) => {
    const index = journalEntries.findIndex(e => 
      e.date === entry.date && e.description === entry.description
    );
    setSelectedEntry(entry);
    setCurrentEntryIndex(index);
    setIsModalOpen(true);
  }, [journalEntries]);

  // Close journal entry modal
  const closeJournalEntry = useCallback(() => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  }, []);

  // Navigate to previous entry
  const goToPreviousEntry = useCallback(() => {
    if (currentEntryIndex > 0) {
      const newIndex = currentEntryIndex - 1;
      setCurrentEntryIndex(newIndex);
      setSelectedEntry(journalEntries[newIndex]);
    }
  }, [currentEntryIndex, journalEntries]);

  // Navigate to next entry
  const goToNextEntry = useCallback(() => {
    if (currentEntryIndex < journalEntries.length - 1) {
      const newIndex = currentEntryIndex + 1;
      setCurrentEntryIndex(newIndex);
      setSelectedEntry(journalEntries[newIndex]);
    }
  }, [currentEntryIndex, journalEntries]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPreviousEntry();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextEntry();
          break;
        case 'Escape':
          event.preventDefault();
          closeJournalEntry();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, goToPreviousEntry, goToNextEntry, closeJournalEntry]);

  return {
    journalEntries,
    selectedEntry,
    currentEntryIndex,
    isModalOpen,
    openJournalEntry,
    closeJournalEntry,
    goToPreviousEntry,
    goToNextEntry,
    canGoToPrevious: currentEntryIndex > 0,
    canGoToNext: currentEntryIndex < journalEntries.length - 1
  };
};