'use client';
import styles from './AmenitiesSelector.module.css';

export const POPULAR_AMENITIES = [
  { id: 'lift', label: 'Lift / Elevator', icon: '🛗' },
  { id: 'parking', label: 'Covered Parking', icon: '🚗' },
  { id: 'security', label: '24/7 Security Guard', icon: '🛡️' },
  { id: 'power_backup', label: '100% Power Backup', icon: '⚡' },
  { id: 'gym', label: 'Gymnasium / Fitness', icon: '🏋️' },
  { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
  { id: 'rainwater', label: 'Rain Water Harvesting', icon: '🌧️' },
  { id: 'clubhouse', label: 'Club House / Hall', icon: '🏢' },
  { id: 'play_area', label: "Children's Play Area", icon: '🛝' },
  { id: 'solar', label: 'Solar Power Panels', icon: '☀️' },
  { id: 'cctv', label: 'CCTV Surveillance', icon: '📹' },
  { id: 'vastu', label: '100% Vastu Compliant', icon: '🧭' },
  { id: 'piped_gas', label: 'Piped Gas Line', icon: '🔥' },
  { id: 'water_treatment', label: 'Water RO Plant', icon: '💧' },
  { id: 'intercom', label: 'Intercom Facility', icon: '📞' },
  { id: 'park', label: 'Landscaped Garden', icon: '🌳' },
  { id: 'fire_fighting', label: 'Fire Safety System', icon: '🚒' },
  { id: 'waste_disposal', label: 'Waste Management', icon: '🗑️' }
];

export default function AmenitiesSelector({ selected = [], onChange }) {
  const isSelected = (label) => selected.includes(label);

  const toggleAmenity = (label) => {
    if (isSelected(label)) {
      onChange(selected.filter(item => item !== label));
    } else {
      onChange([...selected, label]);
    }
  };

  const handleSelectAll = () => {
    onChange(POPULAR_AMENITIES.map(a => a.label));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <label className={styles.label}>
            Property Amenities & Features
          </label>
          <p className={styles.sublabel}>
            Select the facilities available to buyers or tenants. Highlighting amenities increases inquiry rates by up to 40%.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.textBtn}
            onClick={handleSelectAll}
          >
            Select All
          </button>
          {selected.length > 0 && (
            <button
              type="button"
              className={styles.textBtnDanger}
              onClick={handleClearAll}
            >
              Clear ({selected.length})
            </button>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {POPULAR_AMENITIES.map((amenity) => {
          const active = isSelected(amenity.label);
          return (
            <button
              key={amenity.id}
              type="button"
              className={`${styles.chip} ${active ? styles.chipActive : ''}`}
              onClick={() => toggleAmenity(amenity.label)}
              aria-pressed={active}
            >
              <span className={styles.icon}>{amenity.icon}</span>
              <span className={styles.chipText}>{amenity.label}</span>
              {active ? (
                <span className={styles.check}>✓</span>
              ) : (
                <span className={styles.plus}>+</span>
              )}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className={styles.summaryBar}>
          <span className={styles.summaryCount}>
            ✨ <strong>{selected.length}</strong> {selected.length === 1 ? 'amenity' : 'amenities'} selected
          </span>
          <span className={styles.summaryHint}>
            Will be highlighted with badges on your public listing
          </span>
        </div>
      )}
    </div>
  );
}
