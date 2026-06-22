'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mock-data';
import { Heart, Share2, Truck, Shield, RotateCw, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Price } from '@/components/common/Price';
import { useAddToCart, useAddToWishlist, useRemoveFromWishlist } from '@/hooks';
import { useWishlistStore } from '@/store';
import { toast } from 'sonner';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const product = mockProducts.find(p => p.id === unwrappedParams.id) || mockProducts[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Blue');
  const [quantity, setQuantity] = useState(1);

  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleAddToCart = () => {
    addToCartMutation.mutate({ productId: product.id, quantity });
  };

  const handleBuyNow = () => {
    addToCartMutation.mutate(
      { productId: product.id, quantity },
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
    } else {
      addToWishlistMutation.mutate(product.id);
    }
  };

  // Helper to fetch details based on product ID
  const getProductSpecs = (id: string) => {
    switch (id) {
      case '1':
        return {
          "Material": "100% Organic Cotton Raw Indigo Denim",
          "Fit": "Relaxed editorial silhouette",
          "Details": "Custom copper buttons, double-needle stitching",
          "Care Instructions": "Turn inside out, cold gentle wash or dry clean",
          "Country of Origin": "Okayama, Japan"
        };
      case '2':
        return {
          "Material": "Pebble grain calf leather, suede lining",
          "Dimensions": "35cm x 28cm x 15cm",
          "Hardware": "24k gold-plated brass closures",
          "Pockets": "1 main compartment, 1 interior zip pocket, key clip",
          "Country of Origin": "Florence, Italy"
        };
      case '3':
        return {
          "Construction": "Grade 5 Titanium band, ceramic shield front",
          "Screen Size": "6.7\" Super Retina XDR OLED, 120Hz",
          "Processor": "A17 Pro high-performance chip",
          "Camera": "Pro triple-lens array (48MP Main, 12MP Ultra-wide, 12MP Telephoto)",
          "Warranty": "1-Year International Warranty"
        };
      case '4':
        return {
          "Upper": "Primeknit breathable mesh",
          "Cushioning": "Responsive foam midsole",
          "Outsole": "Continental™ rubber high-grip outsole",
          "Weight": "260g (Size 9)",
          "Recommended Use": "Long-distance running / High-performance training"
        };
      case '5':
        return {
          "Frame": "Solid European White Oak",
          "Upholstery": "Woven bouclé fabric (80% cotton, 20% linen)",
          "Dimensions": "W 78cm x D 82cm x H 75cm (Seat H 40cm)",
          "Assembly": "Fully assembled",
          "Care Instructions": "Professional upholstery cleaning recommended"
        };
      case '6':
        return {
          "Active Ingredients": "15% Vitamin C, 2% Hyaluronic Acid, Organic Rosehip Oil",
          "Skin Type": "Suitable for all skin types, including sensitive skin",
          "Texture": "Lightweight, fast-absorbing botanical oil-gel",
          "Formulation": "100% vegan, cruelty-free, paraben-free",
          "Volume": "50ml / 1.7 fl. oz."
        };
      case '7':
        return {
          "Case Diameter": "42mm Surgical-grade 316L Stainless Steel",
          "Movement": "Japanese quartz chronograph movement",
          "Strap": "20mm Italian vegetable-tanned leather",
          "Water Resistance": "5 ATM (50 meters / 165 feet)",
          "Dial Finish": "Sunray brushed finish with sapphire crystal lens"
        };
      case '8':
        return {
          "Fabric": "100% 19-momme Mulberry silk (sand-washed finish)",
          "Silhouette": "Bias-cut for a fluid, body-skimming drape",
          "Features": "Cowl neck, adjustable spaghetti straps, midi length",
          "Care Instructions": "Hand wash cold with silk detergent, lay flat to dry",
          "Country of Origin": "Florence, Italy"
        };
      default:
        return {
          "Material": "Premium materials",
          "Care": "Refer to label",
          "Origin": "Imported"
        };
    }
  };

  const getProductReviews = (id: string) => {
    switch (id) {
      case '1':
        return [
          { name: "Johnathan C.", rating: 5, date: "3 days ago", comment: "Stunning construction. The raw denim is stiff at first but breaks in beautifully. True heirloom piece." },
          { name: "Melissa R.", rating: 4, date: "1 week ago", comment: "Excellent silhouette. The fit is slightly oversized, perfect for layering." }
        ];
      case '2':
        return [
          { name: "Clara V.", rating: 5, date: "2 days ago", comment: "Absolute perfection. The leather is heavy and premium, and the gold hardware looks elegant." },
          { name: "Sophia D.", rating: 5, date: "5 days ago", comment: "Perfect daily companion. Fits my laptop and essentials without looking bulky." }
        ];
      case '3':
        return [
          { name: "Marcus L.", rating: 5, date: "1 day ago", comment: "Incredible speed and screen. The titanium weight reduction is very noticeable compared to previous models." },
          { name: "Arjun M.", rating: 4, date: "4 days ago", comment: "Camera quality is amazing. Battery easily lasts more than a full day." }
        ];
      case '4':
        return [
          { name: "David K.", rating: 5, date: "3 days ago", comment: "Best running shoes I've ever owned. Very bouncy." },
          { name: "Sarah H.", rating: 4, date: "2 weeks ago", comment: "Comfortable and light. Knit upper is very breathable." }
        ];
      case '5':
        return [
          { name: "Arthur P.", rating: 5, date: "2 days ago", comment: "A work of art. The oak frame is beautiful, and the bouclé fabric is soft yet durable." },
          { name: "Elena K.", rating: 5, date: "1 week ago", comment: "Very comfortable and fits the minimal living room perfectly." }
        ];
      case '6':
        return [
          { name: "Natalie S.", rating: 5, date: "2 days ago", comment: "Changed my skin texture in two weeks. Glow is unreal!" },
          { name: "Chloe L.", rating: 5, date: "5 days ago", comment: "Super hydrating, lightweight, and doesn't break me out." }
        ];
      case '7':
        return [
          { name: "Robert B.", rating: 5, date: "3 days ago", comment: "Looks much more expensive than it is. The dial catches light beautifully." },
          { name: "Vikram S.", rating: 4, date: "1 week ago", comment: "Sturdy leather strap, holds time perfectly." }
        ];
      case '8':
        return [
          { name: "Isabella T.", rating: 5, date: "2 days ago", comment: "The sand-washed silk feels like butter. Drapes beautifully and fits perfectly." },
          { name: "Amelie G.", rating: 5, date: "6 days ago", comment: "Gorgeous cowl neck. Color has a rich, deep sheen." }
        ];
      default:
        return [
          { name: "AURA Customer", rating: 5, date: "2 days ago", comment: "Exceptional quality and finish. Highly recommend." }
        ];
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Blue', 'Pink', 'Red', 'Green', 'Yellow', 'White'];
  const images = product.images || [product.images[0]];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground border-transparent">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <Price value={product.price} size="lg" />
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Color: {selectedColor}</h3>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-colors ${selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300'
                      }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Size: {selectedSize}</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${selectedSize === size
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button className="text-sm text-primary mt-2 hover:underline font-medium">
                Size Guide
              </button>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary/[0.04] hover:text-primary h-12 font-semibold uppercase tracking-wider text-xs"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground h-12 font-semibold uppercase tracking-wider text-xs"
                onClick={handleBuyNow}
                disabled={addToCartMutation.isPending}
              >
                {addToCartMutation.isPending ? 'Processing...' : 'Buy Now'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                onClick={handleWishlistToggle}
                disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard');
                }
              }}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/40">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCw className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="flex border-b border-border bg-transparent p-0 gap-8 rounded-none justify-start w-full mb-8">
            <TabsTrigger 
              value="description"
              className="font-sans font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase pb-4 rounded-none bg-transparent hover:text-primary transition-all text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none border-b-2 border-transparent"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="specifications"
              className="font-sans font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase pb-4 rounded-none bg-transparent hover:text-primary transition-all text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none border-b-2 border-transparent"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="font-sans font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase pb-4 rounded-none bg-transparent hover:text-primary transition-all text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none border-b-2 border-transparent"
            >
              Reviews ({product.reviewCount})
            </TabsTrigger>
            <TabsTrigger 
              value="shipping"
              className="font-sans font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase pb-4 rounded-none bg-transparent hover:text-primary transition-all text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none border-b-2 border-transparent"
            >
              Shipping & Returns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-0 focus-visible:outline-none">
            <div className="space-y-6 max-w-3xl leading-relaxed text-foreground/80 font-serif text-lg sm:text-xl italic">
              <p>
                {product.description}
              </p>
              <p className="text-sm font-sans tracking-wide text-muted-foreground not-italic mt-6 leading-relaxed">
                Curated as part of the AURA essentials collection, this piece showcases a perfect integration of functional details and clean, architectural shapes. Handled with high craftsmanship, it represents our design philosophy—elevated quality, timeless silhouettes, and sustainable practices.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-0 focus-visible:outline-none">
            <div className="max-w-2xl border border-border/40 rounded-xl overflow-hidden divide-y divide-border/40 bg-card/20 backdrop-blur-sm">
              {Object.entries(getProductSpecs(product.id)).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 p-4 text-sm">
                  <span className="font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">{key}</span>
                  <span className="col-span-2 text-foreground/90 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0 focus-visible:outline-none">
            <div className="space-y-6 max-w-3xl divide-y divide-border/40">
              {getProductReviews(product.id).map((rev, index) => (
                <div key={index} className={`pt-6 ${index === 0 ? 'pt-0' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{rev.name}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{rev.date}</span>
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed pl-12 mt-1">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-0 focus-visible:outline-none">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl text-sm leading-relaxed text-foreground/80">
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-widest text-[10px] text-primary">Delivery Services</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground">Standard Delivery (Complimentary)</span>
                      <span className="text-muted-foreground text-xs leading-relaxed">Complimentary standard shipping on all orders over $50. Delivered within 3-5 business days.</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground">Express Dispatch ($24.00)</span>
                      <span className="text-muted-foreground text-xs leading-relaxed">Guaranteed fast delivery in 1-2 business days for urgent purchases.</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold uppercase tracking-widest text-[10px] text-primary">Returns & Exchanges</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground">30-Day Returns</span>
                      <span className="text-muted-foreground text-xs leading-relaxed">We provide complimentary return pickup within 30 days of shipment receipt. Items must be in original condition with tags intact.</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-foreground">Secure Packaging</span>
                      <span className="text-muted-foreground text-xs leading-relaxed">Every order is delivered in our signature eco-friendly, reinforced boxes with protective canvas dustbags.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
