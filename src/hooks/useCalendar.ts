import { useState, useEffect, useCallback } from 'react';
import { type JournalEntry, getAllJournalEntries, parseDate } from '../utils/dateHelpers';

export const useCalendar = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [currentEntryIndex, setCurrentEntryIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const entries = getAllJournalEntries();

    entries.sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    setJournalEntries(entries);
    setFilteredEntries(entries);
  }, []);

  // Filter entries based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEntries(journalEntries);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = journalEntries.filter(entry => 
        entry.description.toLowerCase().includes(lowerQuery) ||
        entry.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, journalEntries]);


  const openJournalEntry = useCallback((entry: JournalEntry) => {
    const index = filteredEntries.findIndex(e => 
      e.date === entry.date && e.description === entry.description
    );
    setSelectedEntry(entry);
    setCurrentEntryIndex(index >= 0 ? index : 0);
    setIsModalOpen(true);
  }, [filteredEntries]);


  const closeJournalEntry = useCallback(() => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  }, []);


  const goToPreviousEntry = useCallback(() => {
    if (currentEntryIndex > 0) {
      const newIndex = currentEntryIndex - 1;
      setCurrentEntryIndex(newIndex);
      setSelectedEntry(filteredEntries[newIndex]);
    }
  }, [currentEntryIndex, filteredEntries]);


  const goToNextEntry = useCallback(() => {
    if (currentEntryIndex < filteredEntries.length - 1) {
      const newIndex = currentEntryIndex + 1;
      setCurrentEntryIndex(newIndex);
      setSelectedEntry(filteredEntries[newIndex]);
    }
  }, [currentEntryIndex, filteredEntries]);


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
    journalEntries: filteredEntries,
    allEntries: journalEntries,
    searchQuery,
    setSearchQuery,
    selectedEntry,
    currentEntryIndex,
    isModalOpen,
    openJournalEntry,
    closeJournalEntry,
    goToPreviousEntry,
    goToNextEntry,
    canGoToPrevious: currentEntryIndex > 0,
    canGoToNext: currentEntryIndex < filteredEntries.length - 1
  };
};