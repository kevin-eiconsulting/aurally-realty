'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOutUser } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { togglePropertyListingStatus } from '@/lib/properties';
import styles from './page.module.css';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  // Profile Form state with Builder/Company fields
  const [formProfile, setFormProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    companyName: '',
    businessType: 'builder',
    reraNumber: '',
    whatsappNumber: '',
    websiteUrl: '',
    bio: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  // Properties State
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [deletingPropId, setDeletingPropId] = useState(null);
  const [updatingPropId, setUpdatingPropId] = useState(null);

  // Enquiries State
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryFilter, setEnquiryFilter] = useState('all'); // 'all', 'sent', 'received'
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [updatingEnqId, setUpdatingEnqId] = useState(null);

  // Saved Properties State
  const [savedProperties, setSavedProperties] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Check URL query parameters for ?tab=
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['profile', 'properties', 'enquiries', 'saved'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  // Load User & Profile
  useEffect(() => {
    async function initUser() {
      try {
        const u = await getCurrentUser();
        if (!u) {
          router.push('/login?redirect=/account');
          return;
        }
        setUser(u);
        setFormProfile(prev => ({
          ...prev,
          fullName: u.username || u.name || '',
          email: u.email || '',
          phone: u.phone || ''
        }));

        // Fetch detailed profile with builder stats and businessProfile
        try {
          const profile = await apiFetch('/auth/profile');
          if (profile) {
            setProfileData(profile);
            const biz = profile.businessProfile || {};
            setFormProfile(prev => ({
              ...prev,
              fullName: profile.full_name || profile.username || prev.fullName,
              email: profile.email || prev.email,
              phone: profile.phone || prev.phone,
              companyName: biz.businessName || '',
              businessType: biz.businessType || 'builder',
              reraNumber: biz.reraNumber || '',
              whatsappNumber: biz.whatsappNumber || '',
              websiteUrl: biz.websiteUrl || '',
              bio: biz.description || ''
            }));
          }
        } catch (profileErr) {
          console.warn('Failed to fetch detailed profile:', profileErr.message);
        }
      } catch (err) {
        router.push('/login?redirect=/account');
      } finally {
        setLoading(false);
      }
    }

    initUser();
  }, [router]);

  // Load Tab Data
  const loadTabContent = useCallback(async (tab) => {
    if (tab === 'properties') {
      setLoadingProps(true);
      try {
        const data = await apiFetch('/properties/user/my');
        setMyProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Could not load user properties:', err.message);
      } finally {
        setLoadingProps(false);
      }
    } else if (tab === 'enquiries') {
      setLoadingEnquiries(true);
      try {
        const data = await apiFetch('/enquiries/my');
        setEnquiries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Could not load enquiries:', err.message);
      } finally {
        setLoadingEnquiries(false);
      }
    } else if (tab === 'saved') {
      setLoadingSaved(true);
      try {
        const data = await apiFetch('/auth/favourites');
        setSavedProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Could not load saved properties:', err.message);
      } finally {
        setLoadingSaved(false);
      }
    }
  }, []);

  useEffect(() => {
    if (user && activeTab !== 'profile') {
      loadTabContent(activeTab);
    }
  }, [activeTab, user, loadTabContent]);

  // Handle Profile Update (including company/builder fields)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ text: '', type: '' });

    try {
      const res = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          full_name: formProfile.fullName,
          email: formProfile.email,
          phone: formProfile.phone,
          company_name: formProfile.companyName || undefined,
          business_type: formProfile.businessType || 'builder',
          rera_number: formProfile.reraNumber || undefined,
          whatsapp_number: formProfile.whatsappNumber || undefined,
          website_url: formProfile.websiteUrl || undefined,
          bio: formProfile.bio || undefined,
          currentPassword: formProfile.currentPassword || undefined,
          newPassword: formProfile.newPassword || undefined
        })
      });

      setProfileMsg({ text: 'Profile & company details updated successfully!', type: 'success' });
      setFormProfile(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      if (res?.user) {
        setUser(prev => ({ ...prev, ...res.user }));
      }
      if (res?.businessProfile) {
        setProfileData(prev => ({ ...prev, businessProfile: res.businessProfile }));
      }
    } catch (err) {
      setProfileMsg({ text: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Listing Status Change (Fast toggle)
  const handleListingStatusChange = async (propId, newStatus) => {
    setUpdatingPropId(propId);
    try {
      await togglePropertyListingStatus(propId, newStatus);
      setMyProperties(prev => prev.map(p => p.id === propId ? { ...p, listingStatus: newStatus } : p));
      // Refresh active count in profile stats
      setProfileData(prev => {
        if (!prev) return prev;
        const newActive = myProperties.filter(p => (p.id === propId ? newStatus === 'published' : p.listingStatus === 'published')).length;
        return {
          ...prev,
          stats: {
            ...prev.stats,
            activePropertiesCount: newActive
          }
        };
      });
    } catch (err) {
      alert(`Could not update listing status: ${err.message}`);
    } finally {
      setUpdatingPropId(null);
    }
  };

  // Handle Enquiry Status Change
  const handleEnquiryStatusChange = async (enquiryId, newStatus) => {
    setUpdatingEnqId(enquiryId);
    try {
      await apiFetch(`/enquiries/${enquiryId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setEnquiries(prev => prev.map(enq => enq.id === enquiryId ? { ...enq, enquiry_status: newStatus } : enq));
    } catch (err) {
      alert(`Could not update enquiry status: ${err.message}`);
    } finally {
      setUpdatingEnqId(null);
    }
  };

  // Handle Delete Property
  const handleDeleteProperty = async (propId) => {
    if (!window.confirm('Are you sure you want to permanently delete this property listing?')) {
      return;
    }

    setDeletingPropId(propId);
    try {
      await apiFetch(`/properties/${propId}`, { method: 'DELETE' });
      setMyProperties(prev => prev.filter(p => p.id !== propId));
    } catch (err) {
      alert(`Could not delete property: ${err.message}`);
    } finally {
      setDeletingPropId(null);
    }
  };

  // Handle Remove Favourite
  const handleRemoveFavourite = async (propId) => {
    try {
      await apiFetch('/auth/favourites/toggle', {
        method: 'POST',
        body: JSON.stringify({ property_id: propId })
      });
      setSavedProperties(prev => prev.filter(p => p.id !== propId));
    } catch (err) {
      alert(`Could not update saved properties: ${err.message}`);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await signOutUser();
    router.push('/');
  };

  const filteredEnquiries = enquiries.filter(enq => {
    if (enquiryFilter === 'sent') return enq.enquiry_type === 'sent';
    if (enquiryFilter === 'received') return enq.enquiry_type === 'received';
    return true;
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner}></div>
        <p>Loading your builder dashboard...</p>
      </div>
    );
  }

  // Calculated Builder Stats
  const activeCount = profileData?.stats?.activePropertiesCount ?? myProperties.filter(p => p.listingStatus === 'published').length;
  const totalViews = profileData?.stats?.totalViews ?? myProperties.reduce((acc, p) => acc + (p.views || 0), 0);
  const leadsCount = profileData?.stats?.leadsReceivedCount ?? enquiries.filter(e => e.enquiry_type === 'received').length;
  const favCount = profileData?.stats?.favouritesCount ?? 0;

  return (
    <div className={styles.page}>
      <div className="container">
        {/* ===== TOP ACCOUNT BANNER ===== */}
        <div className={styles.topProfileBar}>
          <div className={styles.avatarLarge}>
            {getInitials(user?.username || user?.full_name)}
          </div>
          <div className={styles.profileMeta}>
            <div className={styles.nameBadges}>
              <h1 className={styles.userName}>{user?.username || 'Property User'}</h1>
              {user?.roles?.map(role => (
                <span key={role} className={styles.roleBadge}>
                  {role.replace('_', ' ').toUpperCase()}
                </span>
              ))}
              {profileData?.businessProfile?.businessName && (
                <span className={styles.builderBadge}>
                  🏢 {profileData.businessProfile.businessName}
                </span>
              )}
            </div>
            <p className={styles.userContacts}>
              {user?.email && <span>✉️ {user.email}</span>}
              {user?.phone && <span>📞 {user.phone}</span>}
              {profileData?.businessProfile?.reraNumber && (
                <span>🏛️ RERA: {profileData.businessProfile.reraNumber}</span>
              )}
            </p>
          </div>
          <button onClick={handleLogout} className={styles.topLogoutBtn}>
            Sign Out
          </button>
        </div>

        {/* ===== EXECUTIVE 4-CARD BUILDER STATS ROW ===== */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.statIconListing}`}>
              🏠
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{activeCount}</span>
              <span className={styles.statLabel}>Active Listings</span>
              <span className={styles.statSub}>Live on Aurally</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.statIconViews}`}>
              👁️
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalViews}</span>
              <span className={styles.statLabel}>Total Views</span>
              <span className={styles.statSub}>Buyer impressions</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.statIconLeads}`}>
              📩
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{leadsCount}</span>
              <span className={styles.statLabel}>Buyer Inquiries</span>
              <span className={styles.statSub}>Direct leads received</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.statIconSaved}`}>
              🔖
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{favCount}</span>
              <span className={styles.statLabel}>Saved / Shortlisted</span>
              <span className={styles.statSub}>By interested buyers</span>
            </div>
          </div>
        </div>

        {/* ===== DASHBOARD BODY ===== */}
        <div className={styles.dashboardLayout}>
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className={styles.sidebar}>
            <nav className={styles.navMenu}>
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'profile' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className={styles.navIcon}>👤</span>
                <span className={styles.navLabel}>My Profile & Brand</span>
              </button>

              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'properties' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('properties')}
              >
                <span className={styles.navIcon}>🏠</span>
                <span className={styles.navLabel}>Manage Listings</span>
                {profileData?.stats?.propertiesCount > 0 && (
                  <span className={styles.countBadge}>{profileData.stats.propertiesCount}</span>
                )}
              </button>

              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'enquiries' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('enquiries')}
              >
                <span className={styles.navIcon}>📩</span>
                <span className={styles.navLabel}>Buyer Inquiries</span>
                {leadsCount > 0 && (
                  <span className={styles.countBadge}>{leadsCount}</span>
                )}
              </button>

              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'saved' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <span className={styles.navIcon}>🔖</span>
                <span className={styles.navLabel}>Saved Properties</span>
                {profileData?.stats?.favouritesCount > 0 && (
                  <span className={styles.countBadge}>{profileData.stats.favouritesCount}</span>
                )}
              </button>
            </nav>

            <div className={styles.sidebarFooter}>
              <Link href="/sell" className={styles.sidebarPostBtn}>
                + Post New Property
              </Link>
            </div>
          </aside>

          {/* MAIN TAB CONTENT */}
          <main className={styles.tabContentArea}>
            {/* 1. PROFILE & BUILDER BRAND TAB */}
            {activeTab === 'profile' && (
              <div className={styles.tabCard}>
                <div className={styles.tabHeader}>
                  <h2>Personal & Builder Information</h2>
                  <p>Manage your account credentials, business name, RERA license, and contact settings.</p>
                </div>

                {profileMsg.text && (
                  <div className={`${styles.statusMessage} ${styles[profileMsg.type]}`}>
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
                  <div className={styles.formRowDouble}>
                    <div className={styles.inputGroup}>
                      <label>Full Name *</label>
                      <input
                        type="text"
                        value={formProfile.fullName}
                        onChange={e => setFormProfile({ ...formProfile, fullName: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Primary Phone Number *</label>
                      <input
                        type="tel"
                        value={formProfile.phone}
                        onChange={e => setFormProfile({ ...formProfile, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={formProfile.email}
                      onChange={e => setFormProfile({ ...formProfile, email: e.target.value })}
                      placeholder="e.g. builder@example.com"
                    />
                  </div>

                  {/* BUILDER / COMPANY DETAILS SECTION */}
                  <div className={styles.builderSectionHeader}>
                    <h3 className={styles.subHeading} style={{ margin: 0 }}>
                      🏢 Builder / Agency Brand Profile
                    </h3>
                    <span className={styles.builderBadge}>MagicBricks Style</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '16px' }}>
                    Showcase your brand credentials to give genuine buyers and tenants confidence in your listings.
                  </p>

                  <div className={styles.formRowDouble}>
                    <div className={styles.inputGroup}>
                      <label>Company / Builder Name</label>
                      <input
                        type="text"
                        value={formProfile.companyName}
                        onChange={e => setFormProfile({ ...formProfile, companyName: e.target.value })}
                        placeholder="e.g. Aurally Developers Pvt Ltd"
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Registered As</label>
                      <select
                        value={formProfile.businessType}
                        onChange={e => setFormProfile({ ...formProfile, businessType: e.target.value })}
                        className={styles.statusSelect}
                        style={{ height: '44px', width: '100%', fontSize: '14px' }}
                      >
                        <option value="builder">Builder / Developer</option>
                        <option value="agent">Real Estate Agent / Broker</option>
                        <option value="contractor">Civil Contractor</option>
                        <option value="supplier">Material Supplier</option>
                        <option value="other">Individual Owner</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRowDouble}>
                    <div className={styles.inputGroup}>
                      <label>RERA Registration Number</label>
                      <input
                        type="text"
                        value={formProfile.reraNumber}
                        onChange={e => setFormProfile({ ...formProfile, reraNumber: e.target.value })}
                        placeholder="e.g. TN/01/Building/2026/0123"
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>WhatsApp Business Number</label>
                      <input
                        type="tel"
                        value={formProfile.whatsappNumber}
                        onChange={e => setFormProfile({ ...formProfile, whatsappNumber: e.target.value })}
                        placeholder="e.g. 9840012345 (for instant chat)"
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Company Website Link (Optional)</label>
                    <input
                      type="url"
                      value={formProfile.websiteUrl}
                      onChange={e => setFormProfile({ ...formProfile, websiteUrl: e.target.value })}
                      placeholder="e.g. https://www.yourcompany.com"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>About Your Firm / Developer Bio</label>
                    <textarea
                      rows="3"
                      value={formProfile.bio}
                      onChange={e => setFormProfile({ ...formProfile, bio: e.target.value })}
                      placeholder="Describe your ongoing projects, completed square footage, years in business, and quality standards..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div className={styles.sectionDivider} />

                  <h3 className={styles.subHeading}>Change Password (Optional)</h3>
                  <div className={styles.formRowDouble}>
                    <div className={styles.inputGroup}>
                      <label>Current Password</label>
                      <input
                        type="password"
                        value={formProfile.currentPassword}
                        onChange={e => setFormProfile({ ...formProfile, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>New Password</label>
                      <input
                        type="password"
                        value={formProfile.newPassword}
                        onChange={e => setFormProfile({ ...formProfile, newPassword: e.target.value })}
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button type="submit" className={styles.saveBtn} disabled={savingProfile}>
                      {savingProfile ? 'Saving Changes...' : 'Save Profile & Brand Info'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. MANAGE PROPERTIES TAB */}
            {activeTab === 'properties' && (
              <div className={styles.tabCard}>
                <div className={styles.tabHeaderBetween}>
                  <div>
                    <h2>Manage Listings & Performance</h2>
                    <p>Track live search views, buyer inquiries, and update listing status across Tamil Nadu.</p>
                  </div>
                  <Link href="/sell" className={styles.addPropertyBtn}>
                    + Post Property
                  </Link>
                </div>

                {loadingProps ? (
                  <div className={styles.tabLoading}>
                    <div className={styles.spinner}></div>
                    <p>Loading your property listings...</p>
                  </div>
                ) : myProperties.length === 0 ? (
                  <div className={styles.emptyCard}>
                    <div className={styles.emptyIcon}>🏠</div>
                    <h3>No properties posted yet</h3>
                    <p>Have an apartment, plot, or villa to sell or rent out? Post it for free on Aurally Realty.</p>
                    <Link href="/sell" className={styles.emptyActionBtn}>
                      + Post Your First Property
                    </Link>
                  </div>
                ) : (
                  <div className={styles.propertyList}>
                    {myProperties.map(prop => (
                      <div key={prop.id} className={styles.propertyItem}>
                        <img
                          src={prop.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'}
                          alt={prop.title}
                          className={styles.propThumb}
                        />
                        <div className={styles.propDetails}>
                          <div className={styles.propHeader}>
                            <h4 className={styles.propTitle}>{prop.title}</h4>
                            
                            {/* Fast status switcher */}
                            <select
                              className={styles.statusSelect}
                              value={prop.listingStatus || 'published'}
                              disabled={updatingPropId === prop.id}
                              onChange={(e) => handleListingStatusChange(prop.id, e.target.value)}
                              title="Switch listing visibility"
                            >
                              <option value="published">🟢 Active</option>
                              <option value="pending">🟡 Pending</option>
                              <option value="sold">🔴 Sold / Closed</option>
                              <option value="archived">⚪ Inactive / Hidden</option>
                            </select>
                          </div>

                          <div className={styles.propSpecs}>
                            <span>📍 {prop.area}, {prop.city}</span>
                            <span>🛏️ {prop.beds} BHK</span>
                            <span>📐 {prop.sqft} sq.ft</span>
                            <span className={styles.propType}>{prop.type}</span>
                            {prop.reraNumber && <span>🏛️ RERA</span>}
                          </div>

                          {/* Builder Metrics Row (Views & Leads) */}
                          <div className={styles.propMetricRow}>
                            <div className={styles.propMetricItem}>
                              <span>👁️</span>
                              <span>Views: <strong>{prop.views || 0}</strong></span>
                            </div>
                            <div className={styles.propMetricItem}>
                              <span>📩</span>
                              <span>Inquiries: <strong>{prop.leadsCount || 0}</strong></span>
                            </div>
                            <div className={styles.propMetricItem} style={{ marginLeft: 'auto', color: '#94a3b8' }}>
                              <span>📅 {new Date(prop.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>

                          <div className={styles.propFooter}>
                            <div className={styles.propPrice}>
                              ₹{prop.price} {prop.priceUnit}
                            </div>
                            <div className={styles.propActions}>
                              <Link href={`/property/${prop.id}`} className={styles.viewLinkBtn}>
                                View
                              </Link>
                              <Link href={`/account/property/${prop.id}/edit`} className={styles.editLinkBtn}>
                                ✏️ Edit
                              </Link>
                              <button
                                type="button"
                                className={styles.deletePropBtn}
                                onClick={() => handleDeleteProperty(prop.id)}
                                disabled={deletingPropId === prop.id}
                              >
                                {deletingPropId === prop.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. BUYER INQUIRIES & LEAD PIPELINE TAB */}
            {activeTab === 'enquiries' && (
              <div className={styles.tabCard}>
                <div className={styles.tabHeaderBetween}>
                  <div>
                    <h2>Buyer Inquiries & Leads Pipeline</h2>
                    <p>Track inquiries received on your properties and manage lead follow-up stages.</p>
                  </div>
                  <div className={styles.filterButtonGroup}>
                    <button
                      className={`${styles.filterBtn} ${enquiryFilter === 'all' ? styles.filterBtnActive : ''}`}
                      onClick={() => setEnquiryFilter('all')}
                    >
                      All ({enquiries.length})
                    </button>
                    <button
                      className={`${styles.filterBtn} ${enquiryFilter === 'received' ? styles.filterBtnActive : ''}`}
                      onClick={() => setEnquiryFilter('received')}
                    >
                      Received Leads ({enquiries.filter(e => e.enquiry_type === 'received').length})
                    </button>
                    <button
                      className={`${styles.filterBtn} ${enquiryFilter === 'sent' ? styles.filterBtnActive : ''}`}
                      onClick={() => setEnquiryFilter('sent')}
                    >
                      Sent ({enquiries.filter(e => e.enquiry_type === 'sent').length})
                    </button>
                  </div>
                </div>

                {loadingEnquiries ? (
                  <div className={styles.tabLoading}>
                    <div className={styles.spinner}></div>
                    <p>Loading inquiries...</p>
                  </div>
                ) : filteredEnquiries.length === 0 ? (
                  <div className={styles.emptyCard}>
                    <div className={styles.emptyIcon}>📩</div>
                    <h3>No inquiries to display</h3>
                    <p>You have not submitted any enquiries yet, or no leads have been received on your listings.</p>
                  </div>
                ) : (
                  <div className={styles.enquiriesList}>
                    {filteredEnquiries.map(enq => (
                      <div key={enq.id} className={styles.enquiryCard}>
                        <div className={styles.enquiryTop}>
                          <div>
                            <span className={`${styles.enquiryTypeBadge} ${styles[enq.enquiry_type]}`}>
                              {enq.enquiry_type === 'sent' ? '↗ My Inquiry Sent' : '↙ Buyer Lead Received'}
                            </span>
                            <h4 className={styles.enquiryTarget}>
                              {enq.property_title || enq.service_title || enq.service_name || 'General Platform Inquiry'}
                            </h4>
                          </div>

                          {/* Lead status stage selector */}
                          <select
                            className={styles.leadStatusSelect}
                            value={enq.enquiry_status || 'new'}
                            disabled={updatingEnqId === enq.id}
                            onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value)}
                            title="Update lead follow-up stage"
                          >
                            <option value="new">🔴 New Lead</option>
                            <option value="in_progress">🟡 In Progress</option>
                            <option value="contacted">🟢 Contacted</option>
                            <option value="closed">⚪ Closed</option>
                            <option value="spam">⚠️ Spam</option>
                          </select>
                        </div>

                        <p className={styles.enquiryMessage}>
                          "{enq.message}"
                        </p>

                        <div className={styles.enquiryMeta}>
                          <div className={styles.contactDetails}>
                            <span>👤 <strong>{enq.contact_name}</strong></span>
                            {enq.contact_phone && <span>📞 <a href={`tel:${enq.contact_phone}`}>{enq.contact_phone}</a></span>}
                            {enq.contact_email && <span>✉️ <a href={`mailto:${enq.contact_email}`}>{enq.contact_email}</a></span>}
                          </div>
                          <span className={styles.enquiryDate}>
                            {new Date(enq.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Direct buyer contact shortcuts */}
                        {enq.contact_phone && (
                          <div className={styles.leadActionsBar}>
                            <div className={styles.leadContactBtns}>
                              <a
                                href={`tel:${enq.contact_phone}`}
                                className={`${styles.contactPill} ${styles.contactPillCall}`}
                              >
                                📞 Call Buyer
                              </a>
                              <a
                                href={`https://wa.me/91${enq.contact_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${enq.contact_name}, regarding your inquiry on ${enq.property_title || 'our property'} on Aurally Realty:`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.contactPill} ${styles.contactPillWa}`}
                              >
                                💬 WhatsApp Buyer
                              </a>
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                              Stage: <strong>{(enq.enquiry_status || 'new').toUpperCase()}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. SAVED PROPERTIES TAB */}
            {activeTab === 'saved' && (
              <div className={styles.tabCard}>
                <div className={styles.tabHeader}>
                  <h2>Saved Properties</h2>
                  <p>Quick access to all homes and villas you bookmarked for later review.</p>
                </div>

                {loadingSaved ? (
                  <div className={styles.tabLoading}>
                    <div className={styles.spinner}></div>
                    <p>Loading your saved properties...</p>
                  </div>
                ) : savedProperties.length === 0 ? (
                  <div className={styles.emptyCard}>
                    <div className={styles.emptyIcon}>🔖</div>
                    <h3>No saved properties</h3>
                    <p>Click the bookmark/heart icon on any listing to save it here for swift comparison.</p>
                    <div className={styles.emptyButtons}>
                      <Link href="/buy" className={styles.emptyActionBtn}>
                        Explore Properties for Sale
                      </Link>
                      <Link href="/rent" className={styles.emptyActionSecondary}>
                        Explore Rental Homes
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className={styles.savedGrid}>
                    {savedProperties.map(prop => (
                      <div key={prop.id} className={styles.savedCard}>
                        <img
                          src={prop.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'}
                          alt={prop.title}
                          className={styles.savedThumb}
                        />
                        <div className={styles.savedBody}>
                          <h4 className={styles.savedTitle}>{prop.title}</h4>
                          <div className={styles.savedLocation}>📍 {prop.area_name || 'Chennai'}</div>
                          <div className={styles.savedSpecs}>
                            <span>🛏️ {prop.bedrooms} BHK</span>
                            <span>📐 {prop.built_up_area} sq.ft</span>
                          </div>
                          <div className={styles.savedPrice}>
                            ₹{Number(prop.price).toLocaleString('en-IN')}
                          </div>
                          <div className={styles.savedActions}>
                            <Link href={`/property/${prop.id}`} className={styles.savedViewBtn}>
                              View
                            </Link>
                            <button
                              type="button"
                              className={styles.savedRemoveBtn}
                              onClick={() => handleRemoveFavourite(prop.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
