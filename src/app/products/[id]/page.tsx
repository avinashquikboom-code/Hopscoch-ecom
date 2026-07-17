'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mock-data';
import { Heart, Share2, Star, ShieldCheck, ChevronRight, Tag, MapPin, Truck, HelpCircle, X, Check, MessageSquare, Download } from 'lucide-react';
import { useAddToCart, useAddToWishlist, useRemoveFromWishlist } from '@/hooks';
import { useWishlistStore } from '@/store';
import { toast } from '@/components/ui/toast';

// Custom inline SVG icons for social platforms
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.185-1.359a9.95 9.95 0 0 0 4.823 1.248h.004c5.507 0 9.99-4.478 9.99-9.986 0-2.67-1.037-5.178-2.923-7.065A9.914 9.914 0 0 0 12.012 2zm5.727 14.072c-.252.711-1.464 1.3-2.008 1.385-.494.079-1.139.145-3.327-.768-2.798-1.168-4.598-4.015-4.737-4.202-.139-.187-1.132-1.507-1.132-2.87 0-1.365.711-2.035.964-2.311.252-.276.554-.345.738-.345.185 0 .369.002.531.009.172.008.401-.065.626.478.227.545.776 1.896.843 2.032.067.137.112.296.021.479-.092.183-.139.297-.278.459-.139.162-.292.361-.417.484-.139.137-.285.287-.123.565.162.278.721 1.187 1.547 1.921.826.734 1.523.961 1.738 1.053.215.092.341.077.467-.069.126-.145.54-.627.685-.841.145-.214.29-.178.49-.103.2.075 1.272.6 1.493.711.222.112.369.168.425.263.056.095.056.549-.196 1.26z"/>
  </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.58.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.94-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 5.01 3.656 9.168 8.438 9.918v-7.017h-2.54v-2.9h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.87h2.78l-.445 2.9h-2.335v7.017C18.343 21.185 22 17.028 22 12.017 22 6.484 17.522 2 12 2z"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const product = mockProducts.find(p => p.id === unwrappedParams.id) || mockProducts[0];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [flyStyle, setFlyStyle] = useState<React.CSSProperties | null>(null);

  // Cats catwalk video state
  const [isPlayingCatwalk, setIsPlayingCatwalk] = useState(false);

  // Size chart modal state
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Zoom states
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });

  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    
    setFlyStyle({
      left: `${x}px`,
      top: `${y}px`,
      position: 'fixed',
      zIndex: 9999,
      pointerEvents: 'none',
      width: '40px',
      height: '55px',
      borderRadius: '4px',
      overflow: 'hidden',
      border: '2px solid #0d9488',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      animation: 'flyToCart 0.8s cubic-bezier(0.2, 0.6, 0.4, 1) forwards',
    });

    addToCartMutation.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          toast.success('Added to Cart successfully!');
          setTimeout(() => setFlyStyle(null), 800);
        }
      }
    );
  };

  const handleBuyNow = () => {
    addToCartMutation.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          router.push('/checkout');
        },
      }
    );
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(product.id);
      toast.success('Removed from Wishlist');
    } else {
      addToWishlistMutation.mutate(product.id);
      toast.success('Added to Wishlist');
    }
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pincode)) {
      setPincodeStatus('Delivery by Tuesday, July 7 | Free shipping');
    } else {
      setPincodeStatus('Invalid Pincode. Please enter 6 digits.');
    }
  };

  // Image Hover Zoom Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${product.images[selectedImage]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '220%',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Meesho inspired image asset downloader
  const downloadProductImage = () => {
    const link = document.createElement('a');
    link.href = product.images[selectedImage];
    link.download = `${product.name.replace(/\s+/g, '_')}_aura.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Product image asset downloaded!');
  };

  const copyProductLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Copied product page link to clipboard!');
  };

  const getSpecs = (id: string) => {
    switch (id) {
      case '1':
        return {
          "Material": "100% Organic Raw Indigo Denim",
          "Fit": "Relaxed Tailored Fit",
          "Style Code": "AC-DENIM-09",
          "Occasion": "Casual",
          "Fabric Care": "Dry Clean Recommended"
        };
      case '2':
        return {
          "Material": "Mulberry Silk Blend",
          "Fit": "Fluid biases cut",
          "Style Code": "AC-SILK-02",
          "Occasion": "Evening Wear",
          "Fabric Care": "Hand wash cold gentle"
        };
      case '3':
        return {
          "Material": "Organic Cotton & Linen",
          "Fit": "Relaxed Summer Fit",
          "Style Code": "AC-LINEN-04",
          "Occasion": "Resort / Casual",
          "Fabric Care": "Machine Wash Warm"
        };
      case '4':
        return {
          "Material": "Stretch Cashmere Knit",
          "Fit": "Body-hugging Mockneck",
          "Style Code": "AC-KNP-18",
          "Occasion": "Winter Lounge",
          "Fabric Care": "Wool detergents only"
        };
      default:
        return {
          "Material": "Premium Cotton Blend",
          "Fit": "Regular Comfort Fit",
          "Style Code": "AC-GEN-01",
          "Occasion": "Everyday wear",
          "Fabric Care": "Gentle Machine Wash"
        };
    }
  };

  const specsList = getSpecs(product.id);

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50 pb-16 font-sans transition-colors duration-300">
      
      {/* Container */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-12 py-3">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-neutral-450 dark:text-neutral-500 mb-3.5">
          <Link href="/" className="hover:text-[#0d9488]">Home</Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <Link href="/products" className="hover:text-[#0d9488]">Clothing</Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-850 dark:text-neutral-100 truncate font-semibold">{product.name}</span>
        </div>
 
        {/* Core Layout Split */}
        <div className="flex flex-col lg:flex-row gap-3.5 items-stretch">
          
          {/* LEFT COLUMN: Sticky Image Gallery & Action Buttons */}
          <div className="w-full lg:w-[42%] bg-white dark:bg-zinc-900 p-5 border border-neutral-100 dark:border-neutral-850/80 rounded-2xl flex flex-col h-fit lg:sticky lg:top-[80px]">
            
            {/* Gallery Viewer with Hover Zoom or CATWALK Video */}
            <div className="relative w-full aspect-[4/5] bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 rounded-xl flex items-center justify-center overflow-hidden z-10">
              {isPlayingCatwalk ? (
                <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
                  {/* Catwalk video preview container */}
                  <div className="w-full h-full relative flex items-center justify-center">
                    <img 
                      src={product.images[0]} 
                      className="w-full h-full object-cover opacity-75 blur-xs" 
                      alt="catwalk" 
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/60 p-4">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping mb-2" />
                      <p className="text-xs uppercase font-black tracking-widest text-[#0d9488]">Couture Catwalk Active</p>
                      <p className="text-[10px] text-gray-300 mt-1 max-w-[200px] leading-relaxed">Model height 178cm | Wear Size S</p>
                      <button 
                        onClick={() => setIsPlayingCatwalk(false)} 
                        className="mt-6 px-4.5 py-1.5 bg-white text-black font-bold text-xs rounded-sm hover:bg-gray-100"
                      >
                        BACK TO GALLERY
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-full h-full relative cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Magnifying glass overlay box */}
                  <div 
                    style={zoomStyle}
                    className="absolute inset-0 pointer-events-none border border-gray-200 bg-no-repeat shadow-inner transition-all"
                  />
                </div>
              )}

              {/* Wishlist Toggle Overlay */}
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md border border-gray-100 text-gray-400 hover:text-red-500 transition-all cursor-pointer z-20
                  ${isInWishlist ? 'text-red-500 bg-white border-red-100 fill-red-500' : ''}`}
                title="Add to Wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-2.5 mt-3 justify-center items-center flex-wrap">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedImage(idx); setIsPlayingCatwalk(false); }}
                  className={`w-14 h-16 border rounded-sm overflow-hidden bg-gray-50 cursor-pointer ${
                    selectedImage === idx && !isPlayingCatwalk ? 'border-[#0d9488] ring-1 ring-[#0d9488]' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover object-top" />
                </button>
              ))}

              {/* Catwalk Catwalk Video Thumbnail */}
              <button
                onClick={() => setIsPlayingCatwalk(true)}
                className={`w-14 h-16 border rounded-sm bg-gray-900 text-white font-bold flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isPlayingCatwalk ? 'border-[#0d9488] ring-1 ring-[#0d9488]' : 'border-gray-200 hover:bg-gray-800'
                }`}
                title="Play Catwalk Catwalk Video"
              >
                <span className="text-[8px] font-black tracking-widest text-[#0d9488] animate-pulse">WALK</span>
                <span className="text-[10px] mt-0.5">🎥</span>
              </button>
            </div>

            {/* Action Buttons: Add To Cart & Buy Now */}
            <div className="grid grid-cols-2 gap-3.5 mt-6">
              <Button
                onClick={(e) => handleAddToCart(e)}
                disabled={addToCartMutation.isPending || product.stock === 0}
                className="bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold h-13 rounded-sm border-none shadow-sm uppercase tracking-wider text-sm cursor-pointer"
              >
                {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
              
              <Button
                onClick={handleBuyNow}
                disabled={addToCartMutation.isPending || product.stock === 0}
                className="bg-[#ff9f00] hover:bg-[#ff9f00]/95 text-white font-bold h-13 rounded-sm border-none shadow-sm uppercase tracking-wider text-sm cursor-pointer"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
              </Button>
            </div>

          </div>

          {/* RIGHT COLUMN: Scrollable product information */}
          <div className="flex-1 bg-white p-5 border border-gray-200 rounded-sm">
            
            {/* Brand Title */}
            <h2 className="text-base sm:text-lg font-bold text-gray-400 tracking-wide mb-1 uppercase">
              {product.brand || 'Aura Couture'}
            </h2>
            
            {/* Product Title Name */}
            <h1 className="text-lg sm:text-xl font-normal text-gray-800 leading-snug mb-2">
              {product.name}
            </h1>

            {/* Ratings & reviews block */}
            <div className="flex items-center gap-2 mb-3.5">
              <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[11px] font-black px-1.5 py-0.5 rounded-sm">
                {product.rating.toFixed(1)} <Star className="w-2.5 h-2.5 fill-current" />
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                {product.reviewCount} Ratings & {product.reviewCount - 2 || 8} Reviews
              </span>
              
              {/* Flipkart Assured badge logo */}
              <span className="inline-flex items-center text-[9px] font-black tracking-tighter bg-gradient-to-r from-teal-600 to-[#0d9488] text-white px-1.5 py-0.5 rounded-sm italic ml-1">
                Assured <span className="text-yellow-400 ml-0.5">★</span>
              </span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-2.5 border-b border-gray-100 pb-4 mb-4 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-gray-400 line-through">₹{product.originalPrice}</span>
                  <span className="text-base font-bold text-[#0d9488]">
                    {discount}% Off
                  </span>
                </>
              )}
            </div>

            {/* Available Colors */}
            <div className="mb-5">
              <span className="text-xs font-bold text-gray-700 uppercase block mb-2">Available Colors</span>
              <div className="flex gap-2">
                {['#0d9488', '#374151', '#9ca3af', '#d1d5db'].map((c, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: c }}
                    className="w-7 h-7 rounded-full border border-gray-300 shadow-xs cursor-pointer hover:scale-105 transition-transform"
                    title={`Color option ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-baseline max-w-xs mb-2">
                <h3 className="text-xs font-bold text-gray-700 uppercase">Select Size</h3>
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-xs text-[#0d9488] font-bold hover:underline cursor-pointer border-none bg-transparent"
                >
                  Size Chart
                </button>
              </div>
              <div className="flex gap-2.5">
                {['S', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-10 h-10 border rounded-full text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${
                      selectedSize === sz
                        ? 'border-[#0d9488] bg-[#0d9488]/5 text-[#0d9488] font-black'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="border border-gray-200 rounded-sm p-4 mb-6 bg-gray-50/50 max-w-sm">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-700 uppercase">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>Delivery Checker</span>
              </div>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 px-3 py-1.5 text-xs focus:outline-none focus:border-[#0d9488] rounded-sm"
                />
                <button
                  type="submit"
                  className="bg-transparent text-[#0d9488] hover:text-[#0d9488]/80 text-xs font-bold px-3 cursor-pointer border-none"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <div className="mt-2 text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#388e3c]" />
                  <span>{pincodeStatus}</span>
                </div>
              )}
            </div>

            {/* Meesho-Style Social Share sheet */}
            <div className="border border-gray-250/60 rounded-sm p-4.5 mb-6 bg-[#f0f9f8]/60">
              <h3 className="text-xs font-black uppercase text-gray-700 tracking-wider mb-3.5 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-[#0d9488]" />
                <span>Share this design & earn margin</span>
              </h3>
              <div className="flex flex-wrap gap-2.5">
                
                {/* WhatsApp */}
                <button 
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this premium Aura Couture outfit: ${product.name} at ${window.location.href}`)}`)}
                  className="px-3.5 py-1.5 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer border-none"
                >
                  <WhatsAppIcon />
                  <span>WhatsApp</span>
                </button>

                {/* Telegram */}
                <button 
                  onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`)}
                  className="px-3.5 py-1.5 bg-[#0088cc] hover:bg-[#007ab8] text-white rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer border-none"
                >
                  <TelegramIcon />
                  <span>Telegram</span>
                </button>

                {/* Facebook */}
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                  className="px-3.5 py-1.5 bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer border-none"
                >
                  <FacebookIcon />
                  <span>Facebook</span>
                </button>

                {/* Copy Link */}
                <button 
                  onClick={copyProductLink}
                  className="px-3.5 py-1.5 bg-gray-150 hover:bg-gray-200 text-gray-800 rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer border-none"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>

                {/* Image Downloader asset */}
                <button 
                  onClick={downloadProductImage}
                  className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#0d9488] rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-xs border border-teal-200/50 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Assets</span>
                </button>

              </div>
              <p className="text-[10px] text-gray-400 mt-2 font-normal">Meesho Margin Sharing: Copy assets & download photos to share on your catalog lists.</p>
            </div>

            {/* Bank Offers Section */}
            <div className="mb-6 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Available Offers</h3>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex items-start gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#388e3c] shrink-0 mt-0.5" />
                  <span><strong className="font-bold">Bank Offer:</strong> 10% Instant Discount on HDFC Credit Cards, up to ₹1,500 on minimum purchase of ₹4,999. <span className="text-[#0d9488] cursor-pointer hover:underline">T&C</span></span>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#388e3c] shrink-0 mt-0.5" />
                  <span><strong className="font-bold">Bank Offer:</strong> 5% Cashback on Flipkart Axis Bank Card. <span className="text-[#0d9488] cursor-pointer hover:underline">T&C</span></span>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#388e3c] shrink-0 mt-0.5" />
                  <span><strong className="font-bold">Special Price:</strong> Get extra ₹1000 off (price inclusive of coupon/cashbacks). <span className="text-[#0d9488] cursor-pointer hover:underline">T&C</span></span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-4 mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Product Description</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Specifications Table Grid */}
            <div className="border-t border-gray-100 pt-4 mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Specifications</h3>
              <div className="border border-gray-200 rounded-sm overflow-hidden divide-y divide-gray-150 text-xs">
                {Object.entries(specsList).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 p-3 bg-white">
                    <span className="font-bold text-gray-400 uppercase tracking-wide text-[10px]">{k}</span>
                    <span className="col-span-2 text-gray-800 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ratings Breakdown and Reviews chart */}
            <div className="border-t border-gray-100 pt-4 mb-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Ratings & Reviews Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center">
                  <h4 className="text-3xl font-black text-gray-900">{product.rating.toFixed(1)}</h4>
                  <div className="flex justify-center gap-0.5 my-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{product.reviewCount} Ratings</p>
                </div>
                
                {/* Horizontal progress bars */}
                <div className="col-span-2 space-y-1.5 text-[10px] font-bold text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-3">5★</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#388e3c] h-full rounded-full" style={{ width: '75%' }} />
                    </div>
                    <span className="w-8 text-right text-gray-400">75%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3">4★</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#388e3c] h-full rounded-full" style={{ width: '15%' }} />
                    </div>
                    <span className="w-8 text-right text-gray-400">15%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3">3★</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#388e3c] h-full rounded-full" style={{ width: '5%' }} />
                    </div>
                    <span className="w-8 text-right text-gray-400">5%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3">2★</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '3%' }} />
                    </div>
                    <span className="w-8 text-right text-gray-400">3%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3">1★</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: '2%' }} />
                    </div>
                    <span className="w-8 text-right text-gray-400">2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions & Answers Section */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3.5 flex items-center gap-1">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>Customer Questions & Answers</span>
              </h3>
              <div className="space-y-3.5 text-xs text-gray-700">
                <div>
                  <p className="font-bold text-gray-800">Q: Is the color fading after washing?</p>
                  <p className="text-gray-500 mt-1 pl-4 flex items-start gap-1">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    <span>A: No, raw indigo denim retains its texture. We recommend cold hand washing or dry cleaning.</span>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-800">Q: What size does the model wear in the video?</p>
                  <p className="text-gray-500 mt-1 pl-4 flex items-start gap-1">
                    <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                    <span>A: The model is 178cm tall and is wearing size S.</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 1. Frequently Bought Together */}
        <div className="mt-12 bg-white border border-gray-200 rounded-sm p-5 shadow-xs">
          <h2 className="text-base font-black uppercase text-gray-900 tracking-wider mb-4">Frequently Bought Together</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockProducts.slice(2, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* 2. Similar Products Recomendations */}
        <div className="mt-8">
          <h2 className="text-base font-black uppercase text-gray-900 tracking-wider mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockProducts.slice(1, 5).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* 3. More From Same Brand */}
        <div className="mt-8">
          <h2 className="text-base font-black uppercase text-gray-900 tracking-wider mb-4">More from {product.brand || 'Aura Couture'}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockProducts.slice(4, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>

      {/* SIZE CHART MODAL OVERLAY */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-lg w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors border-none"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-black uppercase tracking-wider text-gray-900 mb-1">Size Reference Guide</h3>
            <p className="text-xs text-gray-500 mb-4">Measurements correspond to body dimensions in inches.</p>
            
            <div className="border border-gray-200 rounded-sm overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-gray-150">
                <thead className="bg-gray-50 font-bold uppercase text-[10px] text-gray-400">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest (in)</th>
                    <th className="p-3">Waist (in)</th>
                    <th className="p-3">Hips (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 font-semibold text-gray-800">
                  <tr>
                    <td className="p-3 bg-gray-50 font-bold">S</td>
                    <td className="p-3">34 - 36</td>
                    <td className="p-3">28 - 30</td>
                    <td className="p-3">36 - 38</td>
                  </tr>
                  <tr>
                    <td className="p-3 bg-gray-50 font-bold">M</td>
                    <td className="p-3">38 - 40</td>
                    <td className="p-3">32 - 34</td>
                    <td className="p-3">40 - 42</td>
                  </tr>
                  <tr>
                    <td className="p-3 bg-gray-50 font-bold">L</td>
                    <td className="p-3">42 - 44</td>
                    <td className="p-3">36 - 38</td>
                    <td className="p-3">44 - 46</td>
                  </tr>
                  <tr>
                    <td className="p-3 bg-gray-50 font-bold">XL</td>
                    <td className="p-3">46 - 48</td>
                    <td className="p-3">40 - 42</td>
                    <td className="p-3">48 - 50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <Button 
              onClick={() => setIsSizeChartOpen(false)}
              className="mt-5 w-full bg-[#0d9488] hover:bg-[#0d9488]/95 text-white font-bold h-10 text-xs rounded-sm border-none uppercase"
            >
              CLOSE GUIDE
            </Button>
          </div>
        </div>
      )}

      {flyStyle && (
        <div style={flyStyle}>
          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <style>{`
        @keyframes flyToCart {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          30% {
            transform: scale(1.1) translateY(-20px);
          }
          100% {
            left: calc(100vw - 80px);
            top: 25px;
            transform: scale(0.15);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
