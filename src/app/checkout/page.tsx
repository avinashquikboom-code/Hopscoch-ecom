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
  ShoppingBag, HelpCircle, ArrowLeft, User, QrCode, Building, ChevronRight
} from 'lucide-react';
import { useCart, useClearCart } from '@/hooks';
import { toast } from 'sonner';

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
  const { data: cart } = useCart();
  const clearCartMutation = useClearCart();

  // Step state: 'shipping' represents "Shipping Details", 'payment' represents "Payment Method"
  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment'>('shipping');

  // Form State - Contact & Shipping Details
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [zipPostal, setZipPostal] = useState('');

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

  // Payment Simulation Modal state
  const [simStep, setSimStep] = useState(0);
  const [showSimModal, setShowSimModal] = useState(false);

  // Smooth scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [checkoutStep]);

  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const shippingCost = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const tax = subtotal * 0.18; // 18% GST standard luxury couture
  const total = subtotal - discount + shippingCost + tax;

  const handleVerifyUpi = () => {
    if (upiId.includes('@')) {
      setIsUpiVerified(true);
      toast.success('UPI ID verified successfully!');
    } else {
      toast.error('Invalid UPI ID format. Ex: user@bank');
    }
  };

  const handlePlaceOrder = () => {
    if (paymentTab === 'cod' && captchaInput !== captchaCode) {
      toast.error('Invalid CAPTCHA code. Please try again.');
      return;
    }
    
    // Trigger simulation modal
    setShowSimModal(true);
    setSimStep(1);

    setTimeout(() => {
      setSimStep(2);
    }, 1500);

    setTimeout(() => {
      setSimStep(3);
    }, 3000);

    setTimeout(() => {
      setSimStep(4);
    }, 4500);

    setTimeout(() => {
      // Clear Cart and route to Profile / Orders
      clearCartMutation.mutate(undefined, {
        onSuccess: () => {
          setShowSimModal(false);
          toast.success('Your order has been placed successfully!');
          router.push('/profile');
        }
      });
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-[#F1F3F6] font-sans flex flex-col justify-between">
      
      {/* SECURE HEADER */}
      <header className="bg-white border-b border-gray-200 py-3 shadow-xs sticky top-0 z-50">
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
                <span className="font-black text-sm tracking-widest text-[#282c3f] uppercase">AURA</span>
                <span className="text-[7px] font-bold tracking-[0.25em] text-gray-500 uppercase mt-0.5">COUTURE</span>
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
            
            {/* LEFT AREA: Shipping Details or Payment Selection */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* STEP TIMELINE BADGE BAR */}
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
                    className="text-xs text-[#0d9488] font-bold hover:underline flex items-center gap-1 border-none bg-transparent"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping
                  </button>
                )}
              </div>

              {/* STEP 1: SHIPPING DETAILS SCREEN */}
              {checkoutStep === 'shipping' && (
                <div className="bg-white border border-gray-250/60 rounded-sm p-5 shadow-xs space-y-4">
                  <h2 className="text-sm font-black uppercase text-gray-800 tracking-wider border-b border-gray-150 pb-2.5">Delivery Details</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname" className="text-xs font-bold text-gray-700">Full Name</Label>
                      <Input 
                        id="fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488] focus:ring-[#0d9488] font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold text-gray-700">Phone Number</Label>
                      <Input 
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488] focus:ring-[#0d9488] font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="h-10 text-xs bg-white focus:border-[#0d9488] focus:ring-[#0d9488] font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-xs font-bold text-gray-700">Street Address</Label>
                    <Input 
                      id="street"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="h-10 text-xs bg-white focus:border-[#0d9488] focus:ring-[#0d9488] font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-xs font-bold text-gray-700">City</Label>
                      <Input 
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488] focus:ring-[#0d9488] font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-xs font-bold text-gray-700">State</Label>
                      <Input 
                        id="state"
                        value={stateProvince}
                        onChange={(e) => setStateProvince(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488] focus:ring-[#0d9488] font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-xs font-bold text-gray-700">Pincode</Label>
                      <Input 
                        id="zip"
                        value={zipPostal}
                        onChange={(e) => setZipPostal(e.target.value)}
                        className="h-10 text-xs bg-white focus:border-[#0d9488] focus:ring-[#0d9488] font-semibold"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-150 flex justify-end">
                    <Button 
                      onClick={() => setCheckoutStep('payment')}
                      className="bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold h-11 px-8 rounded-sm text-xs tracking-wider uppercase border-none shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                </div>
              )}

              {/* STEP 2: PAYMENT METHOD SELECTION */}
              {checkoutStep === 'payment' && (
                <div className="bg-white border border-gray-250/60 rounded-sm p-5 shadow-xs space-y-5">
                  <h2 className="text-sm font-black uppercase text-gray-800 tracking-wider border-b border-gray-150 pb-2.5">Select Payment Method</h2>
                  
                  {/* Indian Payment Option Tabs */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setPaymentTab('card')}
                      className={`py-3.5 rounded-sm border text-center font-bold text-[10px] tracking-wider uppercase transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        paymentTab === 'card' 
                          ? 'border-[#0d9488] bg-teal-50/40 text-[#0d9488]' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>CARD</span>
                    </button>

                    <button
                      onClick={() => setPaymentTab('upi')}
                      className={`py-3.5 rounded-sm border text-center font-bold text-[10px] tracking-wider uppercase transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        paymentTab === 'upi' 
                          ? 'border-[#0d9488] bg-teal-50/40 text-[#0d9488]' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>UPI</span>
                    </button>

                    <button
                      onClick={() => setPaymentTab('netbanking')}
                      className={`py-3.5 rounded-sm border text-center font-bold text-[10px] tracking-wider uppercase transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        paymentTab === 'netbanking' 
                          ? 'border-[#0d9488] bg-teal-50/40 text-[#0d9488]' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>NET BANKING</span>
                    </button>

                    <button
                      onClick={() => setPaymentTab('cod')}
                      className={`py-3.5 rounded-sm border text-center font-bold text-[10px] tracking-wider uppercase transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        paymentTab === 'cod' 
                          ? 'border-[#0d9488] bg-teal-50/40 text-[#0d9488]' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>COD</span>
                    </button>
                  </div>

                  {/* Payment option details blocks */}
                  <div className="border border-gray-150 p-4 rounded-sm bg-gray-50/40 min-h-[220px]">
                    
                    {/* A. Credit/Debit Card Form */}
                    {paymentTab === 'card' && (
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <Label htmlFor="cardname" className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Cardholder Name</Label>
                          <Input
                            id="cardname"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="AARAV MEHTA"
                            className="bg-white border-gray-200 text-xs py-2 h-9 font-semibold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cardno" className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Card Number</Label>
                          <Input
                            id="cardno"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="XXXX XXXX XXXX XXXX"
                            className="bg-white border-gray-200 text-xs py-2 h-9 font-mono tracking-wider font-semibold"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="cardexp" className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Expiry Date</Label>
                            <Input
                              id="cardexp"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              placeholder="MM/YY"
                              className="bg-white border-gray-200 text-xs py-2 h-9 font-semibold text-center"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="cardcvv" className="text-[10px] font-bold uppercase tracking-wider text-gray-400">CVV</Label>
                            <Input
                              id="cardcvv"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              placeholder="***"
                              maxLength={3}
                              type="password"
                              className="bg-white border-gray-200 text-xs py-2 h-9 font-semibold text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* B. UPI Form */}
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
                            <p className="text-[10px] font-bold text-[#388e3c] flex items-center gap-1 animate-fade-in">
                              <Check className="w-3.5 h-3.5" /> Checked & Verified!
                            </p>
                          )}
                        </div>

                        <div className="border-t border-gray-150 pt-4 flex flex-col items-center">
                          <button
                            onClick={() => setShowQrCode(!showQrCode)}
                            className="text-xs font-bold text-[#0d9488] hover:underline flex items-center gap-1 border-none bg-transparent"
                          >
                            <QrCode className="w-4 h-4" />
                            <span>{showQrCode ? 'Hide QR Code' : 'Generate Secure QR Code for Scanning'}</span>
                          </button>
                          
                          {showQrCode && (
                            <div className="mt-3.5 p-3.5 bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-1">
                              <div className="w-32 h-32 relative bg-gray-50 flex items-center justify-center border border-gray-100">
                                <span className="text-4xl">📱</span>
                              </div>
                              <p className="text-[9px] text-gray-400 font-bold uppercase">Scan to Pay via any UPI App</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* C. Net Banking list */}
                    {paymentTab === 'netbanking' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="bank-select" className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Select Bank</Label>
                          <select
                            id="bank-select"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs font-semibold outline-none focus:border-[#0d9488]"
                          >
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="SBI">State Bank of India</option>
                            <option value="AXIS">Axis Bank</option>
                            <option value="KOTAK">Kotak Mahindra Bank</option>
                          </select>
                        </div>
                        <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">You will be redirected to your selected bank secure portal to authorize this transaction on order submit.</p>
                      </div>
                    )}

                    {/* D. COD with CAPTCHA verification */}
                    {paymentTab === 'cod' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Security Verification CAPTCHA</Label>
                          
                          <div className="flex items-center gap-3.5">
                            {/* Visual captcha box */}
                            <div className="bg-gray-200/90 text-gray-800 font-black italic tracking-widest text-sm px-4.5 py-1.5 rounded-sm select-none border border-gray-300">
                              {captchaCode}
                            </div>
                            
                            <button 
                              onClick={() => {
                                const codes = ['K8H4', 'D9X1', 'A7B9', 'P2M5'];
                                const rand = codes[Math.floor(Math.random() * codes.length)];
                                setCaptchaCode(rand);
                              }}
                              className="text-[10px] font-bold text-[#0d9488] hover:underline bg-transparent border-none"
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
                        <p className="text-[10px] text-gray-400 font-semibold">Confirm Cash on Delivery by entering the digits to avoid automated spam orders.</p>
                      </div>
                    )}

                  </div>

                  <div className="pt-4 border-t border-gray-150 flex justify-end">
                    <Button 
                      onClick={handlePlaceOrder}
                      className="bg-[#fb641b] hover:bg-[#fb641b]/95 text-white font-bold h-11 px-8 rounded-sm text-xs tracking-wider uppercase border-none shadow-sm cursor-pointer"
                    >
                      Place Order & Pay
                    </Button>
                  </div>

                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Order Summary details */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-gray-250/60 rounded-sm p-5 space-y-5 shadow-xs sticky top-[80px]">
                
                <h3 className="text-sm font-black uppercase text-gray-900 tracking-wider pb-2 border-b border-gray-150">Order Summary</h3>

                {/* Items loop list */}
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

                {/* Price calculations */}
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

                <div className="pt-2 border-t border-gray-150 space-y-2.5">
                  <div className="bg-gray-50 p-3 rounded-sm border border-gray-150 flex gap-2">
                    <Shield className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />
                    <p className="text-[9px] text-gray-400 font-semibold leading-relaxed">100% Purchase Protection. We guard your identity & payment details with PCI-DSS banking compliances.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400 font-medium">
        <p>&copy; {new Date().getFullYear()} AURA COUTURE. All rights reserved.</p>
      </footer>

      {/* SECURE GATEWAY SIMULATOR MODAL */}
      {showSimModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-gray-250/60 p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0d9488] border-t-transparent mb-4" />
            
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-2.5">Secure Gateway Active</h3>
            
            <div className="space-y-2 text-xs font-bold text-gray-600 w-full">
              <div className="flex items-center gap-2 justify-center">
                <span className={`h-2 w-2 rounded-full ${simStep >= 1 ? 'bg-[#0d9488]' : 'bg-gray-200'}`} />
                <span className={simStep >= 1 ? 'text-gray-900' : 'text-gray-400'}>Connecting to secure network...</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className={`h-2 w-2 rounded-full ${simStep >= 2 ? 'bg-[#0d9488]' : 'bg-gray-200'}`} />
                <span className={simStep >= 2 ? 'text-gray-900' : 'text-gray-400'}>Verifying merchant auth keys...</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className={`h-2 w-2 rounded-full ${simStep >= 3 ? 'bg-[#0d9488]' : 'bg-gray-200'}`} />
                <span className={simStep >= 3 ? 'text-gray-900' : 'text-gray-400'}>Authorizing transaction balance...</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className={`h-2 w-2 rounded-full ${simStep >= 4 ? 'bg-[#388e3c]' : 'bg-gray-200'}`} />
                <span className={simStep >= 4 ? 'text-[#388e3c] font-black' : 'text-gray-400'}>Order Authorized Successfully!</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mt-6 leading-relaxed">Do not refresh this screen or close the window while the bank secures the transaction.</p>
          </div>
        </div>
      )}

    </div>
  );
}
