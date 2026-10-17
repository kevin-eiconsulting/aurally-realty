'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { PROPERTIES, AREAS } from '@/lib/data';
import styles from './page.module.css';

const STATS = [
  { num: '12,000+', label: 'Listed Properties' },
  { num: '8,500+', label: 'Happy Families' },
  { num: '150+', label: 'Verified Agents' },
  { num: '15+', label: 'Years Experience' },
];

const SERVICES = [
  { icon: '🏠', title: 'Buy a Home', desc: 'Find your perfect home from thousands of verified listings across Chennai.', href: '/buy' },
  { icon: '🔑', title: 'Rent a Property', desc: 'Discover affordable rental properties that match your lifestyle and budget.', href: '/rent' },
  { icon: '💰', title: 'Sell Your Property', desc: 'List your property for free and reach lakhs of buyers instantly.', href: '/sell' },
  { icon: '📐', title: 'Home Loans', desc: 'Get the best home loan rates from leading banks and NBFCs.', href: '/services' },
  { icon: '⚖️', title: 'Legal Services', desc: 'Hassle-free property documentation and legal advisory.', href: '/services' },
  { icon: '🏗️', title: 'Interior Design', desc: 'Transform your new home with our premium interior design services.', href: '/services' },
];

const AREAS_FEATURED = [
  { name: 'Anna Nagar', count: 248, img: 'https://images.unsplash.com/photo-1596008194705-2091cd6764d4?w=400&q=75' },
  { name: 'T. Nagar', count: 312, img: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&q=75' },
  { name: 'Velachery', count: 189, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=75' },
  { name: 'OMR', count: 275, img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=75' },
  { name: 'Adyar', count: 163, img: 'https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=400&q=75' },
  { name: 'Porur', count: 94, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=75' },
];

const TESTIMONIALS = [
  { name: 'Priya Suresh', role: 'Bought 3BHK in Anna Nagar', text: 'Aurally Realty made our dream home a reality! The team was incredibly professional and helped us every step of the way. Found our perfect home within 2 weeks!', avatar: 'PS', rating: 5 },
  { name: 'Karthik Rajan', role: 'Rented flat in Velachery', text: 'The best real estate platform in Chennai! Found a spacious 2BHK within my budget in just 3 days. The verification process gave me total confidence.', avatar: 'KR', rating: 5 },
  { name: 'Meena Chandran', role: 'Sold property in T. Nagar', text: 'Got the best price for my property! Aurally\'s wide network of buyers helped me close the deal in record time. Truly exceptional service.', avatar: 'MC', rating: 5 },
];

export default function HomePage() {
  const router = useRouter();
  const [searchTab, setSearchTab] = useState('buy');
  const [searchArea, setSearchArea] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchBudget, setSearchBudget] = useState('');

  const featuredProperties = PROPERTIES.filter(p => p.featured);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchArea) params.set('area', searchArea);
    if (searchType) params.set('type', searchType);
    if (searchBudget) params.set('budget', searchBudget);
    router.push(`/${searchTab}?${params.toString()}`);
  };

  return (
    <div className={styles.page}>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroParticles}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.particle} style={{ '--i': i }} />
          ))}
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span>🏡</span> Chennai&apos;s #1 Real Estate Platform
          </div>
          <h1 className={styles.heroTitle}>
            Find Your Perfect<br />
            <span>Home in Chennai</span>
          </h1>
          <p className={styles.heroSub}>
            Discover thousands of verified properties across Chennai — apartments, villas, plots, and more.
          </p>

          {/* Search Box */}
          <div className={styles.searchBox}>
            <div className={styles.searchTabs}>
              {['buy', 'rent', 'sell'].map(tab => (
                <button
                  key={tab}
                  className={`${styles.searchTab} ${searchTab === tab ? styles.searchTabActive : ''}`}
                  onClick={() => setSearchTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <div className={styles.searchField}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <select value={searchArea} onChange={e => setSearchArea(e.target.value)} className={styles.searchSelect}>
                  <option value="">Select Area</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className={styles.searchDivider} />
              <div className={styles.searchField}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
                </svg>
                <select value={searchType} onChange={e => setSearchType(e.target.value)} className={styles.searchSelect}>
                  <option value="">Property Type</option>
                  {['Apartment', 'Villa', 'Plot', 'Commercial', 'PG'].map(t => (
                    <option key={t} value={t.toLowerCase()}>{t}</option>
                  ))}
                </select>
              </div>
              <div className={styles.searchDivider} />
              <div className={styles.searchField}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <select value={searchBudget} onChange={e => setSearchBudget(e.target.value)} className={styles.searchSelect}>
                  <option value="">Budget</option>
                  <option value="10-30">₹10L - ₹30L</option>
                  <option value="30-60">₹30L - ₹60L</option>
                  <option value="60-100">₹60L - ₹1Cr</option>
                  <option value="100+">₹1Cr+</option>
                </select>
              </div>
              <button type="submit" className={styles.searchBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Search
              </button>
            </form>
          </div>

          <div className={styles.heroTags}>
            {['3BHK in Anna Nagar', 'Villa in Adyar', 'Office Space OMR', 'Plot in Tambaram'].map(tag => (
              <button key={tag} className={styles.heroTag} onClick={() => router.push(`/${searchTab}?q=${encodeURIComponent(tag)}`)}>{tag}</button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className="container">
            <div className={styles.statsGrid}>
              {STATS.map(s => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROPERTIES ===== */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <span className="section-badge">🏠 Hot Properties</span>
              <h2 className="section-title">Featured <span>Listings</span></h2>
              <p className="section-sub">Hand-picked, verified properties from across Chennai</p>
            </div>
            <Link href="/buy" className="btn-secondary">View All Properties →</Link>
          </div>
          <div className={styles.propGrid}>
            {featuredProperties.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className={styles.serviceSection}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-badge">⚡ What We Offer</span>
            <h2 className="section-title">Everything You Need in <span>One Place</span></h2>
            <p className="section-sub" style={{ margin: '10px auto 0' }}>From finding a home to legal services — we've got you covered.</p>
          </div>
          <div className={styles.serviceGrid}>
            {SERVICES.map(s => (
              <Link key={s.title} href={s.href} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceDesc}>{s.desc}</p>
                <span className={styles.serviceArrow}>Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR AREAS ===== */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div>
              <span className="section-badge">📍 Explore Chennai</span>
              <h2 className="section-title">Popular <span>Areas</span></h2>
              <p className="section-sub">Browse properties in Chennai&apos;s most sought-after localities</p>
            </div>
          </div>
          <div className={styles.areasGrid}>
            {AREAS_FEATURED.map(a => (
              <Link key={a.name} href={`/buy?area=${a.name}`} className={styles.areaCard}>
                <img src={a.img} alt={a.name} className={styles.areaImg} loading="lazy" />
                <div className={styles.areaOverlay} />
                <div className={styles.areaInfo}>
                  <h3 className={styles.areaName}>{a.name}</h3>
                  <p className={styles.areaCount}>{a.count} Properties</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POST PROPERTY CTA ===== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeft}>
              <h2 className={styles.ctaTitle}>Ready to Sell or Rent Your Property?</h2>
              <p className={styles.ctaSub}>List your property for FREE and connect with thousands of genuine buyers and tenants across Chennai.</p>
              <div className={styles.ctaBtns}>
                <Link href="/sell" className="btn-primary">Post Property FREE</Link>
                <Link href="/services" className="btn-ghost">Learn More</Link>
              </div>
            </div>
            <div className={styles.ctaRight}>
              <div className={styles.ctaFeatures}>
                {['✅ 100% Free Listing', '✅ Verified Buyers Only', '✅ Instant Notifications', '✅ Legal Support'].map(f => (
                  <span key={f} className={styles.ctaFeature}>{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={styles.section}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-badge">💬 Testimonials</span>
            <h2 className="section-title">What Our <span>Clients Say</span></h2>
            <p className="section-sub" style={{ margin: '10px auto 0' }}>Join thousands of satisfied customers who found their dream property.</p>
          </div>
          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.stars}>{'⭐'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.avatar}>{t.avatar}</div>
                  <div>
                    <p className={styles.authorName}>{t.name}</p>
                    <p className={styles.authorRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
