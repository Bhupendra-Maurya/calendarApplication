import { useState, useEffect, useCallback, useRef } from 'react';

const MONTH_INDICATOR_TIMEOUT_MS = 2000;
const LOADING_DELAY_MS = 50;
const VISIBLE_WINDOW = 24; // Keep only 24 months in DOM (12 before + 12 after)

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
  const [isLoading, setIsLoading] = useState(true);

  const scrollTimeoutRef = useRef<number | null>(null);
  const loadingRef = useRef(false);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const monthElementsRef = useRef<Map<string, Element>>(new Map());

  // Generate month info
  const createMonthInfo = (year: number, month: number): MonthInfo => ({
    year,
    month,
    id: `${year}-${month}`,
  });

  // Initial months (centered on current month)
  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    const initialMonths: MonthInfo[] = [];
    for (let i = -6; i <= 6; i++) {
      const date = new Date(currentYear, currentMonthIndex + i, 1);
      initialMonths.push(createMonthInfo(date.getFullYear(), date.getMonth()));
    }

    setMonths(initialMonths);
    setCurrentMonth(createMonthInfo(currentYear, currentMonthIndex));
    setIsLoading(false);

    // Scroll to current month after DOM paint
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (containerRef.current) {
          const currentMonthElement = containerRef.current.querySelector(
            `[data-month-id="${currentYear}-${currentMonthIndex}"]`
          );
          if (currentMonthElement) {
            currentMonthElement.scrollIntoView({
              behavior: 'instant',
              block: 'start',
            });
          }
        }
      }, 0);
    });
  }, []);

  // Add more months with windowing
  const addMonths = useCallback(
    (direction: 'before' | 'after', count: number = 6) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(false);

      setMonths((prevMonths) => {
        if (prevMonths.length === 0) return prevMonths;

        const newMonths: MonthInfo[] = [...prevMonths];

        if (direction === 'before') {
          const firstMonth = prevMonths[0];
          for (let i = 1; i <= count; i++) {
            const date = new Date(firstMonth.year, firstMonth.month - i, 1);
            newMonths.unshift(createMonthInfo(date.getFullYear(), date.getMonth()));
          }
        } else {
          const lastMonth = prevMonths[prevMonths.length - 1];
          for (let i = 1; i <= count; i++) {
            const date = new Date(lastMonth.year, lastMonth.month + i, 1);
            newMonths.push(createMonthInfo(date.getFullYear(), date.getMonth()));
          }
        }

        //Keep only VISIBLE_WINDOW months centered on currentMonth
        if (newMonths.length > VISIBLE_WINDOW) {
          if (currentMonth) {
            const currentIndex = newMonths.findIndex((m) => m.id === currentMonth.id);
            const start = Math.max(0, currentIndex - VISIBLE_WINDOW / 2);
            const end = start + VISIBLE_WINDOW;
            return newMonths.slice(start, end);
          } else {
            return newMonths.slice(-VISIBLE_WINDOW);
          }
        }

        return newMonths;
      });

      setTimeout(() => {
        loadingRef.current = false;
        setIsLoading(false);
      }, LOADING_DELAY_MS);
    },
    [currentMonth]
  );

  //Scroll handler 
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    if (scrollTimeoutRef.current) {
      cancelAnimationFrame(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = requestAnimationFrame(() => {
      const container = containerRef.current!;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      if (scrollTop < containerHeight * 2 && !loadingRef.current) {
        addMonths('before');
      }
      if (scrollTop > scrollHeight - containerHeight * 3 && !loadingRef.current) {
        addMonths('after');
      }
    });
  }, [addMonths]);

  // Intersection Observer for current month
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
          setCurrentMonth((prev) => {
            if (!prev || prev.id !== mostVisibleMonth?.id) {
              setShowMonthIndicator(true);
              setTimeout(() => setShowMonthIndicator(false), MONTH_INDICATOR_TIMEOUT_MS);
              return mostVisibleMonth;
            }
            return prev;
          });
        }
      },
      {
        root: containerRef.current,
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    intersectionObserverRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, []);

  // Observe new month elements only when months change
  useEffect(() => {
    if (!intersectionObserverRef.current) return;
    if (!containerRef.current) return;

    const observer = intersectionObserverRef.current;
    const monthElements = containerRef.current.querySelectorAll('[data-month-id]');

    monthElements.forEach((element) => {
      const monthId = element.getAttribute('data-month-id');
      if (monthId && !monthElementsRef.current.has(monthId)) {
        observer.observe(element);
        monthElementsRef.current.set(monthId, element);
      }
    });
  }, [months]);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
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
        const targetElement = containerRef.current.querySelector(
          `[data-month-id="${targetId}"]`
        );

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
    isLoading,
  };
};
















