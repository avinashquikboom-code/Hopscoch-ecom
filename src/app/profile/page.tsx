'use client';

import { useState, useRef } from 'react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import {
  User, Lock, MapPin, ShoppingBag, Heart, Settings, LogOut,
  Camera, Check, Eye, EyeOff, ChevronRight, Shield, Bell,
  Package, Star, CreditCard, Phone, Mail, Edit3, Save, X,
  Home, Briefcase, Plus, Trash2, Pencil, RefreshCw, Upload, AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUploadAvatar } from '@/hooks';
import { resolveAvatarUrl } from '@/lib/utils';

/* ── Nav items ─────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'profile',       label: 'Profile Info',     icon: User,     badge: null },
  { id: 'orders',        label: 'Order History',    icon: ShoppingBag, badge: '3' },
  { id: 'wishlist',      label: 'Wishlist',         icon: Heart,    badge: '8' },
  { id: 'addresses',     label: 'Saved Addresses',  icon: MapPin,   badge: null },
  { id: 'security',      label: 'Security',         icon: Shield,   badge: null },
  { id: 'notifications', label: 'Notifications',    icon: Bell,     badge: '2' },
  { id: 'settings',      label: 'Settings',         icon: Settings, badge: null },
];

/* ── Mock data ──────────────────────────────────────────────────────────── */
const MOCK_USER = {
  firstName: 'Avinash',
  lastName: 'Magar',
  email: 'avinash.magar@example.com',
  phone: '+91 98765 43210',
};

const INITIAL_ORDERS = [
  { id: '#AUR-78421', date: 'Jun 12, 2026', status: 'Delivered',  steps: 5, amount: 2999, items: 2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: '#AUR-78316', date: 'Jun 03, 2026', status: 'Shipped',    steps: 3, amount: 1890,  items: 1, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: '#AUR-77904', date: 'May 25, 2026', status: 'Processing', steps: 1, amount: 4799, items: 3, color: 'text-amber-600 bg-amber-50 border-amber-200' },
];

const MOCK_ADDRESSES = [
  { id: '1', type: 'Home', Icon: Home,       name: 'Avinash Magar', line1: '42 Sunshine Lane, Koregaon Park', city: 'Pune, Maharashtra – 411001', isDefault: true  },
  { id: '2', type: 'Work', Icon: Briefcase,  name: 'Avinash Magar', line1: 'Level 5, Tower B, Cybercity, Magarpatta', city: 'Pune, Maharashtra – 411013', isDefault: false },
];

const RETURN_STEPS = ['Return Requested', 'Pickup Scheduled', 'Item Picked Up', 'Quality Verification', 'Refund Completed'];
const ORDER_TRACKING_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

