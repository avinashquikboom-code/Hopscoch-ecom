import PolicyView from '@/components/policy/PolicyView';

export const metadata = {
  title: 'Terms & Conditions | Fashion City India Ltd',
  description: 'Review the Terms and Conditions for using Fashion City India Ltd website and mobile services.',
};

export default function TermsPage() {
  return <PolicyView slug="terms-and-conditions" defaultTitle="Terms & Conditions" />;
}
