'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import {
  User, Lock, MapPin, ShoppingBag, Heart, Settings, LogOut,
  Camera, Check, Eye, EyeOff, ChevronRight, Shield, Bell,
  Package, Star, CreditCard, Phone, Mail, Edit3, Save, X,
  Home, Briefcase, Plus, Trash2, Pencil,
} from 'lucide-react';

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

const MOCK_ORDERS = [
  { id: '#AUR-78421', date: 'Jun 12, 2026', status: 'Delivered',  steps: 3, amount: 299, items: 2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800' },
  { id: '#AUR-78316', date: 'Jun 03, 2026', status: 'Shipped',    steps: 2, amount: 89,  items: 1, color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800' },
  { id: '#AUR-77904', date: 'May 25, 2026', status: 'Processing', steps: 1, amount: 178, items: 3, color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800' },
];

const MOCK_ADDRESSES = [
  { id: '1', type: 'Home', Icon: Home,       name: 'Avinash Magar', line1: '42 Sunshine Lane, Koregaon Park', city: 'Pune, Maharashtra – 411001', isDefault: true  },
  { id: '2', type: 'Work', Icon: Briefcase,  name: 'Avinash Magar', line1: 'Level 5, Tower B, Cybercity, Magarpatta', city: 'Pune, Maharashtra – 411013', isDefault: false },
];

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
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${on ? 'bg-primary' : 'bg-border'}`}>
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

  // Use store user or fallback to mock
  const user = storeUser || MOCK_USER;

  const [activeTab, setActiveTab] = useState('profile');

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

  const initials = `${profile.firstName[0] ?? 'A'}${profile.lastName[0] ?? 'M'}`;

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
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-background">
                  <span className="text-2xl font-bold text-primary-foreground">{initials}</span>
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow hover:bg-primary/90 transition-colors">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">{profile.firstName} {profile.lastName}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
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
                        focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50
                        disabled:opacity-60 disabled:cursor-not-allowed hover:border-border"
                    />
                  </div>
                </div>
              ))}
            </div>

            {editing && (
              <div className="flex justify-end pt-2">
                <button onClick={handleSaveProfile}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm
                    ${saved ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-95'}`}>
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>
            )}
          </div>
        </div>
      );

      /* ── ORDERS ───────────────────────────────────────────────────── */
      case 'orders': return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-foreground">Order History</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Track and manage your recent purchases.</p>
          </div>
          {MOCK_ORDERS.map(order => (
            <div key={order.id} className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-all duration-200 group cursor-pointer">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-bold text-foreground text-sm">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${order.color}`}>{order.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-foreground">₹{order.amount}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-0.5" />
                </div>
              </div>
              {/* Step progress */}
              <div className="mt-4 flex items-center gap-0">
                {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((step, i) => (
                  <div key={step} className="flex items-center flex-1 gap-0 last:flex-none">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${i <= order.steps ? 'bg-primary' : 'bg-border'}`} />
                    {i < 3 && <div className={`h-px flex-1 mx-1 transition-colors ${i < order.steps ? 'bg-primary' : 'bg-border'}`} />}
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex justify-between">
                {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((step, i) => (
                  <span key={step} className={`text-[10px] font-medium ${i <= order.steps ? 'text-primary' : 'text-muted-foreground/50'}`}>{step}</span>
                ))}
              </div>
            </div>
          ))}
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
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all hover:shadow-md hover:shadow-primary/25 active:scale-95">
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
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
          {MOCK_ADDRESSES.map(addr => (
            <div key={addr.id} className={`bg-card border rounded-2xl p-5 shadow-sm transition-all ${addr.isDefault ? 'border-primary/40 ring-1 ring-primary/15' : 'border-border/60 hover:border-border'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <addr.Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-foreground">{addr.type}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">Default</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground/80">{addr.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{addr.line1}<br />{addr.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="p-2 rounded-xl hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {!addr.isDefault && (
                <button className="mt-4 text-xs font-semibold text-primary hover:text-primary/70 transition-colors">
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
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary" />
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
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm
                  ${pwdSaved ? 'bg-emerald-500 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-95'}`}>
                {pwdSaved ? <><Check className="w-4 h-4" /> Updated!</> : <><Shield className="w-4 h-4" /> Update Password</>}
              </button>
            </div>
          </div>
          {/* 2FA */}
          <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of account protection.</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl border border-border/60 text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors">Enable</button>
          </div>
          {/* Active sessions */}
          <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Active Sessions</p>
                <p className="text-xs text-muted-foreground">Manage devices signed into your account.</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-xl border border-border/60 text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors">View All</button>
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
          <div className="bg-card border border-red-200/60 dark:border-red-900/40 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-red-600 mb-3">Danger Zone</h3>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
              </div>
              <button className="px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-800 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      );

      default: return null;
    }
  };

  const initFull = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <div className="relative h-36 sm:h-48 bg-gradient-to-br from-primary via-primary/85 to-primary/60 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 60%, white 1px, transparent 1px), radial-gradient(circle at 75% 25%, white 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 h-full flex items-start pt-8">
          <h1 className="text-2xl font-bold text-primary-foreground/90 tracking-tight">My Account</h1>
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
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl shadow-primary/25 ring-4 ring-background">
                    <span className="text-2xl font-bold text-primary-foreground">{initFull}</span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow hover:bg-primary/90 transition-colors">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="font-bold text-foreground text-base">{profile.firstName} {profile.lastName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                <Star className="w-3 h-3" /> Premium Member
              </span>
              {/* Stats */}
              <div className="flex gap-2 mt-5">
                {[
                  { icon: Package,    label: 'Orders',   val: '3',    bg: 'bg-blue-50 dark:bg-blue-950/40',     clr: 'text-blue-600' },
                  { icon: Heart,      label: 'Wishlist', val: '8',    bg: 'bg-red-50 dark:bg-red-950/40',       clr: 'text-red-500' },
                  { icon: CreditCard, label: 'Saved',    val: '₹2.4k', bg: 'bg-emerald-50 dark:bg-emerald-950/40', clr: 'text-emerald-600' },
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
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-150 relative group
                    ${activeTab === item.id ? 'text-primary bg-primary/6' : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'}`}>
                  {activeTab === item.id && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-r-full bg-primary" />
                  )}
                  <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === item.id ? 'text-primary' : 'group-hover:text-foreground'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">{item.badge}</span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-all ${activeTab === item.id ? 'text-primary opacity-100' : 'opacity-25 group-hover:opacity-60'}`} />
                </button>
              ))}

              <div className="mx-4 border-t border-border/60" />

              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
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
    </div>
  );
}