/* ── Sub-components ─────────────────────────────────────────────────────── */
function PasswordInput({ label, name, placeholder, value, onChange, error }: any) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
        <input
          name={name}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-10 py-3 text-sm bg-muted/40 border rounded-xl transition-all
            focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50
            ${error ? 'border-red-400 bg-red-50/30' : 'border-border/60 hover:border-border'}`}
        />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><X className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function NotifRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${on ? 'bg-[#0d9488]' : 'bg-gray-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${on ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const router = useRouter();
  const storeUser    = useAuthStore((s: any) => s.user);
  const logoutAction = useAuthStore((s: any) => s.logout);
  const uploadAvatar = useUploadAvatar();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Use store user or fallback to mock
  const user = storeUser || MOCK_USER;

  // Resolve relative backend URL to full URL
  const avatarUrl = resolveAvatarUrl((storeUser as any)?.avatar ?? (storeUser as any)?.avatarUrl);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
    e.target.value = '';
  };
  const [activeTab, setActiveTab] = useState('orders');

  /* ── Profile form state ────────────────────────────────────────────── */
  const [profile, setProfile] = useState({
    firstName: user.firstName || MOCK_USER.firstName,
    lastName:  user.lastName  || MOCK_USER.lastName,
    email:     user.email     || MOCK_USER.email,
    phone:     user.phone     || MOCK_USER.phone,
  });
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);

  const handleSaveProfile = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  /* ── Password form state ───────────────────────────────────────────── */
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdErr, setPwdErr]   = useState('');
  const [pwdSaved, setPwdSaved] = useState(false);

  const handleSavePwd = () => {
    if (pwdForm.newPwd.length < 8)  { setPwdErr('New password must be at least 8 characters'); return; }
    if (pwdForm.newPwd !== pwdForm.confirm) { setPwdErr("Passwords don't match"); return; }
    setPwdErr('');
    setPwdSaved(true);
    setPwdForm({ current: '', newPwd: '', confirm: '' });
    setTimeout(() => setPwdSaved(false), 2500);
  };

  const handleLogout = () => {
    logoutAction?.();
    router.push('/');
  };

  /* ── Return Request states ─────────────────────────────────────────── */
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeReturnOrder, setActiveReturnOrder] = useState<string | null>(null);
  
  // Return Form inputs
  const [returnReason, setReturnReason] = useState('Size too small');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [refundSource, setRefundSource] = useState<'card' | 'wallet'>('card');

  const simulateFileUpload = () => {
    setIsUploadingFile(true);
    setTimeout(() => {
      const names = ['tag_defect.jpg', 'seaming_detail.png', 'item_fit_check.jpeg'];
      const file = names[uploadedFiles.length % names.length];
      setUploadedFiles(prev => [...prev, file]);
      setIsUploadingFile(false);
      toast.success('Simulated file upload complete!');
    }, 1500);
  };

  const submitReturnRequest = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Return Requested',
          steps: 0,
          color: 'text-rose-600 bg-rose-50 border-rose-200'
        };
      }
      return o;
    }));
    setActiveReturnOrder(null);
    setUploadedFiles([]);
    toast.success(`Return request registered for ${orderId}`);
  };

  const initials = `${profile.firstName[0] ?? 'A'}${profile.lastName[0] ?? 'M'}`;
  const initFull = `${profile.firstName[0]}${profile.lastName[0]}`;

  /* ── Content renderer ─────────────────────────────────────────────── */
  const renderContent = () => {
    switch (activeTab) {

      /* ── PROFILE INFO ─────────────────────────────────────────────── */
      case 'profile': return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Profile Info</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Update your personal details and how we reach you.</p>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 text-sm font-medium hover:bg-muted/60 transition-colors">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <button onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 text-sm font-medium hover:bg-muted/60 transition-colors text-muted-foreground">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            )}
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Avatar row */}
            <div className="flex items-center gap-5 pb-6 border-b border-border/60">
              <div className="relative">
                {/* Show real avatar if available, otherwise gradient initials */}
                {avatarUrl ? (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-background">
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#0d9488]/60 flex items-center justify-center shadow-lg shadow-[#0d9488]/20 ring-4 ring-background">
                    <span className="text-2xl font-bold text-white">{initials}</span>
                  </div>
                )}
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadAvatar.isPending}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#0d9488] text-white flex items-center justify-center shadow hover:bg-[#0d9488]/90 transition-colors border-none cursor-pointer disabled:opacity-60"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">{profile.firstName} {profile.lastName}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/20">
                  <Star className="w-3 h-3" /> Premium Member
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'First Name', icon: User,  key: 'firstName' },
                { label: 'Last Name',  icon: User,  key: 'lastName'  },
                { label: 'Email Address', icon: Mail,  key: 'email', full: true, type: 'email' },
                { label: 'Phone Number',  icon: Phone, key: 'phone', type: 'tel' },
              ].map(({ label, icon: Icon, key, full, type = 'text' }) => (
                <div key={key} className={`space-y-1.5 ${full ? 'sm:col-span-2' : ''}`}>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input
                      type={type}
                      value={(profile as any)[key]}
                      disabled={!editing}
                      onChange={(e) => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 text-sm bg-muted/40 border border-border/60 rounded-xl transition-all
                        focus:outline-none focus:ring-2 focus:ring-[#0d9488]/25 focus:border-[#0d9488]/50
                        disabled:opacity-60 disabled:cursor-not-allowed hover:border-border"
                    />
                  </div>
                </div>
              ))}
            </div>

            {editing && (
              <div className="flex justify-end pt-2">
                <button onClick={handleSaveProfile}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm border-none cursor-pointer
                    ${saved ? 'bg-emerald-500 text-white' : 'bg-[#0d9488] text-white hover:bg-[#0d9488]/90 hover:shadow-md'}`}>
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            )}
          </div>
        </div>
      );

      /* ── ORDERS ───────────────────────────────────────────────────── */
      case 'orders': return (
        <div className="space-y-5 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-foreground">Order History & Returns</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Track shipping timelines, request returns and check refunds.</p>
          </div>
          
          {orders.map(order => {
            const isDelivered = order.status === 'Delivered';
            const isReturnMode = order.status === 'Return Requested' || order.status === 'Returned';
            const trackingSteps = isReturnMode ? RETURN_STEPS : ORDER_TRACKING_STEPS;
            const currentStepName = trackingSteps[order.steps];

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-sm p-5 shadow-xs hover:border-[#0d9488]/40 transition-all duration-200 flex flex-col gap-4">
                
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 flex-wrap pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-bold text-gray-900 text-sm">{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${order.color}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-gray-900">₹{order.amount}</span>
                    
                    {/* Return trigger */}
                    {isDelivered && (
                      <Button
                        onClick={() => setActiveReturnOrder(order.id)}
                        className="bg-teal-50 hover:bg-teal-100/80 text-[#0d9488] border border-teal-200 font-bold h-8 text-[10px] uppercase rounded-sm cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" /> Request Return
                      </Button>
                    )}
                  </div>
                </div>

                {/* 6-Step Order tracking timeline or Return tracking timeline stepper */}
                <div className="pt-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#0d9488] block mb-3.5">
                    {isReturnMode ? 'Return Status Timeline' : 'Delivery Stepper Tracker'}
                  </span>
                  
                  {/* Stepper track */}
                  <div className="relative flex items-center justify-between w-full">
                    {/* Horizontal Line connector */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-10" />
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0d9488] -z-10 transition-all duration-500" 
                      style={{ width: `${(order.steps / (trackingSteps.length - 1)) * 100}%` }}
                    />
                    
                    {trackingSteps.map((step, idx) => {
                      const isActive = idx <= order.steps;
                      return (
                        <div key={step} className="flex flex-col items-center gap-1.5 shrink-0 z-10">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            isActive 
                              ? 'bg-[#0d9488] border-[#0d9488] text-white shadow-xs' 
                              : 'bg-white border-gray-200 text-gray-300'
                          }`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-tighter ${
                            isActive ? 'text-gray-800' : 'text-gray-350'
                          }`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Return pickup & agent info block if return mode */}
                {isReturnMode && (
                  <div className="bg-rose-50/50 border border-rose-100 rounded-sm p-3 text-[10px] text-rose-800 font-semibold space-y-1 mt-2 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold uppercase text-[9px] text-rose-900 tracking-wider">Pickup Scheduled</p>
                      <p className="mt-0.5">Our pickup agent will arrive on <span className="font-bold underline">Tomorrow, 10 AM - 2 PM</span>.</p>
                      <p className="text-gray-400 font-normal">Please keep all tags intact. Refund estimate ₹{order.amount} will process instantly once item is verified.</p>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      );

      /* ── WISHLIST ─────────────────────────────────────────────────── */
      case 'wishlist': return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Wishlist</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Items you've saved for later.</p>
          </div>
          <div className="bg-card border border-border/60 rounded-2xl p-14 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-5">
              <Heart className="w-9 h-9 text-red-400" />
            </div>
            <h3 className="font-semibold text-foreground mb-1.5">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">Save products you love and come back to them anytime.</p>
            <button onClick={() => router.push('/products')}
              className="px-6 py-3 bg-[#0d9488] text-white rounded-xl text-sm font-semibold hover:bg-[#0d9488]/90 transition-all hover:shadow-md border-none cursor-pointer">
              Browse Products
            </button>
          </div>
        </div>
      );

      /* ── ADDRESSES ────────────────────────────────────────────────── */
      case 'addresses': return (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Saved Addresses</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Manage your delivery locations.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0d9488] text-white rounded-xl text-sm font-semibold hover:bg-[#0d9488]/90 transition-colors border-none cursor-pointer">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
          {MOCK_ADDRESSES.map(addr => (
            <div key={addr.id} className={`bg-card border rounded-2xl p-5 shadow-sm transition-all ${addr.isDefault ? 'border-[#0d9488]/40 ring-1 ring-[#0d9488]/15' : 'border-border/60 hover:border-border'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#0d9488]/10 flex items-center justify-center flex-shrink-0">
                    <addr.Icon className="w-5 h-5 text-[#0d9488]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-foreground">{addr.type}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/20">Default</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground/80">{addr.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{addr.line1}<br />{addr.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="p-2 rounded-xl hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors border-none bg-transparent cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {!addr.isDefault && (
                <button className="mt-4 text-xs font-semibold text-[#0d9488] hover:text-[#0d9488]/70 transition-colors border-none bg-transparent cursor-pointer">
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      );

      /* ── SECURITY ─────────────────────────────────────────────────── */
      case 'security': return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Security</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Keep your account safe and secure.</p>
          </div>
          {/* Change password */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border/60">
              <div className="w-10 h-10 rounded-xl bg-[#0d9488]/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#0d9488]" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Use a strong password you don't use elsewhere.</p>
              </div>
            </div>
            <div className="space-y-4">
              <PasswordInput label="Current Password"  name="current" placeholder="Enter current password"
                value={pwdForm.current}  onChange={(e: any) => setPwdForm(p => ({ ...p, current: e.target.value }))} />
              <PasswordInput label="New Password"      name="newPwd"  placeholder="Min. 8 characters"
                value={pwdForm.newPwd}   onChange={(e: any) => setPwdForm(p => ({ ...p, newPwd: e.target.value }))} />
              <PasswordInput label="Confirm Password"  name="confirm" placeholder="Repeat new password"
                value={pwdForm.confirm}  onChange={(e: any) => setPwdForm(p => ({ ...p, confirm: e.target.value }))}
                error={pwdErr} />
            </div>
            <div className="flex justify-end">
              <button onClick={handleSavePwd}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm border-none cursor-pointer
                  ${pwdSaved ? 'bg-emerald-500 text-white' : 'bg-[#0d9488] text-white hover:bg-[#0d9488]/90 hover:shadow-md'}`}>
                {pwdSaved ? <><Check className="w-4 h-4" /> Updated!</> : <><Shield className="w-4 h-4" /> Update Password</>}
              </button>
            </div>
          </div>
        </div>
      );

      /* ── NOTIFICATIONS ────────────────────────────────────────────── */
      case 'notifications': return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Choose what you want to be notified about.</p>
          </div>
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden divide-y divide-border/60">
            {[
              { label: 'Order updates',       desc: 'Shipping, delivery & return status',  defaultOn: true  },
              { label: 'Promotions & deals',  desc: 'Exclusive discounts and flash sales', defaultOn: true  },
              { label: 'New arrivals',        desc: 'Be first to know about new stock',    defaultOn: false },
              { label: 'Price drop alerts',   desc: 'When wishlist item prices drop',      defaultOn: true  },
              { label: 'Account activity',    desc: 'Sign-ins and security notifications', defaultOn: true  },
            ].map((item, i) => <NotifRow key={i} {...item} />)}
          </div>
        </div>
      );

      /* ── SETTINGS ─────────────────────────────────────────────────── */
      case 'settings': return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Settings</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences.</p>
          </div>
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden divide-y divide-border/60">
            {[
              { label: 'Language', value: 'English (India)' },
              { label: 'Currency', value: 'INR (₹)' },
              { label: 'Region',   value: 'India' },
              { label: 'Theme',    value: 'System Default' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer">
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {item.value}
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div className="relative h-36 sm:h-48 bg-gradient-to-br from-[#0d9488] via-[#0d9488]/85 to-[#0d9488]/60 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 h-full flex items-start pt-8">
          <h1 className="text-2xl font-bold text-white tracking-tight uppercase">My Account</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pb-16 -mt-10 relative">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* ── SIDEBAR ─────────────────────────────────────────────── */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0">
            {/* Profile card */}
            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm mb-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  {/* Show real avatar if available, otherwise gradient initials */}
                  {avatarUrl ? (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-background shadow-xl">
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#0d9488]/60 flex items-center justify-center shadow-xl shadow-[#0d9488]/25 ring-4 ring-background">
                      <span className="text-2xl font-bold text-white">{initFull}</span>
                    </div>
                  )}
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadAvatar.isPending}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#0d9488] text-white flex items-center justify-center shadow hover:bg-[#0d9488]/90 transition-colors border-none cursor-pointer disabled:opacity-60"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onAvatarChange}
                  />
                </div>
              </div>
              <p className="font-bold text-foreground text-base">{profile.firstName} {profile.lastName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0d9488]/10 text-[#0d9488] border border-[#0d9488]/20">
                <Star className="w-3 h-3" /> Premium Member
              </span>
              {/* Stats */}
              <div className="flex gap-2 mt-5">
                {[
                  { icon: Package,    label: 'Orders',   val: '3',    bg: 'bg-teal-50',     clr: 'text-[#0d9488]' },
                  { icon: Heart,      label: 'Wishlist', val: '8',    bg: 'bg-red-50',       clr: 'text-red-500' },
                  { icon: CreditCard, label: 'Saved',    val: '₹2.4k', bg: 'bg-amber-50',     clr: 'text-amber-600' },
                ].map(({ icon: Icon, label, val, bg, clr }) => (
                  <div key={label} className="flex flex-col items-center gap-1 p-3 bg-background border border-border/50 rounded-xl flex-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} ${clr}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-foreground">{val}</span>
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-150 relative group border-none bg-transparent cursor-pointer
                    ${activeTab === item.id ? 'text-[#0d9488] bg-[#0d9488]/5' : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'}`}>
                  {activeTab === item.id && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-r-full bg-[#0d9488]" />
                  )}
                  <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === item.id ? 'text-[#0d9488]' : 'group-hover:text-foreground'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">{item.badge}</span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-all ${activeTab === item.id ? 'text-[#0d9488] opacity-100' : 'opacity-25 group-hover:opacity-60'}`} />
                </button>
              ))}

              <div className="mx-4 border-t border-border/60" />

              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 pt-12 lg:pt-0">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* SECURE RETURN REQUEST MODAL OVERLAY */}
      {activeReturnOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-gray-250/60 p-5 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveReturnOrder(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-1 flex items-center gap-1.5">
              <RefreshCw className="w-4.5 h-4.5 text-[#0d9488]" />
              <span>Request Return for {activeReturnOrder}</span>
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold mb-4">Provide details to register immediate pickup verification & refund estimates.</p>
            
            <div className="space-y-4 text-xs">
              
              {/* Reason list */}
              <div className="space-y-1.5">
                <Label htmlFor="reason-sel" className="font-bold text-gray-700">Reason for Return</Label>
                <select
                  id="reason-sel"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 font-semibold text-gray-800 focus:border-[#0d9488] outline-none"
                >
                  <option value="Size too small">Size was too small / tight</option>
                  <option value="Size too large">Size was too large / loose</option>
                  <option value="Defective">Defective / Damaged product delivered</option>
                  <option value="Poor quality">Material quality not as expected</option>
                  <option value="Wrong item">Delivered wrong item / color code</option>
                </select>
              </div>

              {/* Photo uploader simulation */}
              <div className="space-y-2">
                <Label className="font-bold text-gray-700">Simulate Defect Photo Uploads</Label>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={simulateFileUpload}
                    disabled={isUploadingFile}
                    className="bg-gray-150 hover:bg-gray-200 text-gray-800 text-[10px] font-bold h-8 rounded-sm cursor-pointer border border-gray-200"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" /> {isUploadingFile ? 'Uploading...' : 'Choose Photos'}
                  </Button>
                  <span className="text-[10px] text-gray-400 font-semibold">(Optional, up to 3 attachments)</span>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="flex gap-2 flex-wrap pt-1.5">
                    {uploadedFiles.map((name, i) => (
                      <span key={i} className="bg-teal-50 border border-teal-200 text-[#0d9488] text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-slide-up">
                        <Check className="w-3 h-3" /> {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Refund source selector */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-700 block mb-1">Select Refund Mode</span>
                <div className="grid grid-cols-2 gap-3.5">
                  
                  <button
                    onClick={() => setRefundSource('card')}
                    className={`p-2.5 rounded-sm border text-left flex flex-col justify-between h-14 cursor-pointer transition-all ${
                      refundSource === 'card' 
                        ? 'border-[#0d9488] bg-teal-50/20 text-[#0d9488]' 
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="font-bold uppercase text-[9px] tracking-wide">Original Card</span>
                    <span className="text-[8px] text-gray-400">Reflected in 5-7 bank days</span>
                  </button>

                  <button
                    onClick={() => setRefundSource('wallet')}
                    className={`p-2.5 rounded-sm border text-left flex flex-col justify-between h-14 cursor-pointer transition-all ${
                      refundSource === 'wallet' 
                        ? 'border-[#0d9488] bg-teal-50/20 text-[#0d9488]' 
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="font-bold uppercase text-[9px] tracking-wide flex items-center gap-1">Aura Wallet <span className="bg-amber-100 text-amber-800 text-[8px] px-1 rounded font-black">+10% Bonus</span></span>
                    <span className="text-[8px] text-gray-400">Instant credit to coins</span>
                  </button>

                </div>
              </div>

            </div>

            <Button
              onClick={() => submitReturnRequest(activeReturnOrder)}
              className="mt-6 w-full bg-[#fb641b] hover:bg-[#fb641b]/95 text-white font-bold h-10 text-xs rounded-sm border-none uppercase cursor-pointer"
            >
              CONFIRM RETURN PICKUP
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
