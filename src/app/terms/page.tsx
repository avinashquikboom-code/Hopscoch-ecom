import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms & Conditions</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Acceptance of Terms</h2>
              <p className="text-gray-700 dark:text-gray-300">
                By accessing or using FCISeller, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Account Registration</h2>
              <p className="text-gray-700 dark:text-gray-300">
                To access certain features of our website, you must register for an account. You agree to provide accurate and complete information during registration.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Products and Pricing</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We strive to display accurate product information and pricing. However, we do not warrant that product descriptions are error-free. Prices are subject to change without notice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Orders and Payment</h2>
              <p className="text-gray-700 dark:text-gray-300">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be made at the time of purchase.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Shipping and Delivery</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Shipping times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Returns and Refunds</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Please refer to our Return Policy for detailed information about returns and refunds.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Intellectual Property</h2>
              <p className="text-gray-700 dark:text-gray-300">
                All content on this website, including text, images, and logos, is the property of FCISeller and protected by copyright laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300">
                FCISeller shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Governing Law</h2>
              <p className="text-gray-700 dark:text-gray-300">
                These terms shall be governed by the laws of India. Any disputes shall be resolved in the courts of Mumbai, India.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
