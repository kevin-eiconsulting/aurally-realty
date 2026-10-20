'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './BudgetRangeFilter.module.css';

export default function BudgetRangeFilter({
  mode = 'buy', // 'buy' | 'rent'
  minBudget,
  maxBudget,
  onChange,
  onClear
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Convert buy value in Lakhs to label (e.g., 5 -> "₹ 5 Lac", 100 -> "₹ 1 Cr", 420 -> "₹ 4.2 Cr")
  const formatBuyVal = (val) => {
    if (!val) return '';
    const num = Number(val);
    if (num < 100) return `₹ ${num} Lac`;
    const cr = (num / 100).toFixed(1).replace(/\.0$/, '');
    return `₹ ${cr} Cr`;
  };

  const formatRentVal = (val) => {
    if (!val) return '';
    const num = Number(val);
    if (num >= 100000) {
      const l = (num / 100000).toFixed(1).replace(/\.0$/, '');
      return `₹ ${l} Lakh`;
    }
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  // Buy options (in Lakhs)
  const BUY_OPTIONS = [
    { value: '', label: 'Min' },
    { value: '5', label: '₹ 5 Lac' },
    { value: '10', label: '₹ 10 Lac' },
    { value: '20', label: '₹ 20 Lac' },
    { value: '30', label: '₹ 30 Lac' },
    { value: '40', label: '₹ 40 Lac' },
    { value: '50', label: '₹ 50 Lac' },
    { value: '60', label: '₹ 60 Lac' },
    { value: '80', label: '₹ 80 Lac' },
    { value: '100', label: '₹ 1 Cr' },
    { value: '150', label: '₹ 1.5 Cr' },
    { value: '200', label: '₹ 2 Cr' },
    { value: '300', label: '₹ 3 Cr' },
    { value: '420', label: '₹ 4.2 Cr' },
    { value: '500', label: '₹ 5 Cr' },
  ];

  const BUY_MAX_OPTIONS = [
    { value: '', label: 'Max' },
    { value: '20', label: '₹ 20 Lac' },
    { value: '30', label: '₹ 30 Lac' },
    { value: '40', label: '₹ 40 Lac' },
    { value: '50', label: '₹ 50 Lac' },
    { value: '60', label: '₹ 60 Lac' },
    { value: '80', label: '₹ 80 Lac' },
    { value: '100', label: '₹ 1 Cr' },
    { value: '150', label: '₹ 1.5 Cr' },
    { value: '200', label: '₹ 2 Cr' },
    { value: '300', label: '₹ 3 Cr' },
    { value: '420', label: '₹ 4.2 Cr' },
    { value: '495', label: '₹ 4.95 Cr' },
    { value: '500', label: '₹ 5 Cr' },
  ];

  // Rent options (in Rupees)
  const RENT_OPTIONS = [
    { value: '', label: 'Min' },
    { value: '5000', label: '₹ 5,000' },
    { value: '10000', label: '₹ 10,000' },
    { value: '15000', label: '₹ 15,000' },
    { value: '20000', label: '₹ 20,000' },
    { value: '25000', label: '₹ 25,000' },
    { value: '35000', label: '₹ 35,000' },
    { value: '50000', label: '₹ 50,000' },
    { value: '70000', label: '₹ 70,000' },
    { value: '100000', label: '₹ 1 Lakh' },
  ];

  const RENT_MAX_OPTIONS = [
    { value: '', label: 'Max' },
    { value: '10000', label: '₹ 10,000' },
    { value: '15000', label: '₹ 15,000' },
    { value: '20000', label: '₹ 20,000' },
    { value: '25000', label: '₹ 25,000' },
    { value: '35000', label: '₹ 35,000' },
    { value: '50000', label: '₹ 50,000' },
    { value: '70000', label: '₹ 70,000' },
    { value: '100000', label: '₹ 1 Lakh' },
    { value: '150000', label: '₹ 1.5 Lakh' },
    { value: '200000', label: '₹ 2 Lakh' },
  ];

  const minList = mode === 'rent' ? RENT_OPTIONS : BUY_OPTIONS;
  const maxList = mode === 'rent' ? RENT_MAX_OPTIONS : BUY_MAX_OPTIONS;

  // Numerical limits for range slider
  const sliderMin = mode === 'rent' ? 5000 : 5;
  const sliderMax = mode === 'rent' ? 100000 : 500;
  const sliderStep = mode === 'rent' ? 2500 : 5;

  const currentMinNum = minBudget ? Number(minBudget) : sliderMin;
  const currentMaxNum = maxBudget ? Number(maxBudget) : sliderMax;

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLabel = (val, isMax = false) => {
    if (!val) return isMax ? 'Max' : 'Min';
    return mode === 'rent' ? formatRentVal(val) : formatBuyVal(val);
  };

  const formatDisplay = () => {
    if (!minBudget && !maxBudget) return 'Select Budget';
    const minLabel = getLabel(minBudget, false);
    const maxLabel = getLabel(maxBudget, true);
    if (minBudget && maxBudget) return `${minLabel} - ${maxLabel}`;
    if (minBudget) return `Above ${minLabel}`;
    if (maxBudget) return `Up to ${maxLabel}`;
    return 'Select Budget';
  };

  const handleSliderMinChange = (e) => {
    const val = Number(e.target.value);
    const newMin = Math.min(val, currentMaxNum - sliderStep);
    onChange({ min: newMin <= sliderMin ? '' : String(newMin), max: maxBudget });
  };

  const handleSliderMaxChange = (e) => {
    const val = Number(e.target.value);
    const newMax = Math.max(val, currentMinNum + sliderStep);
    onChange({ min: minBudget, max: newMax >= sliderMax ? '' : String(newMax) });
  };

  // Percentage for colored track fill
  const minPercent = ((currentMinNum - sliderMin) / (sliderMax - sliderMin)) * 100;
  const maxPercent = ((currentMaxNum - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {/* Trigger Button styled like 99acres input */}
      <button
        type="button"
        className={`${styles.triggerBtn} ${open ? styles.triggerActive : ''} ${(minBudget || maxBudget) ? styles.triggerHasValue : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Filter by Budget"
      >
        <span className={styles.triggerText}>{formatDisplay()}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Flyout Popover Card (matching the 4th screenshot exactly) */}
      {open && (
        <div className={styles.popover}>
          {/* Arrow notch */}
          <div className={styles.notch} />

          {/* Min to Max Dropdowns Row */}
          <div className={styles.dropdownsRow}>
            <div className={styles.selectBox}>
              <select
                value={minBudget || ''}
                onChange={(e) => onChange({ min: e.target.value, max: maxBudget })}
                className={styles.selectInput}
                aria-label="Minimum Budget"
              >
                {/* Ensure current slider value is always selectable if not in preset */}
                {minBudget && !minList.some(o => o.value === String(minBudget)) && (
                  <option value={minBudget}>{getLabel(minBudget, false)}</option>
                )}
                {minList.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className={styles.selectChevron}>⌵</span>
            </div>

            <span className={styles.toText}>to</span>

            <div className={styles.selectBox}>
              <select
                value={maxBudget || ''}
                onChange={(e) => onChange({ min: minBudget, max: e.target.value })}
                className={styles.selectInput}
                aria-label="Maximum Budget"
              >
                {/* Ensure current slider value is always selectable if not in preset */}
                {maxBudget && !maxList.some(o => o.value === String(maxBudget)) && (
                  <option value={maxBudget}>{getLabel(maxBudget, true)}</option>
                )}
                {maxList.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className={styles.selectChevron}>⌵</span>
            </div>
          </div>

          {/* Dual Range Slider (Scrollable bar matching screenshot 4) */}
          <div className={styles.sliderContainer}>
            <div className={styles.sliderTrackBg}>
              <div
                className={styles.sliderTrackHighlight}
                style={{
                  left: `${Math.max(0, minPercent)}%`,
                  width: `${Math.max(0, maxPercent - minPercent)}%`
                }}
              />
            </div>
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={sliderStep}
              value={currentMinNum}
              onChange={handleSliderMinChange}
              className={`${styles.rangeThumb} ${styles.rangeThumbLeft}`}
              aria-label="Min budget slider"
            />
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={sliderStep}
              value={currentMaxNum}
              onChange={handleSliderMaxChange}
              className={`${styles.rangeThumb} ${styles.rangeThumbRight}`}
              aria-label="Max budget slider"
            />
          </div>

          {/* Footer Action: Clear / Done button */}
          <div className={styles.actionsRow}>
            {(minBudget || maxBudget) ? (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => {
                  onClear();
                }}
              >
                Reset
              </button>
            ) : <span />}

            <button
              type="button"
              className={styles.doneBtn}
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
