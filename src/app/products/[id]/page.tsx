'use client';

import { useProducts, useProduct } from '@/hooks/use-products';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import {
  Heart, Share2, Star, ChevronRight, Tag, MapPin, Truck,
  HelpCircle, X, Check, ShieldCheck, RotateCcw,
  ChevronDown, ChevronUp, Package, Clock, CreditCard,
  BadgeCheck, MessageSquare, ThumbsUp, Download, ZoomIn,
} from 'lucide-react';
import { useAddToCart, useAddToWishlist, useRemoveFromWishlist } from '@/hooks';
import { useWishlistStore, useAuthStore, useLocationStore } from '@/store';
import { toast } from '@/components/ui/toast';
import { getColorCode } from '@/services/product.service';

/* ── Static mock reviews (no review API call on PDP) ── */
const MOCK_REVIEWS = [
  { id: 'r1', user: 'Priya S.', rating: 5, title: 'Excellent quality!', comment: 'Absolutely premium quality! Worth every rupee. Material is luxurious and the fit is perfect.', date: '12 Jun, 2026', certified: true, helpful: 24 },
  { id: 'r2', user: 'Rahul M.', rating: 4, title: 'Great product, fast delivery', comment: 'Great fit and finish. Delivery was fast too. The colour is exactly as shown in the pictures.', date: '2 May, 2026', certified: true, helpful: 10 },
  { id: 'r3', user: 'Ananya K.', rating: 5, title: 'Exceeded expectations!', comment: 'Loved the packaging and quality exceeded expectations! Will buy again.', date: '20 Apr, 2026', certified: false, helpful: 18 },
];

