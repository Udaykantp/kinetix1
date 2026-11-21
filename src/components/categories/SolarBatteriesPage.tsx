import React from 'react';
import { BatteryCategoryLayout, BatteryCategoryPageConfig } from './BatteryCategoryLayout';
import solarBatteryHeroImg from '../../assets/images/cat_solar_battery_1795185352147.jpg';

const SOLAR_BATTERIES_CONFIG: BatteryCategoryPageConfig = {
  category: 'solar',
  pageType: 'solar-batteries',
  title: 'Solar Batteries',
  eyebrow: 'C10 Photovoltaic Storage',
  headline: 'Harvest daylight efficiently. Power every night seamlessly.',
  description:
    'True C10-rated deep-discharge solar batteries crafted for high photovoltaic charge acceptance, cloudy-day partial state-of-charge resilience, and dependable daily off-grid or hybrid cycling.',
  heroImage: solarBatteryHeroImg,
  heroImageAlt: 'Solar C10 photovoltaic deep-cycle energy storage battery',
  buyingTip:
    'Always specify C10-rated solar batteries instead of C20 inverter batteries for rooftop PV installations — C10 plates absorb high daytime MPPT current quickly without overheating.',
  heroStats: [
    { value: 'C10 Rated', label: 'High solar charge acceptance' },
    { value: '200 Ah+', label: 'Daily deep-cycling reserve' },
    { value: 'Up to 60M', label: 'Solar-duty warranty cover' },
  ],
  selectionGuideTitle: 'Designing a reliable solar battery bank',
  selectionGuideItems: [
    {
      title: 'Understand C10 vs C20 discharge ratings',
      detail:
        'A C10 battery delivers its full rated ampere-hours over a 10-hour window and accepts higher solar charging currents safely during peak 5-hour sunshine windows.',
    },
    {
      title: 'Match MPPT charge controller voltage',
      detail:
        'Configure single 12V banks for small cabin/lighting loads, or wire matched C10 units in 24V/48V series strings for 2kW–5kW residential hybrid rooftop solar inverters.',
    },
    {
      title: 'Built for Partial State-of-Charge (PSoC) monsoon days',
      detail:
        'Solar tubular plates use special carbon-enhanced active paste to resist sulfation even after consecutive overcast monsoon days without hitting 100% full charge.',
    },
  ],
  secondaryCta: {
    label: 'Explore LiFePO4 Solar Walls',
    targetPage: 'lithium-batteries',
  },
  faqs: [
    {
      q: 'What is the practical difference between a solar C10 battery and a normal inverter battery?',
      a: 'Normal inverter batteries are C20-rated for occasional grid blackouts and slow charging. C10 solar batteries are engineered for daily 365-day charge/discharge cycles and faster MPPT solar absorption.',
    },
    {
      q: 'Can I pair these solar batteries with existing rooftop panels?',
      a: 'Yes. They work seamlessly with MPPT and PWM solar charge controllers as well as hybrid PCUs from Luminous, UTL, Loom Solar, and Microtek.',
    },
  ],
};

export const SolarBatteriesPage: React.FC = () => {
  return <BatteryCategoryLayout config={SOLAR_BATTERIES_CONFIG} />;
};
