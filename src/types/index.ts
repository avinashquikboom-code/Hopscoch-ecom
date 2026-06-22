// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  parentId?: string;
  subcategories?: Category[];
  productCount: number;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: Coupon;
  updatedAt: string;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  updatedAt: string;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  coupon?: Coupon;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  variant?: ProductVariant;
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'cod' | 'wallet';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: User;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  applicableCategories?: string[];
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceRange?: [number, number];
  brands?: string[];
  rating?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  inStock?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Form Types
export interface CheckoutFormData {
  shippingAddressId?: string;
  shippingAddress?: Omit<Address, 'id' | 'userId'>;
  billingSameAsShipping: boolean;
  billingAddressId?: string;
  billingAddress?: Omit<Address, 'id' | 'userId'>;
  paymentMethod: PaymentMethod;
  saveAddress: boolean;
  couponCode?: string;
  notes?: string;
}

// Kids Fashion Specific Types
export type Gender = 'girls' | 'boys' | 'baby' | 'unisex';
export type AgeGroup = 'newborn' | '0-2-years' | '2-5-years' | '5-8-years' | '8-12-years' | 'teenagers';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '2XS' | '3XL';
export type Collection = 'party-wear' | 'casual-wear' | 'summer-collection' | 'winter-collection' | 'ethnic-collection' | 'school-essentials';

export interface KidsProduct extends Product {
  gender: Gender;
  ageGroup: AgeGroup;
  sizes: Size[];
  colors: string[];
  material: string;
  careInstructions: string[];
  countryOfOrigin: string;
}

export interface SizeChart {
  ageGroup: AgeGroup;
  size: Size;
  height: string;
  chest: string;
  waist: string;
  hips?: string;
}
