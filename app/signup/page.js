'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUpUser } from '@/lib/auth';
import styles from '../login/page.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);

  const update = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.username.length < 3) { setError('Username must be at least 3 characters'); return; }
    if (form.phone.length !== 10) { setError('Enter a valid 10-digit phone number'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    
    setLoading(true);
    try {
      const user = await signUpUser({
        phone: form.phone,
        username: form.username,
        password: form.password,
      });
      setSuccess(`Account created for ${user.username}! Redirecting to sell/post property...`);
      setTimeout(() => {
        router.push('/sell');
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.split}>
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
            <h2 className={styles.leftTitle}>Join 8,500+ Happy Families Who Found Their Home</h2>
            <p className={styles.leftSub}>Create your free account and start your property journey with Chennai&apos;s most trusted real estate platform.</p>
            <div className={styles.leftFeatures}>
              {['✅ 100% Free Account', '🔐 Secure & Verified', '📋 Post Properties FREE', '💬 Direct Owner Contact'].map(f => (
                <div key={f} className={styles.leftFeature}>{f}</div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.formCard}>
            <h1 className={styles.formTitle}>Create Account</h1>
            <p className={styles.formSub}>It&apos;s free and takes only a minute</p>

            <form onSubmit={handleSignup} className={styles.form}>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input type="text" className="form-input" id="username-input" placeholder="e.g. karthik_rajan" required value={form.username} onChange={e => update('username', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputPrefix}>+91</span>
                  <input type="tel" className={`form-input ${styles.inputWithPrefix}`} id="signup-phone" placeholder="98765 43210" maxLength={10} required value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, ''))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className={styles.inputWrap}>
                  <input type={showPass ? 'text' : 'password'} className={`form-input ${styles.inputWithToggle}`} id="signup-password" placeholder="Minimum 6 characters" required value={form.password} onChange={e => update('password', e.target.value)} />
                  <button type="button" className={styles.togglePass} onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input type="password" className="form-input" id="confirm-password" placeholder="Re-enter your password" required value={form.confirm} onChange={e => update('confirm', e.target.value)} />
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}
              {success && (
                <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {success}
                </div>
              )}

              <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading} id="signup-submit">
                {loading ? <span className="spinner" /> : '🚀 Create Account FREE'}
              </button>

              <p style={{fontSize:'12px', color:'#9ca3af', textAlign:'center', marginTop:'12px'}}>
                By signing up, you agree to our{' '}
                <Link href="#" style={{color:'#f26b2b'}}>Terms of Service</Link> &amp;{' '}
                <Link href="#" style={{color:'#f26b2b'}}>Privacy Policy</Link>
              </p>
            </form>

            <div className={styles.divider}><span>Already have an account?</span></div>
            <p className={styles.signupPrompt}>
              <Link href="/login" className={styles.signupLink}>Login to your account →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
