import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerTop}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L26 10V26H18V18H10V26H2V10L14 2Z" fill="white"/>
                <circle cx="14" cy="13" r="3" fill="#f26b2b"/>
              </svg>
            </div>
            <span className={styles.logoText}>Aurally<span>Realty</span></span>
          </div>
          <p className={styles.tagline}>
            Chennai&apos;s most trusted real estate platform. Find, rent, buy or sell your dream property with ease.
          </p>
          <div className={styles.socials}>
            {['facebook', 'instagram', 'twitter', 'youtube'].map(s => (
              <a key={s} href="#" className={styles.socialIcon} aria-label={s}>
                <SocialIcon name={s} />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className={styles.linksGroup}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/buy">Buy Property</Link></li>
            <li><Link href="/rent">Rent Property</Link></li>
            <li><Link href="/sell">Sell Property</Link></li>
            <li><Link href="/services">Services</Link></li>
          </ul>
        </div>

        <div className={styles.linksGroup}>
          <h4>Property Types</h4>
          <ul>
            <li><Link href="/buy?type=apartment">Apartments</Link></li>
            <li><Link href="/buy?type=villa">Villas</Link></li>
            <li><Link href="/buy?type=plot">Plots / Land</Link></li>
            <li><Link href="/buy?type=commercial">Commercial</Link></li>
            <li><Link href="/buy?type=pg">PG / Hostel</Link></li>
          </ul>
        </div>

        <div className={styles.linksGroup}>
          <h4>Chennai Areas</h4>
          <ul>
            {['Anna Nagar', 'T. Nagar', 'Velachery', 'OMR', 'Adyar', 'Porur'].map(area => (
              <li key={area}><Link href={`/buy?area=${area}`}>{area}</Link></li>
            ))}
          </ul>
        </div>

        <div className={styles.linksGroup}>
          <h4>Contact Us</h4>
          <ul className={styles.contactList}>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              No. 45, Anna Salai, Chennai - 600 002
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +91 98765 43210
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              hello@aurallyrealty.in
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <p>© {new Date().getFullYear()} Aurally Realty. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }) {
  const icons = {
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor"/>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    twitter: <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" fill="currentColor"/>,
    youtube: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></>,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {icons[name]}
    </svg>
  );
}
