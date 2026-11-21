import { FaqItem } from '../types';

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'General & Purchasing',
    question: 'How do I choose the right battery for my car or inverter?',
    answer:
      'For cars, check your vehicle owner’s manual for the required DIN standard, Cold Cranking Amps (CCA), and battery dimensions, or use our interactive Vehicle Matcher. For inverters, calculate your essential electrical wattage (e.g. 400W) multiplied by desired backup hours, divided by 12V system efficiency. A 150Ah or 220Ah tall tubular battery satisfies most 2BHK to 4BHK household backup needs.',
  },
  {
    id: 'faq-2',
    category: 'Installation & Delivery',
    question: 'Do you provide doorstep installation in Indian cities?',
    answer:
      'Yes! KINETIX provides verified doorstep installation within 4 hours in over 45 major metro and tier-1 cities (including Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune, Kolkata, and Ahmedabad). Our certified technicians bring digital multi-meters to test vehicle charging alternator health before mounting.',
  },
  {
    id: 'faq-3',
    category: 'Scrap Exchange',
    question: 'Can I exchange my old dead battery for scrap discount?',
    answer:
      'Absolutely. When ordering, you can choose the "Old Battery Scrap Exchange" option. Upon delivery, our technician inspects your old battery and deducts an instant exchange rebate (up to ₹1,500 for car batteries and up to ₹3,500 for heavy inverter batteries). Old batteries are transported directly to certified pollution-free smelting facilities.',
  },
  {
    id: 'faq-4',
    category: 'Warranty & Claims',
    question: 'How does the direct replacement warranty work?',
    answer:
      'Every battery comes with a digital manufacturer warranty registered under your phone number and order ID. If your battery experiences a defect within the free-replacement warranty period (36 to 60 months depending on model), we send an engineer to your doorstep to perform a conductance test and provide an on-the-spot replacement unit.',
  },
  {
    id: 'faq-5',
    category: 'Lithium Technology',
    question: 'What is the main difference between Lithium LiFePO4 and Lead-Acid?',
    answer:
      'LiFePO4 batteries deliver more than 6,000 charge cycles (compared to 1,200 cycles in lead-acid), can be discharged down to 90% DoD without degradation, weigh 70% less, charge to 100% in under 2 hours, and emit zero toxic acid fumes or hydrogen gas.',
  },
  {
    id: 'faq-6',
    category: 'Maintenance & Care',
    question: 'How often should I check the water level in my inverter battery?',
    answer:
      'For our modern Tall Tubular batteries with low-antimony alloys, water top-up is typically required only once every 9 to 12 months. Always check the float indicators—when the red float marker drops below the green zone, add only pure demineralized water (never tap or mineral water).',
  },
];
