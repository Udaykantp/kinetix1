import React from 'react';
import {
  ArrowRight,
  BatteryCharging,
  Bike,
  Car,
  Server,
  ShieldCheck,
  Wrench,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';
import { getCategoryPageType } from '../../utils/router';

// All 8 distinct high-resolution category images via ES imports
import carBatteryImg from '../../assets/images/product_car_battery_1794476149763.jpg';
import bikeBatteryImg from '../../assets/images/cat_bike_battery_1795185387964.jpg';
import inverterBatteryImg from '../../assets/images/product_inverter_battery_1794476149979.jpg';
import lithiumBatteryImg from '../../assets/images/product_lithium_solar_1794476150273.jpg';
import solarBatteryImg from '../../assets/images/cat_solar_battery_1795185352147.jpg';
import industrialBatteryImg from '../../assets/images/category_banner_industrial_1794476151052.jpg';
import upsBatteryImg from '../../assets/images/cat_ups_battery_1795185406017.jpg';
import accessoriesImg from '../../assets/images/hero_battery_titanium_1794476148118.jpg';

// Clean Solar Panel Grid SVG matching reference icon badge
const SolarGridIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 15L6.5 6H17.5L20 15H4Z" />
    <path d="M5.2 10.5H18.8" />
    <path d="M12 6V15" />
    <path d="M8.7 6L7.7 15" />
    <path d="M15.3 6L16.3 15" />
    <path d="M12 15V19" />
    <path d="M8.5 19H15.5" />
  </svg>
);

interface PrimaryCategoryItem {
  id: ProductCategory;
  title: string;
  subtitle: string;
  specLeft: string;
  specRight: string;
  icon: React.ElementType;
  image: string;
}

interface SecondaryCategoryItem {
  id: ProductCategory;
  title: string;
  specs: string;
  icon: React.ElementType;
  image: string;
}

const PRIMARY_CATEGORIES: PrimaryCategoryItem[] = [
  {
    id: 'car',
    title: 'Car Batteries',
    subtitle: 'AGM & Silver-Alloy start-stop ignition units',
    specLeft: '35Ah – 100Ah',
    specRight: 'Up to 760 CCA',
    icon: Car,
    image: carBatteryImg,
  },
  {
    id: 'bike',
    title: 'Bike Batteries',
    subtitle: 'VRLA Gel & high-power lithium motorcycle packs',
    specLeft: '2.5Ah – 9Ah',
    specRight: 'Spill-proof',
    icon: Bike,
    image: bikeBatteryImg,
  },
  {
    id: 'inverter',
    title: 'Inverter Batteries',
    subtitle: 'Heavy-duty Tall Tubular home & office backup',
    specLeft: '100Ah – 240Ah',
    specRight: '1800 Cycles',
    icon: Zap,
    image: inverterBatteryImg,
  },
  {
    id: 'lithium',
    title: 'Lithium-Ion LiFePO4',
    subtitle: 'Next-gen energy units with integrated smart BMS',
    specLeft: '12V / 24V / 48V',
    specRight: '6,000+ Cycles',
    icon: BatteryCharging,
    image: lithiumBatteryImg,
  },
];

const SECONDARY_CATEGORIES: SecondaryCategoryItem[] = [
  {
    id: 'solar',
    title: 'Solar Batteries',
    specs: '100Ah – 200Ah C10 Deep-Cycle',
    icon: SolarGridIcon,
    image: solarBatteryImg,
  },
  {
    id: 'industrial',
    title: 'Industrial Batteries',
    specs: '48V Enterprise Rack Arrays',
    icon: Server,
    image: industrialBatteryImg,
  },
  {
    id: 'ups',
    title: 'UPS Batteries',
    specs: '7.2Ah – 26Ah High-Rate AGM',
    icon: ShieldCheck,
    image: upsBatteryImg,
  },
  {
    id: 'accessories',
    title: 'Battery Accessories',
    specs: '7-Stage Smart Chargers & Copper Cables',
    icon: Wrench,
    image: accessoriesImg,
  },
];

