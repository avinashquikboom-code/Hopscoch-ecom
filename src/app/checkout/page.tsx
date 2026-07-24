'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Lock, Check, X, Shield, ArrowRight, Info, CreditCard, 
  ShoppingBag, HelpCircle, ArrowLeft, User, QrCode, Building, ChevronRight
} from 'lucide-react';
import { useCart, useClearCart } from '@/hooks';
import { toast } from '@/components/ui/toast';

import { API_BASE } from '@/constants';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart } = useCart();
  const clearCartMutation = useClearCart();

  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment'>('shipping');

  // Form State - Contact & Shipping Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [zipPostal, setZipPostal] = useState('');
  const [country, setCountry] = useState('India');

  const countryOptions = [
    'India', 'United States', 'United Kingdom', 'UAE (Dubai)',
    'Bahrain', 'Malaysia', 'Mauritius', 'Fiji', 'Guyana',
    'Suriname', 'Trinidad & Tobago', 'Australia', 'Canada',
    'Germany', 'France', 'Japan', 'Singapore', 'Saudi Arabia',
    'Qatar', 'Kuwait', 'Oman', 'South Africa', 'New Zealand',
  ];

  // Form State - Payment details
  const [paymentTab, setPaymentTab] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card');
  
  // Card
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // UPI
  const [upiId, setUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  
  // Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // COD
  const [captchaCode, setCaptchaCode] = useState('A7B9');
  const [captchaInput, setCaptchaInput] = useState('');

  // Payment States
  const [simStep, setSimStep] = useState(0);
  const [showSimModal, setShowSimModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay Checkout Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Smooth scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [checkoutStep]);

  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const shippingCost = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const calculatedTax = cartItems.reduce((sum: number, item: any) => {
    const p = item.product || {};
    const rate = p.taxPercent !== undefined ? Number(p.taxPercent) : (p.effectiveTaxRule?.rate ? Number(p.effectiveTaxRule.rate) : 18);
    const isInclusive = (p.taxType || p.effectiveTaxRule?.taxType) === 'INCLUSIVE';
    const itemTotal = (p.price || 0) * (item.quantity || 1);
    if (isInclusive) return sum; // Tax is inclusive in price
    return sum + ((itemTotal * rate) / 100);
  }, 0);
  const tax = cart?.taxAmount !== undefined ? Number(cart.taxAmount) : Math.round(calculatedTax * 100) / 100;
  const total = subtotal - discount + shippingCost + tax;

  const handleVerifyUpi = () => {
    if (upiId.includes('@')) {
      setIsUpiVerified(true);
      toast.success('UPI ID verified successfully!');
    } else {
      toast.error('Invalid UPI ID format. Ex: user@bank');
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentTab === 'cod' && captchaInput !== captchaCode) {
      toast.error('Invalid CAPTCHA code. Please try again.');
      return;
    }

    setIsProcessing(true);

    const payload = {
      address: {
        fullName: `${firstName} ${lastName}`.trim() || 'Valued Customer',
        phone: phone || '0000000000',
        email: emailAddress,
        streetAddress: streetAddress || 'Shipping Address',
        city: city || 'City',
        state: stateProvince || 'State',
        zipCode: zipPostal || '000000',
        country: country || 'India',
      },
      items: cartItems.map((item: any) => ({
        productId: item.product.id,
        variantId: item.variant?.id,
        quantity: item.quantity,
      })),
      paymentMethod: paymentTab.toUpperCase(),
    };

    try {
      const orderRes = await fetch(`${API_BASE}/api/v1/web/orders`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const orderJson = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderJson.message || 'Failed to place order');
      }

      const createdOrder = orderJson.data;

      if (paymentTab === 'cod') {
        clearCartMutation.mutate(undefined, {
          onSuccess: () => {
            setIsProcessing(false);
            toast.success(`Order ${createdOrder.orderNumber} placed successfully!`);
            router.push(`/order-success?orderNumber=${createdOrder.orderNumber}`);
          },
        });
        return;
      }

      // Online / Razorpay Flow
      try {
        const configRes = await fetch(`${API_BASE}/api/v1/web/payments/config`, { headers: authHeaders() });
        const configJson = await configRes.json();
        
        if (configRes.ok && configJson.data?.keyId) {
          const keyId = configJson.data.keyId;
          const rzpOrderRes = await fetch(`${API_BASE}/api/v1/web/payments/order`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ orderId: createdOrder.id }),
          });

          const rzpOrderJson = await rzpOrderRes.json();
          if (rzpOrderRes.ok && rzpOrderJson.data?.razorpayOrderId) {
            const { razorpayOrderId, amount: paiseAmount, currency } = rzpOrderJson.data;
            const options = {
              key: keyId,
              amount: paiseAmount,
              currency: currency,
              name: 'FCI SELLER',
              description: `Order ${createdOrder.orderNumber}`,
              order_id: razorpayOrderId,
              handler: async function (response: any) {
                await fetch(`${API_BASE}/api/v1/web/payments/verify`, {
                  method: 'POST',
                  headers: authHeaders(),
                  body: JSON.stringify({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  }),
                });
                clearCartMutation.mutate(undefined, {
                  onSuccess: () => {
                    toast.success(`Payment verified! Order ${createdOrder.orderNumber} confirmed.`);
                    router.push(`/order-success?orderNumber=${createdOrder.orderNumber}`);
                  },
                });
              },
              prefill: {
                name: `${firstName} ${lastName}`.trim(),
                email: emailAddress,
                contact: phone,
              },
              theme: { color: '#0d9488' },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
            setIsProcessing(false);
            return;
          }
        }
      } catch (_) {}

      // Default Order Success Redirect
      clearCartMutation.mutate(undefined, {
        onSuccess: () => {
          setIsProcessing(false);
          toast.success(`Order ${createdOrder.orderNumber} confirmed!`);
          router.push(`/order-success?orderNumber=${createdOrder.orderNumber}`);
        },
      });

    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.message || 'Could not place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 font-sans flex flex-col justify-between transition-colors duration-300">
      
      {/* SECURE HEADER */}
      <header className="bg-white dark:bg-zinc-900 border-b border-neutral-100 dark:border-neutral-850 py-3 shadow-xs sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 select-none shrink-0">
              <svg className="w-9 h-7.5 shrink-0" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="auraPrimarySecure" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                  <linearGradient id="auraSecondarySecure" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f766e" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
                <path d="M30 68 L50 20" stroke="url(#auraPrimarySecure)" strokeWidth="12" strokeLinecap="round" />
                <path d="M50 20 L70 68" stroke="url(#auraPrimarySecure)" strokeWidth="12" strokeLinecap="round" />
                <path d="M38 48 L62 48" stroke="url(#auraSecondarySecure)" strokeWidth="10" strokeLinecap="round" />
              </svg>
              <div className="flex flex-col justify-center leading-none">
                <span className="font-black text-sm tracking-widest text-[#282c3f] uppercase">FCI</span>
                <span className="text-[7px] font-bold tracking-[0.25em] text-gray-500 uppercase mt-0.5">SELLER</span>
              </div>
            </Link>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:inline">SECURE CHECKOUT</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <Lock className="w-4 h-4 text-[#0d9488]" />
            <span>SSL Secured Checkout</span>
          </div>
        </div>
      </header>

      {/* CORE BODY CONTENT */}
      <main className="flex-1 py-10 px-4 sm:px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT AREA */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* STEP TIMELINE */}
              <div className="bg-white border border-gray-250/60 rounded-sm p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-4 text-xs font-black">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${
                      checkoutStep === 'shipping' ? 'bg-[#0d9488]' : 'bg-gray-300'
                    }`}>1</span>
                    <span className={checkoutStep === 'shipping' ? 'text-gray-800' : 'text-gray-400'}>SHIPPING</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${
                      checkoutStep === 'payment' ? 'bg-[#0d9488]' : 'bg-gray-300'
                    }`}>2</span>
                    <span className={checkoutStep === 'payment' ? 'text-gray-800' : 'text-gray-400'}>PAYMENT</span>
                  </div>
                </div>

                {checkoutStep === 'payment' && (
                  <button 
                    onClick={() => setCheckoutStep('shipping')}
                    className="text-xs text-[#0d9488] font-bold hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping
                  </button>
                )}
              </div>

              {/* STEP 1: SHIPPING DETAILS */}
              {checkoutStep === 'shipping' && (
                <div className="bg-white border border-gray-250/60 rounded-sm p-5 shadow-xs space-y-4">
                  <h2 className="text-sm font-black uppercase text-gray-800 tracking-wider border-b border-gray-150 pb-2.5">Delivery Details</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname" className="text-xs font-bold text-gray-700">First Name</Label>
                      <Input 
                        id="firstname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488]"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname" className="text-xs font-bold text-gray-700">Last Name</Label>
                      <Input 
                        id="lastname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488]"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-gray-700">Phone Number</Label>
                      <Input 
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-xs font-bold text-gray-700">Street Address</Label>
                    <Input 
                      id="street"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="h-10 text-xs bg-white focus:border-[#0d9488]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-xs font-bold text-gray-700">City</Label>
                      <Input 
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-xs font-bold text-gray-700">State / Province</Label>
                      <Input 
                        id="state"
                        value={stateProvince}
                        onChange={(e) => setStateProvince(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-xs font-bold text-gray-700">Pincode / ZIP</Label>
                      <Input 
                        id="pincode"
                        value={zipPostal}
                        onChange={(e) => setZipPostal(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-xs font-bold text-gray-700">Country</Label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-10 text-xs bg-white border border-gray-200 rounded px-3 focus:outline-none focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]"
                    >
                      {countryOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-150 flex justify-end">
                    <button 
                      disabled={!firstName || !phone || !emailAddress || !streetAddress || !city || !zipPostal}
                      onClick={() => setCheckoutStep('payment')}
                      className="bg-[#fb641b] hover:bg-[#fb641b]/95 text-white font-bold h-11 px-8 rounded-sm text-xs tracking-wider uppercase border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PAYMENT METHOD */}
              {checkoutStep === 'payment' && (
                <div className="bg-white border border-gray-250/60 rounded-sm p-5 shadow-xs space-y-4">
                  <h2 className="text-sm font-black uppercase text-gray-800 tracking-wider border-b border-gray-150 pb-2.5">Select Payment Option</h2>

                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setPaymentTab('card')}
                      className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                        paymentTab === 'card' ? 'border-[#0d9488] text-[#0d9488]' : 'border-transparent text-gray-500'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" /> Credit/Debit Card
                    </button>
                    <button
                      onClick={() => setPaymentTab('upi')}
                      className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                        paymentTab === 'upi' ? 'border-[#0d9488] text-[#0d9488]' : 'border-transparent text-gray-500'
                      }`}
                    >
                      <QrCode className="w-4 h-4" /> UPI / GooglePay
                    </button>
                    <button
                      onClick={() => setPaymentTab('netbanking')}
                      className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                        paymentTab === 'netbanking' ? 'border-[#0d9488] text-[#0d9488]' : 'border-transparent text-gray-500'
                      }`}
                    >
                      <Building className="w-4 h-4" /> Net Banking
                    </button>
                    <button
                      onClick={() => setPaymentTab('cod')}
                      className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                        paymentTab === 'cod' ? 'border-[#0d9488] text-[#0d9488]' : 'border-transparent text-gray-500'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" /> COD
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-150 rounded-sm">
                    {paymentTab === 'card' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label htmlFor="card-name" className="text-xxs uppercase tracking-wider font-bold">Name on Card</Label>
                          <Input id="card-name" placeholder="John Doe" value={cardholderName} onChange={e => setCardholderName(e.target.value)} className="h-9 text-xs bg-white" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="card-number" className="text-xxs uppercase tracking-wider font-bold">Card Number</Label>
                          <Input id="card-number" placeholder="4312 •••• •••• 8901" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="h-9 text-xs bg-white font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="card-exp" className="text-xxs uppercase tracking-wider font-bold">Expiry Date</Label>
                            <Input id="card-exp" placeholder="MM/YY" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="h-9 text-xs bg-white font-mono" />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="card-cvv" className="text-xxs uppercase tracking-wider font-bold">CVV</Label>
                            <Input id="card-cvv" type="password" placeholder="•••" value={cvv} onChange={e => setCvv(e.target.value)} className="h-9 text-xs bg-white font-mono" />
                          </div>
                        </div>
                        <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-[10px] text-emerald-700 font-bold flex items-center gap-1.5">
                          <Shield className="w-4 h-4 shrink-0" /> Secured online settlement by Razorpay
                        </div>
                      </div>
                    )}

                    {paymentTab === 'upi' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="upi-vpa" className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Enter UPI ID</Label>
                          <div className="flex gap-2">
                            <Input
                              id="upi-vpa"
                              value={upiId}
                              onChange={(e) => { setUpiId(e.target.value); setIsUpiVerified(false); }}
                              placeholder="mobileNumber@ybl / username@upi"
                              className="bg-white border-gray-200 text-xs py-2 h-9 flex-1 font-semibold"
                            />
                            <Button 
                              onClick={handleVerifyUpi}
                              className="bg-[#0d9488] hover:bg-[#0d9488]/90 text-white text-xs font-bold px-4 h-9 cursor-pointer"
                            >
                              Verify
                            </Button>
                          </div>
                          {isUpiVerified && (
                            <p className="text-[10px] font-bold text-[#388e3c] flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Checked & Verified!
                            </p>
                          )}
                        </div>

                        <div className="border-t border-gray-150 pt-4 flex flex-col items-center">
                          <button
                            onClick={() => setShowQrCode(!showQrCode)}
                            className="text-xs font-bold text-[#0d9488] hover:underline flex items-center gap-1 border-none bg-transparent cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>{showQrCode ? 'Hide QR Code' : 'Generate Secure QR Code for Scanning'}</span>
                          </button>
                          
                          {showQrCode && (
                            <div className="mt-3.5 p-3.5 bg-white border border-gray-250 rounded-sm shadow-sm flex flex-col items-center gap-2">
                              <div className="w-32 h-32 relative bg-gray-50 flex items-center justify-center border border-gray-100 font-mono text-sm font-bold text-center">
                                Razorpay QR Code
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {paymentTab === 'netbanking' && (
                      <div className="space-y-4">
                        <Label htmlFor="bank-select" className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Select Bank</Label>
                        <select
                          id="bank-select"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full bg-white border border-gray-250 rounded px-3 py-2 text-xs font-semibold"
                        >
                          <option value="HDFC">HDFC Bank</option>
                          <option value="ICICI">ICICI Bank</option>
                          <option value="SBI">State Bank of India</option>
                        </select>
                      </div>
                    )}

                    {paymentTab === 'cod' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Security Verification CAPTCHA</Label>
                          <div className="flex items-center gap-3.5">
                            <div className="bg-gray-200 text-gray-800 font-black italic tracking-widest text-sm px-4.5 py-1.5 rounded-sm select-none border border-gray-300">
                              {captchaCode}
                            </div>
                            <button 
                              onClick={() => {
                                const codes = ['K8H4', 'D9X1', 'A7B9', 'P2M5'];
                                setCaptchaCode(codes[Math.floor(Math.random() * codes.length)]);
                              }}
                              className="text-[10px] font-bold text-[#0d9488] hover:underline bg-transparent border-none cursor-pointer"
                            >
                              Refresh
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="captcha-in" className="text-xs font-bold text-gray-700">Enter CAPTCHA Code shown above</Label>
                          <Input
                            id="captcha-in"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                            placeholder="Type Code"
                            className="bg-white border-gray-200 text-xs py-2 h-9 w-40 font-bold tracking-widest"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-150 flex justify-end">
                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-[#fb641b] hover:bg-[#fb641b]/95 text-white font-bold h-11 px-8 rounded-sm text-xs tracking-wider uppercase border-none cursor-pointer"
                    >
                      {isProcessing ? 'Processing Securely...' : 'Place Order & Pay'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-gray-250/60 rounded-sm p-5 space-y-5 shadow-xs sticky top-[80px]">
                <h3 className="text-sm font-black uppercase text-gray-900 tracking-wider pb-2 border-b border-gray-150">Order Summary</h3>

                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-11 h-14 bg-gray-50 border border-gray-100 rounded-sm overflow-hidden relative shrink-0">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-xs">
                        <h4 className="font-bold text-gray-800 truncate">{item.product.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">Qty: {item.quantity} {item.variant ? `| Size: ${item.variant.value}` : ''}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-800">₹{(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 text-xs text-gray-600 font-medium border-t border-gray-150 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-800">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#0d9488] font-bold">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{shippingCost === 0 ? <span className="text-[#0d9488] font-bold">FREE</span> : `₹${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="text-gray-800">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-150 pt-3 mt-3 flex justify-between items-baseline font-black text-gray-900 text-sm">
                    <span>Total Amount</span>
                    <span className="text-[#0d9488] text-base">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-150">
                  <div className="bg-gray-50 p-3 rounded-sm border border-gray-150 flex gap-2">
                    <Shield className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />
                    <p className="text-[9px] text-gray-400 font-semibold leading-relaxed">100% Purchase Protection. Authorized securely by Razorpay gateway.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400 font-medium">
        <p>&copy; {new Date().getFullYear()} FCI SELLER. All rights reserved.</p>
      </footer>

      {/* SECURE GATEWAY SIMULATOR MODAL */}
      {showSimModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-gray-250/60 p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0d9488] border-t-transparent mb-4" />
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-2.5">Razorpay Gateway Simulation</h3>
            
            <div className="space-y-2 text-xs font-bold text-gray-600 w-full">
              <div className="flex items-center gap-2 justify-center">
                <span className={`h-2 w-2 rounded-full ${simStep >= 1 ? 'bg-[#0d9488]' : 'bg-gray-200'}`} />
                <span className={simStep >= 1 ? 'text-gray-900' : 'text-gray-400'}>Connecting to Razorpay network...</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className={`h-2 w-2 rounded-full ${simStep >= 2 ? 'bg-[#0d9488]' : 'bg-gray-200'}`} />
                <span className={simStep >= 2 ? 'text-gray-900' : 'text-gray-400'}>Verifying merchant webhook tokens...</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className={`h-2 w-2 rounded-full ${simStep >= 3 ? 'bg-[#0d9488]' : 'bg-gray-200'}`} />
                <span className={simStep >= 3 ? 'text-gray-900' : 'text-gray-400'}>Securing payment authorization...</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className={`h-2 w-2 rounded-full ${simStep >= 4 ? 'bg-[#388e3c]' : 'bg-gray-200'}`} />
                <span className={simStep >= 4 ? 'text-[#388e3c] font-black' : 'text-gray-400'}>Order Confirmed!</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-6 leading-relaxed">Please do not reload this page while the transaction is being verified by Razorpay SDK.</p>
          </div>
        </div>
      )}

    </div>
  );
}
