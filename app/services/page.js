'use client';
import Link from 'next/link';
import styles from './page.module.css';

const SERVICES = [
  {
    icon: '📐', title: 'Home Loans', desc: 'Get the best home loan rates from 20+ leading banks and NBFCs. Our loan advisors will help you find the perfect plan.',
    features: ['Rates from 8.5% p.a.', 'Up to ₹5 Cr loan amount', 'Quick approval in 48hrs', 'Zero processing fee'],
    cta: 'Check Eligibility', color: '#3b82f6',
  },
  {
    icon: '⚖️', title: 'Legal Services', desc: 'Complete property documentation, title verification, registration, and legal advisory from experienced property lawyers.',
    features: ['Title deed verification', 'Sale deed drafting', 'Property registration', 'EC verification'],
    cta: 'Get Legal Help', color: '#8b5cf6',
  },
  {
    icon: '🏗️', title: 'Interior Design', desc: 'Transform your new home with our premium interior design packages. From modern to traditional — we create your dream space.',
    features: ['3D home visualization', 'Modular kitchen', 'Complete home packages', 'Pan-Chennai service'],
    cta: 'Get a Quote', color: '#ec4899',
  },
  {
    icon: '🔧', title: 'Home Maintenance', desc: 'Professional plumbing, electrical, painting, carpentry and more — all verified, all on-demand.',
    features: ['Verified professionals', 'Same-day service', 'Transparent pricing', 'After-service warranty'],
    cta: 'Book Service', color: '#f59e0b',
  },
  {
    icon: '📦', title: 'Packers & Movers', desc: 'Stress-free relocation within Chennai. Packing, loading, transport, unloading and unpacking — all handled professionally.',
    features: ['Pan-Chennai moving', 'Insured belongings', 'Dedicated team', 'Same-day availability'],
    cta: 'Get Quote', color: '#10b981',
  },
  {
    icon: '🔍', title: 'Property Valuation', desc: 'Get an accurate, certified property valuation report from our certified valuers for buying, selling, or legal purposes.',
    features: ['Certified report', '48hr turnaround', 'Market comparison', 'Legal acceptance'],
    cta: 'Get Valuation', color: '#f26b2b',
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHero}>
        <div className="container">
          <span className="section-badge" style={{background:'rgba(242,107,43,0.15)', color:'#ff9a62', border:'1px solid rgba(242,107,43,0.25)'}}>⚡ Our Services</span>
          <h1 className={styles.pageTitle}>Everything You Need for Your <span>Property Journey</span></h1>
          <p className={styles.pageSub}>From home loans to interior design — Aurally Realty is your one-stop real estate partner in Chennai.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {SERVICES.map(s => (
            <div key={s.title} className={styles.serviceCard}>
              <div className={styles.serviceIcon} style={{'--color': s.color}}>{s.icon}</div>
              <h2 className={styles.serviceTitle}>{s.title}</h2>
              <p className={styles.serviceDesc}>{s.desc}</p>
              <ul className={styles.featureList}>
                {s.features.map(f => (
                  <li key={f}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={styles.serviceBtn} style={{'--color': s.color}}>{s.cta} →</button>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className={styles.contactCta}>
          <h2>Need Help Choosing the Right Service?</h2>
          <p>Our property experts are available Mon–Sat, 9am–7pm</p>
          <div className={styles.contactBtns}>
            <a href="tel:+919876543210" className="btn-primary">📞 +91 98765 43210</a>
            <a href="mailto:hello@aurallyrealty.in" className="btn-secondary">✉️ Email Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
