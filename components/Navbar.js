'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, signOutUser } from '@/lib/auth';
import { TAMIL_NADU_CITIES } from '@/lib/data';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/rent' },
  { label: 'Sell', href: '/sell' },
  { label: 'Services', href: '/services' },
];

export default function Navbar({ hideBottomBar = false, logoOnly = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    getCurrentUser().then(u => setUser(u)).catch(() => setUser(null));
  }, [pathname]);

  // Load and listen to city changes
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('aurally_selected_city') : null;
    if (saved) setSelectedCity(saved);

    const handleCityEvent = (e) => {
      if (e.detail) setSelectedCity(e.detail);
    };
    window.addEventListener('cityChange', handleCityEvent);

    const handleClickOutside = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('cityChange', handleCityEvent);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeCity = (city) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurally_selected_city', city);
      window.dispatchEvent(new CustomEvent('cityChange', { detail: city }));
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    router.push('/');
  };

  // Logo-only mode for auth pages (login/signup)
  if (logoOnly) {
    return (
      <header className={styles.header}>
        <div className={styles.topBar}>
          <div className={`container ${styles.topBarInner}`}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L26 10V26H18V18H10V26H2V10L14 2Z" fill="#f26b2b"/>
                  <circle cx="14" cy="13" r="3" fill="#ffffff"/>
                </svg>
              </div>
              <span className={styles.logoText}>Aurally<span>Realty</span></span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      {/* ===== TIER 1: ORANGE BRANDING & UTILITY BAR ===== */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          {/* Logo & City Selector */}
          <div className={styles.leftGroup}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L26 10V26H18V18H10V26H2V10L14 2Z" fill="#f26b2b"/>
                  <circle cx="14" cy="13" r="3" fill="#ffffff"/>
                </svg>
              </div>
              <span className={styles.logoText}>Aurally<span>Realty</span></span>
            </Link>

            {/* City Selector */}
            <div className={styles.citySelectorContainer} ref={cityDropdownRef}>
              <button
                type="button"
                className={styles.citySelectorBtn}
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                aria-label="Select City"
              >
                <span className={styles.cityName}>{selectedCity}</span>
                <svg className={`${styles.cityArrow} ${cityDropdownOpen ? styles.arrowOpen : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {cityDropdownOpen && (
                <div className={styles.cityDropdownMenu}>
                  <div className={styles.cityDropdownHeader}>Tamil Nadu Cities</div>
                  <button
                    type="button"
                    className={`${styles.cityOption} ${selectedCity === 'All Tamil Nadu' ? styles.cityActive : ''}`}
                    onClick={() => changeCity('All Tamil Nadu')}
                  >
                    <span>🏛️ All Tamil Nadu</span>
                  </button>
                  <div className={styles.cityDivider} />
                  {TAMIL_NADU_CITIES.map(city => (
                    <button
                      key={city}
                      type="button"
                      className={`${styles.cityOption} ${selectedCity === city ? styles.cityActive : ''}`}
                      onClick={() => changeCity(city)}
                    >
                      <span className={styles.cityOptionDot} />
                      <span>{city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: User / Login & Post Property */}
          <div className={styles.rightGroup}>
            {user ? (
              <div className={styles.userInfo}>
                <span className={styles.userLabel}>
                  👤 {user.username}
                  {user.isAdmin && (
                    <Link href="/admin" className={styles.adminBadge}>
                      Admin
                    </Link>
                  )}
                </span>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.topLoginBtn}>
                Login
              </Link>
            )}

            {/* Post Property Button */}
            <Link href="/sell" className={styles.postBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f26b2b" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Post Property</span>
            </Link>

            <button
              className={styles.mobileMenuToggle}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={menuOpen ? styles.barOpen1 : styles.bar} />
              <span className={menuOpen ? styles.barOpen2 : styles.bar} />
              <span className={menuOpen ? styles.barOpen3 : styles.bar} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== TIER 2: WHITE SUB-NAV BAR (BUY, RENT, SELL, SERVICES) ===== */}
      {!hideBottomBar && (
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomBarInner}`}>
          <nav className={styles.desktopNav}>
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
              >
                <span>{link.label}</span>
                {pathname === link.href && <span className={styles.navActiveIndicator} />}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      )}

      {/* ===== MOBILE ACCORDION MENU ===== */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileCitySelect}>
          <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600 }}>City:</span>
          <select 
            value={selectedCity} 
            onChange={(e) => changeCity(e.target.value)}
            className={styles.mobileCityInput}
          >
            <option value="All Tamil Nadu">All Tamil Nadu</option>
            {TAMIL_NADU_CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.mobileDivider} />
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ''}`}
          >
            {link.label}
          </Link>
        ))}
        <div className={styles.mobileDivider} />
        <Link href="/login" className={styles.mobileLink}>Login</Link>
        <Link href="/sell" className={styles.mobilePostBtn}>+ Post Property</Link>
      </div>
    </header>
  );
}
