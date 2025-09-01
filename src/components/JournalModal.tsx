import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="journal-modal" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="journal-card" 
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{ 
              duration: 0.4, 
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <motion.button 
              className="modal-close"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              ×
            </motion.button>
            
            <motion.button 
              className={`modal-nav prev ${!canGoToPrevious ? 'disabled' : ''}`}
              onClick={onPrevious}
              disabled={!canGoToPrevious}
              title="Previous entry"
              whileHover={canGoToPrevious ? { scale: 1.1, x: -5 } : {}}
              whileTap={canGoToPrevious ? { scale: 0.9 } : {}}
              transition={{ duration: 0.2 }}
            >
              ‹
            </motion.button>
            
            <motion.button 
              className={`modal-nav next ${!canGoToNext ? 'disabled' : ''}`}
              onClick={onNext}
              disabled={!canGoToNext}
              title="Next entry"
              whileHover={canGoToNext ? { scale: 1.1, x: 5 } : {}}
              whileTap={canGoToNext ? { scale: 0.9 } : {}}
              transition={{ duration: 0.2 }}
            >
              ›
            </motion.button>
            
            <motion.img 
              src={entry.imgUrl} 
              alt="Journal entry"
              className="journal-image"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDE0NVYxMzBIMTc1VjEwMFoiIGZpbGw9IiNEREREREQiLz4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPHA+CjwvcGF0aD4KPC9zdmc+Cg==';
              }}
            />
            
            <motion.div 
              className="journal-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.h2 
                className="journal-date"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {formattedDate}
              </motion.h2>
              
              <motion.div 
                className="journal-rating"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                {renderStars(entry.rating).map((star, i) => (
                  <motion.span 
                    key={i} 
                    className="star"
                    initial={{ opacity: 0, rotate: -180 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                  >
                    {star}
                  </motion.span>
                ))}
                <span className="journal-rating-number">{entry.rating}</span>
              </motion.div>
              
              <motion.div 
                className="journal-categories"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                {entry.categories.map((category, index) => (
                  <motion.span 
                    key={index} 
                    className="category-tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {category}
                  </motion.span>
                ))}
              </motion.div>
              
              <motion.p 
                className="journal-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                {entry.description}
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JournalModal;