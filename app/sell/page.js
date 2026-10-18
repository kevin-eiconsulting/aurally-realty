'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { addProperty } from '@/lib/properties';
import styles from './page.module.css';
import { TAMIL_NADU_CITIES, CITY_AREAS, PROPERTY_TYPE_OPTIONS } from '@/lib/data';

const FURNISHING = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const FACING = ['East', 'West', 'North', 'South', 'North-East', 'South-West'];

const SAMPLE_PHOTOS = [
  { id: 'apt', label: '🏢 Apartment', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80' },
  { id: 'villa', label: '🏡 Villa', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80' },
  { id: 'house', label: '🏠 House', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80' },
  { id: 'plot', label: '🏞️ Plot / Land', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' },
  { id: 'office', label: '🏢 Commercial', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
];

export default function SellPage() {
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoAlert, setPhotoAlert] = useState(false);

  const [form, setForm] = useState({
    listingType: 'sale',
    propertyType: '',
    city: 'Chennai',
    area: '',
    customArea: '',
    address: '',
    beds: '',
    baths: '',
    sqft: '',
    price: '',
    facing: '',
    floor: '',
    furnishing: '',
    age: '',
    title: '',
    description: '',
    phone: '',
    image: '',
    images: []
  });

  useEffect(() => {
    // Check if user has a previously selected city from navbar/homepage
    if (typeof window !== 'undefined') {
      const savedCity = localStorage.getItem('aurally_selected_city');
      if (savedCity && TAMIL_NADU_CITIES.includes(savedCity)) {
        setForm(f => ({
          ...f,
          city: savedCity,
          area: ''
        }));
      }
    }

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

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleCityChange = (newCity) => {
    setForm(f => ({
      ...f,
      city: newCity
    }));
  };


  // Upload multiple image files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length < files.length) {
      alert('Only image files (JPG, PNG, WEBP) are supported.');
    }

    let loadedCount = 0;
    const newImgs = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        newImgs.push(evt.target.result);
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setForm(f => {
            const updated = [...f.images, ...newImgs];
            return {
              ...f,
              images: updated,
              image: f.image || updated[0] || ''
            };
          });
          setPhotoAlert(false);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Drag and Drop multiple images
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(f => f.type.startsWith('image/'));
    let loadedCount = 0;
    const newImgs = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        newImgs.push(evt.target.result);
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setForm(f => {
            const updated = [...f.images, ...newImgs];
            return {
              ...f,
              images: updated,
              image: f.image || updated[0] || ''
            };
          });
          setPhotoAlert(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add sample photo
  const addSamplePhoto = (url) => {
    setForm(f => {
      if (f.images.includes(url)) return f;
      const updated = [...f.images, url];
      return {
        ...f,
        images: updated,
        image: f.image || updated[0] || ''
      };
    });
    setPhotoAlert(false);
  };

  // Remove photo by index
  const removePhoto = (idx) => {
    setForm(f => {
      const updated = f.images.filter((_, i) => i !== idx);
      return {
        ...f,
        images: updated,
        image: updated[0] || ''
      };
    });
  };

  // Set photo as primary cover
  const setPrimaryPhoto = (idx) => {
    setForm(f => {
      const chosen = f.images[idx];
      const remaining = f.images.filter((_, i) => i !== idx);
      const updated = [chosen, ...remaining];
      return {
        ...f,
        images: updated,
        image: chosen
      };
    });
  };

  const clearAllPhotos = () => {
    setForm(f => ({
      ...f,
      images: [],
      image: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.images || form.images.length === 0) {
      alert('Please upload at least 1 property photo before submitting.');
      setStep(2);
      return;
    }
    setSubmitting(true);
    try {
      const effectiveArea = form.area?.trim() || 'Locality';

      const payload = {
        ...form,
        area: effectiveArea,
        image: form.images[0],
        images: form.images
      };
      await addProperty(payload, user);
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
            <p className={styles.pageSub}>List your property for FREE and reach lakhs of genuine buyers across Tamil Nadu</p>
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
              {['✅ Free Property Listing Across Tamil Nadu', '✅ Instant Buyer & Tenant Inquiries', '✅ Verified Direct Leads Only', '✅ 24/7 Dedicated Support'].map(b => (
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
            <p>Your property in <strong>{form.area === 'Other' ? form.customArea : form.area}, {form.city}</strong> with <strong>{form.images.length} photos</strong> has been submitted. It will be live within 24 hours.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setForm({
                    listingType: 'sale',
                    propertyType: '',
                    city: form.city || 'Chennai',
                    area: '',
                    customArea: '',
                    address: '',
                    beds: '',
                    baths: '',
                    sqft: '',
                    price: '',
                    facing: '',
                    floor: '',
                    furnishing: '',
                    age: '',
                    title: '',
                    description: '',
                    phone: user?.phone || '',
                    image: '',
                    images: []
                  });
                }}
              >
                Post Another
              </button>
              <Link href="/" className="btn-secondary">Go Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const effectiveAreaLabel = form.area?.trim() || 'Locality';
  const canProceedStep1 = form.propertyType && form.city?.trim() && form.area?.trim() && form.address?.trim() && form.title?.trim();

  const hasPhotos = form.images && form.images.length > 0;
  const canProceedStep2 = form.sqft && form.price && hasPhotos;

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
            {['Basic Info', 'Property Details & Photos', 'Contact & Submit'].map((s, i) => (
              <div key={s} className={`${styles.step} ${step === i + 1 ? styles.stepActive : step > i + 1 ? styles.stepDone : ''}`}>
                <div className={styles.stepNum}>{step > i + 1 ? '✓' : i + 1}</div>
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
                    <button
                      key={t}
                      type="button"
                      className={`${styles.listingTypeBtn} ${form.listingType === t ? styles.listingTypeBtnActive : ''}`}
                      onClick={() => update('listingType', t)}
                    >
                      {t === 'sale' ? '🏷️ For Sale' : '🔑 For Rent'}
                    </button>
                  ))}
                </div>

                <div className={styles.grid3}>
                  <div className="form-group">
                    <label className="form-label">Property Type *</label>
                    <select
                      className="form-select"
                      required
                      value={form.propertyType}
                      onChange={e => update('propertyType', e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {PROPERTY_TYPE_OPTIONS.map(t => (
                        <option key={t.id} value={t.label}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City (Tamil Nadu) *</label>
                    <input
                      type="text"
                      className="form-input"
                      list="tn-sell-cities"
                      required
                      placeholder="Type or select city..."
                      value={form.city}
                      onChange={e => handleCityChange(e.target.value)}
                    />
                    <datalist id="tn-sell-cities">
                      {TAMIL_NADU_CITIES.map(c => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Area / Locality *</label>
                    <input
                      type="text"
                      className="form-input"
                      list="tn-sell-areas"
                      required
                      placeholder={`Type area in ${form.city || 'Tamil Nadu'}...`}
                      value={form.area}
                      onChange={e => update('area', e.target.value)}
                    />
                    <datalist id="tn-sell-areas">
                      {(CITY_AREAS[form.city] || []).map(a => (
                        <option key={a} value={a} />
                      ))}
                    </datalist>
                  </div>
                </div>


                <div className="form-group">
                  <label className="form-label">Full Address *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder={`Door No., Street Name, ${effectiveAreaLabel}, ${form.city}`}
                    required
                    value={form.address}
                    onChange={e => update('address', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Property Title *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder={`e.g. Spacious 3BHK ${form.propertyType || 'Apartment'} in ${effectiveAreaLabel}`}
                    required
                    value={form.title}
                    onChange={e => update('title', e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: '100%' }}
                  disabled={!canProceedStep1}
                  onClick={() => {
                    if (canProceedStep1) setStep(2);
                  }}
                >
                  Next Step: Details & Photos →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className={styles.formStep}>
                <h3 className={styles.formStepTitle}>Step 2: Property Details & Photos</h3>

                <div className={styles.grid3}>
                  <div className="form-group">
                    <label className="form-label">Bedrooms</label>
                    <select className="form-select" value={form.beds} onChange={e => update('beds', e.target.value)}>
                      <option value="">Select</option>
                      {['1', '2', '3', '4', '5+'].map(b => (
                        <option key={b} value={b}>{b} BHK</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bathrooms</label>
                    <select className="form-select" value={form.baths} onChange={e => update('baths', e.target.value)}>
                      <option value="">Select</option>
                      {['1', '2', '3', '4'].map(b => (
                        <option key={b} value={b}>{b} Bath</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Built-up Area (sq.ft) *</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="e.g. 1200"
                      required
                      value={form.sqft}
                      onChange={e => update('sqft', e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div className="form-group">
                    <label className="form-label">Price {form.listingType === 'rent' ? '(₹/month)' : '(₹ Lakhs)'} *</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder={form.listingType === 'rent' ? 'e.g. 15000' : 'e.g. 75'}
                      required
                      value={form.price}
                      onChange={e => update('price', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Furnishing Status</label>
                    <select className="form-select" value={form.furnishing} onChange={e => update('furnishing', e.target.value)}>
                      <option value="">Select</option>
                      {FURNISHING.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div className="form-group">
                    <label className="form-label">Facing</label>
                    <select className="form-select" value={form.facing} onChange={e => update('facing', e.target.value)}>
                      <option value="">Select</option>
                      {FACING.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Property Age</label>
                    <select className="form-select" value={form.age} onChange={e => update('age', e.target.value)}>
                      <option value="">Select</option>
                      {['New / Under Construction', '< 1 Year', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'].map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Describe your property — amenities, landmark, ventilation, water supply..."
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* MULTI-PHOTO UPLOAD SECTION (MANDATORY) */}
                <div className={styles.photoSection}>
                  <div className={styles.photoHeaderRow}>
                    <label className="form-label" style={{ margin: 0 }}>
                      Property Photos <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    {hasPhotos ? (
                      <span className={styles.photoCountBadge}>
                        📸 {form.images.length} {form.images.length === 1 ? 'Photo Added' : 'Photos Added'}
                      </span>
                    ) : (
                      <span className={styles.mandatoryBadge}>
                        * Mandatory (Upload At Least 1 Photo)
                      </span>
                    )}
                  </div>

                  {/* Hidden multiple file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />

                  {/* If user has added photos, display rich gallery grid */}
                  {hasPhotos ? (
                    <div>
                      <div className={styles.photoGalleryHeader}>
                        <div className={styles.photoGalleryTitle}>
                          Uploaded Photos ({form.images.length}) — First photo is your Cover Image
                        </div>
                        <div className={styles.photoGalleryActions}>
                          <button
                            type="button"
                            className={styles.addMorePhotosBtn}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            + Add More Photos
                          </button>
                          <button
                            type="button"
                            className={styles.clearAllPhotosBtn}
                            onClick={clearAllPhotos}
                          >
                            Clear All
                          </button>
                        </div>
                      </div>

                      <div className={styles.photoGalleryGrid}>
                        {form.images.map((imgUrl, idx) => {
                          const isPrimary = idx === 0;
                          return (
                            <div
                              key={idx}
                              className={`${styles.photoCard} ${isPrimary ? styles.photoCardPrimary : ''}`}
                            >
                              <img src={imgUrl} alt={`Property Photo ${idx + 1}`} className={styles.photoCardImg} />
                              {isPrimary ? (
                                <span className={styles.primaryBadge}>⭐ Cover Photo</span>
                              ) : (
                                <button
                                  type="button"
                                  className={styles.setPrimaryBtn}
                                  onClick={() => setPrimaryPhoto(idx)}
                                >
                                  Make Cover
                                </button>
                              )}
                              <button
                                type="button"
                                className={styles.deletePhotoBtn}
                                title="Delete Photo"
                                onClick={() => removePhoto(idx)}
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}

                        {/* Quick add box inside grid */}
                        <div
                          className={styles.addMoreBox}
                          onClick={() => fileInputRef.current?.click()}
                          title="Add more photos"
                        >
                          <span className={styles.addMorePlus}>+</span>
                          <span className={styles.addMoreText}>Add Photo</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Initial dropzone when 0 photos uploaded */
                    <div
                      className={styles.photoUploadBox}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <div className={styles.photoUploadIcon}>📸</div>
                      <div className={styles.photoUploadTitle}>Upload Multiple Photos from Device</div>
                      <div className={styles.photoUploadHint}>
                        Click or drag & drop — You can select multiple images at once (JPG, PNG, WEBP)
                      </div>
                    </div>
                  )}

                  {/* Mandatory Alert if no photos */}
                  {(!hasPhotos || photoAlert) && (
                    <div className={styles.mandatoryAlert}>
                      <span>⛔</span>
                      <span>
                        <strong>At least 1 photo is required:</strong> You cannot proceed to the next step without attaching photos.
                      </span>
                    </div>
                  )}

                  {/* Sample Preset Photos to add */}
                  <div className={styles.samplePhotosWrap}>
                    <div className={styles.samplePhotosLabel}>
                      <span>Or click to add high-resolution sample photos:</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>Click any to add to your gallery</span>
                    </div>
                    <div className={styles.samplePhotosGrid}>
                      {SAMPLE_PHOTOS.map(sample => {
                        const isAdded = form.images.includes(sample.url);
                        return (
                          <div
                            key={sample.id}
                            className={styles.samplePhotoCard}
                            style={{
                              borderColor: isAdded ? '#10b981' : '#e5e7eb',
                              background: isAdded ? '#ecfdf5' : 'white'
                            }}
                            onClick={() => addSamplePhoto(sample.url)}
                            title={isAdded ? 'Already added to gallery' : 'Click to add to gallery'}
                          >
                            <img src={sample.url} alt={sample.label} />
                            <span>{isAdded ? `✓ ${sample.label}` : `+ ${sample.label}`}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={styles.formNav}>
                  <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={!canProceedStep2}
                    onClick={() => {
                      if (!hasPhotos) {
                        setPhotoAlert(true);
                        return;
                      }
                      if (form.sqft && form.price) setStep(3);
                    }}
                  >
                    Next Step: Contact Details →
                  </button>
                </div>
                {!hasPhotos && (
                  <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, marginTop: '8px', textAlign: 'right' }}>
                    * At least 1 property photo is mandatory before proceeding to Step 3
                  </p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className={styles.formStep}>
                <h3 className={styles.formStepTitle}>Step 3: Contact & Submit</h3>

                <div className={styles.reviewBox}>
                  <h4>📋 Review Your Listing</h4>
                  <div className={styles.reviewGrid}>
                    <div><span>Type</span><strong>{form.propertyType}</strong></div>
                    <div><span>City</span><strong>{form.city}</strong></div>
                    <div><span>Locality</span><strong>{form.area === 'Other' ? form.customArea : form.area}</strong></div>
                    <div><span>Beds / Baths</span><strong>{form.beds ? `${form.beds} BHK` : 'N/A'} / {form.baths || 1} Bath</strong></div>
                    <div><span>Built-up Area</span><strong>{form.sqft} sq.ft</strong></div>
                    <div><span>Price</span><strong>₹{form.price} {form.listingType === 'rent' ? '/mo' : 'L'}</strong></div>
                  </div>

                  {hasPhotos && (
                    <div className={styles.reviewPhotoWrap}>
                      <div className={styles.reviewPhotoHeader}>
                        <span>Attached Property Photos ({form.images.length})</span>
                        <span className={styles.reviewPhotoBadge}>✓ Photos Ready</span>
                      </div>
                      <div className={styles.reviewPhotosStrip}>
                        {form.images.map((imgUrl, idx) => (
                          <div key={idx} className={styles.reviewPhotoItem}>
                            <img src={imgUrl} alt={`Attached ${idx + 1}`} />
                            {idx === 0 && <span className={styles.reviewPrimaryTag}>Cover</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Your Contact Phone Number *</label>
                  <div className={styles.phoneInput}>
                    <span className={styles.phonePrefix}>🇮🇳 +91</span>
                    <input
                      className="form-input"
                      type="tel"
                      placeholder="98765 43210"
                      required
                      maxLength={10}
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      style={{ borderLeft: 'none', borderRadius: '0 12px 12px 0' }}
                    />
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
                    Your contact number will only be shared with verified buyers and tenants.
                  </p>
                </div>

                <div className={styles.formNav}>
                  <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button type="submit" className="btn-primary" disabled={submitting || !form.phone || !hasPhotos}>
                    {submitting ? 'Submitting...' : '🚀 Post Property FREE'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
