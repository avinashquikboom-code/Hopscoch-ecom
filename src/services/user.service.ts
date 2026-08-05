import { API_BASE, API_ENDPOINTS } from '@/constants';
import { fetchWithAuth } from '@/lib/api-client';
import { Address } from '@/types';

export const userService = {
  async getAddresses(): Promise<Address[]> {
    try {
      let res = await fetchWithAuth(`${API_BASE}/api${API_ENDPOINTS.USER_ADDRESSES}`);
      if (!res.ok) {
        res = await fetchWithAuth(`${API_BASE}/api/addresses`);
      }
      if (!res.ok) return [];
      const json = await res.json();
      const list = json?.data ?? json ?? [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  async addAddress(address: Omit<Address, 'id' | 'userId'>): Promise<Address> {
    let res = await fetchWithAuth(`${API_BASE}/api${API_ENDPOINTS.USER_ADDRESSES}`, {
      method: 'POST',
      body: JSON.stringify(address),
    });
    if (!res.ok) {
      res = await fetchWithAuth(`${API_BASE}/api/addresses`, {
        method: 'POST',
        body: JSON.stringify(address),
      });
    }
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return json?.data ?? json;
  },

  async updateAddress(id: string, address: Partial<Address>): Promise<Address> {
    let res = await fetchWithAuth(`${API_BASE}/api${API_ENDPOINTS.USER_ADDRESS(id)}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    });
    if (!res.ok) {
      res = await fetchWithAuth(`${API_BASE}/api/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(address),
      });
    }
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return json?.data ?? json;
  },

  async deleteAddress(id: string): Promise<void> {
    let res = await fetchWithAuth(`${API_BASE}/api${API_ENDPOINTS.USER_ADDRESS(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      res = await fetchWithAuth(`${API_BASE}/api/addresses/${id}`, {
        method: 'DELETE',
      });
    }
  },

  async setDefaultAddress(id: string): Promise<Address> {
    let res = await fetchWithAuth(`${API_BASE}/api${API_ENDPOINTS.USER_ADDRESS(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ isDefault: true }),
    });
    if (!res.ok) {
      res = await fetchWithAuth(`${API_BASE}/api/addresses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isDefault: true }),
      });
    }
    const json = await res.json();
    if (!res.ok) throw { response: { data: json } };
    return json?.data ?? json;
  },
};
