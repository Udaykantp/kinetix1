import React from 'react';
import { ShieldCheck, Award, Zap, Truck, Recycle, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import industrialLabImg from '../../assets/images/category_banner_industrial_1794476151052.jpg';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="bg-[#17191C] min-h-screen py-16 border-b border-[#25282D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider mb-2">
            The Philosophy of Pure Energy
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#F2F0EA] tracking-tight">
            Powering What Matters Most
          </h1>
          <p className="text-sm sm:text-base text-[#B7BCC2] mt-4 leading-relaxed">
            KINETIX was established with a singular engineering directive: to replace vulnerable,
            maintenance-heavy batteries with aerospace-grade, precision-calibrated energy storage
            systems that never fail when called upon.
          </p>
        </div>

        {/* Narrative Split: The Engineering Standard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-5 text-xs sm:text-sm text-[#B7BCC2] leading-relaxed">
            <h2 className="text-2xl font-bold text-[#F2F0EA]">
              Born in the High-Demand Automotive & Telecom Sectors
            </h2>
            <p>
              In extreme Indian climates—where ambient temperatures frequently cross 48°C in northern plains and severe grid blackouts disrupt essential operations—standard mass-market lead acid batteries deteriorate rapidly due to positive plate shedding and acid stratification.
            </p>
            <p>
              KINETIX re-engineered the cell stack from the molecular level up. By pairing 100-bar HADI high-pressure spine casting with micro-porous borosilicate glass mats and Tier-1 Lithium Iron Phosphate prismatic cells, our battery units deliver triple the cyclic endurance of conventional flooded batteries.
            </p>
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 font-mono text-xs text-[#D6B98C]">
              <div>
                <span className="block text-2xl font-bold text-[#F2F0EA]">6,000+</span>
                <span>Tested LiFePO4 Cycles</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-[#25282D] pt-3 sm:pt-0 sm:pl-6">
                <span className="block text-2xl font-bold text-[#F2F0EA]">45+</span>
                <span>Metro Service Hubs</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-[#25282D] pt-3 sm:pt-0 sm:pl-6">
                <span className="block text-2xl font-bold text-[#F2F0EA]">120M</span>
                <span>Warranty Coverage</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[#25282D] bg-[#101214]">
            <img
              src={industrialLabImg}
              alt="KINETIX Advanced Energy Testing Facility"
              className="w-full h-64 sm:h-80 object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101214] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-[#D6B98C]">
              ISO 9001:2015 ACCREDITED TESTING LABORATORY
            </div>
          </div>
        </div>

        {/* 4 Pillars of Customer Trust */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-[#101214] border border-[#25282D] p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#25282D] flex items-center justify-center text-[#D6B98C]">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F2F0EA]">4-Hour Doorstep Fitment</h3>
            <p className="text-xs text-[#8E959E] leading-relaxed">
              Our motorized technicians carry digital conductance meters to test vehicle alternator and starter motor health before mounting.
            </p>
          </div>

          <div className="bg-[#101214] border border-[#25282D] p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#25282D] flex items-center justify-center text-[#D6B98C]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F2F0EA]">Direct Factory Warranty</h3>
            <p className="text-xs text-[#8E959E] leading-relaxed">
              Zero dealer friction. If a battery tests defective, replacement is provided directly at your doorstep without paperwork delays.
            </p>
          </div>

          <div className="bg-[#101214] border border-[#25282D] p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#25282D] flex items-center justify-center text-[#D6B98C]">
              <Recycle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F2F0EA]">Zero-Effluent Recycling</h3>
            <p className="text-xs text-[#8E959E] leading-relaxed">
              100% of collected scrap batteries are smelted in government-certified pollution-free facilities, preventing groundwater lead contamination.
            </p>
          </div>

          <div className="bg-[#101214] border border-[#25282D] p-6 rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#25282D] flex items-center justify-center text-[#D6B98C]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F2F0EA]">BIS & ARAI Compliant</h3>
            <p className="text-xs text-[#8E959E] leading-relaxed">
              Conforms strictly to Bureau of Indian Standards (IS 14257) and Automotive Research Association of India (ARAI) vibration standards.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#101214] border border-[#343940] rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#F2F0EA]">Ready to upgrade your energy infrastructure?</h2>
          <p className="text-xs text-[#8E959E] mt-2 max-w-md mx-auto">
            Discover our high-cranking automotive AGM units, 220Ah tall tubular inverter banks, or modular LiFePO4 packs.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="mt-6 px-6 py-3 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs rounded-lg inline-flex items-center gap-2"
          >
            <span>Explore Certified Batteries</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
