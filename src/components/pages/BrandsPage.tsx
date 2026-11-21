import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Eye,
  Heart,
  Home,
  ChevronRight,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Award,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import carBatteryImg from '../../assets/images/product_car_battery_1794476149763.jpg';
import bikeBatteryImg from '../../assets/images/cat_bike_battery_1795185387964.jpg';
import inverterBatteryImg from '../../assets/images/product_inverter_battery_1794476149979.jpg';
import upsBatteryImg from '../../assets/images/cat_ups_battery_1795185406017.jpg';
import solarBatteryImg from '../../assets/images/cat_solar_battery_1795185352147.jpg';
import heroBatteryImg from '../../assets/images/hero_battery_titanium_1794476148118.jpg';

interface BrandProfile {
  name: string;
  founded: string;
  specialty: string;
  warranty: string;
  chemistries: string;
  summary: string;
  image: string;
  matchKeys: string[];
}

const BRAND_PROFILES: BrandProfile[] = [
  {
    name: 'Exide',
    founded: 'Est. 1947',
    specialty: 'Automotive & Inverter',
    warranty: 'Up to 66M Warranty',
    chemistries: 'Lead-Acid · Tubular · VRLA',
    summary:
      'India’s benchmark OEM automotive and inverter manufacturer with nationwide roadside service coverage and punched grid durability.',
    image: carBatteryImg,
    matchKeys: ['exide'],
  },
  {
    name: 'Amaron',
    founded: 'Est. 2000',
    specialty: 'Zero-Maintenance Automotive',
    warranty: 'Up to 72M Warranty',
    chemistries: 'Silven X Alloy · VRLA Gel',
    summary:
      'High-cranking Silven X silver-alloy batteries built for extreme under-bonnet temperatures, long shelf life, and zero water top-ups.',
    image: bikeBatteryImg,
    matchKeys: ['amaron'],
  },
  {
    name: 'Luminous',
    founded: 'Est. 1988',
    specialty: 'Home Inverter & Solar',
    warranty: 'Up to 60M Warranty',
    chemistries: 'Tall Tubular · Solar C10',
    summary:
      'Trusted household backup power engineered for frequent deep discharges, rapid recharge recovery, and low-antimony water retention.',
    image: inverterBatteryImg,
    matchKeys: ['luminous'],
  },
  {
    name: 'Livguard',
    founded: 'Est. 2014',
    specialty: '3D Grid High-Backup',
    warranty: 'Up to 60M Warranty',
    chemistries: 'Tall Tubular · Automotive',
    summary:
      'Next-generation 3D grid inverter and automotive units engineered to maximize backup hours during prolonged regional power outages.',
    image: upsBatteryImg,
    matchKeys: ['livguard'],
  },
  {
    name: 'V-Guard',
    founded: 'Est. 1977',
    specialty: 'Residential & Hybrid Solar',
    warranty: 'Up to 66M Warranty',
    chemistries: 'High-Pressure Cast Tubular',
    summary:
      'Precision-cast selenium alloy spines engineered for thermal endurance, smooth inverter pairing, and dependable nationwide service.',
    image: solarBatteryImg,
    matchKeys: ['v-guard', 'vguard'],
  },
  {
    name: 'AEON',
    founded: 'Flagship Series',
    specialty: 'Pure Lead AGM & LiFePO4',
    warranty: 'Up to 10-Yr Warranty',
    chemistries: 'AGM · Prismatic LiFePO4',
    summary:
      'Aerospace-grade Pure Lead AGM ignition and prismatic LiFePO4 energy packs delivering high cold-cranking amps and 6,000+ cycle longevity.',
    image: heroBatteryImg,
    matchKeys: ['aeon', 'kinetix'],
  },
];

function matchesBrandProfile(product: Product, profile: BrandProfile): boolean {
  const brandLower = product.brand.toLowerCase();
  const nameLower = product.name.toLowerCase();
  return profile.matchKeys.some(
    (key) => brandLower === key || (key === 'aeon' && nameLower.includes('aeon'))
  );
}

