import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Eye,
  Heart,
  Home,
  Scale,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORY_METADATA } from '../../data/products';
import { ProductCategory } from '../../types';
import { CategoryPageType, PageType } from '../../utils/router';

export interface CategoryHeroStat {
  label: string;
  value: string;
}

export interface CategorySelectionGuideItem {
  title: string;
  detail: string;
}

export interface BatteryCategoryPageConfig {
  category: ProductCategory;
  pageType: CategoryPageType;
  title: string;
  eyebrow: string;
  headline: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  buyingTip: string;
  heroStats: CategoryHeroStat[];
  selectionGuideTitle: string;
  selectionGuideItems: CategorySelectionGuideItem[];
  secondaryCta?: {
    label: string;
    targetPage: PageType;
    params?: Record<string, any>;
  };
  faqs: { q: string; a: string }[];
}

export const CATEGORY_NAV_ITEMS: {
  pageType: CategoryPageType | 'all-batteries';
  category?: ProductCategory;
  label: string;
}[] = [
  { pageType: 'car-batteries', category: 'car', label: 'Car Batteries' },
  { pageType: 'bike-batteries', category: 'bike', label: 'Bike Batteries' },
  { pageType: 'inverter-batteries', category: 'inverter', label: 'Inverter Batteries' },
  { pageType: 'lithium-batteries', category: 'lithium', label: 'Lithium (LiFePO4)' },
  { pageType: 'solar-batteries', category: 'solar', label: 'Solar Batteries' },
  { pageType: 'industrial-batteries', category: 'industrial', label: 'Industrial Batteries' },
  { pageType: 'ups-batteries', category: 'ups', label: 'UPS Batteries' },
  { pageType: 'accessories', category: 'accessories', label: 'Accessories' },
  { pageType: 'all-batteries', label: 'Browse All Batteries' },
];

type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'warranty';

interface BatteryCategoryLayoutProps {
  config: BatteryCategoryPageConfig;
  children?: React.ReactNode;
}

