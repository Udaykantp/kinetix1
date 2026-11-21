import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  Search,
  Star,
  ShoppingCart,
  Heart,
  GitCompare,
  Eye,
  RotateCcw,
  Home,
  ChevronRight,
  ChevronDown,
  Zap,
  Filter,
  CircleDot,
  Car,
  Bike,
  Cpu,
  Sun,
  Server,
  BatteryCharging,
  Wrench,
  Award,
  FlaskConical,
  Truck,
  ShieldCheck,
  Battery,
  Flame,
  Crown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import heroBatteryImg from '../../assets/images/hero_battery_titanium_1794476148118.jpg';

const CATEGORY_ITEMS = [
  { id: 'all', label: 'All Categories', icon: CircleDot },
  { id: 'car', label: 'Car Batteries', icon: Car },
  { id: 'bike', label: 'Bike Batteries', icon: Bike },
  { id: 'inverter', label: 'Inverter Batteries', icon: Zap },
  { id: 'lithium', label: 'Lithium Ion (LiFePO4)', icon: Cpu },
  { id: 'solar', label: 'Solar Storage', icon: Sun },
  { id: 'industrial', label: 'Industrial Rack Banks', icon: Server },
  { id: 'ups', label: 'UPS Reserves', icon: BatteryCharging },
  { id: 'accessories', label: 'Smart Accessories', icon: Wrench },
] as const;

const VOLTAGE_OPTIONS = [
  { id: 'all', label: 'Any' },
  { id: '12V', label: '12V' },
  { id: '24V', label: '24V' },
  { id: '48V', label: '48V' },
] as const;

const CAPACITY_PRESETS = [
  { id: 'any', label: 'Any', min: 0, max: 220 },
  { id: 'compact', label: '≤ 50 Ah', min: 0, max: 50 },
  { id: 'mid', label: '51–120 Ah', min: 51, max: 120 },
  { id: 'high', label: '121–180 Ah', min: 121, max: 180 },
  { id: 'heavy', label: '180+ Ah', min: 180, max: 220 },
] as const;

const WARRANTY_OPTIONS = [
  { months: 0, label: 'Any Warranty' },
  { months: 36, label: '36M+ (3+ Yrs)' },
  { months: 48, label: '48M+ (4+ Yrs)' },
  { months: 60, label: '60M+ (5+ Yrs)' },
  { months: 72, label: '72M+ (6+ Yrs)' },
  { months: 84, label: '84M+ (7+ Yrs)' },
] as const;

function matchesNominalVoltage(productVoltage: string, selectedVoltage: string): boolean {
  if (selectedVoltage === 'all') return true;
  const v = productVoltage.toUpperCase();
  if (selectedVoltage === '12V') return v.includes('12V');
  if (selectedVoltage === '24V') return v.includes('24V') || v.includes('25.6V');
  if (selectedVoltage === '48V') return v.includes('48V') || v.includes('51.2V');
  return v.includes(selectedVoltage.toUpperCase());
}

