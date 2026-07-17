'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';
import { useLogin } from '@/hooks';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldShake, setShouldShake] = useState(false);
  const login = useLogin();

  // Reset inputs when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setEmail('');
      setPassword('');
      triggerShake();
    }
  }, [isLoginModalOpen]);

  const triggerShake = () => {
    setShouldShake(true);
    const timer = setTimeout(() => setShouldShake(false), 400);
    return () => clearTimeout(timer);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) triggerShake();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { triggerShake(); return; }
    login.mutate(
      { email, password },
      {
        onSuccess: () => closeLoginModal(),
        onError: () => triggerShake(),
      }
    );
  };

  if (!isLoginModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <div
        className={`w-[90%] max-w-3xl h-auto md:h-[520px] rounded-[18px] overflow-hidden flex flex-col md:flex-row relative ${shouldShake ? 'animate-shake' : ''}`}
        style={{ background: '#ffffff', boxShadow: '0 24px 64px -8px rgba(0,0,0,0.25), 0 8px 24px -4px rgba(0,0,0,0.12)' }}
      >

        {/* ── Close Button ───────────────────────────────────── */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full transition-colors cursor-pointer"
          style={{ color: '#94A3B8', background: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── Left: Brand Banner ─────────────────────────────── */}
        <div
          className="hidden md:flex md:w-[40%] flex-col justify-between p-8 select-none"
          style={{ background: 'linear-gradient(160deg, #0a4c44 0%, #0d9488 100%)', color: '#ffffff' }}
        >
          <div>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginBottom: '12px' }}>
              FCI SELLER
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, marginBottom: '12px' }}>
              Welcome<br />back.
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
              Get access to your Orders, Wishlist and personalised Recommendations.
            </p>
          </div>

          {/* Decorative shopping bag SVG */}
          <svg className="w-28 h-28 mx-auto mt-auto opacity-70" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="white" fillOpacity="0.06" />
            <path d="M60 80 H140 L130 140 H70 L60 80 Z" fill="white" fillOpacity="0.12" stroke="white" strokeWidth="4" strokeLinejoin="round" />
            <path d="M50 60 L60 80 M150 60 L140 80" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <circle cx="80" cy="160" r="10" fill="white" />
            <circle cx="120" cy="160" r="10" fill="white" />
            <path d="M90 110 L110 110 M100 100 L100 120" stroke="#ffc300" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        {/* ── Right: Form ────────────────────────────────────── */}
        <div
          className="w-full md:w-[60%] flex flex-col justify-between p-8 md:p-10"
          style={{ background: '#ffffff' }}
        >
          <form onSubmit={handleSubmit}>

            {/* Warning Banner */}
            <div
              className="mb-6 flex items-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-bold animate-pulse"
              style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#DC2626' }}
            >
              <span>⚠️</span>
              <span>Login required to view products / actions</span>
            </div>

            {/* Email or Mobile Number */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="modal-email"
                style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}
              >
                Email or Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                <input
                  id="modal-email"
                  type="text"
                  placeholder="name@example.com or 10-digit number"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '24px',
                    paddingBottom: '8px',
                    paddingTop: '6px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1.5px solid #E2E8F0',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0F172A',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderBottomColor = '#0F766E')}
                  onBlur={e => (e.target.style.borderBottomColor = '#E2E8F0')}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label
                  htmlFor="modal-password"
                  style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase' }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  onClick={closeLoginModal}
                  style={{ fontSize: '11px', fontWeight: 700, color: '#0F766E', textDecoration: 'none' }}
                >
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                <input
                  id="modal-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '24px',
                    paddingBottom: '8px',
                    paddingTop: '6px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1.5px solid #E2E8F0',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0F172A',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderBottomColor = '#0F766E')}
                  onBlur={e => (e.target.style.borderBottomColor = '#E2E8F0')}
                />
              </div>
            </div>

            {/* Terms */}
            <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '20px' }}>
              By continuing, you agree to FCISeller's{' '}
              <Link href="/terms" onClick={closeLoginModal} style={{ color: '#0F766E', fontWeight: 600 }}>Terms of Use</Link>
              {' '}and{' '}
              <Link href="/privacy" onClick={closeLoginModal} style={{ color: '#0F766E', fontWeight: 600 }}>Privacy Policy</Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={login.isPending}
              style={{
                width: '100%',
                height: '48px',
                background: login.isPending ? '#5eada6' : '#0F766E',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.1em',
                border: 'none',
                borderRadius: '12px',
                cursor: login.isPending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s',
                boxShadow: '0 4px 12px -2px rgba(15, 118, 110, 0.35)',
              }}
              onMouseEnter={e => { if (!login.isPending) (e.currentTarget as HTMLButtonElement).style.background = '#115E59'; }}
              onMouseLeave={e => { if (!login.isPending) (e.currentTarget as HTMLButtonElement).style.background = '#0F766E'; }}
            >
              {login.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                : 'LOGIN'}
            </button>
          </form>

          {/* Register link */}
          <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
            <Link
              href="/register"
              onClick={closeLoginModal}
              style={{ fontSize: '12px', fontWeight: 700, color: '#0F766E', textDecoration: 'none', letterSpacing: '0.05em' }}
            >
              New to FCISeller? <span style={{ textDecoration: 'underline' }}>Create an account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
