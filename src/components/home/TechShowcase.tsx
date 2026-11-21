import React from 'react';
import { Cpu, ShieldCheck, Zap, Gauge, Layers, Thermometer } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const TechShowcase: React.FC = () => {
  const { navigate } = useStore();

  return (
    <section className="py-20 bg-[#FAFAF9] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-mono text-[#B59562] uppercase tracking-wider mb-2 font-semibold">
            Materials & Chemical Innovation
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
            Battery Architecture Engineered to Outlast
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Every cell chemistry and mechanical chassis is engineered in our ISO 9001 testing
            facilities to survive the most punishing thermal environments and extreme load cycles.
          </p>
        </div>

        {/* 3 Large Architectural Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pillar 1: AGM */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[#B59562]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-950">Pure Lead-Tin AGM</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Absorbent Glass Mat micro-porous separators compress sulfuric acid electrolyte,
                eliminating plate paste shedding during harsh vibrations. Delivers up to 760 Cold
                Cranking Amps for instant cold starts.
              </p>

              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs font-mono text-gray-500">
                <div className="flex justify-between">
                  <span>Compression Pressure</span>
                  <span className="text-gray-900 font-semibold">45 kPa High-VRLA</span>
                </div>
                <div className="flex justify-between">
                  <span>Internal Impedance</span>
                  <span className="text-gray-900 font-semibold">&lt; 2.4 mΩ</span>
                </div>
                <div className="flex justify-between">
                  <span>Start-Stop Durability</span>
                  <span className="text-gray-900 font-semibold">3x Standard Wet Cell</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('car-batteries')}
              className="mt-6 text-xs font-semibold text-[#B59562] hover:text-gray-950 flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Automotive AGM Units</span>
              <span>→</span>
            </button>
          </div>

          {/* Pillar 2: LiFePO4 */}
          <div className="bg-white border border-[#D6B98C] rounded-xl p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 bg-[#D6B98C] text-gray-950 font-mono text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase shadow-xs">
              Flagship Tech
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#D6B98C]/15 border border-[#D6B98C]/30 flex items-center justify-center text-[#B59562]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-950">Prismatic LiFePO4</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Aerospace-grade Lithium Iron Phosphate with zero cobalt. Features active balancing
                battery management systems (BMS), thermal runaway isolation up to 270°C, and 6,000+
                deep discharge cycles.
              </p>

              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs font-mono text-gray-500">
                <div className="flex justify-between">
                  <span>Usable Energy Depth</span>
                  <span className="text-gray-900 font-semibold">90% - 95% DoD</span>
                </div>
                <div className="flex justify-between">
                  <span>Recharge Velocity</span>
                  <span className="text-gray-900 font-semibold">100% in 2.0 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Lifespan Projection</span>
                  <span className="text-gray-900 font-semibold">12 - 15 Years Service</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('lithium-batteries')}
              className="mt-6 text-xs font-semibold text-[#B59562] hover:text-gray-950 flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Lithium Wall & Rack Units</span>
              <span>→</span>
            </button>
          </div>

          {/* Pillar 3: Heavy Cast Spine Tubular */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[#A87555]">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-950">HADI Tall Tubular</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                High-pressure 100-bar cast spine tubes hold active chemical material securely against
                electrolyte erosion during long power cuts. Low-antimony alloy reduces water top-up
                intervals to once a year.
              </p>

              <div className="space-y-2 pt-2 border-t border-gray-100 text-xs font-mono text-gray-500">
                <div className="flex justify-between">
                  <span>Casting Pressure</span>
                  <span className="text-gray-900 font-semibold">100 Bar Dense Matrix</span>
                </div>
                <div className="flex justify-between">
                  <span>Top-up Frequency</span>
                  <span className="text-gray-900 font-semibold">1x per 12 Months</span>
                </div>
                <div className="flex justify-between">
                  <span>Deep Cycle Rating</span>
                  <span className="text-gray-900 font-semibold">1,800 Cycles @ 80%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('inverter-batteries')}
              className="mt-6 text-xs font-semibold text-[#B59562] hover:text-gray-950 flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Inverter Batteries</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