export const CategoryGrid: React.FC = () => {
  const { navigate } = useStore();

  return (
    <section
      aria-labelledby="explore-categories-heading"
      className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-[#F3F6F4] to-[#FAF9F6] border-b border-[#0B3027]/10"
    >
      {/* Top-Right Sweeping Deep Forest Green Architectural Wave + Champagne Gold Lightning Silhouette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-[62%] sm:w-[48%] lg:w-[44%] h-[320px] sm:h-[380px] overflow-hidden"
      >
        <svg
          viewBox="0 0 640 380"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="catWaveOuter" x1="0.1" y1="0.8" x2="0.95" y2="0.05">
              <stop offset="0%" stopColor="#E6EDE9" stopOpacity="0.2" />
              <stop offset="48%" stopColor="#3D5740" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#0B3027" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient id="catWaveInner" x1="0.2" y1="0.9" x2="1" y2="0">
              <stop offset="0%" stopColor="#164A3B" stopOpacity="0.62" />
              <stop offset="100%" stopColor="#0B3027" stopOpacity="0.96" />
            </linearGradient>
          </defs>
          {/* Soft sage-mineral outer arc */}
          <path
            d="M40 380C175 260 220 115 305 0H640V320C530 310 385 350 245 380H40Z"
            fill="url(#catWaveOuter)"
          />
          {/* Deep forest green inner swoop */}
          <path
            d="M170 340C280 215 340 120 410 0H640V140C520 145 415 245 270 340H170Z"
            fill="url(#catWaveInner)"
          />
          {/* Subtle translucent champagne-gold lightning bolt emblem inside wave */}
          <path
            d="M368 42L294 166H348L322 256L416 124H360L368 42Z"
            fill="#D9AE6D"
            fillOpacity="0.32"
          />
        </svg>
      </div>

      {/* Bottom-Left Deep Forest & Warm Gold Sweeping Corner Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-[260px] sm:w-[360px] h-[160px] overflow-hidden"
      >
        <svg
          viewBox="0 0 360 160"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0 32C65 78 145 122 245 160H0V32Z"
            fill="#D9AE6D"
            fillOpacity="0.3"
          />
          <path
            d="M0 78C58 106 112 134 176 160H0V78Z"
            fill="#0B3027"
            fillOpacity="0.92"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#0B3027]">
                Engineered For A Powerful Tomorrow
              </span>
              <span
                aria-hidden="true"
                className="hidden sm:block h-px w-36 bg-[#C58A32]/50"
              />
            </div>

            <h2
              id="explore-categories-heading"
              className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold tracking-[-0.03em] text-[#101820] leading-[1.06]"
            >
              Explore <span className="kinetix-gold-text">Battery</span> Categories
            </h2>

            <p className="text-sm sm:text-base font-medium text-[#3D4A45] mt-2.5">
              Reliable power solutions for every need.
            </p>
          </div>

          {/* Floating White Pill CTA with Deep Forest Circular Arrow */}
          <button
            type="button"
            onClick={() => navigate('all-batteries')}
            className="group max-w-full inline-flex items-center gap-2.5 sm:gap-3.5 pl-4 pr-1.5 py-1.5 sm:pl-5 sm:pr-2 sm:py-2 rounded-full bg-white/95 hover:bg-white shadow-[0_12px_30px_rgba(11,48,39,0.12)] hover:shadow-[0_16px_36px_rgba(11,48,39,0.2)] border border-[#D9AE6D]/35 transition-all active:scale-[0.98] self-start md:self-center"
          >
            <span className="text-xs sm:text-[13px] font-semibold text-[#101820] truncate">
              View All Engineering Products
            </span>
            <span className="w-9 h-9 rounded-full bg-[#0B3027] group-hover:bg-[#C58A32] text-[#FAF9F6] flex items-center justify-center transition-colors shrink-0">
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>

        {/* ROW 1: 4 Primary Detailed Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {PRIMARY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(getCategoryPageType(cat.id))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(getCategoryPageType(cat.id));
                  }
                }}
                className="group relative bg-white rounded-[20px] overflow-hidden shadow-[0_14px_34px_rgba(16,24,32,0.07)] hover:shadow-[0_22px_48px_rgba(11,48,39,0.14)] border border-[#0B3027]/8 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3027]"
              >
                {/* Top Studio Photograph */}
                <div className="relative h-48 w-full overflow-hidden bg-[#ECEFE9]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Floating White Rounded-Square Icon Tile */}
                  <div className="absolute top-3.5 left-3.5 w-11 h-11 rounded-[12px] bg-white/95 backdrop-blur-sm shadow-[0_6px_16px_rgba(16,24,32,0.14)] flex items-center justify-center text-[#0B3027] group-hover:text-[#C58A32] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* White Content & Specs Body */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#101820] tracking-[-0.02em] group-hover:text-[#0B3027] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[13px] text-[#4A5652] mt-1 leading-snug">
                      {cat.subtitle}
                    </p>
                  </div>

                  {/* Specs + Deep Forest Circular Arrow Button */}
                  <div className="mt-5 pt-3 border-t border-[#0B3027]/8 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-[#101820] min-w-0 tabular-nums">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Zap className="w-3.5 h-3.5 text-[#C58A32] fill-[#C58A32] shrink-0" />
                        <span>{cat.specLeft}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-3 w-px bg-[#0B3027]/20 shrink-0"
                      />
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0B3027] shrink-0" />
                        <span>{cat.specRight}</span>
                      </span>
                    </div>

                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-full bg-[#0B3027] group-hover:bg-[#C58A32] text-[#FAF9F6] flex items-center justify-center transition-colors shrink-0"
                    >
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ROW 2: 4 Compact Full-Bleed Photographic Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-5 sm:mt-6">
          {SECONDARY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(getCategoryPageType(cat.id))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(getCategoryPageType(cat.id));
                  }
                }}
                className="group relative h-[196px] rounded-[20px] overflow-hidden shadow-[0_14px_34px_rgba(16,24,32,0.1)] hover:shadow-[0_22px_48px_rgba(11,48,39,0.18)] border-2 border-white bg-[#101820] transition-all duration-300 hover:-translate-y-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3027]"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Measured Bottom Legibility Scrim */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0B1C17]/88 via-[#101820]/20 to-transparent"
                />

                {/* Top-Left Floating White Icon Tile */}
                <div className="absolute top-3.5 left-3.5 w-11 h-11 rounded-[12px] bg-white/95 backdrop-blur-sm shadow-[0_6px_16px_rgba(16,24,32,0.16)] flex items-center justify-center text-[#0B3027] group-hover:text-[#C58A32] transition-colors">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Bottom Overlay Title + Circular Deep Forest Arrow */}
                <div className="absolute inset-x-4 bottom-3.5 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-[#FAF9F6] leading-tight truncate">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-[#D9AE6D] font-medium truncate mt-0.5">
                      {cat.specs}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="w-9 h-9 rounded-full bg-[#0B3027]/90 border border-[#D9AE6D]/35 group-hover:bg-[#C58A32] group-hover:border-[#C58A32] text-[#FAF9F6] flex items-center justify-center transition-colors shrink-0"
                  >
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
