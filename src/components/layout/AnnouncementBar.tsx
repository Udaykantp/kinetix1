import React, { useState } from 'react';
import { ShieldCheck, Truck, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#F8F9FA] border-b border-gray-200 text-xs text-gray-600 py-2 px-4 relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden sm:flex items-center gap-2 text-[#B59562] font-medium">
          <Truck className="w-3.5 h-3.5" />
          <span>Doorstep Installation in 45+ Cities within 4 Hours</span>
        </div>

        <div className="flex-1 text-center font-medium text-gray-900 text-[11px] sm:text-xs truncate sm:whitespace-normal">
          <span className="hidden sm:inline">Direct Factory Warranty & Free Battery Scrap Buyback up to ₹1,500</span>
          <span className="sm:hidden inline">Doorstep Fitment & Scrap Rebate · 45+ Cities</span>
          <span className="hidden md:inline ml-3 text-[#A87555] font-semibold">
            Use Code: VOLT15 for 15% OFF
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B59562]" />
            <span>BIS & ISO Certified</span>
          </div>
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss announcement"
            className="text-gray-400 hover:text-gray-700 transition-colors p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
