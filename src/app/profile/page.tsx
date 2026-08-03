'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Lock, MapPin, ShoppingBag, Heart, Settings, LogOut,
  Camera, Check, Eye, EyeOff, ChevronRight, Shield, Bell,
  Package, Star, CreditCard, Phone, Mail, Edit3, Save, X,
  Home, Briefcase, Plus, Trash2, Pencil, RefreshCw, Upload, AlertCircle,
  Loader2, CheckCircle2, Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store';
import {
  useUpdateProfile,
  useUploadAvatar,
  useChangePassword,
  useLogout
} from '@/hooks/use-auth';
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress
} from '@/hooks/use-addresses';
import { useOrders } from '@/hooks/use-orders';
import { useWishlist } from '@/hooks/use-wishlist';
import { toast } from '@/components/ui/toast';
import { resolveAvatarUrl } from '@/lib/utils';
import { Address } from '@/types';

/* ── Status formatters ─────────────────────────────────────────────────── */
function statusToColor(status: string): { text: string; bg: string; border: string } {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return { text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' };
  if (s === 'shipped' || s === 'in_transit' || s === 'out_for_delivery') return { text: 'text-cyan-700 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/40', border: 'border-cyan-200 dark:border-cyan-800' };
  if (s === 'processing' || s === 'confirmed' || s === 'packed') return { text: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800' };
  if (s === 'pending' || s === 'payment_pending') return { text: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' };
  if (s === 'cancelled') return { text: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40', border: 'border-red-200 dark:border-red-800' };
  return { text: 'text-slate-700 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900', border: 'border-slate-200 dark:border-slate-800' };
}

/* ── Nav items ─────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'profile',       label: 'Profile Info',     icon: User },
  { id: 'orders',        label: 'Order History',    icon: ShoppingBag },
  { id: 'addresses',     label: 'Saved Addresses',  icon: MapPin },
  { id: 'security',      label: 'Security',         icon: Shield },
  { id: 'notifications', label: 'Notifications',    icon: Bell },
  { id: 'settings',      label: 'Settings',         icon: Settings },
];

export default function ProfilePage() {
  const router = useRouter();
  const storeUser = useAuthStore((s: any) => s.user);
  const isAuthenticated = useAuthStore((s: any) => s.isAuthenticated);
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const changePasswordMutation = useChangePassword();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Real backend queries
  const { data: addressesData, isLoading: isLoadingAddresses } = useAddresses();
  const { data: ordersData, isLoading: isLoadingOrders } = useOrders(1, 10);
  const { data: wishlistData } = useWishlist();

  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();

  // User Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: storeUser?.firstName || '',
    lastName: storeUser?.lastName || '',
    email: storeUser?.email || '',
    phone: storeUser?.phone || '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (storeUser) {
      setProfileForm({
        firstName: storeUser.firstName || '',
        lastName: storeUser.lastName || '',
        email: storeUser.email || '',
        phone: storeUser.phone || '',
      });
    }
  }, [storeUser]);

  // Address Modal state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false,
  });

  // Password form state
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  // Notification preferences state
  const [notifState, setNotifState] = useState({
    orderUpdates: true,
    promotions: false,
    securityAlerts: true,
    whatsappUpdates: true,
  });

  if (!isAuthenticated && typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (!token || token === 'undefined' || token === 'null') {
      return (
        <div className="min-h-[80vh] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-20 h-20 bg-teal-50 dark:bg-teal-950/50 rounded-full flex items-center justify-center mb-4 border border-teal-200 dark:border-teal-800">
            <User className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Your Account</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm text-center mb-6">
            Please log in to manage your profile details, track orders, and view saved addresses.
          </p>
          <Link
            href="/login"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-teal-600/20"
          >
            Sign In / Register
          </Link>
        </div>
      );
    }
  }

  const avatarUrl = resolveAvatarUrl(storeUser?.avatar || storeUser?.avatarUrl);
  const addresses: Address[] = (addressesData as any) || [];
  const orders = ordersData?.data || [];
  const wishlistCount = Array.isArray(wishlistData) ? wishlistData.length : (wishlistData as any)?.items?.length || 0;

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatarMutation.mutate(file);
    }
    e.target.value = '';
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phone: profileForm.phone,
    }, {
      onSuccess: () => {
        setIsEditingProfile(false);
      }
    });
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: `${storeUser?.firstName || ''} ${storeUser?.lastName || ''}`.trim() || '',
      phone: storeUser?.phone || '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: addresses.length === 0,
    });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      streetAddress: addr.streetAddress || addr.addressLine1 || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.zipCode || addr.postalCode || '',
      country: addr.country || 'India',
      isDefault: !!addr.isDefault,
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.streetAddress || !addressForm.city || !addressForm.zipCode) {
      toast.error('Please fill in all required address fields');
      return;
    }

    const payload = {
      ...addressForm,
      addressLine1: addressForm.streetAddress,
      postalCode: addressForm.zipCode,
      type: 'home' as const,
    };

    if (editingAddressId) {
      updateAddressMutation.mutate({
        id: editingAddressId,
        address: payload,
      }, {
        onSuccess: () => setAddressModalOpen(false),
      });
    } else {
      addAddressMutation.mutate(payload, {
        onSuccess: () => setAddressModalOpen(false),
      });
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: pwdForm.currentPassword,
      newPassword: pwdForm.newPassword,
    }, {
      onSuccess: () => setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' }),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950 pb-16 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ── TOP HERO CARD ───────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            
            {/* Avatar & Upload Trigger */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-teal-700 dark:text-teal-400">
                    {(storeUser?.firstName?.[0] || 'U').toUpperCase()}
                  </span>
                )}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadAvatarMutation.isPending}
                className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-full shadow-md transition-transform hover:scale-105"
                title="Change Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            {/* Profile Info & Badges */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {storeUser?.firstName} {storeUser?.lastName}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-semibold self-center sm:self-auto">
                  <Sparkles className="w-3.5 h-3.5" /> VIP Member
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400" /> {storeUser?.email || 'No email attached'}</span>
                {storeUser?.phone && (
                  <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> {storeUser.phone}</span>
                )}
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-800 min-w-[90px]">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Orders</p>
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{orders.length}</p>
              </div>
              <Link href="/wishlist" className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-800 min-w-[90px] hover:border-teal-300 transition-colors">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Wishlist</p>
                <p className="text-lg font-bold text-rose-500">{wishlistCount}</p>
              </Link>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-800 min-w-[90px]">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Addresses</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{addresses.length}</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── MAIN CONTENT GRID ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-800 shadow-sm sticky top-24 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                let badge = null;
                if (item.id === 'orders' && orders.length > 0) badge = String(orders.length);
                if (item.id === 'addresses' && addresses.length > 0) badge = String(addresses.length);

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm min-h-[420px]">
              
              {/* ── TAB 1: PROFILE INFO ──────────────────────────────────── */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your personal details and contact details</p>
                    </div>
                    {!isEditingProfile ? (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-semibold hover:bg-teal-100 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-slate-700 text-xs font-semibold"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">First Name</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white disabled:opacity-75"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Name</label>
                        <input
                          type="text"
                          disabled={!isEditingProfile}
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white disabled:opacity-75"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          disabled
                          value={profileForm.email}
                          className="w-full px-4 py-3 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed"
                        />
                        <p className="text-[11px] text-slate-400">Email address cannot be changed.</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          disabled={!isEditingProfile}
                          placeholder="+91 98765 43210"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white disabled:opacity-75"
                        />
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-teal-600/20"
                        >
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* ── TAB 2: ORDER HISTORY ──────────────────────────────────── */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order History</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Recent purchases and delivery status</p>
                    </div>
                    <Link
                      href="/orders"
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {isLoadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No orders placed yet</p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">Discover our collection and make your first order.</p>
                      <Link
                        href="/products"
                        className="inline-block px-5 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-700 transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => {
                        const style = statusToColor(order.status);
                        const orderDate = order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : '';

                        return (
                          <div
                            key={order.id}
                            className="bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                                  {order.orderNumber || `#${order.id}`}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.text} ${style.bg} ${style.border}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">Placed on {orderDate} • {order.items?.length || 1} item(s)</p>
                              
                              {/* Item Thumbnails Preview */}
                              <div className="flex items-center gap-2 pt-1">
                                {(order.items || []).slice(0, 3).map((item: any, idx: number) => {
                                  const img = item.product?.images?.[0];
                                  return img ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img key={idx} src={img} alt="Product" className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                                  ) : (
                                    <div key={idx} className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                      <Package className="w-4 h-4 text-slate-400" />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700/60">
                              <p className="text-base font-bold text-slate-900 dark:text-white">₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
                              <Link
                                href={`/orders/${order.id}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                              >
                                View Details <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 3: SAVED ADDRESSES ────────────────────────────────── */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Addresses</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage delivery destinations for faster checkout</p>
                    </div>
                    <button
                      onClick={handleOpenAddAddress}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-teal-600/20"
                    >
                      <Plus className="w-4 h-4" /> Add New Address
                    </button>
                  </div>

                  {isLoadingAddresses ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                        <MapPin className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No saved addresses</p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto">Add an address to speed up your future checkouts.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`relative p-5 rounded-2xl border transition-all ${
                            addr.isDefault
                              ? 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-500/50 shadow-sm'
                              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                          }`}
                        >
                          {addr.isDefault && (
                            <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-teal-600 text-white text-[10px] font-bold uppercase rounded-full">
                              Default
                            </span>
                          )}

                          <div className="space-y-1.5 pr-12">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{addr.fullName}</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300">{addr.streetAddress || addr.addressLine1}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300">{addr.city}, {addr.state} – {addr.zipCode || addr.postalCode}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                              <Phone className="w-3 h-3 text-slate-400" /> {addr.phone}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 pt-4 mt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                            <button
                              onClick={() => handleOpenEditAddress(addr)}
                              className="text-slate-600 hover:text-teal-600 font-semibold flex items-center gap-1"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            {!addr.isDefault && (
                              <>
                                <button
                                  onClick={() => setDefaultAddressMutation.mutate(addr.id)}
                                  className="text-teal-600 hover:text-teal-700 font-semibold"
                                >
                                  Make Default
                                </button>
                                <button
                                  onClick={() => deleteAddressMutation.mutate(addr.id)}
                                  className="text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 ml-auto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 4: SECURITY ────────────────────────────────────────── */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security Settings</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage your account password and security preferences</p>
                  </div>

                  <form onSubmit={handleSavePassword} className="max-w-md space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPwd ? 'text' : 'password'}
                          required
                          value={pwdForm.currentPassword}
                          onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPwd ? 'text' : 'password'}
                          required
                          value={pwdForm.newPassword}
                          onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                          className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPwd(!showNewPwd)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.confirmPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={changePasswordMutation.isPending}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-teal-600/20"
                    >
                      {changePasswordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {/* ── TAB 5: NOTIFICATIONS ──────────────────────────────────── */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Choose what updates and communications you receive</p>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { key: 'orderUpdates', label: 'Order Status & Tracking', desc: 'Get SMS and email notifications when your order status changes' },
                      { key: 'promotions', label: 'Exclusive Offers & Discounts', desc: 'Receive updates on seasonal sales and member discounts' },
                      { key: 'securityAlerts', label: 'Security & Login Alerts', desc: 'Receive immediate alerts when new logins occur' },
                      { key: 'whatsappUpdates', label: 'WhatsApp Order Notifications', desc: 'Get live shipping updates directly via WhatsApp' },
                    ].map((item) => {
                      const enabled = (notifState as any)[item.key];
                      return (
                        <div key={item.key} className="flex items-center justify-between py-4">
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setNotifState((prev) => ({ ...prev, [item.key]: !enabled }));
                              toast.success('Preference updated');
                            }}
                            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${enabled ? 'translate-x-6' : ''}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── TAB 6: SETTINGS ────────────────────────────────────────── */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Settings</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage session and account preferences</p>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account ID</h3>
                      <p className="text-xs font-mono text-slate-500">{storeUser?.id || 'usr_demo_session'}</p>
                    </div>

                    <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200/60 dark:border-rose-900/50 space-y-2">
                      <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400">Sign Out Everywhere</h3>
                      <p className="text-xs text-slate-500">Log out of your account on all active browser sessions.</p>
                      <button
                        onClick={() => logoutMutation.mutate()}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* ── ADDRESS MODAL ─────────────────────────────────────────────────── */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setAddressModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Enter your delivery location details below.</p>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat, House no., Building, Street"
                  value={addressForm.streetAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">State</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-500">ZIP / Pincode *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="isDefault" className="text-xs text-slate-600 dark:text-slate-300">Set as default delivery address</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
