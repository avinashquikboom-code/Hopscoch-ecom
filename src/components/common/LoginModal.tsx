'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store';
import { useLogin } from '@/hooks';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldShake, setShouldShake] = useState(false);
  const login = useLogin();

  // Reset inputs when modal closes/opens
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
    if (e.target === e.currentTarget) {
      triggerShake();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerShake();
      return;
    }
    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          closeLoginModal();
        },
        onError: () => {
          triggerShake();
        },
      }
    );
  };

  if (!isLoginModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className={`w-[90%] max-w-3xl h-auto md:h-[520px] bg-white dark:bg-gray-950 rounded-[18px] shadow-[0_24px_48px_-8px_rgb(0_0_0/0.15),0_8px_20px_-4px_rgb(0_0_0/0.08)] overflow-hidden flex flex-col md:flex-row relative transition-all duration-300
          ${shouldShake ? 'animate-shake' : ''}
        `}
      >
        
        {/* Close Button */}
        <button 
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 z-10 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand Banner */}
        <div className="md:w-[40%] bg-gradient-to-b from-[#0a4c44] to-[#0d9488] p-8 text-white flex flex-col justify-between hidden md:flex select-none">
          <div>
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="text-[13px] text-gray-100/90 leading-relaxed mt-4">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          
          <svg className="w-32 h-32 opacity-80 mt-auto mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="white" fillOpacity="0.05" />
            <path d="M60 80 H140 L130 140 H70 L60 80 Z" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="4" strokeLinejoin="round" />
            <path d="M50 60 L60 80 M150 60 L140 80" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <circle cx="80" cy="160" r="10" fill="white" />
            <circle cx="120" cy="160" r="10" fill="white" />
            <path d="M90 110 L110 110 M100 100 L100 120" stroke="#ffc300" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-between bg-white dark:bg-gray-950">
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            
            {/* Warning Message */}
            <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 dark:border-red-400 p-3 rounded-xs text-[11px] text-red-600 dark:text-red-400 font-bold select-none flex items-center gap-1.5 animate-pulse">
              <span>⚠️ Login required to view products / actions</span>
            </div>
            
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="modal-email" className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Enter Email Address
              </label>
              <Input
                id="modal-email"
                type="email"
                placeholder="name@example.com"
                className="border-0 border-b border-[#E2E8F0] dark:border-gray-700 rounded-none px-0 h-12 focus-visible:ring-0 focus:border-[#0F766E] bg-transparent dark:bg-transparent outline-none text-sm w-full transition-all text-[#0F172A] dark:text-gray-100 placeholder:text-[#94A3B8] dark:placeholder:text-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="modal-password" className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Enter Password
                </label>
                <Link href="/forgot-password" onClick={closeLoginModal} className="text-xs text-[#0F766E] hover:underline font-semibold tracking-wide">
                  Forgot?
                </Link>
              </div>
              <Input
                id="modal-password"
                type="password"
                placeholder="••••••••"
                className="border-0 border-b border-[#E2E8F0] dark:border-gray-700 rounded-none px-0 h-12 focus-visible:ring-0 focus:border-[#0F766E] bg-transparent dark:bg-transparent outline-none text-sm w-full transition-all text-[#0F172A] dark:text-gray-100 placeholder:text-[#94A3B8] dark:placeholder:text-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <p className="text-[11px] text-[#94A3B8] dark:text-gray-500 leading-relaxed pt-2">
              By continuing, you agree to Aura Couture's{' '}
              <Link href="/terms" onClick={closeLoginModal} className="text-[#0F766E] hover:underline font-semibold">Terms of Use</Link> and{' '}
              <Link href="/privacy" onClick={closeLoginModal} className="text-[#0F766E] hover:underline font-semibold">Privacy Policy</Link>.
            </p>

            <Button
              type="submit"
              className="w-full h-12 bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold rounded-xl shadow-[0_4px_12px_-2px_rgb(15_118_110/0.30)] transition-all mt-4 cursor-pointer tracking-wide"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'LOGIN'
              )}
            </Button>
          </form>

          {/* New to brand link */}
          <div className="mt-6 text-center border-t border-[#E2E8F0] dark:border-gray-800 pt-5">
            <Link href="/register" onClick={closeLoginModal} className="text-xs text-[#0F766E] hover:underline font-semibold tracking-wider">
              New to Aura Couture? Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
