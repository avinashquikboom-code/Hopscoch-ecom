'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/hooks';
import { Loader2 } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#f1f3f6] dark:bg-gray-950 px-4 py-12 font-sans">
      <div className="w-full max-w-3xl h-auto md:h-[550px] bg-white dark:bg-gray-900 rounded-sm shadow-md overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand Banner */}
        <div className="md:w-[40%] bg-gradient-to-b from-[#0a4c44] to-[#0d9488] p-8 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <h2 className="text-2xl font-bold">Looks like you're new here!</h2>
            <p className="text-[13px] text-gray-100/90 leading-relaxed mt-4">
              Sign up with your mobile number and email to get started
            </p>
          </div>
          
          {/* Decorative Shopping Cart Graphic */}
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
        <div className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Split First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="firstName" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="border-0 border-b border-gray-300 dark:border-gray-700 rounded-none px-0 py-1.5 focus-visible:ring-0 focus:border-[#0d9488] bg-transparent outline-none text-sm w-full transition-all"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="lastName" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="border-0 border-b border-gray-300 dark:border-gray-700 rounded-none px-0 py-1.5 focus-visible:ring-0 focus:border-[#0d9488] bg-transparent outline-none text-sm w-full transition-all"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="border-0 border-b border-gray-300 dark:border-gray-700 rounded-none px-0 py-1.5 focus-visible:ring-0 focus:border-[#0d9488] bg-transparent outline-none text-sm w-full transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Mobile Number Field */}
            <div className="space-y-1">
              <label htmlFor="phone" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mobile Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                className="border-0 border-b border-gray-300 dark:border-gray-700 rounded-none px-0 py-1.5 focus-visible:ring-0 focus:border-[#0d9488] bg-transparent outline-none text-sm w-full transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Set Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-0 border-b border-gray-300 dark:border-gray-700 rounded-none px-0 py-1.5 focus-visible:ring-0 focus:border-[#0d9488] bg-transparent outline-none text-sm w-full transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed pt-2">
              By continuing, you agree to Aura Couture's{' '}
              <Link href="/terms" className="text-[#0d9488] hover:underline font-semibold">Terms of Use</Link> and{' '}
              <Link href="/privacy" className="text-[#0d9488] hover:underline font-semibold">Privacy Policy</Link>.
            </p>

            <Button
              type="submit"
              className="w-full bg-[#fb641b] hover:bg-[#f35c12] text-white font-bold h-11 rounded-sm shadow-xs transition-colors mt-4 cursor-pointer"
              disabled={register.isPending}
            >
              {register.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'CONTINUE'
              )}
            </Button>
          </form>

          {/* Existing user link */}
          <div className="mt-6 text-center">
            <Link href="/login" className="w-full block text-center py-2.5 border border-gray-200 dark:border-gray-800 text-[#0d9488] hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm font-semibold text-xs transition-all tracking-wider shadow-2xs">
              EXISTING USER? LOG IN
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