const RATING_DIST = [
  { label: '5', pct: 75, color: '#26a541' },
  { label: '4', pct: 15, color: '#26a541' },
  { label: '3', pct: 5,  color: '#ff9f00' },
  { label: '2', pct: 3,  color: '#ff6161' },
  { label: '1', pct: 2,  color: '#ff6161' },
];

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { data: product, isLoading, isError } = useProduct(id);
  const { data: productsData } = useProducts();
  const relatedProducts = productsData?.data || [];

  const { pincode: defaultPincode, city: defaultCity } = useLocationStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize]   = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [pincode, setPincode]             = useState(defaultPincode || '');
  const [pincodeMsg, setPincodeMsg]       = useState<{ text: string; ok: boolean } | null>(null);
  const [flyStyle, setFlyStyle]           = useState<React.CSSProperties | null>(null);
  const [sizeChart, setSizeChart]         = useState(false);
  const [shareOpen, setShareOpen]         = useState(false);
  const [showAllSpecs, setShowAllSpecs]   = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [descOpen, setDescOpen]           = useState(false);
  const [zoom, setZoom]                   = useState(false);
  const [zoomXY, setZoomXY]              = useState({ x: 50, y: 50 });

  const addToCart    = useAddToCart();
  const addWishlist  = useAddToWishlist();
  const removeWishlist = useRemoveFromWishlist();
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product?.id ?? ''));
  const isAuth       = useAuthStore((s) => s.isAuthenticated);
  const openLogin    = useAuthStore((s) => s.openLoginModal);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
    }
  }, [product]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#0d9488]/20 border-t-[#0d9488] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#0d9488] font-semibold">Loading product...</p>
      </div>
    </div>
  );

  if (isError || !product) return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-gray-500 mb-3">Product not found.</p>
        <Link href="/products"><Button className="bg-[#0d9488] text-white">Browse Products</Button></Link>
      </div>
    </div>
  );

  // ── Derived ──────────────────────────────────────────────────────────────
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const matchedVariant = () =>
    product.variants?.find(v =>
      v.size?.toLowerCase() === selectedSize.toLowerCase() &&
      v.color?.toLowerCase() === selectedColor.toLowerCase()
    );

  // ── Handlers (logic unchanged) ───────────────────────────────────────────
  const doAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFlyStyle({
      position: 'fixed', zIndex: 9999, pointerEvents: 'none',
      left: `${e.clientX}px`, top: `${e.clientY}px`,
      width: 44, height: 56, borderRadius: 4, overflow: 'hidden',
      border: '2px solid #0d9488',
      animation: 'flyCart 0.85s cubic-bezier(.2,.6,.4,1) forwards',
    });
    addToCart.mutate(
      { productId: product.id, quantity: 1, variantId: matchedVariant()?.id, product },
      { onSuccess: () => { toast.success('Added to cart!'); setTimeout(() => setFlyStyle(null), 900); } }
    );
  };

  const doBuyNow = () =>
    addToCart.mutate(
      { productId: product.id, quantity: 1, variantId: matchedVariant()?.id, product },
      { onSuccess: () => router.push('/checkout') }
    );

  const doWishlist = () => {
    if (!isAuth) { toast.info('Please sign in'); openLogin(); return; }
    isInWishlist ? removeWishlist.mutate(product.id) : addWishlist.mutate(product.id);
  };

  const doCheckPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode)) setPincodeMsg({ text: 'Delivery by Aug 8 · FREE Delivery', ok: true });
    else setPincodeMsg({ text: 'Enter a valid 6-digit pincode', ok: false });
  };

  const doMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoomXY({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    setZoom(true);
  };

  const doDownload = () => {
    const a = document.createElement('a');
    a.href = product.images[selectedImage];
    a.download = product.name.replace(/\s+/g, '_') + '.jpg';
    a.click();
    toast.success('Image saved!');
  };

  const specEntries = Object.entries({
    'Brand':             product.brand || 'FCISeller',
    'Material':          'Premium Cotton Blend',
    'Fit':               'Regular Comfort Fit',
    'Style Code':        `AC-${product.id.toUpperCase()}-01`,
    'Occasion':          'Everyday Wear',
    'Fabric Care':       'Gentle Machine Wash',
    'Country of Origin': 'India',
    'Pattern':           'Solid',
    'Sleeve Length':     'Full Sleeve',
  });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f1f3f6]" style={{ fontFamily: "'Roboto', 'Arial', sans-serif" }}>

      {/* ═══════════ TOP BREADCRUMB ═══════════ */}
      <div className="bg-white border-b border-[#efefef]">
        <div className="max-w-[1300px] mx-auto px-4 h-10 flex items-center gap-1.5 text-[12px] text-[#878787]">
          <Link href="/" className="hover:text-[#0d9488] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#c4c4c4]" />
          <Link href="/products" className="hover:text-[#0d9488] transition-colors">Clothing</Link>
          <ChevronRight className="w-3 h-3 text-[#c4c4c4]" />
          {product.brand && <>
            <span className="hover:text-[#0d9488] cursor-pointer">{product.brand}</span>
            <ChevronRight className="w-3 h-3 text-[#c4c4c4]" />
          </>}
          <span className="text-[#212121] truncate max-w-[240px]">{product.name}</span>
        </div>
      </div>

      {/* ═══════════ MAIN AREA ═══════════ */}
      <div className="max-w-[1300px] mx-auto px-4 py-3">

        {/* TOP PRODUCT ROW */}
        <div className="flex flex-col lg:flex-row gap-3">

          {/* ╔══════════════════════════════════════════╗
              ║  LEFT — IMAGE GALLERY (Flipkart exact)  ║
              ╚══════════════════════════════════════════╝ */}
          <div className="w-full lg:w-[40%] xl:w-[38%] flex-shrink-0">
            <div className="lg:sticky lg:top-[68px] space-y-2">

              {/* IMAGE CARD */}
              <div className="bg-white border border-[#efefef]">

                {/* Main image */}
                <div className="relative">
                    {/* Wishlist + Share — top right overlay */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                      <button
                        onClick={doWishlist}
                        className={`w-9 h-9 bg-white shadow border flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                          isInWishlist ? 'text-red-500 border-red-200' : 'text-[#878787] border-[#e0e0e0] hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => setShareOpen(!shareOpen)}
                        className="w-9 h-9 bg-white shadow border border-[#e0e0e0] text-[#878787] flex items-center justify-center cursor-pointer hover:text-[#0d9488] transition-all hover:scale-105"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Share dropdown */}
                    {shareOpen && (
                      <div className="absolute top-3 right-14 z-30 bg-white border border-[#e0e0e0] shadow-lg p-3 w-52 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-bold text-[#212121] uppercase">Share</span>
                          <button onClick={() => setShareOpen(false)} className="text-[#878787] cursor-pointer border-none bg-transparent"><X className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(product.name + ' ' + window.location.href)}`)} className="flex items-center gap-1 px-2 py-1 bg-[#25d366] text-white text-[11px] font-bold cursor-pointer border-none">WhatsApp</button>
                          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Copied!'); setShareOpen(false); }} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-[#212121] text-[11px] font-bold cursor-pointer border-none">Copy Link</button>
                          <button onClick={doDownload} className="flex items-center gap-1 px-2 py-1 bg-teal-50 text-[#0d9488] text-[11px] font-bold cursor-pointer border border-teal-200"><Download className="w-3 h-3" /> Save</button>
                        </div>
                      </div>
                    )}

                    {/* Main image with zoom */}
                    <div
                      className="relative overflow-hidden cursor-zoom-in"
                      style={{ aspectRatio: '5/6' }}
                      onMouseMove={doMouseMove}
                      onMouseLeave={() => setZoom(false)}
                    >
                      <img
                        src={product.images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top"
                        style={zoom ? { transform: 'scale(2)', transformOrigin: `${zoomXY.x}% ${zoomXY.y}%`, transition: 'transform 0.1s' } : { transition: 'transform 0.3s' }}
                      />
                      {discount > 0 && (
                        <div className="absolute top-0 left-0 bg-[#26a541] text-white text-[11px] font-bold px-2 py-0.5">
                          {discount}% OFF
                        </div>
                      )}
                      {!zoom && (
                        <div className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] px-2 py-0.5 flex items-center gap-1 rounded-sm backdrop-blur-sm">
                          <ZoomIn className="w-2.5 h-2.5" /> Hover to zoom
                        </div>
                      )}
                    </div>

                    {/* Mobile thumbnails */}
                    <div className="sm:hidden flex gap-2 p-2 overflow-x-auto border-t border-[#f0f0f0]">
                      {product.images.map((img, i) => (
                        <button key={i} onClick={() => setSelectedImage(i)}
                          className={`flex-shrink-0 w-11 h-[52px] border overflow-hidden cursor-pointer ${selectedImage === i ? 'border-[#0d9488]' : 'border-[#e0e0e0]'}`}>
                          <img src={img} alt="" className="w-full h-full object-cover object-top" />
                        </button>
                      ))}
                    </div>
                </div>

                {/* Colour image strip (variant selector with image thumbnails) */}
                {product.colors && product.colors.length > 0 && (
                  <div className="border-t border-[#f0f0f0] px-3 py-2.5">
                    <p className="text-[11px] text-[#878787] mb-2 font-medium">
                      Colour: <span className="text-[#212121] font-semibold capitalize">{selectedColor}</span>
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {product.colors.map((c, i) => {
                        const thumb = product.images[i] ?? product.images[0];
                        const sel = selectedColor === c;
                        return (
                          <button
                            key={i}
                            onClick={() => { setSelectedColor(c); setSelectedImage(i < product.images.length ? i : 0); }}
                            title={c}
                            className={`flex flex-col items-center cursor-pointer border-2 overflow-hidden w-[50px] flex-shrink-0 transition-all ${
                              sel ? 'border-[#0d9488]' : 'border-[#e0e0e0] hover:border-[#0d9488]/50'
                            }`}
                          >
                            <div className="w-full h-[52px] overflow-hidden">
                              <img src={thumb} alt={c} className="w-full h-full object-cover object-top" />
                            </div>
                            <span className={`text-[9px] w-full text-center py-0.5 leading-none truncate px-0.5 ${sel ? 'bg-[#0d9488] text-white font-bold' : 'bg-white text-[#878787]'}`}>
                              {c}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── ADD TO CART + BUY NOW ── */}
                <div className="border-t border-[#f0f0f0] grid grid-cols-2">
                  <button
                    onClick={doAddToCart}
                    disabled={addToCart.isPending || product.stock === 0}
                    className="flex items-center justify-center gap-2 py-4 bg-[#ff9f00] hover:bg-[#f0960a] text-white font-bold text-[13px] uppercase tracking-wide cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Package className="w-4 h-4" />
                    {addToCart.isPending ? 'Adding…' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={doBuyNow}
                    disabled={addToCart.isPending || product.stock === 0}
                    className="flex items-center justify-center gap-2 py-4 bg-[#fb641b] hover:bg-[#ea5a10] text-white font-bold text-[13px] uppercase tracking-wide cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Truck className="w-4 h-4" />
                    {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </div>
              </div>

              {/* SELLER + ASSURANCE */}
              <div className="bg-white border border-[#efefef] px-4 py-3">
                <p className="text-[11px] text-[#878787] uppercase font-medium mb-1">Sold by</p>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#0d9488] font-semibold cursor-pointer hover:underline">{product.brand || 'FCISeller'} Official</span>
                  <span className="flex items-center gap-0.5 bg-[#26a541] text-white text-[11px] font-bold px-1.5 py-0.5">
                    4.7 <Star className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </span>
                </div>
                <div className="grid grid-cols-3 mt-3 pt-3 border-t border-[#f0f0f0] gap-2">
                  {[
                    { Icon: ShieldCheck, label: '7 Day\nReturn' },
                    { Icon: RotateCcw,   label: 'Easy\nExchange' },
                    { Icon: Truck,       label: 'Free\nDelivery' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 text-center">
                      <Icon className="w-5 h-5 text-[#0d9488]" />
                      <span className="text-[10px] text-[#878787] font-medium leading-tight whitespace-pre-line">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ╔══════════════════════════════════════════╗
              ║  RIGHT — PRODUCT INFO                   ║
              ╚══════════════════════════════════════════╝ */}
          <div className="flex-1 min-w-0 space-y-3">

            {/* ── TITLE + RATING CARD ── */}
            <div className="bg-white border border-[#efefef] px-4 sm:px-5 pt-4 pb-0">

              {/* Brand */}
              <p className="text-[12px] text-[#878787] font-medium uppercase tracking-wide mb-0.5">{product.brand || 'FCISeller'}</p>

              {/* Name */}
              <h1 style={{ fontWeight: 400, fontSize: '18px', color: '#212121', lineHeight: 1.4, marginBottom: 6 }}>
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 flex-wrap pb-3 border-b border-[#f0f0f0]">
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 bg-[#26a541] text-white text-[12px] font-bold px-2 py-0.5">
                    {product.rating.toFixed(1)} <Star className="w-3 h-3 fill-current" />
                  </span>
                  <span className="text-[12px] text-[#878787]">
                    {product.reviewCount.toLocaleString()} Ratings &amp; {Math.max(product.reviewCount - 12, 8)} Reviews
                  </span>
                </div>
                <span className="flex items-center gap-1 border border-[#0d9488]/50 text-[#0d9488] text-[10px] font-bold px-1.5 py-0.5 italic">
                  <BadgeCheck className="w-3 h-3" /> Assured
                </span>
              </div>

              {/* ── PRICE ── */}
              <div className="py-3 border-b border-[#f0f0f0]">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span style={{ fontSize: 28, fontWeight: 700, color: '#212121' }}>₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span style={{ fontSize: 16, color: '#878787', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#388e3c' }}>{discount}% off</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-[#878787] mt-1">
                  {product.taxPercent && product.taxPercent > 0
                    ? `+ ${product.taxPercent}% GST${product.taxType === 'INCLUSIVE' ? ' (inclusive)' : ''}`
                    : 'inclusive of all taxes'}
                  {product.hsnCode && <span className="ml-2 font-mono">· HSN {product.hsnCode}</span>}
                </p>
              </div>

              {/* ── OFFERS ── */}
              <div className="py-3 border-b border-[#f0f0f0]">
                <p className="text-[13px] font-bold text-[#212121] mb-2">Available Offers</p>
                <div className="space-y-2">
                  {[
                    { t: 'Bank Offer',    d: '10% off on HDFC Bank Credit Cards, up to ₹1,500. Min. purchase ₹4,999.' },
                    { t: 'Bank Offer',    d: '5% Cashback on FCISeller Axis Bank Card. No minimum transaction.' },
                    { t: 'Special Price', d: 'Get extra ₹1,000 off — price inclusive of cashback.' },
                    { t: 'No Cost EMI',   d: 'Avail No Cost EMI on select cards. EMI starts at ₹249/month.' },
                  ].map(({ t, d }, i) => (
                    <div key={i} className="flex gap-2 text-[12px] text-[#212121]">
                      <Tag className="w-3.5 h-3.5 text-[#26a541] flex-shrink-0 mt-0.5" />
                      <span><strong>{t}:</strong> {d} <span className="text-[#0d9488] cursor-pointer hover:underline font-semibold">T&amp;C</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SIZE SELECTOR ── */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="py-3 border-b border-[#f0f0f0]">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#212121]">Size</span>
                      {selectedSize && <span className="text-[13px] text-[#878787]">: {selectedSize}</span>}
                    </div>
                    <button onClick={() => setSizeChart(true)} className="text-[12px] text-[#0d9488] font-bold hover:underline cursor-pointer border-none bg-transparent flex items-center gap-0.5">
                      Size Chart <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[52px] h-[52px] px-3 border text-[13px] font-semibold cursor-pointer transition-all ${
                          selectedSize === sz
                            ? 'border-[#0d9488] text-[#0d9488] bg-white ring-1 ring-[#0d9488]'
                            : 'border-[#c2c2c2] text-[#212121] hover:border-[#0d9488] bg-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#878787] mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 7-day size exchange available
                  </p>
                </div>
              )}

              {/* ── DELIVERY CHECKER ── */}
              <div className="py-3 border-b border-[#f0f0f0]">
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#212121]" />
                  <span className="text-[13px] font-bold text-[#212121]">Delivery</span>
                </div>
                <form onSubmit={doCheckPin} className="flex items-center gap-2">
                  <input
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    placeholder="Enter Pincode"
                    maxLength={6}
                    className="border border-[#c2c2c2] px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#0d9488] w-36"
                  />
                  <button type="submit" className="text-[#0d9488] font-bold text-[12px] cursor-pointer border-none bg-transparent hover:underline">Check</button>
                </form>
                {pincodeMsg && (
                  <p className={`text-[12px] mt-1.5 flex items-center gap-1.5 font-semibold ${pincodeMsg.ok ? 'text-[#26a541]' : 'text-red-500'}`}>
                    <Truck className="w-3.5 h-3.5 shrink-0" /> {pincodeMsg.text}
                  </p>
                )}
              </div>

              {/* ── DESCRIPTION ── */}
              <div className="py-3">
                <p className="text-[13px] font-bold text-[#212121] mb-1.5">Description</p>
                <div className={`relative overflow-hidden transition-all ${descOpen ? '' : 'max-h-[72px]'}`}>
                  <p className="text-[13px] text-[#878787] leading-relaxed">{product.description}</p>
                  {!descOpen && <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />}
                </div>
                <button onClick={() => setDescOpen(!descOpen)} className="text-[12px] text-[#0d9488] font-bold hover:underline cursor-pointer border-none bg-transparent flex items-center gap-0.5 mt-1">
                  {descOpen ? <><ChevronUp className="w-3 h-3" /> Read less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
                </button>
              </div>

            </div>

            {/* ── SPECIFICATIONS ── */}
            <div className="bg-white border border-[#efefef] px-4 sm:px-5 py-4">
              <p className="text-[15px] font-bold text-[#212121] mb-3">Specifications</p>
              <div className="divide-y divide-[#f0f0f0]">
                {(showAllSpecs ? specEntries : specEntries.slice(0, 5)).map(([k, v]) => (
                  <div key={k} className="flex py-2.5 gap-4">
                    <span className="w-[45%] text-[12px] text-[#878787] flex-shrink-0">{k}</span>
                    <span className="text-[12px] text-[#212121] font-medium">{v}</span>
                  </div>
                ))}
              </div>
              {specEntries.length > 5 && (
                <button onClick={() => setShowAllSpecs(!showAllSpecs)} className="mt-2 text-[12px] text-[#0d9488] font-bold hover:underline cursor-pointer flex items-center gap-1 border-none bg-transparent">
                  {showAllSpecs ? <><ChevronUp className="w-3 h-3" /> Show fewer</> : <><ChevronDown className="w-3 h-3" /> View all {specEntries.length} specs</>}
                </button>
              )}
            </div>

            {/* ── RATINGS & REVIEWS ── */}
            <div className="bg-white border border-[#efefef] px-4 sm:px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[15px] font-bold text-[#212121]">Ratings &amp; Reviews</p>
                <button className="text-[12px] text-[#0d9488] font-bold border border-[#0d9488] px-3 py-1.5 hover:bg-[#0d9488]/5 cursor-pointer transition-colors">
                  Rate Product
                </button>
              </div>

              {/* Summary */}
              <div className="flex items-center gap-8 mb-5">
                <div className="text-center flex-shrink-0">
                  <p className="text-[42px] font-bold text-[#212121] leading-none">{product.rating.toFixed(1)}</p>
                  <div className="flex gap-0.5 justify-center my-1.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? 'fill-[#26a541] text-[#26a541]' : 'fill-[#e0e0e0] text-[#e0e0e0]'}`} />
                    ))}
                  </div>
                  <p className="text-[11px] text-[#878787]">{product.reviewCount.toLocaleString()} ratings</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {RATING_DIST.map(({ label, pct, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-[11px] text-[#878787] w-3 text-right flex-shrink-0">{label}</span>
                      <Star className="w-3 h-3 fill-[#878787] text-[#878787] flex-shrink-0" />
                      <div className="flex-1 bg-[#f0f0f0] h-2 overflow-hidden">
                        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color, transition: 'width 0.8s ease' }} />
                      </div>
                      <span className="text-[11px] text-[#878787] w-7 text-right flex-shrink-0">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review list */}
              <div className="divide-y divide-[#f0f0f0]">
                {(showAllReviews ? MOCK_REVIEWS : MOCK_REVIEWS.slice(0, 2)).map((r) => (
                  <div key={r.id} className="py-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`flex items-center gap-0.5 text-white text-[11px] font-bold px-1.5 py-0.5 ${r.rating >= 4 ? 'bg-[#26a541]' : r.rating === 3 ? 'bg-[#ff9f00]' : 'bg-[#ff6161]'}`}>
                        {r.rating} <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                      <span className="text-[13px] font-bold text-[#212121]">{r.title}</span>
                    </div>
                    <p className="text-[13px] text-[#212121] mb-2 leading-relaxed">{r.comment}</p>
                    <div className="flex items-center gap-3 text-[11px] text-[#878787]">
                      <span className="font-semibold text-[#212121]">{r.user}</span>
                      {r.certified && (
                        <span className="flex items-center gap-0.5 text-[#26a541] font-semibold">
                          <Check className="w-3 h-3" /> Certified Buyer
                        </span>
                      )}
                      <span>{r.date}</span>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <button className="text-[11px] text-[#878787] flex items-center gap-1 cursor-pointer border-none bg-transparent hover:text-[#212121]">
                        <ThumbsUp className="w-3 h-3" /> {r.helpful} Helpful
                      </button>
                      <button className="text-[11px] text-[#878787] flex items-center gap-1 cursor-pointer border-none bg-transparent hover:text-[#212121]">
                        <MessageSquare className="w-3 h-3" /> Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {MOCK_REVIEWS.length > 2 && (
                <button onClick={() => setShowAllReviews(!showAllReviews)} className="w-full mt-3 py-2.5 border border-[#0d9488] text-[#0d9488] font-bold text-[13px] hover:bg-[#0d9488]/5 cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                  {showAllReviews ? <><ChevronUp className="w-4 h-4" /> Show less</> : <>View all {MOCK_REVIEWS.length} reviews <ChevronDown className="w-4 h-4" /></>}
                </button>
              )}
            </div>

            {/* ── Q&A ── */}
            <div className="bg-white border border-[#efefef] px-4 sm:px-5 py-4">
              <p className="text-[15px] font-bold text-[#212121] mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#878787]" /> Questions &amp; Answers
              </p>
              <div className="space-y-4">
                {[
                  { q: 'Is the colour same as shown in pictures?',    a: 'Yes, colours are accurate. Minor variation may occur due to screen settings.' },
                  { q: 'Does this product have a warranty?',           a: '30-day manufacturing defect warranty from purchase date.' },
                  { q: 'What is the return policy?',                   a: '7-day easy return/exchange. Item must be unused in original packaging.' },
                ].map(({ q, a }, i) => (
                  <div key={i} className="border-t border-[#f0f0f0] pt-4 first:border-0 first:pt-0">
                    <p className="text-[13px] font-semibold text-[#212121] flex gap-2 mb-1">
                      <span className="text-[#0d9488] font-bold flex-shrink-0">Q.</span> {q}
                    </p>
                    <p className="text-[13px] text-[#878787] flex gap-2 pl-5">
                      <span className="text-[#26a541] font-bold flex-shrink-0">A.</span> {a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PAYMENT ── */}
            <div className="bg-white border border-[#efefef] px-4 sm:px-5 py-4">
              <p className="text-[15px] font-bold text-[#212121] mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#878787]" /> Payment &amp; EMI Options
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Credit Card', 'Debit Card', 'Net Banking', 'UPI / QR', 'No Cost EMI', 'Cash on Delivery'].map(m => (
                  <div key={m} className="flex items-center gap-1.5 border border-[#e0e0e0] bg-[#fafafa] px-2.5 py-2 text-[12px] text-[#212121] font-medium">
                    <Check className="w-3 h-3 text-[#26a541] shrink-0" /> {m}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ═══════════ RELATED PRODUCTS ═══════════ */}
        {[
          { title: 'Frequently Bought Together', data: relatedProducts.slice(2, 6) },
          { title: 'Similar Products',           data: relatedProducts.slice(1, 5) },
          { title: `More from ${product.brand || 'FCISeller'}`, data: relatedProducts.slice(4, 8) },
        ].filter(s => s.data.length > 0).map(({ title, data }) => (
          <div key={title} className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[16px] font-bold text-[#212121]">{title}</p>
              <Link href="/products" className="text-[12px] text-[#0d9488] font-bold hover:underline flex items-center gap-0.5">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {data.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════ SIZE CHART MODAL ═══════════ */}
      {sizeChart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSizeChart(false)}>
          <div className="bg-white w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f0f0f0]">
              <p className="text-[14px] font-bold text-[#212121]">Size Chart</p>
              <button onClick={() => setSizeChart(false)} className="p-1 hover:bg-gray-100 cursor-pointer border-none"><X className="w-5 h-5 text-[#878787]" /></button>
            </div>
            <div className="p-5">
              <p className="text-[12px] text-[#878787] mb-3">All measurements in inches (body dimensions).</p>
              <table className="w-full border-collapse border border-[#e0e0e0] text-[12px]">
                <thead>
                  <tr className="bg-[#0d9488] text-white font-bold uppercase text-[10px]">
                    {['Size', 'Chest', 'Waist', 'Hips', 'Length'].map(h => <th key={h} className="px-3 py-2 text-center border border-[#0b8278]">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[['XS','32–34','26–28','34–36','26'],['S','34–36','28–30','36–38','27'],['M','38–40','32–34','40–42','27.5'],['L','42–44','36–38','44–46','28'],['XL','46–48','40–42','48–50','28.5'],['2XL','50–52','44–46','52–54','29']].map(([sz,...v]) => (
                    <tr key={sz} className={`text-center border border-[#f0f0f0] ${selectedSize === sz ? 'bg-[#0d9488]/10 font-bold' : 'hover:bg-[#fafafa]'}`}>
                      <td className="px-3 py-2 font-bold text-[#0d9488] border border-[#f0f0f0]">{sz}</td>
                      {v.map((val, i) => <td key={i} className="px-3 py-2 border border-[#f0f0f0] text-[#212121]">{val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 bg-amber-50 border border-amber-200 p-3 flex gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700">Between sizes? We recommend sizing up for comfort.</p>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-[#f0f0f0]">
              <Button onClick={() => setSizeChart(false)} className="w-full bg-[#0d9488] hover:bg-[#0b7a70] text-white font-bold h-10 text-[12px]">CLOSE</Button>
            </div>
          </div>
        </div>
      )}

      {/* Fly-to-cart */}
      {flyStyle && (
        <div style={flyStyle}>
          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <style>{`
        @keyframes flyCart {
          0%   { transform: scale(1); opacity: 1; }
          40%  { transform: scale(1.2) translateY(-30px); }
          100% { left: calc(100vw - 70px); top: 16px; transform: scale(0.08); opacity: 0; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
