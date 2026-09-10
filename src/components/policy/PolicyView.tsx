'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import { Shield, RefreshCw, AlertCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

interface PolicyData {
  id: number;
  title: string;
  slug: string;
  content: string;
  updatedAt?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface PolicyViewProps {
  slug: string;
  defaultTitle: string;
}

export default function PolicyView({ slug, defaultTitle }: PolicyViewProps) {
  const [policy, setPolicy] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicy = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.POLICY_BY_SLUG(slug)}`);
      if (res.ok) {
        const json = await res.json();
        setPolicy(json.data || null);
      } else {
        // Try fallback route
        const fallbackRes = await fetch(`${API_BASE_URL}/content/policies/${slug}`);
        if (fallbackRes.ok) {
          const fallbackJson = await fallbackRes.json();
          setPolicy(fallbackJson.data || null);
        } else {
          setError('Policy information is currently being updated.');
        }
      }
    } catch (err: any) {
      setError('Unable to reach policy service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/policies" className="hover:text-primary transition-colors">
              Legal & Policies
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{policy?.title || defaultTitle}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchPolicy}
            disabled={loading}
            className="text-xs flex items-center gap-1 text-muted-foreground"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Policy Container */}
        {loading ? (
          <Card className="border shadow-sm">
            <CardHeader className="space-y-3 pb-6">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-4/6" />
              <div className="pt-4 space-y-3">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border border-destructive/20 shadow-sm text-center py-12">
            <CardContent className="space-y-4">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
              <h2 className="text-xl font-bold text-foreground">{defaultTitle}</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
              <Button onClick={fetchPolicy} size="sm" className="mt-2">
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border shadow-sm">
            <CardHeader className="border-b pb-6">
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <Shield className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {policy?.category?.name || 'Official Store Policy'}
                </span>
              </div>
              <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {policy?.title || defaultTitle}
              </CardTitle>
              {policy?.updatedAt && (
                <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Last Updated: {new Date(policy.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="pt-8">
              <div
                className="prose prose-slate dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: policy?.content || '' }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
