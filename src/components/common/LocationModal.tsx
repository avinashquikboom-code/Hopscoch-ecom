'use client';

import { useState, useEffect } from 'react';
import { useLocationStore, useAuthStore } from '@/store';
import { useAddresses } from '@/hooks/use-addresses';
import { MapPin, Navigation, Check, X, Search, Building, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { pincode, city, setPincode, setLocation, detectLocation } = useLocationStore();
  const { isAuthenticated } = useAuthStore();
  const { data: addresses = [] } = useAddresses();

  const [inputPincode, setInputPincode] = useState(pincode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputPincode(pincode);
    }
  }, [isOpen, pincode]);

  if (!isOpen) return null;

  const handlePincodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(inputPincode.trim())) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    setIsSubmitting(true);
    const success = await setPincode(inputPincode.trim());
    setIsSubmitting(false);
    if (success) {
      toast.success(`Delivery location updated to ${inputPincode}`);
      onClose();
    } else {
      toast.error('Invalid pincode. Please try again.');
    }
  };

  const handleDetect = async () => {
    setIsDetecting(true);
    await detectLocation();
    setIsDetecting(false);
    toast.success('Location auto-detected!');
    onClose();
  };

  const handleSelectAddress = (addr: any) => {
    const pin = addr.pincode || addr.zipCode || '411001';
    const c = addr.city || 'Pune';
    const s = addr.state || 'Maharashtra';
    setLocation({
      pincode: pin,
      city: c,
      state: s,
      formattedLocation: `${addr.line1 ? `${addr.line1}, ` : ''}${c}, ${pin}`,
    });
    toast.success(`Delivery address selected (${pin})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-[#0d9488] flex items-center justify-center shadow-xs">
            <MapPin className="w-5 h-5 text-[#0d9488]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Choose Delivery Location</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Select address or enter pincode for delivery options</p>
          </div>
        </div>

        {/* Auto Detect Button */}
        <button
          onClick={handleDetect}
          disabled={isDetecting}
          className="w-full py-3 px-4 mb-4 rounded-xl border border-teal-200 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/30 text-[#0d9488] font-bold text-xs flex items-center justify-center gap-2 hover:bg-teal-100/60 dark:hover:bg-teal-900/40 transition-colors cursor-pointer"
        >
          {isDetecting ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#0d9488]" />
          ) : (
            <Navigation className="w-4 h-4 text-[#0d9488]" />
          )}
          <span>{isDetecting ? 'Detecting Location...' : 'Use My Current Location'}</span>
        </button>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-zinc-800 w-full" />
          <span className="bg-white dark:bg-zinc-900 px-3 text-[10px] uppercase font-bold text-gray-400 absolute">OR</span>
        </div>

        {/* Pincode Input Form */}
        <form onSubmit={handlePincodeSubmit} className="mb-5">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Enter Indian Pincode
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={inputPincode}
              onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 411036"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-[#0d9488]"
            />
            <Button
              type="submit"
              disabled={isSubmitting || inputPincode.length !== 6}
              className="bg-[#0d9488] hover:bg-[#0c857a] text-white font-bold px-5 rounded-xl text-xs"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
            </Button>
          </div>
        </form>

        {/* Saved Addresses List (If authenticated) */}
        {isAuthenticated && addresses.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-gray-400" />
              <span>Saved Addresses</span>
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {addresses.map((addr: any) => {
                const addrPin = addr.pincode || addr.zipCode || '';
                const isSelected = pincode === addrPin;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex justify-between items-center ${
                      isSelected
                        ? 'border-[#0d9488] bg-teal-50/40 dark:bg-teal-950/20'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <span>{addr.fullName || addr.name || 'Saved Address'}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] bg-teal-100 text-[#0d9488] px-1.5 py-0.2 rounded font-bold uppercase">Default</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[260px]">
                        {addr.line1}, {addr.city} - <span className="font-bold text-gray-700 dark:text-gray-300">{addrPin}</span>
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#0d9488] font-bold" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
