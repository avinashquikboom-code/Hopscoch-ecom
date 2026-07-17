import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Information We Collect</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, phone number, shipping address, and payment information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">How We Use Your Information</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We use the information we collect to process your orders, send you updates about your orders, provide customer support, improve our services, and send you marketing communications (with your consent).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Information Sharing</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We do not sell your personal information. We may share your information with third parties who help us operate our business, such as payment processors, shipping companies, and analytics providers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Data Security</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Your Rights</h2>
              <p className="text-gray-700 dark:text-gray-300">
                You have the right to access, update, or delete your personal information. You can also opt out of marketing communications at any time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Children's Privacy</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at privacy@fciseller.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
