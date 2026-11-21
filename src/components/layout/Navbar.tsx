import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Car,
  Bike,
  Zap,
  Cpu,
  Sun,
  Factory,
  BatteryCharging,
  Wrench,
  Tag,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { PageType, useStore } from '../../context/StoreContext';
import {
  CategoryPageType,
  isDedicatedCategoryPage,
  PAGE_TO_CATEGORY_MAP,
} from '../../utils/router';

type DropdownKey = 'shop' | 'brands' | null;

const BATTERY_CATEGORIES: {
  id: string;
  pageType: CategoryPageType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'car', pageType: 'car-batteries', label: 'Car Batteries', icon: Car },
  { id: 'bike', pageType: 'bike-batteries', label: 'Bike Batteries', icon: Bike },
  { id: 'inverter', pageType: 'inverter-batteries', label: 'Inverter Batteries', icon: Zap },
  {
    id: 'lithium',
    pageType: 'lithium-batteries',
    label: 'Lithium Batteries (LiFePO4)',
    icon: Cpu,
  },
  { id: 'solar', pageType: 'solar-batteries', label: 'Solar Batteries', icon: Sun },
  { id: 'industrial', pageType: 'industrial-batteries', label: 'Industrial Batteries', icon: Factory },
  { id: 'ups', pageType: 'ups-batteries', label: 'UPS Batteries', icon: BatteryCharging },
  { id: 'accessories', pageType: 'accessories', label: 'Accessories', icon: Wrench },
];

const BATTERY_BRANDS = [
  'Exide',
  'Amaron',
  'Luminous',
  'Livguard',
  'V-Guard',
  'AEON',
] as const;

