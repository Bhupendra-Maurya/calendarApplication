import { useState, useEffect, useCallback, useRef } from 'react';

const SCROLL_THROTTLE_MS = 16;
const MONTH_INDICATOR_TIMEOUT_MS = 2000;
const LOADING_DELAY_MS = 50;
const SCROLL_BUFFER_MULTIPLIER = 2;
const SCROLL_TRIGGER_MULTIPLIER = 3;

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
  const loadingRef = useRef<boolean>(false);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const monthElementsRef = useRef<Map<string, Element>>(new Map());


  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();
    
    const initialMonths: MonthInfo[] = [];
    
    for (let i = -6; i <= 6; i++) {
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

    // Scroll to current month after DOM is ready
    const scrollToCurrentMonth = () => {
      if (containerRef.current) {
        const currentMonthElement = containerRef.current.querySelector(`[data-month-id="${currentYear}-${currentMonthIndex}"]`);
        if (currentMonthElement) {
          currentMonthElement.scrollIntoView({ behavior: 'instant', block: 'start' });
        } else {
          // Retry if element not found
          requestAnimationFrame(scrollToCurrentMonth);
        }
      }
    };
    
    requestAnimationFrame(scrollToCurrentMonth);
  }, []);


  const addMonths = useCallback((direction: 'before' | 'after', count: number = 6) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    
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
    
    setTimeout(() => {
      loadingRef.current = false;
    }, LOADING_DELAY_MS);
  }, []);


  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const now = Date.now();
    
    if (now - lastScrollTime.current < SCROLL_THROTTLE_MS) return;
    lastScrollTime.current = now;

    scrollPositionRef.current = scrollTop;

    const containerHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;
    
    // Load more months if needed
    if (scrollTop < containerHeight * SCROLL_BUFFER_MULTIPLIER && !loadingRef.current) {
      addMonths('before');
    }
    
    if (scrollTop > scrollHeight - containerHeight * SCROLL_TRIGGER_MULTIPLIER && !loadingRef.current) {
      addMonths('after');
    }
  }, [addMonths]);

  // Setup intersection observer for month visibility
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisibleRatio = 0;
        let mostVisibleMonth: MonthInfo | null = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibleRatio) {
            maxVisibleRatio = entry.intersectionRatio;
            const monthId = entry.target.getAttribute('data-month-id');
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
              }, MONTH_INDICATOR_TIMEOUT_MS);
              
              return mostVisibleMonth;
            }
            return prev;
          });
        }
      },
      {
        root: containerRef.current,
        threshold: [0.1, 0.5, 0.9]
      }
    );

    intersectionObserverRef.current = observer;

    // Observe existing month elements
    const monthElements = containerRef.current.querySelectorAll('[data-month-id]');
    monthElements.forEach(element => {
      observer.observe(element);
      const monthId = element.getAttribute('data-month-id');
      if (monthId) {
        monthElementsRef.current.set(monthId, element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [months]);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!containerRef.current || !currentMonth) return;
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const direction = e.key === 'ArrowUp' ? -1 : 1;
        const targetMonth = new Date(currentMonth.year, currentMonth.month + direction, 1);
        const targetId = `${targetMonth.getFullYear()}-${targetMonth.getMonth()}`;
        const targetElement = containerRef.current.querySelector(`[data-month-id="${targetId}"]`);
        
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentMonth]);

  return {
    containerRef,
    months,
    currentMonth,
    showMonthIndicator,
    isLoading
  };
};