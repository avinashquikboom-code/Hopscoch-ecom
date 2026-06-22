'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

export function Footer() {
  const pathname = usePathname();
  if (pathname === '/checkout') return null;

  return (
    <footer className="bg-muted/30 border-t border-border/40 text-foreground">
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-serif font-semibold tracking-wider text-primary uppercase">
              AURA
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium lifestyle and fashion curated for the modern individual. Quality, sustainability, and timeless design in every piece.
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="https://instagram.com" aria-label="Instagram" className="h-8 w-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="h-8 w-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="https://facebook.com" aria-label="Facebook" className="h-8 w-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
            </div>
          </div>


          {/* SHOP Column */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase mb-6">
              Shop
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/products?category=Fashion" className="text-muted-foreground hover:text-primary transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=Electronics" className="text-muted-foreground hover:text-primary transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=Home & Kitchen" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products?category=Beauty & Personal Care" className="text-muted-foreground hover:text-primary transition-colors">
                  Beauty
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT Column */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase mb-6">
              Support
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-muted-foreground hover:text-primary transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL Column */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase mb-6">
              Legal
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Aura Premium Lifestyle. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

