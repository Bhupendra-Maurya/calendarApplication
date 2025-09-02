import { useState, useEffect, useCallback, useRef } from 'react';

export interface MonthInfo {
  year: number;
  month: number;
  id: string;
}

export const useInfiniteScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [months, setMonths] = useState<MonthInfo[]>([]);
  const [currentMonth, setCurrentMonth] = useState<MonthInfo | null>(null);
  const [showMonthIndicator, setShowMonthIndicator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollPositionRef = useRef<number>(0);
  const lastScrollTime = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);


  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();
    
    const initialMonths: MonthInfo[] = [];
    

    for (let i = -12; i <= 12; i++) {
      const date = new Date(currentYear, currentMonthIndex + i, 1);
      initialMonths.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        id: `${date.getFullYear()}-${date.getMonth()}`
      });
    }
    
    setMonths(initialMonths);
    setCurrentMonth({
      year: currentYear,
      month: currentMonthIndex,
      id: `${currentYear}-${currentMonthIndex}`
    });


    setTimeout(() => {
      if (containerRef.current) {
        const currentMonthElement = containerRef.current.querySelector(`[data-month-id="${currentYear}-${currentMonthIndex}"]`);
        if (currentMonthElement) {
          currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
  }, []);


  const addMonths = useCallback((direction: 'before' | 'after', count: number = 6) => {
    setMonths(prevMonths => {
      if (prevMonths.length === 0) return prevMonths;
      
      const newMonths = [...prevMonths];
      
      if (direction === 'before') {
        const firstMonth = prevMonths[0];
        for (let i = 1; i <= count; i++) {
          const date = new Date(firstMonth.year, firstMonth.month - i, 1);
          newMonths.unshift({
            year: date.getFullYear(),
            month: date.getMonth(),
            id: `${date.getFullYear()}-${date.getMonth()}`
          });
        }
      } else {
        const lastMonth = prevMonths[prevMonths.length - 1];
        for (let i = 1; i <= count; i++) {
          const date = new Date(lastMonth.year, lastMonth.month + i, 1);
          newMonths.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            id: `${date.getFullYear()}-${date.getMonth()}`
          });
        }
      }
      
      return newMonths;
    });
  }, []);


  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const now = Date.now();
    

    if (now - lastScrollTime.current < 16) return;
    lastScrollTime.current = now;

    scrollPositionRef.current = scrollTop;


    const monthElements = container.querySelectorAll('[data-month-id]');
    let maxVisibleArea = 0;
    let mostVisibleMonth: MonthInfo | null = null;

    monthElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      

      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleArea = visibleHeight * rect.width;
      
      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        const monthId = element.getAttribute('data-month-id');
        if (monthId) {
          const [year, month] = monthId.split('-').map(Number);
          mostVisibleMonth = { year, month, id: monthId };
        }
      }
    });

    if (mostVisibleMonth) {
      setCurrentMonth(prev => {
        if (!prev || prev.id !== mostVisibleMonth?.id) {
          setShowMonthIndicator(true);
          

          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          

          scrollTimeoutRef.current = setTimeout(() => {
            setShowMonthIndicator(false);
          }, 2000);
          
          return mostVisibleMonth;
        }
        return prev;
      });
    }


    const containerHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;
    

    if (scrollTop < containerHeight * 2 && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        addMonths('before');
        setIsLoading(false);
      }, 100);
    }
    

    if (scrollTop > scrollHeight - containerHeight * 3 && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        addMonths('after');
        setIsLoading(false);
      }, 100);
    }
  }, [addMonths, isLoading]);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    containerRef,
    months,
    currentMonth,
    showMonthIndicator,
    isLoading
  };
};