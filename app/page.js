'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import LocationSearchCombobox from '@/components/LocationSearchCombobox';
import { fetchProperties } from '@/lib/properties';
import { PROPERTIES, TAMIL_NADU_CITIES, CITY_AREAS } from '@/lib/data';
import styles from './page.module.css';

const TAMIL_NADU_HUBS = [
  { name: 'Chennai', count: '2,450+', tag: 'Capital & IT Corridor', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80' },
  { name: 'Coimbatore', count: '1,180+', tag: 'Manchester of South India', img: 'https://images.unsplash.com/photo-1596008194705-2091cd6764d4?w=600&q=80' },
  { name: 'Madurai', count: '690+', tag: 'Cultural & Commercial Hub', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80' },
  { name: 'Trichy', count: '430+', tag: 'Central Transit & Heritage', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80' },
  { name: 'Salem', count: '360+', tag: 'Industrial & Scenic Foothills', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
  { name: 'Hosur', count: '280+', tag: 'Fastest Growing Tech Hub', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80' }
];

export default function HomePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [searchTab, setSearchTab] = useState('buy');
  const [searchArea, setSearchArea] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync city with Navbar / localStorage / custom event
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('aurally_selected_city') : null;
    if (saved) setSelectedCity(saved);

    const handleCityEvent = (e) => {
      if (e.detail) {
        setSelectedCity(e.detail);
        setSearchArea(''); // reset locality when city switches
      }
    };
    window.addEventListener('cityChange', handleCityEvent);
    return () => window.removeEventListener('cityChange', handleCityEvent);
  }, []);

  // Fetch properties whenever selectedCity or searchTab changes
  useEffect(() => {
    setLoading(true);
    const filterCity = selectedCity === 'All Tamil Nadu' ? '' : selectedCity;
    const filterStatus = searchTab === 'rent' ? 'for-rent' : 'for-sale';

    fetchProperties({ city: filterCity, status: filterStatus, sortBy: 'featured' })
      .then(data => {
        if (data && data.length > 0) {
          setProperties(data);
        } else {
          // fallback to mock properties matching city
          const fallback = PROPERTIES.filter(p => {
            const matchesCity = !filterCity || p.city?.toLowerCase() === filterCity.toLowerCase();
            const matchesStatus = p.status === filterStatus;
            return matchesCity && matchesStatus;
          });
          setProperties(fallback.length > 0 ? fallback : PROPERTIES.slice(0, 4));
        }
      })
      .catch(() => {
        setProperties(PROPERTIES.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, [selectedCity, searchTab]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchArea('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('aurally_selected_city', city);
      window.dispatchEvent(new CustomEvent('cityChange', { detail: city }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity && selectedCity !== 'All Tamil Nadu') params.set('city', selectedCity);
    if (searchArea) params.set('area', searchArea);
    if (searchType) params.set('type', searchType);
    if (searchBudget) params.set('budget', searchBudget);
    router.push(`/${searchTab}?${params.toString()}`);
  };

  const activeAreas = CITY_AREAS[selectedCity] || CITY_AREAS['Chennai'];

  return (
    <div className={styles.page}>
      {/* ===== HERO SEARCH SECTION (MAGICBRICKS STYLE) ===== */}
      <section className={styles.heroSection}>
        {/* Far-Left Architectural Collage (bleeding off the far-left corner) */}
        <div className={styles.farLeftCollageWrap}>
          <img
            src="/hero-building-collage-clean.png"
            alt=""
            className={styles.farLeftCollageImg}
          />
        </div>

        {/* Ambient Real Estate Graphic Icons in Background (Right side accent) */}
        <div className={styles.ambientDecorLayer}>
          <div className={`${styles.ambientIcon} ${styles.ambientPin}`}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#f26b2b" strokeWidth="1.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className={`${styles.ambientIcon} ${styles.ambientBuilding}`}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fdba74" strokeWidth="1.2">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
              <line x1="9" y1="6" x2="9" y2="6.01"/>
              <line x1="15" y1="6" x2="15" y2="6.01"/>
              <line x1="9" y1="12" x2="9" y2="12.01"/>
              <line x1="15" y1="12" x2="15" y2="12.01"/>
            </svg>
          </div>
        </div>

        <div className="container">
          <div className={styles.heroContainer}>
            {/* Centered Search Box Area */}
            <div className={styles.searchHeroCol}>
              <h1 className={styles.heroHeading}>
                Start your <span className={styles.hashtag}>#DreamHome</span> Journey
              </h1>
              <p className={styles.heroSubText}>
                {selectedCity === 'All Tamil Nadu'
                  ? 'Explore verified homes, plots, and commercial spaces across all major districts of Tamil Nadu'
                  : `Find verified properties, new residential projects, and rental flats in ${selectedCity}`}
              </p>

              {/* Tabs sitting directly above the search bar */}
              <div className={styles.searchTabsRow}>
                {[
                  { id: 'buy', label: 'Buy' },
                  { id: 'rent', label: 'Rent' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`${styles.tabBtn} ${searchTab === tab.id ? styles.tabActive : ''}`}
                    onClick={() => setSearchTab(tab.id)}
                  >
                    {tab.label}
                    {searchTab === tab.id && <span className={styles.activeUnderline} />}
                  </button>
                ))}
              </div>

              {/* Unified Magicbricks Search Bar Pill */}
              <form className={styles.unifiedSearchPill} onSubmit={handleSearch}>
                {/* Typeable City & Locality Combobox across all of Tamil Nadu */}
                <LocationSearchCombobox
                  selectedCity={selectedCity}
                  onCityChange={handleCitySelect}
                  value={searchArea}
                  onChange={(val) => setSearchArea(val)}
                  onSelect={({ locality, city }) => {
                    setSearchArea(locality);
                    if (city && city !== selectedCity) {
                      handleCitySelect(city);
                    }
                  }}
                  placeholder="Add Locality, Project, or City..."
                />

                <div className={styles.pillDivider} />

                {/* Property Type Dropdown */}
                <div className={styles.searchSegment}>
                  <span className={styles.segmentIcon}>🏠</span>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className={styles.segmentSelect}
                    aria-label="Property Type"
                  >
                    <option value="">Property Type ⌵</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot</option>
                    <option value="individual-house">Individual House</option>
                    <option value="farm-land">Farm Land</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="bungalow">Bungalow</option>
                    <option value="commercial">Commercial</option>
                    <option value="office-space">Office Space</option>
                  </select>
                </div>

                <div className={styles.pillDivider} />

                {/* Budget Dropdown */}
                <div className={styles.searchSegment}>
                  <span className={styles.segmentIcon}>₹</span>
                  <select
                    value={searchBudget}
                    onChange={(e) => setSearchBudget(e.target.value)}
                    className={styles.segmentSelect}
                    aria-label="Budget"
                  >
                    <option value="">Budget ⌵</option>
                    <option value="10-30">₹10 Lakh - ₹30 Lakh</option>
                    <option value="30-60">₹30 Lakh - ₹60 Lakh</option>
                    <option value="60-100">₹60 Lakh - ₹1 Crore</option>
                    <option value="100-200">₹1 Crore - ₹2 Crore</option>
                    <option value="200+">₹2 Crore+</option>
                  </select>
                </div>

                {/* Search Button */}
                <button type="submit" className={styles.pillSearchBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== "BECAUSE YOU SEARCHED [CITY]" SECTION (MAGICBRICKS STYLE) ===== */}
      <section className={styles.citySpotlightSection}>
        <div className="container">
          <div className={styles.sectionHeaderLine}>
            <div className={styles.titleWrap}>
              <div className={styles.accentBar} />
              <h2 className={styles.spotlightTitle}>Because you searched {selectedCity}</h2>
            </div>
            {selectedCity !== 'All Tamil Nadu' && (
              <button 
                type="button" 
                onClick={() => handleCitySelect('All Tamil Nadu')}
                className={styles.switchCityLink}
              >
                View All Tamil Nadu →
              </button>
            )}
          </div>

          <div className={styles.spotlightGrid}>
            {/* Card 1: Stat Count Card */}
            <div className={styles.statActionCard}>
              <div className={styles.statLargeNumber}>7K+</div>
              <div className={styles.statCardTitle}>properties listed for you</div>
              <Link href={`/${searchTab}?city=${encodeURIComponent(selectedCity)}`} className={styles.cardActionLink}>
                Continue last search →
              </Link>
              <div className={styles.statWatermark}>⏱️</div>
            </div>


            {/* Card 3: Top Handpicked Projects */}
            <div className={styles.spotlightFeatureCard}>
              <div>
                <span className={styles.cardIcon}>🏙️</span>
                <h3 className={styles.cardFeatureTitle}>Top Handpicked Projects for you</h3>
                <p className={styles.cardFeatureSub}>Verified gated communities & premium towers in {selectedCity}</p>
              </div>
              <Link href={`/buy?city=${encodeURIComponent(selectedCity)}&type=apartment`} className={styles.cardActionLink}>
                See all →
              </Link>
            </div>

            {/* Card 4: Top Exclusive Owner Properties */}
            <div className={styles.spotlightFeatureCard}>
              <div>
                <span className={styles.cardIcon}>🔑</span>
                <h3 className={styles.cardFeatureTitle}>Top Exclusive Owner Properties</h3>
                <p className={styles.cardFeatureSub}>Zero brokerage listings directly posted by genuine owners</p>
              </div>
              <Link href={`/${searchTab}?city=${encodeURIComponent(selectedCity)}`} className={styles.cardActionLink}>
                See all →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPULAR OWNER PROPERTIES ===== */}
      <section className={styles.propertiesSection}>
        <div className="container">
          <div className={styles.sectionHeaderLine}>
            <div>
              <h2 className={styles.sectionTitleText}>Popular Owner Properties</h2>
              <p className={styles.sectionSubtitleText}>Hand-picked verified listings with direct owner contact in {selectedCity}</p>
            </div>
            <Link href={`/${searchTab}?city=${encodeURIComponent(selectedCity)}`} className={styles.seeAllLink}>
              See all Properties →
            </Link>
          </div>

          {loading ? (
            <div className={styles.loadingBox}>
              <div className={styles.spinner} />
              <p>Loading properties in {selectedCity}...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className={styles.propertyGrid}>
              {properties.slice(0, 6).map(p => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyBox}>
              <p>No listings found in {selectedCity}. Be the first to post a property!</p>
              <Link href="/sell" className={styles.pillSearchBtn} style={{ margin: '16px auto', display: 'inline-flex' }}>
                + Post Property FREE
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== EXPLORE TOP CITIES IN TAMIL NADU ===== */}
      <section className={styles.tamilNaduSection}>
        <div className="container">
          <div className={styles.sectionHeaderLine}>
            <div>
              <span className={styles.tnBadge}>📍 Tamil Nadu Real Estate</span>
              <h2 className={styles.sectionTitleText}>Explore Properties across Tamil Nadu</h2>
              <p className={styles.sectionSubtitleText}>Browse active listings, residential plots, and investment opportunities by city</p>
            </div>
          </div>

          <div className={styles.cityHubsGrid}>
            {TAMIL_NADU_HUBS.map(hub => {
              const isSelected = selectedCity === hub.name;
              return (
                <div
                  key={hub.name}
                  onClick={() => handleCitySelect(hub.name)}
                  className={`${styles.cityHubCard} ${isSelected ? styles.cityHubSelected : ''}`}
                >
                  <div className={styles.cityImgWrap}>
                    <img src={hub.img} alt={hub.name} className={styles.cityImg} loading="lazy" />
                    <div className={styles.cityImgOverlay} />
                    {isSelected && <span className={styles.selectedCityTag}>Active City</span>}
                  </div>
                  <div className={styles.cityCardBody}>
                    <div className={styles.cityNameRow}>
                      <h3 className={styles.cityHubTitle}>{hub.name}</h3>
                      <span className={styles.cityPropCount}>{hub.count}</span>
                    </div>
                    <p className={styles.cityHubTag}>{hub.tag}</p>
                    <div className={styles.cityCardFooter}>
                      <span>Explore Homes</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHY AURALLY REALTY / BENEFIT STRIP ===== */}
      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.benefitsCard}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🛡️</div>
              <div>
                <h4>100% Verified Properties</h4>
                <p>Every home physically inspected & document-verified</p>
              </div>
            </div>
            <div className={styles.benefitDivider} />
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🤝</div>
              <div>
                <h4>Zero Brokerage Options</h4>
                <p>Direct owner contact with no middleman commission</p>
              </div>
            </div>
            <div className={styles.benefitDivider} />
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>📊</div>
              <div>
                <h4>Instant Home Loan Advisory</h4>
                <p>Compare pre-approved loan offers from 15+ top banks</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
