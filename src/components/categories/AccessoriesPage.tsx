import React from 'react';
import { BatteryCategoryLayout, BatteryCategoryPageConfig } from './BatteryCategoryLayout';
import accessoriesHeroImg from '../../assets/images/pdp_macro_craft_terminal_1795162651910.jpg';

const ACCESSORIES_CONFIG: BatteryCategoryPageConfig = {
  category: 'accessories',
  pageType: 'accessories',
  title: 'Accessories',
  eyebrow: 'Charging, Cabling & Diagnostics',
  headline: 'Precision battery accessories engineered for peak endurance.',
  description:
    'Microprocessor 8-stage smart desulfation chargers, heavy-gauge 35 sq.mm oxygen-free pure copper inverter cables, and corrosion-resistant hardware designed to extend battery service life and eliminate voltage drop.',
  heroImage: accessoriesHeroImg,
  heroImageAlt: 'Precision machined copper battery terminals and charging accessories',
  buyingTip:
    'Undersized aluminum-clad inverter wires waste up to 12% of battery runtime as heat. Upgrading to crimped 35 sq.mm oxygen-free pure copper cables delivers cooler joints and longer backup.',
  heroStats: [
    { value: '8-Stage', label: 'Smart desulfation charging' },
    { value: '99.9% Cu', label: 'Oxygen-free heavy cabling' },
    { value: '12V / 24V', label: 'Auto-detect smart protection' },
  ],
  selectionGuideTitle: 'Essential upgrades for longer battery life',
  selectionGuideItems: [
    {
      title: 'Recover sulfated weekend-car & bike batteries',
      detail:
        'A microprocessor pulse-desulfation charger safely revives deeply discharged batteries and automatically switches to zero-overcharge float mode during extended parking.',
    },
    {
      title: 'Eliminate inverter cable heating with pure copper lugs',
      detail:
        'High-current 150Ah–220Ah tubular and lithium banks draw 80–150A during peak loads. Pre-crimped pure copper terminals prevent resistance spikes and premature inverter low-battery trips.',
    },
    {
      title: 'Spark-proof & reverse-polarity safe hardware',
      detail:
        'Every KINETIX charging accessory incorporates reverse-polarity cutoff, short-circuit isolation, and thermal compensation for effortless DIY garage use.',
    },
  ],
  secondaryCta: {
    label: 'Read Maintenance Guide',
    targetPage: 'maintenance-guide',
  },
  faqs: [
    {
      q: 'Can a smart desulfation charger revive a deeply discharged car battery?',
      a: 'Yes. The KINETIX Pro Smart Charger uses an automated high-frequency desulfation pulse stage designed to break down lead-sulfate crystals on batteries drained as low as 8 volts.',
    },
    {
      q: 'What cable thickness should I use for a 150Ah or 220Ah home inverter battery?',
      a: 'We strongly recommend 35 sq.mm pure oxygen-free copper cable with hydraulically crimped copper lugs to minimize voltage drop and terminal heat.',
    },
  ],
};

export const AccessoriesPage: React.FC = () => {
  return <BatteryCategoryLayout config={ACCESSORIES_CONFIG} />;
};
