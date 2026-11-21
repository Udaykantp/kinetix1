import React from 'react';
import { BatteryCategoryLayout, BatteryCategoryPageConfig } from './BatteryCategoryLayout';
import bikeBatteryHeroImg from '../../assets/images/cat_bike_battery_1795185387964.jpg';

const BIKE_BATTERIES_CONFIG: BatteryCategoryPageConfig = {
  category: 'bike',
  pageType: 'bike-batteries',
  title: 'Bike Batteries',
  eyebrow: 'Two-Wheeler Power Series',
  headline: 'Vibration-proof power for commuters, cruisers & superbikes.',
  description:
    'Factory-activated Gel VRLA and featherweight LiFePO4 motorcycle batteries designed for crisp one-touch ignition, rough Indian road endurance, and zero electrolyte leakage at any lean angle.',
  heroImage: bikeBatteryHeroImg,
  heroImageAlt: 'Sealed motorcycle and scooter battery showcase',
  buyingTip:
    'Confirm your bike’s OEM capacity (4Ah, 5Ah, or 9Ah) and terminal orientation before ordering. Upgrading a 350cc+ cruiser to a LiFePO4 pack cuts battery weight by over 60% while boosting cold-start punch.',
  heroStats: [
    { value: '100% Sealed', label: 'Zero-spill VRLA & LiFePO4' },
    { value: 'Up to 48M', label: 'Pro-rata & free replacement' },
    { value: '-65% Mass', label: 'On MotoPro Lithium packs' },
  ],
  selectionGuideTitle: 'Selecting the right two-wheeler battery',
  selectionGuideItems: [
    {
      title: 'Match OEM tray code (BTZ5L / 9Ah DIN)',
      detail:
        'Commuter motorcycles and scooters (100cc–160cc) commonly use 4Ah–5Ah compact VRLA packs, while 250cc–650cc cruisers and touring bikes require 8Ah–9Ah high-CCA units.',
    },
    {
      title: 'Prioritize vibration & tilt resistance',
      detail:
        'Absorbed electrolyte VRLA and solid-state prismatic LiFePO4 cells resist plate sulfation and rattling over broken tarmac and off-road trails.',
    },
    {
      title: 'Low self-discharge for weekend riders',
      detail:
        'If your motorcycle stays parked for weeks at a stretch, lithium LiFePO4 holds resting voltage for months without requiring a trickle charger.',
    },
  ],
  secondaryCta: {
    label: 'Battery Maintenance Guide',
    targetPage: 'maintenance-guide',
  },
  faqs: [
    {
      q: 'Can I install a LiFePO4 battery directly into my Royal Enfield or KTM?',
      a: 'Yes. The KINETIX MotoPro Lithium 12V 9Ah drops directly into standard 9Ah OEM trays, works with your factory rectifier/regulator, and delivers stronger morning cranking while shedding over 2 kg of weight.',
    },
    {
      q: 'Are bike batteries delivered factory-charged and ready to fit?',
      a: 'Every two-wheeler battery ships factory-activated, pre-charged above 12.7V, and load-tested so you can install it in minutes with zero acid handling.',
    },
  ],
};

export const BikeBatteriesPage: React.FC = () => {
  return <BatteryCategoryLayout config={BIKE_BATTERIES_CONFIG} />;
};
