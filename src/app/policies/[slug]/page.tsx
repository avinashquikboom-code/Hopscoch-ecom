import PolicyView from '@/components/policy/PolicyView';

interface PolicySlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DynamicPolicyPage({ params }: PolicySlugPageProps) {
  const { slug } = await params;
  const formattedTitle = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return <PolicyView slug={slug} defaultTitle={formattedTitle} />;
}
