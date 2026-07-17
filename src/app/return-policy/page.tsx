import { Card, CardContent } from '@/components/ui/card';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Return Policy</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Return Period</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We accept returns within 30 days of delivery. The item must be unworn, unwashed, and in its original packaging with all tags attached.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">How to Initiate a Return</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Go to your Orders page and select the item you wish to return</li>
                <li>Choose a reason for the return from the provided options</li>
                <li>Schedule a pickup or drop off at your nearest location</li>
                <li>Once we receive and inspect the item, we will process your refund</li>
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Refund Process</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Refunds are processed within 7-10 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Non-Returnable Items</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Items marked as "Final Sale"</li>
                <li>Personalized or customized items</li>
                <li>Items without original tags or packaging</li>
                <li>Items that show signs of wear or damage</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Exchange Policy</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We offer free exchanges for size issues. If you need a different size, you can exchange it within 30 days of delivery. The item must be in its original condition.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Return Shipping</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Return shipping is free for defective items or wrong products sent. For other returns, a nominal shipping fee may apply.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about our return policy, please contact our customer support at returns@fciseller.com or call +91 1800-123-4567.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
