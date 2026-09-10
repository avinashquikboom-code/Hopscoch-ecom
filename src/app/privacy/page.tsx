import PolicyView from '@/components/policy/PolicyView';

export const metadata = {
  title: 'Privacy Policy | Fashion City India Ltd',
  description: 'Learn about how Fashion City India Ltd protects your personal data and privacy.',
};

export default function PrivacyPage() {
  return <PolicyView slug="privacy-policy" defaultTitle="Privacy Policy" />;
}
