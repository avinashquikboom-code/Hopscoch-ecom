'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  Sparkles
} from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Mobile Accordion Open States (default open on desktop via CSS, state controlled on mobile)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    quickLinks: false,
    customerService: false,
    company: false,
    contactInfo: false,
  });

  if (pathname === '/checkout') return null;

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@') || !newsletterEmail.includes('.')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('success');
    setNewsletterMessage('Thank you for subscribing! Check your inbox for ₹500 welcome voucher code.');
    setNewsletterEmail('');
  };

  return (
    <footer className="w-full bg-[#090d16] text-gray-300 border-t border-gray-800/80 font-sans relative z-10 transition-colors">
      
      {/* SECTION 6: NEWSLETTER SUBSCRIPTION BANNER */}
      <div className="bg-gradient-to-r from-[#072421] via-[#0d9488]/30 to-[#0f172a] border-b border-teal-500/20 py-8 px-4 sm:px-6 md:px-12">
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 hidden sm:flex">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Subscribe to FCI SELLER Insider
              </h3>
              <p className="text-xs sm:text-sm text-teal-100/75 mt-0.5 max-w-xl">
                Get early access to exclusive runway drops, secret sale events &amp; ₹500 off your first purchase.
              </p>
            </div>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto max-w-md flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterStatus !== 'idle') setNewsletterStatus('idle');
                }}
                className="w-full pl-10 pr-4 py-2.5 h-11 rounded-xl bg-slate-900/90 border border-teal-500/30 focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] text-white placeholder:text-gray-500 text-xs outline-none transition-all"
                aria-label="Email address for newsletter"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto h-11 px-6 bg-[#0d9488] hover:bg-[#0f766e] active:scale-95 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
            >
              <span>SUBSCRIBE</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Feedback Message */}
        {newsletterStatus !== 'idle' && (
          <div className="container mx-auto max-w-7xl mt-3 flex justify-end">
            <p className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
              newsletterStatus === 'success' 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {newsletterStatus === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{newsletterMessage}</span>
            </p>
          </div>
        )}
      </div>

      {/* MAIN FOOTER CONTAINER */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* SECTION 1: BRAND INFO & SOCIAL MEDIA */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 select-none w-max">
              <img src="/logo.png" alt="FCI Seller Logo" className="h-8 max-h-[34px] w-auto object-contain" />
              <span className="font-black text-sm tracking-wider text-white uppercase leading-none">FCI SELLER</span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              India's premier luxury fashion destination bringing curated designer apparel, footwear, and luxury lifestyle accessories straight to your doorstep.
            </p>

            {/* Social Media Icons */}
            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 block mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-2">
                {[
                  { 
                    name: 'Facebook', 
                    href: 'https://facebook.com', 
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ) 
                  },
                  { 
                    name: 'Instagram', 
                    href: 'https://instagram.com', 
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    ) 
                  },
                  { 
                    name: 'X (Twitter)', 
                    href: 'https://x.com', 
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ) 
                  },
                  { 
                    name: 'LinkedIn', 
                    href: 'https://linkedin.com', 
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    ) 
                  },
                  { 
                    name: 'YouTube', 
                    href: 'https://youtube.com', 
                    icon: (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    ) 
                  },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-8 h-8 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all cursor-pointer"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: QUICK LINKS */}
          <div className="border-b border-gray-800 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('quickLinks')}
              className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-white py-2 md:py-0 md:mb-4 cursor-pointer md:cursor-default"
            >
              <span>Quick Links</span>
              <span className="md:hidden text-teal-400">
                {openSections.quickLinks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <ul className={`space-y-2.5 text-xs text-gray-400 font-medium transition-all ${
              openSections.quickLinks ? 'block pt-2' : 'hidden md:block'
            }`}>
              <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-teal-400 transition-colors">Shop All Products</Link></li>
              <li><Link href="/categories" className="hover:text-teal-400 transition-colors">Categories</Link></li>
              <li><Link href="/products?category=Collections" className="hover:text-teal-400 transition-colors">Collections</Link></li>
              <li><Link href="/products?sort=popular" className="hover:text-teal-400 transition-colors">Featured Brands</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-teal-400 transition-colors">New Arrivals</Link></li>
              <li><Link href="/sale" className="hover:text-teal-400 transition-colors">Trending Fashion</Link></li>
              <li><Link href="/deals" className="hover:text-teal-400 transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          {/* SECTION 3: CUSTOMER SERVICE */}
          <div className="border-b border-gray-800 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('customerService')}
              className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-white py-2 md:py-0 md:mb-4 cursor-pointer md:cursor-default"
            >
              <span>Customer Care</span>
              <span className="md:hidden text-teal-400">
                {openSections.customerService ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <ul className={`space-y-2.5 text-xs text-gray-400 font-medium transition-all ${
              openSections.customerService ? 'block pt-2' : 'hidden md:block'
            }`}>
              <li><Link href="/orders" className="hover:text-teal-400 transition-colors">My Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-teal-400 transition-colors">My Wishlist</Link></li>
              <li><Link href="/orders" className="hover:text-teal-400 transition-colors">Returns &amp; Exchange</Link></li>
              <li><Link href="/return-policy" className="hover:text-teal-400 transition-colors">Refund Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Shipping Policy</Link></li>
              <li><Link href="/orders" className="hover:text-teal-400 transition-colors">Track Order Status</Link></li>
              <li><Link href="/faq" className="hover:text-teal-400 transition-colors">Help &amp; FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* SECTION 4: COMPANY & LEGAL */}
          <div className="border-b border-gray-800 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('company')}
              className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-white py-2 md:py-0 md:mb-4 cursor-pointer md:cursor-default"
            >
              <span>Company</span>
              <span className="md:hidden text-teal-400">
                {openSections.company ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <ul className={`space-y-2.5 text-xs text-gray-400 font-medium transition-all ${
              openSections.company ? 'block pt-2' : 'hidden md:block'
            }`}>
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">About FCI Seller</Link></li>
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">Careers &amp; Culture</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/studio" className="hover:text-teal-400 transition-colors">Studio &amp; Blog</Link></li>
              <li><Link href="/faq" className="hover:text-teal-400 transition-colors">Customer Support</Link></li>
            </ul>
          </div>

          {/* SECTION 5: CONTACT INFORMATION */}
          <div className="border-b border-gray-800 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('contactInfo')}
              className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest text-white py-2 md:py-0 md:mb-4 cursor-pointer md:cursor-default"
            >
              <span>Contact Us</span>
              <span className="md:hidden text-teal-400">
                {openSections.contactInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <div className={`space-y-3 text-xs text-gray-400 transition-all ${
              openSections.contactInfo ? 'block pt-2' : 'hidden md:block'
            }`}>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>FCI Towers, 4th Floor, Tech Park, Outer Ring Road, Bangalore - 560103, KA, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="tel:+9118001234567" className="hover:text-teal-400 transition-colors">+91 1800-123-4567 (Toll-Free)</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:support@fciseller.com" className="hover:text-teal-400 transition-colors">support@fciseller.com</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Mon - Sat: 9:00 AM - 8:00 PM IST</span>
              </div>
            </div>
          </div>

        </div>

        {/* ECOSYSTEM BADGES: SECTION 7 (PAYMENTS) & SECTION 8 (SHIPPING PARTNERS) */}
        <div className="border-t border-gray-800/80 mt-10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* SECTION 7: ACCEPTED PAYMENTS */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">
              100% Secure Payment Gateways
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {['Visa', 'Mastercard', 'RuPay', 'UPI', 'Razorpay', 'Google Pay', 'PhonePe', 'Paytm'].map((pay) => (
                <span 
                  key={pay}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-[11px] font-bold text-gray-300 hover:text-white hover:border-gray-700 transition-all select-none"
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>

          {/* SECTION 8: SHIPPING PARTNERS */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">
              Reliable Express Delivery Partners
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {['Shiprocket', 'Blue Dart', 'Delhivery', 'DTDC', 'Ekart'].map((partner) => (
                <span 
                  key={partner}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-[11px] font-bold text-gray-300 hover:text-white hover:border-gray-700 transition-all select-none"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-800/80 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center sm:text-left">
            &copy; 2026 <span className="font-bold text-white uppercase">FCISELLER</span> E-Commerce Ltd. All Rights Reserved. Made with ❤️ in India.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <span className="text-gray-700">•</span>
            <Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
            <span className="text-gray-700">•</span>
            <span className="text-teal-500/80 font-mono">v1.0.0</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
