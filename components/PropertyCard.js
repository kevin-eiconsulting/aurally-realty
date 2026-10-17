import Link from 'next/link';
import styles from './PropertyCard.module.css';
import { formatPrice } from '@/lib/data';

export default function PropertyCard({ property }) {
  const { id, title, area, type, status, price, priceUnit, beds, baths, sqft, image, featured, verified, floor, facing } = property;

  return (
    <Link href={`/property/${id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={image} alt={title} className={styles.image} loading="lazy" />
        <div className={styles.badges}>
          <span className={`prop-badge ${status}`}>{status === 'for-rent' ? 'For Rent' : 'For Sale'}</span>
          {featured && <span className="prop-badge featured">⭐ Featured</span>}
        </div>
        {verified && (
          <div className={styles.verified}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Verified
          </div>
        )}
        <div className={styles.overlay} />
      </div>

      <div className={styles.body}>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(price, priceUnit)}</span>
          <span className={styles.sqft}>{sqft > 0 ? `${sqft} sq.ft` : ''}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.location}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {area}, Chennai
        </p>

        <div className={styles.specs}>
          {beds > 0 && (
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
              </svg>
              {beds} Bed
            </span>
          )}
          {baths > 0 && (
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/>
              </svg>
              {baths} Bath
            </span>
          )}
          {sqft > 0 && (
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
              </svg>
              {sqft} sq.ft
            </span>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.typeTag}>{type}</span>
          <span className={styles.contactBtn}>Contact →</span>
        </div>
      </div>
    </Link>
  );
}
