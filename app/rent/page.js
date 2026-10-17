'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { fetchProperties } from '@/lib/properties';
import { AREAS } from '@/lib/data';
import styles from '../buy/page.module.css';

export default function RentPage() {
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

    fetchProperties({ status: 'for-rent' })
      .then(data => setAllProps(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const properties = allProps.filter(p => {
    if (p.status !== 'for-rent') return false;
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
      <div className={styles.pageHero}>
        <div className="container">
          <h1 className={styles.pageTitle}>Rent Properties in <span>Chennai</span></h1>
          <p className={styles.pageSub}>Discover affordable, verified rental homes across Chennai</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <div className={styles.filterCard}>
            <h3 className={styles.filterTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filter Rentals
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
                {['apartment', 'villa', 'commercial'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Bedrooms</label>
              <div className={styles.bedBtns}>
                {['', '1', '2', '3'].map(b => (
                  <button key={b} className={`${styles.bedBtn} ${filters.beds === b ? styles.bedBtnActive : ''}`} onClick={() => setFilters({...filters, beds: b})}>
                    {b === '' ? 'Any' : `${b} BHK`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Monthly Rent</label>
              <select className="form-select" value={filters.budget} onChange={e => setFilters({...filters, budget: e.target.value})}>
                <option value="">Any Rent</option>
                <option value="10000">Under ₹10,000</option>
                <option value="20000">₹10K - ₹20K</option>
                <option value="40000">₹20K - ₹40K</option>
                <option value="40000+">Above ₹40K</option>
              </select>
            </div>

            <button className="btn-primary" style={{width:'100%', marginTop:'8px'}} onClick={() => setFilters({area:'',type:'',beds:'',budget:''})}>
              Clear Filters
            </button>
          </div>
        </aside>

        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}><strong>{sorted.length}</strong> properties for rent</p>
            <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Rent: Low to High</option>
              <option value="price-high">Rent: High to Low</option>
            </select>
          </div>
          {sorted.length === 0 ? (
            <div className={styles.noResults}>
              <span className={styles.noResultsEmoji}>🔑</span>
              <h3>No rentals found</h3>
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
