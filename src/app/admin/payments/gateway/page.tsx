'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AppDrawer } from '@/components/ui/app-drawer';
import { 
  Eye, EyeOff, Plus, Settings, CheckCircle2, AlertCircle, Play, 
  RefreshCw, ShieldCheck, HelpCircle, ArrowRight, Activity, Cpu, Sparkles 
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Initial Mock Gateways Data
const initialGateways = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    icon: '⚡',
    brandColor: 'from-blue-600/10 to-indigo-600/10 border-blue-500/20',
    iconBg: 'bg-blue-500/10 text-blue-500',
    apiKey: 'rzp_live_8g7Hsd82knds9a',
    secret: '••••••••••••••••••••••••••••',
    webhook: 'https://api.aurastore.com/v1/webhooks/razorpay',
    sandbox: false,
    active: true,
    features: ['UPI', 'Cards', 'Net Banking', 'Wallets', 'EMI'],
    uptime: '99.98%',
    volume: '$64,250',
    successRate: 98.4
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '🔷',
    brandColor: 'from-violet-600/10 to-indigo-700/10 border-indigo-500/20',
    iconBg: 'bg-indigo-500/10 text-indigo-500',
    apiKey: 'pk_live_51Ny8hs92nsd9s1',
    secret: '••••••••••••••••••••••••••••',
    webhook: 'https://api.aurastore.com/v1/webhooks/stripe',
    sandbox: true,
    active: false,
    features: ['Cards', 'Apple Pay', 'Google Pay', 'SEPA Debit'],
    uptime: '100.00%',
    volume: '$48,120',
    successRate: 99.1
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🅿️',
    brandColor: 'from-sky-600/10 to-blue-500/10 border-sky-500/20',
    iconBg: 'bg-sky-500/10 text-sky-500',
    apiKey: 'client_live_Ad2jns982ndskJn',
    secret: '••••••••••••••••••••••••••••',
    webhook: 'https://api.aurastore.com/v1/webhooks/paypal',
    sandbox: true,
    active: false,
    features: ['PayPal Balance', 'Pay Later', 'Credit Cards', 'International'],
    uptime: '99.95%',
    volume: '$30,130',
    successRate: 97.8
  },
];

// Transaction trends for charts
const chartData = [
  { time: '00:00', Stripe: 98, Razorpay: 97, PayPal: 95 },
  { time: '04:00', Stripe: 99, Razorpay: 98, PayPal: 96 },
  { time: '08:00', Stripe: 99.2, Razorpay: 98.5, PayPal: 97 },
  { time: '12:00', Stripe: 99.5, Razorpay: 98.8, PayPal: 97.5 },
  { time: '16:00', Stripe: 99.1, Razorpay: 98.2, PayPal: 98 },
  { time: '20:00', Stripe: 99.3, Razorpay: 98.4, PayPal: 97.9 },
  { time: '24:00', Stripe: 99.6, Razorpay: 98.7, PayPal: 98.2 },
];

