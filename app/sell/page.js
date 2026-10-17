'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { addProperty } from '@/lib/properties';
import styles from './page.module.css';
import { AREAS } from '@/lib/data';

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Independent House', 'Plot / Land', 'Commercial Space', 'PG / Hostel'];
const FURNISHING = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const FACING = ['East', 'West', 'North', 'South', 'North-East', 'South-West'];

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    listingType: 'sale', propertyType: 'Apartment', area: 'Anna Nagar', address: '',
    beds: '2', baths: '2', sqft: '1200', price: '75', facing: 'East', floor: '2nd of 5', furnishing: 'Semi Furnished',
    age: 'New', title: '', description: '', phone: '', image: '',
  });

  useEffect(() => {
    getCurrentUser().then(u => {
      if (u) {
        setUser(u);
        setIsLoggedIn(true);
        if (u.phone) {
          setForm(f => ({ ...f, phone: u.phone }));
        }
      }
      setCheckingAuth(false);
    }).catch(() => {
      setCheckingAuth(false);
    });
  }, []);

  const update = (field, val) => setForm(f => ({...f, [field]: val}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addProperty(form, user);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Error saving property: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderColor: '#f26b2b', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHero}>
          <div className="container">
            <h1 className={styles.pageTitle}>Sell or Rent Your <span>Property</span></h1>
            <p className={styles.pageSub}>List your property for FREE and reach lakhs of genuine buyers</p>
          </div>
        </div>

        <div className="container">
          <div className={styles.authPrompt}>
            <div className={styles.authIcon}>🏠</div>
            <h2>Login to Post Your Property</h2>
            <p>Create a free account to list your property and connect with thousands of buyers and tenants.</p>
            <div className={styles.authBtns}>
              <Link href="/login" className="btn-primary">Login to Continue</Link>
              <Link href="/signup" className="btn-secondary">Create Account</Link>
            </div>
            <div className={styles.benefits}>
              {['✅ Free Property Listing', '✅ Instant Buyer Inquiries', '✅ Verified Leads Only', '✅ 24/7 Support'].map(b => (
                <span key={b} className={styles.benefit}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.successWrap}`}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h2>Property Listed Successfully!</h2>
            <p>Your property has been submitted for review. It will be live within 24 hours.</p>
            <div style={{display:'flex', gap:'12px', justifyContent:'center', marginTop:'24px'}}>
              <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(1); setForm({listingType:'sale',propertyType:'',area:'',address:'',beds:'',baths:'',sqft:'',price:'',facing:'',floor:'',furnishing:'',age:'',title:'',description:'',phone:''}); }}>
                Post Another
              </button>
              <Link href="/" className="btn-secondary">Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHero}>
        <div className="container">
          <h1 className={styles.pageTitle}>Post Your <span>Property</span></h1>
          <p className={styles.pageSub}>Fill in the details below — it only takes 2 minutes!</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.formWrap}>
          {/* Steps */}
          <div className={styles.steps}>
            {['Basic Info', 'Property Details', 'Contact & Submit'].map((s, i) => (
              <div key={s} className={`${styles.step} ${step === i+1 ? styles.stepActive : step > i+1 ? styles.stepDone : ''}`}>
                <div className={styles.stepNum}>{step > i+1 ? '✓' : i+1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {step === 1 && (
              <div className={styles.formStep}>
                <h3 className={styles.formStepTitle}>Step 1: Basic Information</h3>

                <div className={styles.listingTypeBtns}>
                  {['sale', 'rent'].map(t => (
                    <button key={t} type="button"
                      className={`${styles.listingTypeBtn} ${form.listingType === t ? styles.listingTypeBtnActive : ''}`}
                      onClick={() => update('listingType', t)}
                    >
                      {t === 'sale' ? '🏷️ For Sale' : '🔑 For Rent'}
                    </button>
                  ))}
                </div>

                <div className={styles.grid2}>
                  <div className="form-group">
                    <label className="form-label">Property Type *</label>
                    <select className="form-select" required value={form.propertyType} onChange={e => update('propertyType', e.target.value)}>
                      <option value="">Select Type</option>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area / Locality *</label>
                    <select className="form-select" required value={form.area} onChange={e => update('area', e.target.value)}>
                      <option value="">Select Area</option>
                      {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Address *</label>
                  <input className="form-input" type="text" placeholder="Door No., Street Name, Area, Chennai" required value={form.address} onChange={e => update('address', e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="form-label">Property Title *</label>
                  <input className="form-input" type="text" placeholder="e.g. Spacious 3BHK Apartment in Anna Nagar" required value={form.title} onChange={e => update('title', e.target.value)} />
                </div>

                <button type="button" className="btn-primary" style={{width:'100%'}} onClick={() => { if(form.propertyType && form.area && form.address && form.title) setStep(2); }}>
                  Next Step →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className={styles.formStep}>
                <h3 className={styles.formStepTitle}>Step 2: Property Details</h3>

                <div className={styles.grid3}>
                  <div className="form-group">
                    <label className="form-label">Bedrooms</label>
                    <select className="form-select" value={form.beds} onChange={e => update('beds', e.target.value)}>
                      <option value="">Select</option>
                      {['1','2','3','4','5+'].map(b => <option key={b} value={b}>{b} BHK</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bathrooms</label>
                    <select className="form-select" value={form.baths} onChange={e => update('baths', e.target.value)}>
                      <option value="">Select</option>
                      {['1','2','3','4'].map(b => <option key={b} value={b}>{b} Bath</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Built-up Area (sq.ft) *</label>
                    <input className="form-input" type="number" placeholder="e.g. 1200" required value={form.sqft} onChange={e => update('sqft', e.target.value)} />
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div className="form-group">
                    <label className="form-label">Price {form.listingType === 'rent' ? '(₹/month)' : '(₹ Lakhs)'} *</label>
                    <input className="form-input" type="number" placeholder={form.listingType === 'rent' ? 'e.g. 15000' : 'e.g. 75'} required value={form.price} onChange={e => update('price', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Furnishing Status</label>
                    <select className="form-select" value={form.furnishing} onChange={e => update('furnishing', e.target.value)}>
                      <option value="">Select</option>
                      {FURNISHING.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div className="form-group">
                    <label className="form-label">Facing</label>
                    <select className="form-select" value={form.facing} onChange={e => update('facing', e.target.value)}>
                      <option value="">Select</option>
                      {FACING.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Property Age</label>
                    <select className="form-select" value={form.age} onChange={e => update('age', e.target.value)}>
                      <option value="">Select</option>
                      {['New / Under Construction','< 1 Year','1-3 Years','3-5 Years','5-10 Years','10+ Years'].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows="4" placeholder="Describe your property — amenities, nearby landmarks, unique features..." value={form.description} onChange={e => update('description', e.target.value)} style={{resize:'vertical'}} />
                </div>

                <div className={styles.formNav}>
                  <button type="button" className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                  <button type="button" className="btn-primary" onClick={() => { if(form.sqft && form.price) setStep(3); }}>Next Step →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.formStep}>
                <h3 className={styles.formStepTitle}>Step 3: Contact Details</h3>

                <div className={styles.reviewBox}>
                  <h4>📋 Review Your Listing</h4>
                  <div className={styles.reviewGrid}>
                    <div><span>Type</span><strong>{form.propertyType}</strong></div>
                    <div><span>Area</span><strong>{form.area}</strong></div>
                    <div><span>Beds</span><strong>{form.beds || 'N/A'}</strong></div>
                    <div><span>Price</span><strong>₹{form.price} {form.listingType === 'rent' ? '/mo' : 'L'}</strong></div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Phone Number *</label>
                  <div className={styles.phoneInput}>
                    <span className={styles.phonePrefix}>🇮🇳 +91</span>
                    <input className="form-input" type="tel" placeholder="98765 43210" required maxLength={10} value={form.phone} onChange={e => update('phone', e.target.value)} style={{borderLeft:'none', borderRadius:'0 12px 12px 0'}} />
                  </div>
                  <p style={{fontSize:'12px', color:'#9ca3af', marginTop:'6px'}}>Your number will only be shared with verified buyers/renters.</p>
                </div>

                <div className={styles.formNav}>
                  <button type="button" className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                  <button type="submit" className="btn-primary">🚀 Post Property FREE</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
