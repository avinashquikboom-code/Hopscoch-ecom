import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, MessageSquare, ChevronRight, HelpCircle, ShieldCheck, Clock } from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

const helpTopics = [
  {
    title: 'Orders & Tracking',
    description: 'Check status, edit shipping address, or track courier dispatch',
    href: '/orders',
  },
  {
    title: 'Returns & Refunds',
    description: 'View return guidelines and request alterations or exchanges',
    href: '/return-policy',
  },
  {
    title: 'Frequently Asked Questions',
    description: 'Instant answers to sizing, delivery, and payment questions',
    href: '/faq',
  },
];

const faqs = [
  {
    q: 'How does Bespoke Sizing work?',
    a: 'Our bespoke tailoring program utilizes advanced sizing recommendation algorithms linked directly to historical European custom measurement charts. When placing an order, simply select your nearest size. Our personal concierge team will contact you for custom adjustments.',
  },
  {
    q: 'What are your secure billing parameters?',
    a: 'FCISELLER operates strictly under certified PCI-DSS secure billing standards. No credit card numbers or security credentials are ever cached on our external servers.',
  },
  {
    q: 'What is your delivery timeline?',
    a: 'All garments are dispatched with elite, fully-insured couriers (DHL Express, FedEx, Delhivery). Delivery generally takes 1-3 business days across India.',
  },
  {
    q: 'How do I contact customer support?',
    a: 'You can reach our dedicated concierge team via email at fashioncityinidia18@gmail.com or call us directly at +91 96015 11596.',
  },
];

export default function HelpCenterPage() {
  const dialablePhone = CONTACT_INFO.PHONE.replace(/\s+/g, '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-[#0d9488] dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            24/7 Concierge Support
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Browse essential topics or get in touch directly with our support team.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Call Us Card */}
          <Card className="hover:shadow-lg transition-all border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/10">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Call Us</CardTitle>
                <p className="text-xs text-muted-foreground">Direct telephone assistance</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <a 
                href={`tel:${dialablePhone}`} 
                className="inline-block text-lg font-bold text-emerald-600 dark:text-emerald-400 hover:underline tracking-wide"
              >
                {CONTACT_INFO.PHONE}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tap to dial directly from your mobile device.
              </p>
            </CardContent>
          </Card>

          {/* Email Support Card */}
          <Card className="hover:shadow-lg transition-all border-blue-500/20 bg-blue-50/30 dark:bg-blue-950/10">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Email Support</CardTitle>
                <p className="text-xs text-muted-foreground">General & order inquiries</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <a 
                href={`mailto:${CONTACT_INFO.EMAIL}`} 
                className="inline-block text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {CONTACT_INFO.EMAIL}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Typical response time: under 2 hours.
              </p>
            </CardContent>
          </Card>

          {/* Visit Store / Registered Office */}
          <Card className="hover:shadow-lg transition-all border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/10 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Store & Headquarters</CardTitle>
                <p className="text-xs text-muted-foreground">Paldi, Ahmedabad</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <p className="leading-relaxed">
                {CONTACT_INFO.ADDRESS}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_INFO.ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline mt-1"
              >
                View on Google Maps <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </CardContent>
          </Card>

        </div>

        {/* Quick Assistance Topics */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {helpTopics.map((topic) => (
              <Link 
                key={topic.title} 
                href={topic.href}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 shadow-xs hover:border-[#0d9488] dark:hover:border-teal-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#0d9488] dark:group-hover:text-teal-400 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {topic.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#0d9488] dark:text-teal-400 mt-4">
                  Explore <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Common Inquiries</h2>
          <Card>
            <CardContent className="divide-y divide-gray-100 dark:divide-gray-800 p-6">
              {faqs.map((faq, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                    {faq.q}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
