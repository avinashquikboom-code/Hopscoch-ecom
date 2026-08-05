'use client';
import { useProducts, useProduct } from '@/hooks/use-products';
import { useState, use, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import {
  Heart,
  Share2,
  Star,
  ChevronRight,
  Tag,
  MapPin,
  Truck,
  HelpCircle,
  X,
  Check,
  Download,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  Package,
  Clock,
  CreditCard,
  BadgeCheck,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { useAddToCart, useAddToWishlist, useRemoveFromWishlist } from '@/hooks';
import { useWishlistStore, useAuthStore, useLocationStore } from '@/store';
import { toast } from '@/components/ui/toast';
import { getColorCode } from '@/services/product.service';

/* ─────────────────────────────────────────────────
   Inline SVG social icons
───────────────────────────────────────────────── */
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.185-1.359a9.95 9.95 0 0 0 4.823 1.248h.004c5.507 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.178-2.923-7.065A9.914 9.914 0 0 0 12.012 2z" />
  </svg>
);
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 5.01 3.656 9.168 8.438 9.918v-7.017h-2.54v-2.9h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.87h2.78l-.445 2.9h-2.335v7.017C18.343 21.185 22 17.028 22 12.017 22 6.484 17.522 2 12 2z" />
  </svg>
);
const TwitterXIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ─────────────────────────────────────────────────
   Mock reviews data
───────────────────────────────────────────────── */
const MOCK_REVIEWS = [
  { id: 'r1', user: 'Priya S.', rating: 5, title: 'Excellent quality!', comment: 'Absolutely premium quality! Worth every rupee. The material feels luxurious and the fit is perfect.', date: '12 Jun, 2026', certified: true, helpful: 24, images: [] },
  { id: 'r2', user: 'Rahul M.', rating: 4, title: 'Great product, fast delivery', comment: 'Great fit and finish. Delivery was fast too. The colour is exactly as shown in the pictures.', date: '2 May, 2026', certified: true, helpful: 10, images: [] },
  { id: 'r3', user: 'Ananya K.', rating: 5, title: 'Exceeded expectations', comment: 'Loved the packaging and the product quality exceeded expectations! Will definitely buy again.', date: '20 Apr, 2026', certified: false, helpful: 18, images: [] },
];

/* ─────────────────────────────────────────────────
   Rating bar helper
───────────────────────────────────────────────── */
const RATING_DIST = [
  { label: '5 ★', pct: 75, color: '#388e3c' },
  { label: '4 ★', pct: 15, color: '#388e3c' },
  { label: '3 ★', pct: 5,  color: '#ff9800' },
  { label: '2 ★', pct: 3,  color: '#ff5722' },
  { label: '1 ★', pct: 2,  color: '#f44336' },
];

