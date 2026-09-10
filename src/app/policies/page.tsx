'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';
import { Shield, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface PolicyItem {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  isActive: boolean;
}

interface PolicyCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  policies?: PolicyItem[];
}

export default function PoliciesDirectoryPage() {
  const [categories, setCategories] = useState<PolicyCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.POLICY_CATEGORIES}`);
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 text-xs font-semibold mb-4 border border-teal-200/50">
            <Shield className="h-3.5 w-3.5" />
            Compliance & Transparency
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Official Store Policies
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Review our complete legal agreements, security terms, customer privacy commitments, and delivery policies.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h2 className="text-lg font-bold">Policies Coming Soon</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Our legal team is finalizing the official guidelines.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const catPolicies = cat.policies || [];
              return (
                <Card key={cat.id} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-teal-600" />
                        {cat.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {catPolicies.length} {catPolicies.length === 1 ? 'Document' : 'Documents'}
                      </Badge>
                    </div>
                    {cat.description && (
                      <CardDescription className="text-xs text-muted-foreground mt-1">
                        {cat.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="divide-y divide-border/60">
                      {catPolicies.length > 0 ? (
                        catPolicies.map((p) => (
                          <Link
                            key={p.id}
                            href={`/policies/${p.slug}`}
                            className="flex items-center justify-between py-3 group hover:text-teal-600 transition-colors"
                          >
                            <span className="text-sm font-medium text-foreground group-hover:text-teal-600">
                              {p.title}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        ))
                      ) : (
                        <div className="py-3 text-xs text-muted-foreground italic">
                          No published documents under this category.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
