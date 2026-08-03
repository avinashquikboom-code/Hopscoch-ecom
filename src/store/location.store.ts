import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocationData {
  pincode: string;
  city: string;
  state: string;
  country: string;
  formattedLocation: string;
  isAutoDetected?: boolean;
}

interface LocationState extends LocationData {
  setLocation: (data: Partial<LocationData>) => void;
  setPincode: (pincode: string) => Promise<boolean>;
  detectLocation: () => Promise<void>;
}

// Common Indian Pincode database for offline instant lookup
const PINCODE_DB: Record<string, { city: string; state: string }> = {
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '411036': { city: 'Pune (Mundhwa)', state: 'Maharashtra' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '400050': { city: 'Bandra, Mumbai', state: 'Maharashtra' },
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '452001': { city: 'Indore', state: 'Madhya Pradesh' },
  '160017': { city: 'Chandigarh', state: 'Punjab' },
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      pincode: '411001',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      formattedLocation: 'Pune, 411001',
      isAutoDetected: false,

      setLocation: (data: Partial<LocationData>) => {
        set((state) => {
          const pincode = data.pincode || state.pincode;
          const city = data.city || state.city;
          const formattedLocation = city && pincode ? `${city}, ${pincode}` : pincode;
          return {
            ...state,
            ...data,
            pincode,
            city,
            formattedLocation,
          };
        });
      },

      setPincode: async (pincode: string) => {
        const cleanPin = pincode.trim().replace(/\D/g, '');
        if (cleanPin.length !== 6) return false;

        // Check local DB first
        if (PINCODE_DB[cleanPin]) {
          const { city, state } = PINCODE_DB[cleanPin];
          set({
            pincode: cleanPin,
            city,
            state,
            country: 'India',
            formattedLocation: `${city}, ${cleanPin}`,
            isAutoDetected: false,
          });
          return true;
        }

        // Try free Postal Pincode API
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
          const json = await res.json();
          if (Array.isArray(json) && json[0]?.Status === 'Success' && json[0]?.PostOffice?.length > 0) {
            const po = json[0].PostOffice[0];
            const city = po.District || po.Block || po.Name;
            const state = po.State;
            set({
              pincode: cleanPin,
              city,
              state,
              country: 'India',
              formattedLocation: `${city}, ${cleanPin}`,
              isAutoDetected: false,
            });
            return true;
          }
        } catch {
          // Fallback generic city
        }

        set({
          pincode: cleanPin,
          city: 'India',
          state: 'MH',
          country: 'India',
          formattedLocation: `Pincode ${cleanPin}`,
          isAutoDetected: false,
        });
        return true;
      },

      detectLocation: async () => {
        if (typeof window === 'undefined' || !navigator.geolocation) return;

        return new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const { latitude, longitude } = pos.coords;
                const res = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );
                const data = await res.json();
                const city = data.city || data.locality || data.principalSubdivision || 'Pune';
                const pincode = data.postcode || '411001';
                const state = data.principalSubdivision || 'Maharashtra';
                set({
                  pincode,
                  city,
                  state,
                  country: data.countryName || 'India',
                  formattedLocation: `${city}, ${pincode}`,
                  isAutoDetected: true,
                });
              } catch {
                // Keep current location on failure
              }
              resolve();
            },
            () => {
              // Permission denied or error — keep default
              resolve();
            },
            { timeout: 8000 }
          );
        });
      },
    }),
    {
      name: 'user_location_data',
    }
  )
);
