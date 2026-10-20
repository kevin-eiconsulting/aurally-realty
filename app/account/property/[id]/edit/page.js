'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { fetchPropertyById, updateExistingProperty } from '@/lib/properties';
import { TAMIL_NADU_CITIES, CITY_AREAS, PROPERTY_TYPE_OPTIONS } from '@/lib/data';
import AmenitiesSelector from '@/components/AmenitiesSelector';
import styles from './page.module.css';

const OWNERSHIP_OPTIONS = ['Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney'];
const CONSTRUCTION_OPTIONS = ['Ready to Move', 'Under Construction', 'New Launch'];
const FURNISHING_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const FACING_OPTIONS = ['East', 'West', 'North', 'South', 'North-East', 'South-West', 'North-West', 'South-East'];
const STATUS_OPTIONS = [
  { value: 'published', label: '🟢 Published / Active' },
  { value: 'pending', label: '🟡 Pending Verification' },
  { value: 'sold', label: '🔴 Sold / Closed' },
  { value: 'draft', label: '⚪ Draft' },
  { value: 'archived', label: '📁 Archived' },
];

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [form, setForm] = useState({
    title: '',
    listingType: 'sale',
    propertyType: 'apartment',
    ownershipType: 'Freehold',
    constructionStatus: 'Ready to Move',
    listingStatus: 'published',
    reraNumber: '',
    city: 'Chennai',
    area: '',
    address: '',
    beds: '2',
    baths: '2',
    sqft: '1100',
    carpetArea: '',
    floor: '1st',
    totalFloors: '4',
    facing: 'East',
    furnishing: 'Semi Furnished',
    age: 'New',
    price: '',
    maintenance: '',
    amenities: [],
    image: '',
    additionalImages: '',
    videoUrl: '',
    description: '',
    phone: ''
  });

  // Load User and Existing Property
  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push(`/login?redirect=/account/property/${propertyId}/edit`);
          return;
        }
        setUser(currentUser);

        if (!propertyId) return;

        const prop = await fetchPropertyById(propertyId);
        if (!prop) {
          setErrorMsg('Property not found or you do not have permission to edit it.');
          setLoading(false);
          return;
        }

        // Parse additional images
        let addImages = '';
        if (Array.isArray(prop.images) && prop.images.length > 1) {
          addImages = prop.images.slice(1).join('\n');
        }

        setForm({
          title: prop.title || '',
          listingType: prop.status === 'for-rent' ? 'rent' : 'sale',
          propertyType: (prop.type || 'apartment').toLowerCase(),
          ownershipType: prop.ownershipType || 'Freehold',
          constructionStatus: prop.constructionStatus || 'Ready to Move',
          listingStatus: prop.listingStatus || 'published',
          reraNumber: prop.reraNumber || '',
          city: prop.city || 'Chennai',
          area: prop.area || '',
          address: prop.address || '',
          beds: String(prop.beds ?? '2'),
          baths: String(prop.baths ?? '2'),
          sqft: String(prop.sqft ?? '1000'),
          carpetArea: prop.carpetArea ? String(prop.carpetArea) : '',
          floor: String(prop.floor || 'Ground'),
          totalFloors: prop.totalFloors ? String(prop.totalFloors) : '',
          facing: prop.facing || 'East',
          furnishing: prop.furnishing || 'Semi Furnished',
          age: prop.age || 'New',
          price: String(prop.price ?? ''),
          maintenance: prop.maintenance ? String(prop.maintenance) : '',
          amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
          image: prop.image || (Array.isArray(prop.images) && prop.images[0]) || '',
          additionalImages: addImages,
          videoUrl: prop.videoUrl || '',
          description: prop.description || '',
          phone: prop.phone || currentUser.phone || ''
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading property for edit:', err);
        setErrorMsg('Failed to load property details. Please try again.');
        setLoading(false);
      }
    }

    loadData();
  }, [propertyId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenitiesChange = (newAmenities) => {
    setForm(prev => ({ ...prev, amenities: newAmenities }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!form.title.trim()) {
      setErrorMsg('Please enter a property title.');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setErrorMsg('Please enter a valid price / rent amount.');
      return;
    }
    if (!form.area.trim()) {
      setErrorMsg('Please enter the locality or area name.');
      return;
    }
    if (!form.phone.trim()) {
      setErrorMsg('Please provide a contact phone number.');
      return;
    }

    setSaving(true);

    try {
      // Split additional images by comma or newline
      const extraImgs = form.additionalImages
        ? form.additionalImages
            .split(/[\n,]/)
            .map(s => s.trim())
            .filter(s => s.startsWith('http'))
        : [];
      
      const allImages = [form.image.trim(), ...extraImgs].filter(Boolean);

      const payload = {
        title: form.title.trim(),
        listingType: form.listingType,
        propertyType: form.propertyType,
        area: form.area.trim(),
        city: form.city,
        address: form.address.trim(),
        beds: Number(form.beds) || 0,
        baths: Number(form.baths) || 0,
        sqft: Number(form.sqft) || 0,
        carpetArea: form.carpetArea ? Number(form.carpetArea) : null,
        floor: form.floor,
        totalFloors: form.totalFloors ? Number(form.totalFloors) : null,
        price: Number(form.price),
        facing: form.facing,
        furnishing: form.furnishing,
        age: form.age,
        ownershipType: form.ownershipType,
        maintenance: form.maintenance ? Number(form.maintenance) : 0,
        reraNumber: form.reraNumber.trim(),
        videoUrl: form.videoUrl.trim(),
        amenities: form.amenities,
        description: form.description.trim(),
        phone: form.phone.trim(),
        image: form.image.trim(),
        images: allImages,
        listingStatus: form.listingStatus
      };

      await updateExistingProperty(propertyId, payload);
      setSuccessMsg('Property listing updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to update property:', err);
      setErrorMsg(err.message || 'Failed to update property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.editPage}>
        <div className={styles.container}>
          <div className={styles.loadingBox}>
            <div className={styles.spinner} />
            <p>Loading property details...</p>
          </div>
        </div>
      </main>
    );
  }

  const currentStatusClass =
    form.listingStatus === 'published' ? styles.statusPublished :
    form.listingStatus === 'pending' ? styles.statusPending :
    form.listingStatus === 'sold' ? styles.statusSold :
    styles.statusDraft;

  return (
    <main className={styles.editPage}>
      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <div className={styles.breadcrumbs}>
          <Link href="/account" className={styles.breadcrumbLink}>Dashboard</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link href="/account?tab=properties" className={styles.breadcrumbLink}>Manage Listings</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>Edit Listing #{propertyId}</span>
        </div>

        {/* Top Header */}
        <div className={styles.headerBar}>
          <div>
            <h1 className={styles.headerTitle}>
              Edit Property Listing
              <span className={`${styles.statusBadge} ${currentStatusClass}`}>
                {form.listingStatus}
              </span>
            </h1>
            <p className={styles.headerSubtitle}>
              Update your listing details, pricing, amenities, and media. Changes reflect immediately across the platform.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href={`/property/${propertyId}`} target="_blank" className={styles.btnSecondary}>
              👁️ View Public Listing
            </Link>
            <Link href="/account?tab=properties" className={styles.btnSecondary}>
              📋 Back to Listings
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className={styles.alertSuccess}>
            <div>
              <strong>✅ Changes Saved:</strong> {successMsg}
            </div>
            <div className={styles.alertActions}>
              <Link href={`/property/${propertyId}`} target="_blank" className={styles.alertBtn}>
                View Live Page
              </Link>
              <Link href="/account?tab=properties" className={styles.alertBtnSecondary}>
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className={styles.alertError}>
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Info & Publishing Status */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>⚙️</span>
              <div>
                <h2 className={styles.sectionTitle}>Basic Info & Listing Status</h2>
                <p className={styles.sectionSubtitle}>Define listing type, category, and live visibility</p>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Live Listing Status
                  <span className={styles.labelHint}>Visibility state</span>
                </label>
                <select
                  name="listingStatus"
                  value={form.listingStatus}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Listing Type
                  <span className={styles.labelHint}>Sale or Rental</span>
                </label>
                <div className={styles.pillGroup}>
                  <button
                    type="button"
                    className={`${styles.pillBtn} ${form.listingType === 'sale' ? styles.pillBtnActive : ''}`}
                    onClick={() => setForm(p => ({ ...p, listingType: 'sale' }))}
                  >
                    🏷️ For Sale
                  </button>
                  <button
                    type="button"
                    className={`${styles.pillBtn} ${form.listingType === 'rent' ? styles.pillBtnActive : ''}`}
                    onClick={() => setForm(p => ({ ...p, listingType: 'rent' }))}
                  >
                    🔑 For Rent
                  </button>
                </div>
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Property Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Luxury 3 BHK Sea-View Apartment in ECR"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Property Category</label>
                <select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {PROPERTY_TYPE_OPTIONS.map(pt => (
                    <option key={pt.id} value={pt.id}>{pt.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Ownership Type</label>
                <select
                  name="ownershipType"
                  value={form.ownershipType}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {OWNERSHIP_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Construction Status</label>
                <select
                  name="constructionStatus"
                  value={form.constructionStatus}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {CONSTRUCTION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  RERA Registration Number
                  <span className={styles.labelHint}>Recommended for builder projects</span>
                </label>
                <input
                  type="text"
                  name="reraNumber"
                  value={form.reraNumber}
                  onChange={handleChange}
                  placeholder="e.g. TN/01/Building/0123/2023"
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Location */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>📍</span>
              <div>
                <h2 className={styles.sectionTitle}>Property Location</h2>
                <p className={styles.sectionSubtitle}>Locality and address in Tamil Nadu</p>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>City *</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {TAMIL_NADU_CITIES.filter(c => c !== 'All Tamil Nadu').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Locality / Area *</label>
                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="e.g. OMR, Anna Nagar, Gandhipuram"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>Street Address & Landmark</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. 14, 2nd Main Road, Near Metro Station"
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* Section 3: Dimensions & Specifications */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>📐</span>
              <div>
                <h2 className={styles.sectionTitle}>Dimensions & Layout Specifications</h2>
                <p className={styles.sectionSubtitle}>Floors, area measurements, and room details</p>
              </div>
            </div>

            <div className={styles.grid3}>
              <div className={styles.field}>
                <label className={styles.label}>Bedrooms (BHK)</label>
                <select name="beds" value={form.beds} onChange={handleChange} className={styles.select}>
                  {[0, 1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n === 0 ? 'Plot / None' : `${n} BHK`}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Bathrooms</label>
                <select name="baths" value={form.baths} onChange={handleChange} className={styles.select}>
                  {[0, 1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} Baths</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Facing Direction</label>
                <select name="facing" value={form.facing} onChange={handleChange} className={styles.select}>
                  {FACING_OPTIONS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Super Built-up Area (sq.ft) *</label>
                <input
                  type="number"
                  name="sqft"
                  value={form.sqft}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Carpet Area (sq.ft)</label>
                <input
                  type="number"
                  name="carpetArea"
                  value={form.carpetArea}
                  onChange={handleChange}
                  placeholder="e.g. 950"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Furnishing Status</label>
                <select name="furnishing" value={form.furnishing} onChange={handleChange} className={styles.select}>
                  {FURNISHING_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Floor Number</label>
                <input
                  type="text"
                  name="floor"
                  value={form.floor}
                  onChange={handleChange}
                  placeholder="e.g. 3rd or Ground"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Total Floors in Building</label>
                <input
                  type="number"
                  name="totalFloors"
                  value={form.totalFloors}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Age of Property</label>
                <select name="age" value={form.age} onChange={handleChange} className={styles.select}>
                  <option value="New">Under 1 Year (New)</option>
                  <option value="1-3 years">1 - 3 Years</option>
                  <option value="3-5 years">3 - 5 Years</option>
                  <option value="5-10 years">5 - 10 Years</option>
                  <option value="10+ years">10+ Years</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 4: Pricing & Maintenance */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>💰</span>
              <div>
                <h2 className={styles.sectionTitle}>Pricing & Recurring Charges</h2>
                <p className={styles.sectionSubtitle}>Price structure and maintenance costs</p>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>
                  {form.listingType === 'rent' ? 'Monthly Rent (₹) *' : 'Asking Price (₹ Lakhs or Rupees) *'}
                  <span className={styles.labelHint}>
                    {form.listingType === 'rent' ? 'e.g. 25000' : 'e.g. 85 for 85 Lakhs, or 8500000'}
                  </span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder={form.listingType === 'rent' ? '25000' : '85'}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Maintenance Charges (₹/month)
                  <span className={styles.labelHint}>Optional recurring fees</span>
                </label>
                <input
                  type="number"
                  name="maintenance"
                  value={form.maintenance}
                  onChange={handleChange}
                  placeholder="e.g. 2500"
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          {/* Section 5: Amenities Selector */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✨</span>
              <div>
                <h2 className={styles.sectionTitle}>Amenities & Project Highlights</h2>
                <p className={styles.sectionSubtitle}>Select all facilities available on-site</p>
              </div>
            </div>

            <AmenitiesSelector
              value={form.amenities}
              onChange={handleAmenitiesChange}
            />
          </section>

          {/* Section 6: Media & Virtual Tours */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🖼️</span>
              <div>
                <h2 className={styles.sectionTitle}>Photos & Video Walkthrough</h2>
                <p className={styles.sectionSubtitle}>High quality media improves buyer response rates</p>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldFull}>
                <label className={styles.label}>Primary Cover Image URL *</label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>
                  Additional Gallery Photo URLs
                  <span className={styles.labelHint}>One per line or comma-separated</span>
                </label>
                <textarea
                  name="additionalImages"
                  value={form.additionalImages}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label}>
                  Video Tour / Walkthrough URL
                  <span className={styles.labelHint}>YouTube, Vimeo, or 3D Virtual Tour URL</span>
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={form.videoUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={styles.input}
                />
              </div>

              {form.image && (
                <div className={styles.fieldFull}>
                  <label className={styles.label}>Cover Image Preview</label>
                  <div className={styles.previewRow}>
                    <img
                      src={form.image}
                      alt="Cover Preview"
                      className={styles.previewThumb}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 7: Description & Contact */}
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>📝</span>
              <div>
                <h2 className={styles.sectionTitle}>Description & Contact Phone</h2>
                <p className={styles.sectionSubtitle}>Detailed pitch and verified lead contact</p>
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.fieldFull}>
                <label className={styles.label}>Detailed Property Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Highlight key advantages, proximity to schools/IT parks, builder specifications, ventilation, etc."
                  className={styles.textarea}
                  rows={5}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Contact Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 98400 12345"
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </section>

          {/* Bottom Sticky Action Bar */}
          <div className={styles.bottomActionBar}>
            <div className={styles.bottomActionLeft}>
              <Link href="/account?tab=properties" className={styles.btnSecondary}>
                Discard Changes
              </Link>
            </div>
            <div className={styles.bottomActionRight}>
              <Link href={`/property/${propertyId}`} target="_blank" className={styles.btnSecondary}>
                Preview Live Page
              </Link>
              <button
                type="submit"
                disabled={saving}
                className={styles.btnPrimary}
              >
                {saving ? 'Saving Listing...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
