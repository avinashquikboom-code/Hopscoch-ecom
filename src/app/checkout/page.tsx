'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Lock, Check, X, Shield, ArrowRight, Info, CreditCard, 
  ShoppingBag, HelpCircle, ArrowLeft, Moon, Sun, User 
} from 'lucide-react';
import { useThemeStore } from '@/store';

// Interfaces for Cart Items
interface CheckoutItem {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { theme, setTheme } = useThemeStore();

  // Step state: 'shipping' represents "Shipping Details", 'payment' represents "Payment Method"
  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment'>('shipping');

  // Form State - Contact & Shipping Details
  const [fullName, setFullName] = useState('Elias Thorne');
  const [emailAddress, setEmailAddress] = useState('elias@aura.design');
  const [streetAddress, setStreetAddress] = useState('742 Luminary Boulevard');
  const [city, setCity] = useState('Aetheria');
  const [stateProvince, setStateProvince] = useState('CA');
  const [zipPostal, setZipPostal] = useState('90210');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Form State - Payment details
  const [paymentTab, setPaymentTab] = useState<'card' | 'applepay' | 'googlepay' | 'paypal'>('card');
  const [cardholderName, setCardholderName] = useState('ELARA VANCE');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // Smooth scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [checkoutStep]);

  // Order Items configuration matching mockups
  const shippingItems: CheckoutItem[] = [
    {
      id: 'perfume-1',
      name: "L'Essence No. 04",
      description: "Signature Eau de Parfum",
      price: 185.00,
      qty: 1,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 'candle-1',
      name: "Votive Bloom",
      description: "Handcrafted Ceramic",
      price: 64.00,
      qty: 1,
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&auto=format&fit=crop&q=80"
    }
  ];

  const paymentItems: CheckoutItem[] = [
    {
      id: 'perfume-2',
      name: "Velvet Ember Essence",
      description: "50ml • Eau de Parfum",
      price: 210.00,
      qty: 1,
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: 'candle-2',
      name: "Sanctuary Candle",
      description: "Signature Woodwick",
      price: 65.00,
      qty: 1,
      image: "https://images.unsplash.com/photo-1602872030219-c16779163b9a?w=400&auto=format&fit=crop&q=80"
    }
  ];

  // Calculation parameters based on step
  const activeItems = checkoutStep === 'shipping' ? shippingItems : paymentItems;
  const subtotal = activeItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // Shipping cost
  let shippingCost = 0;
  if (checkoutStep === 'shipping') {
    shippingCost = shippingMethod === 'standard' ? 0 : 24.00;
  } else {
    shippingCost = 0; // Complimentary in Step 3 mockup
  }

  // Taxes
  const tax = checkoutStep === 'shipping' ? 20.42 : 22.00;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-300">

