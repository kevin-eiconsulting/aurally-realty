'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, signOutUser } from '@/lib/auth';
import { TAMIL_NADU_CITIES, CITY_AREAS, POPULAR_TN_HUBS } from '@/lib/data';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/rent' },
  { label: 'Sell', href: '/sell' },
  { label: 'Materials', href: '/materials' },
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  // 99acres Explore modal states
  const [exploreTab, setExploreTab] = useState('buy');
  const [exploreType, setExploreType] = useState('Residential');
  const [exploreCityInput, setExploreCityInput] = useState('');
  const [exploreInputFocused, setExploreInputFocused] = useState(false);
  const [showAllDistricts, setShowAllDistricts] = useState(false);


  // Listing page search bar state
  const isListingPage = pathname === '/buy' || pathname === '/rent';
  const [searchType, setSearchType] = useState(() => (pathname === '/rent' ? 'Rent' : 'Buy'));
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [listingCityDropdownOpen, setListingCityDropdownOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const typeDropdownRef = useRef(null);
  const listingCityDropdownRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    getCurrentUser().then(u => setUser(u)).catch(() => setUser(null));
  }, [pathname]);

  // Sync searchType with pathname
  useEffect(() => {
    if (pathname === '/rent') setSearchType('Rent');
    else if (pathname === '/buy') setSearchType('Buy');
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
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setTypeDropdownOpen(false);
      }
      if (listingCityDropdownRef.current && !listingCityDropdownRef.current.contains(e.target)) {
        setListingCityDropdownOpen(false);
      }
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setSuggestionsOpen(false);
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

  const handleTypeChange = (type) => {
    setSearchType(type);
    setTypeDropdownOpen(false);
    const cityParam = selectedCity && selectedCity !== 'All Tamil Nadu' ? `?city=${encodeURIComponent(selectedCity)}` : '';
    if (type === 'Buy') router.push(`/buy${cityParam}`);
    else if (type === 'Rent') router.push(`/rent${cityParam}`);
  };

  const handleClearLocation = () => {
    changeCity('All Tamil Nadu');
    window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: { q: '', area: '', city: 'All Tamil Nadu' } }));
  };

  const handleExploreSubmit = (cityToUse) => {
    const targetCity = cityToUse || exploreCityInput.trim() || selectedCity;
    changeCity(targetCity);
    setCityDropdownOpen(false);
    setExploreCityInput('');
    setShowAllDistricts(false);

    // If on home page or non-listing pages (materials/services/etc.), stay on current page and update city
    if (pathname !== '/buy' && pathname !== '/rent') {
      return;
    }

    const targetPath = pathname === '/rent' ? '/rent' : '/buy';
    const params = new URLSearchParams();
    if (targetCity && targetCity !== 'All Tamil Nadu') params.set('city', targetCity);
    router.push(`${targetPath}?${params.toString()}`);
  };

  const filteredExploreCities = exploreCityInput.trim()
    ? TAMIL_NADU_CITIES.filter(c => c.toLowerCase().includes(exploreCityInput.toLowerCase().trim()))
    : [];


  const handleSelectListingCity = (city) => {
    changeCity(city);
    setListingCityDropdownOpen(false);
    window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: { city, area: '' } }));
  };

  const handleSelectLocality = (loc) => {
    setNavSearchQuery(loc);
    setSuggestionsOpen(false);
    window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: { q: loc, area: loc } }));
  };

  const handleSelectQuickSearch = (term) => {
    setNavSearchQuery(term);
    setSuggestionsOpen(false);
    window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: { q: term } }));
  };

  const handleSearchSubmit = () => {
    setSuggestionsOpen(false);
    window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: { q: navSearchQuery } }));
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SpeechRecognition) {
      alert('Voice search is not supported by your browser. Please type your search.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setNavSearchQuery(transcript);
        window.dispatchEvent(new CustomEvent('searchQueryChange', { detail: { q: transcript } }));
        setIsListening(false);
      };
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const activeLocalities = CITY_AREAS[selectedCity] || CITY_AREAS['Chennai'] || [];
  const filteredLocalities = activeLocalities.filter(l =>
    l.toLowerCase().includes(navSearchQuery.toLowerCase().trim())
  );

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
      <div className={`${styles.topBar} ${isListingPage ? styles.topBarListing : ''}`}>
        <div className={`container ${styles.topBarInner} ${isListingPage ? styles.topBarInnerListing : ''}`}>
          {/* Logo */}
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

            {/* 99acres-style City Selector & Explore Modal on non-listing pages */}
            {!isListingPage && (
              <div className={styles.citySelectorContainer} ref={cityDropdownRef}>
                <button
                  type="button"
                  className={styles.citySelectorBtn}
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  aria-label="Select City and Explore Real Estate"
                >
                  <span className={styles.cityName}>
                    {selectedCity}
                  </span>
                  <svg className={`${styles.cityArrow} ${cityDropdownOpen ? styles.arrowOpen : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {cityDropdownOpen && (
                  <div className={styles.exploreFlyout}>
                    <h2 className={styles.exploreTitle}>Explore real estate in...</h2>

                    {/* Search Row */}
                    <div className={styles.exploreSearchRow}>
                      <div className={styles.exploreInputWrap}>
                        <span className={styles.exploreInputIcon}>🔍</span>
                        <input
                          type="text"
                          className={styles.exploreInput}
                          placeholder="City Name"
                          value={exploreCityInput}
                          onFocus={() => setExploreInputFocused(true)}
                          onChange={e => {
                            setExploreCityInput(e.target.value);
                            setExploreInputFocused(true);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const target = filteredExploreCities[0] || exploreCityInput;
                              handleExploreSubmit(target);
                              setExploreInputFocused(false);
                            }
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        className={styles.exploreSubmitBtn}
                        onClick={() => {
                          const target = filteredExploreCities[0] || exploreCityInput;
                          handleExploreSubmit(target);
                          setExploreInputFocused(false);
                        }}
                      >
                        Explore
                      </button>

                      {/* City Dropdown: Shows upon clicking the search bar or typing */}
                      {exploreInputFocused && (
                        <div className={styles.exploreSuggestionsBox}>
                          <div style={{ padding: '6px 14px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {exploreCityInput.trim() ? 'Matching Cities' : 'Popular Cities in Tamil Nadu'}
                          </div>
                          {(exploreCityInput.trim() ? filteredExploreCities : TAMIL_NADU_CITIES.slice(0, 10)).map(city => (
                            <button
                              key={city}
                              type="button"
                              className={styles.exploreSuggestionItem}
                              onClick={() => {
                                handleExploreSubmit(city);
                                setExploreInputFocused(false);
                              }}
                            >
                              <span>📍 {city}</span>
                              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Tamil Nadu</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Continue Browsing / Recent Section */}
                    <div className={styles.recentSection}>
                      <div className={styles.recentTitle}>
                        {showAllDistricts ? 'All 38 Tamil Nadu Districts:' : 'Continue browsing where you left off...'}
                      </div>

                      {showAllDistricts ? (
                        <div className={styles.districtsGridModal}>
                          {TAMIL_NADU_CITIES.map(city => (
                            <button
                              key={city}
                              type="button"
                              className={styles.districtGridItem}
                              onClick={() => {
                                setShowAllDistricts(false);
                                handleExploreSubmit(city);
                              }}
                            >
                              🏢 {city}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.recentGrid}>
                          {/* Current City Highlighted */}
                          <button
                            type="button"
                            className={styles.recentPillActive}
                            onClick={() => handleExploreSubmit(selectedCity)}
                          >
                            {selectedCity}
                          </button>

                          {/* Top Tamil Nadu Hubs */}
                          {POPULAR_TN_HUBS.filter(c => c !== selectedCity).slice(0, 5).map(c => (
                            <button
                              key={c}
                              type="button"
                              className={styles.recentPillNeutral}
                              onClick={() => handleExploreSubmit(c)}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Bar */}
                    <div className={styles.exploreFooter}>
                      <div className={styles.footerLeftGroup}>
                        <button
                          type="button"
                          className={styles.footerLink}
                          onClick={() => handleExploreSubmit('All Tamil Nadu')}
                        >
                          🏛️ All Tamil Nadu
                        </button>
                        <span>·</span>
                        <span style={{ color: '#94a3b8' }}>38 Districts</span>
                      </div>

                      <button
                        type="button"
                        className={styles.footerRightLink}
                        onClick={() => setShowAllDistricts(!showAllDistricts)}
                      >
                        {showAllDistricts ? 'Hide list ▴' : 'View all cities ›'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>


          {/* ===== 99ACRES-STYLE BIG SEARCH BAR IN ORANGE BOX (BUY/RENT PAGES) ===== */}
          {isListingPage && (
            <div className={styles.navSearchBarContainer}>
              <div className={styles.navSearchBar}>
                {/* Buy / Rent Type Dropdown */}
                <div className={styles.typeDropdownContainer} ref={typeDropdownRef}>
                  <button
                    type="button"
                    className={styles.typeDropdownBtn}
                    onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                    aria-label="Select Property Type"
                  >
                    <span>{searchType}</span>
                    <svg className={`${styles.dropdownChevron} ${typeDropdownOpen ? styles.arrowOpen : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {typeDropdownOpen && (
                    <div className={styles.typeDropdownMenu}>
                      <button
                        type="button"
                        className={`${styles.typeOption} ${searchType === 'Buy' ? styles.typeActive : ''}`}
                        onClick={() => handleTypeChange('Buy')}
                      >
                        <span className={styles.typeIcon}>🏠</span>
                        <span>Buy</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.typeOption} ${searchType === 'Rent' ? styles.typeActive : ''}`}
                        onClick={() => handleTypeChange('Rent')}
                      >
                        <span className={styles.typeIcon}>🔑</span>
                        <span>Rent</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.searchDivider} />

                {/* City Location Chip */}
                <div className={styles.searchLocationContainer} ref={listingCityDropdownRef}>
                  <div
                    className={styles.searchLocationChip}
                    onClick={() => setListingCityDropdownOpen(!listingCityDropdownOpen)}
                    title="Click to switch city"
                  >
                    <span className={styles.chipText}>{selectedCity}</span>
                    <button
                      type="button"
                      className={styles.chipCloseBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearLocation();
                      }}
                      title="Clear city filter"
                    >
                      ✕
                    </button>
                  </div>

                  {listingCityDropdownOpen && (
                    <div className={styles.listingCityMenu}>
                      <div className={styles.cityDropdownHeader}>Tamil Nadu Cities</div>
                      <button
                        type="button"
                        className={`${styles.cityOption} ${selectedCity === 'All Tamil Nadu' ? styles.cityActive : ''}`}
                        onClick={() => handleSelectListingCity('All Tamil Nadu')}
                      >
                        <span>🏛️ All Tamil Nadu</span>
                      </button>
                      <div className={styles.cityDivider} />
                      {TAMIL_NADU_CITIES.map(c => (
                        <button
                          key={c}
                          type="button"
                          className={`${styles.cityOption} ${selectedCity === c ? styles.cityActive : ''}`}
                          onClick={() => handleSelectListingCity(c)}
                        >
                          <span className={styles.cityOptionDot} />
                          <span>{c}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Text Input */}
                <div className={styles.searchInputWrapper}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={styles.navSearchInput}
                    placeholder="Add more (locality, landmark, project)..."
                    value={navSearchQuery}
                    onChange={(e) => {
                      setNavSearchQuery(e.target.value);
                      setSuggestionsOpen(true);
                    }}
                    onFocus={() => setSuggestionsOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearchSubmit();
                    }}
                  />
                </div>

                {/* Voice Search (Mic) */}
                <button
                  type="button"
                  className={`${styles.searchMicBtn} ${isListening ? styles.micListening : ''}`}
                  onClick={handleVoiceSearch}
                  title={isListening ? 'Listening... Speak now' : 'Search by voice'}
                  aria-label="Voice Search"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </button>

                {/* Search Submit Button */}
                <button
                  type="button"
                  className={styles.searchSubmitBtn}
                  onClick={handleSearchSubmit}
                  aria-label="Submit Search"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>

              {/* Autocomplete Suggestions Menu */}
              {suggestionsOpen && (
                <div className={styles.suggestionsMenu} ref={suggestionsRef}>
                  <div className={styles.suggestionsHeader}>
                    Popular Localities in {selectedCity === 'All Tamil Nadu' ? 'Tamil Nadu' : selectedCity}
                  </div>
                  <div className={styles.suggestionsList}>
                    {filteredLocalities.slice(0, 7).map(loc => (
                      <button
                        key={loc}
                        type="button"
                        className={styles.suggestionItem}
                        onClick={() => handleSelectLocality(loc)}
                      >
                        <span className={styles.suggestionIcon}>📍</span>
                        <span className={styles.suggestionLocName}>{loc}</span>
                        <span className={styles.suggestionCityBadge}>{selectedCity}</span>
                      </button>
                    ))}
                    {filteredLocalities.length === 0 && (
                      <div className={styles.noSuggestionText}>
                        Press Enter or click 🔍 to search for "{navSearchQuery}"
                      </div>
                    )}
                  </div>
                  <div className={styles.quickSearchesHeader}>Quick Filters</div>
                  <div className={styles.quickSearchesRow}>
                    {['2 BHK Flat', '3 BHK Flat', 'Independent Villa', 'Ready to Move'].map(item => (
                      <button
                        key={item}
                        type="button"
                        className={styles.quickSearchPill}
                        onClick={() => handleSelectQuickSearch(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right: User / Login & Post Property */}
          <div className={styles.rightGroup}>
            {user ? (
              <div className={styles.userInfo}>
                <Link href="/account" className={styles.userBadge} title="View My Account & Dashboard">
                  <span className={styles.userAvatarIcon}>
                    {user.username ? user.username.charAt(0).toUpperCase() : '👤'}
                  </span>
                  <span className={styles.userName}>{user.username}</span>
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" className={styles.adminBadge}>
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className={styles.logoutBtn}
                  title="Sign out of your account"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.logoutIcon}
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
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
        {user ? (
          <>
            <Link href="/account" className={styles.mobileLink}>👤 My Account ({user.username})</Link>
            <button onClick={handleLogout} className={styles.mobileLogoutBtn}>Logout</button>
          </>
        ) : (
          <Link href="/login" className={styles.mobileLink}>Login</Link>
        )}
        <Link href="/sell" className={styles.mobilePostBtn}>+ Post Property</Link>
      </div>
    </header>
  );
}
