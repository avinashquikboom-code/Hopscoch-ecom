'use client';
import { useProducts } from '@/hooks/use-products';


import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/common/Price';
import { Rating } from '@/components/common/Rating';
import { ImageCarousel } from '@/components/common/ImageCarousel';
import { ProductCard } from '@/components/product/ProductCard';
import { useAddToCart, useAddToWishlist } from '@/hooks';
import { useWishlistStore } from '@/store';
import { ShoppingCart, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { CURRENCY } from '@/constants';

export default function ProductDetailsPage() {
  const { data: productsData } = useProducts();
  const mockProducts = productsData?.data || [];

  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(params.id as string));

  const product = mockProducts.find(p => p.id === params.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => router.push('/products')}>Back to Products</Button>
      </div>
    );
  }

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined;

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product.id, quantity });
  };

  const handleBuyNow = () => {
    addToCart.mutate({ productId: product.id, quantity });
    router.push('/checkout');
  };

  const handleAddToWishlist = () => {
    if (isInWishlist) {
      // Handle remove from wishlist
    } else {
      addToWishlist.mutate(product.id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        <button onClick={() => router.push('/')} className="hover:text-blue-600">
          Home
        </button>
        <span className="mx-2">/</span>
        <button onClick={() => router.push('/products')} className="hover:text-blue-600">
          Products
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <ImageCarousel images={product.images} alt={product.name} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedImage === index
                    ? 'border-blue-600'
                    : 'border-transparent'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <Rating value={product.rating} count={product.reviewCount} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.reviewCount} reviews
              </span>
            </div>
          </div>

          <div>
            <Price
              value={product.price}
              originalPrice={product.originalPrice}
              discount={discount}
              size="lg"
            />
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  In Stock ({product.stock} available)
                </span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  Out of Stock
                </span>
              </>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToWishlist}
            >
              <Heart
                className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">On orders over ₹999</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">100% secure</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">7 days return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-12">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                  This product is made with high-quality materials and designed for durability and comfort. Perfect for everyday use, it combines style with functionality to meet all your needs.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Brand</span>
                    <span className="text-gray-600 dark:text-gray-400">{product.brand}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Category</span>
                    <span className="text-gray-600 dark:text-gray-400">{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Stock</span>
                    <span className="text-gray-600 dark:text-gray-400">{product.stock} units</span>
                  </div>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <span className="font-medium">{key}</span>
                      <span className="text-gray-600 dark:text-gray-400">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    Reviews will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
