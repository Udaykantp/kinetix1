import React, { useState } from 'react';
import { Calculator, ArrowRight, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BuyingGuidePage: React.FC = () => {
  const { products, addToCart, navigate } = useStore();

  // Load calculator state
  const [fans, setFans] = useState(3);
  const [lights, setLights] = useState(6);
  const [hasTv, setHasTv] = useState(true);
  const [hasFridge, setHasFridge] = useState(true);
  const [hasAc, setHasAc] = useState(false);
  const [backupHours, setBackupHours] = useState(4);
  const [systemVoltage, setSystemVoltage] = useState(12);

  // Total Wattage calculation
  const fanWatts = fans * 75;
  const lightWatts = lights * 15;
  const tvWatts = hasTv ? 120 : 0;
  const fridgeWatts = hasFridge ? 200 : 0;
  const acWatts = hasAc ? 1500 : 0;

  const totalWatts = fanWatts + lightWatts + tvWatts + fridgeWatts + acWatts;
  const totalEnergyWattHours = totalWatts * backupHours;

  // Battery Ah required: Total Watt-Hours / System Voltage / 0.8 (Efficiency factor)
  const requiredAh = Math.round(totalEnergyWattHours / systemVoltage / 0.8);

  // Recommended battery matching
  const matchedBattery =
    (requiredAh <= 160
      ? products.find((p) => p.category === 'inverter' && p.capacityAh <= 160)
      : requiredAh <= 240
      ? products.find((p) => p.category === 'inverter' && p.capacityAh >= 200)
      : products.find((p) => p.category === 'lithium')) ||
    products.find((p) => p.category === 'inverter') ||
    products[0];

  return (
    <div className="bg-[#17191C] min-h-screen py-16 border-b border-[#25282D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider mb-2">
            Engineering Sizing Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F2F0EA] tracking-tight">
            Battery Capacity & Inverter Calculator
          </h1>
          <p className="text-sm text-[#B7BCC2] mt-2">
            Calculate your exact electrical load in watts and discover the perfect battery capacity (Ah) to prevent under-sizing or premature sulfation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sizing Controls Left */}
          <div className="lg:col-span-7 bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 space-y-6 text-xs">
            <h2 className="text-base font-bold text-[#F2F0EA]">1. Select Connected Electrical Load</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#17191C] border border-[#25282D] rounded-xl">
                <div>
                  <span className="font-semibold text-[#F2F0EA] block">Ceiling Fans (75W each)</span>
                  <span className="text-[11px] text-[#8E959E]">{fans * 75} Watts total load</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setFans(Math.max(0, fans - 1))}
                    aria-label="Decrease ceiling fans"
                    className="w-9 h-9 rounded-lg bg-[#25282D] hover:bg-[#343940] text-[#F2F0EA] font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-[#D6B98C] w-6 text-center">{fans}</span>
                  <button
                    onClick={() => setFans(fans + 1)}
                    aria-label="Increase ceiling fans"
                    className="w-9 h-9 rounded-lg bg-[#25282D] hover:bg-[#343940] text-[#F2F0EA] font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 bg-[#17191C] border border-[#25282D] rounded-xl">
                <div>
                  <span className="font-semibold text-[#F2F0EA] block">LED Tube / Bulbs (15W each)</span>
                  <span className="text-[11px] text-[#8E959E]">{lights * 15} Watts total load</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setLights(Math.max(0, lights - 1))}
                    aria-label="Decrease LED bulbs"
                    className="w-9 h-9 rounded-lg bg-[#25282D] hover:bg-[#343940] text-[#F2F0EA] font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-[#D6B98C] w-6 text-center">{lights}</span>
                  <button
                    onClick={() => setLights(lights + 1)}
                    aria-label="Increase LED bulbs"
                    className="w-9 h-9 rounded-lg bg-[#25282D] hover:bg-[#343940] text-[#F2F0EA] font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="p-3 bg-[#17191C] border border-[#25282D] rounded-xl flex items-center justify-between cursor-pointer">
                  <span>Smart TV (120W)</span>
                  <input
                    type="checkbox"
                    checked={hasTv}
                    onChange={(e) => setHasTv(e.target.checked)}
                    className="rounded bg-[#25282D] border-[#343940] text-[#D6B98C] focus:ring-0"
                  />
                </label>

                <label className="p-3 bg-[#17191C] border border-[#25282D] rounded-xl flex items-center justify-between cursor-pointer">
                  <span>Refrigerator (200W)</span>
                  <input
                    type="checkbox"
                    checked={hasFridge}
                    onChange={(e) => setHasFridge(e.target.checked)}
                    className="rounded bg-[#25282D] border-[#343940] text-[#D6B98C] focus:ring-0"
                  />
                </label>

                <label className="p-3 bg-[#17191C] border border-[#25282D] rounded-xl flex items-center justify-between cursor-pointer">
                  <span>1.5T AC (1500W)</span>
                  <input
                    type="checkbox"
                    checked={hasAc}
                    onChange={(e) => setHasAc(e.target.checked)}
                    className="rounded bg-[#25282D] border-[#343940] text-[#D6B98C] focus:ring-0"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#25282D]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-[#F2F0EA]">2. Required Backup Duration</h3>
                <span className="font-mono text-[#D6B98C] font-bold text-sm">{backupHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={backupHours}
                onChange={(e) => setBackupHours(Number(e.target.value))}
                className="w-full accent-[#D6B98C]"
              />
            </div>
          </div>

          {/* Sizing Results Right */}
          <div className="lg:col-span-5 bg-[#101214] border border-[#343940] rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider">
                Calculated Sizing Result
              </div>
              <h3 className="text-xl font-bold text-[#F2F0EA] mt-1">Recommended Configuration</h3>
            </div>

            <div className="space-y-2 text-xs font-mono bg-[#17191C] border border-[#25282D] p-4 rounded-xl">
              <div className="flex justify-between text-[#8E959E]">
                <span>Peak Continuous Load:</span>
                <span className="text-[#F2F0EA] font-bold">{totalWatts} Watts</span>
              </div>
              <div className="flex justify-between text-[#8E959E]">
                <span>Energy Demand ({backupHours}h):</span>
                <span className="text-[#F2F0EA] font-bold">{totalEnergyWattHours} Watt-Hours</span>
              </div>
              <div className="flex justify-between text-[#8E959E]">
                <span>Minimum Recommended Capacity:</span>
                <span className="text-[#D6B98C] font-bold text-sm">{requiredAh} Ah</span>
              </div>
            </div>

            {/* Matched Recommended Battery */}
            {matchedBattery && (
              <div className="bg-[#17191C] border border-[#D6B98C]/40 rounded-xl p-5 space-y-4">
                <span className="text-[10px] font-mono bg-[#25282D] text-[#D6B98C] px-2 py-0.5 rounded">
                  ENGINEERED FIT MATCH
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={matchedBattery.images[0]}
                    alt={matchedBattery.name}
                    className="w-16 h-16 object-cover rounded-lg bg-[#25282D] shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#F2F0EA] line-clamp-1">
                      {matchedBattery.name}
                    </h4>
                    <div className="text-[11px] text-[#8E959E] font-mono mt-0.5">
                      {matchedBattery.capacityAh} Ah · {matchedBattery.voltage} · {matchedBattery.warrantyMonths}M
                    </div>
                    <div className="text-sm font-bold text-[#D6B98C] font-mono mt-1">
                      ₹{matchedBattery.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(matchedBattery);
                    navigate('cart');
                  }}
                  className="w-full py-2.5 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Select & Add to Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
