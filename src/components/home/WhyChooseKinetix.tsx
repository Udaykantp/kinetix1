import React from 'react';
import {
  BatteryCharging,
  Cog,
  Factory,
  Handshake,
  IndianRupee,
  Leaf,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react';

interface PillarItem {
  id: string;
  line1: string;
  line2?: string;
  icon: React.ElementType;
}

const VALUE_PILLARS: PillarItem[] = [
  {
    id: 'premium-quality',
    line1: 'Premium',
    line2: 'Quality',
    icon: ShieldCheck,
  },
  {
    id: 'high-power',
    line1: 'High Power',
    line2: 'Output',
    icon: Zap,
  },
  {
    id: 'longer-backup',
    line1: 'Longer Backup',
    line2: 'Time',
    icon: BatteryCharging,
  },
  {
    id: 'advanced-tech',
    line1: 'Advanced',
    line2: 'Technology',
    icon: Cog,
  },
  {
    id: 'reliable-support',
    line1: 'Reliable',
    line2: 'Support',
    icon: Handshake,
  },
  {
    id: 'eco-friendly',
    line1: 'Eco-Friendly',
    line2: 'Solution',
    icon: Leaf,
  },
  {
    id: 'fast-delivery',
    line1: 'Fast & Secure',
    line2: 'Delivery',
    icon: Truck,
  },
  {
    id: 'cost-effective',
    line1: 'Cost Effective',
    line2: 'Performance',
    icon: IndianRupee,
  },
  {
    id: 'safety-first',
    line1: 'Safety First',
    icon: ShieldCheck,
  },
  {
    id: 'wide-industry',
    line1: 'Wide Industry',
    line2: 'Applications',
    icon: Factory,
  },
];

export const WhyChooseKinetix: React.FC = () => {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="relative py-20 sm:py-24 overflow-hidden bg-white border-b border-[#0B3027]/10"
    >
      {/* Subtle Architectural Flowing Contour Wave Lines (Top-Right & Bottom-Left) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <svg
          viewBox="0 0 1440 520"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full opacity-55"
        >
          {/* Top-right sweeping contour lines */}
          <path
            d="M980 210C1110 140 1230 35 1440 12"
            stroke="#0B3027"
            strokeOpacity="0.07"
            strokeWidth="1"
          />
          <path
            d="M960 232C1105 162 1240 58 1440 34"
            stroke="#0B3027"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          <path
            d="M940 256C1098 186 1252 84 1440 58"
            stroke="#C58A32"
            strokeOpacity="0.09"
            strokeWidth="1"
          />
          <path
            d="M920 280C1090 212 1264 110 1440 86"
            stroke="#0B3027"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
          {/* Left mid-sweep contour lines */}
          <path
            d="M0 155C145 190 280 185 430 130"
            stroke="#0B3027"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          <path
            d="M0 178C155 212 292 204 445 148"
            stroke="#C58A32"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
          <path
            d="M0 445C170 432 320 475 510 520"
            stroke="#0B3027"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          <path
            d="M0 468C160 456 302 492 468 520"
            stroke="#C58A32"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        </svg>

        {/* Soft Champagne-Gold Curved Horizon Glow (Bottom-Right) */}
        <div
          className="absolute -bottom-24 -right-16 w-[440px] h-[220px] rounded-full blur-2xl opacity-35"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(217, 174, 109, 0.55) 0%, rgba(217, 174, 109, 0) 72%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center justify-center gap-3.5 mb-3">
            <span
              aria-hidden="true"
              className="h-px w-10 sm:w-16 bg-[#D9AE6D]/75"
            />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-[#B88635]">
              Why Choose KINETIX
            </span>
            <span
              aria-hidden="true"
              className="h-px w-10 sm:w-16 bg-[#D9AE6D]/75"
            />
          </div>

          <h2
            id="why-choose-heading"
            className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] text-[#101820] leading-[1.12] text-balance"
          >
            Built for <span className="kinetix-gold-text">Performance</span>, Designed for
            Trust
          </h2>

          <p className="text-sm sm:text-base text-[#52605C] mt-3 leading-relaxed">
            Delivering reliable, efficient and intelligent power solutions for a smarter
            tomorrow.
          </p>
        </div>

        {/* 2x5 Symmetrical Value Pillar Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {VALUE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="group bg-white rounded-[16px] px-3 py-3.5 sm:px-4 sm:py-5 shadow-[0_10px_30px_rgba(16,24,32,0.055)] hover:shadow-[0_16px_38px_rgba(11,48,39,0.1)] border border-[#0B3027]/7 hover:border-[#D9AE6D]/55 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2.5 sm:gap-3.5 min-w-0"
              >
                {/* Warm Champagne Circular Icon Medallion */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FAF4E8] group-hover:bg-[#0B3027] text-[#9A6B21] group-hover:text-[#D9AE6D] flex items-center justify-center transition-colors shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.9} />
                </div>

                {/* Fine Vertical Champagne Divider */}
                <span
                  aria-hidden="true"
                  className="h-6 sm:h-7 w-px bg-[#E8DEC8] shrink-0"
                />

                {/* Bold Two-Line Label */}
                <div className="text-xs sm:text-[14px] font-bold text-[#101820] leading-snug tracking-[-0.01em] min-w-0">
                  <span className="block truncate">{pillar.line1}</span>
                  {pillar.line2 && <span className="block truncate">{pillar.line2}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
