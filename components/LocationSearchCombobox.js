'use client';
import { useState, useEffect, useRef } from 'react';
import {
  searchTamilNaduLocations,
  CITY_AREAS,
  POPULAR_TN_HUBS,
  TAMIL_NADU_CITIES
} from '@/lib/tamilnadu-locations';
import styles from './LocationSearchCombobox.module.css';

export default function LocationSearchCombobox({
  selectedCity = 'Hosur',
  onCityChange,
  value = '',
  onChange,
  onSelect,
  placeholder = 'Add Locality, Project, or City...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Update suggestions whenever inputValue or selectedCity changes
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const results = searchTamilNaduLocations(inputValue, selectedCity, 10);
      setSuggestions(results);
    } else {
      // Empty input: provide popular localities in active city
      const currentCityAreas = CITY_AREAS[selectedCity] || CITY_AREAS['Hosur'] || [];
      const defaultSuggestions = currentCityAreas.slice(0, 8).map(loc => ({
        locality: loc,
        city: selectedCity,
        label: `${loc}, ${selectedCity}`,
        type: 'locality'
      }));
      setSuggestions(defaultSuggestions);
    }
    setHighlightIndex(-1);
  }, [inputValue, selectedCity]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowCityPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setShowCityPicker(false);
    if (!isOpen) setIsOpen(true);
    if (onChange) onChange(val);
  };

  const handleClear = () => {
    setInputValue('');
    if (onChange) onChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSelectLocation = (item) => {
    if (item.type === 'city') {
      // City selected: switch active city, clear area
      if (onCityChange) onCityChange(item.city);
      setInputValue('');
      if (onChange) onChange('');
      if (onSelect) onSelect({ locality: '', city: item.city });
    } else {
      // Locality selected: sync locality, and sync city if different
      if (item.city && item.city !== selectedCity && onCityChange) {
        onCityChange(item.city);
      }
      setInputValue(item.locality);
      if (onChange) onChange(item.locality);
      if (onSelect) onSelect({ locality: item.locality, city: item.city || selectedCity });
    }
    setIsOpen(false);
    setShowCityPicker(false);
  };

  const handleSelectCityChip = (city) => {
    if (onCityChange) onCityChange(city);
    setInputValue('');
    if (onChange) onChange('');
    setShowCityPicker(false);
    setIsOpen(true);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        handleSelectLocation(suggestions[highlightIndex]);
      } else if (inputValue.trim()) {
        // User typed custom locality / project
        if (onSelect) onSelect({ locality: inputValue.trim(), city: selectedCity });
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setShowCityPicker(false);
    }
  };

  const popularLocalities = (CITY_AREAS[selectedCity] || CITY_AREAS['Hosur'] || []).slice(0, 6);

  return (
    <div className={styles.comboboxWrapper} ref={containerRef}>
      <div className={styles.inputRow}>
        {/* City Badge Button */}
        <button
          type="button"
          className={styles.cityBadgeBtn}
          onClick={() => {
            setShowCityPicker(!showCityPicker);
            setIsOpen(true);
          }}
          title="Click to switch Tamil Nadu city"
          aria-label={`Current city: ${selectedCity}. Click to change.`}
        >
          <span className={styles.pinIcon}>📍</span>
          <span className={styles.cityName}>{selectedCity}</span>
          <span className={`${styles.chevronIcon} ${showCityPicker ? styles.chevronOpen : ''}`}>▼</span>
        </button>

        {/* Searchable Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.typeInput}
          autoComplete="off"
          aria-label="Search locality or city in Tamil Nadu"
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            title="Clear"
            aria-label="Clear locality search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox">
          {/* Quick City Picker Mode */}
          {showCityPicker ? (
            <div>
              <div className={styles.sectionHeader}>
                <span>Select Tamil Nadu City / District</span>
                <span className={styles.sectionBadge}>38 Districts</span>
              </div>
              <div className={styles.chipsGrid}>
                <button
                  type="button"
                  className={styles.quickChip}
                  onClick={() => handleSelectCityChip('All Tamil Nadu')}
                  style={selectedCity === 'All Tamil Nadu' ? { borderColor: '#ea580c', color: '#ea580c', fontWeight: 700 } : {}}
                >
                  🏛️ All Tamil Nadu
                </button>
                {POPULAR_TN_HUBS.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={styles.quickChip}
                    onClick={() => handleSelectCityChip(city)}
                    style={selectedCity === city ? { borderColor: '#ea580c', color: '#ea580c', fontWeight: 700 } : {}}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <div className={styles.divider} />
              <div className={styles.sectionHeader}>
                <span>All Tamil Nadu Districts</span>
              </div>
              <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '0 8px' }}>
                {TAMIL_NADU_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`${styles.suggestionItem} ${selectedCity === city ? styles.suggestionActive : ''}`}
                    onClick={() => handleSelectCityChip(city)}
                  >
                    <div className={styles.itemLeft}>
                      <span className={styles.itemIcon}>🏙️</span>
                      <span className={styles.itemMainName}>{city}</span>
                    </div>
                    <span className={`${styles.itemTag} ${styles.tagCity}`}>District</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Autocomplete Mode */
            <>
              {/* If input is empty: show popular localities in active city */}
              {!inputValue.trim() && (
                <>
                  <div className={styles.sectionHeader}>
                    <span>Popular Localities in {selectedCity}</span>
                    <span className={styles.sectionBadge}>Quick Pick</span>
                  </div>
                  <div className={styles.chipsGrid}>
                    {popularLocalities.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        className={styles.quickChip}
                        onClick={() => handleSelectLocation({ locality: loc, city: selectedCity, type: 'locality' })}
                      >
                        📍 {loc}
                      </button>
                    ))}
                  </div>

                  <div className={styles.divider} />
                  <div className={styles.sectionHeader}>
                    <span>Switch Tamil Nadu City</span>
                  </div>
                  <div className={styles.chipsGrid}>
                    {POPULAR_TN_HUBS.slice(0, 6).map((city) => (
                      <button
                        key={city}
                        type="button"
                        className={styles.quickChip}
                        onClick={() => handleSelectCityChip(city)}
                      >
                        🏢 {city}
                      </button>
                    ))}
                  </div>
                  <div className={styles.divider} />
                </>
              )}

              {/* Suggestions List */}
              {suggestions.length > 0 ? (
                <div>
                  <div className={styles.sectionHeader}>
                    <span>
                      {inputValue.trim() ? `Tamil Nadu Results for "${inputValue}"` : `All Localities in ${selectedCity}`}
                    </span>
                    <span className={styles.sectionBadge}>{suggestions.length} Found</span>
                  </div>

                  {suggestions.map((item, index) => {
                    const isSelected = index === highlightIndex;
                    return (
                      <button
                        key={`${item.type}-${item.city}-${item.locality}-${index}`}
                        type="button"
                        className={`${styles.suggestionItem} ${isSelected ? styles.suggestionActive : ''}`}
                        onClick={() => handleSelectLocation(item)}
                        onMouseEnter={() => setHighlightIndex(index)}
                      >
                        <div className={styles.itemLeft}>
                          <span className={styles.itemIcon}>
                            {item.type === 'city' ? '🏙️' : '📍'}
                          </span>
                          <div className={styles.itemText}>
                            <span className={styles.itemMainName}>
                              {item.type === 'city' ? item.city : item.locality}
                            </span>
                            <span className={styles.itemSubText}>
                              {item.type === 'city' ? 'District / City, Tamil Nadu' : `${item.city}, Tamil Nadu`}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`${styles.itemTag} ${
                            item.type === 'city' ? styles.tagCity : styles.tagLocality
                          }`}
                        >
                          {item.type === 'city' ? 'City' : 'Locality'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.noMatches}>
                  <span>No exact locality found for "{inputValue}".</span>
                </div>
              )}

              {/* Free Text Search Fallback */}
              {inputValue.trim() && (
                <>
                  <div className={styles.divider} />
                  <button
                    type="button"
                    className={`${styles.suggestionItem} ${styles.customSearchItem}`}
                    onClick={() => {
                      if (onSelect) onSelect({ locality: inputValue.trim(), city: selectedCity });
                      setIsOpen(false);
                    }}
                  >
                    <div className={styles.itemLeft}>
                      <span className={styles.itemIcon}>🔍</span>
                      <div className={styles.itemText}>
                        <span className={styles.itemMainName}>Search for "{inputValue.trim()}"</span>
                        <span className={styles.itemSubText}>in {selectedCity}, Tamil Nadu</span>
                      </div>
                    </div>
                    <span className={`${styles.itemTag} ${styles.tagCustom}`}>Custom</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