export const BrandsPage: React.FC = () => {
  const {
    products,
    pageParams,
    navigate,
    getRouteUrl,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
  } = useStore();

  const normalizeBrandParam = (raw?: string): string => {
    if (!raw) return 'All';
    const found = BRAND_PROFILES.find(
      (b) => b.name.toLowerCase() === raw.toLowerCase()
    );
    return found ? found.name : 'All';
  };

  const [selectedBrand, setSelectedBrand] = useState<string>(() =>
    normalizeBrandParam(pageParams?.brand)
  );

  useEffect(() => {
    setSelectedBrand(normalizeBrandParam(pageParams?.brand));
  }, [pageParams?.brand]);

  const handleSelectBrand = (brandName: string) => {
    setSelectedBrand(brandName);
    if (brandName === 'All') {
      navigate('brands', {}, { replace: true, skipScroll: true });
    } else {
      navigate('brands', { brand: brandName }, { replace: true, skipScroll: true });
    }
  };

  const activeProfile = useMemo(
    () => BRAND_PROFILES.find((b) => b.name === selectedBrand) || null,
    [selectedBrand]
  );

  const visibleProducts = useMemo(() => {
    if (!activeProfile) {
      return products.filter((p) =>
        BRAND_PROFILES.some((profile) => matchesBrandProfile(p, profile))
      );
    }
    return products.filter((p) => matchesBrandProfile(p, activeProfile));
  }, [products, activeProfile]);

  const getBrandModelCount = (profile: BrandProfile) =>
    products.filter((p) => matchesBrandProfile(p, profile)).length;

  return (
    <div className="bg-[#F7F8FA] min-h-screen text-[#1E2422] pb-20">
      {/* Compact Storefront Breadcrumb Strip */}
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
            <span className="font-semibold text-[#073B32]">Authorized Brands</span>
            {activeProfile && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium text-gray-800">{activeProfile.name}</span>
              </>
            )}
          </nav>

          <button
            type="button"
            onClick={() => navigate('shop')}
            className="text-xs font-semibold text-[#073B32] hover:text-[#0B5246] flex items-center gap-1 transition-colors"
          >
            <span>Open Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E5A51C]" />
          </button>
        </div>
      </div>

      {/* Storefront Hero Banner */}
      <section className="bg-[#073B32] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-[0.08em] text-[#E5A51C] mb-2.5">
              Authorized Direct Distribution
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.12] [text-wrap:balance]">
              {activeProfile
                ? `${activeProfile.name} Battery Collection`
                : 'Authorized Battery Manufacturers'}
            </h1>
            <p className="mt-3.5 text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
              {activeProfile
                ? activeProfile.summary
                : 'Every battery is sourced directly from factory lines with fresh manufacturing dates, BIS certification, and verified manufacturer warranties.'}
            </p>
          </div>

          {/* Interactive Brand Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter by battery brand"
            className="mt-7 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedBrand === 'All'}
              onClick={() => handleSelectBrand('All')}
              className={`px-4 min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedBrand === 'All'
                  ? 'bg-[#E5A51C] text-[#073B32]'
                  : 'bg-white/10 text-white/85 hover:bg-white/18'
              }`}
            >
              All Brands (6)
            </button>

            {BRAND_PROFILES.map((brand) => {
              const isSelected = selectedBrand === brand.name;
              return (
                <button
                  key={brand.name}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectBrand(brand.name)}
                  className={`px-4 min-h-[40px] rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#E5A51C] text-[#073B32]'
                      : 'bg-white/10 text-white/85 hover:bg-white/18'
                  }`}
                >
                  {brand.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-14">
        {/* Section 1: 6 Manufacturer Directory Cards */}
        <section aria-labelledby="brands-directory-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2
                id="brands-directory-heading"
                className="text-xl sm:text-2xl font-bold text-[#073B32] tracking-tight"
              >
                Featured Manufacturers
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Select a manufacturer to filter models below or inspect its full technical catalog.
              </p>
            </div>
            {selectedBrand !== 'All' && (
              <button
                type="button"
                onClick={() => handleSelectBrand('All')}
                className="text-xs font-semibold text-[#073B32] hover:underline self-start sm:self-auto"
              >
                Show all 6 brands
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRAND_PROFILES.map((profile) => {
              const count = getBrandModelCount(profile);
              const isSelected = selectedBrand === profile.name;

              return (
                <article
                  key={profile.name}
                  className={`bg-white rounded-xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#073B32] ring-1 ring-[#073B32] shadow-md'
                      : 'border-gray-200/90 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Visual Media Header */}
                    <div className="relative aspect-[16/9] bg-[#0B2E26] overflow-hidden">
                      <img
                        src={profile.image}
                        alt={`${profile.name} battery range`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#073B32]/90 via-[#073B32]/30 to-transparent" />
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight">
                            {profile.name}
                          </h3>
                          <p className="text-xs text-white/80 mt-0.5">
                            {profile.founded} · {profile.specialty}
                          </p>
                        </div>
                        <span className="text-xs font-mono tabular-nums text-[#E5A51C] font-semibold shrink-0">
                          {count} {count === 1 ? 'Model' : 'Models'}
                        </span>
                      </div>
                    </div>

                    {/* Clean Unboxed Specs & Description */}
                    <div className="p-5">
                      <div className="text-xs text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-1 mb-2.5">
                        <span className="font-medium text-[#073B32]">{profile.warranty}</span>
                        <span aria-hidden="true">·</span>
                        <span>{profile.chemistries}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {profile.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectBrand(isSelected ? 'All' : profile.name)}
                      className={`px-3.5 min-h-[40px] rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#073B32] text-white'
                          : 'bg-[#F2F5F4] text-[#073B32] hover:bg-[#E4ECE9]'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'View Models'}
                    </button>

                    <a
                      href={getRouteUrl('shop', { brand: profile.name })}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('shop', { brand: profile.name });
                      }}
                      className="text-xs font-semibold text-[#073B32] hover:text-[#0B5246] flex items-center gap-1 whitespace-nowrap"
                    >
                      <span>Shop in Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E5A51C]" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section 2: Filtered Product Collection */}
        <section aria-labelledby="brand-products-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2
                id="brand-products-heading"
                className="text-xl sm:text-2xl font-bold text-[#073B32] tracking-tight"
              >
                {activeProfile
                  ? `${activeProfile.name} Models`
                  : 'All Authorized Brand Models'}
              </h2>
              <p className="text-sm text-gray-600 mt-1 tabular-nums">
                Showing {visibleProducts.length}{' '}
                {visibleProducts.length === 1 ? 'battery' : 'batteries'} with direct manufacturer warranty
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  'shop',
                  activeProfile ? { brand: activeProfile.name } : {}
                )
              }
              className="px-4 min-h-[40px] rounded-lg bg-[#073B32] hover:bg-[#0A5246] text-white text-xs font-semibold inline-flex items-center gap-2 self-start sm:self-auto transition-colors whitespace-nowrap"
            >
              <span>Filter Technical Specs</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E5A51C]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProducts.map((product) => {
              const inWish = isInWishlist(product.id);
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
                        <span aria-hidden="true">·</span>
                        <span>{product.voltage}</span>
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

        {/* Section 3: Authorized Dealer Assurance Strip */}
        <section className="bg-white rounded-xl border border-gray-200/90 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-5 h-5 text-[#073B32] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[#073B32]">
                  100% Genuine Factory Stock
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Serial-verified warranty cards registered directly with Exide, Amaron, Luminous, Livguard, V-Guard, and AEON.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <Truck className="w-5 h-5 text-[#073B32] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[#073B32]">
                  4-Hour Express Doorstep Fitment
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Certified technicians deliver, load-test your alternator or inverter, and install your battery safely on site.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <Award className="w-5 h-5 text-[#073B32] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[#073B32]">
                  Instant Old Battery Scrap Rebate
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Trade in your discharged unit at delivery for eco-certified recycling credit up to ₹1,800 off your invoice.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
