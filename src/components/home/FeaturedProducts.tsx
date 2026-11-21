import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, GitCompare, Star, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const FeaturedProducts: React.FC = () => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToComparison,
    isInComparison,
    setQuickViewProduct,
    navigate,
  } = useStore();

  const [activeFilter, setActiveFilter] = useState<'bestseller' | 'new' | 'inverter' | 'lithium'>('bestseller');

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'bestseller') return p.isBestSeller || p.rating >= 4.8;
    if (activeFilter === 'new') return p.isNewArrival || p.category === 'lithium';
    if (activeFilter === 'inverter') return p.category === 'inverter';
    if (activeFilter === 'lithium') return p.category === 'lithium';
    return true;
  });

  return (
    <section className="py-20 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Segmented Filter Control */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-[#B59562] uppercase tracking-wider mb-2 font-semibold">
              Verified Benchmark Reliability
            </div>
            <h2 className="text-3xl font-bold text-gray-950 tracking-tight">
              Featured Energy Units
            </h2>
          </div>

          {/* Interactive filter segmented buttons with smooth horizontal touch scrolling */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl border border-gray-200 overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setActiveFilter('bestseller')}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 active:scale-95 ${
                activeFilter === 'bestseller'
                  ? 'bg-[#D6B98C] text-gray-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 active:scale-95 ${
                activeFilter === 'new'
                  ? 'bg-[#D6B98C] text-gray-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveFilter('inverter')}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 active:scale-95 ${
                activeFilter === 'inverter'
                  ? 'bg-[#D6B98C] text-gray-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              Inverter Series
            </button>
            <button
              onClick={() => setActiveFilter('lithium')}
              className={`min-h-[44px] px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 active:scale-95 ${
                activeFilter === 'lithium'
                  ? 'bg-[#D6B98C] text-gray-950 shadow-xs'
                  : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              Lithium LiFePO4
            </button>
          </div>
        </div>

        {/* 3-Column / 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => {
            const inWish = isInWishlist(product.id);
            const inComp = isInComparison(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-white hover:bg-[#F8F9FA] border border-gray-200 hover:border-gray-300 rounded-xl overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                {/* Visual Area */}
                <div
                  onClick={() => navigate('product-detail', { productId: product.id })}
                  className="relative aspect-[4/3] bg-gray-50 overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Subtle single text badge */}
                  {product.isBestSeller && (
                    <div className="absolute top-3 left-3 bg-white/95 text-[#B59562] text-[10px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded border border-[#D6B98C]/40 shadow-xs">
                      TOP DEMAND
                    </div>
                  )}

                  {/* Quick Action Floating Controls (Heart always visible; Eye & Compare on hover) */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 flex flex-col gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label={inWish ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                      aria-pressed={inWish}
                      title={inWish ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      className={`p-2 rounded-lg backdrop-blur-md transition-all shadow-xs active:scale-90 ${
                        inWish
                          ? 'bg-[#E11D48] text-white'
                          : 'bg-white/90 text-gray-600 hover:text-[#E11D48] border border-gray-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-current' : ''}`} />
                    </button>
                    <div className="flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(product)}
                        aria-label="Quick View"
                        className="p-2 rounded-lg bg-white/90 backdrop-blur-md text-gray-600 hover:text-gray-950 border border-gray-200 transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => addToComparison(product)}
                        aria-label="Compare Product"
                        className={`p-2 rounded-lg backdrop-blur-md transition-colors shadow-xs ${
                          inComp
                            ? 'bg-[#D6B98C] text-gray-950 font-bold'
                            : 'bg-white/90 text-gray-600 hover:text-gray-950 border border-gray-200'
                        }`}
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Metadata & Information */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Brand / Category with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider font-mono">
                      <span>{product.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.category}</span>
                    </div>

                    {/* Product Title */}
                    <h3
                      onClick={() => navigate('product-detail', { productId: product.id })}
                      className="text-sm font-semibold text-gray-950 hover:text-[#B59562] cursor-pointer mt-1.5 line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </h3>

                    {/* Unboxed technical specs */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                      {product.capacityAh > 0 && <span>{product.capacityAh} Ah</span>}
                      {product.capacityAh > 0 && <span aria-hidden="true">·</span>}
                      <span>{product.voltage}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.warrantyMonths}M Warranty</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mt-2.5 text-xs text-[#B59562]">
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="font-semibold text-gray-950">{product.rating}</span>
                      <span className="text-gray-400">({product.reviewCount})</span>
                    </div>
                  </div>

                  {/* Pricing and Action row */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-base font-bold text-gray-950 font-mono tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      {product.discountPercent > 0 && (
                        <div className="text-[11px] text-gray-400 line-through font-mono">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#D6B98C] hover:bg-[#C8A46D] text-gray-950 rounded-lg text-xs font-bold transition-colors shadow-xs active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
