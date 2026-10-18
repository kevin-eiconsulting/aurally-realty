'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import HorizontalPropertyCard from '@/components/HorizontalPropertyCard';
import { fetchProperties } from '@/lib/properties';
import { TAMIL_NADU_CITIES, CITY_AREAS, PROPERTY_TYPE_OPTIONS } from '@/lib/data';
import styles from '../buy/page.module.css';

function RentPageContent() {
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
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
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

  // Sync search queries from top search bar
  useEffect(() => {
    const handleSearchQueryChange = (e) => {
      if (e.detail) {
        if (typeof e.detail.q === 'string') setSearchQuery(e.detail.q);
        if (typeof e.detail.area === 'string') setArea(e.detail.area);
        if (typeof e.detail.city === 'string') setCity(e.detail.city === 'All Tamil Nadu' ? '' : e.detail.city);
      }
    };
    window.addEventListener('searchQueryChange', handleSearchQueryChange);
    return () => window.removeEventListener('searchQueryChange', handleSearchQueryChange);
  }, []);

  // Fetch properties
  useEffect(() => {
    setLoading(true);
    fetchProperties({ status: 'for-rent', city: city === 'All Tamil Nadu' ? '' : city })
      .then(data => setAllProps(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [city]);

  // Client-side filtering
  const filtered = allProps.filter(p => {
    if (p.status !== 'for-rent') return false;
    if (area && p.area?.toLowerCase() !== area.toLowerCase()) return false;
    if (selectedTypes.length > 0) {
      const pType = (p.type || '').toLowerCase();
      const match = selectedTypes.some(t => {
        const normT = t.toLowerCase();
        return pType === normT || pType.includes(normT) || normT.includes(pType);
      });
      if (!match) return false;
    }
    if (selectedBeds && p.beds !== parseInt(selectedBeds)) return false;
    if (onlyVerified && !p.verified) return false;

    // Search query filter (title, area, city, type, specs, beds)
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        p.title?.toLowerCase().includes(q) ||
        p.area?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.type?.toLowerCase().includes(q) ||
        `${p.beds} bhk`.toLowerCase().includes(q) ||
        `${p.beds}bhk`.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Quick filters
    if (activeQuickFilter === 'verified' && !p.verified) return false;
    if (activeQuickFilter === 'new' && p.age !== 'New') return false;

    // Rental Budget range in Rupees
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
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedBeds('');
    setMinBudget('');
    setMaxBudget('');
    setOnlyVerified(false);
    setActiveQuickFilter('');
    window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: { q: '', area: '' } }));
  };


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
            <span className={styles.bcCurrent}>Flats for Rent</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Main 99acres 2-Column Layout */}
        <div className={styles.catalogLayout}>
          {/* ================= LEFT SIDEBAR FILTERS ================= */}
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <div className={styles.filterHeader}>
                <h3 className={styles.filterTitle}>Applied Filters</h3>
                {(area || searchQuery || selectedTypes.length > 0 || selectedBeds || onlyVerified || minBudget || maxBudget) && (
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
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: { q: '' } }));
                    }}
                    className={styles.filterChipRemovable}
                  >
                    "{searchQuery}" <span className={styles.chipClose}>✕</span>
                  </button>
                )}
                {area && (
                  <button type="button" onClick={() => setArea('')} className={styles.filterChipRemovable}>
                    {area} <span className={styles.chipClose}>✕</span>
                  </button>
                )}
                {selectedTypes.map(t => {
                  const opt = PROPERTY_TYPE_OPTIONS.find(o => o.id === t);
                  const label = opt ? opt.label : t;
                  return (
                    <button key={t} type="button" onClick={() => toggleType(t)} className={styles.filterChipRemovable}>
                      {label} <span className={styles.chipClose}>✕</span>
                    </button>
                  );
                })}
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


              {/* Rental Budget */}
              <div className={styles.filterGroup}>
                <label className={styles.groupLabel}>Monthly Rent</label>
                <div className={styles.budgetRow}>
                  <select
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    className={styles.budgetSelect}
                  >
                    <option value="">No min</option>
                    <option value="10000">₹10,000</option>
                    <option value="15000">₹15,000</option>
                    <option value="25000">₹25,000</option>
                  </select>
                  <span className={styles.budgetTo}>to</span>
                  <select
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className={styles.budgetSelect}
                  >
                    <option value="">No max</option>
                    <option value="20000">₹20,000</option>
                    <option value="35000">₹35,000</option>
                    <option value="70000">₹70,000</option>
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
                    { id: '3', label: '3 BHK' }
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
                <strong>{sorted.length} results</strong> | Flats for rent in {area ? `${area}, ${city}` : city}
              </h1>

              {/* 99acres Horizontal Quick Filters Bar */}
              <div className={styles.quickFiltersBar}>
                <div className={styles.quickFilterTags}>
                  <button
                    type="button"
                    onClick={() => setActiveQuickFilter(activeQuickFilter === 'owner' ? '' : 'owner')}
                    className={`${styles.quickTag} ${activeQuickFilter === 'owner' ? styles.quickTagActive : ''}`}
                  >
                    Owner Listings
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
                    onClick={() => setActiveQuickFilter(activeQuickFilter === 'new' ? '' : 'new')}
                    className={`${styles.quickTag} ${activeQuickFilter === 'new' ? styles.quickTagActive : ''}`}
                  >
                    Recently Listed
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
                    <option value="price-low">Rent: Low to High</option>
                    <option value="price-high">Rent: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Properties List */}
            {loading ? (
              <div className={styles.loadingBox}>
                <div className={styles.spinner} />
                <p>Loading verified rental homes in {city}...</p>
              </div>
            ) : sorted.length > 0 ? (
              <div className={styles.cardsList}>
                {sorted.map(p => (
                  <HorizontalPropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className={styles.noResultsBox}>
                <div className={styles.noResultsIcon}>🔑</div>
                <h3>No rental properties match your active filters</h3>
                <p>Try resetting your budget or selecting another locality in {city}</p>
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

export default function RentPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading rentals...</div>}>
      <RentPageContent />
    </Suspense>
  );
}
