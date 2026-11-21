import React from 'react';
import { BatteryCategoryLayout, BatteryCategoryPageConfig } from './BatteryCategoryLayout';
import lithiumBatteryHeroImg from '../../assets/images/product_lithium_solar_1794476150273.jpg';

const LITHIUM_BATTERIES_CONFIG: BatteryCategoryPageConfig = {
  category: 'lithium',
  pageType: 'lithium-batteries',
  title: 'Lithium Batteries (LiFePO4)',
  eyebrow: 'Prismatic LiFePO4 Architecture',
  headline: 'Next-generation LiFePO4 storage with 6,000+ cycles.',
  description:
    'Aerospace-grade Lithium Iron Phosphate (LiFePO4) wall-mount and portable energy packs equipped with active-balancing Smart BMS, ultra-fast 2-hour recharge, zero fumes, and 10+ year service longevity.',
  heroImage: lithiumBatteryHeroImg,
  heroImageAlt: 'Wall-mounted LiFePO4 lithium energy storage system',
  buyingTip:
    'LiFePO4 packs unlock 90–95% usable Depth of Discharge (versus 50–60% for lead-acid) and recharge 4x faster — meaning a single 100Ah LiFePO4 unit often replaces nearly 180Ah of conventional tubular capacity.',
  heroStats: [
    { value: '6,000+ Cycles', label: 'At 80% Depth of Discharge' },
    { value: '2.0 Hours', label: '0–100% fast recharge time' },
    { value: 'Up to 120M', label: 'Long-horizon warranty' },
  ],
  selectionGuideTitle: 'Why upgrade to Lithium LiFePO4 storage',
  selectionGuideItems: [
    {
      title: 'Zero thermal runaway & indoor living-space safety',
      detail:
        'Unlike cobalt-based lithium batteries, Lithium Iron Phosphate (LiFePO4) remains thermally stable up to 270°C, emits zero acid fumes, and installs cleanly on indoor walls or closets.',
    },
    {
      title: 'Integrated Smart BMS with CAN / RS485 & Bluetooth',
      detail:
        'Built-in Battery Management Systems continuously balance prismatic cells and guard against over-voltage, deep discharge, short circuit, and thermal extremes.',
    },
    {
      title: 'Match system voltage (25.6V vs 51.2V nominal)',
      detail:
        'Choose 25.6V packs for 24V off-grid RVs, marine setups, and compact inverters; select 51.2V 5kWh wall-mount banks for 48V hybrid residential solar systems.',
    },
  ],
  secondaryCta: {
    label: 'Compare LiFePO4 Packs',
    targetPage: 'compare',
  },
  faqs: [
    {
      q: 'Is LiFePO4 safe to mount inside an apartment or home utility room?',
      a: 'Yes. Prismatic LiFePO4 chemistry is non-combustible, completely sealed with zero hydrogen off-gassing or acid odor, and meets BIS and IEC safety certifications for indoor residential spaces.',
    },
    {
      q: 'Can I connect multiple 51.2V lithium wall packs in parallel?',
      a: 'Yes. The Solaris H5 51.2V LiFePO4 wall system supports parallel expansion with synchronized CAN/RS485 inverter communication for scalable 5kWh to 30kWh home storage.',
    },
  ],
};

export const LithiumBatteriesPage: React.FC = () => {
  return (
    <BatteryCategoryLayout config={LITHIUM_BATTERIES_CONFIG}>
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="pt-1 md:pt-0">
          <div className="text-xs font-mono font-semibold text-[#B5812B] uppercase tracking-wider">
            Usable Energy Density
          </div>
          <div className="text-sm font-bold text-[#073B32] mt-1">90% – 95% Usable DoD</div>
          <p className="text-xs text-[#5C6663] mt-1 leading-relaxed">
            Flat voltage output from 100% down to 10% state of charge without inverter low-voltage cutouts.
          </p>
        </div>
        <div className="pt-4 md:pt-0 md:pl-5">
          <div className="text-xs font-mono font-semibold text-[#B5812B] uppercase tracking-wider">
            Total Cost of Ownership
          </div>
          <div className="text-sm font-bold text-[#073B32] mt-1">12 – 15 Year Lifespan</div>
          <p className="text-xs text-[#5C6663] mt-1 leading-relaxed">
            Outlasts 3 to 4 conventional lead-acid replacements with zero distilled water maintenance.
          </p>
        </div>
        <div className="pt-4 md:pt-0 md:pl-5">
          <div className="text-xs font-mono font-semibold text-[#B5812B] uppercase tracking-wider">
            Intelligent Protection
          </div>
          <div className="text-sm font-bold text-[#073B32] mt-1">Active Smart BMS</div>
          <p className="text-xs text-[#5C6663] mt-1 leading-relaxed">
            Real-time cell balancing, thermal cutoffs, and direct hybrid solar inverter telemetry.
          </p>
        </div>
      </div>
    </BatteryCategoryLayout>
  );
};
