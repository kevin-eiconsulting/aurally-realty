'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PROPERTIES } from '@/lib/data';
import styles from './page.module.css';

const MOCK_USERS = [
  { id: 1, name: 'Priya Suresh', phone: '+91 98765 43210', listings: 2, joined: '12 Oct 2026', status: 'active' },
  { id: 2, name: 'Karthik Rajan', phone: '+91 87654 32109', listings: 0, joined: '10 Oct 2026', status: 'active' },
  { id: 3, name: 'Meena Chandran', phone: '+91 76543 21098', listings: 1, joined: '8 Oct 2026', status: 'pending' },
  { id: 4, name: 'Ravi Kumar', phone: '+91 65432 10987', listings: 3, joined: '5 Oct 2026', status: 'active' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdminLoggedIn] = useState(true); // set false to test login gate

  if (!isAdminLoggedIn) {
    return (
      <div className={styles.adminLoginPage}>
        <div className={styles.adminLoginCard}>
          <div className={styles.adminLoginIcon}>🔐</div>
          <h2>Admin Access Required</h2>
          <p>Please login with your admin credentials</p>
          <div className="form-group">
            <input className="form-input" type="text" placeholder="Admin Username" />
          </div>
          <div className="form-group">
            <input className="form-input" type="password" placeholder="Password" />
          </div>
          <button className="btn-primary" style={{width:'100%'}}>Login as Admin</button>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: '🏠', label: 'Total Listings', value: PROPERTIES.length, change: '+12%', up: true },
    { icon: '👤', label: 'Registered Users', value: 284, change: '+8%', up: true },
    { icon: '✅', label: 'Active Properties', value: 6, change: '+2', up: true },
    { icon: '⏳', label: 'Pending Review', value: 3, change: '-1', up: false },
  ];

  return (
    <div className={styles.adminPage}>
      {/* Admin Sidebar */}
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.sidebarLogo}>🏡</div>
          <div>
            <p className={styles.sidebarTitle}>Aurally Admin</p>
            <p className={styles.sidebarSub}>Dashboard</p>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {[
            { key: 'overview', icon: '📊', label: 'Overview' },
            { key: 'properties', icon: '🏠', label: 'Properties' },
            { key: 'users', icon: '👤', label: 'Users' },
            { key: 'pending', icon: '⏳', label: 'Pending Review' },
            { key: 'settings', icon: '⚙️', label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`${styles.sidebarLink} ${activeTab === tab.key ? styles.sidebarLinkActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.sidebarBackBtn}>← Back to Site</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.adminMain}>
        <div className={styles.adminHeader}>
          <div>
            <h1 className={styles.adminTitle}>
              {activeTab === 'overview' && '📊 Dashboard Overview'}
              {activeTab === 'properties' && '🏠 All Properties'}
              {activeTab === 'users' && '👤 Registered Users'}
              {activeTab === 'pending' && '⏳ Pending Review'}
              {activeTab === 'settings' && '⚙️ Settings'}
            </h1>
            <p className={styles.adminDate}>Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button className="btn-primary">+ Add Listing</button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.overviewContent}>
            <div className={styles.statsGrid}>
              {stats.map(s => (
                <div key={s.label} className={styles.statCard}>
                  <div className={styles.statTop}>
                    <span className={styles.statIcon}>{s.icon}</span>
                    <span className={`${styles.statChange} ${s.up ? styles.statUp : styles.statDown}`}>
                      {s.change}
                    </span>
                  </div>
                  <p className={styles.statValue}>{s.value}</p>
                  <p className={styles.statLabel}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className={styles.recentSection}>
              <h3 className={styles.recentTitle}>Recent Listings</h3>
              <div className={styles.adminTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Area</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROPERTIES.slice(0,5).map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.title}</strong></td>
                        <td>{p.area}</td>
                        <td style={{textTransform:'capitalize'}}>{p.type}</td>
                        <td className={styles.priceCell}>₹{p.price} {p.priceUnit}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${p.status === 'for-sale' ? styles.statusSale : styles.statusRent}`}>
                            {p.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button className={styles.editBtn}>Edit</button>
                            <button className={styles.deleteBtn}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className={styles.adminTable}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Area</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Beds</th>
                  <th>Verified</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {PROPERTIES.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td><strong>{p.title}</strong></td>
                    <td>{p.area}</td>
                    <td style={{textTransform:'capitalize'}}>{p.type}</td>
                    <td className={styles.priceCell}>₹{p.price} {p.priceUnit}</td>
                    <td>{p.beds > 0 ? `${p.beds} BHK` : 'N/A'}</td>
                    <td>{p.verified ? <span className={styles.verifiedBadge}>✅ Yes</span> : <span className={styles.unverifiedBadge}>❌ No</span>}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${p.status === 'for-sale' ? styles.statusSale : styles.statusRent}`}>
                        {p.status === 'for-sale' ? 'Sale' : 'Rent'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.editBtn}>Edit</button>
                        <button className={styles.deleteBtn}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className={styles.adminTable}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Listings</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.phone}</td>
                    <td>{u.listings}</td>
                    <td>{u.joined}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${u.status === 'active' ? styles.statusActive : styles.statusPending}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.editBtn}>View</button>
                        <button className={styles.deleteBtn}>Block</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div className={styles.pendingWrap}>
            <div className={styles.emptyState}>
              <span style={{fontSize:'52px'}}>⏳</span>
              <h3>3 Properties Awaiting Review</h3>
              <p>These have been submitted by users and need your approval before going live.</p>
              <button className="btn-primary">Review Now</button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsWrap}>
            <div className={styles.settingsCard}>
              <h3>Site Settings</h3>
              <div className="form-group">
                <label className="form-label">Site Name</label>
                <input className="form-input" defaultValue="Aurally Realty" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input className="form-input" defaultValue="hello@aurallyrealty.in" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input className="form-input" defaultValue="+91 98765 43210" />
              </div>
              <button className="btn-primary">Save Settings</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
