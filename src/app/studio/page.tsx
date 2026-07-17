'use client';
import { useProducts } from '@/hooks/use-products';


import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Play, Sparkles, TrendingUp, Camera, Palette, Eye } from 'lucide-react';

// ── Editorial Drops ────────────────────────────────────────────────────────
const DROPS = [
  {
    id: 'drop-1',
    season: 'SS 2026',
    title: 'The Quiet Luxury Edit',
    subtitle: 'Understated. Refined. Timeless.',
    description: 'A collection that speaks in whispers — where every silhouette is considered, every fabric irreplaceable.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80',
    tag: 'Lookbook',
    color: '#0F766E',
    link: '/products?category=Collections',
  },
  {
    id: 'drop-2',
    season: 'AW 2026',
    title: 'Dark Romantics',
    subtitle: 'Power. Drama. Depth.',
    description: 'Bold silhouettes meet moody textures in this autumn statement collection.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80',
    tag: 'Campaign',
    color: '#1e293b',
    link: '/products?category=Women',
  },
  {
    id: 'drop-3',
    season: 'Resort 2026',
    title: 'Sun-Soaked Minimalism',
    subtitle: 'Warmth. Flow. Ease.',
    description: 'Linen, cotton, and silk in sun-bleached palettes for the modern wanderer.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    tag: 'Editorial',
    color: '#78350f',
    link: '/products?category=Women',
  },
];