      {/* --- HEADERS --- */}
      {checkoutStep === 'shipping' ? (
        /* Screen 1: Shipping Details Standard Header */
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/85 backdrop-blur-md">
          <div className="container mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-serif font-bold tracking-[0.2em] text-primary uppercase">
                AURA
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Link href="/products" className="hover:text-primary transition-colors">Collections</Link>
              <Link href="/products?sort=new" className="hover:text-primary transition-colors">New Arrivals</Link>
              <Link href="/products?category=Beauty" className="hover:text-primary transition-colors">Essence</Link>
              <Link href="/journal" className="hover:text-primary transition-colors">Journal</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-10 w-10 rounded-full hover:bg-muted"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>
      ) : (
        /* Screen 2: Payment Method Simplified Secure Header */
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
          <div className="container mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-serif font-bold tracking-[0.2em] text-primary uppercase">
                AURA
              </span>
            </Link>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure Checkout</span>
              </div>
              <button 
                onClick={() => setCheckoutStep('shipping')}
                className="ml-4 p-1 hover:text-foreground hover:bg-muted rounded-full transition-all"
                aria-label="Cancel checkout"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* --- PROGRESS TRACKER (Only shown on Step 3: Payment Method, as per mockup) --- */}
      {checkoutStep === 'payment' && (
        <div className="bg-background pt-8 pb-4">
          <div className="container mx-auto px-4 max-w-lg flex items-center justify-between relative">
            
            {/* Step 1: Cart */}
            <div className="flex flex-col items-center z-10 gap-1.5">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-sm border border-primary">
                <Check className="w-4 h-4 stroke-[3px]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-foreground uppercase">Cart</span>
            </div>

            {/* Connecting Line 1-2 */}
            <div className="absolute top-[24px] left-[calc(16.6%+16px)] right-[calc(50%+16px)] h-[2px] bg-primary z-0"></div>

            {/* Step 2: Delivery */}
            <div className="flex flex-col items-center z-10 gap-1.5">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shadow-sm border border-primary">
                <Check className="w-4 h-4 stroke-[3px]" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-foreground uppercase">Delivery</span>
            </div>

            {/* Connecting Line 2-3 */}
            <div className="absolute top-[24px] left-[calc(50%+16px)] right-[calc(16.6%+16px)] h-[2px] bg-border/40 z-0"></div>

            {/* Step 3: Payment */}
            <div className="flex flex-col items-center z-10 gap-1.5">
              <div className="w-8 h-8 rounded-full bg-background text-primary flex items-center justify-center font-semibold text-sm border-2 border-primary shadow-sm">
                3
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-primary uppercase">Payment</span>
            </div>

          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT CONTAINER --- */}
      <main className="flex-1 py-12 px-6 sm:px-12">
        <div className="container mx-auto max-w-6xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* --- LEFT FORM PANEL (Col Span 7) --- */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* --- SCREEN 1: SHIPPING DETAILS --- */}
              {checkoutStep === 'shipping' && (
                <div className="space-y-8">
                  {/* Back to Cart Action Link */}
                  <Link 
                    href="/cart"
                    className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                  </Link>

                  <h1 className="text-4xl font-serif font-bold text-foreground tracking-wide">
                    Shipping Details
                  </h1>

                  {/* Form Blocks */}
                  <div className="space-y-8 border-t border-border/40 pt-8">
                    
                    {/* Contact Information */}
                    <div className="space-y-5">
                      <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullname" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Full Name</Label>
                          <Input 
                            id="fullname"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="h-11 bg-muted/20 border-transparent focus:border-border/60 focus:bg-card text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Email Address</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            className="h-11 bg-muted/20 border-transparent focus:border-border/60 focus:bg-card text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-5 pt-4">
                      <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">
                        Shipping Address
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="street" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Street Address</Label>
                          <Input 
                            id="street"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            className="h-11 bg-muted/20 border-transparent focus:border-border/60 focus:bg-card text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">City</Label>
                            <Input 
                              id="city"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="h-11 bg-muted/20 border-transparent focus:border-border/60 focus:bg-card text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">State / Province</Label>
                            <Input 
                              id="state"
                              value={stateProvince}
                              onChange={(e) => setStateProvince(e.target.value)}
                              className="h-11 bg-muted/20 border-transparent focus:border-border/60 focus:bg-card text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zip" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">ZIP / Postal Code</Label>
                            <Input 
                              id="zip"
                              value={zipPostal}
                              onChange={(e) => setZipPostal(e.target.value)}
                              className="h-11 bg-muted/20 border-transparent focus:border-border/60 focus:bg-card text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div className="space-y-5 pt-4">
                      <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">
                        Shipping Method
                      </h3>
                      <div className="space-y-3">
                        {/* Standard Option */}
                        <div 
                          className={`flex items-center justify-between border rounded-lg p-5 cursor-pointer transition-all ${
                            shippingMethod === 'standard' 
                              ? 'border-primary bg-primary/[0.02]' 
                              : 'border-border/60 hover:bg-muted/10'
                          }`}
                          onClick={() => setShippingMethod('standard')}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              shippingMethod === 'standard' ? 'border-primary' : 'border-muted-foreground/60'
                            }`}>
                              {shippingMethod === 'standard' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-sans font-semibold text-sm text-foreground">
                                Standard Shipping
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                4-7 business days
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-primary">Free</span>
                        </div>

                        {/* Express Option */}
                        <div 
                          className={`flex items-center justify-between border rounded-lg p-5 cursor-pointer transition-all ${
                            shippingMethod === 'express' 
                              ? 'border-primary bg-primary/[0.02]' 
                              : 'border-border/60 hover:bg-muted/10'
                          }`}
                          onClick={() => setShippingMethod('express')}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              shippingMethod === 'express' ? 'border-primary' : 'border-muted-foreground/60'
                            }`}>
                              {shippingMethod === 'express' && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                              )}
                            </div>
                            <div>
                              <p className="font-sans font-semibold text-sm text-foreground">
                                Express Delivery
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                1-2 business days
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-foreground">$24.00</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <Button
                        onClick={() => setCheckoutStep('payment')}
                        className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-12 rounded-md uppercase tracking-wider text-xs shadow-md transition-all hover:-translate-y-0.5"
                      >
                        Proceed to Payment
                      </Button>
                    </div>

                  </div>
                </div>
              )}

              {/* --- SCREEN 2: PAYMENT METHOD --- */}
              {checkoutStep === 'payment' && (
                <div className="space-y-8">
                  
                  {/* Payment Method Selector Block */}
                  <div className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-serif font-bold text-foreground tracking-wide">
                      Payment Method
                    </h2>

                    {/* Payment Tabs Grid */}
                    <div className="grid grid-cols-4 gap-2 border-b border-border/40 pb-6">
                      
                      {/* Card Tab */}
                      <button
                        onClick={() => setPaymentTab('card')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all gap-1.5 ${
                          paymentTab === 'card' 
                            ? 'border-primary bg-primary/[0.02] text-primary font-semibold' 
                            : 'border-border/60 hover:bg-muted/20 text-muted-foreground'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span className="text-[10px] tracking-wide">Card</span>
                      </button>

                      {/* Apple Pay Tab */}
                      <button
                        onClick={() => setPaymentTab('applepay')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all gap-1.5 ${
                          paymentTab === 'applepay' 
                            ? 'border-primary bg-primary/[0.02] text-primary font-semibold' 
                            : 'border-border/60 hover:bg-muted/20 text-muted-foreground'
                        }`}
                      >
                        <span className="text-sm font-serif leading-none mt-1"> Pay</span>
                        <span className="text-[10px] tracking-wide">Apple Pay</span>
                      </button>

                      {/* Google Pay Tab */}
                      <button
                        onClick={() => setPaymentTab('googlepay')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all gap-1.5 ${
                          paymentTab === 'googlepay' 
                            ? 'border-primary bg-primary/[0.02] text-primary font-semibold' 
                            : 'border-border/60 hover:bg-muted/20 text-muted-foreground'
                        }`}
                      >
                        <span className="text-xs font-bold leading-none mt-1 tracking-tighter">Google</span>
                        <span className="text-[10px] tracking-wide">Google Pay</span>
                      </button>

                      {/* PayPal Tab */}
                      <button
                        onClick={() => setPaymentTab('paypal')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all gap-1.5 ${
                          paymentTab === 'paypal' 
                            ? 'border-primary bg-primary/[0.02] text-primary font-semibold' 
                            : 'border-border/60 hover:bg-muted/20 text-muted-foreground'
                        }`}
                      >
                        <span className="text-xs font-bold italic leading-none mt-1 text-sky-800 dark:text-sky-400">PayPal</span>
                        <span className="text-[10px] tracking-wide">PayPal</span>
                      </button>
                    </div>

                    {/* Conditional Card inputs */}
                    {paymentTab === 'card' ? (
                      <div className="space-y-4 pt-2">
                        
                        {/* Cardholder Name */}
                        <div className="space-y-2">
                          <Label htmlFor="cardholder" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Cardholder Name</Label>
                          <Input 
                            id="cardholder"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            className="h-11 bg-muted/10 border-border/60 focus:border-primary text-sm font-sans"
                            placeholder="ELARA VANCE"
                          />
                        </div>

                        {/* Card Number */}
                        <div className="space-y-2">
                          <Label htmlFor="cardnumber" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Card Number</Label>
                          <div className="relative">
                            <Input 
                              id="cardnumber"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="h-11 bg-muted/10 border-border/60 focus:border-primary text-sm tracking-[0.15em] font-mono pr-20"
                              placeholder="0000 0000 0000 0000"
                            />
                            {/* Card network indicators placeholder */}
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                              <div className="w-7 h-4.5 bg-muted rounded border border-border/30"></div>
                              <div className="w-7 h-4.5 bg-muted rounded border border-border/30"></div>
                            </div>
                          </div>
                        </div>

                        {/* Expiry Date & CVV */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Expiry Date</Label>
                            <Input 
                              id="expiry"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              className="h-11 bg-muted/10 border-border/60 focus:border-primary text-sm placeholder:text-muted-foreground/60"
                              placeholder="MM / YY"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">CVV / CVC</Label>
                            <div className="relative">
                              <Input 
                                id="cvv"
                                type="password"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                className="h-11 bg-muted/10 border-border/60 focus:border-primary text-sm pr-10"
                                placeholder="***"
                                maxLength={4}
                              />
                              <Info className="w-4 h-4 text-muted-foreground/60 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-foreground transition-colors" />
                            </div>
                          </div>
                        </div>

                        {/* Save Card Checkbox */}
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox 
                            id="savecard" 
                            checked={saveCard}
                            onCheckedChange={(checked) => setSaveCard(!!checked)}
                            className="data-[state=checked]:bg-primary"
                          />
                          <Label htmlFor="savecard" className="text-xs text-muted-foreground/80 font-medium leading-none cursor-pointer">
                            Save this card for future purchases. Your data is encrypted and secure.
                          </Label>
                        </div>

                      </div>
                    ) : (
                      <div className="py-12 text-center text-muted-foreground text-sm border-2 border-dashed border-border/40 rounded-lg">
                        Redirecting to {paymentTab === 'applepay' ? 'Apple Pay' : paymentTab === 'googlepay' ? 'Google Pay' : 'PayPal'} portal...
                      </div>
                    )}

                  </div>

                  {/* Billing Address Block */}
                  <div className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 flex items-center justify-between shadow-sm">
                    <div>
                      <h3 className="text-base font-serif font-bold text-foreground tracking-wide">
                        Billing Address
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Same as delivery address
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => alert("Edit billing address option")}
                      className="text-xs font-bold tracking-wider text-primary hover:text-primary/90 uppercase"
                    >
                      Edit
                    </Button>
                  </div>

                  {/* Security Seals */}
                  <div className="flex items-center justify-center gap-8 pt-4 text-muted-foreground/60">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>PCI DSS Compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider uppercase">
                      <Lock className="w-4 h-4 text-primary" />
                      <span>256-bit SSL Encryption</span>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* --- RIGHT ORDER SUMMARY PANEL (Col Span 5) --- */}
            <div className="lg:col-span-5">
              
              <div className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-28">
                <h3 className="text-lg font-serif font-bold text-foreground tracking-wide">
                  Order Summary
                </h3>

                {/* Items List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {activeItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-muted border border-border/40 rounded-md overflow-hidden flex-shrink-0 relative">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          sizes="64px" 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans font-semibold text-sm text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                        {checkoutStep === 'shipping' && (
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">Qty: {item.qty}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-primary">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Calculation List */}
                <div className="border-t border-border/40 pt-4 space-y-3.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-bold text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    {checkoutStep === 'shipping' ? (
                      shippingCost === 0 ? (
                        <span className="text-primary font-bold">Free</span>
                      ) : (
                        <span className="font-bold text-foreground">${shippingCost.toFixed(2)}</span>
                      )
                    ) : (
                      <span className="text-primary font-bold">Complimentary</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span className="font-bold text-foreground">${tax.toFixed(2)}</span>
                  </div>

                  {/* Final Total */}
                  <div className="border-t border-border/40 pt-4 flex justify-between items-baseline">
                    <span className="text-base font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons & Badges */}
                {checkoutStep === 'shipping' ? (
                  /* Screen 1 Sidebar Action */
                  <div className="pt-2">
                    <div className="bg-muted/40 rounded-lg p-4 border border-border/20 flex gap-3">
                      <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        <span className="font-bold uppercase tracking-wider text-foreground block mb-0.5">Secure Checkout</span>
                        Your transaction is encrypted with 256-bit SSL security.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Screen 2 Sidebar Action */
                  <div className="space-y-4 pt-2">
                    <Button
                      onClick={() => {
                        alert("Thank you! Your AURA order has been placed successfully.");
                        router.push('/');
                      }}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-12 rounded-md uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      Place Order
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center leading-relaxed px-4">
                      By placing your order, you agree to AURA's <Link href="/terms" className="underline hover:text-primary transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</Link>.
                    </p>
                    <div className="pt-2 border-t border-border/40 text-center">
                      <p className="text-[10px] text-muted-foreground/80 font-medium">
                        Need assistance with your payment? <Link href="/contact" className="text-primary hover:underline font-semibold">Contact Concierge</Link>
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* --- SIMPLIFIED CHECKOUT FOOTER --- */}
      <footer className="bg-muted/10 border-t border-border/40 py-8 text-xs text-muted-foreground">
        <div className="container mx-auto px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-serif font-semibold text-sm tracking-wider text-primary uppercase">
            AURA
          </span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-primary transition-colors">Shipping & Returns</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} AURA. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
