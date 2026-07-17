import { Card, CardContent } from '@/components/ui/card';

const faqs = [
  {
    question: "What are your shipping options?",
    answer: "We offer free shipping on orders above ₹499. For orders below ₹499, standard shipping costs ₹49. Express shipping is available for an additional fee."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Products must be unworn, unwashed, and in their original packaging with tags attached."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking number. You can use this number to track your order on our website or the carrier's website."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit cards, debit cards, UPI, net banking, and cash on delivery (COD) for eligible orders."
  },
  {
    question: "How do I choose the right size?",
    answer: "We provide detailed size charts for each product. You can find the size guide on the product page. If you're unsure, we recommend measuring your child and comparing with our size chart."
  },
  {
    question: "Are your products safe for children?",
    answer: "Yes, all our products are made from child-safe materials and comply with safety standards. We prioritize quality and safety in all our products."
  },
  {
    question: "Can I cancel my order?",
    answer: "Orders can be cancelled within 24 hours of placing them, provided they haven't been shipped yet. Please contact our customer support for cancellation requests."
  },
  {
    question: "Do you offer gift wrapping?",
    answer: "Yes, we offer gift wrapping services for an additional fee. You can select this option during checkout."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach our customer support team via email at support@fciseller.com or call us at +91 1800-123-4567. Our support team is available 24/7."
  },
  {
    question: "Do you have physical stores?",
    answer: "Currently, we are an online-only store. However, we have easy return options if you're not satisfied with your purchase."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Frequently Asked Questions</h1>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
