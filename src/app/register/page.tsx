'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/hooks';
import { Loader2, Mail, Lock, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({
      email,
      password,
      firstName,
      lastName,
      phone,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12 font-sans">
      <div 
        className="w-full max-w-3xl h-auto md:h-[550px] rounded-[18px] overflow-hidden flex flex-col md:flex-row"
        style={{ background: '#ffffff', boxShadow: '0 24px 64px -8px rgba(0,0,0,0.12), 0 8px 24px -4px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}
      >
        
        {/* Left Side: Brand Banner */}
        <div 
          className="hidden md:flex md:w-[40%] flex-col justify-between p-8 select-none text-white"
          style={{ background: 'linear-gradient(160deg, #0a4c44 0%, #0d9488 100%)' }}
        >
          <div>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '12px' }}>
              FCI SELLER
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, marginBottom: '12px' }}>
              Create<br />Account.
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
              Sign up to track orders, manage your wishlist, and experience tailored fashion.
            </p>
          </div>
          
          <svg className="w-28 h-28 mx-auto mt-auto opacity-70" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="white" fillOpacity="0.06" />
            <path d="M60 80 H140 L130 140 H70 L60 80 Z" fill="white" fillOpacity="0.12" stroke="white" strokeWidth="4" strokeLinejoin="round" />
            <path d="M50 60 L60 80 M150 60 L140 80" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <circle cx="80" cy="160" r="10" fill="white" />
            <circle cx="120" cy="160" r="10" fill="white" />
            <path d="M90 110 L110 110 M100 100 L100 120" stroke="#ffc300" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right Side: Form */}
        <div 
          className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-between"
          style={{ background: '#ffffff' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Split First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div style={{ marginBottom: '10px' }}>
                <label 
                  htmlFor="firstName" 
                  style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}
                >
                  First Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
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
              
              <div style={{ marginBottom: '10px' }}>
                <label 
                  htmlFor="lastName" 
                  style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}
                >
                  Last Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '10px' }}>
              <label 
                htmlFor="email" 
                style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            {/* Mobile Number Field */}
            <div style={{ marginBottom: '10px' }}>
              <label 
                htmlFor="phone" 
                style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}
              >
                Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                <input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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

            {/* Password Field */}
            <div style={{ marginBottom: '12px' }}>
              <label 
                htmlFor="password" 
                style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '14px' }}>
              By continuing, you agree to FCISeller's{' '}
              <Link href="/terms" style={{ color: '#0F766E', fontWeight: 600 }}>Terms of Use</Link> and{' '}
              <Link href="/privacy" style={{ color: '#0F766E', fontWeight: 600 }}>Privacy Policy</Link>.
            </p>

            <button
              type="submit"
              disabled={register.isPending}
              style={{
                width: '100%',
                height: '48px',
                background: register.isPending ? '#5eada6' : '#0F766E',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.1em',
                border: 'none',
                borderRadius: '12px',
                cursor: register.isPending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s',
                boxShadow: '0 4px 12px -2px rgba(15, 118, 110, 0.35)',
              }}
              onMouseEnter={e => { if (!register.isPending) (e.currentTarget as HTMLButtonElement).style.background = '#115E59'; }}
              onMouseLeave={e => { if (!register.isPending) (e.currentTarget as HTMLButtonElement).style.background = '#0F766E'; }}
            >
              {register.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'CONTINUE'
              )}
            </button>
          </form>

          {/* Existing user link */}
          <div style={{ marginTop: '20px', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
            <Link 
              href="/login" 
              style={{ fontSize: '12px', fontWeight: 700, color: '#0F766E', textDecoration: 'none', letterSpacing: '0.05em' }}
            >
              Existing user? <span style={{ textDecoration: 'underline' }}>Log In</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