export default function PaymentGatewayPage() {
  const [gateways, setGateways] = useState(initialGateways);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({ name: 'Stripe', apiKey: '', secret: '', webhook: '', sandbox: true });
  const [mounted, setMounted] = useState(false);

  // Connection testing states
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testStep, setTestStep] = useState(0);
  const [testResult, setTestResult] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleActive = (id: string) => {
    setGateways(prev => prev.map(g => {
      if (g.id === id) {
        const nextState = !g.active;
        toast(nextState ? `${g.name} Gateway activated` : `${g.name} Gateway deactivated`, {
          description: nextState ? `Transactions will now route through ${g.name}.` : `Transactions stopped routing through ${g.name}.`,
          action: {
            label: 'Undo',
            onClick: () => toggleActive(id)
          }
        });
        return { ...g, active: nextState };
      }
      return g;
    }));
  };

  const toggleSandbox = (id: string) => {
    setGateways(prev => prev.map(g => {
      if (g.id === id) {
        const nextSandbox = !g.sandbox;
        toast.info(`${g.name} set to ${nextSandbox ? 'Sandbox' : 'Production'} Mode`, {
          description: nextSandbox ? 'Test credentials are now being used.' : 'Live checkout processing is enabled.'
        });
        return { ...g, sandbox: nextSandbox };
      }
      return g;
    }));
  };

  const toggleSecret = (id: string) => {
    setShowSecrets(s => ({ ...s, [id]: !s[id] }));
  };

  const handleAddGateway = (e: React.FormEvent) => {
    e.preventDefault();
    const id = form.name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if already exists
    if (gateways.some(g => g.id === id)) {
      toast.error("Gateway Integration Error", {
        description: `An integration for ${form.name} already exists.`
      });
      return;
    }

    const newGateway = {
      id,
      name: form.name,
      icon: form.name === 'Adyen' ? '💳' : '🔌',
      brandColor: 'from-emerald-600/10 to-teal-600/10 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-500',
      apiKey: form.apiKey,
      secret: '••••••••••••••••••••••••••••',
      webhook: form.webhook || `https://api.aurastore.com/v1/webhooks/${id}`,
      sandbox: form.sandbox,
      active: false,
      features: ['Cards', 'Alternative Methods'],
      uptime: '100.00%',
      volume: '$0.00',
      successRate: 100.0
    };

    setGateways(prev => [...prev, newGateway]);
    setSheetOpen(false);
    setForm({ name: 'Stripe', apiKey: '', secret: '', webhook: '', sandbox: true });
    
    toast.success("Integration Registered", {
      description: `${form.name} has been added in draft state. Configure and test credentials to activate.`
    });
  };

  // Run a high-fidelity visual check of API connection
  const runConnectionTest = async (id: string) => {
    setTestingId(id);
    setTestResult('running');
    setTestStep(0);

    const stepIntervals = [800, 1000, 1200, 800];
    
    for (let i = 0; i < stepIntervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, stepIntervals[i]));
      setTestStep(prev => prev + 1);
    }
    
    setTestResult('success');
    toast.success("Validation Successful", {
      description: `Tested connection to ${id} API servers successfully. 0ms packet loss.`
    });

    // Close check panel after 2.5 seconds
    setTimeout(() => {
      setTestingId(null);
      setTestResult('idle');
      setTestStep(0);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header with Stats Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
            Payment Gateways
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold py-0.5 rounded-full">
              Finance Hub
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
            Configure secure payment integrations, switch API processing modes, and inspect connection statuses.
          </p>
        </div>
        
        <Button 
          onClick={() => setSheetOpen(true)} 
          className="rounded-lg gap-2 bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 cursor-pointer h-11 px-5 font-semibold text-sm transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Merchant Gateway
        </Button>
      </div>

      {/* 2. Drawer Component */}
      <AppDrawer
        title="Add Payment Gateway"
        subtitle="Configure a new secure transaction processing gateway."
        open={sheetOpen}
        onClose={setSheetOpen}
        onSubmit={handleAddGateway}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gateway-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Gateway Provider</Label>
            <select 
              id="gateway-select" 
              className="w-full rounded-md border border-border/60 h-11 px-3 bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            >
              <option value="Stripe">Stripe (Global Credit Card & wallets)</option>
              <option value="Razorpay">Razorpay (India Local Cards, UPI, Netbanking)</option>
              <option value="PayPal">PayPal (Global Express Checkout)</option>
              <option value="Adyen">Adyen (Enterprise Payments)</option>
              <option value="Braintree">Braintree (PayPal partner)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">API Public Key / Client ID</Label>
            <Input 
              id="apiKey" 
              required 
              value={form.apiKey} 
              onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
              placeholder="e.g. pk_live_xxxxxxxxxxxxxxxxxxxxx" 
              className="rounded-md border-border/60 h-11 text-sm" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secret" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">API Secret Key / Signature</Label>
            <Input 
              id="secret" 
              required 
              type="password" 
              value={form.secret} 
              onChange={(e) => setForm({ ...form, secret: e.target.value })}
              placeholder="e.g. sk_live_xxxxxxxxxxxxxxxxxxxxx" 
              className="rounded-md border-border/60 h-11 text-sm" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Webhook Endpoint URL (Optional)</Label>
            <Input 
              id="webhook" 
              value={form.webhook} 
              onChange={(e) => setForm({ ...form, webhook: e.target.value })}
              placeholder="https://api.yourdomain.com/v1/webhooks/receiver" 
              className="rounded-md border-border/60 h-11 text-sm" 
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-border/40 rounded-lg bg-muted/20">
            <div className="space-y-0.5">
              <Label htmlFor="sandbox-mode" className="text-sm font-semibold">Sandbox / Testing Mode</Label>
              <p className="text-xs text-muted-foreground">Route requests to Sandbox environment to safely inspect checkout transactions.</p>
            </div>
            <Switch 
              id="sandbox-mode" 
              checked={form.sandbox} 
              onCheckedChange={(checked) => setForm({ ...form, sandbox: checked })} 
            />
          </div>
        </div>
      </AppDrawer>

      {/* 3. Top Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border/40 bg-card/65 backdrop-blur-md shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="h-16 w-16 text-primary" />
          </div>
          <CardContent className="p-6">
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">SSL SECURITY</span>
            <div className="text-2xl font-bold text-foreground mt-2">PCI-DSS Level 1</div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              256-bit encryption standards active.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/65 backdrop-blur-md shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="h-16 w-16 text-primary" />
          </div>
          <CardContent className="p-6">
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">AVERAGE API LATENCY</span>
            <div className="text-2xl font-bold text-foreground mt-2">246 ms</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Across all global merchant API routers.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/65 backdrop-blur-md shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu className="h-16 w-16 text-accent" />
          </div>
          <CardContent className="p-6">
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">INTEGRATED METHODS</span>
            <div className="text-2xl font-bold text-primary mt-2">12 Active</div>
            <p className="text-xs text-muted-foreground mt-1.5">
              UPI, Apple Pay, Cards, Google Pay & regional.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4. Main Config Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Gateways list (Col span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-lg font-serif font-bold text-foreground tracking-wide flex items-center gap-2">
            Active Integrations
            <span className="text-xs font-light text-muted-foreground">({gateways.length} total)</span>
          </h2>
          
          <div className="space-y-6">
            {gateways.map((g) => {
              const isChecking = testingId === g.id;
              
              return (
                <Card 
                  key={g.id} 
                  className={`border border-border/40 bg-card/50 backdrop-blur-md rounded-xl shadow-sm transition-all overflow-hidden relative ${
                    !g.active ? 'opacity-70 saturate-75 hover:opacity-85' : 'hover:shadow-md hover:border-primary/20'
                  }`}
                >
                  {/* Top Glowing Brand Header */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${g.brandColor}`}></div>
                  
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xl font-bold shadow-inner ${g.iconBg}`}>
                          {g.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base font-bold flex items-center gap-2">
                            {g.name}
                            {g.active && (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className={`text-[10px] rounded-full px-2 border-transparent font-medium ${
                              g.active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'
                            }`}>
                              {g.active ? 'Routing Transactions' : 'Inactive'}
                            </Badge>
                            <Badge variant="outline" className={`text-[10px] rounded-full px-2 border-transparent font-medium ${
                              g.sandbox ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-primary/10 text-primary'
                            }`}>
                              {g.sandbox ? 'Sandbox Mode' : 'Production Live'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2.5">
                        <Switch 
                          checked={g.active} 
                          onCheckedChange={() => toggleActive(g.id)}
                          className="data-[state=checked]:bg-emerald-500" 
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 space-y-4">
                    {/* API credentials fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Public Key</Label>
                        <Input value={g.apiKey} readOnly className="h-9 rounded-md font-mono text-xs bg-muted/30 border-transparent select-all cursor-text text-foreground/80 focus:border-border/60" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Secret Key</Label>
                        <div className="relative">
                          <Input 
                            value={showSecrets[g.id] ? 'sk_live_x83JdnN38KsnDs82JnDq2pS' : g.secret} 
                            readOnly 
                            type={showSecrets[g.id] ? 'text' : 'password'}
                            className="h-9 rounded-md font-mono text-xs bg-muted/30 border-transparent text-foreground/80 pr-10 focus:border-border/60" 
                          />
                          <button 
                            onClick={() => toggleSecret(g.id)} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            aria-label={showSecrets[g.id] ? "Hide credential" : "Show credential"}
                          >
                            {showSecrets[g.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Webhook URL</Label>
                      <Input value={g.webhook} readOnly className="h-9 rounded-md font-mono text-xs bg-muted/30 border-transparent select-all cursor-text text-foreground/80 focus:border-border/60" />
                    </div>

                    {/* Supported Methods */}
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Supported Processing Channels</p>
                      <div className="flex flex-wrap gap-1.5">
                        {g.features.map(f => (
                          <Badge key={f} variant="outline" className="text-[10px] rounded-full px-2.5 py-0.5 border-transparent bg-muted text-muted-foreground/85 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {f}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Panel Footer */}
                    <div className="pt-4 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* Connection Test Drawer Overlay */}
                      <AnimatePresence>
                        {isChecking && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full bg-primary/[0.02] border border-primary/10 rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                                Connection Check
                              </span>
                              <Badge className="bg-primary/10 text-primary text-[9px] border-none font-semibold">
                                {testResult === 'success' ? 'Validated' : 'Verifying...'}
                              </Badge>
                            </div>
                            
                            {/* Validation steps logs */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className={testStep >= 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
                                  1. Verifying API keys on {g.name}...
                                </span>
                                {testStep >= 1 ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <span className="h-3 w-3 animate-spin rounded-full border border-primary border-t-transparent" />
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between text-[11px]">
                                <span className={testStep >= 2 ? "text-foreground font-medium" : "text-muted-foreground"}>
                                  2. Verifying SSL Handshake TLS 1.3...
                                </span>
                                {testStep >= 2 ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                ) : testStep === 1 ? (
                                  <span className="h-3 w-3 animate-spin rounded-full border border-primary border-t-transparent" />
                                ) : (
                                  <div className="w-3.5 h-3.5" />
                                )}
                              </div>

                              <div className="flex items-center justify-between text-[11px]">
                                <span className={testStep >= 3 ? "text-foreground font-medium" : "text-muted-foreground"}>
                                  3. Webhook listener endpoint response check...
                                </span>
                                {testStep >= 3 ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                ) : testStep === 2 ? (
                                  <span className="h-3 w-3 animate-spin rounded-full border border-primary border-t-transparent" />
                                ) : (
                                  <div className="w-3.5 h-3.5" />
                                )}
                              </div>

                              <div className="flex items-center justify-between text-[11px]">
                                <span className={testStep >= 4 ? "text-foreground font-medium" : "text-muted-foreground"}>
                                  4. Live connection integrity check...
                                </span>
                                {testStep >= 4 ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                ) : testStep === 3 ? (
                                  <span className="h-3 w-3 animate-spin rounded-full border border-primary border-t-transparent" />
                                ) : (
                                  <div className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!isChecking && (
                        <>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Uptime: <strong className="text-foreground font-semibold">{g.uptime}</strong></span>
                            <span>Success Rate: <strong className="text-primary font-bold">{g.successRate}%</strong></span>
                          </div>
                          
                          <div className="flex gap-2 w-full md:w-auto">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toggleSandbox(g.id)}
                              className="rounded-lg text-xs font-semibold h-9 flex-1 md:flex-initial"
                            >
                              Toggle Sandbox
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => runConnectionTest(g.id)}
                              className="rounded-lg text-xs font-semibold h-9 text-primary border-primary/20 hover:bg-primary/5 gap-1.5 flex-1 md:flex-initial"
                            >
                              <Play className="h-3 w-3 fill-primary" /> Test Connection
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Side: Analytics, performance logs (Col span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-lg font-serif font-bold text-foreground tracking-wide flex items-center gap-2">
            Success Trends
            <Badge className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/5 font-semibold text-[10px]">
              Live 24h
            </Badge>
          </h2>

          <Card className="border border-border/40 bg-card/65 backdrop-blur-md shadow-sm rounded-xl">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-sm font-bold">API Transaction success rate (%)</CardTitle>
              <CardDescription>Performance latency mapping by gateway provider</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {mounted ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorStripe" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRazorpay" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} domain={[90, 100]} />
                      <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', fontSize: '12px', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="Stripe" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorStripe)" />
                      <Area type="monotone" dataKey="Razorpay" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRazorpay)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 w-full flex items-center justify-center text-muted-foreground text-xs bg-muted/10 rounded-lg animate-pulse">
                  Loading metrics chart...
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-border/20 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Processed Volume</span>
                  <div className="text-xl font-bold text-foreground">$142,500</div>
                  <p className="text-[10px] text-emerald-500 font-semibold">+14.2% since yesterday</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Failure Rate</span>
                  <div className="text-xl font-bold text-rose-500">0.82%</div>
                  <p className="text-[10px] text-muted-foreground font-medium">99.18% success floor</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick FAQ / Security Compliance Info */}
          <Card className="border border-border/40 bg-card/65 backdrop-blur-md shadow-sm rounded-xl">
            <CardHeader className="p-6">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Gateway Routing Logic
              </CardTitle>
              <CardDescription className="text-xs mt-1 leading-relaxed">
                AURA Smart Route automatically distributes user transactions based on geo-IP, active gateway health checks, and fee optimization structures.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 text-xs">
              <div className="p-3 bg-muted/20 border border-border/30 rounded-lg space-y-1.5">
                <div className="font-semibold text-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Failover Protocol
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  If Stripe experiences &gt;2% transaction degradation over 5 minutes, checkout forms automatically fallback to alternative channels.
                </p>
              </div>

              <div className="p-3 bg-muted/20 border border-border/30 rounded-lg space-y-1.5">
                <div className="font-semibold text-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Regional Optimization
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Indian local payments will be prioritized via Razorpay to maximize UPI and local Netbanking conversion rates.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
