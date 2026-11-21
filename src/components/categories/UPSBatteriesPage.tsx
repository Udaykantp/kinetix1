import React from 'react';
import { BatteryCategoryLayout, BatteryCategoryPageConfig } from './BatteryCategoryLayout';
import upsBatteryHeroImg from '../../assets/images/cat_ups_battery_1795185406017.jpg';

const UPS_BATTERIES_CONFIG: BatteryCategoryPageConfig = {
  category: 'ups',
  pageType: 'ups-batteries',
  title: 'UPS Batteries',
  eyebrow: 'High-Rate Standby Power',
  headline: 'Zero-millisecond standby batteries for workstations & servers.',
  description:
    'Sealed Maintenance-Free (SMF) AGM and Gel VRLA UPS batteries engineered for instantaneous high-rate discharge during mains failure — protecting desktop PCs, POS terminals, medical diagnostics, and online server UPS strings.',
  heroImage: upsBatteryHeroImg,
  heroImageAlt: 'Sealed high-rate AGM UPS backup batteries',
  buyingTip:
    'Always replace all batteries in a series online UPS string (24V, 36V, 48V, or 72V) simultaneously using identical Ah ratings so cell impedance stays balanced under float charge.',
  heroStats: [
    { value: '7.2–26 Ah', label: 'Standard SMF UPS footprints' },
    { value: 'Zero Spill', label: 'Safe inside office enclosures' },
    { value: 'Up to 36M', label: 'Float-duty warranty cover' },
  ],
  selectionGuideTitle: 'Replacing UPS batteries the right way',
  selectionGuideItems: [
    {
      title: 'Match Ah & F2/bolt terminal geometry',
      detail:
        'Desktop 600VA–1100VA UPS units typically house 1 or 2 standard 12V 7.2Ah F2 faston-tab batteries, while 1kVA–5kVA online UPS banks use 12V 26Ah or 42Ah nut-bolt blocks.',
    },
    {
      title: 'High-rate discharge curves prevent instant shutdowns',
      detail:
        'During an outage, UPS batteries discharge at high C-rates for 10–30 minutes. Low-resistance AGM glass-mat separators sustain voltage above the inverter cutoff threshold.',
    },
    {
      title: 'Zero off-gassing for enclosed IT racks & clinics',
      detail:
        'Valve-Regulated Lead-Acid (VRLA) oxygen recombination technology keeps housings sealed, odor-free, and safe next to precision medical and studio electronics.',
    },
  ],
  secondaryCta: {
    label: 'UPS Maintenance Guide',
    targetPage: 'maintenance-guide',
  },
  faqs: [
    {
      q: 'How often should sealed UPS batteries be replaced?',
      a: 'In continuous float-charge service at 25°C, high-rate AGM UPS batteries typically deliver 3 to 4 years of reliable holdover before internal impedance rises.',
    },
    {
      q: 'Can I mix one new 12V 7.2Ah battery with an old one inside a 24V UPS?',
      a: 'No — mixing aged and fresh batteries in series causes the healthier cell to overcharge and fail prematurely. Always swap matched pairs or full strings together.',
    },
  ],
};

export const UPSBatteriesPage: React.FC = () => {
  return <BatteryCategoryLayout config={UPS_BATTERIES_CONFIG} />;
};
