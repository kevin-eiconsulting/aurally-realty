'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOutUser } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [formProfile, setFormProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  // Properties State
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [deletingPropId, setDeletingPropId] = useState(null);

  // Enquiries State
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryFilter, setEnquiryFilter] = useState('all'); // 'all', 'sent', 'received'
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  // Saved Properties State
  const [savedProperties, setSavedProperties] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

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
        setFormProfile({
          fullName: u.username || u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          currentPassword: '',
          newPassword: ''
        });

        // Fetch detailed profile with stats
        try {
          const profile = await apiFetch('/auth/profile');
          if (profile) {
            setProfileData(profile);
            setFormProfile(prev => ({
              ...prev,
              fullName: profile.full_name || profile.username || prev.fullName,
              email: profile.email || prev.email,
              phone: profile.phone || prev.phone
            }));
          }
        } catch (_) {}
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

  // Handle Profile Update
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
          currentPassword: formProfile.currentPassword || undefined,
          newPassword: formProfile.newPassword || undefined
        })
      });

      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
      setFormProfile(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      if (res?.user) {
        setUser(prev => ({ ...prev, ...res.user }));
      }
    } catch (err) {
      setProfileMsg({ text: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setSavingProfile(false);
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
        <p>Loading your account...</p>
      </div>
    );
  }

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
            </div>
            <p className={styles.userContacts}>
              {user?.email && <span>✉️ {user.email}</span>}
              {user?.phone && <span>📞 {user.phone}</span>}
            </p>
          </div>
          <button onClick={handleLogout} className={styles.topLogoutBtn}>
            Sign Out
          </button>
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
                <span className={styles.navLabel}>My Profile</span>
              </button>

              <button
                type="button"
                className={`${styles.navItem} ${activeTab === 'properties' ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab('properties')}
              >
                <span className={styles.navIcon}>🏠</span>
                <span className={styles.navLabel}>My Properties</span>
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
                <span className={styles.navLabel}>My Enquiries</span>
                {profileData?.stats?.enquiriesCount > 0 && (
                  <span className={styles.countBadge}>{profileData.stats.enquiriesCount}</span>
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
            {/* 1. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className={styles.tabCard}>
                <div className={styles.tabHeader}>
                  <h2>Personal Information</h2>
                  <p>Manage your account credentials, contact phone, and authentication settings.</p>
                </div>

                {profileMsg.text && (
                  <div className={`${styles.statusMessage} ${styles[profileMsg.type]}`}>
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
                  <div className={styles.formRowDouble}>
                    <div className={styles.inputGroup}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={formProfile.fullName}
                        onChange={e => setFormProfile({ ...formProfile, fullName: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Phone Number</label>
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
                      placeholder="e.g. name@example.com"
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
                      {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. MY PROPERTIES TAB */}
            {activeTab === 'properties' && (
              <div className={styles.tabCard}>
                <div className={styles.tabHeaderBetween}>
                  <div>
                    <h2>My Properties</h2>
                    <p>Track listings you have posted for sale or rent across Tamil Nadu.</p>
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
                            <span className={`${styles.statusPill} ${styles[prop.listingStatus || 'published']}`}>
                              {prop.listingStatus === 'published' ? 'Active' : prop.listingStatus}
                            </span>
                          </div>

                          <div className={styles.propSpecs}>
                            <span>📍 {prop.area}, {prop.city}</span>
                            <span>🛏️ {prop.beds} BHK</span>
                            <span>📐 {prop.sqft} sq.ft</span>
                            <span className={styles.propType}>{prop.type}</span>
                          </div>

                          <div className={styles.propFooter}>
                            <div className={styles.propPrice}>
                              ₹{prop.price} {prop.priceUnit}
                            </div>
                            <div className={styles.propActions}>
                              <Link href={`/property/${prop.id}`} className={styles.viewLinkBtn}>
                                View Listing
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

            {/* 3. MY ENQUIRIES TAB */}
            {activeTab === 'enquiries' && (
              <div className={styles.tabCard}>
                <div className={styles.tabHeaderBetween}>
                  <div>
                    <h2>Enquiries & Lead Requests</h2>
                    <p>View all property and civil service inquiries sent by you or received on your listings.</p>
                  </div>
                  <div className={styles.filterButtonGroup}>
                    <button
                      className={`${styles.filterBtn} ${enquiryFilter === 'all' ? styles.filterBtnActive : ''}`}
                      onClick={() => setEnquiryFilter('all')}
                    >
                      All
                    </button>
                    <button
                      className={`${styles.filterBtn} ${enquiryFilter === 'received' ? styles.filterBtnActive : ''}`}
                      onClick={() => setEnquiryFilter('received')}
                    >
                      Received
                    </button>
                    <button
                      className={`${styles.filterBtn} ${enquiryFilter === 'sent' ? styles.filterBtnActive : ''}`}
                      onClick={() => setEnquiryFilter('sent')}
                    >
                      Sent
                    </button>
                  </div>
                </div>

                {loadingEnquiries ? (
                  <div className={styles.tabLoading}>
                    <div className={styles.spinner}></div>
                    <p>Loading enquiries...</p>
                  </div>
                ) : filteredEnquiries.length === 0 ? (
                  <div className={styles.emptyCard}>
                    <div className={styles.emptyIcon}>📩</div>
                    <h3>No enquiries to display</h3>
                    <p>You have not submitted any enquiries yet, or no leads have been received on your listings.</p>
                  </div>
                ) : (
                  <div className={styles.enquiriesList}>
                    {filteredEnquiries.map(enq => (
                      <div key={enq.id} className={styles.enquiryCard}>
                        <div className={styles.enquiryTop}>
                          <div>
                            <span className={`${styles.enquiryTypeBadge} ${styles[enq.enquiry_type]}`}>
                              {enq.enquiry_type === 'sent' ? '↗ My Enquiry Sent' : '↙ Lead Received'}
                            </span>
                            <h4 className={styles.enquiryTarget}>
                              {enq.property_title || enq.service_title || enq.service_name || 'General Platform Enquiry'}
                            </h4>
                          </div>
                          <span className={styles.enquiryStatus}>
                            Status: {enq.enquiry_status?.toUpperCase()}
                          </span>
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
