import { useQuery } from '@tanstack/react-query';
import { API_BASE } from '@/constants';

export interface GiftWrapConfig {
  enabled: boolean;
  charge: number;
}

async function fetchGiftWrapConfig(): Promise<GiftWrapConfig> {
  const res = await fetch(`${API_BASE}/api/config/gift-wrap`);
  const json = await res.json();
  if (!res.ok) {
    // Backend unreachable — fall back to sane defaults so the page still renders
    return { enabled: true, charge: 49 };
  }
  return json.data ?? json ?? { enabled: true, charge: 49 };
}

export function useGiftWrapConfig() {
  return useQuery<GiftWrapConfig>({
    queryKey: ['gift-wrap-config'],
    queryFn: fetchGiftWrapConfig,
    // Gift-wrap config almost never changes. Cache for 30 min, stale for 5 min.
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    // Graceful fallback if fetch fails
    placeholderData: { enabled: true, charge: 49 },
  });
}
