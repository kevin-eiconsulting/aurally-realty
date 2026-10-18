'use client';
import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/data';
import styles from './HorizontalPropertyCard.module.css';

export default function HorizontalPropertyCard({ property }) {
  const [showPhone, setShowPhone] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const {
    id,
    title,
    area,
    city = 'Chennai',
    type,
    status,
    price,
    priceUnit,
    beds,
    baths,
    sqft,
    image,
    images = [],
    featured,
    verified,
    floor = 'Ground',
    facing = 'East',
    age = 'New',
    furnishing = 'Semi Furnished',
    owner = 'Property Owner',
    phone = '9840012345',
    description = ''
  } = property;

  const photoCount = images.length > 0 ? images.length : 4;
  const ratePerSqft = sqft > 0 && status === 'for-sale' ? Math.round((price * 100000) / sqft) : null;

  return (
    <div className={styles.card}>
      {/* Left Image Section */}
      <div className={styles.imageWrap}>
        <img src={image} alt={title} className={styles.image} loading="lazy" />
        
        {featured && <span className={styles.featuredBadge}>FEATURED</span>}

        <button
          type="button"
          className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsFav(!isFav);
          }}
          aria-label="Save Property"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#f26b2b' : 'none'} stroke={isFav ? '#f26b2b' : '#ffffff'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <span className={styles.photoCountBadge}>📷 {photoCount} Photos</span>
      </div>

      {/* Right Content Section */}
      <div className={styles.contentWrap}>
        {/* Title & Location Header */}
        <div className={styles.headerRow}>
          <div>
            <Link href={`/property/${id}`} className={styles.titleLink}>
              <h3 className={styles.title}>{title}</h3>
            </Link>
            <p className={styles.subtitle}>
              {beds > 0 ? `${beds} BHK ` : ''}
              {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Property'} in{' '}
              <strong>{area}</strong>, {city}
              {verified && (
                <span className={styles.verifiedTag}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Pricing & Metric Grid Row */}
        <div className={styles.metricGrid}>
          {/* Price Metric */}
          <div className={styles.metricItem}>
            <div className={styles.priceRow}>
              <span className={styles.priceValue}>{formatPrice(price, priceUnit)}</span>
            </div>
            {ratePerSqft && (
              <span className={styles.rateText}>₹{ratePerSqft.toLocaleString('en-IN')} /sqft</span>
            )}
          </div>

          {/* Area Metric */}
          <div className={styles.metricItem}>
            <div className={styles.metricValue}>
              {sqft > 0 ? `${sqft.toLocaleString('en-IN')} sqft` : 'NA'}
            </div>
            <span className={styles.metricSub}>Super Built-up Area</span>
          </div>

          {/* Status / Age Metric */}
          <div className={styles.metricItem}>
            <div className={styles.metricValue}>
              {beds > 0 ? `${beds} Beds • ${baths || 1} Baths` : type}
            </div>
            <span className={styles.metricSub}>{age === 'New' ? 'Ready To Move' : `${age} Old`}</span>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className={styles.highlightsBar}>
          <span className={styles.highlightLabel}>Highlights :</span>
          <span className={styles.highlightPill}>{floor}</span>
          <span className={styles.highlightDot}>•</span>
          <span className={styles.highlightPill}>{facing} Facing</span>
          <span className={styles.highlightDot}>•</span>
          <span className={styles.highlightPill}>{furnishing}</span>
        </div>

        {/* Description snippet */}
        <p className={styles.descSnippet}>
          {description || `Premium ${beds > 0 ? beds + ' BHK ' : ''}${type} situated in the heart of ${area}, ${city}. Excellent natural lighting, prime road connectivity, and high appreciation potential.`}
        </p>

        {/* Bottom Actions Row */}
        <div className={styles.bottomRow}>
          <div className={styles.sellerInfo}>
            <span className={styles.sellerAvatar}>👤</span>
            <div>
              <span className={styles.sellerName}>{owner}</span>
              <span className={styles.sellerTag}>Verified Seller</span>
            </div>
          </div>

          <div className={styles.actionsGroup}>
            <button
              type="button"
              className={styles.viewNumberBtn}
              onClick={() => setShowPhone(!showPhone)}
            >
              📞 {showPhone ? phone : 'View Number'}
            </button>

            <Link href={`/property/${id}`} className={styles.contactBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
