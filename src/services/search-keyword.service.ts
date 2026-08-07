import { API_BASE } from '@/constants';
import { fetchWithAuth } from '@/lib/api-client';

export interface SearchKeywordItem {
  id: number;
  keyword: string;
  type?: 'POPULAR' | 'TRENDING';
  priority?: number;
  isActive?: boolean;
  searchCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateKeywordInput {
  keyword: string;
  type: 'POPULAR' | 'TRENDING';
  priority?: number;
  isActive?: boolean;
}

export interface UpdateKeywordInput {
  keyword?: string;
  type?: 'POPULAR' | 'TRENDING';
  priority?: number;
  isActive?: boolean;
}

class SearchKeywordService {
  /**
   * Public: Get Popular Search Keywords
   */
  public async getPopularKeywords(): Promise<SearchKeywordItem[]> {
    try {
      const response = await fetch(`${API_BASE}/search/popular`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error('Failed to fetch popular search keywords:', error);
      return [];
    }
  }

  /**
   * Public: Get Trending Search Keywords
   */
  public async getTrendingKeywords(): Promise<SearchKeywordItem[]> {
    try {
      const response = await fetch(`${API_BASE}/search/trending`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : (data.data || []);
    } catch (error) {
      console.error('Failed to fetch trending search keywords:', error);
      return [];
    }
  }

  /**
   * Public Search Analytics: Track Keyword Click
   */
  public async trackSearchKeyword(keyword: string): Promise<void> {
    if (!keyword || !keyword.trim()) return;
    try {
      await fetch(`${API_BASE}/search/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });
    } catch (error) {
      // Silent error for tracking
    }
  }

  /**
   * Admin: Get all search keywords
   */
  public async getAdminKeywords(type?: string, search?: string): Promise<SearchKeywordItem[]> {
    const params = new URLSearchParams();
    if (type && type !== 'ALL') params.append('type', type);
    if (search && search.trim()) params.append('search', search.trim());

    const url = `${API_BASE}/admin/search-keywords${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch admin search keywords');
    }
    const result = await response.json();
    return result.data || result;
  }

  /**
   * Admin: Add new keyword
   */
  public async createKeyword(input: CreateKeywordInput): Promise<SearchKeywordItem> {
    const response = await fetchWithAuth(`${API_BASE}/admin/search-keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create search keyword');
    }
    return result.data || result;
  }

  /**
   * Admin: Edit keyword
   */
  public async updateKeyword(id: number, input: UpdateKeywordInput): Promise<SearchKeywordItem> {
    const response = await fetchWithAuth(`${API_BASE}/admin/search-keywords/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update search keyword');
    }
    return result.data || result;
  }

  /**
   * Admin: Delete keyword
   */
  public async deleteKeyword(id: number): Promise<void> {
    const response = await fetchWithAuth(`${API_BASE}/admin/search-keywords/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete search keyword');
    }
  }

  /**
   * Admin: Toggle status
   */
  public async updateKeywordStatus(id: number, isActive: boolean): Promise<SearchKeywordItem> {
    const response = await fetchWithAuth(`${API_BASE}/admin/search-keywords/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update status');
    }
    return result.data || result;
  }
}

export const searchKeywordService = new SearchKeywordService();
