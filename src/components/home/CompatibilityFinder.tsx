import React, { useState } from 'react';
import { Car, Home, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CompatibilityFinder: React.FC = () => {
  const { products, addToCart, navigate } = useStore();
  const [activeTab, setActiveTab] = useState<'vehicle' | 'inverter'>('vehicle');

  // Vehicle Finder State
  const [selectedMake, setSelectedMake] = useState('Hyundai');
  const [selectedModel, setSelectedModel] = useState('Creta (Petrol/Diesel)');
  const [selectedFuel, setSelectedFuel] = useState('Diesel / Start-Stop');

  // Inverter Finder State
  const [selectedHomeType, setSelectedHomeType] = useState('3BHK');
  const [backupHours, setBackupHours] = useState('4');

  const VEHICLE_DATABASE: Record<string, string[]> = {
    Hyundai: ['Creta (Petrol/Diesel)', 'i20', 'Grand i10', 'Verna'],
    'Maruti Suzuki': ['Swift / Baleno', 'Brezza', 'WagonR', 'Ertiga'],
    Tata: ['Harrier / Safari', 'Nexon', 'Tiago', 'Punch'],
    Mahindra: ['XUV700', 'Scorpio-N', 'Thar', 'XUV300'],
    Toyota: ['Fortuner', 'Innova Crysta / Hycross', 'Urban Cruiser'],
    BMW: ['3 Series / X1', '5 Series', 'X3'],
  };

  // Find matching car battery
  const matchedCarBattery =
    products.find((p) =>
      p.compatibleVehicles?.some((v) =>
        v.toLowerCase().includes(selectedModel.split(' ')[0].toLowerCase())
      )
    ) || products[0];

  // Find matching inverter battery
  const matchedInverterBattery =
    (selectedHomeType === '3BHK' || backupHours === '6'
      ? products.find((p) => p.category === 'inverter' && p.capacityAh >= 200)
      : products.find((p) => p.category === 'inverter' && p.capacityAh >= 150)) ||
    products.find((p) => p.category === 'inverter') ||
    products[0];

  return (
    <section id="compatibility-finder" className="py-16 bg-[#FAFAF9] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="text-xs font-mono text-[#B59562] uppercase tracking-wider mb-2 font-semibold">
            Precision Match Engine
          </div>
          <h2 className="text-3xl font-bold text-gray-950 tracking-tight">
            Find the Exact Battery Built for Your Power Need
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Eliminate guesswork. Our engineering database cross-references manufacturer DIN
            specifications, cold cranking amps, and peak wattage ratings.
          </p>

          {/* Segmented Selector for Vehicle vs Inverter */}
          <div className="flex flex-col sm:inline-flex sm:flex-row p-1 bg-white rounded-xl mt-6 border border-gray-200 w-full sm:w-auto gap-1 shadow-xs">
            <button
              onClick={() => setActiveTab('vehicle')}
              className={`min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'vehicle'
                  ? 'bg-[#D6B98C] text-gray-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Vehicle Fitment Finder</span>
            </button>
            <button
              onClick={() => setActiveTab('inverter')}
              className={`min-h-[44px] flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'inverter'
                  ? 'bg-[#D6B98C] text-gray-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Inverter & Home Backup</span>
            </button>
          </div>
        </div>

        {/* Interactive Matcher Box */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
          {activeTab === 'vehicle' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Form Selectors */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-950">Select Your Vehicle</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1 font-medium">
                      1. Manufacturer
                    </label>
                    <select
                      value={selectedMake}
                      onChange={(e) => {
                        setSelectedMake(e.target.value);
                        setSelectedModel(VEHICLE_DATABASE[e.target.value][0]);
                      }}
                      className="w-full bg-gray-50 border border-gray-300 text-xs text-gray-900 px-3 py-2.5 rounded-lg focus:outline-none focus:bg-white focus:border-[#D6B98C] truncate"
                    >
                      {Object.keys(VEHICLE_DATABASE).map((make) => (
                        <option key={make} value={make}>
                          {make}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1 font-medium">
                      2. Car Model
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-xs text-gray-900 px-3 py-2.5 rounded-lg focus:outline-none focus:bg-white focus:border-[#D6B98C] truncate"
                    >
                      {VEHICLE_DATABASE[selectedMake]?.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1 font-medium">
                      3. Fuel & Electronics
                    </label>
                    <select
                      value={selectedFuel}
                      onChange={(e) => setSelectedFuel(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-xs text-gray-900 px-3 py-2.5 rounded-lg focus:outline-none focus:bg-white focus:border-[#D6B98C] truncate"
                    >
                      <option value="Diesel / Start-Stop">Diesel / Auto Start-Stop</option>
                      <option value="Petrol Normal">Petrol (Standard)</option>
                      <option value="Turbo / Hybrid">Turbo Petrol / Mild Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 text-xs text-gray-500 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B59562] shrink-0" />
                    <span>Exact OEM DIN Housing Match</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B59562] shrink-0" />
                    <span>Includes Doorstep Alternator Test</span>
                  </span>
                </div>
              </div>

              {/* Matched Product Preview Card */}
              <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
                <div className="flex items-start gap-3 sm:gap-4">
                  <img
                    src={matchedCarBattery.images[0]}
                    alt={matchedCarBattery.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-white shrink-0 border border-gray-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-[#B59562] uppercase tracking-wider truncate font-semibold">
                      Recommended OEM Fit
                    </div>
                    <h4 className="text-sm font-bold text-gray-950 leading-snug line-clamp-2 mt-0.5">
                      {matchedCarBattery.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 mt-1 font-mono">
                      <span>{matchedCarBattery.capacityAh} Ah</span>
                      <span aria-hidden="true">·</span>
                      <span>{matchedCarBattery.coldCrankingAmps} CCA</span>
                      <span aria-hidden="true">·</span>
                      <span>{matchedCarBattery.warrantyMonths}M</span>
                    </div>
                    <div className="text-base font-bold text-gray-950 mt-1.5 font-mono tabular-nums flex items-baseline gap-2">
                      <span>₹{matchedCarBattery.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-gray-400 line-through font-normal">
                        ₹{matchedCarBattery.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(matchedCarBattery)}
                    className="min-h-[44px] py-2 px-3 bg-[#D6B98C] hover:bg-[#C8A46D] text-gray-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 whitespace-nowrap shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() =>
                      navigate('product-detail', { productId: matchedCarBattery.id })
                    }
                    className="min-h-[44px] py-2 px-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg text-xs font-semibold transition-all border border-gray-300 flex items-center justify-center active:scale-95 whitespace-nowrap shrink-0 shadow-xs"
                  >
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Inverter Load Selector */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-semibold text-gray-950">
                  Select Your Home & Power Requirement
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1 font-medium">
                      Home Size & Appliances
                    </label>
                    <select
                      value={selectedHomeType}
                      onChange={(e) => setSelectedHomeType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-xs text-gray-900 px-3 py-2.5 rounded-lg focus:outline-none focus:bg-white focus:border-[#D6B98C]"
                    >
                      <option value="1BHK">1-2 BHK (2 Fans, 3 Lights, 1 TV, Wi-Fi)</option>
                      <option value="3BHK">3-4 BHK (4 Fans, 6 Lights, TV, Refrigerator)</option>
                      <option value="Villa">Independent House / Villa (Heavy Load + AC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-gray-500 uppercase mb-1 font-medium">
                      Desired Power Backup Duration
                    </label>
                    <select
                      value={backupHours}
                      onChange={(e) => setBackupHours(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-xs text-gray-900 px-3 py-2.5 rounded-lg focus:outline-none focus:bg-white focus:border-[#D6B98C]"
                    >
                      <option value="2">2 - 3 Hours (Moderate Outages)</option>
                      <option value="4">4 - 6 Hours (Extended Blackouts)</option>
                      <option value="8">8+ Hours (Heavy Duty Continuous)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 text-xs text-gray-500 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B59562] shrink-0" />
                    <span>Heavy Cast Tall Tubular Spine Technology</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B59562] shrink-0" />
                    <span>Ceramic Float Level Monitors</span>
                  </span>
                </div>
              </div>

              {/* Matched Inverter Battery Card */}
              <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
                <div className="flex items-start gap-3 sm:gap-4">
                  <img
                    src={matchedInverterBattery.images[0]}
                    alt={matchedInverterBattery.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-white shrink-0 border border-gray-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-[#B59562] uppercase tracking-wider truncate font-semibold">
                      Engineered Recommendation
                    </div>
                    <h4 className="text-sm font-bold text-gray-950 leading-snug line-clamp-2 mt-0.5">
                      {matchedInverterBattery.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 mt-1 font-mono">
                      <span>{matchedInverterBattery.capacityAh} Ah</span>
                      <span aria-hidden="true">·</span>
                      <span>{matchedInverterBattery.technology}</span>
                      <span aria-hidden="true">·</span>
                      <span>{matchedInverterBattery.warrantyMonths}M</span>
                    </div>
                    <div className="text-base font-bold text-gray-950 mt-1.5 font-mono tabular-nums flex items-baseline gap-2">
                      <span>₹{matchedInverterBattery.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-gray-400 line-through font-normal">
                        ₹{matchedInverterBattery.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(matchedInverterBattery)}
                    className="min-h-[44px] py-2 px-3 bg-[#D6B98C] hover:bg-[#C8A46D] text-gray-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 whitespace-nowrap shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() =>
                      navigate('product-detail', { productId: matchedInverterBattery.id })
                    }
                    className="min-h-[44px] py-2 px-3 bg-white hover:bg-gray-100 text-gray-900 rounded-lg text-xs font-semibold transition-all border border-gray-300 flex items-center justify-center active:scale-95 whitespace-nowrap shrink-0 shadow-xs"
                  >
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
