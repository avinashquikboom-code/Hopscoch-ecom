import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { Address, User } from '@/types';

export const userService = {
  async getAddresses(): Promise<Address[]> {
    const res: any = await apiClient.get(API_ENDPOINTS.USER_ADDRESSES);
    const list = res?.data ?? res ?? [];
    return Array.isArray(list) ? list : [];
  },

  async addAddress(address: Omit<Address, 'id' | 'userId'>): Promise<Address> {
    const res: any = await apiClient.post(API_ENDPOINTS.USER_ADDRESSES, address);
    return res?.data ?? res;
  },

  async updateAddress(id: string, address: Partial<Address>): Promise<Address> {
    const res: any = await apiClient.put(API_ENDPOINTS.USER_ADDRESS(id), address);
    return res?.data ?? res;
  },

  async deleteAddress(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.USER_ADDRESS(id));
  },

  async setDefaultAddress(id: string): Promise<Address> {
    const res: any = await apiClient.patch(API_ENDPOINTS.USER_ADDRESS(id), { isDefault: true });
    return res?.data ?? res;
  },
};