// ── Style Guides ───────────────────────────────────────────────────────────
const STYLE_GUIDES = [
  { title: 'How to Layer Like a Pro', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=80', readTime: '4 min read', tag: 'Men' },
  { title: 'The Perfect Work-to-Weekend Wardrobe', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80', readTime: '6 min read', tag: 'Women' },
  { title: 'Accessorizing the Minimalist Way', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80', readTime: '3 min read', tag: 'Accessories' },
  { title: 'Building a Capsule Wardrobe in 2026', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&auto=format&fit=crop&q=80', readTime: '8 min read', tag: 'Lifestyle' },
];

// ── Behind the Scenes ─────────────────────────────────────────────────────
const BTS_SHOTS = [
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&auto=format&fit=crop&q=80',
];

// Featured Studio products (first 6 from mock)
export default function StudioPage() {
  const { data: productsData } = useProducts();
  const mockProducts = productsData?.data || [];
  const studioProducts = mockProducts.slice(0, 6);

  const router = useRouter();
  const [activeDrop, setActiveDrop] = useState(0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">

      {/* ── HERO: Full-width editorial drop viewer ───────────────────────── */}
      <section className="relative w-full h-[92vh] min-h-[600px] overflow-hidden bg-gray-950">

        {/* Background image */}
        <Image
          src={DROPS[activeDrop].image}
          alt={DROPS[activeDrop].title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-all duration-700 ease-in-out"
          style={{ filter: 'brightness(0.55)' }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Header label */}
        <div className="absolute top-8 left-8 sm:left-16 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#14B8A6]" />
          <span className="text-[11px] font-bold tracking-[0.3em] text-white/80 uppercase">FCI SELLER STUDIO</span>
        </div>

        {/* Main copy */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 max-w-3xl">
          <span className="inline-flex items-center gap-2 mb-4">
            <span className="h-[1px] w-10 bg-[#14B8A6]" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#14B8A6] uppercase">{DROPS[activeDrop].season} — {DROPS[activeDrop].tag}</span>
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-5" style={{ fontFamily: 'serif' }}>
            {DROPS[activeDrop].title}
          </h1>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-2 font-medium tracking-wide">
            {DROPS[activeDrop].subtitle}
          </p>
          <p className="text-sm text-white/50 max-w-sm leading-relaxed mb-8 hidden sm:block">
            {DROPS[activeDrop].description}
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={DROPS[activeDrop].link}
              className="inline-flex items-center gap-2 h-11 px-6 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs tracking-wider rounded-xl transition-colors"
            >
              Shop the Edit <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="inline-flex items-center gap-2 h-11 px-5 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold text-xs tracking-wider rounded-xl transition-colors">
              <Play className="w-3.5 h-3.5 fill-white" /> Watch Film
            </button>
          </div>
        </div>

        {/* Drop selector — bottom right */}
        <div className="absolute bottom-8 right-8 sm:right-16 flex flex-col gap-3">
          {DROPS.map((drop, i) => (
            <button
              key={drop.id}
              onClick={() => setActiveDrop(i)}
              className={`flex items-center gap-3 group transition-all duration-300 ${i === activeDrop ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            >
              <div className={`w-12 h-8 rounded-sm overflow-hidden relative transition-all ${i === activeDrop ? 'ring-2 ring-[#14B8A6]' : ''}`}>
                <Image src={drop.image} alt={drop.title} fill sizes="48px" className="object-cover" />
              </div>
              {i === activeDrop && (
                <span className="text-[10px] font-bold text-white/80 tracking-wider hidden sm:block">{drop.season}</span>
              )}
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[9px] font-bold tracking-[0.3em] text-white uppercase">Scroll</span>
          <div className="w-[1px] h-10 bg-white/50 animate-pulse" />
        </div>
      </section>

      {/* ── STUDIO PICKS ─────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#0F766E]" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#0F766E] uppercase">Curated Selection</span>
            </div>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight" style={{ fontFamily: 'serif' }}>
              Studio Picks
            </h2>
            <p className="text-sm text-[#64748B] mt-1">Hand-selected by our creative directors</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#0F766E] hover:underline tracking-wider uppercase">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {studioProducts.map((product, i) => (
            <div
              key={product.id}
              onClick={() => router.push(`/products/${product.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-2xl mb-3">
                <Image
                  src={product.images?.[0] || ''}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
                />
                {i === 0 && (
                  <div className="absolute top-3 left-3 bg-[#0F766E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                    Editors Pick
                  </div>
                )}
              </div>
              <p className="text-[10px] font-bold text-[#0F766E] uppercase tracking-widest">{product.brand || 'AURA'}</p>
              <p className="text-xs font-semibold text-[#0F172A] line-clamp-1 mt-0.5">{product.name}</p>
              <p className="text-xs text-[#64748B] mt-0.5">₹{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EDITORIAL DROPS GRID ─────────────────────────────────────────── */}
      <section className="bg-[#0F172A] py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#14B8A6] uppercase">Collections</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2" style={{ fontFamily: 'serif' }}>
              The Seasonal Drops
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DROPS.map((drop, i) => (
              <Link key={drop.id} href={drop.link} className="group relative overflow-hidden rounded-2xl aspect-[3/4] block">
                <Image src={drop.image} alt={drop.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-[#14B8A6] uppercase mb-2">{drop.season} · {drop.tag}</span>
                  <h3 className="text-xl font-black text-white leading-tight mb-1" style={{ fontFamily: 'serif' }}>{drop.title}</h3>
                  <p className="text-xs text-white/60 mb-4">{drop.subtitle}</p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white group-hover:text-[#14B8A6] transition-colors uppercase tracking-wider">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STYLE GUIDE ──────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-[#0F766E]" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#0F766E] uppercase">From the Editors</span>
            </div>
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight" style={{ fontFamily: 'serif' }}>
              Style Guides
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STYLE_GUIDES.map((guide, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-4">
                <Image src={guide.image} alt={guide.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#0F172A] text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">{guide.tag}</span>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium">{guide.readTime}</p>
              <h3 className="text-sm font-bold text-[#0F172A] leading-snug mt-1 group-hover:text-[#0F766E] transition-colors">{guide.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ── BEHIND THE SCENES ─────────────────────────────────────────────── */}
      <section className="bg-[#F0FDFA] py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-[#0F766E]" />
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#0F766E] uppercase">Backstage</span>
              </div>
              <h2 className="text-3xl font-black text-[#0F172A] tracking-tight" style={{ fontFamily: 'serif' }}>
                Behind the Scenes
              </h2>
            </div>
          </div>

          {/* Masonry-style photo grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {BTS_SHOTS.map((url, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl group ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
              >
                <Image src={url} alt={`Behind the scenes ${i + 1}`} fill sizes="(max-width: 640px) 33vw, 16vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING INSIGHTS ─────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#0F766E]" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#0F766E] uppercase">Trend Report</span>
            </div>
            <h2 className="text-4xl font-black text-[#0F172A] leading-tight tracking-tight mb-6" style={{ fontFamily: 'serif' }}>
              What's defining<br /> style in 2026
            </h2>
            <div className="space-y-5">
              {[
                { num: '01', title: 'Quiet Luxury', desc: 'Logo-free, quality-led dressing that communicates confidence through restraint.' },
                { num: '02', title: 'Fluid Silhouettes', desc: 'Relaxed cuts that move with the body — structure through cut, not rigidity.' },
                { num: '03', title: 'Earth Tones', desc: 'Sand, clay, slate, and warm ivory dominate the palette this season.' },
              ].map((trend) => (
                <div key={trend.num} className="flex gap-5 items-start">
                  <span className="text-[11px] font-black text-[#0F766E] tracking-widest pt-0.5">{trend.num}</span>
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{trend.title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{trend.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 h-11 px-6 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs tracking-wider rounded-xl transition-colors"
            >
              Shop the Trend <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-[3/4] w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80"
              alt="Trend Report"
              fill
              sizes="(max-width: 1024px) 80vw, 400px"
              className="object-cover rounded-3xl"
            />
            <div className="absolute -bottom-4 -left-4 bg-white border border-[#E2E8F0] rounded-2xl px-4 py-3 shadow-lg">
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Top Pick</p>
              <p className="text-sm font-bold text-[#0F172A]">Sand Linen Co-ord</p>
              <p className="text-xs text-[#0F766E] font-semibold">₹2,499</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="bg-[#0F172A] py-16">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <Sparkles className="w-6 h-6 text-[#14B8A6] mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white tracking-tight mb-3" style={{ fontFamily: 'serif' }}>
            Join the Studio Circle
          </h2>
          <p className="text-sm text-white/60 mb-8 leading-relaxed max-w-md mx-auto">
            Get early access to drops, editorial content, and exclusive styling tips from our creative team — directly in your inbox.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-11 px-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 text-sm outline-none focus:border-[#14B8A6] transition-colors"
            />
            <button className="h-11 px-5 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs tracking-wider rounded-xl transition-colors flex-shrink-0">
              Subscribe
            </button>
          </div>
          <p className="text-[10px] text-white/30 mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

    </div>
  );
}
