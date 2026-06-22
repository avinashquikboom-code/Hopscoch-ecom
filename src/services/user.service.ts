import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { Address, User } from '@/types';

export const userService = {
  async getAddresses(): Promise<Address[]> {
    return apiClient.get<Address[]>(API_ENDPOINTS.USER_ADDRESSES);
  },

  async addAddress(address: Omit<Address, 'id' | 'userId'>): Promise<Address> {
    return apiClient.post<Address>(API_ENDPOINTS.USER_ADDRESSES, address);
  },

  async updateAddress(id: string, address: Partial<Address>): Promise<Address> {
    return apiClient.put<Address>(API_ENDPOINTS.USER_ADDRESS(id), address);
  },

  async deleteAddress(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.USER_ADDRESS(id));
  },

  async setDefaultAddress(id: string): Promise<Address> {
    return apiClient.patch<Address>(API_ENDPOINTS.USER_ADDRESS(id), { isDefault: true });
  },
};
