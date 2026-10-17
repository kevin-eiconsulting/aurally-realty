'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, signOutUser } from '@/lib/auth';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/rent' },
  { label: 'Sell', href: '/sell' },
  { label: 'Services', href: '/services' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    getCurrentUser().then(u => setUser(u)).catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await signOutUser();
    setUser(null);
    router.push('/');
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.nav}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L26 10V26H18V18H10V26H2V10L14 2Z" fill="white"/>
              <circle cx="14" cy="13" r="3" fill="#f26b2b"/>
            </svg>
          </div>
          <span className={styles.logoText}>Aurally<span>Realty</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
              {pathname === link.href && <span className={styles.activeBar} />}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: 600 }}>
                👤 {user.username}
                {user.isAdmin && (
                  <Link href="/admin" style={{ marginLeft: '6px', fontSize: '11px', background: '#f26b2b', color: '#fff', padding: '2px 6px', borderRadius: '4px', textDecoration: 'none' }}>
                    Admin
                  </Link>
                )}
              </span>
              <button
                onClick={handleLogout}
                style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#4b5563', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>Log In</Link>
          )}
          <Link href="/sell" className={styles.postBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Post Property
          </Link>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? styles.barOpen1 : styles.bar} />
            <span className={menuOpen ? styles.barOpen2 : styles.bar} />
            <span className={menuOpen ? styles.barOpen3 : styles.bar} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
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
        <Link href="/login" className={styles.mobileLink}>Log In</Link>
        <Link href="/sell" className={styles.mobilePostBtn}>+ Post Property FREE</Link>
      </div>
    </header>
  );
}
