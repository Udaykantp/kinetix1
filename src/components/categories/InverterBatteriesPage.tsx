import React from 'react';
import { BatteryCategoryLayout, BatteryCategoryPageConfig } from './BatteryCategoryLayout';
import inverterBatteryHeroImg from '../../assets/images/product_inverter_battery_1794476149979.jpg';

const INVERTER_BATTERIES_CONFIG: BatteryCategoryPageConfig = {
  category: 'inverter',
  pageType: 'inverter-batteries',
  title: 'Inverter Batteries',
  eyebrow: 'Home & Commercial Backup',
  headline: 'Deep-cycle tall tubular batteries for unbroken home backup.',
  description:
    'High-pressure cast spine tall tubular inverter batteries engineered for prolonged summer power cuts, rapid grid recharge recovery, and minimal distilled-water top-up intervals.',
  heroImage: inverterBatteryHeroImg,
  heroImageAlt: 'Heavy-duty tall tubular home inverter battery',
  buyingTip:
    'For a standard 2BHK home running 3 ceiling fans, 4 LED lights, Wi-Fi router, and a TV (~400W load) for 4–6 hours, select a 150Ah to 220Ah tall tubular battery paired with a pure sine wave inverter.',
  heroStats: [
    { value: '150–220 Ah', label: 'Deep-cycle capacity range' },
    { value: '1,800+ Cycles', label: 'HADI cast spine durability' },
    { value: 'Up to 72M', label: 'Authorized brand warranty' },
  ],
  selectionGuideTitle: 'Sizing an inverter battery for your home',
  selectionGuideItems: [
    {
      title: 'Calculate your total backup wattage & outage duration',
      detail:
        'Sum the watts of fans (75W each), LED lights (15W), laptop/Wi-Fi (100W), and TV (120W). Multiply watts by desired backup hours and divide by 10 to estimate required Ah at 12V.',
    },
    {
      title: 'Choose Tall Tubular over flat plate for frequent outages',
      detail:
        'High-pressure 100-bar cast gauntlet spines hold active material securely during 80% deep discharges, delivering nearly double the service life of flat-plate designs.',
    },
    {
      title: 'Low-antimony alloy minimizes maintenance',
      detail:
        'Modern low-antimony tubular grids drastically reduce electrolyte evaporation, bringing distilled water top-ups down to roughly once every 9–12 months.',
    },
  ],
  secondaryCta: {
    label: 'Open Load & Ah Calculator',
    targetPage: 'buying-guide',
  },
  faqs: [
    {
      q: 'How many hours of backup does a 150Ah vs 220Ah inverter battery give?',
      a: 'At a typical 400W household load (3 fans, 4 lights, Wi-Fi), a 150Ah tall tubular unit delivers roughly 3.5 to 4 hours, while a 220Ah heavy-duty unit extends backup to 5.5 to 6.5 hours.',
    },
    {
      q: 'Are these batteries compatible with Luminous, Microtek, and Exide inverters?',
      a: 'Yes. All 12V tall tubular batteries in this catalog are universally compatible with major pure sine wave and square wave home inverters — simply set the inverter switch to "Tubular" charging mode.',
    },
  ],
};

export const InverterBatteriesPage: React.FC = () => {
  return (
    <BatteryCategoryLayout config={INVERTER_BATTERIES_CONFIG}>
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="pt-1 md:pt-0">
          <div className="text-xs font-mono font-semibold text-[#B5812B] uppercase tracking-wider">
            1BHK – 2BHK Apartments
          </div>
          <div className="text-sm font-bold text-[#073B32] mt-1">150 Ah · ~3.5–4.5 Hrs Backup</div>
          <p className="text-xs text-[#5C6663] mt-1 leading-relaxed">
            Supports 3 fans, 4 LEDs, router, and laptops cleanly on 900VA–1100VA pure sine inverters.
          </p>
        </div>
        <div className="pt-4 md:pt-0 md:pl-5">
          <div className="text-xs font-mono font-semibold text-[#B5812B] uppercase tracking-wider">
            2BHK – 3BHK Homes
          </div>
          <div className="text-sm font-bold text-[#073B32] mt-1">160–165 Ah · ~4.5–5.5 Hrs Backup</div>
          <p className="text-xs text-[#5C6663] mt-1 leading-relaxed">
            Balanced 3D-grid tubular reserve for work-from-home desks, TV, and evening outages.
          </p>
        </div>
        <div className="pt-4 md:pt-0 md:pl-5">
          <div className="text-xs font-mono font-semibold text-[#B5812B] uppercase tracking-wider">
            Independent Villas & Shops
          </div>
          <div className="text-sm font-bold text-[#073B32] mt-1">220 Ah · ~6–8 Hrs Backup</div>
          <p className="text-xs text-[#5C6663] mt-1 leading-relaxed">
            Maximum single-battery reserve engineered for areas with prolonged 6+ hour summer cuts.
          </p>
        </div>
      </div>
    </BatteryCategoryLayout>
  );
};
