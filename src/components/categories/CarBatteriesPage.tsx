import React from 'react';
import { BatteryCategoryLayout, BatteryCategoryPageConfig } from './BatteryCategoryLayout';
import carBatteryHeroImg from '../../assets/images/product_car_battery_1794476149763.jpg';

const CAR_BATTERIES_CONFIG: BatteryCategoryPageConfig = {
  category: 'car',
  pageType: 'car-batteries',
  title: 'Car Batteries',
  eyebrow: 'Automotive Ignition Series',
  headline: 'High-cranking car batteries built for instant starts.',
  description:
    'Pure Lead AGM and Silven-Alloy automotive batteries engineered for modern hatchbacks, sedans, turbo-diesel SUVs, and automatic Start-Stop vehicles. Delivered and installed at your doorstep within 4 hours.',
  heroImage: carBatteryHeroImg,
  heroImageAlt: 'High-cranking automotive car battery studio photograph',
  buyingTip:
    'Match your car’s recommended Cold Cranking Amps (CCA) and DIN/JIS terminal layout. Vehicles equipped with automatic Start-Stop require an AGM battery to withstand frequent micro-cycles.',
  heroStats: [
    { value: 'Up to 720 CCA', label: 'Cold cranking power' },
    { value: 'Up to 72M', label: 'Digital warranty cover' },
    { value: '₹1,200 Off', label: 'Old battery scrap exchange' },
  ],
  selectionGuideTitle: 'How to choose the right car battery',
  selectionGuideItems: [
    {
      title: 'Verify DIN vs JIS tray & terminal polarity',
      detail:
        'European and newer SUV platforms typically use recessed DIN casings (such as DIN65 or DIN75), while compact hatchbacks often use raised-post JIS footprints. Matching physical dimensions ensures clamp security.',
    },
    {
      title: 'Match Cold Cranking Amps (CCA) to engine displacement',
      detail:
        'Diesel engines and high-compression turbo motors draw higher peak starter current. Choosing a unit with 500–720 CCA delivers effortless winter starts and reduces alternator load.',
    },
    {
      title: 'Choose Pure Lead AGM for Start-Stop & heavy accessories',
      detail:
        'If your vehicle runs dual dashcams, upgraded audio, or Idle Start-Stop, AGM chemistry provides 3x the cyclic endurance and zero electrolyte maintenance compared to wet lead-acid.',
    },
  ],
  secondaryCta: {
    label: 'Compare Models',
    targetPage: 'compare',
  },
  faqs: [
    {
      q: 'How do I confirm which battery fits my exact car model?',
      a: 'Use the inline search bar above to type your car model (e.g. Creta, Seltos, Swift, Baleno, City) or schedule free doorstep verification — our technician checks your tray size, alternator charging voltage, and terminal polarity before fitment.',
    },
    {
      q: 'Do you offer instant scrap exchange for my old car battery?',
      a: 'Yes. Select old battery exchange at checkout or on the product configurator for an instant rebate up to ₹1,200. Our installer safely removes and recycles the spent unit through authorized channels.',
    },
    {
      q: 'How fast is doorstep car battery installation?',
      a: 'Across major metro pin codes, certified installers dispatch within 4 hours with a digital battery health analyzer, memory-saver OBD clip (so your radio and ECU presets stay intact), and instant warranty registration.',
    },
  ],
};

export const CarBatteriesPage: React.FC = () => {
  return (
    <BatteryCategoryLayout config={CAR_BATTERIES_CONFIG}>
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <div className="pt-1 md:pt-0">
          <div className="text-xs font-mono font-semibold text-[#B5812B] uppercase tracking-wider">
            Hatchbacks & Compact Sedans
          </div>
          <div className="text-sm font-bold text-[#073B32] mt-1">35 Ah – 45 Ah · 12V</div>
          <p className="text-xs text-[#5C6663] mt-1 leading-relaxed">
            Ideal for Maruti Swift, Baleno, Hyundai i20, Honda Amaze, and Tata Altroz petrol models.
          </p>
        </div>
        <div className="pt-4 md:pt-0 md:pl-5">
          <div className="text-xs font-mono font-semibold text-[#B5812B] uppercase tracking-wider">
            Mid-Size SUVs & Diesel Sedans
          </div>
          <div className="text-sm font-bold text-[#073B32] mt-1">60 Ah – 65 Ah · DIN65</div>
          <p className="text-xs text-[#5C6663] mt-1 leading-relaxed">
            Engineered for Hyundai Creta, Kia Seltos, VW Virtus, Skoda Kushaq, and Honda City.
          </p>
        </div>
        <div className="pt-4 md:pt-0 md:pl-5">
          <div className="text-xs font-mono font-semibold text-[#B5812B] uppercase tracking-wider">
            Premium SUVs & Start-Stop
          </div>
          <div className="text-sm font-bold text-[#073B32] mt-1">75 Ah+ · Pure Lead AGM</div>
          <p className="text-xs text-[#5C6663] mt-1 leading-relaxed">
            Built for Mahindra XUV700, Toyota Fortuner, Scorpio-N, and European Start-Stop platforms.
          </p>
        </div>
      </div>
    </BatteryCategoryLayout>
  );
};
