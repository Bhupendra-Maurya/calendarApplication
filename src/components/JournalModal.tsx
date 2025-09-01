// src/components/JournalModal.tsx
import React, { useEffect } from 'react';
import { type JournalEntry, parseDate } from '../utils/dateHelpers';

interface JournalModalProps {
  entry: JournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoToPrevious: boolean;
  canGoToNext: boolean;
}

const JournalModal: React.FC<JournalModalProps> = ({
  entry,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  canGoToPrevious,
  canGoToNext
}) => {
  // Handle touch events for swiping
  useEffect(() => {
    if (!isOpen) return;

    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);

      // Determine if this is a horizontal swipe
      if (diffX > diffY && diffX > 30) {
        if (!isScrolling) {
          e.preventDefault();
          isScrolling = true;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = Math.abs(startY - endY);

      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(diffX) > diffY && Math.abs(diffX) > 50) {
        if (diffX > 0 && canGoToNext) {
          onNext();
        } else if (diffX < 0 && canGoToPrevious) {
          onPrevious();
        }
      }

      startX = 0;
      startY = 0;
      isScrolling = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, canGoToPrevious, canGoToNext, onPrevious, onNext]);

  if (!isOpen || !entry) return null;

  const entryDate = parseDate(entry.date);
  const formattedDate = entryDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('★');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('☆');
      } else {
        stars.push('☆');
      }
    }

    return stars;
  };

  return (
    <div className="journal-modal" onClick={onClose}>
      <div className="journal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <button 
          className="modal-nav prev"
          onClick={onPrevious}
          disabled={!canGoToPrevious}
          title="Previous entry"
        >
          ‹
        </button>
        
        <button 
          className="modal-nav next"
          onClick={onNext}
          disabled={!canGoToNext}
          title="Next entry"
        >
          ›
        </button>
        
        <img 
          src={entry.imgUrl} 
          alt="Journal entry"
          className="journal-image"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDE0NVYxMzBIMTc1VjEwMFoiIGZpbGw9IiNEREREREQiLz4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPC9zdmc+Cg==';
          }}
        />
        
        <div className="journal-content">
          <h2 className="journal-date">{formattedDate}</h2>
          
          <div className="journal-rating">
            {renderStars(entry.rating).map((star, i) => (
              <span key={i} className="star">{star}</span>
            ))}
            <span className="journal-rating-number">{entry.rating}</span>
          </div>
          
          <div className="journal-categories">
            {entry.categories.map((category, index) => (
              <span key={index} className="category-tag">
                {category}
              </span>
            ))}
          </div>
          
          <p className="journal-description">{entry.description}</p>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;