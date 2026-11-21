import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Eye,
  Heart,
  Home,
  Recycle,
  ShoppingCart,
  Star,
  Tag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_COUPONS } from '../../data/products';

type OfferGroup = 'all' | 'auto' | 'home' | 'lithium' | 'industrial';

const OFFER_GROUPS: { id: OfferGroup; label: string; categories: string[] }[] = [
  { id: 'all', label: 'All Offers', categories: [] },
  { id: 'auto', label: 'Car & Bike', categories: ['car', 'bike'] },
  { id: 'home', label: 'Inverter & Home', categories: ['inverter'] },
  { id: 'lithium', label: 'Lithium & Solar', categories: ['lithium', 'solar'] },
  { id: 'industrial', label: 'Industrial & UPS', categories: ['industrial', 'ups', 'accessories'] },
];

const EXCHANGE_RATES = [
  { id: 'bike', label: 'Two-Wheeler (2.5–9 Ah)', credit: 350 },
  { id: 'car', label: 'Car / SUV (35–80 Ah)', credit: 1000 },
  { id: 'inverter', label: 'Inverter Tubular (150–220 Ah)', credit: 1500 },
  { id: 'solar', label: 'Solar / Industrial Bank', credit: 1800 },
] as const;

export const OffersPage: React.FC = () => {
  const {
    products,
    navigate,
    getRouteUrl,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    appliedCoupon,
    applyCoupon,
    showToast,
    setIsCartOpen,
  } = useStore();

  const [selectedGroup, setSelectedGroup] = useState<OfferGroup>('all');
  const [sortBy, setSortBy] = useState<'discount' | 'savings' | 'price-low'>('discount');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string>('inverter');

  const discountedProducts = useMemo(() => {
    const groupMeta = OFFER_GROUPS.find((g) => g.id === selectedGroup);
    const list = products.filter((p) => {
      const hasDiscount = p.discountPercent > 0 || p.originalPrice > p.price;
      if (!hasDiscount) return false;
      if (groupMeta && groupMeta.categories.length > 0) {
        return groupMeta.categories.includes(p.category);
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'savings') {
        return b.originalPrice - b.price - (a.originalPrice - a.price);
      }
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      return (b.discountPercent || 0) - (a.discountPercent || 0);
    });
  }, [products, selectedGroup, sortBy]);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    showToast(`Promo code ${code} copied to clipboard`, 'info');
    window.setTimeout(() => {
      setCopiedCode((prev) => (prev === code ? null : prev));
    }, 2200);
  };

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    showToast(res.message, res.success ? 'success' : 'error');
  };

  const activeExchange =
    EXCHANGE_RATES.find((r) => r.id === selectedExchangeId) || EXCHANGE_RATES[2];

  return (
    <div className="bg-[#F7F8FA] min-h-screen text-[#1E2422] pb-20">
      {/* Breadcrumb Strip */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
            <a
              href={getRouteUrl('home')}
              onClick={(e) => {
                e.preventDefault();
                navigate('home');
              }}
              className="flex items-center gap-1 hover:text-[#073B32] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-[#073B32]">Offers & Savings</span>
          </nav>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-semibold text-[#073B32] hover:text-[#0B5246] flex items-center gap-1 transition-colors"
          >
            <span>View Cart & Applied Savings</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E5A51C]" />
          </button>
        </div>
      </div>

      {/* Storefront Hero */}
      <section className="bg-[#073B32] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-[0.08em] text-[#E5A51C] mb-2.5">
              Factory-Direct Pricing & Exchange Credits
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.12] [text-wrap:balance]">
              Battery Offers & Seasonal Savings
            </h1>
            <p className="mt-3.5 text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
              Save up to 22% on factory-fresh automotive, tubular inverter, and LiFePO4 systems—stackable with instant promo codes and doorstep old-battery buyback.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-14">
        {/* Section 1: Active Promo Codes */}
        <section aria-labelledby="promo-codes-heading">
          <div className="mb-5">
            <h2
              id="promo-codes-heading"
              className="text-xl sm:text-2xl font-bold text-[#073B32] tracking-tight"
            >
              Active Promo Codes
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Apply directly to your cart or copy a code for checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {INITIAL_COUPONS.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;
              const isCopied = copiedCode === coupon.code;

              return (
                <div
                  key={coupon.code}
                  className={`bg-white rounded-xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                    isApplied
                      ? 'border-[#073B32] ring-1 ring-[#073B32]'
                      : 'border-gray-200/90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-base font-bold tracking-wider text-[#073B32]">
                        <Tag className="w-4 h-4 text-[#E5A51C]" />
                        {coupon.code}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-[#073B32]">
                        {coupon.discountPercent}% OFF
                      </span>
                    </div>

                    <p className="mt-2.5 text-sm text-gray-600 leading-relaxed">
                      {coupon.description}
                    </p>

                    <div className="mt-2 text-xs text-gray-500 tabular-nums">
                      Min. order ₹{coupon.minOrder.toLocaleString('en-IN')} · Max discount ₹
                      {coupon.maxDiscount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon(coupon.code)}
                      className={`flex-1 min-h-[40px] px-3.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        isApplied
                          ? 'bg-[#073B32] text-white'
                          : 'bg-[#E5A51C] hover:bg-[#D49514] text-[#073B32]'
                      }`}
                    >
                      {isApplied ? 'Applied to Cart' : 'Apply Code'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(coupon.code)}
                      aria-label={`Copy promo code ${coupon.code}`}
                      className="min-h-[40px] px-3 rounded-lg border border-gray-200 hover:border-[#073B32] text-xs font-medium text-gray-700 hover:text-[#073B32] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#073B32]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Discounted Batteries Grid */}
        <section aria-labelledby="deals-grid-heading">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2
                id="deals-grid-heading"
                className="text-xl sm:text-2xl font-bold text-[#073B32] tracking-tight"
              >
                Discounted Batteries
              </h2>
              <p className="text-sm text-gray-600 mt-1 tabular-nums">
                {discountedProducts.length}{' '}
                {discountedProducts.length === 1 ? 'model' : 'models'} currently on direct factory savings
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Interactive Category Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                {OFFER_GROUPS.map((group) => {
                  const isActive = selectedGroup === group.id;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedGroup(group.id)}
                      className={`px-3.5 min-h-[38px] rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#073B32] text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-[#073B32]/40 hover:text-[#073B32]'
                      }`}
                    >
                      {group.label}
                    </button>
                  );
                })}
              </div>

              {/* Sort Select */}
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'discount' | 'savings' | 'price-low')
                }
                aria-label="Sort offers"
                className="min-h-[38px] px-3 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-[#1E2422] focus:outline-none focus:border-[#073B32] cursor-pointer"
              >
                <option value="discount">Sort: Highest % Off</option>
                <option value="savings">Sort: Biggest ₹ Savings</option>
                <option value="price-low">Sort: Price Low to High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discountedProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              const rupeeSavings = Math.max(0, product.originalPrice - product.price);
              const pctOff =
                product.discountPercent ||
                Math.round((rupeeSavings / product.originalPrice) * 100);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl border border-gray-200/90 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-[#F2F4F3] overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onClick={() =>
                          navigate('product-detail', { productId: product.id })
                        }
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-[1.03]"
                      />

                      {/* Single subtle savings tag */}
                      {pctOff > 0 && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#073B32] text-[#E5A51C] text-[11px] font-bold tabular-nums">
                          {pctOff}% Off
                        </span>
                      )}

                      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product)}
                          aria-label={inWish ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                          aria-pressed={inWish}
                          title={inWish ? 'Remove from Wishlist' : 'Save to Wishlist'}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all active:scale-90 ${
                            inWish
                              ? 'bg-[#E11D48] text-white'
                              : 'bg-white/90 text-gray-600 hover:text-[#E11D48]'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(product)}
                          aria-label={`Quick view ${product.name}`}
                          className="w-9 h-9 rounded-lg bg-white/90 text-gray-600 hover:text-[#073B32] flex items-center justify-center backdrop-blur-sm transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wide font-medium">
                        <span className="text-[#073B32] font-semibold">
                          {product.brand}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{product.capacityAh} Ah</span>
                      </div>

                      <h3 className="mt-1.5 text-base font-semibold text-[#1E2422] leading-snug">
                        <a
                          href={getRouteUrl('product-detail', {
                            productId: product.id,
                          })}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate('product-detail', { productId: product.id });
                          }}
                          className="hover:text-[#073B32] transition-colors"
                        >
                          {product.name}
                        </a>
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 tabular-nums">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#1E2422]">
                          <Star className="w-3.5 h-3.5 text-[#E5A51C] fill-[#E5A51C]" />
                          {product.rating.toFixed(1)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{product.warrantyMonths}M Warranty</span>
                        {rupeeSavings > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-semibold text-[#073B32]">
                              Save ₹{rupeeSavings.toLocaleString('en-IN')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div className="tabular-nums">
                      <div className="text-lg font-bold text-[#073B32]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-xs text-gray-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product, 1)}
                      className="px-4 min-h-[42px] rounded-lg bg-[#E5A51C] hover:bg-[#D49514] text-[#073B32] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Old Battery Exchange Value Estimator */}
        <section className="bg-white rounded-xl border border-gray-200/90 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#073B32] mb-2">
                <Recycle className="w-4 h-4 text-[#E5A51C]" />
                <span>Eco-Certified Scrap Buyback</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#073B32] tracking-tight">
                Estimate Your Old Battery Exchange Rebate
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Hand over your old discharged battery during doorstep installation to receive instant invoice credit. Select your existing battery type:
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXCHANGE_RATES.map((rate) => {
                  const isActive = rate.id === selectedExchangeId;
                  return (
                    <button
                      key={rate.id}
                      type="button"
                      onClick={() => setSelectedExchangeId(rate.id)}
                      className={`min-h-[44px] px-3.5 rounded-lg border text-left text-xs font-semibold flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#073B32] text-white border-[#073B32]'
                          : 'bg-[#F9FAF9] text-[#1E2422] border-gray-200 hover:border-[#073B32]/40'
                      }`}
                    >
                      <span>{rate.label}</span>
                      <span
                        className={`font-mono tabular-nums ${
                          isActive ? 'text-[#E5A51C]' : 'text-[#073B32]'
                        }`}
                      >
                        ₹{rate.credit.toLocaleString('en-IN')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#073B32] text-white rounded-xl p-6 flex flex-col justify-between gap-4">
              <div>
                <div className="text-xs text-white/75">
                  Estimated Instant Buyback Credit
                </div>
                <div className="mt-1 text-3xl sm:text-4xl font-bold text-[#E5A51C] tabular-nums">
                  ₹{activeExchange.credit.toLocaleString('en-IN')}
                </div>
                <div className="mt-1.5 text-xs text-white/80">
                  For {activeExchange.label} · Deducted at doorstep fitment
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate('shop', {
                    category: activeExchange.id === 'solar' ? 'solar' : activeExchange.id,
                  })
                }
                className="w-full min-h-[44px] px-4 rounded-lg bg-[#E5A51C] hover:bg-[#D49514] text-[#073B32] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Shop Eligible Batteries</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
