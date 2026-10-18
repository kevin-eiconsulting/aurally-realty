'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import styles from './page.module.css';

const SERVICE_ICONS = {
  'turnkey-construction': '🏗️',
  'civil-works-masonry': '🧱',
  'renovation-remodeling': '🔨',
  'waterproofing-solutions': '💧',
  'demolition-excavation': '🚜',
  'structural-retrofitting': '🏢',
  'architectural-planning-design': '📐',
  'structural-engineering-certification': '🏛️',
  'land-topographic-surveying': '🛰️',
  'property-valuation-estimation': '📊',
  'rera-legal-title-verification': '⚖️',
  'vastu-sustainable-planning': '🧭',
  'modular-kitchen-design': '🍳',
  'false-ceiling-lighting': '💡',
  'full-interior-fitouts': '🛋️',
  'painting-textured-finishes': '🎨',
  'home-loan-advisory': '💳',
  'cmda-dtcp-building-approvals': '📜',
  'property-registration-patta-transfer': '📑',
  'rental-property-management': '🔑',
  'facility-society-maintenance': '🛠️',
  'periodic-home-inspection-audit': '🔍',
  'rooftop-solar-installation': '☀️',
  'rainwater-harvesting-systems': '🌧️',
  'sewage-treatment-plants-stp': '♻️',
};