export const ShopPage: React.FC = () => {
  const {
    page,
    products,
    pageParams,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToComparison,
    isInComparison,
    setQuickViewProduct,
    navigate,
  } = useStore();

  const activeRoutePage = page === 'all-batteries' ? 'all-batteries' : 'shop';

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State (hydrated from deep-link query params)
  const [selectedCategory, setSelectedCategory] = useState<string>(
    pageParams?.category || 'all'
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(pageParams?.brand || 'all');
  const [selectedVoltage, setSelectedVoltage] = useState<string>(pageParams?.voltage || 'all');
  const [selectedTechnology, setSelectedTechnology] = useState<string>(pageParams?.tech || 'all');
  const [minAh, setMinAh] = useState<number>(
    typeof pageParams?.minAh === 'number' ? pageParams.minAh : 0
  );
  const [maxAh, setMaxAh] = useState<number>(
    typeof pageParams?.maxAh === 'number' ? pageParams.maxAh : 220
  );
  const [minWarranty, setMinWarranty] = useState<number>(
    typeof pageParams?.minWarranty === 'number' ? pageParams.minWarranty : 0
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    typeof pageParams?.maxPrice === 'number' ? pageParams.maxPrice : 200000
  );
  const [inStockOnly, setInStockOnly] = useState<boolean>(Boolean(pageParams?.inStock));
  const [sortBy, setSortBy] = useState<string>(pageParams?.sort || 'featured');
  const [searchFilter, setSearchFilter] = useState<string>(pageParams?.search || '');

  const serializeShopParams = (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams();
    if (params.category && params.category !== 'all') qs.set('category', String(params.category));
    if (params.search && String(params.search).trim()) qs.set('search', String(params.search).trim());
    if (params.brand && params.brand !== 'all') qs.set('brand', String(params.brand));
    if (params.voltage && params.voltage !== 'all') qs.set('voltage', String(params.voltage));
    if (params.tech && params.tech !== 'all') qs.set('tech', String(params.tech));
    if (params.minAh && Number(params.minAh) > 0) qs.set('minAh', String(params.minAh));
    if (params.maxAh && Number(params.maxAh) < 220) qs.set('maxAh', String(params.maxAh));
    if (params.minWarranty && Number(params.minWarranty) > 0) qs.set('minWarranty', String(params.minWarranty));
    if (params.maxPrice && Number(params.maxPrice) < 200000) qs.set('maxPrice', String(params.maxPrice));
    if (params.inStock) qs.set('inStock', 'true');
    if (params.sort && params.sort !== 'featured') qs.set('sort', String(params.sort));
    const str = qs.toString();
    return str ? `?${str}` : '';
  };

  const lastSyncedQueryRef = useRef<string>(serializeShopParams(pageParams));

  // Keep local filter state synced on external deep links or browser Back/Forward
  useEffect(() => {
    const incomingQuery = serializeShopParams(pageParams);
    if (incomingQuery === lastSyncedQueryRef.current) return;
    lastSyncedQueryRef.current = incomingQuery;

    setSelectedCategory(pageParams?.category || 'all');
    setSelectedBrand(pageParams?.brand || 'all');
    setSelectedVoltage(pageParams?.voltage || 'all');
    setSelectedTechnology(pageParams?.tech || 'all');
    setMinAh(typeof pageParams?.minAh === 'number' ? pageParams.minAh : 0);
    setMaxAh(typeof pageParams?.maxAh === 'number' ? pageParams.maxAh : 220);
    setMinWarranty(typeof pageParams?.minWarranty === 'number' ? pageParams.minWarranty : 0);
    setMaxPrice(typeof pageParams?.maxPrice === 'number' ? pageParams.maxPrice : 200000);
    setInStockOnly(Boolean(pageParams?.inStock));
    setSortBy(pageParams?.sort || 'featured');
    setSearchFilter(pageParams?.search || '');
  }, [pageParams]);

  // Reflect active filters back into the URL query string for copy-paste deep links
  useEffect(() => {
    const nextParams: Record<string, any> = {};
    if (selectedCategory !== 'all') nextParams.category = selectedCategory;
    if (searchFilter.trim()) nextParams.search = searchFilter.trim();
    if (selectedBrand !== 'all') nextParams.brand = selectedBrand;
    if (selectedVoltage !== 'all') nextParams.voltage = selectedVoltage;
    if (selectedTechnology !== 'all') nextParams.tech = selectedTechnology;
    if (minAh > 0) nextParams.minAh = minAh;
    if (maxAh < 220) nextParams.maxAh = maxAh;
    if (minWarranty > 0) nextParams.minWarranty = minWarranty;
    if (maxPrice < 200000) nextParams.maxPrice = maxPrice;
    if (inStockOnly) nextParams.inStock = true;
    if (sortBy !== 'featured') nextParams.sort = sortBy;

    const nextQuery = serializeShopParams(nextParams);
    if (nextQuery !== lastSyncedQueryRef.current || window.location.search !== nextQuery) {
      lastSyncedQueryRef.current = nextQuery;
      navigate(activeRoutePage, nextParams, { replace: true, skipScroll: true });
    }
  }, [
    activeRoutePage,
    selectedCategory,
    searchFilter,
    selectedBrand,
    selectedVoltage,
    selectedTechnology,
    minAh,
    maxAh,
    minWarranty,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedVoltage('all');
    setSelectedTechnology('all');
    setMinAh(0);
    setMaxAh(220);
    setMinWarranty(0);
    setMaxPrice(200000);
    setInStockOnly(false);
    setSearchFilter('');
    setSortBy('featured');
  };

  // Distinct values for filter options
  const brands = useMemo(() => {
    const set = new Set<string>(products.map((p) => p.brand));
    if (
      selectedBrand !== 'all' &&
      !Array.from(set).some((b) => b.toLowerCase() === selectedBrand.toLowerCase())
    ) {
      set.add(selectedBrand);
    }
    return Array.from(set);
  }, [products, selectedBrand]);

  const technologies = useMemo(() => {
    const set = new Set(products.map((p) => p.technology));
    return Array.from(set);
  }, [products]);

  // Shared predicate allowing real-time facet counts by excluding one facet at a time
  const matchesFilters = (
    p: Product,
    opts?: { skipVoltage?: boolean; skipWarranty?: boolean; skipCapacity?: boolean }
  ) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedBrand !== 'all') {
      const targetBrand = selectedBrand.toLowerCase();
      const matchesBrand =
        p.brand.toLowerCase() === targetBrand ||
        (targetBrand === 'aeon' && p.name.toLowerCase().includes('aeon'));
      if (!matchesBrand) return false;
    }
    if (!opts?.skipVoltage && !matchesNominalVoltage(p.voltage, selectedVoltage)) return false;
    if (selectedTechnology !== 'all' && p.technology !== selectedTechnology) return false;
    if (!opts?.skipCapacity && (minAh > 0 || maxAh < 220)) {
      if (p.capacityAh <= 0) return false;
      if (p.capacityAh < minAh) return false;
      if (maxAh < 220 && p.capacityAh > maxAh) return false;
    }
    if (!opts?.skipWarranty && minWarranty > 0 && p.warrantyMonths < minWarranty) return false;
    if (p.price > maxPrice) return false;
    if (inStockOnly && !p.inStock) return false;
    if (searchFilter.trim()) {
      const query = searchFilter.toLowerCase();
      const matchesName = p.name.toLowerCase().includes(query);
      const matchesBrand = p.brand.toLowerCase().includes(query);
      const matchesCat = p.category.toLowerCase().includes(query);
      const matchesTech = p.technology.toLowerCase().includes(query);
      const matchesCapacity = `${p.capacityAh}ah`.includes(query.replace(/\s+/g, ''));
      const matchesVehicle = p.compatibleVehicles?.some((v) =>
        v.toLowerCase().includes(query)
      );
      if (
        !matchesName &&
        !matchesBrand &&
        !matchesCat &&
        !matchesTech &&
        !matchesCapacity &&
        !matchesVehicle
      ) {
        return false;
      }
    }
    return true;
  };

  // Filtered & Sorted Products (updates in real time)
  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => matchesFilters(p));

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else if (sortBy === 'discount') {
      result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    }
    return result;
  }, [
    products,
    selectedCategory,
    selectedBrand,
    selectedVoltage,
    selectedTechnology,
    minAh,
    maxAh,
    minWarranty,
    maxPrice,
    inStockOnly,
    searchFilter,
    sortBy,
  ]);

  // Live facet counts for Voltage & Warranty pills
  const voltageFacetCounts = useMemo(() => {
    const base = products.filter((p) => matchesFilters(p, { skipVoltage: true }));
    const counts: Record<string, number> = { all: base.length };
    VOLTAGE_OPTIONS.forEach((opt) => {
      if (opt.id !== 'all') {
        counts[opt.id] = base.filter((p) => matchesNominalVoltage(p.voltage, opt.id)).length;
      }
    });
    return counts;
  }, [
    products,
    selectedCategory,
    selectedBrand,
    selectedTechnology,
    minAh,
    maxAh,
    minWarranty,
    maxPrice,
    inStockOnly,
    searchFilter,
  ]);

  const warrantyFacetCounts = useMemo(() => {
    const base = products.filter((p) => matchesFilters(p, { skipWarranty: true }));
    const counts: Record<number, number> = {};
    WARRANTY_OPTIONS.forEach((opt) => {
      counts[opt.months] =
        opt.months === 0
          ? base.length
          : base.filter((p) => p.warrantyMonths >= opt.months).length;
    });
    return counts;
  }, [
    products,
    selectedCategory,
    selectedBrand,
    selectedVoltage,
    selectedTechnology,
    minAh,
    maxAh,
    maxPrice,
    inStockOnly,
    searchFilter,
  ]);

  // Single merchandising tag per product (strictly max 1 badge)
  const getProductBadge = (product: Product, index: number) => {
    if (product.isBestSeller && index === 0) {
      return {
        label: 'Best Seller',
        bg: 'bg-[#E5AD34] text-[#111827]',
        icon: Crown,
      };
    }
    if (product.isNewArrival) {
      return {
        label: 'New Arrival',
        bg: 'bg-[#15804A] text-white',
        icon: Zap,
      };
    }
    if (product.isBestSeller || product.rating >= 4.8) {
      return {
        label: 'Popular',
        bg: 'bg-[#DC4437] text-white',
        icon: Flame,
      };
    }
    return null;
  };

  const minAhPercent = Math.min(100, Math.round((minAh / 220) * 100));
  const maxAhPercent = Math.min(100, Math.round((maxAh / 220) * 100));
  const pricePercent = Math.min(100, Math.round(((maxPrice - 2000) / (200000 - 2000)) * 100));

  const activeCategoryLabel =
    CATEGORY_ITEMS.find((c) => c.id === selectedCategory)?.label || selectedCategory;

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedBrand !== 'all',
    selectedVoltage !== 'all',
    selectedTechnology !== 'all',
    minAh > 0 || maxAh < 220,
    minWarranty > 0,
    maxPrice < 200000,
    inStockOnly,
  ].filter(Boolean).length;

  const activeFilterChips: { id: string; label: string; onClear: () => void }[] = [];
  if (selectedCategory !== 'all') {
    activeFilterChips.push({
      id: 'cat',
      label: activeCategoryLabel,
      onClear: () => setSelectedCategory('all'),
    });
  }
  if (selectedBrand !== 'all') {
    activeFilterChips.push({
      id: 'brand',
      label: `Brand: ${selectedBrand}`,
      onClear: () => setSelectedBrand('all'),
    });
  }
  if (selectedVoltage !== 'all') {
    activeFilterChips.push({
      id: 'voltage',
      label: `Voltage: ${selectedVoltage}`,
      onClear: () => setSelectedVoltage('all'),
    });
  }
  if (minAh > 0 || maxAh < 220) {
    activeFilterChips.push({
      id: 'capacity',
      label: `Capacity: ${minAh}–${maxAh >= 220 ? '220+' : maxAh} Ah`,
      onClear: () => {
        setMinAh(0);
        setMaxAh(220);
      },
    });
  }
  if (minWarranty > 0) {
    activeFilterChips.push({
      id: 'warranty',
      label: `Warranty: ${minWarranty}M+`,
      onClear: () => setMinWarranty(0),
    });
  }
  if (selectedTechnology !== 'all') {
    activeFilterChips.push({
      id: 'tech',
      label: selectedTechnology,
      onClear: () => setSelectedTechnology('all'),
    });
  }
  if (maxPrice < 200000) {
    activeFilterChips.push({
      id: 'price',
      label: `Budget ≤ ₹${maxPrice.toLocaleString('en-IN')}`,
      onClear: () => setMaxPrice(200000),
    });
  }
  if (inStockOnly) {
    activeFilterChips.push({
      id: 'stock',
      label: '4-Hr Delivery Only',
      onClear: () => setInStockOnly(false),
    });
  }

  return (
    <div className="bg-[#F6F7F8] min-h-screen pb-16">
      {/* Top Sub-Header Strip */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Title & Tagline */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F4D078] to-[#C88E2B] flex items-center justify-center shadow-sm shrink-0">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight leading-tight">
                All Energy Systems
              </h1>
              <p className="text-xs text-[#6B7280] font-medium">
                Powering a Sustainable Tomorrow
              </p>
            </div>
          </div>

          {/* Center: Clean Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs sm:text-[13px] text-[#4B5563]"
          >
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-1.5 hover:text-[#0B2E26] font-medium transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#374151]" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'text-[#111827]'
                  : 'text-[#4B5563] hover:text-[#0B2E26]'
              }`}
            >
              Shop All Batteries
            </button>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                <span className="font-semibold text-[#0B2E26]">{activeCategoryLabel}</span>
              </>
            )}
          </nav>

          {/* Right: Mobile Filter Trigger + View Toggle + Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] bg-[#0B2E26] text-white text-xs font-semibold rounded-xl shadow-sm active:scale-95 transition-transform"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#E9C46A]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-[#D6A546] text-[#111827] text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Grid / List View Switcher */}
            <div className="inline-flex items-center bg-white p-1 rounded-xl border border-[#E5E7EB] shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#D6A546] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#D6A546] text-white shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Selector */}
            <div className="relative flex-1 sm:flex-initial min-w-[170px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort batteries"
                className="w-full appearance-none bg-white border border-[#E5E7EB] hover:border-[#D6A546] text-xs font-semibold text-[#111827] pl-3.5 pr-9 py-2.5 min-h-[40px] rounded-xl shadow-xs focus:outline-none focus:border-[#D6A546] cursor-pointer transition-colors"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="discount">Sort by: Best Offers</option>
                <option value="price-low">Sort by: Price Low to High</option>
                <option value="price-high">Sort by: Price High to Low</option>
                <option value="rating">Sort by: Highest Rated</option>
                <option value="newest">Sort by: Newest Releases</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#6B7280] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Deep Forest Green Hero Banner with Integrated Search Pill */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#061D17] via-[#0B2E26] to-[#114235] rounded-b-[28px] sm:rounded-b-[36px] shadow-[0_14px_34px_rgba(6,29,23,0.16)]">
        {/* Right-side Studio Battery Visual & Ambient Warm Gold/Emerald Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Warm golden radial aura behind right showcase */}
          <div
            className="absolute -top-16 right-[14%] w-[420px] h-[320px] rounded-full opacity-35 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(227,185,99,0.75) 0%, rgba(16,128,75,0.35) 55%, transparent 75%)',
            }}
          />
          {/* Subtle studio battery photograph blended smoothly on desktop/tablet */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[44%] lg:w-[38%]">
            <img
              src={heroBatteryImg}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-50 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B2E26] via-[#0B2E26]/65 to-[#061D17]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061D17]/80 via-transparent to-[#061D17]/30" />
          </div>
          {/* Subtle decorative gold energy arc */}
          <svg
            className="hidden sm:block absolute right-[24%] top-0 h-full w-64 opacity-25"
            viewBox="0 0 240 220"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M190 -20 C 90 40, 60 150, 15 240"
              stroke="#E9C46A"
              strokeWidth="1.5"
            />
            <path
              d="M235 -10 C 125 65, 95 160, 45 245"
              stroke="#4ADE80"
              strokeWidth="1"
              strokeOpacity="0.6"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-11 sm:pb-10">
          <div className="max-w-2xl">
            <h2
              className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.1] text-white"
              style={{ textWrap: 'balance' }}
            >
              Premium <span className="text-[#F1C665]">Battery Solutions</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 font-medium mt-2.5">
              Reliable. Efficient. Built for a Sustainable Future.
            </p>
          </div>

          {/* Floating White Pill Search Bar */}
          <div className="mt-6 sm:mt-7 max-w-5xl">
            <div className="bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.22)] flex items-center gap-2 p-1.5 pl-4 sm:pl-5 border border-white/80 focus-within:ring-2 focus-within:ring-[#E9C46A]">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#374151] shrink-0" />
              <input
                type="text"
                placeholder="Search by battery capacity (e.g. 150Ah), car model (e.g. Creta), or chemistry (e.g. LiFePO4)..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-[#111827] placeholder:text-[#6B7280] py-2 focus:outline-none"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  aria-label="Clear search"
                  className="p-2 text-[#6B7280] hover:text-[#111827] transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const gridEl = document.getElementById('catalog-results-grid');
                  gridEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                aria-label="Search batteries"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#D6A546] hover:bg-[#C49335] text-white flex items-center justify-center shadow-sm transition-colors shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Workspace: Sidebar Filters + Product Grid/List */}
      <div
        id="catalog-results-grid"
        className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9"
      >
        <div className="flex flex-col lg:flex-row gap-7 items-start">
          {/* Desktop Left Technical Filters Sidebar */}
          <aside className="hidden lg:block w-[275px] xl:w-[290px] shrink-0 space-y-5 sticky top-24">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_4px_20px_rgba(16,24,32,0.05)] overflow-hidden">
              {/* Dark Forest Green Header */}
              <div className="bg-[#0B2E26] px-4 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Filter className="w-4 h-4 text-[#E9C46A]" />
                  <span className="font-bold text-sm tracking-tight">Technical Filters</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#E9C46A] hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>

              <div className="p-4 space-y-5 text-xs">
                {/* Category Filter */}
                <div>
                  <h3 className="font-bold text-[#111827] text-sm mb-2.5">Category</h3>
                  <div className="space-y-1">
                    {CATEGORY_ITEMS.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors ${
                            isActive
                              ? 'bg-[#FDF8EE] text-[#111827] font-bold'
                              : 'text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827] font-medium'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-[#D6A546] text-white'
                                : 'bg-[#F3F4F6] text-[#4B5563]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <span className="truncate text-[13px]">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="pt-4 border-t border-[#F1F3F5]">
                  <label className="flex items-center gap-2 font-bold text-[#111827] text-[13px] mb-2">
                    <Award className="w-4 h-4 text-[#D6A546]" />
                    <span>Brand</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#E5E7EB] hover:border-[#D6A546] text-xs font-medium text-[#111827] pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:border-[#D6A546] cursor-pointer"
                    >
                      <option value="all">All Manufacturers</option>
                      {brands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6B7280] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Cell Chemistry Filter */}
                <div className="pt-4 border-t border-[#F1F3F5]">
                  <label className="flex items-center gap-2 font-bold text-[#111827] text-[13px] mb-2">
                    <FlaskConical className="w-4 h-4 text-[#D6A546]" />
                    <span>Cell Chemistry</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTechnology}
                      onChange={(e) => setSelectedTechnology(e.target.value)}
                      className="w-full appearance-none bg-white border border-[#E5E7EB] hover:border-[#D6A546] text-xs font-medium text-[#111827] pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:border-[#D6A546] cursor-pointer"
                    >
                      <option value="all">All Chemistries</option>
                      {technologies.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6B7280] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* System Voltage Filter (Real-Time Facet Counts) */}
                <div className="pt-4 border-t border-[#F1F3F5]">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="flex items-center gap-2 font-bold text-[#111827] text-[13px]">
                      <Zap className="w-4 h-4 text-[#D6A546]" />
                      <span>System Voltage</span>
                    </label>
                    {selectedVoltage !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setSelectedVoltage('all')}
                        className="text-[11px] font-semibold text-[#C58A32] hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {VOLTAGE_OPTIONS.map((volt) => {
                      const active = selectedVoltage === volt.id;
                      const count = voltageFacetCounts[volt.id] ?? 0;
                      return (
                        <button
                          key={volt.id}
                          type="button"
                          onClick={() => setSelectedVoltage(volt.id)}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                            active
                              ? 'bg-[#D6A546] border-[#D6A546] text-white shadow-sm'
                              : count === 0
                              ? 'bg-[#F9FAFB] border-[#E5E7EB] text-[#9CA3AF]'
                              : 'bg-white border-[#E5E7EB] text-[#111827] hover:border-[#D6A546]'
                          }`}
                        >
                          <span>{volt.label}</span>
                          <span
                            className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                              active
                                ? 'bg-black/15 text-white'
                                : 'bg-[#F3F4F6] text-[#6B7280]'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Battery Capacity (Ah) Filter: Presets + Real-Time Min/Max Sliders */}
                <div className="pt-4 border-t border-[#F1F3F5]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 font-bold text-[#111827] text-[13px]">
                      <Battery className="w-4 h-4 text-[#D6A546]" />
                      <span>Capacity (Ah)</span>
                    </label>
                    <span className="font-bold text-[#C58A32] tabular-nums text-[12px]">
                      {minAh}–{maxAh >= 220 ? '220+' : maxAh} Ah
                    </span>
                  </div>

                  {/* Quick Capacity Range Presets */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {CAPACITY_PRESETS.map((preset) => {
                      const active = minAh === preset.min && maxAh === preset.max;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setMinAh(preset.min);
                            setMaxAh(preset.max);
                          }}
                          className={`px-2 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                            active
                              ? 'bg-[#0B2E26] border-[#0B2E26] text-white'
                              : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:border-[#D6A546]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                        <span>Min Capacity</span>
                        <span className="font-mono font-semibold text-[#111827]">{minAh} Ah</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="220"
                        step="5"
                        value={minAh}
                        aria-label="Minimum battery capacity in Ah"
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setMinAh(val);
                          if (val > maxAh) setMaxAh(val);
                        }}
                        className="w-full kinetix-range"
                        style={{
                          background: `linear-gradient(to right, #D6A546 0%, #D6A546 ${minAhPercent}%, #E5E7EB ${minAhPercent}%, #E5E7EB 100%)`,
                        }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1">
                        <span>Max Capacity</span>
                        <span className="font-mono font-semibold text-[#111827]">
                          {maxAh >= 220 ? '220+ Ah' : `${maxAh} Ah`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="220"
                        step="5"
                        value={maxAh}
                        aria-label="Maximum battery capacity in Ah"
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setMaxAh(val);
                          if (val < minAh) setMinAh(val);
                        }}
                        className="w-full kinetix-range"
                        style={{
                          background: `linear-gradient(to right, #0B2E26 0%, #0B2E26 ${maxAhPercent}%, #E5E7EB ${maxAhPercent}%, #E5E7EB 100%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Warranty Period Filter (Real-Time Facet Counts) */}
                <div className="pt-4 border-t border-[#F1F3F5]">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="flex items-center gap-2 font-bold text-[#111827] text-[13px]">
                      <ShieldCheck className="w-4 h-4 text-[#D6A546]" />
                      <span>Warranty Period</span>
                    </label>
                    {minWarranty > 0 && (
                      <button
                        type="button"
                        onClick={() => setMinWarranty(0)}
                        className="text-[11px] font-semibold text-[#C58A32] hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {WARRANTY_OPTIONS.map((opt) => {
                      const active = minWarranty === opt.months;
                      const count = warrantyFacetCounts[opt.months] ?? 0;
                      return (
                        <button
                          key={opt.months}
                          type="button"
                          onClick={() => setMinWarranty(opt.months)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                            active
                              ? 'bg-[#FDF8EE] border-[#D6A546] text-[#111827] font-bold'
                              : count === 0
                              ? 'bg-[#F9FAFB] border-[#F1F3F5] text-[#9CA3AF]'
                              : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#D6A546]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                active ? 'border-[#D6A546] bg-[#D6A546]' : 'border-[#D1D5DB]'
                              }`}
                            >
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <span>{opt.label}</span>
                          </span>
                          <span className="font-mono text-[10px] text-[#6B7280] tabular-nums">
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Max Budget Slider */}
                <div className="pt-4 border-t border-[#F1F3F5]">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="font-bold text-[#111827] text-[13px]">Max Budget</label>
                    <span className="font-bold text-[#C58A32] tabular-nums">
                      ₹{maxPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="200000"
                    step="5000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full kinetix-range"
                    style={{
                      background: `linear-gradient(to right, #D6A546 0%, #D6A546 ${pricePercent}%, #E5E7EB ${pricePercent}%, #E5E7EB 100%)`,
                    }}
                  />
                </div>

                {/* Ready for 4-Hour Delivery Toggle */}
                <div className="pt-4 border-t border-[#F1F3F5]">
                  <label className="flex items-center gap-2.5 cursor-pointer text-[#111827] font-semibold">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D1D5DB] accent-[#0B2E26] cursor-pointer"
                    />
                    <Truck className="w-4 h-4 text-[#111827] shrink-0" />
                    <span className="text-[12px] leading-snug">Ready for 4-Hour Delivery Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Trusted Quality Card */}
            <button
              type="button"
              onClick={() => navigate('policy', { type: 'warranty' })}
              className="w-full text-left bg-gradient-to-r from-[#08241D] to-[#113D31] hover:from-[#0B2E26] hover:to-[#164E3F] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#E3B963]/15 border border-[#E3B963]/40 flex items-center justify-center text-[#E9C46A] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white leading-tight">
                    Trusted Quality
                  </div>
                  <div className="text-[11px] text-white/75 mt-0.5 truncate">
                    Genuine Products. Expert Support.
                  </div>
                </div>
              </div>
              <span className="w-7 h-7 rounded-full bg-[#E3B963] text-[#08241D] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </aside>

          {/* Right Product Grid / List Column */}
          <div className="flex-1 min-w-0 w-full">
            {/* Real-Time Results & Removable Active Filter Chips Bar */}
            <div className="mb-5 bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[#4B5563]">
                  Showing{' '}
                  <strong className="text-[#111827] tabular-nums">{filteredProducts.length}</strong>{' '}
                  of <span className="tabular-nums">{products.length}</span> certified battery solutions
                  {searchFilter.trim() ? ` matching "${searchFilter.trim()}"` : ''}
                </span>
                {(activeFilterCount > 0 || searchFilter.trim() !== '') && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 font-semibold text-[#0B2E26] hover:text-[#C58A32] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All Filters</span>
                  </button>
                )}
              </div>

              {activeFilterChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F1F3F5]">
                  {activeFilterChips.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={chip.onClear}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FDF8EE] border border-[#D6A546]/50 text-[#111827] hover:bg-[#F5E6C4] font-semibold text-[11px] transition-colors"
                    >
                      <span>{chip.label}</span>
                      <X className="w-3 h-3 text-[#92621A]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 sm:p-14 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#FDF8EE] text-[#C58A32] flex items-center justify-center mx-auto mb-3">
                  <Battery className="w-6 h-6" />
                </div>
                <p className="text-base text-[#111827] font-bold">
                  No battery models match your exact filter combination.
                </p>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 max-w-md mx-auto">
                  Try lowering minimum capacity (Ah), raising your budget, or clearing the search query.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 px-5 py-2.5 min-h-[42px] bg-[#0B2E26] hover:bg-[#124236] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product, index) => {
                  const inWish = isInWishlist(product.id);
                  const inComp = isInComparison(product.id);
                  const badge = getProductBadge(product, index);
                  const BadgeIcon = badge?.icon;

                  return (
                    <article
                      key={product.id}
                      className="group bg-white border border-[#E5E7EB] hover:border-[#D6A546]/70 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(16,24,32,0.05)] hover:shadow-[0_14px_30px_rgba(16,24,32,0.10)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                    >
                      {/* Top Image Area */}
                      <div
                        onClick={() => navigate('product-detail', { productId: product.id })}
                        className="relative aspect-[16/10] bg-[#16191D] overflow-hidden cursor-pointer"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Top-Left Single Merchandising Tag */}
                        {badge && BadgeIcon && (
                          <span
                            className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md ${badge.bg}`}
                          >
                            <BadgeIcon className="w-3 h-3 fill-current" />
                            <span>{badge.label}</span>
                          </span>
                        )}

                        {/* Top-Right Quick Actions: Heart always visible; Quick View & Compare on hover */}
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
                            className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md shadow-sm transition-all active:scale-90 ${
                              inWish
                                ? 'bg-[#E11D48] text-white'
                                : 'bg-white/90 text-[#374151] hover:text-[#E11D48] hover:bg-white'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                          </button>
                          <div className="flex flex-col gap-1.5 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => setQuickViewProduct(product)}
                              aria-label="Quick view"
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/55 hover:bg-black/80 text-white backdrop-blur-md shadow-sm transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => addToComparison(product)}
                              aria-label="Compare battery"
                              className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md shadow-sm transition-colors ${
                                inComp
                                  ? 'bg-[#D6A546] text-[#111827]'
                                  : 'bg-black/55 text-white hover:bg-black/80'
                              }`}
                            >
                              <GitCompare className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Brand · Category */}
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                            <span>{product.brand}</span>
                            <span aria-hidden="true">·</span>
                            <span>{product.category}</span>
                          </div>

                          {/* Product Name */}
                          <h3
                            onClick={() =>
                              navigate('product-detail', { productId: product.id })
                            }
                            className="text-[15px] sm:text-base font-extrabold text-[#111827] hover:text-[#B5812B] cursor-pointer mt-1 line-clamp-1 transition-colors"
                          >
                            {product.name}
                          </h3>

                          {/* Technical Unboxed Spec Line */}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#4B5563] mt-2 font-medium">
                            {product.capacityAh > 0 && (
                              <>
                                <span className="inline-flex items-center gap-1">
                                  <Battery className="w-3.5 h-3.5 text-[#6B7280]" />
                                  <span>{product.capacityAh} Ah</span>
                                </span>
                                <span className="text-[#D1D5DB]" aria-hidden="true">
                                  |
                                </span>
                              </>
                            )}
                            <span>{product.voltage}</span>
                            <span className="text-[#D1D5DB]" aria-hidden="true">
                              |
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#6B7280]" />
                              <span>{product.warrantyMonths}M Warranty</span>
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
                            <Star className="w-3.5 h-3.5 text-[#E5A930] fill-[#E5A930]" />
                            <span className="font-bold text-[#111827] tabular-nums">
                              {product.rating.toFixed(1)}
                            </span>
                            <span className="text-[#6B7280]">({product.reviewCount} Reviews)</span>
                          </div>
                        </div>

                        {/* Price & Add to Cart Row */}
                        <div className="mt-4 pt-3.5 border-t border-[#F1F3F5] flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-lg font-extrabold text-[#111827] tabular-nums leading-tight">
                              ₹{product.price.toLocaleString('en-IN')}
                            </div>
                            {product.originalPrice > product.price && (
                              <div className="text-xs text-[#9CA3AF] line-through tabular-nums mt-0.5">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => addToCart(product)}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[40px] bg-[#E3B963] hover:bg-[#D6A546] active:scale-95 text-[#111827] rounded-xl text-xs font-bold shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredProducts.map((product, index) => {
                  const inWish = isInWishlist(product.id);
                  const badge = getProductBadge(product, index);
                  const BadgeIcon = badge?.icon;

                  return (
                    <article
                      key={product.id}
                      className="bg-white border border-[#E5E7EB] hover:border-[#D6A546]/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-center justify-between shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto min-w-0">
                        <div
                          onClick={() => navigate('product-detail', { productId: product.id })}
                          className="relative w-full sm:w-36 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-[#16191D] shrink-0 cursor-pointer"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {badge && BadgeIcon && (
                            <span
                              className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow ${badge.bg}`}
                            >
                              <BadgeIcon className="w-2.5 h-2.5 fill-current" />
                              <span>{badge.label}</span>
                            </span>
                          )}
                        </div>

                        <div className="text-center sm:text-left min-w-0 flex-1">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                            <span>{product.brand}</span>
                            <span aria-hidden="true">·</span>
                            <span>{product.technology}</span>
                          </div>
                          <h3
                            onClick={() =>
                              navigate('product-detail', { productId: product.id })
                            }
                            className="text-base font-extrabold text-[#111827] hover:text-[#B5812B] cursor-pointer mt-1"
                          >
                            {product.name}
                          </h3>
                          <p className="text-xs text-[#6B7280] mt-1 line-clamp-2 max-w-xl">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-[#4B5563] mt-2 font-medium">
                            {product.capacityAh > 0 && <span>{product.capacityAh} Ah</span>}
                            <span>{product.voltage}</span>
                            <span>{product.warrantyMonths}M Warranty</span>
                            <span className="inline-flex items-center gap-1 font-bold text-[#111827]">
                              <Star className="w-3.5 h-3.5 text-[#E5A930] fill-[#E5A930]" />
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-3 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F1F3F5]">
                        <div className="text-center sm:text-right">
                          <div className="text-lg font-extrabold text-[#111827] tabular-nums">
                            ₹{product.price.toLocaleString('en-IN')}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-xs text-[#9CA3AF] line-through tabular-nums">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product)}
                            aria-label={inWish ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                            aria-pressed={inWish}
                            title={inWish ? 'Remove from Wishlist' : 'Save to Wishlist'}
                            className={`min-w-[40px] min-h-[40px] rounded-xl border flex items-center justify-center transition-all active:scale-90 shrink-0 ${
                              inWish
                                ? 'bg-[#E11D48] border-[#E11D48] text-white'
                                : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:text-[#E11D48] hover:border-[#E11D48]/40'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 sm:flex-initial min-h-[40px] px-4 py-2 bg-[#E3B963] hover:bg-[#D6A546] text-[#111827] rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                          <button
                            onClick={() =>
                              navigate('product-detail', { productId: product.id })
                            }
                            className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] rounded-xl text-xs font-semibold transition-colors whitespace-nowrap"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] bg-white rounded-t-3xl flex flex-col shadow-2xl overflow-hidden">
            {/* Dark Forest Green Drawer Header */}
            <div className="bg-[#0B2E26] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Filter className="w-4 h-4 text-[#E9C46A]" />
                <h3 className="text-sm font-bold tracking-tight">Technical Filters</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters Body */}
            <div className="overflow-y-auto p-5 space-y-6 text-xs flex-1">
              {/* Category */}
              <div>
                <label className="font-bold text-[#111827] text-sm block mb-2.5">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_ITEMS.map((cat) => {
                    const Icon = cat.icon;
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`min-h-[44px] flex items-center gap-2 text-left px-3 py-2 rounded-xl border transition-colors ${
                          active
                            ? 'bg-[#FDF8EE] border-[#D6A546] text-[#111827] font-bold'
                            : 'bg-white border-[#E5E7EB] text-[#374151] font-medium'
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            active ? 'text-[#C58A32]' : 'text-[#6B7280]'
                          }`}
                        />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="font-bold text-[#111827] text-sm block mb-2">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full min-h-[44px] bg-white border border-[#E5E7EB] text-xs font-medium text-[#111827] px-3 py-2 rounded-xl focus:outline-none focus:border-[#D6A546]"
                >
                  <option value="all">All Manufacturers</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cell Chemistry */}
              <div>
                <label className="font-bold text-[#111827] text-sm block mb-2">
                  Cell Chemistry
                </label>
                <select
                  value={selectedTechnology}
                  onChange={(e) => setSelectedTechnology(e.target.value)}
                  className="w-full min-h-[44px] bg-white border border-[#E5E7EB] text-xs font-medium text-[#111827] px-3 py-2 rounded-xl focus:outline-none focus:border-[#D6A546]"
                >
                  <option value="all">All Chemistries</option>
                  {technologies.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Voltage */}
              <div>
                <label className="font-bold text-[#111827] text-sm block mb-2.5">
                  System Voltage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VOLTAGE_OPTIONS.map((volt) => {
                    const active = selectedVoltage === volt.id;
                    const count = voltageFacetCounts[volt.id] ?? 0;
                    return (
                      <button
                        key={volt.id}
                        type="button"
                        onClick={() => setSelectedVoltage(volt.id)}
                        className={`min-h-[44px] px-3 rounded-xl border text-xs font-bold transition-colors flex items-center justify-between ${
                          active
                            ? 'bg-[#D6A546] border-[#D6A546] text-white'
                            : 'bg-white border-[#E5E7EB] text-[#111827]'
                        }`}
                      >
                        <span>{volt.label}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            active ? 'bg-black/15 text-white' : 'bg-[#F3F4F6] text-[#6B7280]'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Capacity (Ah) Presets + Sliders */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-[#111827] text-sm">Capacity (Ah)</label>
                  <span className="font-bold text-[#C58A32] tabular-nums">
                    {minAh}–{maxAh >= 220 ? '220+' : maxAh} Ah
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {CAPACITY_PRESETS.map((preset) => {
                    const active = minAh === preset.min && maxAh === preset.max;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setMinAh(preset.min);
                          setMaxAh(preset.max);
                        }}
                        className={`min-h-[36px] px-3 py-1 rounded-lg border text-xs font-semibold ${
                          active
                            ? 'bg-[#0B2E26] border-[#0B2E26] text-white'
                            : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-[#6B7280] mb-1">
                      <span>Min Capacity</span>
                      <span className="font-mono font-semibold text-[#111827]">{minAh} Ah</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="220"
                      step="5"
                      value={minAh}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMinAh(val);
                        if (val > maxAh) setMaxAh(val);
                      }}
                      className="w-full kinetix-range"
                      style={{
                        background: `linear-gradient(to right, #D6A546 0%, #D6A546 ${minAhPercent}%, #E5E7EB ${minAhPercent}%, #E5E7EB 100%)`,
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-[#6B7280] mb-1">
                      <span>Max Capacity</span>
                      <span className="font-mono font-semibold text-[#111827]">
                        {maxAh >= 220 ? '220+ Ah' : `${maxAh} Ah`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="220"
                      step="5"
                      value={maxAh}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setMaxAh(val);
                        if (val < minAh) setMinAh(val);
                      }}
                      className="w-full kinetix-range"
                      style={{
                        background: `linear-gradient(to right, #0B2E26 0%, #0B2E26 ${maxAhPercent}%, #E5E7EB ${maxAhPercent}%, #E5E7EB 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Warranty Period */}
              <div>
                <label className="font-bold text-[#111827] text-sm block mb-2.5">
                  Warranty Period
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WARRANTY_OPTIONS.map((opt) => {
                    const active = minWarranty === opt.months;
                    const count = warrantyFacetCounts[opt.months] ?? 0;
                    return (
                      <button
                        key={opt.months}
                        type="button"
                        onClick={() => setMinWarranty(opt.months)}
                        className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                          active
                            ? 'bg-[#FDF8EE] border-[#D6A546] text-[#111827] font-bold'
                            : 'bg-white border-[#E5E7EB] text-[#374151]'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        <span className="font-mono text-[10px] text-[#6B7280]">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Budget Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-[#111827] text-sm">Max Budget</label>
                  <span className="font-bold text-[#C58A32] tabular-nums">
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="200000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full kinetix-range"
                  style={{
                    background: `linear-gradient(to right, #D6A546 0%, #D6A546 ${pricePercent}%, #E5E7EB ${pricePercent}%, #E5E7EB 100%)`,
                  }}
                />
              </div>

              {/* In Stock Toggle */}
              <label className="min-h-[44px] flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl cursor-pointer text-[#111827] font-semibold">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#0B2E26]"
                />
                <Truck className="w-4 h-4 text-[#0B2E26] shrink-0" />
                <span>Ready for 4-Hour Delivery Only</span>
              </label>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="p-4 border-t border-[#E5E7EB] bg-white flex items-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                onClick={resetFilters}
                className="min-h-[44px] px-4 py-2.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="min-h-[44px] flex-1 py-2.5 px-4 bg-[#0B2E26] hover:bg-[#124236] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center shadow-md active:scale-95"
              >
                <span>Show {filteredProducts.length} Batteries</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
