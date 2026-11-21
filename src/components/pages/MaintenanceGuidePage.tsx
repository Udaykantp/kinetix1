import React from 'react';
import { ShieldAlert, Droplets, CheckCircle, Wrench, Thermometer, BatteryCharging } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MaintenanceGuidePage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="bg-[#17191C] min-h-screen py-16 border-b border-[#25282D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider mb-2">
            Field Engineering Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F2F0EA] tracking-tight">
            Battery Longevity & Maintenance Guide
          </h1>
          <p className="text-sm text-[#B7BCC2] mt-2">
            Professional preventative maintenance procedures to ensure maximum operating lifespan across tubular lead-acid, AGM, and lithium battery banks.
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#B7BCC2]">
          {/* Rule 1: Distilled water */}
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#25282D] flex items-center justify-center text-[#D6B98C]">
                <Droplets className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#F2F0EA]">
                1. Water Top-Up Discipline (Tall Tubular Inverters)
              </h2>
            </div>
            <p className="leading-relaxed">
              Never use tap water, borewell water, or mineral drinking water. These contain dissolved chlorine, iron, and calcium salts that poison negative lead plates and cause irreversible cell shorting. Always use pure demineralized or battery-grade distilled water (TDS &lt; 10 ppm).
            </p>
            <div className="bg-[#17191C] border border-[#25282D] p-4 rounded-xl text-xs space-y-2">
              <div className="text-[#D6B98C] font-semibold font-mono">FLOAT INDICATOR INSPECTION:</div>
              <p>• Green Zone: Electrolyte level is optimal. Do not add water.</p>
              <p>• Red Zone: Water is below minimum threshold. Top up immediately before charging.</p>
            </div>
          </div>

          {/* Rule 2: Terminal corrosion */}
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#25282D] flex items-center justify-center text-[#A87555]">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#F2F0EA]">
                2. Preventing Terminal Corrosion & High-Impedance Arcing
              </h2>
            </div>
            <p className="leading-relaxed">
              White or greenish powdery deposit on battery posts is copper sulfate and lead oxide. This creates high electrical resistance, causing hot cables and premature inverter low-battery cuts.
            </p>
            <p className="leading-relaxed">
              <strong>Remedy:</strong> Clean terminals using a solution of warm water and sodium bicarbonate (baking soda) with a stiff brass brush. Once dry, coat terminals with pure petroleum jelly or dielectric grease. Never use engine grease.
            </p>
          </div>

          {/* Rule 3: Equalization */}
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#25282D] flex items-center justify-center text-[#D6B98C]">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#F2F0EA]">
                3. Equalization Charging & Acid Stratification
              </h2>
            </div>
            <p className="leading-relaxed">
              In batteries that remain in partial state of charge (PSOC) for weeks, dense acid settles at the bottom of the cell while water remains at top. Run an equalization charge every 6 months at 15.5V for 2 hours to bubble and re-mix the electrolyte uniformly.
            </p>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={() => navigate('shop')}
              className="px-6 py-3 bg-[#D6B98C] text-[#17191C] font-semibold text-xs rounded-lg inline-flex items-center gap-2"
            >
              <span>Explore Smart Desulfating Chargers & Accessories</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
