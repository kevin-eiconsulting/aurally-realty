'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import HorizontalPropertyCard from '@/components/HorizontalPropertyCard';
import { fetchProperties } from '@/lib/properties';
import { TAMIL_NADU_CITIES, CITY_AREAS } from '@/lib/data';
import styles from './page.module.css';

const PROPERTY_TYPE_OPTIONS = [
  { id: 'apartment', label: 'Residential Apartment' },
  { id: 'villa', label: 'Independent House/Villa' },
  { id: 'plot', label: 'Residential Land / Plot' },
  { id: 'commercial', label: 'Commercial Space' }
];

function BuyPageContent() {
  const searchParams = useSearchParams();

  // Filters state
  const [city, setCity] = useState(() => {
    // Priority: URL param > localStorage > default
    if (searchParams.get('city')) return searchParams.get('city');
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aurally_selected_city');
      if (saved && saved !== 'All Tamil Nadu') return saved;
    }
    return 'Chennai';
  });
  const [area, setArea] = useState(searchParams.get('area') || '');
  const [selectedTypes, setSelectedTypes] = useState(searchParams.get('type') ? [searchParams.get('type').toLowerCase()] : []);
  const [selectedBeds, setSelectedBeds] = useState(searchParams.get('beds') || '');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState('');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'featured');

  const [allProps, setAllProps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync city with global city changes
  useEffect(() => {
    const handleCityEvent = (e) => {
      if (e.detail) {
        setCity(e.detail === 'All Tamil Nadu' ? '' : e.detail);
        setArea('');
      }
    };
    window.addEventListener('cityChange', handleCityEvent);
    return () => window.removeEventListener('cityChange', handleCityEvent);
  }, []);

  // Fetch properties
  useEffect(() => {
    setLoading(true);
    fetchProperties({ status: 'for-sale', city: city === 'All Tamil Nadu' ? '' : city })
      .then(data => setAllProps(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city]);

  // Client-side filtering
  const filtered = allProps.filter(p => {
    if (p.status !== 'for-sale') return false;
    if (area && p.area?.toLowerCase() !== area.toLowerCase()) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(p.type?.toLowerCase())) return false;
    if (selectedBeds && p.beds !== parseInt(selectedBeds)) return false;
    if (onlyVerified && !p.verified) return false;

    // Quick filters
    if (activeQuickFilter === 'verified' && !p.verified) return false;
    if (activeQuickFilter === 'new' && p.age !== 'New') return false;
    if (activeQuickFilter === 'ready' && p.age !== 'New') return false;

    // Budget range in Lakhs
    if (minBudget && p.price < Number(minBudget)) return false;
    if (maxBudget && p.price > Number(maxBudget)) return false;

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const toggleType = (tId) => {
    if (selectedTypes.includes(tId)) {
      setSelectedTypes(selectedTypes.filter(t => t !== tId));
    } else {
      setSelectedTypes([...selectedTypes, tId]);
    }
  };

  const clearAllFilters = () => {
    setArea('');
    setSelectedTypes([]);
    setSelectedBeds('');
    setMinBudget('');
    setMaxBudget('');
    setOnlyVerified(false);
    setActiveQuickFilter('');
  };

  const activeAreas = CITY_AREAS[city] || CITY_AREAS['Chennai'];

  return (
    <div className={styles.page}>
      {/* Top Breadcrumb Bar */}
      <div className={styles.topBreadcrumbBar}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.bcLink}>Home</Link>
            <span className={styles.bcSep}>›</span>
            <span>Property in {city}</span>
            <span className={styles.bcSep}>›</span>
            <span className={styles.bcCurrent}>Flats for Sale</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Main 99acres 2-Column Layout */}
        <div className={styles.catalogLayout}>
          {/* ================= LEFT SIDEBAR FILTERS ================= */}
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              {/* Applied Filters header */}
              <div className={styles.filterHeader}>
                <h3 className={styles.filterTitle}>Applied Filters</h3>
                {(area || selectedTypes.length > 0 || selectedBeds || onlyVerified || minBudget || maxBudget) && (
                  <button type="button" onClick={clearAllFilters} className={styles.clearAllBtn}>
                    Clear All
                  </button>
                )}
              </div>

              {/* Active Filter Chips */}
              <div className={styles.activeChipsRow}>
                {city && city !== 'All Tamil Nadu' && (
                  <span className={styles.filterChip}>
                    📍 {city}
                  </span>
                )}
                {area && (
                  <button type="button" onClick={() => setArea('')} className={styles.filterChipRemovable}>
                    {area} <span className={styles.chipClose}>✕</span>
                  </button>
                )}
                {selectedTypes.map(t => (
                  <button key={t} type="button" onClick={() => toggleType(t)} className={styles.filterChipRemovable}>
                    {t.charAt(0).toUpperCase() + t.slice(1)} <span className={styles.chipClose}>✕</span>
                  </button>
                ))}
                {selectedBeds && (
                  <button type="button" onClick={() => setSelectedBeds('')} className={styles.filterChipRemovable}>
                    {selectedBeds} BHK <span className={styles.chipClose}>✕</span>
                  </button>
                )}
              </div>

              <div className={styles.filterDivider} />

              {/* Verified properties toggle */}
              <div className={styles.verifiedToggleRow}>
                <div className={styles.verifiedLabelBox}>
                  <span className={styles.verifiedGreenBadge}>✔ Verified</span>
                  <span className={styles.verifiedSubText}>by Aurally verification team</span>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.filterDivider} />

              {/* City & Locality */}
              <div className={styles.filterGroup}>
                <label className={styles.groupLabel}>City (Tamil Nadu)</label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setArea('');
                  }}
                  className={styles.filterSelect}
                >
                  <option value="All Tamil Nadu">All Tamil Nadu</option>
                  {TAMIL_NADU_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.groupLabel}>Locality / Area</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">All Localities in {city}</option>
                  {activeAreas.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterDivider} />

              {/* Budget */}
              <div className={styles.filterGroup}>
                <label className={styles.groupLabel}>Budget</label>
                <div className={styles.budgetRow}>
                  <select
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    className={styles.budgetSelect}
                  >
                    <option value="">No min</option>
                    <option value="20">₹20 Lakh</option>
                    <option value="40">₹40 Lakh</option>
                    <option value="60">₹60 Lakh</option>
                    <option value="100">₹1 Crore</option>
                  </select>
                  <span className={styles.budgetTo}>to</span>
                  <select
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className={styles.budgetSelect}
                  >
                    <option value="">No max</option>
                    <option value="50">₹50 Lakh</option>
                    <option value="80">₹80 Lakh</option>
                    <option value="150">₹1.5 Crore</option>
                    <option value="300">₹3 Crore</option>
                  </select>
                </div>
              </div>

              <div className={styles.filterDivider} />

              {/* Type of Property */}
              <div className={styles.filterGroup}>
                <div className={styles.groupHeaderRow}>
                  <label className={styles.groupLabel}>Type of property</label>
                  {selectedTypes.length > 0 && (
                    <button type="button" onClick={() => setSelectedTypes([])} className={styles.smallClearBtn}>
                      Clear
                    </button>
                  )}
                </div>
                <div className={styles.typePillList}>
                  {PROPERTY_TYPE_OPTIONS.map(opt => {
                    const isSelected = selectedTypes.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleType(opt.id)}
                        className={`${styles.typePill} ${isSelected ? styles.typePillActive : ''}`}
                      >
                        <span className={styles.plusIcon}>{isSelected ? '✔' : '+'}</span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.filterDivider} />

              {/* Bedrooms (BHK) */}
              <div className={styles.filterGroup}>
                <label className={styles.groupLabel}>Bedrooms</label>
                <div className={styles.bhkGrid}>
                  {[
                    { id: '', label: 'All' },
                    { id: '1', label: '1 BHK' },
                    { id: '2', label: '2 BHK' },
                    { id: '3', label: '3 BHK' },
                    { id: '4', label: '4+ BHK' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBeds(b.id)}
                      className={`${styles.bhkPill} ${selectedBeds === b.id ? styles.bhkPillActive : ''}`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT RESULTS COLUMN ================= */}
          <main className={styles.resultsCol}>
            {/* 99acres Top Count & Insights */}
            <div className={styles.resultsHeadingWrap}>
              <h1 className={styles.mainTitle}>
                <strong>{sorted.length} results</strong> | Flats for sale in {area ? `${area}, ${city}` : city}
              </h1>

              {/* 99acres Horizontal Quick Filters Bar */}
              <div className={styles.quickFiltersBar}>
                <div className={styles.quickFilterTags}>
                  <button
                    type="button"
                    onClick={() => setActiveQuickFilter(activeQuickFilter === 'new' ? '' : 'new')}
                    className={`${styles.quickTag} ${activeQuickFilter === 'new' ? styles.quickTagActive : ''}`}
                  >
                    ⚡ NEW LAUNCH
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveQuickFilter(activeQuickFilter === 'owner' ? '' : 'owner')}
                    className={`${styles.quickTag} ${activeQuickFilter === 'owner' ? styles.quickTagActive : ''}`}
                  >
                    Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveQuickFilter(activeQuickFilter === 'verified' ? '' : 'verified')}
                    className={`${styles.quickTag} ${activeQuickFilter === 'verified' ? styles.quickTagActive : ''}`}
                  >
                    Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveQuickFilter(activeQuickFilter === 'ready' ? '' : 'ready')}
                    className={`${styles.quickTag} ${activeQuickFilter === 'ready' ? styles.quickTagActive : ''}`}
                  >
                    Ready To Move
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className={styles.sortWrap}>
                  <span className={styles.sortLabel}>Sort By :</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="featured">Featured ⌵</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Properties List */}
            {loading ? (
              <div className={styles.loadingBox}>
                <div className={styles.spinner} />
                <p>Loading verified properties in {city}...</p>
              </div>
            ) : sorted.length > 0 ? (
              <div className={styles.cardsList}>
                {sorted.map(p => (
                  <HorizontalPropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className={styles.noResultsBox}>
                <div className={styles.noResultsIcon}>🏡</div>
                <h3>No properties match your active filters</h3>
                <p>Try resetting some filters or selecting another Tamil Nadu locality</p>
                <button type="button" onClick={clearAllFilters} className={styles.resetBtn}>
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading properties...</div>}>
      <BuyPageContent />
    </Suspense>
  );
}