export const BatteryCategoryLayout: React.FC<BatteryCategoryLayoutProps> = ({
  config,
  children,
}) => {
  const {
    products,
    navigate,
    getRouteUrl,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToComparison,
    isInComparison,
    setQuickViewProduct,
  } = useStore();

  const [queryText, setQueryText] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedVoltage, setSelectedVoltage] = useState('All');
  const [sortBy, setSortBy] = useState<SortMode>('featured');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const categoryProducts = useMemo(
    () => products.filter((p) => p.category === config.category),
    [products, config.category]
  );

  const availableBrands = useMemo(() => {
    const set = new Set(categoryProducts.map((p) => p.brand));
    return ['All', ...Array.from(set)];
  }, [categoryProducts]);

  const availableVoltages = useMemo(() => {
    const set = new Set(categoryProducts.map((p) => p.voltage));
    return ['All', ...Array.from(set)];
  }, [categoryProducts]);

  const filteredProducts = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    let list = categoryProducts.filter((p) => {
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
      if (selectedVoltage !== 'All' && p.voltage !== selectedVoltage) return false;
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.technology} ${p.voltage} ${p.capacityAh}ah ${
          p.compatibleVehicles?.join(' ') || ''
        } ${p.compatibleAppliances?.join(' ') || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case 'warranty':
          return b.warrantyMonths - a.warrantyMonths;
        case 'featured':
        default:
          return Number(Boolean(b.isBestSeller || b.isFeatured)) -
            Number(Boolean(a.isBestSeller || a.isFeatured));
      }
    });

    return list;
  }, [categoryProducts, queryText, selectedBrand, selectedVoltage, sortBy]);

  const metaFallbackFaqs = CATEGORY_METADATA[config.category]?.faqs || [];
  const faqsToRender = config.faqs.length > 0 ? config.faqs : metaFallbackFaqs;

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetPage: PageType,
    params: Record<string, any> = {}
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(targetPage, params);
  };

  return (
    <div className="bg-[#F6F8F7] min-h-screen pb-20 text-[#121417]">
      {/* Breadcrumb Strip */}
      <div className="bg-white border-b border-gray-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-[#5C6663]">
          <a
            href={getRouteUrl('home')}
            onClick={(e) => handleLinkClick(e, 'home')}
            className="inline-flex items-center gap-1 hover:text-[#073B32] transition-colors whitespace-nowrap"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <a
            href={getRouteUrl('all-batteries')}
            onClick={(e) => handleLinkClick(e, 'all-batteries')}
            className="hover:text-[#073B32] transition-colors whitespace-nowrap"
          >
            Browse All Batteries
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="font-semibold text-[#073B32] truncate">{config.title}</span>
        </div>
      </div>

      {/* Dedicated Split Hero Section */}
      <section className="bg-[#073B32] text-white border-b border-[#0B2E26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Narrative & CTA */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E5A51C]">
                  {config.eyebrow}
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.1] text-white [text-wrap:balance]">
                  {config.headline}
                </h1>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                  {config.description}
                </p>
              </div>

              {/* 3 Key Category Specifications */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
                {config.heroStats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-lg sm:text-2xl font-bold text-[#E5A51C] font-mono tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/75 leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Primary & Secondary Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#category-models"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById('category-models')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#E5A51C] hover:bg-[#D49412] text-[#073B32] text-sm font-bold transition-colors whitespace-nowrap"
                >
                  <span>Shop {config.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                {config.secondaryCta && (
                  <a
                    href={getRouteUrl(config.secondaryCta.targetPage, config.secondaryCta.params)}
                    onClick={(e) =>
                      handleLinkClick(
                        e,
                        config.secondaryCta!.targetPage,
                        config.secondaryCta!.params
                      )
                    }
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/25 hover:border-[#E5A51C] text-white hover:text-[#E5A51C] text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    <span>{config.secondaryCta.label}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Studio Visual */}
            <div className="lg:col-span-5">
              <div className="relative h-64 sm:h-72 lg:h-full min-h-[260px] rounded-2xl overflow-hidden border border-white/15 bg-[#0B2E26]">
                {!imgErrorMap['hero'] ? (
                  <img
                    src={config.heroImage}
                    alt={config.heroImageAlt}
                    referrerPolicy="no-referrer"
                    onError={() => setImgErrorMap((prev) => ({ ...prev, hero: true }))}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 text-center text-white/70 text-sm">
                    {config.title}
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#073B32]/80 via-[#073B32]/15 to-transparent"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 text-xs text-white/90">
                  <span className="font-medium">{config.title}</span>
                  <span className="font-mono tabular-nums text-[#E5A51C] font-semibold">
                    {categoryProducts.length}{' '}
                    {categoryProducts.length === 1 ? 'Model Ready' : 'Models Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Category Route Switcher Bar */}
      <nav
        aria-label="Battery category pages"
        className="bg-white border-b border-gray-200/90 sticky top-16 lg:top-[72px] z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORY_NAV_ITEMS.map((item) => {
            const active = item.pageType === config.pageType;
            return (
              <a
                key={item.pageType}
                href={getRouteUrl(item.pageType)}
                onClick={(e) => handleLinkClick(e, item.pageType)}
                aria-current={active ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-[#073B32] text-white'
                    : 'text-[#394542] hover:bg-[#F1F5F3] hover:text-[#073B32]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Optional Category-Specific Spotlight Band */}
      {children && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">{children}</div>
      )}

      {/* Main Catalog Section */}
      <section
        id="category-models"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 scroll-mt-32"
      >
        {/* Refinement Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200/90 p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#073B32] tracking-tight">
                {config.title} Lineup
              </h2>
              <p className="text-xs sm:text-sm text-[#5C6663] mt-0.5 tabular-nums">
                Showing {filteredProducts.length} of {categoryProducts.length} certified models ·
                Free doorstep installation & digital warranty
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Inline Category Search */}
              <div className="relative flex-1 sm:flex-initial min-w-[200px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder={`Search ${config.title.toLowerCase()}...`}
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#F7F9F8] border border-gray-200 text-xs sm:text-sm text-[#121417] focus:outline-none focus:border-[#073B32] focus:bg-white"
                />
              </div>

              {/* Brand Filter */}
              {availableBrands.length > 2 && (
                <select
                  aria-label="Filter by brand"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#F7F9F8] border border-gray-200 text-xs sm:text-sm font-medium text-[#121417] focus:outline-none focus:border-[#073B32]"
                >
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>
                      {b === 'All' ? 'All Brands' : b}
                    </option>
                  ))}
                </select>
              )}

              {/* Voltage Filter */}
              {availableVoltages.length > 2 && (
                <select
                  aria-label="Filter by voltage"
                  value={selectedVoltage}
                  onChange={(e) => setSelectedVoltage(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#F7F9F8] border border-gray-200 text-xs sm:text-sm font-medium text-[#121417] focus:outline-none focus:border-[#073B32]"
                >
                  {availableVoltages.map((v) => (
                    <option key={v} value={v}>
                      {v === 'All' ? 'All Voltages' : v}
                    </option>
                  ))}
                </select>
              )}

              {/* Sort Selector */}
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMode)}
                className="h-10 px-3 rounded-lg bg-[#F7F9F8] border border-gray-200 text-xs sm:text-sm font-medium text-[#121417] focus:outline-none focus:border-[#073B32]"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="warranty">Longest Warranty</option>
              </select>

              <a
                href={getRouteUrl('all-batteries', { category: config.category })}
                onClick={(e) =>
                  handleLinkClick(e, 'all-batteries', { category: config.category })
                }
                className="h-10 px-3.5 rounded-lg border border-[#073B32]/25 hover:border-[#073B32] text-[#073B32] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Advanced Filters</span>
              </a>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center space-y-3">
            <h3 className="text-lg font-bold text-[#121417]">
              No {config.title.toLowerCase()} matched your filter
            </h3>
            <p className="text-sm text-[#5C6663]">
              Try resetting your search text, brand, or voltage filter to view all models in this
              category.
            </p>
            <button
              type="button"
              onClick={() => {
                setQueryText('');
                setSelectedBrand('All');
                setSelectedVoltage('All');
              }}
              className="px-4 py-2.5 rounded-lg bg-[#073B32] text-white text-xs font-semibold hover:bg-[#0A5246] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              const inCompare = isInComparison(product.id);
              const imgFailed = Boolean(imgErrorMap[product.id]);

              return (
                <article
                  key={product.id}
                  className="group bg-white rounded-xl border border-gray-200/90 hover:border-[#073B32]/35 hover:shadow-[0_12px_30px_rgba(7,59,50,0.08)] transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between"
                >
                  {/* 4:3 Image Header */}
                  <div
                    onClick={() => navigate('product-detail', { productId: product.id })}
                    className="relative aspect-[4/3] bg-[#F2F4F3] overflow-hidden cursor-pointer"
                  >
                    {!imgFailed ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setImgErrorMap((prev) => ({ ...prev, [product.id]: true }))
                        }
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 p-4 text-center">
                        {product.name}
                      </div>
                    )}

                    {/* Single restrained text tag if flagship/popular */}
                    {(product.isBestSeller || product.isNewArrival) && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#073B32]/90 text-[#E5A51C] text-[11px] font-semibold tracking-wide">
                        {product.isBestSeller ? 'Best Seller' : 'New Arrival'}
                      </span>
                    )}

                    {/* Functional Action Affordances */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 flex flex-col gap-1.5"
                    >
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product)}
                        aria-label={
                          inWish
                            ? `Remove ${product.name} from wishlist`
                            : `Save ${product.name} to wishlist`
                        }
                        aria-pressed={inWish}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
                          inWish
                            ? 'bg-[#E11D48] text-white shadow-sm'
                            : 'bg-white/90 text-[#222826] hover:text-[#E11D48] shadow-xs'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(product)}
                        aria-label={`Quick view ${product.name}`}
                        className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-md text-[#222826] hover:text-[#073B32] shadow-xs flex items-center justify-center transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {/* Clean unboxed metadata */}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#5C6663]">
                        <span className="uppercase tracking-wider text-[#073B32] font-semibold">
                          {product.brand}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.technology}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#121417] leading-snug">
                        <a
                          href={getRouteUrl('product-detail', { productId: product.id })}
                          onClick={(e) =>
                            handleLinkClick(e, 'product-detail', { productId: product.id })
                          }
                          className="hover:text-[#073B32] transition-colors line-clamp-2"
                        >
                          {product.name}
                        </a>
                      </h3>

                      {/* Key technical specs line */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4A5652] font-mono tabular-nums">
                        {product.capacityAh > 0 && (
                          <>
                            <span>{product.capacityAh} Ah</span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span>{product.voltage}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.warrantyMonths}M Warranty</span>
                      </div>

                      <p className="text-xs text-[#5C6663] leading-relaxed line-clamp-2">
                        {product.description}
                      </p>

                      {/* Star Rating Row */}
                      <div className="flex items-center gap-1.5 text-xs pt-0.5 tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#D6A546] text-[#D6A546]" />
                        <span className="font-bold text-[#121417]">{product.rating.toFixed(1)}</span>
                        <span className="text-[#5C6663]">({product.reviewCount} reviews)</span>
                      </div>
                    </div>

                    {/* Price & Actions Footer */}
                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
                      <div className="flex items-end justify-between gap-2">
                        <div>
                          <div className="text-lg font-bold text-[#073B32] font-mono tabular-nums">
                            ₹{product.price.toLocaleString('en-IN')}
                          </div>
                          {product.discountPercent > 0 && (
                            <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums">
                              <span className="text-gray-400 line-through">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[#073B32] font-semibold">
                                Save {product.discountPercent}%
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => addToComparison(product)}
                          className={`px-2.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1 transition-colors ${
                            inCompare
                              ? 'bg-[#073B32]/10 text-[#073B32] font-semibold'
                              : 'text-[#5C6663] hover:text-[#073B32] hover:bg-[#F3F6F5]'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{inCompare ? 'Compared' : 'Compare'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={getRouteUrl('product-detail', { productId: product.id })}
                          onClick={(e) =>
                            handleLinkClick(e, 'product-detail', { productId: product.id })
                          }
                          className="h-10 px-3 rounded-lg border border-gray-200 hover:border-[#073B32] text-[#121417] hover:text-[#073B32] text-xs font-semibold flex items-center justify-center transition-colors whitespace-nowrap"
                        >
                          View Specs
                        </a>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="h-10 px-3 rounded-lg bg-[#E5A51C] hover:bg-[#D49412] text-[#073B32] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Engineering Selection Guide + Buying Tip */}
        <div className="mt-16 pt-12 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B5812B]">
                Selection Checklist
              </p>
              <h3 className="text-2xl font-bold text-[#073B32] mt-1">
                {config.selectionGuideTitle}
              </h3>
            </div>

            <div className="space-y-4">
              {config.selectionGuideItems.map((item, idx) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl border border-gray-200/90 p-5 flex items-start gap-4"
                >
                  <span className="font-mono text-sm font-bold text-[#B5812B] tabular-nums shrink-0 pt-0.5">
                    0{idx + 1}.
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#121417]">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-[#4A5652] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            {/* Engineering Tip Callout */}
            <div className="bg-[#073B32] text-white rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#E5A51C] text-xs font-semibold uppercase tracking-[0.1em]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Engineering Recommendation</span>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">{config.buyingTip}</p>
              <div className="pt-2 flex items-center gap-4 text-xs text-white/75">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#E5A51C]" />
                  4-Hour Metro Fitment
                </span>
                <span aria-hidden="true">·</span>
                <span>100% Genuine BIS Stock</span>
              </div>
            </div>

            {/* Category FAQs Accordion */}
            {faqsToRender.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200/90 divide-y divide-gray-100 overflow-hidden">
                <div className="px-5 py-4">
                  <h4 className="text-sm font-bold text-[#073B32]">
                    {config.title} — Common Questions
                  </h4>
                </div>
                {faqsToRender.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div key={faq.q}>
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-3 hover:bg-[#F7F9F8] transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-[#121417]">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#073B32] shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs sm:text-sm text-[#4A5652] leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
