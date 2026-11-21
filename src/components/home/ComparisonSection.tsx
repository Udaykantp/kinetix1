import React from 'react';
import { ArrowRight, Check, X, Shield, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ComparisonSection: React.FC = () => {
  const { navigate, products } = useStore();

  const compData = [
    {
      feature: 'Cycle Life (@ 80% DoD)',
      flooded: '800 - 1,200 Cycles',
      agm: '2,500 - 3,200 Cycles',
      lithium: '6,000 - 8,000 Cycles',
    },
    {
      feature: 'Cold Cranking Current (CCA)',
      flooded: '350 - 500 A',
      agm: '720 - 800 A (Instant)',
      lithium: 'High Surge Pulse',
    },
    {
      feature: 'Recharge Time to 100%',
      flooded: '10 - 14 Hours',
      agm: '4 - 6 Hours',
      lithium: '1.5 - 2.5 Hours',
    },
    {
      feature: 'Maintenance & Water Top-up',
      flooded: 'Frequent (3-4 Months)',
      agm: 'Zero Maintenance Sealed',
      lithium: 'Zero Maintenance',
    },
    {
      feature: 'Usable Energy Capacity',
      flooded: '50% Max Safe Depth',
      agm: '70% Usable Capacity',
      lithium: '90% - 95% Usable Capacity',
    },
    {
      feature: 'Doorstep Warranty',
      flooded: '24 - 36 Months',
      agm: '60 - 72 Months',
      lithium: '84 - 120 Months',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-mono text-[#B59562] uppercase tracking-wider mb-2 font-semibold">
              Performance Benchmark
            </div>
            <h2 className="text-3xl font-bold text-gray-950 tracking-tight">
              Compare Battery Chemistries
            </h2>
          </div>
          <button
            onClick={() => navigate('compare')}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 rounded-lg text-xs font-semibold transition-colors shadow-xs self-start md:self-auto"
          >
            <span>Open Interactive Product Comparator</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B59562] shrink-0" />
          </button>
        </div>

        <div className="sm:hidden flex items-center justify-between text-[11px] text-gray-500 mb-2.5 px-1">
          <span className="inline-flex items-center gap-1">
            <ArrowRight className="w-3 h-3 text-[#B59562]" />
            <span>Swipe table horizontally to compare</span>
          </span>
          <span className="font-mono text-[#B59562]">3 Chemistries</span>
        </div>

        {/* Clean Spec Table with Sticky Left Column */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-xs">
          <table className="w-full text-left text-xs min-w-[540px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-mono uppercase tracking-wider">
                <th className="sticky left-0 z-10 bg-gray-50 border-r border-gray-200 py-3.5 sm:py-4 px-3 sm:px-6 w-36 sm:w-auto font-semibold shadow-[2px_0_5px_rgba(0,0,0,0.03)]">Technical Parameter</th>
                <th className="py-3.5 sm:py-4 px-4 sm:px-5 font-semibold text-gray-500">Standard Flooded</th>
                <th className="py-3.5 sm:py-4 px-4 sm:px-5 font-semibold text-gray-900">KINETIX Pure Lead AGM</th>
                <th className="py-3.5 sm:py-4 px-4 sm:px-5 font-semibold text-[#B59562]">KINETIX LiFePO4 Lithium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {compData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white border-r border-gray-200 py-3.5 sm:py-4 px-3 sm:px-6 w-36 sm:w-auto font-semibold text-gray-950 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">{row.feature}</td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-gray-400">{row.flooded}</td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-gray-900 font-medium">{row.agm}</td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-[#B59562] font-semibold">{row.lithium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