export const Navbar: React.FC = () => {
  const {
    page,
    pageParams,
    navigate,
    getRouteUrl,
    cartItemCount,
    wishlist,
    user,
    setIsCartOpen,
    setIsAuthModalOpen,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<DropdownKey>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Close menus automatically whenever route changes (e.g., browser Back/Forward)
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setMobileSection(null);
    setSearchOpen(false);
  }, [page, pageParams]);

  // Close mobile drawer when resizing up to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setMobileSection(null);
      } else {
        setOpenDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock background page scrolling while mobile navigation drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  // Close dropdowns/overlays on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const clearHoverTimer = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDropdownEnter = (key: Exclude<DropdownKey, null>) => {
    clearHoverTimer();
    setOpenDropdown(key);
  };

  const handleDropdownLeave = () => {
    clearHoverTimer();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
    }, 120);
  };

  const handleDropdownToggle = (key: Exclude<DropdownKey, null>) => {
    clearHoverTimer();
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const closeAllMenus = () => {
    clearHoverTimer();
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setMobileSection(null);
  };

  /**
   * SPA anchor click handler: supports native Ctrl/Cmd/Shift/Middle-click (new tab)
   * while routing normal clicks cleanly via StoreContext.navigate().
   */
  const handleRouteLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetPage: PageType,
    params: Record<string, any> = {}
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    navigate(targetPage, params);
    closeAllMenus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate('shop', { search: trimmed });
      setSearchOpen(false);
      closeAllMenus();
    }
  };

  const handleAccountLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    closeAllMenus();
    if (user) {
      navigate('account');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Active state indicators
  const isHomeActive = page === 'home';
  const isOffersActive = page === 'offers';
  const isBrandsActive = page === 'brands' || (page === 'shop' && Boolean(pageParams?.brand));
  const isShopActive =
    isDedicatedCategoryPage(page) ||
    page === 'all-batteries' ||
    page === 'category' ||
    (page === 'shop' && !pageParams?.brand);
  const isAboutActive = page === 'about';
  const isContactActive = page === 'contact';
  const isWishlistActive = page === 'account' && pageParams?.tab === 'wishlist';
  const isAccountActive = page === 'account' && !isWishlistActive;

  const activeCategory = isDedicatedCategoryPage(page)
    ? PAGE_TO_CATEGORY_MAP[page]
    : page === 'category'
    ? String(pageParams?.category || '').toLowerCase()
    : page === 'shop' || page === 'all-batteries'
    ? String(pageParams?.category || '').toLowerCase()
    : '';

  const activeBrand =
    (page === 'brands' || page === 'shop') && pageParams?.brand
      ? String(pageParams.brand).toLowerCase()
      : '';

  const desktopLinkClass = (active: boolean) =>
    `relative flex items-center gap-1 py-2 text-[13.5px] xl:text-[14px] font-medium tracking-[-0.01em] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
      active
        ? 'text-[#073B32] font-semibold'
        : 'text-[#222826] hover:text-[#073B32]'
    }`;

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-50 bg-white border-b border-gray-200/90 shadow-[0_2px_12px_rgba(7,59,50,0.04)]"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 lg:h-[72px] flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo: All Energy Systems */}
          <a
            href={getRouteUrl('home')}
            onClick={(e) => handleRouteLinkClick(e, 'home')}
            className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink-0 text-left group focus:outline-none"
            aria-label="All Energy Systems Home"
          >
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#073B32] flex items-center justify-center shadow-xs group-hover:bg-[#094C40] transition-colors shrink-0">
              <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5A51C] fill-[#E5A51C]" />
            </span>
            <span className="flex flex-col leading-none min-w-0">
              <span className="text-[14px] sm:text-[17px] font-bold tracking-tight text-[#073B32] whitespace-nowrap truncate">
                All Energy Systems
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-[0.06em] uppercase text-[#5C6663] mt-0.5">
                Power Solutions
              </span>
            </span>
          </a>

          {/* Desktop Primary Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-5 xl:gap-7"
          >
            {/* Home */}
            <a
              href={getRouteUrl('home')}
              onClick={(e) => handleRouteLinkClick(e, 'home')}
              aria-current={isHomeActive ? 'page' : undefined}
              className={desktopLinkClass(isHomeActive)}
            >
              <span>Home</span>
              {isHomeActive && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-[#E5A51C]" />
              )}
            </a>

            {/* Shop Batteries Dropdown */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => handleDropdownEnter('shop')}
              onMouseLeave={handleDropdownLeave}
            >
              <a
                href={getRouteUrl('shop')}
                onClick={(e) => handleRouteLinkClick(e, 'shop')}
                aria-current={isShopActive ? 'page' : undefined}
                className={desktopLinkClass(isShopActive || openDropdown === 'shop')}
              >
                <span>Shop Batteries</span>
                {isShopActive && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-[#E5A51C]" />
                )}
              </a>
              <button
                type="button"
                onClick={() => handleDropdownToggle('shop')}
                aria-label="Toggle Shop Batteries menu"
                aria-expanded={openDropdown === 'shop'}
                aria-haspopup="menu"
                className="p-1 text-gray-400 hover:text-[#073B32] transition-colors cursor-pointer"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === 'shop' ? 'rotate-180 text-[#E5A51C]' : ''
                  }`}
                />
              </button>

              {/* Hover bridge + 2-column Dropdown */}
              <div
                role="menu"
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-2.5 w-[440px] xl:w-[470px] max-w-[calc(100vw-2rem)] transition-all duration-200 ease-out origin-top ${
                  openDropdown === 'shop'
                    ? 'opacity-100 translate-y-0 visible'
                    : 'opacity-0 -translate-y-1 invisible pointer-events-none'
                }`}
              >
                <div className="bg-white rounded-xl border border-gray-200/90 shadow-[0_14px_36px_rgba(7,59,50,0.10)] overflow-hidden">
                  <div className="px-4 pt-3.5 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#073B32]">
                      Battery Categories
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5A51C]" />
                  </div>

                  <div className="p-2.5 grid grid-cols-2 gap-1">
                    {BATTERY_CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      const isCatActive = activeCategory === category.id;
                      return (
                        <a
                          key={category.id}
                          href={getRouteUrl(category.pageType)}
                          role="menuitem"
                          onClick={(e) => handleRouteLinkClick(e, category.pageType)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-[13px] transition-colors ${
                            isCatActive
                              ? 'bg-[#073B32]/8 text-[#073B32] font-semibold'
                              : 'text-[#222826] hover:bg-[#F6F8F7] hover:text-[#073B32] font-medium'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                              isCatActive
                                ? 'bg-[#073B32] text-[#E5A51C]'
                                : 'bg-[#F2F5F4] text-[#073B32]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <span className="leading-snug">{category.label}</span>
                        </a>
                      );
                    })}
                  </div>

                  <div className="px-3.5 py-2.5 bg-[#F9FAF9] border-t border-gray-100">
                    <a
                      href={getRouteUrl('all-batteries')}
                      onClick={(e) => handleRouteLinkClick(e, 'all-batteries')}
                      className={`w-full flex items-center justify-between text-[12.5px] font-semibold transition-colors ${
                        page === 'all-batteries'
                          ? 'text-[#073B32] underline underline-offset-4'
                          : 'text-[#073B32] hover:text-[#0A5246]'
                      }`}
                    >
                      <span>Browse All Batteries</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E5A51C]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Brands Dropdown */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => handleDropdownEnter('brands')}
              onMouseLeave={handleDropdownLeave}
            >
              <a
                href={getRouteUrl('brands')}
                onClick={(e) => handleRouteLinkClick(e, 'brands')}
                aria-current={isBrandsActive ? 'page' : undefined}
                className={desktopLinkClass(isBrandsActive || openDropdown === 'brands')}
              >
                <span>Brands</span>
                {isBrandsActive && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-[#E5A51C]" />
                )}
              </a>
              <button
                type="button"
                onClick={() => handleDropdownToggle('brands')}
                aria-label="Toggle Brands menu"
                aria-expanded={openDropdown === 'brands'}
                aria-haspopup="menu"
                className="p-1 text-gray-400 hover:text-[#073B32] transition-colors cursor-pointer"
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openDropdown === 'brands' ? 'rotate-180 text-[#E5A51C]' : ''
                  }`}
                />
              </button>

              {/* Hover bridge + Simple Brand List */}
              <div
                role="menu"
                className={`absolute left-0 top-full pt-2.5 w-52 transition-all duration-200 ease-out origin-top ${
                  openDropdown === 'brands'
                    ? 'opacity-100 translate-y-0 visible'
                    : 'opacity-0 -translate-y-1 invisible pointer-events-none'
                }`}
              >
                <div className="bg-white rounded-xl border border-gray-200/90 shadow-[0_14px_36px_rgba(7,59,50,0.10)] overflow-hidden py-1.5">
                  <div className="px-3.5 py-2 border-b border-gray-100 mb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#073B32]">
                      Top Manufacturers
                    </span>
                  </div>

                  {BATTERY_BRANDS.map((brand) => {
                    const isCurrentBrand = activeBrand === brand.toLowerCase();
                    return (
                      <a
                        key={brand}
                        href={getRouteUrl('brands', { brand })}
                        role="menuitem"
                        onClick={(e) => handleRouteLinkClick(e, 'brands', { brand })}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-[13.5px] text-left transition-colors ${
                          isCurrentBrand
                            ? 'bg-[#073B32]/8 text-[#073B32] font-semibold'
                            : 'text-[#222826] hover:bg-[#F6F8F7] hover:text-[#073B32] font-medium'
                        }`}
                      >
                        <span>{brand}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 ${
                            isCurrentBrand ? 'text-[#E5A51C]' : 'text-gray-300'
                          }`}
                        />
                      </a>
                    );
                  })}

                  <div className="mt-1 pt-1.5 px-3.5 pb-1 border-t border-gray-100">
                    <a
                      href={getRouteUrl('brands')}
                      onClick={(e) => handleRouteLinkClick(e, 'brands')}
                      className="w-full flex items-center justify-between text-[12px] font-semibold text-[#073B32] hover:text-[#0A5246] py-1"
                    >
                      <span>View All Brands</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#E5A51C]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Offers */}
            <a
              href={getRouteUrl('offers')}
              onClick={(e) => handleRouteLinkClick(e, 'offers')}
              aria-current={isOffersActive ? 'page' : undefined}
              className={desktopLinkClass(isOffersActive)}
            >
              <Tag className="w-3.5 h-3.5 text-[#E5A51C]" />
              <span>Offers</span>
              {isOffersActive && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-[#E5A51C]" />
              )}
            </a>

            {/* About Us */}
            <a
              href={getRouteUrl('about')}
              onClick={(e) => handleRouteLinkClick(e, 'about')}
              aria-current={isAboutActive ? 'page' : undefined}
              className={desktopLinkClass(isAboutActive)}
            >
              <span>About Us</span>
              {isAboutActive && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-[#E5A51C]" />
              )}
            </a>

            {/* Contact */}
            <a
              href={getRouteUrl('contact')}
              onClick={(e) => handleRouteLinkClick(e, 'contact')}
              aria-current={isContactActive ? 'page' : undefined}
              className={desktopLinkClass(isContactActive)}
            >
              <span>Contact</span>
              {isContactActive && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full bg-[#E5A51C]" />
              )}
            </a>
          </nav>

          {/* Right Action Icons: Search, Account, Cart, Mobile Hamburger */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              aria-label="Search batteries"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-[#222826] hover:text-[#073B32] hover:bg-[#F3F6F5] transition-colors"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Wishlist Icon with Saved Count */}
            <a
              href={getRouteUrl('account', { tab: 'wishlist' })}
              onClick={(e) => handleRouteLinkClick(e, 'account', { tab: 'wishlist' })}
              aria-label={`Saved wishlist with ${wishlist.length} items`}
              title={`Wishlist (${wishlist.length})`}
              className={`relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-colors ${
                isWishlistActive
                  ? 'text-[#073B32] bg-[#073B32]/8'
                  : 'text-[#222826] hover:text-[#073B32] hover:bg-[#F3F6F5]'
              }`}
            >
              <Heart
                className={`w-[18px] h-[18px] ${
                  isWishlistActive || wishlist.length > 0 ? 'text-[#E11D48] fill-[#E11D48]' : ''
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#073B32] text-[#E5A51C] text-[9.5px] font-bold leading-none flex items-center justify-center shadow-xs">
                  {wishlist.length > 99 ? '99+' : wishlist.length}
                </span>
              )}
            </a>

            {/* Account Icon */}
            <a
              href={getRouteUrl('account')}
              onClick={handleAccountLinkClick}
              aria-label={user ? `Account (${user.name})` : 'Sign in to Account'}
              title={user ? user.name : 'Sign In / Account'}
              className={`relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg transition-colors ${
                isAccountActive
                  ? 'text-[#073B32] bg-[#073B32]/8'
                  : 'text-[#222826] hover:text-[#073B32] hover:bg-[#F3F6F5]'
              }`}
            >
              <UserIcon className="w-[18px] h-[18px]" />
              {user && (
                <span
                  className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 rounded-full bg-[#E5A51C]"
                  aria-hidden="true"
                />
              )}
            </a>

            {/* Shopping Cart Icon with Item Count */}
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                setMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              aria-label={`Shopping cart with ${cartItemCount} items`}
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-[#073B32] hover:bg-[#F3F6F5] transition-colors"
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartItemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#E5A51C] text-[#073B32] text-[10px] font-bold leading-none flex items-center justify-center shadow-xs">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMobileMenuOpen((prev) => !prev);
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-[#073B32] hover:bg-[#F3F6F5] transition-colors ml-0.5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Clean Search Overlay Bar */}
        {searchOpen && (
          <div className="absolute inset-0 z-50 bg-white border-b border-gray-200 shadow-md px-3 sm:px-6 lg:px-8 flex items-center">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-4xl mx-auto w-full flex items-center gap-2 sm:gap-2.5"
            >
              <Search className="hidden sm:block w-4.5 h-4.5 text-[#073B32] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search batteries by brand, capacity (Ah), or category..."
                autoFocus
                className="flex-1 min-w-0 bg-[#F7F9F8] text-[#222826] placeholder-gray-400 text-xs sm:text-sm px-3 sm:px-3.5 py-2.5 rounded-lg border border-gray-200 focus:border-[#073B32] focus:bg-white focus:outline-none min-h-[42px]"
              />
              <button
                type="submit"
                className="px-3.5 sm:px-4 min-h-[42px] rounded-lg bg-[#073B32] hover:bg-[#0A5246] text-white text-xs sm:text-sm font-semibold transition-colors shrink-0"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#073B32] hover:bg-[#F3F6F5] transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile & Tablet Responsive Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden relative z-50 bg-white border-t border-gray-100 border-b border-gray-200 shadow-xl max-h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain">
            <nav
              aria-label="Mobile navigation"
              className="max-w-2xl mx-auto px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-1.5"
            >
              {/* Inline Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="pb-2 flex items-center gap-2">
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search batteries, brands, Ah..."
                    className="w-full bg-[#F7F9F8] text-[#222826] placeholder-gray-400 text-sm pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#073B32] focus:bg-white focus:outline-none min-h-[44px]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 min-h-[44px] rounded-lg bg-[#073B32] hover:bg-[#0A5246] text-white text-xs font-semibold shrink-0 transition-colors"
                >
                  Go
                </button>
              </form>

              {/* Home */}
              <a
                href={getRouteUrl('home')}
                onClick={(e) => handleRouteLinkClick(e, 'home')}
                aria-current={isHomeActive ? 'page' : undefined}
                className={`w-full min-h-[46px] px-3 rounded-lg flex items-center justify-between text-[15px] font-medium transition-colors ${
                  isHomeActive
                    ? 'bg-[#073B32]/8 text-[#073B32] font-semibold'
                    : 'text-[#222826] hover:bg-[#F6F8F7]'
                }`}
              >
                <span>Home</span>
                {isHomeActive && <span className="w-2 h-2 rounded-full bg-[#E5A51C]" />}
              </a>

              {/* Expandable Shop Batteries */}
              <div className="rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setMobileSection((prev) => (prev === 'shop' ? null : 'shop'))
                  }
                  aria-expanded={mobileSection === 'shop'}
                  className={`w-full min-h-[46px] px-3 rounded-lg flex items-center justify-between text-[15px] font-medium transition-colors ${
                    isShopActive
                      ? 'bg-[#073B32]/8 text-[#073B32] font-semibold'
                      : 'text-[#222826] hover:bg-[#F6F8F7]'
                  }`}
                >
                  <span>Shop Batteries</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#073B32] transition-transform duration-200 ${
                      mobileSection === 'shop' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileSection === 'shop' && (
                  <div className="mt-1.5 mb-2 pl-2 pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {BATTERY_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        const isCatActive = activeCategory === category.id;
                        return (
                          <a
                            key={category.id}
                            href={getRouteUrl(category.pageType)}
                            onClick={(e) => handleRouteLinkClick(e, category.pageType)}
                            className={`w-full min-h-[44px] px-3 rounded-lg flex items-center gap-3 text-[14px] text-left transition-colors ${
                              isCatActive
                                ? 'bg-[#073B32]/8 text-[#073B32] font-semibold'
                                : 'text-[#222826] hover:bg-[#F6F8F7]'
                            }`}
                          >
                            <Icon className="w-4 h-4 text-[#073B32] shrink-0" />
                            <span className="leading-snug">{category.label}</span>
                          </a>
                        );
                      })}
                    </div>
                    <a
                      href={getRouteUrl('all-batteries')}
                      onClick={(e) => handleRouteLinkClick(e, 'all-batteries')}
                      className="mt-1.5 w-full min-h-[44px] px-3 rounded-lg flex items-center justify-between text-[13.5px] font-semibold text-[#073B32] bg-[#F7F9F8] hover:bg-[#EEF3F1]"
                    >
                      <span>Browse All Batteries</span>
                      <ArrowRight className="w-4 h-4 text-[#E5A51C]" />
                    </a>
                  </div>
                )}
              </div>

              {/* Expandable Brands */}
              <div className="rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setMobileSection((prev) => (prev === 'brands' ? null : 'brands'))
                  }
                  aria-expanded={mobileSection === 'brands'}
                  className={`w-full min-h-[46px] px-3 rounded-lg flex items-center justify-between text-[15px] font-medium transition-colors ${
                    isBrandsActive
                      ? 'bg-[#073B32]/8 text-[#073B32] font-semibold'
                      : 'text-[#222826] hover:bg-[#F6F8F7]'
                  }`}
                >
                  <span>Brands</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#073B32] transition-transform duration-200 ${
                      mobileSection === 'brands' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileSection === 'brands' && (
                  <div className="mt-1.5 mb-2 pl-2 pr-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {BATTERY_BRANDS.map((brand) => {
                        const isCurrentBrand = activeBrand === brand.toLowerCase();
                        return (
                          <a
                            key={brand}
                            href={getRouteUrl('brands', { brand })}
                            onClick={(e) => handleRouteLinkClick(e, 'brands', { brand })}
                            className={`min-h-[44px] px-3 rounded-lg flex items-center justify-between text-[14px] text-left border transition-colors ${
                              isCurrentBrand
                                ? 'bg-[#073B32] text-white border-[#073B32] font-semibold'
                                : 'bg-[#F9FAF9] text-[#222826] border-gray-200/80 hover:border-[#073B32]/40'
                            }`}
                          >
                            <span>{brand}</span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 ${
                                isCurrentBrand ? 'text-[#E5A51C]' : 'text-gray-400'
                              }`}
                            />
                          </a>
                        );
                      })}
                    </div>
                    <a
                      href={getRouteUrl('brands')}
                      onClick={(e) => handleRouteLinkClick(e, 'brands')}
                      className="mt-1.5 w-full min-h-[44px] px-3 rounded-lg flex items-center justify-between text-[13.5px] font-semibold text-[#073B32] bg-[#F7F9F8] hover:bg-[#EEF3F1]"
                    >
                      <span>Explore All Brands</span>
                      <ArrowRight className="w-4 h-4 text-[#E5A51C]" />
                    </a>
                  </div>
                )}
              </div>

              {/* Offers */}
              <a
                href={getRouteUrl('offers')}
                onClick={(e) => handleRouteLinkClick(e, 'offers')}
                aria-current={isOffersActive ? 'page' : undefined}
                className={`w-full min-h-[46px] px-3 rounded-lg flex items-center justify-between text-[15px] font-medium transition-colors ${
                  isOffersActive
                    ? 'bg-[#073B32]/8 text-[#073B32] font-semibold'
                    : 'text-[#222826] hover:bg-[#F6F8F7]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#E5A51C]" />
                  <span>Offers</span>
                </span>
                {isOffersActive && <span className="w-2 h-2 rounded-full bg-[#E5A51C]" />}
              </a>

              {/* About Us */}
              <a
                href={getRouteUrl('about')}
                onClick={(e) => handleRouteLinkClick(e, 'about')}
                aria-current={isAboutActive ? 'page' : undefined}
                className={`w-full min-h-[46px] px-3 rounded-lg flex items-center justify-between text-[15px] font-medium transition-colors ${
                  isAboutActive
                    ? 'bg-[#073B32]/8 text-[#073B32] font-semibold'
                    : 'text-[#222826] hover:bg-[#F6F8F7]'
                }`}
              >
                <span>About Us</span>
                {isAboutActive && <span className="w-2 h-2 rounded-full bg-[#E5A51C]" />}
              </a>

              {/* Contact */}
              <a
                href={getRouteUrl('contact')}
                onClick={(e) => handleRouteLinkClick(e, 'contact')}
                aria-current={isContactActive ? 'page' : undefined}
                className={`w-full min-h-[46px] px-3 rounded-lg flex items-center justify-between text-[15px] font-medium transition-colors ${
                  isContactActive
                    ? 'bg-[#073B32]/8 text-[#073B32] font-semibold'
                    : 'text-[#222826] hover:bg-[#F6F8F7]'
                }`}
              >
                <span>Contact</span>
                {isContactActive && <span className="w-2 h-2 rounded-full bg-[#E5A51C]" />}
              </a>

              {/* Account & Wishlist Quick Bar */}
              <div className="pt-2.5 mt-2 border-t border-gray-100 space-y-2">
                <a
                  href={getRouteUrl('account', { tab: 'wishlist' })}
                  onClick={(e) => handleRouteLinkClick(e, 'account', { tab: 'wishlist' })}
                  className="w-full min-h-[44px] px-4 rounded-lg bg-[#F7F9F8] hover:bg-[#EEF3F1] border border-gray-200 text-[#073B32] text-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-[#E11D48] fill-[#E11D48]' : 'text-[#073B32]'}`} />
                    <span>Saved Wishlist</span>
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#073B32] text-[#E5A51C]">
                    {wishlist.length}
                  </span>
                </a>
                <a
                  href={getRouteUrl('account')}
                  onClick={handleAccountLinkClick}
                  className="w-full min-h-[46px] px-4 rounded-lg bg-[#073B32] hover:bg-[#0A5246] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-[#E5A51C]" />
                  <span>{user ? `${user.name} · My Account` : 'Sign In / My Account'}</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Tap-to-close dimmed backdrop behind open mobile/tablet drawer */}
      {mobileMenuOpen && (
        <div
          onClick={closeAllMenus}
          aria-hidden="true"
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
        />
      )}
    </>
  );
};
