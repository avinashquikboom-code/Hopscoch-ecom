// API Constants
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://api.fciseller.com/api').replace(/\/api\/?$/, '');
export const API_BASE_URL = `${API_BASE}/api`;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_OTP: '/auth/verify-otp',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id: string) => `/products/${id}`,
  PRODUCT_REVIEWS: (id: string) => `/products/${id}/reviews`,
  PRODUCT_CATEGORIES: '/products/categories',
  FEATURED_PRODUCTS: '/products/featured',
  TRENDING_PRODUCTS: '/products/trending',
  NEW_ARRIVALS: '/products/new',
  BEST_SELLERS: '/products/best-sellers',
  SEARCH_PRODUCTS: '/products/search',
  
  // Cart
  CART: '/cart',
  CART_ITEM: (id: string) => `/cart/items/${id}`,
  CART_CLEAR: '/cart/clear',
  APPLY_COUPON: '/cart/coupon',
  
  // Wishlist
  WISHLIST: '/wishlist',
  WISHLIST_ITEM: (id: string) => `/wishlist/${id}`,
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAILS: (id: string) => `/orders/${id}`,
  ORDER_TRACKING: (id: string) => `/orders/${id}/tracking`,
  CANCEL_ORDER: (id: string) => `/orders/${id}/cancel`,
  RETURN_ORDER: (id: string) => `/orders/${id}/return`,
  
  // User
  USER_PROFILE: '/user/profile',
  USER_ADDRESSES: '/user/addresses',
  USER_ADDRESS: (id: string) => `/user/addresses/${id}`,
  CHANGE_PASSWORD: '/user/change-password',
  
  // Coupons
  COUPONS: '/coupons',
  VALIDATE_COUPON: '/coupons/validate',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
  WISHLIST_DATA: 'wishlist_data',
  THEME: 'theme',
  RECENTLY_VIEWED: 'recently_viewed',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  COD: 'cod',
  WALLET: 'wallet',
} as const;

// Sort Options
export const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Popularity' },
] as const;

// Price Ranges
export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 - ₹5000', min: 2000, max: 5000 },
  { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
  { label: 'Over ₹10000', min: 10000, max: Infinity },
] as const;

// Rating Options
export const RATING_OPTIONS = [
  { value: 4, label: '4★ & above' },
  { value: 3, label: '3★ & above' },
  { value: 2, label: '2★ & above' },
  { value: 1, label: '1★ & above' },
] as const;

// Discount Ranges
export const DISCOUNT_RANGES = [
  { label: '10% and above', min: 10 },
  { label: '25% and above', min: 25 },
  { label: '50% and above', min: 50 },
  { label: '70% and above', min: 70 },
] as const;

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/hopscotch',
  TWITTER: 'https://twitter.com/hopscotch',
  INSTAGRAM: 'https://instagram.com/hopscotch',
  YOUTUBE: 'https://youtube.com/hopscotch',
  LINKEDIN: 'https://linkedin.com/hopscotch',
} as const;

// Contact Info
export const CONTACT_INFO = {
  EMAIL: 'support@fciseller.com',
  PHONE: '+91 1800-123-4567',
  ADDRESS: '123 E-commerce Street, Tech City, India - 560001',
} as const;

// Currency
export const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  LOCALE: 'en-IN',
} as const;

// Image Sizes
export const IMAGE_SIZES = {
  THUMBNAIL: 100,
  SMALL: 300,
  MEDIUM: 500,
  LARGE: 800,
  ORIGINAL: 1200,
} as const;

// Toast Messages
export const TOAST_MESSAGES = {
  ADDED_TO_CART: 'Product added to cart',
  REMOVED_FROM_CART: 'Product removed from cart',
  CART_UPDATED: 'Cart updated successfully',
  ADDED_TO_WISHLIST: 'Product added to wishlist',
  REMOVED_FROM_WISHLIST: 'Product removed from wishlist',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  ADDRESS_SAVED: 'Address saved successfully',
  ADDRESS_DELETED: 'Address deleted successfully',
  ORDER_PLACED: 'Order placed successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  COUPON_APPLIED: 'Coupon applied successfully',
  COUPON_REMOVED: 'Coupon removed',
  REVIEW_SUBMITTED: 'Review submitted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please login.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input.',
  CART_EMPTY: 'Your cart is empty',
  OUT_OF_STOCK: 'Product is out of stock',
  INVALID_COUPON: 'Invalid coupon code',
  EXPIRED_COUPON: 'Coupon has expired',
  ALREADY_IN_CART: 'Product is already in cart',
  ALREADY_IN_WISHLIST: 'Product is already in wishlist',
} as const;

// Local Storage Expiry (in milliseconds)
export const STORAGE_EXPIRY = {
  AUTH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7 days
  REFRESH_TOKEN: 30 * 24 * 60 * 60 * 1000, // 30 days
  RECENTLY_VIEWED: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;
