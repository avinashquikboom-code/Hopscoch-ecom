'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { auth } from '@/lib/firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    setIsPending(true);

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-forgot', {
          size: 'invisible',
        });
      }

      const formattedPhone = `+91${phone}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
    } catch (error: any) {
      alert(error.message || 'Failed to send OTP');
    } finally {
      setIsPending(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      alert('Please enter a 4-digit OTP');
      return;
    }
    if (!confirmationResult) {
      alert('Please send OTP first');
      return;
    }
    setIsPending(true);

    try {
      await confirmationResult.confirm(otp);
      alert('OTP verified successfully! You can now reset your password.');
      window.location.href = '/login';
    } catch (error: any) {
      alert(error.message || 'Invalid OTP');
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
              FCI SELLER
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
          <div id="recaptcha-container-forgot"></div>
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP} className="my-auto space-y-6">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Reset Password
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                  Enter your phone number to receive a 4-digit OTP for password reset.
                </p>
              </div>

              {/* Phone Input */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="phone" 
                  style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}
                >
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8' }} />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                    maxLength={10}
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

              {/* Send OTP Button */}
              <button
                type="submit"
                disabled={isPending}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: isPending ? '#94A3B8' : '#0F766E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
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
          ) : (
            <form onSubmit={handleVerifyOTP} className="my-auto space-y-6">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Enter OTP
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                  Enter the 4-digit OTP sent to your phone number.
                </p>
              </div>

              {/* OTP Input */}
              <div style={{ marginBottom: '24px' }}>
                <label 
                  htmlFor="otp" 
                  style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}
                >
                  4-Digit OTP
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="otp"
                    type="text"
                    placeholder="0000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    maxLength={4}
                    style={{
                      width: '100%',
                      paddingLeft: '0',
                      paddingBottom: '8px',
                      paddingTop: '6px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1.5px solid #E2E8F0',
                      outline: 'none',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#0F172A',
                      fontFamily: 'inherit',
                      letterSpacing: '8px',
                      textAlign: 'center',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderBottomColor = '#0F766E')}
                    onBlur={e => (e.target.style.borderBottomColor = '#E2E8F0')}
                  />
                </div>
              </div>

              {/* Verify OTP Button */}
              <button
                type="submit"
                disabled={isPending}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: isPending ? '#94A3B8' : '#0F766E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify OTP'}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setIsOtpSent(false);
                  setOtp('');
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  color: '#0F766E',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Back to enter phone number
              </button>
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
