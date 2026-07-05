'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { toast } from '@/components/ui/toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsPending(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Reset instructions sent to your email.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12 font-sans">
      <div 
        className="w-full max-w-3xl h-auto md:h-[500px] rounded-[18px] overflow-hidden flex flex-col md:flex-row"
        style={{ background: '#ffffff', boxShadow: '0 24px 64px -8px rgba(0,0,0,0.12), 0 8px 24px -4px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}
      >
        
        {/* Left Side: Brand Banner */}
        <div 
          className="hidden md:flex md:w-[40%] flex-col justify-between p-8 select-none text-white"
          style={{ background: 'linear-gradient(160deg, #0a4c44 0%, #0d9488 100%)' }}
        >
          <div>
            <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '12px' }}>
              AURA COUTURE
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, marginBottom: '12px' }}>
              Reset<br />Password.
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
              Provide your email address to receive password recovery instructions and a secure reset link.
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
          {isSubmitted ? (
            <div className="my-auto text-center py-6 px-4">
              <CheckCircle2 className="w-16 h-16 text-[#0F766E] mx-auto mb-4 animate-bounce" />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Reset Email Sent
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto 24px' }}>
                We have sent secure instructions to <span className="font-semibold text-slate-800">{email}</span>. Please check your inbox and spam folders.
              </p>
              
              <Link 
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold tracking-wider text-[#0F766E] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> BACK TO LOGIN
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="my-auto space-y-6">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Forgot Password?
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: '24px' }}>
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

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={isPending}
                style={{
                  width: '100%',
                  height: '48px',
                  background: isPending ? '#5eada6' : '#0F766E',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s',
                  boxShadow: '0 4px 12px -2px rgba(15, 118, 110, 0.35)',
                }}
                onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.background = '#115E59'; }}
                onMouseLeave={e => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.background = '#0F766E'; }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'SEND RESET LINK'
                )}
              </button>

              <div className="text-center pt-4">
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold tracking-wider text-[#0F766E] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* Contact Support Footer */}
          <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>
              Need assistance? <Link href="/contact" style={{ color: '#0F766E', fontWeight: 600, textDecoration: 'none' }}>Contact Support</Link>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
