'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInUser } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (phone.length !== 10) { setError('Please enter a valid 10-digit phone number'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    
    setLoading(true);
    try {
      const user = await signInUser({ phone, password });
      setSuccess(`Logged in successfully as ${user.username}! Redirecting...`);
      setTimeout(() => {
        if (user.isAdmin) {
          router.push('/admin');
        } else {
          router.push('/sell');
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.split}>
        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L26 10V26H18V18H10V26H2V10L14 2Z" fill="white"/>
                  <circle cx="14" cy="13" r="3" fill="#f26b2b"/>
                </svg>
              </div>
              <span>Aurally<b>Realty</b></span>
            </Link>
            <h2 className={styles.leftTitle}>Find Your Dream Home in Chennai</h2>
            <p className={styles.leftSub}>Access thousands of verified properties, post listings for free, and connect with genuine buyers & tenants.</p>
            <div className={styles.leftFeatures}>
              {['🏠 12,000+ Verified Listings', '🔐 Secure & Private', '📱 Post Property for FREE', '⭐ Trusted by 8,500+ Families'].map(f => (
                <div key={f} className={styles.leftFeature}>{f}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formCard}>
            <h1 className={styles.formTitle}>Welcome Back</h1>
            <p className={styles.formSub}>Login to your Aurally Realty account</p>

            <form onSubmit={handleLogin} className={styles.form}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputPrefix}>+91</span>
                  <input
                    type="tel"
                    className={`form-input ${styles.inputWithPrefix}`}
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                    id="phone-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className={styles.passwordHeader}>
                  <label className="form-label">Password</label>
                  <Link href="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
                </div>
                <div className={styles.inputWrap}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`form-input ${styles.inputWithToggle}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    id="password-input"
                  />
                  <button type="button" className={styles.togglePass} onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}
              {success && (
                <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {success}
                </div>
              )}

              <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading} id="login-submit">
                {loading ? <span className="spinner" /> : 'Login →'}
              </button>
            </form>

            <div className={styles.divider}><span>or</span></div>

            <p className={styles.signupPrompt}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className={styles.signupLink}>Create Account FREE</Link>
            </p>

            <p className={styles.agentLink}>
              Are you an agent? <Link href="/admin/login" className={styles.signupLink}>Agent Login →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
