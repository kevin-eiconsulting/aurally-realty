'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './SortDropdown.module.css';

export const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price-low', label: 'Price - Low to High' },
  { id: 'price-high', label: 'Price - High to Low' },
  { id: 'recent', label: 'Most Recent' },
  { id: 'rate-sqft-low', label: 'Rate/sqft - Low to High' },
  { id: 'rate-sqft-high', label: 'Rate/sqft - High to Low' },
];

export default function SortDropdown({ value = 'relevance', onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize 'featured' to 'relevance'
  const normalizedValue = value === 'featured' ? 'relevance' : value;
  const currentOption = SORT_OPTIONS.find(opt => opt.id === normalizedValue) || SORT_OPTIONS[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (id) => {
    if (onChange) {
      onChange(id);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.sortContainer} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.sortTrigger} ${isOpen ? styles.sortTriggerActive : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.sortArrowIcon}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 20V4M7 4L3 8M7 4L11 8M17 4v16M17 20l-4-4M17 20l4-4" />
          </svg>
        </span>
        <span>Sort by: {currentOption.label}</span>
        <span className={`${styles.sortChevron} ${isOpen ? styles.sortChevronOpen : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <ul className={styles.menuList} role="listbox">
            {SORT_OPTIONS.map((option) => {
              const isSelected = option.id === currentOption.id;
              return (
                <li
                  key={option.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.id)}
                  className={`${styles.menuItem} ${isSelected ? styles.menuItemActive : ''}`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className={styles.checkIconWrap}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" stroke="#009688" strokeWidth="1.8" />
                        <path d="M6 10.2L8.6 13L14 7.2" stroke="#009688" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