/* ─────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────── */
export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);

  const { data: product, isLoading, isError } = useProduct(unwrappedParams.id);
  const { data: productsData } = useProducts();
  const mockProducts = productsData?.data || [];

  /* ── state ── */
  const { pincode: defaultPincode, city: defaultCity } = useLocationStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [pincode, setPincode] = useState(defaultPincode || '411001');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(
    `Delivery available to ${defaultCity ? `${defaultCity} (${defaultPincode || '411001'})` : defaultPincode || '411001'} | Free shipping`
  );
  const [flyStyle, setFlyStyle] = useState<React.CSSProperties | null>(null);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product?.id ?? ''));
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  useEffect(() => {
    if (defaultPincode) {
      setPincode(defaultPincode);
      setPincodeStatus(`Delivery available to ${defaultCity ? `${defaultCity} (${defaultPincode})` : defaultPincode} | Free shipping`);
    }
  }, [defaultPincode, defaultCity]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
    }
  }, [product]);

  /* ── loading / error ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#2874f0]/30 border-t-[#2874f0] animate-spin" />
          <p className="text-xs font-semibold text-[#2874f0] uppercase tracking-widest animate-pulse">Loading…</p>
        </div>
      </div>
    );
  }
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center max-w-xs px-6">
          <p className="text-sm font-semibold text-gray-500">Product not found or could not be loaded.</p>
          <Link href="/products">
            <Button className="bg-[#2874f0] hover:bg-[#2874f0]/90 text-white rounded-sm">Back to Catalog</Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ── derived values ── */
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined;

  const getMatchedVariant = () =>
    product?.variants?.find(
      (v) =>
        v.size?.toLowerCase() === selectedSize.toLowerCase() &&
        v.color?.toLowerCase() === selectedColor.toLowerCase()
    );

  /* ── handlers ── */
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFlyStyle({
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
      position: 'fixed',
      zIndex: 9999,
      pointerEvents: 'none',
      width: '44px',
      height: '60px',
      borderRadius: '4px',
      overflow: 'hidden',
      border: '2px solid #2874f0',
      boxShadow: '0 8px 24px rgba(40,116,240,0.25)',
      animation: 'flyToCart 0.85s cubic-bezier(0.2, 0.6, 0.4, 1) forwards',
    });
    addToCartMutation.mutate(
      { productId: product.id, quantity: 1, variantId: getMatchedVariant()?.id, product },
      { onSuccess: () => { toast.success('Added to Cart!'); setTimeout(() => setFlyStyle(null), 850); } }
    );
  };

  const handleBuyNow = () => {
    addToCartMutation.mutate(
      { productId: product.id, quantity: 1, variantId: getMatchedVariant()?.id, product },
      { onSuccess: () => router.push('/checkout') }
    );
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) { toast.info('Please sign in to save items'); openLoginModal(); return; }
    isInWishlist ? removeFromWishlistMutation.mutate(product.id) : addToWishlistMutation.mutate(product.id);
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode)) {
      setPincodeStatus('Delivery by Thursday, Aug 8 | FREE Delivery');
    } else {
      setPincodeStatus('Invalid pincode. Please enter 6 digits.');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - left) / width) * 100, y: ((e.clientY - top) / height) * 100 });
    setZoomActive(true);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = product.images[selectedImage];
    link.download = `${product.name.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
    setIsShareOpen(false);
  };

  const specsList: Record<string, string> = {
    'Material': 'Premium Cotton Blend',
    'Fit': 'Regular Comfort Fit',
    'Style Code': `AC-${product.id.toUpperCase()}-01`,
    'Occasion': 'Everyday Wear',
    'Fabric Care': 'Gentle Machine Wash',
    'Country of Origin': 'India',
    'Pattern': 'Solid',
    'Sleeve Length': 'Full Sleeve',
    'Brand': product.brand || 'FCISeller',
  };

  const specEntries = Object.entries(specsList);
  const visibleSpecs = showAllSpecs ? specEntries : specEntries.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans">

      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center gap-1 text-[11px] text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-[#2874f0] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-[#2874f0] transition-colors">Clothing</Link>
          <ChevronRight className="w-3 h-3" />
          {product.brand && (
            <>
              <span className="hover:text-[#2874f0] cursor-pointer transition-colors">{product.brand}</span>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">

          {/* ════════════════════════════════════════
              LEFT COLUMN — Sticky Image Gallery
          ════════════════════════════════════════ */}
          <div className="w-full lg:w-[42%] xl:w-[40%]">
            <div className="lg:sticky lg:top-[72px]">

              {/* Thumbnail strip + main image side-by-side on desktop */}
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="flex">
                  {/* Vertical thumbnails (desktop) / horizontal (mobile hidden) */}
                  <div className="hidden sm:flex flex-col gap-2 p-3 border-r border-gray-100 overflow-y-auto max-h-[500px]">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-14 h-16 border-2 rounded-sm overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                          selectedImage === idx
                            ? 'border-[#2874f0]'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover object-top" />
                      </button>
                    ))}
                  </div>

                  {/* Main image with zoom */}
                  <div className="flex-1 relative">
                    <div
                      ref={imageRef}
                      className="relative aspect-[4/5] cursor-zoom-in overflow-hidden"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={() => setZoomActive(false)}
                    >
                      <img
                        src={product.images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top transition-transform duration-150"
                        style={zoomActive ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: 'scale(2)' } : {}}
                      />

                      {/* Discount badge */}
                      {discount && (
                        <div className="absolute top-3 left-3 bg-[#388e3c] text-white text-[10px] font-black px-2 py-0.5 rounded-sm">
                          {discount}% off
                        </div>
                      )}

                      {/* Stock badge */}
                      {product.stock > 0 && product.stock <= 5 && (
                        <div className="absolute top-3 left-3 mt-6 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                          Only {product.stock} left!
                        </div>
                      )}

                      {/* Wishlist button */}
                      <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md border transition-all cursor-pointer z-10 ${
                          isInWishlist ? 'text-red-500 border-red-100' : 'text-gray-400 border-gray-100 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                      </button>

                      {/* Zoom hint */}
                      {!zoomActive && (
                        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                          <ZoomIn className="w-3 h-3" /> Hover to zoom
                        </div>
                      )}
                    </div>

                    {/* Mobile thumbnail strip */}
                    <div className="sm:hidden flex gap-2 px-3 py-2 overflow-x-auto">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-12 h-14 border-2 rounded-sm overflow-hidden flex-shrink-0 cursor-pointer ${
                            selectedImage === idx ? 'border-[#2874f0]' : 'border-gray-200'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover object-top" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── ACTION BUTTONS ── */}
                <div className="grid grid-cols-2 gap-0 border-t border-gray-100">
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending || product.stock === 0}
                    className="flex items-center justify-center gap-2 py-3.5 bg-[#ff9f00] hover:bg-[#ff9f00]/90 text-white font-bold text-sm cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Package className="w-4 h-4" />
                    {addToCartMutation.isPending ? 'Adding…' : 'ADD TO CART'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={addToCartMutation.isPending || product.stock === 0}
                    className="flex items-center justify-center gap-2 py-3.5 bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-bold text-sm cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Truck className="w-4 h-4" />
                    {product.stock === 0 ? 'OUT OF STOCK' : 'BUY NOW'}
                  </button>
                </div>
              </div>

              {/* ── SELLER / ASSURANCE STRIP ── */}
              <div className="mt-3 bg-white border border-gray-200 rounded-sm p-4">
                <h4 className="text-xs font-bold text-gray-700 mb-3">Seller</h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[#2874f0] font-semibold cursor-pointer hover:underline">
                    {product.brand || 'FCISeller'} Official
                  </span>
                  <span className="flex items-center gap-0.5 bg-[#388e3c] text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm">
                    4.7 <Star className="w-2.5 h-2.5 fill-current" />
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                  {[
                    { icon: <ShieldCheck className="w-4 h-4 text-[#2874f0]" />, label: '7 Day Returns' },
                    { icon: <RotateCcw className="w-4 h-4 text-[#2874f0]" />, label: 'Easy Exchange' },
                    { icon: <Truck className="w-4 h-4 text-[#2874f0]" />, label: 'Free Delivery' },
                  ].map(({ icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 text-center">
                      {icon}
                      <span className="text-[10px] font-semibold text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SHARE BUTTON ── */}
              <div className="mt-3 relative">
                <button
                  onClick={() => setIsShareOpen(!isShareOpen)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-sm text-sm text-gray-600 font-semibold hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                {isShareOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-xl z-30 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-700 uppercase">Share Product</span>
                      <button onClick={() => setIsShareOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${product.name} - ${window.location.href}`)}`)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#25d366] text-white rounded-sm text-xs font-bold cursor-pointer hover:bg-[#20ba5a] transition-colors"
                      >
                        <WhatsAppIcon /> WhatsApp
                      </button>
                      <button
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#1877f2] text-white rounded-sm text-xs font-bold cursor-pointer hover:bg-[#166fe5] transition-colors"
                      >
                        <FacebookIcon /> Facebook
                      </button>
                      <button
                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-black text-white rounded-sm text-xs font-bold cursor-pointer hover:bg-gray-800 transition-colors"
                      >
                        <TwitterXIcon /> Twitter
                      </button>
                      <button
                        onClick={copyLink}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-800 rounded-sm text-xs font-bold cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Copy Link
                      </button>
                      <button
                        onClick={downloadImage}
                        className="flex items-center gap-1.5 px-3 py-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-sm text-xs font-bold cursor-pointer hover:bg-teal-100 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Save Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ════════════════════════════════════════
              RIGHT COLUMN — Product Info
          ════════════════════════════════════════ */}
          <div className="flex-1 space-y-3">

            {/* ── PRODUCT HEADER CARD ── */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 sm:p-5">

              {/* Brand */}
              <p className="text-sm text-gray-500 font-semibold mb-0.5">{product.brand || 'FCISeller'}</p>

              {/* Product name */}
              <h1 className="text-lg sm:text-xl font-normal text-gray-800 leading-snug mb-2">{product.name}</h1>

              {/* Rating + Assured */}
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-xs font-black px-2 py-0.5 rounded-sm">
                    {product.rating.toFixed(1)} <Star className="w-3 h-3 fill-current" />
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">
                    {product.reviewCount.toLocaleString()} Ratings &amp; {Math.max(product.reviewCount - 12, 8)} Reviews
                  </span>
                </div>
                {/* Flipkart Assured badge */}
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#2874f0] to-[#0062cc] text-white text-[10px] font-black px-2 py-0.5 rounded-sm italic tracking-tight">
                  <BadgeCheck className="w-3 h-3" /> Assured
                </span>
              </div>

              {/* ── PRICE BLOCK ── */}
              <div className="border-t border-b border-gray-100 py-3 mb-4">
                <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-base text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-base font-bold text-[#388e3c]">{discount}% off</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {product.taxPercent && product.taxPercent > 0 ? (
                    <span className="text-gray-500">
                      🏷️ GST @ {product.taxPercent}% ({product.taxType === 'INCLUSIVE' ? 'Inclusive' : `+ ₹${(product.price * product.taxPercent / 100).toFixed(0)}`})
                    </span>
                  ) : (
                    <span className="text-gray-400">Inclusive of all taxes</span>
                  )}
                  {product.hsnCode && (
                    <span className="text-gray-400 font-mono">HSN: {product.hsnCode}</span>
                  )}
                </div>
              </div>

              {/* ── AVAILABLE OFFERS ── */}
              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2.5">Available Offers</h3>
                <div className="space-y-2 text-xs text-gray-700">
                  {[
                    { label: 'Bank Offer', desc: '10% off on HDFC Bank Credit Cards, up to ₹1,500. Min. purchase ₹4,999.' },
                    { label: 'Bank Offer', desc: '5% Cashback on Flipkart Axis Bank Card. No min. transaction.' },
                    { label: 'Special Price', desc: `Get extra ₹1000 off (price inclusive of coupon/cashback).` },
                    { label: 'No Cost EMI', desc: 'No cost EMI on select cards for orders above ₹3,000.' },
                  ].map(({ label, desc }, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#388e3c] shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold">{label}:</strong> {desc}{' '}
                        <span className="text-[#2874f0] cursor-pointer hover:underline font-semibold">T&amp;C</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── COLOR SELECTOR ── */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-sm font-bold text-gray-900">Colour:</span>
                    <span className="text-sm text-gray-600 font-semibold capitalize">{selectedColor}</span>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {product.colors.map((c, i) => {
                      const hex = getColorCode(c);
                      const isSelected = selectedColor === c;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(c)}
                          title={c}
                          className="relative cursor-pointer"
                        >
                          <div
                            style={{ backgroundColor: hex }}
                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-105 ${
                              isSelected ? 'border-[#2874f0] ring-2 ring-[#2874f0]/30 ring-offset-1 scale-105' : 'border-gray-300'
                            }`}
                          />
                          {isSelected && (
                            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#2874f0] rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── SIZE SELECTOR ── */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">Size:</span>
                      {selectedSize && (
                        <span className="text-sm text-gray-600 font-semibold">{selectedSize}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-xs text-[#2874f0] font-bold hover:underline cursor-pointer flex items-center gap-0.5 border-none bg-transparent"
                    >
                      Size Chart <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-2.5 flex-wrap">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-12 h-12 border-2 rounded-sm text-sm font-bold cursor-pointer transition-all hover:border-[#2874f0] ${
                          selectedSize === sz
                            ? 'border-[#2874f0] text-[#2874f0] bg-[#2874f0]/5'
                            : 'border-gray-300 text-gray-700'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Size exchanges available within 7 days
                  </p>
                </div>
              )}

              {/* ── DELIVERY CHECKER ── */}
              <div className="border border-gray-200 rounded-sm p-3.5 mb-5 bg-gray-50/60">
                <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-gray-700">
                  <MapPin className="w-3.5 h-3.5 text-[#2874f0]" />
                  <span>Check Delivery</span>
                </div>
                <form onSubmit={checkPincode} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    className="flex-1 border border-gray-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-[#2874f0] rounded-sm"
                  />
                  <button
                    type="submit"
                    className="text-[#2874f0] font-bold text-xs px-2 cursor-pointer border-none bg-transparent hover:text-[#2874f0]/80"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <div className="mt-2 text-xs text-gray-700 font-semibold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#388e3c] shrink-0" />
                    <span>{pincodeStatus}</span>
                  </div>
                )}
              </div>

              {/* ── HIGHLIGHTS / DESCRIPTION ── */}
              <div className="mb-2">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Product Description</h3>
                <div className={`relative overflow-hidden transition-all ${descExpanded ? '' : 'max-h-20'}`}>
                  <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
                  {!descExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="mt-1 text-xs text-[#2874f0] font-bold hover:underline cursor-pointer flex items-center gap-0.5 border-none bg-transparent"
                >
                  {descExpanded ? (<><ChevronUp className="w-3 h-3" /> Show less</>) : (<><ChevronDown className="w-3 h-3" /> Read more</>)}
                </button>
              </div>

            </div>

            {/* ── SPECIFICATIONS CARD ── */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 sm:p-5">
              <h3 className="text-base font-bold text-gray-900 mb-4">Specifications</h3>
              <div className="divide-y divide-gray-100 text-sm">
                {visibleSpecs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-5 py-2.5">
                    <span className="col-span-2 text-gray-500 font-normal text-xs">{k}</span>
                    <span className="col-span-3 text-gray-800 font-semibold text-xs">{v}</span>
                  </div>
                ))}
              </div>
              {specEntries.length > 5 && (
                <button
                  onClick={() => setShowAllSpecs(!showAllSpecs)}
                  className="mt-3 text-xs text-[#2874f0] font-bold hover:underline cursor-pointer flex items-center gap-1 border-none bg-transparent"
                >
                  {showAllSpecs ? (<><ChevronUp className="w-3 h-3" /> Show less specs</>) : (<><ChevronDown className="w-3 h-3" /> View all {specEntries.length} specifications</>)}
                </button>
              )}
            </div>

            {/* ── RATINGS & REVIEWS CARD ── */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900">Ratings &amp; Reviews</h3>
                <button className="text-xs text-[#2874f0] font-bold hover:underline cursor-pointer border border-[#2874f0] px-3 py-1 rounded-sm hover:bg-[#2874f0]/5 transition-colors">
                  Rate Product
                </button>
              </div>

              {/* Summary */}
              <div className="flex gap-8 mb-6 items-center">
                <div className="text-center flex-shrink-0">
                  <p className="text-4xl font-black text-gray-900">{product.rating.toFixed(1)}</p>
                  <div className="flex justify-center gap-0.5 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? 'text-[#388e3c] fill-current' : 'text-gray-200 fill-current'}`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    {product.reviewCount.toLocaleString()} ratings
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {RATING_DIST.map(({ label, pct, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-gray-500 w-7 flex-shrink-0">{label}</span>
                      <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400 w-7 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-4">
                {(showAllReviews ? MOCK_REVIEWS : MOCK_REVIEWS.slice(0, 2)).map((review) => (
                  <div key={review.id} className="border-t border-gray-100 pt-4">
                    {/* Stars */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-0.5 text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm ${review.rating >= 4 ? 'bg-[#388e3c]' : review.rating === 3 ? 'bg-[#ff9800]' : 'bg-[#f44336]'}`}>
                        {review.rating} <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                      <span className="text-sm font-bold text-gray-800">{review.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="font-semibold text-gray-600">{review.user}</span>
                      {review.certified && (
                        <span className="flex items-center gap-0.5 text-[#388e3c] font-semibold">
                          <Check className="w-3 h-3" /> Certified Buyer
                        </span>
                      )}
                      <span>{review.date}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 cursor-pointer border-none bg-transparent">
                        <ThumbsUp className="w-3 h-3" /> {review.helpful} Helpful
                      </button>
                      <button className="text-[11px] text-gray-500 hover:text-gray-700 cursor-pointer border-none bg-transparent flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {MOCK_REVIEWS.length > 2 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-4 w-full py-2 border border-[#2874f0] text-[#2874f0] font-bold text-xs rounded-sm hover:bg-[#2874f0]/5 cursor-pointer transition-colors flex items-center justify-center gap-1"
                >
                  {showAllReviews ? (<><ChevronUp className="w-3 h-3" /> Show less</>) : (<>View all {MOCK_REVIEWS.length} reviews <ChevronDown className="w-3 h-3" /></>)}
                </button>
              )}
            </div>

            {/* ── QUESTIONS & ANSWERS ── */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 sm:p-5">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-400" /> Questions &amp; Answers
              </h3>
              <div className="space-y-4 text-sm">
                {[
                  { q: 'Is the colour same as shown in the pictures?', a: 'Yes, the colour is accurate. Minor variation possible due to screen settings.' },
                  { q: 'Does this product have a warranty?', a: 'This product comes with a 30-day manufacturing defect warranty from the date of purchase.' },
                  { q: 'What is the return policy?', a: '7-day easy return/exchange policy is available. Item must be unused and in original packaging.' },
                ].map(({ q, a }, i) => (
                  <div key={i} className="border-t border-gray-100 pt-3 first:border-t-0 first:pt-0">
                    <p className="font-semibold text-gray-800 mb-1 flex gap-2">
                      <span className="text-[#2874f0] font-black flex-shrink-0">Q.</span> {q}
                    </p>
                    <p className="text-gray-500 text-xs pl-5 flex gap-1.5">
                      <span className="text-[#388e3c] font-black flex-shrink-0">A.</span> {a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PAYMENT & EMI INFO ── */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 sm:p-5">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" /> Payment &amp; EMI Options
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                {['Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'EMI', 'COD'].map((method) => (
                  <div key={method} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-sm px-2.5 py-2 font-semibold">
                    <Check className="w-3 h-3 text-[#388e3c] shrink-0" /> {method}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ════════════════════════════════════════
            RELATED PRODUCTS SECTIONS
        ════════════════════════════════════════ */}
        {[
          { title: 'Frequently Bought Together', slice: [2, 6] },
          { title: 'Similar Products', slice: [1, 5] },
          { title: `More from ${product.brand || 'FCISeller'}`, slice: [4, 8] },
        ].map(({ title, slice }) => (
          <div key={title} className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">{title}</h2>
              <Link href="/products" className="text-xs text-[#2874f0] font-semibold hover:underline flex items-center gap-0.5">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {mockProducts.slice(slice[0], slice[1]).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ))}

      </div>

      {/* ════════════════════════════════════════
          SIZE CHART MODAL
      ════════════════════════════════════════ */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setIsSizeChartOpen(false)}>
          <div
            className="bg-white rounded-sm max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Size Chart</h3>
              <button onClick={() => setIsSizeChartOpen(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer border-none">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-3">All measurements are in inches (body dimensions).</p>
              <div className="border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-[#2874f0] text-white font-bold uppercase text-[10px]">
                    <tr>
                      {['Size', 'Chest', 'Waist', 'Hips', 'Length'].map((h) => (
                        <th key={h} className="p-2.5 text-center">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
                    {[
                      ['XS', '32–34', '26–28', '34–36', '26'],
                      ['S',  '34–36', '28–30', '36–38', '27'],
                      ['M',  '38–40', '32–34', '40–42', '27.5'],
                      ['L',  '42–44', '36–38', '44–46', '28'],
                      ['XL', '46–48', '40–42', '48–50', '28.5'],
                      ['2XL','50–52', '44–46', '52–54', '29'],
                    ].map(([sz, ...vals]) => (
                      <tr key={sz} className={`text-center ${selectedSize === sz ? 'bg-[#2874f0]/10 font-black' : 'hover:bg-gray-50'}`}>
                        <td className="p-2.5 font-bold text-[#2874f0]">{sz}</td>
                        {vals.map((v, i) => <td key={i} className="p-2.5">{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-sm p-3">
                <HelpCircle className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-yellow-700 font-medium">
                  If you&apos;re between sizes, we recommend sizing up for a comfortable fit.
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <Button
                onClick={() => setIsSizeChartOpen(false)}
                className="w-full bg-[#2874f0] hover:bg-[#2874f0]/90 text-white font-bold h-10 text-xs rounded-sm"
              >
                CLOSE
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fly-to-cart animation element */}
      {flyStyle && (
        <div style={flyStyle}>
          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <style>{`
        @keyframes flyToCart {
          0% { transform: scale(1); opacity: 1; }
          35% { transform: scale(1.15) translateY(-25px); }
          100% { left: calc(100vw - 80px); top: 20px; transform: scale(0.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
