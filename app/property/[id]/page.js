'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchPropertyById } from '@/lib/properties';
import { apiFetch } from '@/lib/api';
import { formatPrice } from '@/lib/data';
import styles from './page.module.css';

const AMENITIES = [
  { icon: '🚗', name: 'Covered Parking' },
  { icon: '🛗', name: 'High-Speed Elevators' },
  { icon: '🛡️', name: '24/7 Security & CCTV' },
  { icon: '⚡', name: '100% Power Backup' },
  { icon: '🏊‍♂️', name: 'Swimming Pool' },
  { icon: '🏋️‍♂️', name: 'Fitness Gym' },
  { icon: '🌳', name: 'Landscaped Garden' },
  { icon: '💧', name: 'Rainwater Harvesting' },
  { icon: '🏸', name: 'Badminton Court' },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');

  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(50); // in Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // %
  const [tenureYears, setTenureYears] = useState(20);

  useEffect(() => {
    if (id) {
      fetchPropertyById(id)
        .then(data => {
          setProperty(data);
          if (data && data.price && data.status === 'for-sale') {
            const defaultLoan = Math.round(data.price * 0.8);
            if (defaultLoan > 0) setLoanAmount(defaultLoan);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderColor: '#f26b2b', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <h2>Property Not Found</h2>
          <p style={{ color: '#9ca3af', margin: '12px 0 24px' }}>The listing you are looking for may have been removed or sold.</p>
          <Link href="/buy" className="btn-primary">Browse All Properties</Link>
        </div>
      </div>
    );
  }

  // EMI Calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const P = loanAmount * 100000;
  const r = interestRate / (12 * 100);
  const n = tenureYears * 12;
  const emi = P && r && n ? Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0;

  const images = property.images && property.images.length > 0 ? property.images : [property.image];
  const ownerPhone = property.phone || '9876543210';
  const cleanPhone = ownerPhone.replace(/\D/g, '');

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          property_id: property.id,
          contact_name: inquiryName,
          contact_phone: inquiryPhone,
          message: `Inquiry for ${property.title} in ${property.area}`
        })
      });
    } catch (err) {
      console.warn('Enquiry API submission error:', err.message);
    }
    setContactSuccess(true);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={property.status === 'for-rent' ? '/rent' : '/buy'}>
            {property.status === 'for-rent' ? 'Rent' : 'Buy'}
          </Link>
          <span>/</span>
          <Link href={`/${property.status === 'for-rent' ? 'rent' : 'buy'}?area=${encodeURIComponent(property.area)}`}>
            {property.area}
          </Link>
          <span>/</span>
          <span style={{ color: '#f3f4f6' }}>{property.title}</span>
        </div>

        {/* Header Section */}
        <div className={styles.headerCard}>
          <div className={styles.titleArea}>
            <h1>{property.title}</h1>
            <div className={styles.locationRow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{property.address || `${property.area}, Chennai`}</span>
            </div>
            <div className={styles.badgeRow}>
              {property.verified && <span className={styles.verifiedBadge}>✓ Verified by Aurally</span>}
              {property.featured && <span className={styles.featureBadge}>⭐ Featured Listing</span>}
              <span style={{ background: '#1f2937', color: '#e5e7eb', padding: '4px 10px', borderRadius: '999px', fontSize: '12px' }}>
                {property.status === 'for-rent' ? '🔑 For Rent' : '🏷️ For Sale'}
              </span>
            </div>
          </div>

          <div className={styles.priceArea}>
            <div className={styles.price}>
              {formatPrice(property.price, property.priceUnit)}
            </div>
            {property.sqft > 0 && property.status === 'for-sale' && (
              <div className={styles.pricePerSqft}>
                ₹{Math.round((property.price * (property.priceUnit === 'Cr' ? 10000000 : 100000)) / property.sqft).toLocaleString('en-IN')} / sq.ft
              </div>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        <div className={styles.layout}>
          {/* Main Content Column */}
          <div className={styles.mainCol}>
            {/* Gallery */}
            <div className={styles.galleryCard}>
              <div className={styles.mainImageWrap}>
                <img
                  src={images[selectedImg] || property.image}
                  alt={property.title}
                  className={styles.mainImage}
                />
              </div>
              {images.length > 1 && (
                <div className={styles.thumbRow}>
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`${styles.thumb} ${selectedImg === idx ? styles.thumbActive : ''}`}
                      onClick={() => setSelectedImg(idx)}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Overview / Specs Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Property Overview</h3>
              <div className={styles.specsGrid}>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Bedrooms</div>
                  <div className={styles.specVal}>{property.beds > 0 ? `${property.beds} BHK` : 'N/A'}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Bathrooms</div>
                  <div className={styles.specVal}>{property.baths > 0 ? `${property.baths} Bath` : 'N/A'}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Super Built-up Area</div>
                  <div className={styles.specVal}>{property.sqft ? `${property.sqft} sq.ft` : 'N/A'}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Furnishing</div>
                  <div className={styles.specVal}>{property.furnishing || 'Semi Furnished'}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Facing Direction</div>
                  <div className={styles.specVal}>{property.facing || 'East'}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Floor</div>
                  <div className={styles.specVal}>{property.floor || '2nd of 6'}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Property Age</div>
                  <div className={styles.specVal}>{property.age || 'New'}</div>
                </div>
                <div className={styles.specItem}>
                  <div className={styles.specLabel}>Possession</div>
                  <div className={styles.specVal}>Ready to Move</div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>About this Property</h3>
              <p className={styles.descriptionText}>
                {property.description ||
                  `Welcome to this exceptional property located in the heart of ${property.area}, Chennai. Designed with contemporary aesthetics, ample natural lighting, and cross ventilation, this home offers the ideal living experience for families and professionals alike.\n\nStrategically located near top-tier schools, multispeciality hospitals, metro stations, and shopping centers. High rental yield and promising capital appreciation make this an outstanding investment.`}
              </p>
            </div>

            {/* Amenities Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Amenities & Features</h3>
              <div className={styles.amenitiesGrid}>
                {AMENITIES.map((item, i) => (
                  <div key={i} className={styles.amenityItem}>
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* EMI Calculator (Only for for-sale) */}
            {property.status === 'for-sale' && (
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Home Loan & EMI Calculator</h3>
                <div className={styles.calcWrap}>
                  <div className={styles.calcInputs}>
                    <div className={styles.sliderGroup}>
                      <div className={styles.sliderHeader}>
                        <span>Loan Amount</span>
                        <strong>₹{loanAmount} Lakhs</strong>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="300"
                        value={loanAmount}
                        onChange={e => setLoanAmount(Number(e.target.value))}
                        className={styles.slider}
                      />
                    </div>

                    <div className={styles.sliderGroup}>
                      <div className={styles.sliderHeader}>
                        <span>Interest Rate</span>
                        <strong>{interestRate}% p.a.</strong>
                      </div>
                      <input
                        type="range"
                        min="7"
                        max="14"
                        step="0.1"
                        value={interestRate}
                        onChange={e => setInterestRate(Number(e.target.value))}
                        className={styles.slider}
                      />
                    </div>

                    <div className={styles.sliderGroup}>
                      <div className={styles.sliderHeader}>
                        <span>Tenure (Years)</span>
                        <strong>{tenureYears} Years</strong>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        value={tenureYears}
                        onChange={e => setTenureYears(Number(e.target.value))}
                        className={styles.slider}
                      />
                    </div>
                  </div>

                  <div className={styles.emiResult}>
                    <span style={{ fontSize: '13px', color: '#9ca3af' }}>Estimated Monthly EMI</span>
                    <div className={styles.emiAmount}>₹{emi.toLocaleString('en-IN')}</div>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Principal + Interest calculated</span>
                    <Link href="/services" style={{ marginTop: '12px', fontSize: '13px', color: '#f26b2b', textDecoration: 'none', fontWeight: 600 }}>
                      Apply for Home Loan →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Contact Card */}
          <aside className={styles.sidebarCol}>
            <div className={styles.contactCard}>
              <div className={styles.contactHeader}>
                <div className={styles.avatar}>
                  {property.owner ? property.owner[0].toUpperCase() : 'A'}
                </div>
                <div className={styles.ownerDetails}>
                  <h4>{property.owner || 'Aurally Verified Owner'}</h4>
                  <span className={styles.ownerRole}>Verified Seller / Partner</span>
                </div>
              </div>

              {contactSuccess ? (
                <div style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '16px', borderRadius: '8px', textAlign: 'center', fontSize: '14px', lineHeight: 1.5 }}>
                  🎉 <strong>Thank you!</strong><br />
                  The seller will contact you directly within 30 minutes.
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className={styles.contactForm}>
                  <h4 style={{ fontSize: '15px', color: '#f3f4f6', marginBottom: '4px' }}>Interested in this property?</h4>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>Send your details to schedule a site visit or ask questions.</p>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your Name"
                    required
                    value={inquiryName}
                    onChange={e => setInquiryName(e.target.value)}
                  />
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Your Phone Number"
                    maxLength={10}
                    required
                    value={inquiryPhone}
                    onChange={e => setInquiryPhone(e.target.value)}
                  />

                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    Contact Seller FREE
                  </button>
                </form>
              )}

              <div style={{ margin: '16px 0', borderTop: '1px solid #2d3748' }} />

              {/* Reveal Phone Button */}
              {phoneRevealed ? (
                <div style={{ textAlign: 'center', padding: '12px', background: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>Seller Contact Number:</span>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#f26b2b', marginTop: '4px' }}>
                    +91 {ownerPhone}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={styles.revealPhoneBtn}
                  onClick={() => setPhoneRevealed(true)}
                >
                  📞 View Seller Phone Number
                </button>
              )}

              {/* WhatsApp direct chat */}
              <a
                href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi, I am interested in your property: "${property.title}" in ${property.area} listed on Aurally Realty.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
                style={{ marginTop: '10px' }}
              >
                💬 Chat on WhatsApp
              </a>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                <span>🔒 Privacy Protected</span>
                <span>⭐ Zero Brokerage</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
