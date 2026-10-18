'use client';
import { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import styles from './page.module.css';

const DISCIPLINES = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'architect', label: 'Architects' },
  { id: 'structural', label: 'Structural Engineers' },
  { id: 'contractor', label: 'Civil Contractors' },
  { id: 'survey', label: 'Surveyors' },
  { id: 'legal', label: 'Legal Advisors' },
  { id: 'interior', label: 'Interior Designers' },
];

export default function ExpertsPage() {
  const [experts, setExperts] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Consultation Enquiry Modal
  const [activeExpert, setActiveExpert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    selectedListingId: null
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

    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/experts?verified=true');
      if (Array.isArray(data)) {
        setExperts(data);
      }
    } catch (err) {
      console.warn('Could not load experts from API:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperts = useMemo(() => {
    return experts.filter(exp => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || (
        exp.public_name.toLowerCase().includes(q) ||
        (exp.headline && exp.headline.toLowerCase().includes(q)) ||
        (exp.qualifications && exp.qualifications.toLowerCase().includes(q)) ||
        (exp.description && exp.description.toLowerCase().includes(q))
      );

      let matchDiscipline = true;
      if (selectedDiscipline !== 'all') {
        const d = selectedDiscipline.toLowerCase();
        const headline = (exp.headline || '').toLowerCase();
        const name = (exp.public_name || '').toLowerCase();
        const quals = (exp.qualifications || '').toLowerCase();
        const services = Array.isArray(exp.services_offered)
          ? exp.services_offered.map(s => `${s.title} ${s.service_name}`).join(' ').toLowerCase()
          : '';

        matchDiscipline = headline.includes(d) || name.includes(d) || quals.includes(d) || services.includes(d);
      }

      return matchQuery && matchDiscipline;
    });
  }, [experts, selectedDiscipline, searchQuery]);

  const handleOpenConsultModal = (expert) => {
    setActiveExpert(expert);
    const firstListing = Array.isArray(expert.services_offered) && expert.services_offered.length > 0 
      ? expert.services_offered[0].id 
      : null;

    setFormData(prev => ({
      ...prev,
      selectedListingId: firstListing,
      message: `Hello ${expert.public_name}, I am looking for your professional consultation regarding my project.`
    }));
    setSubmitSuccess(false);
    setSubmitError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveExpert(null);
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
          service_listing_id: formData.selectedListingId,
          contact_name: formData.name.trim(),
          contact_phone: formData.phone.trim(),
          contact_email: formData.email.trim() || null,
          subject: `Consultation Request for ${activeExpert?.public_name}`,
          message: formData.message.trim() || `Consultation request for ${activeExpert?.public_name}.`
        })
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 2500);
    } catch (err) {
      console.error('Enquiry submission error:', err);
      setSubmitError(err.message || 'Failed to submit consultation request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppChat = (expert) => {
    const phone = expert.contact_phone || '919841023456';
    const cleanPhone = phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Hi ${expert.public_name}, I saw your verified profile on Aurally Realty and would like to consult with you.`);
    window.open(`https://wa.me/91${cleanPhone.slice(-10)}?text=${msg}`, '_blank');
  };

  const getInitials = (name) => {
    if (!name) return 'EX';
    return name
      .replace(/^(Ar\.|Er\.|Adv\.)\s*/i, '')
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className={styles.page}>
      {/* ===== HERO BANNER ===== */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.badgeRow}>
              <span className={styles.heroBadge}>🛡️ Verified Professionals Directory</span>
              <span className={styles.reraBadge}>RERA & Council Registered</span>
            </div>
            <h1 className={styles.heroTitle}>
              Find Top <span>Architects, Structural Engineers</span> & Contractors in Tamil Nadu
            </h1>
            <p className={styles.heroSub}>
              Connect with certified civil engineers, chartered architects, registered surveyors, and High Court advocates for all your design, structural stability, and property legal requirements.
            </p>

            {/* Search Input */}
            <div className={styles.searchContainer}>
              <div className={styles.searchBar}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search by name, expertise, or license (e.g. Ar. Rajesh, STAAD, RERA advocate)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container">
        {/* Discipline Filter Pills */}
        <div className={styles.filterPillsWrapper}>
          <div className={styles.filterPills}>
            {DISCIPLINES.map(d => (
              <button
                key={d.id}
                type="button"
                className={`${styles.pillBtn} ${selectedDiscipline === d.id ? styles.pillBtnActive : ''}`}
                onClick={() => setSelectedDiscipline(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading verified experts...</p>
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👷‍♂️</div>
            <h3>No expert profiles found</h3>
            <p>No experts matched your search query. Try choosing another discipline or resetting your search.</p>
            <button
              className={styles.resetBtn}
              onClick={() => { setSelectedDiscipline('all'); setSearchQuery(''); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredExperts.map(expert => {
              const initials = getInitials(expert.public_name);
              const services = Array.isArray(expert.services_offered) ? expert.services_offered : [];

              return (
                <div key={expert.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    {/* Avatar with Initials */}
                    <div className={styles.avatar}>
                      <span>{initials}</span>
                    </div>

                    <div className={styles.expertMeta}>
                      <div className={styles.nameRow}>
                        <h3 className={styles.expertName}>{expert.public_name}</h3>
                        <span className={styles.verifiedBadge} title="Council & Platform Verified">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#16a34a" stroke="#ffffff" strokeWidth="2">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                          </svg>
                          Verified
                        </span>
                      </div>

                      <p className={styles.expertHeadline}>{expert.headline}</p>

                      <div className={styles.credentialsRow}>
                        {expert.years_experience && (
                          <span className={styles.credPill}>
                            ⏱️ {expert.years_experience}+ Years Exp
                          </span>
                        )}
                        {expert.license_number && (
                          <span className={styles.credPill} title={`License: ${expert.license_number}`}>
                            📜 Lic: {expert.license_number}
                          </span>
                        )}
                        <span className={styles.locationPill}>
                          📍 {expert.location_name || 'Chennai'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className={styles.expertDesc}>{expert.description}</p>

                  {expert.qualifications && (
                    <div className={styles.qualsBox}>
                      <span className={styles.qualsLabel}>Qualifications:</span>
                      <span className={styles.qualsText}>{expert.qualifications}</span>
                    </div>
                  )}

                  {/* Services Offered */}
                  {services.length > 0 && (
                    <div className={styles.servicesSection}>
                      <span className={styles.servicesHeading}>Core Offerings:</span>
                      <div className={styles.servicesList}>
                        {services.map(s => (
                          <div key={s.id} className={styles.serviceChip}>
                            <span className={styles.serviceTitle}>{s.service_name || s.title}</span>
                            {s.starting_price && (
                              <span className={styles.servicePrice}>
                                ₹{Number(s.starting_price).toLocaleString('en-IN')}{s.pricing_model === 'per_sqft' ? '/sqft' : ''}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.consultBtn}
                      onClick={() => handleOpenConsultModal(expert)}
                    >
                      <span>💬 Consult Expert</span>
                    </button>
                    <button
                      type="button"
                      className={styles.whatsappBtn}
                      onClick={() => handleWhatsAppChat(expert)}
                      title="Direct WhatsApp Inquiry"
                    >
                      <span>🟢 WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Professional Join Callout */}
        <div className={styles.joinCallout}>
          <div className={styles.joinText}>
            <h2>Are you an Architect, Civil Contractor or Chartered Engineer?</h2>
            <p>Join the Aurally Realty Verified Professional Network to receive qualified client leads for turnkey construction, structural design, and interior fitouts across Tamil Nadu.</p>
          </div>
          <a href="mailto:partners@aurallyrealty.com?subject=Professional Registration Application" className={styles.joinBtn}>
            Register as an Expert →
          </a>
        </div>
      </div>

      {/* ===== DIRECT CONSULTATION MODAL ===== */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseModal}>✕</button>

            <div className={styles.modalHeader}>
              <div className={styles.modalAvatar}>{getInitials(activeExpert?.public_name)}</div>
              <div>
                <span className={styles.modalSub}>Consultation Request</span>
                <h3 className={styles.modalTitle}>{activeExpert?.public_name}</h3>
                <span className={styles.modalLicense}>Lic: {activeExpert?.license_number || 'Registered'}</span>
              </div>
            </div>

            {submitSuccess ? (
              <div className={styles.modalSuccess}>
                <div className={styles.successIcon}>🎉</div>
                <h4>Consultation Request Sent!</h4>
                <p>Your request has been routed directly to {activeExpert?.public_name}. You will receive a direct phone call or email within 2 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className={styles.modalForm}>
                {submitError && <div className={styles.formError}>{submitError}</div>}

                {Array.isArray(activeExpert?.services_offered) && activeExpert.services_offered.length > 1 && (
                  <div className={styles.formRow}>
                    <label>Select Required Service:</label>
                    <select
                      value={formData.selectedListingId || ''}
                      onChange={(e) => setFormData({ ...formData, selectedListingId: Number(e.target.value) })}
                    >
                      {activeExpert.services_offered.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.service_name || s.title} {s.starting_price ? `(From ₹${s.starting_price})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={styles.formRow}>
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anandha Krishnan"
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
                      placeholder="e.g. anand@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label>Project Details / Query for {activeExpert?.public_name}</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your site location, plot size, building plan requirement, or legal opinion query..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Consultation Request'}
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
