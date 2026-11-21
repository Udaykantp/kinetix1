import React, { useState } from 'react';
import { X, Plus, ShoppingBag, Check, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const ComparePage: React.FC = () => {
  const {
    comparisonList,
    removeFromComparison,
    clearComparison,
    products,
    addToComparison,
    addToCart,
    navigate,
  } = useStore();

  const [highlightDifferences, setHighlightDifferences] = useState(false);

  // Available products to add
  const availableToAdd = products.filter(
    (p) => !comparisonList.some((c) => c.id === p.id)
  );

  const specRows = [
    { label: 'Price (INR)', key: 'price', format: (p: Product) => `₹${p.price.toLocaleString('en-IN')}` },
    { label: 'Original MRP', key: 'originalPrice', format: (p: Product) => `₹${p.originalPrice.toLocaleString('en-IN')}` },
    { label: 'Battery Capacity (Ah)', key: 'capacityAh', format: (p: Product) => `${p.capacityAh} Ah` },
    { label: 'Nominal Voltage', key: 'voltage', format: (p: Product) => p.voltage },
    { label: 'Chemistry & Technology', key: 'technology', format: (p: Product) => p.technology },
    { label: 'Cold Cranking Amps (CCA)', key: 'coldCrankingAmps', format: (p: Product) => p.coldCrankingAmps ? `${p.coldCrankingAmps} CCA` : 'N/A (Deep Cycle)' },
    { label: 'Direct Factory Warranty', key: 'warrantyMonths', format: (p: Product) => `${p.warrantyMonths} Months` },
    { label: 'Cycle Life', key: 'cycleLife', format: (p: Product) => p.cycleLife || 'Standard cyclic rate' },
    { label: 'Filled Weight', key: 'weightKg', format: (p: Product) => `${p.weightKg} kg` },
    { label: 'Dimensions (L × W × H)', key: 'dimensions', format: (p: Product) => p.dimensions },
    { label: 'Fast Charging Time', key: 'chargingTime', format: (p: Product) => p.chargingTime || '4-6 Hours Standard' },
    { label: 'Doorstep Fitment Available', key: 'fitment', format: () => 'Yes (Within 4 Hours)' },
  ];

  return (
    <div className="bg-[#17191C] min-h-screen py-10 border-b border-[#25282D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider mb-1">
              Side-by-Side Benchmark Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F2F0EA]">
              Compare Battery Specifications
            </h1>
            <p className="text-xs sm:text-sm text-[#8E959E] mt-1">
              Evaluating {comparisonList.length} of 4 battery slots
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <label className="flex items-center gap-2 text-xs text-[#B7BCC2] bg-[#101214] border border-[#25282D] px-3 py-2 min-h-[40px] rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="rounded bg-[#25282D] border-[#343940] text-[#D6B98C] focus:ring-0"
              />
              <span>Highlight Spec Differences</span>
            </label>

            {comparisonList.length > 0 && (
              <button
                onClick={clearComparison}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#25282D] hover:bg-[#343940] text-[#8E959E] hover:text-[#F2F0EA] text-xs rounded-lg border border-[#343940] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {comparisonList.length === 0 ? (
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-12 text-center">
            <h2 className="text-lg font-bold text-[#F2F0EA]">Your comparison table is empty</h2>
            <p className="text-xs text-[#8E959E] mt-1 max-w-md mx-auto">
              Select up to four battery models from our catalog or categories to evaluate technical parameters side-by-side.
            </p>
            <button
              onClick={() => navigate('shop')}
              className="mt-6 px-5 py-2.5 bg-[#D6B98C] text-[#17191C] font-semibold text-xs rounded-lg inline-flex items-center gap-2"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mobile swipe hint */}
            <div className="sm:hidden flex items-center justify-between text-xs text-[#8E959E] bg-[#101214] px-3.5 py-2 rounded-lg border border-[#25282D]">
              <span className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-[#D6B98C]" />
                <span>Swipe table horizontally to compare all models</span>
              </span>
              <span className="font-mono text-[#D6B98C]">{comparisonList.length} Models</span>
            </div>

            <div className="overflow-x-auto bg-[#101214] border border-[#25282D] rounded-2xl shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                {/* Product Card Row */}
                <thead>
                  <tr className="border-b border-[#25282D]">
                    <th className="sticky left-0 z-20 p-3 sm:p-5 w-32 sm:w-56 text-[11px] sm:text-xs font-mono uppercase text-[#8E959E] align-bottom bg-[#101214] border-r border-[#25282D] shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                      Product Details
                    </th>
                  {comparisonList.map((prod) => (
                    <th key={prod.id} className="p-3.5 sm:p-5 min-w-[195px] sm:min-w-[240px] max-w-[280px] align-top">
                      <div className="relative">
                        <button
                          onClick={() => removeFromComparison(prod.id)}
                          className="absolute -top-2 -right-2 p-1 bg-[#25282D] hover:bg-red-900/40 text-[#8E959E] hover:text-red-400 rounded-full"
                          aria-label="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-full h-36 object-cover rounded-lg bg-[#25282D] mb-3"
                        />

                        <div className="text-[10px] font-mono text-[#8E959E] uppercase">
                          {prod.brand} · {prod.category}
                        </div>
                        <h3
                          onClick={() => navigate('product-detail', { productId: prod.id })}
                          className="text-xs font-bold text-[#F2F0EA] hover:text-[#D6B98C] cursor-pointer line-clamp-1 mt-0.5"
                        >
                          {prod.name}
                        </h3>

                        <div className="text-base font-bold text-[#F2F0EA] font-mono mt-2 tabular-nums">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>

                        <button
                          onClick={() => addToCart(prod)}
                          className="w-full mt-3 py-2 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  ))}

                  {/* Empty Slot if < 4 */}
                  {comparisonList.length < 4 && (
                    <th className="p-3.5 sm:p-5 min-w-[195px] sm:min-w-[220px] text-center border-l border-dashed border-[#25282D] align-middle">
                      <div className="p-6 border border-dashed border-[#343940] rounded-xl flex flex-col items-center justify-center gap-2">
                        <Plus className="w-5 h-5 text-[#D6B98C]" />
                        <span className="text-xs font-semibold text-[#F2F0EA]">
                          Add Another Battery
                        </span>
                        <select
                          onChange={(e) => {
                            const p = products.find((prod) => prod.id === e.target.value);
                            if (p) addToComparison(p);
                          }}
                          className="w-full mt-2 bg-[#17191C] border border-[#343940] text-[11px] text-[#F2F0EA] p-1.5 rounded focus:outline-none focus:border-[#D6B98C]"
                        >
                          <option value="">Select model...</option>
                          {availableToAdd.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (₹{p.price.toLocaleString('en-IN')})
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              {/* Specs Rows */}
              <tbody className="divide-y divide-[#25282D]">
                {specRows.map((spec, idx) => {
                  // Check if values differ across compared products
                  const values = comparisonList.map((p) => spec.format(p));
                  const isDiff = new Set(values).size > 1;

                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        highlightDifferences && isDiff ? 'bg-[#D6B98C]/5' : 'hover:bg-[#17191C]/40'
                      }`}
                    >
                      <td className="sticky left-0 z-10 py-3 sm:py-3.5 px-3 sm:px-5 font-mono text-[11px] sm:text-xs text-[#8E959E] font-medium bg-[#101214] border-r border-[#25282D] w-32 sm:w-56 shadow-[2px_0_5px_rgba(0,0,0,0.3)]">
                        {spec.label}
                      </td>
                      {comparisonList.map((prod) => (
                        <td
                          key={prod.id}
                          className={`py-3 sm:py-3.5 px-3.5 sm:px-5 font-semibold ${
                            highlightDifferences && isDiff
                              ? 'text-[#D6B98C]'
                              : 'text-[#F2F0EA]'
                          }`}
                        >
                          {spec.format(prod)}
                        </td>
                      ))}
                      {comparisonList.length < 4 && <td className="py-3 sm:py-3.5 px-3.5 sm:px-5" />}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};
