import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">About Hopscotch</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Founded in 2024, Hopscotch has grown from a small startup to one of India's leading e-commerce platforms. Our mission is to make quality products accessible to everyone at affordable prices. We believe in providing an exceptional shopping experience with a focus on customer satisfaction, product quality, and innovation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To be the most trusted and customer-centric e-commerce platform, offering a wide range of products at competitive prices while ensuring the highest standards of quality and service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Customer First</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We prioritize our customers' needs and strive to exceed their expectations with every interaction.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Quality Assurance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Every product on our platform goes through rigorous quality checks to ensure customer satisfaction.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Innovation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We continuously innovate our platform and services to provide the best shopping experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Why Choose Us?</h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>• Wide range of products across multiple categories</li>
              <li>• Competitive prices and regular discounts</li>
              <li>• Fast and reliable shipping</li>
              <li>• Easy returns and refunds</li>
              <li>• Secure payment options</li>
              <li>• 24/7 customer support</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
