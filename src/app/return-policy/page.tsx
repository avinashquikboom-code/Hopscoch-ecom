import PolicyView from '@/components/policy/PolicyView';

export const metadata = {
  title: 'Return & Refund Policy | Fashion City India Ltd',
  description: 'Understand the return window, refund process, and inspection guidelines of Fashion City India Ltd.',
};

export default function ReturnPolicyPage() {
  return <PolicyView slug="return-refund-policy" defaultTitle="Return & Refund Policy" />;
}
