'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { fetchProperties } from '@/lib/properties';
import { AREAS } from '@/lib/data';
import styles from './page.module.css';

export default function BuyPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({ area: '', type: '', beds: '', budget: '' });
  const [sortBy, setSortBy] = useState('featured');
  const [allProps, setAllProps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFilters(f => ({
      ...f,
      area: searchParams.get('area') || '',
      type: searchParams.get('type') || '',
    }));

    fetchProperties({ status: 'for-sale' })
      .then(data => setAllProps(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const properties = allProps.filter(p => {
    if (p.status !== 'for-sale') return false;
    if (filters.area && p.area !== filters.area) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.beds && p.beds !== parseInt(filters.beds)) return false;
    return true;
  });

  const sorted = [...properties].sort((a, b) => {
    if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className={styles.page}>
      {/* Page Hero */}
      <div className={styles.pageHero}>
        <div className="container">
          <h1 className={styles.pageTitle}>Buy Properties in <span>Chennai</span></h1>
          <p className={styles.pageSub}>Find verified apartments, villas, plots & more at the best prices</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterCard}>
            <h3 className={styles.filterTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filter Properties
            </h3>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Area / Locality</label>
              <select className="form-select" value={filters.area} onChange={e => setFilters({...filters, area: e.target.value})}>
                <option value="">All Areas</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Property Type</label>
              <select className="form-select" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                <option value="">All Types</option>
                {['apartment', 'villa', 'plot', 'commercial'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Bedrooms</label>
              <div className={styles.bedBtns}>
                {['', '1', '2', '3', '4'].map(b => (
                  <button key={b} className={`${styles.bedBtn} ${filters.beds === b ? styles.bedBtnActive : ''}`} onClick={() => setFilters({...filters, beds: b})}>
                    {b === '' ? 'Any' : `${b} BHK`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Budget Range</label>
              <select className="form-select" value={filters.budget} onChange={e => setFilters({...filters, budget: e.target.value})}>
                <option value="">Any Budget</option>
                <option value="30">Under ₹30L</option>
                <option value="60">₹30L - ₹60L</option>
                <option value="100">₹60L - ₹1Cr</option>
                <option value="100+">Above ₹1Cr</option>
              </select>
            </div>

            <button className="btn-primary" style={{width:'100%', marginTop:'8px'}} onClick={() => setFilters({area:'',type:'',beds:'',budget:''})}>
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Results */}
        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}><strong>{sorted.length}</strong> properties for sale</p>
            <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {sorted.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsEmoji}>🏠</span>
              <h3>No properties found</h3>
              <p>Try adjusting your filters</p>
              <button className="btn-primary" onClick={() => setFilters({area:'',type:'',beds:'',budget:''})}>Clear Filters</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {sorted.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