const CATEGORY_TABS = [
  { id: 'all', label: 'All Services', icon: '⚡' },
  { id: 'construction-services', label: 'Construction Services', icon: '🏗️' },
  { id: 'experts-on-demand', label: 'Experts on Demand', icon: '📐' },
  { id: 'interiors-home-improvement', label: 'Interiors & Decor', icon: '🛋️' },
  { id: 'finance-legal-approvals', label: 'Approvals & Legal', icon: '⚖️' },
  { id: 'property-management', label: 'Property Management', icon: '🏢' },
  { id: 'sustainability-utilities', label: 'Sustainability & Solar', icon: '☀️' },
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Modal State
  const [activeService, setActiveService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    desiredDate: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u);
      if (u) {
        setFormData(prev => ({
          ...prev,
          name: u.username || u.name || '',
          phone: u.phone || '',
          email: u.email || ''
        }));
      }
    }).catch(() => {});

    // Fetch categories and services
    Promise.all([
      apiFetch('/services/categories').catch(() => []),
      apiFetch('/services').catch(() => [])
    ]).then(([catData, servData]) => {
      if (Array.isArray(catData)) setCategories(catData);
      if (Array.isArray(servData)) setServices(servData);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchCat = selectedCategory === 'all' || s.category_slug === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || (
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.category_name && s.category_name.toLowerCase().includes(q))
      );
      return matchCat && matchQuery;
    });
  }, [services, selectedCategory, searchQuery]);

  const handleOpenModal = (service) => {
    setActiveService(service);
    setSubmitSuccess(false);
    setSubmitError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveService(null);
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || (!formData.phone.trim() && !formData.email.trim())) {
      setSubmitError('Please provide your name and contact phone or email.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await apiFetch('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          service_id: activeService?.id,
          contact_name: formData.name.trim(),
          contact_phone: formData.phone.trim(),
          contact_email: formData.email.trim() || null,
          desired_date: formData.desiredDate || null,
          subject: `Enquiry for ${activeService?.name}`,
          message: formData.message.trim() || `Requesting quote and callback for ${activeService?.name}.`
        })
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 2500);
    } catch (err) {
      console.error('Enquiry error:', err);
      setSubmitError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ===== HERO SECTION ===== */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>⚡ Real Estate & Civil Services Marketplace</span>
            <h1 className={styles.heroTitle}>
              Verified Construction, Design & <span>Legal Services</span>
            </h1>
            <p className={styles.heroSub}>
              From turnkey construction and 3D architectural design to RERA legal opinions and solar installations — connect with top licensed professionals in Tamil Nadu.
            </p>

            {/* Search Bar */}
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search services (e.g. Waterproofing, Modular Kitchen, CMDA Approvals)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
            </div>

            {/* Quick Link to Experts Directory */}
            <div className={styles.expertsBanner}>
              <span className={styles.bannerIcon}>👷‍♂️</span>
              <div className={styles.bannerText}>
                <strong>Looking for licensed professionals?</strong> Browse our verified directory of Architects, Structural Engineers & Contractors.
              </div>
              <Link href="/experts" className={styles.bannerBtn}>
                Browse Experts Directory →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container">
        {/* Category Selector Tabs */}
        <div className={styles.tabsWrapper}>
          <div className={styles.tabsScroll}>
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tabBtn} ${selectedCategory === tab.id ? styles.tabBtnActive : ''}`}
                onClick={() => setSelectedCategory(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id !== 'all' && (
                  <span className={styles.tabCount}>
                    {services.filter(s => s.category_slug === tab.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading verified services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No services found</h3>
            <p>We couldn't find any services matching "{searchQuery}". Try a different keyword or reset filters.</p>
            <button
              className={styles.resetBtn}
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredServices.map(service => {
              const icon = SERVICE_ICONS[service.slug] || '⚡';
              return (
                <div key={service.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconBox}>
                      <span className={styles.cardIcon}>{icon}</span>
                    </div>
                    <span className={styles.categoryBadge}>{service.category_name}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{service.name}</h3>
                  <p className={styles.cardDesc}>{service.description}</p>

                  <div className={styles.cardMeta}>
                    <div className={styles.priceBadge}>
                      {service.min_starting_price ? (
                        <>
                          <span className={styles.priceLabel}>Starting from</span>
                          <span className={styles.priceValue}>₹{Number(service.min_starting_price).toLocaleString('en-IN')}</span>
                        </>
                      ) : (
                        <span className={styles.quoteOnly}>Quote on Request</span>
                      )}
                    </div>
                    {service.providers_count > 0 && (
                      <span className={styles.providersCount}>
                        {service.providers_count} verified provider{service.providers_count > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.enquireBtn}
                      onClick={() => handleOpenModal(service)}
                    >
                      Enquire / Request Quote →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Support Banner */}
        <div className={styles.supportBanner}>
          <div className={styles.supportContent}>
            <h2>Custom Project or Large Commercial Requirement?</h2>
            <p>Our dedicated civil project team assists builders, developers, and individual home makers with bulk procurement and turnkey management.</p>
            <div className={styles.supportActions}>
              <a href="tel:+919841023456" className={styles.supportCallBtn}>📞 Call Project Support</a>
              <Link href="/experts" className={styles.supportConsultBtn}>Consult a Chartered Engineer</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ENQUIRY MODAL ===== */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseModal}>✕</button>

            <div className={styles.modalHeader}>
              <span className={styles.modalIcon}>{SERVICE_ICONS[activeService?.slug] || '⚡'}</span>
              <div>
                <span className={styles.modalCategory}>{activeService?.category_name}</span>
                <h3 className={styles.modalTitle}>{activeService?.name}</h3>
              </div>
            </div>

            {submitSuccess ? (
              <div className={styles.modalSuccess}>
                <div className={styles.successIcon}>✅</div>
                <h4>Enquiry Submitted Successfully!</h4>
                <p>Our verified service partners and coordinators will review your requirements and reach out to you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className={styles.modalForm}>
                {submitError && <div className={styles.formError}>{submitError}</div>}

                <div className={styles.formRow}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formRow}>
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98401 23456"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label>Preferred Date / Timeline</label>
                  <input
                    type="date"
                    value={formData.desiredDate}
                    onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })}
                  />
                </div>

                <div className={styles.formRow}>
                  <label>Project Details / Special Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your site location, square footage, scope of work, or any specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Send Enquiry Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
