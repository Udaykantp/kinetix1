import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Maximize2,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PdpHeader } from './pdp/PdpHeader';
import { TopographicShaderCanvas } from './pdp/TopographicShaderCanvas';
import { PinnedShowcase } from './pdp/PinnedShowcase';
import { ThermalComparison } from './pdp/ThermalComparison';
import { CraftBento } from './pdp/CraftBento';
import { ProductConfigurator } from './pdp/ProductConfigurator';
import { ProductReviewsSection } from './pdp/ProductReviewsSection';
import {
  buildCapacityOptions,
  buildShowcaseStages,
  FINISH_OPTIONS,
  FinishId,
  PdpTheme,
} from './pdp/pdpConfig';

gsap.registerPlugin(ScrollTrigger);

export const ProductDetailPage: React.FC = () => {
  const {
    pageParams,
    products,
    addToCart,
    cartItemCount,
    setIsCartOpen,
    toggleWishlist,
    isInWishlist,
    addToComparison,
    isInComparison,
    checkPincode,
    navigate,
  } = useStore();

  const productId = pageParams?.productId || (products[0] ? products[0].id : '');
  const product = products.find((p) => p.id === productId) || products[0];

  // Light Mode default with Dark Mode toggle
  const [theme, setTheme] = useState<PdpTheme>('light');
  const [selectedFinishId, setSelectedFinishId] = useState<FinishId>(() => {
    const paramFinish = pageParams?.finish as FinishId | undefined;
    return FINISH_OPTIONS.some((f) => f.id === paramFinish)
      ? (paramFinish as FinishId)
      : 'alpine-sage';
  });
  const [quantity, setQuantity] = useState(1);
  const [exchangeScrap, setExchangeScrap] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Reduced motion preference
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Derived capacity options & showcase stages
  const capacityOptions = useMemo(() => buildCapacityOptions(product), [product]);
  const [selectedCapacityId, setSelectedCapacityId] = useState<string>(
    () => (typeof pageParams?.capacity === 'string' && pageParams.capacity) || 'standard'
  );

  const selectedCapacity = useMemo(
    () => capacityOptions.find((c) => c.id === selectedCapacityId) || capacityOptions[1] || capacityOptions[0],
    [capacityOptions, selectedCapacityId]
  );

  const selectedFinish = useMemo(
    () => FINISH_OPTIONS.find((f) => f.id === selectedFinishId) || FINISH_OPTIONS[0],
    [selectedFinishId]
  );

  // Reflect non-default variant selections in the shareable deep-link URL
  useEffect(() => {
    if (!product?.id) return;
    const nextParams: Record<string, any> = { productId: product.id };
    if (selectedFinishId !== 'alpine-sage') nextParams.finish = selectedFinishId;
    if (selectedCapacityId !== 'standard') nextParams.capacity = selectedCapacityId;
    navigate('product-detail', nextParams, { replace: true, skipScroll: true });
  }, [product?.id, selectedFinishId, selectedCapacityId]);

  const showcaseStages = useMemo(() => buildShowcaseStages(product), [product]);

  // Pincode serviceability
  const [pincode, setPincode] = useState('400050');
  const [pinResult, setPinResult] = useState<{
    deliverable: boolean;
    city: string;
    state: string;
    estimateDays: number;
    expressAvailable: boolean;
  } | null>(() => checkPincode('400050'));

  // Live star-rating summary synced from ProductReviewsSection
  const [reviewStats, setReviewStats] = useState<{
    averageRating: number;
    totalCount: number;
  }>({
    averageRating: product?.rating ?? 4.8,
    totalCount: product?.reviewCount ?? 0,
  });

  const handleReviewStatsChange = useCallback(
    (next: { averageRating: number; totalCount: number }) => {
      setReviewStats((prev) =>
        prev.averageRating === next.averageRating && prev.totalCount === next.totalCount
          ? prev
          : next
      );
    },
    []
  );

  // Pricing & scrap rebate
  const scrapDiscount = product.category === 'accessories' ? 0 : 1200;
  const effectivePrice = Math.max(
    500,
    selectedCapacity.price - (exchangeScrap ? scrapDiscount : 0)
  );

  // Lenis smooth scrolling synchronized with GSAP ticker
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Reset state & scroll position when switching products
  useEffect(() => {
    setSelectedFinishId('alpine-sage');
    setSelectedCapacityId('standard');
    setQuantity(1);
    setExchangeScrap(false);
    setZoomOpen(false);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(timer);
  }, [product.id]);

  // Close zoom lightbox on Escape
  useEffect(() => {
    if (!zoomOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [zoomOpen]);

  const scrollToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(target, { offset: -64, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    },
    [reducedMotion]
  );

  // Spring-damped 3D pointer-tracking perspective tilt for Hero product showcase
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const heroCardRef = useRef<HTMLDivElement | null>(null);
  const heroShadowRef = useRef<HTMLDivElement | null>(null);
  const tiltTargetRef = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });
  const tiltCurrentRef = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    let rafId = 0;

    const animateTilt = () => {
      const c = tiltCurrentRef.current;
      const t = tiltTargetRef.current;
      const ease = 0.085;

      c.rx += (t.rx - c.rx) * ease;
      c.ry += (t.ry - c.ry) * ease;
      c.tx += (t.tx - c.tx) * ease;
      c.ty += (t.ty - c.ty) * ease;

      if (heroCardRef.current) {
        heroCardRef.current.style.transform = `perspective(1100px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) translate3d(${c.tx.toFixed(2)}px, ${c.ty.toFixed(2)}px, 0)`;
      }
      if (heroShadowRef.current) {
        heroShadowRef.current.style.transform = `translate3d(${(-c.ry * 2.4).toFixed(2)}px, ${(c.rx * 1.4).toFixed(2)}px, 0) scale(${(1 - Math.abs(c.rx) * 0.004).toFixed(3)})`;
      }

      rafId = requestAnimationFrame(animateTilt);
    };

    rafId = requestAnimationFrame(animateTilt);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !heroStageRef.current) return;
    const rect = heroStageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    tiltTargetRef.current = {
      rx: -ny * 9.5,
      ry: nx * 11.5,
      tx: nx * 8,
      ty: ny * 6,
    };
  };

  const handleStagePointerLeave = () => {
    tiltTargetRef.current = { rx: 0, ry: 0, tx: 0, ty: 0 };
  };

  // Cart / Action handlers
  const handleAddToCart = () => {
    addToCart(product, quantity, {
      finishName: selectedFinish.name,
      finishFilter: selectedFinish.filter,
      capacityLabel: selectedCapacity.label,
      unitPrice: effectivePrice,
    });
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, {
      finishName: selectedFinish.name,
      finishFilter: selectedFinish.filter,
      capacityLabel: selectedCapacity.label,
      unitPrice: effectivePrice,
    });
    navigate('checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setPinResult(checkPincode(pincode));
  };

  const relatedProducts = useMemo(() => {
    const sameCat = products.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
    if (sameCat.length >= 3) return sameCat.slice(0, 3);
    const others = products.filter(
      (p) => p.id !== product.id && !sameCat.some((s) => s.id === p.id)
    );
    return [...sameCat, ...others].slice(0, 3);
  }, [products, product]);

  const inWishlist = isInWishlist(product.id);
  const inComparison = isInComparison(product.id);

  if (!product) return null;

  return (
    <div
      className="pdp-root min-h-screen relative transition-colors duration-300"
      data-theme={theme}
    >
      {/* Subtle fixed film-grain texture */}
      <div className="pdp-film-grain" aria-hidden="true" />

      {/* Fixed 64px Frosted-Glass Header */}
      <PdpHeader
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        cartItemCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onBackToCatalog={() => navigate('shop')}
        onScrollToSection={scrollToSection}
      />

      {/* =========================================================
          SECTION 1: ASYMMETRIC SPLIT HERO (#hero, min-height: 100dvh)
          ========================================================= */}
      <section
        id="hero"
        className="relative min-h-[100dvh] w-full flex items-center overflow-hidden pt-20 pb-14 sm:pt-24 sm:pb-16"
      >
        {/* Full-bleed WebGL2 Topographic Contour Shader */}
        <TopographicShaderCanvas theme={theme} reducedMotion={reducedMotion} />

        {/* Soft bottom transition fade into next section */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--pdp-bg)] to-transparent"
        />

        <div className="relative z-10 w-full max-w-[1240px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline, Copy & Pill CTAs */}
          <div className="space-y-6 sm:space-y-7 max-w-xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--pdp-glass)] backdrop-blur-md border border-[var(--pdp-border)]">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedFinish.swatch }}
              />
              <span className="pdp-mono text-[11px] uppercase tracking-[0.14em] text-[var(--pdp-text-muted)]">
                {product.brand} · {product.technology}
              </span>
            </div>

            <div className="space-y-3">
              <h1
                className="pdp-heading font-bold text-[var(--pdp-text)] leading-[0.98]"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 5.1rem)' }}
              >
                Built for altitude.
              </h1>
              <p className="pdp-heading text-lg sm:text-xl font-medium text-[var(--pdp-text-muted)] tracking-[-0.02em]">
                {product.name}
              </p>
            </div>

            <p className="text-[15px] sm:text-base text-[var(--pdp-text-muted)] leading-relaxed max-w-lg">
              {product.description} Engineered for sub-zero mountain starts, zero terminal
              condensation, and relentless cycle endurance across every terrain.
            </p>

            {/* Quick Monospace Telemetry Strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs pdp-mono text-[var(--pdp-text-muted)]">
              <span className="text-base sm:text-lg font-medium text-[var(--pdp-text)]">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              <span aria-hidden="true" className="opacity-35">
                /
              </span>
              <span>{product.voltage}</span>
              <span aria-hidden="true" className="opacity-35">
                /
              </span>
              <span>{selectedCapacity.label}</span>
              <span aria-hidden="true" className="opacity-35">
                /
              </span>
              <span>{product.warrantyMonths}M Warranty</span>
              <span aria-hidden="true" className="opacity-35">
                /
              </span>
              <button
                type="button"
                onClick={() => scrollToSection('reviews')}
                className="inline-flex items-center gap-1.5 text-[var(--pdp-text)] hover:text-[var(--pdp-accent)] transition-colors underline-offset-4 hover:underline"
                aria-label={`Jump to ${reviewStats.totalCount} customer reviews`}
              >
                <Star className="w-3.5 h-3.5 fill-current text-[#D6A546]" />
                <span className="font-medium">{reviewStats.averageRating.toFixed(1)}</span>
                <span className="text-[var(--pdp-text-muted)]">
                  ({reviewStats.totalCount} {reviewStats.totalCount === 1 ? 'review' : 'reviews'})
                </span>
              </button>
            </div>

            {/* Dual Pill CTAs */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('order')}
                className="pdp-btn w-full sm:w-auto h-12 px-7 text-sm font-medium bg-[var(--pdp-accent)] hover:bg-[var(--pdp-accent-hover)] text-[#f3f6f4] shadow-lg shadow-black/10 inline-flex items-center justify-center gap-2"
              >
                <span>Shop {product.brand}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('showcase')}
                className="pdp-btn w-full sm:w-auto h-12 px-6 text-sm font-medium bg-[var(--pdp-glass)] hover:bg-[var(--pdp-glass-strong)] backdrop-blur-md border border-[var(--pdp-border-strong)] text-[var(--pdp-text)] inline-flex items-center justify-center gap-1.5"
              >
                <span>Explore</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Floating 3D Pointer-Tilting Hardware Stage + Interactive Finish Swatches */}
          <div className="flex flex-col items-center">
            <div
              ref={heroStageRef}
              onPointerMove={handleStagePointerMove}
              onPointerLeave={handleStagePointerLeave}
              className="relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none"
            >
              {/* Soft Ambient Aura behind product */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-10 rounded-full opacity-55 blur-3xl transition-colors duration-500"
                style={{
                  background: `radial-gradient(circle, ${selectedFinish.swatch}44 0%, transparent 72%)`,
                }}
              />

              {/* Synchronized Shifting Drop Shadow */}
              <div
                ref={heroShadowRef}
                aria-hidden="true"
                className="pointer-events-none absolute bottom-7 w-[68%] h-10 rounded-full blur-2xl will-change-transform"
                style={{
                  background:
                    theme === 'dark'
                      ? 'rgba(0, 0, 0, 0.72)'
                      : 'rgba(17, 22, 20, 0.24)',
                }}
              />

              {/* 3D Tilted Floating Product Frame */}
              <div
                ref={heroCardRef}
                onClick={() => setZoomOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomOpen(true);
                  }
                }}
                aria-label="Inspect product in full-screen zoom"
                className="relative z-10 w-[84%] h-[84%] rounded-[12px] p-4 sm:p-6 flex items-center justify-center cursor-zoom-in will-change-transform group"
              >
                <img
                  src={product.images[0]}
                  alt={`${product.name} in ${selectedFinish.name}`}
                  style={{ filter: selectedFinish.filter }}
                  className="w-full h-full object-contain rounded-[12px] drop-shadow-[0_24px_38px_rgba(17,22,20,0.22)] transition-[filter] duration-500"
                />
                <span className="pdp-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-[var(--pdp-glass-strong)] backdrop-blur-md border border-[var(--pdp-border)] text-[var(--pdp-text-muted)] absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  Zoom
                </span>
              </div>
            </div>

            {/* Interactive Glassmorphic Finish Swatches Pill Radio Group */}
            <div className="mt-3 w-full flex flex-col items-center gap-2.5">
              <div
                role="radiogroup"
                aria-label="Select enclosure finish"
                className="pdp-glass-pill !rounded-2xl sm:!rounded-full p-1.5 inline-flex flex-wrap justify-center max-w-full items-center gap-1 shadow-sm"
              >
                {FINISH_OPTIONS.map((finish) => {
                  const active = finish.id === selectedFinish.id;
                  return (
                    <button
                      key={finish.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedFinishId(finish.id)}
                      className={`pdp-btn inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 text-[11px] sm:text-xs font-medium transition-all ${
                        active
                          ? 'bg-[var(--pdp-surface-2)] text-[var(--pdp-text)] shadow-sm'
                          : 'text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border shrink-0 ${
                          active
                            ? 'ring-2 ring-offset-2 ring-[var(--pdp-accent)] ring-offset-[var(--pdp-surface-2)] border-black/15'
                            : 'border-black/20'
                        }`}
                        style={{ backgroundColor: finish.swatch }}
                      />
                      <span className="whitespace-nowrap">{finish.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="pdp-mono text-[11px] text-[var(--pdp-text-muted)] text-center px-2">
                {selectedFinish.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: PINNED 4-STAGE ENVIRONMENTAL SHOWCASE (#showcase)
          ========================================================= */}
      <PinnedShowcase
        key={`showcase-${product.id}`}
        stages={showcaseStages}
        reducedMotion={reducedMotion}
      />

      {/* =========================================================
          SECTION 3: INTERACTIVE THERMAL COMPARISON (#thermal)
          ========================================================= */}
      <ThermalComparison product={product} reducedMotion={reducedMotion} />

      {/* =========================================================
          SECTION 4: EDITORIAL CRAFT BENTO (#craft)
          ========================================================= */}
      <CraftBento
        key={`craft-${product.id}`}
        product={product}
        theme={theme}
        reducedMotion={reducedMotion}
      />

      {/* =========================================================
          SECTION 5: INTERACTIVE FINISH & CAPACITY CONFIGURATOR (#order)
          ========================================================= */}
      <ProductConfigurator
        product={product}
        selectedFinish={selectedFinish}
        onSelectFinish={setSelectedFinishId}
        capacityOptions={capacityOptions}
        selectedCapacity={selectedCapacity}
        onSelectCapacity={(opt) => setSelectedCapacityId(opt.id)}
        quantity={quantity}
        onQuantityChange={setQuantity}
        exchangeScrap={exchangeScrap}
        onToggleScrap={setExchangeScrap}
        effectivePrice={effectivePrice}
        scrapDiscount={scrapDiscount}
        inWishlist={inWishlist}
        inComparison={inComparison}
        onToggleWishlist={() => toggleWishlist(product)}
        onAddToComparison={() => addToComparison(product)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onOpenZoom={() => setZoomOpen(true)}
        pincode={pincode}
        onPincodeChange={setPincode}
        onCheckPincode={handlePincodeCheck}
        pinResult={pinResult}
      />

      {/* =========================================================
          SECTION 6: TECHNICAL SPECIFICATIONS, COMPATIBILITY & REVIEWS (#specs)
          ========================================================= */}
      <section
        id="specs"
        aria-labelledby="specs-heading"
        className="py-20 sm:py-24 px-5 sm:px-8 max-w-[1240px] mx-auto border-t border-[var(--pdp-border)] space-y-16"
      >
        {/* Technical Dossier & Compatibility Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="pdp-mono text-xs uppercase tracking-[0.14em] text-[var(--pdp-accent)]">
                05 / Technical Dossier
              </p>
              <h2
                id="specs-heading"
                className="pdp-heading text-3xl sm:text-4xl font-bold text-[var(--pdp-text)]"
              >
                Verified specifications.
              </h2>
            </div>

            <div className="rounded-[12px] border border-[var(--pdp-border)] bg-[var(--pdp-surface)] overflow-hidden divide-y divide-[var(--pdp-border)]">
              <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <span className="text-[var(--pdp-text-muted)] shrink-0">Voltage Architecture</span>
                <span className="pdp-mono font-medium text-[var(--pdp-text)] text-right">
                  {product.voltage}
                </span>
              </div>
              <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <span className="text-[var(--pdp-text-muted)] shrink-0">Configured Capacity</span>
                <span className="pdp-mono font-medium text-[var(--pdp-text)] text-right">
                  {selectedCapacity.label}
                </span>
              </div>
              <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <span className="text-[var(--pdp-text-muted)] shrink-0">Chemistry</span>
                <span className="pdp-mono font-medium text-[var(--pdp-text)] text-right">
                  {product.technology}
                </span>
              </div>
              <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <span className="text-[var(--pdp-text-muted)] shrink-0">Enclosure Dimensions</span>
                <span className="pdp-mono font-medium text-[var(--pdp-text)] text-right">
                  {product.dimensions}
                </span>
              </div>
              <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <span className="text-[var(--pdp-text-muted)] shrink-0">Net Mass</span>
                <span className="pdp-mono font-medium text-[var(--pdp-text)] text-right">
                  {product.weightKg} kg
                </span>
              </div>
              {Object.entries(product.technicalSpecs).map(([key, val]) => (
                <div
                  key={key}
                  className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <span className="text-[var(--pdp-text-muted)]">{key}</span>
                  <span className="pdp-mono font-medium text-[var(--pdp-text)] text-right">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Key Highlights */}
            <div className="rounded-[12px] border border-[var(--pdp-border)] bg-[var(--pdp-surface)] p-6 space-y-4">
              <h3 className="pdp-heading text-lg font-bold text-[var(--pdp-text)]">
                Engineering Highlights
              </h3>
              <ul className="space-y-3">
                {product.highlights.map((hl, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-[var(--pdp-text-muted)] leading-relaxed"
                  >
                    <Check className="w-4 h-4 text-[var(--pdp-accent)] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compatible Vehicles or Appliances */}
            {(product.compatibleVehicles?.length || product.compatibleAppliances?.length) && (
              <div className="rounded-[12px] border border-[var(--pdp-border)] bg-[var(--pdp-surface)] p-6 space-y-4">
                <h3 className="pdp-heading text-lg font-bold text-[var(--pdp-text)]">
                  {product.compatibleVehicles?.length
                    ? 'Verified Vehicle Fitment'
                    : 'Supported Load Profiles'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(product.compatibleVehicles || product.compatibleAppliances || []).map(
                    (entry, idx) => (
                      <span
                        key={idx}
                        className="pdp-mono text-xs px-3 py-1.5 rounded-full bg-[var(--pdp-surface-2)] border border-[var(--pdp-border)] text-[var(--pdp-text)]"
                      >
                        {entry}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Star-Rating & Customer Reviews System */}
        <ProductReviewsSection
          product={product}
          configuredVariantLabel={`${selectedFinish.name} · ${selectedCapacity.label}`}
          onStatsChange={handleReviewStatsChange}
        />

        {/* Related Units */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-[var(--pdp-border)] space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="pdp-mono text-xs uppercase tracking-[0.14em] text-[var(--pdp-accent)]">
                  Explore Lineup
                </p>
                <h3 className="pdp-heading text-2xl sm:text-3xl font-bold text-[var(--pdp-text)] mt-1">
                  Related architecture.
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('shop')}
                className="pdp-btn text-xs font-medium px-4 py-2 border border-[var(--pdp-border)] hover:border-[var(--pdp-border-strong)] text-[var(--pdp-text)] inline-flex items-center gap-1.5"
              >
                <span>View Full Catalog</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedProducts.map((rp) => (
                <button
                  key={rp.id}
                  type="button"
                  onClick={() => navigate('product-detail', { productId: rp.id })}
                  className="group text-left rounded-[12px] border border-[var(--pdp-border)] bg-[var(--pdp-surface)] hover:border-[var(--pdp-border-strong)] overflow-hidden transition-all"
                >
                  <div
                    className="aspect-[4/3] w-full p-6 flex items-center justify-center overflow-hidden"
                    style={{ backgroundImage: 'var(--pdp-plinth)' }}
                  >
                    <img
                      src={rp.images[0]}
                      alt={rp.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2 border-t border-[var(--pdp-border)]">
                    <div className="pdp-mono text-[11px] text-[var(--pdp-text-muted)]">
                      {rp.voltage} · {rp.capacityAh > 0 ? `${rp.capacityAh}Ah · ` : ''}
                      {rp.warrantyMonths}M
                    </div>
                    <h4 className="pdp-heading text-base font-bold text-[var(--pdp-text)] line-clamp-1">
                      {rp.name}
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="pdp-mono text-sm font-medium text-[var(--pdp-text)]">
                        ₹{rp.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-medium text-[var(--pdp-accent)] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Inspect
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* =========================================================
          MINIMAL ARCHITECTURAL PDP FOOTER
          ========================================================= */}
      <footer className="border-t border-[var(--pdp-border)] py-8 px-5 sm:px-8 pb-24 lg:pb-8">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--pdp-text-muted)]">
          <div className="flex items-center gap-3">
            <span className="pdp-heading font-bold text-sm text-[var(--pdp-text)]">KINETIX</span>
            <span aria-hidden="true" className="opacity-35">
              ·
            </span>
            <span>Engineered for altitude & endurance.</span>
          </div>
          <div className="flex items-center gap-5 pdp-mono text-[11px]">
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="hover:text-[var(--pdp-text)] transition-colors"
            >
              All Batteries
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('hero')}
              className="hover:text-[var(--pdp-text)] transition-colors"
            >
              Back to Top
            </button>
            <span>© 2026 KINETIX</span>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Quick-Add Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pdp-glass-bar border-t border-[var(--pdp-border)] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="pdp-mono text-[10px] uppercase tracking-[0.1em] text-[var(--pdp-text-muted)] truncate">
            {selectedFinish.name} · {selectedCapacity.label}
          </div>
          <div className="pdp-mono text-base font-bold text-[var(--pdp-text)]">
            ₹{(effectivePrice * quantity).toLocaleString('en-IN')}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="pdp-btn h-11 px-5 bg-[var(--pdp-accent)] hover:bg-[var(--pdp-accent-hover)] text-[#f3f6f4] text-xs font-medium inline-flex items-center gap-2 shrink-0"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>

      {/* Full-Screen Inspection Lightbox Modal */}
      {zoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product full-screen preview"
          className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setZoomOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full rounded-[12px] overflow-hidden bg-[var(--pdp-surface)] border border-[var(--pdp-border-strong)] p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="pdp-mono text-xs text-[var(--pdp-text-muted)]">
                {product.name} · {selectedFinish.name}
              </div>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="Close full-screen preview"
                className="pdp-btn w-9 h-9 bg-[var(--pdp-surface-2)] text-[var(--pdp-text)] inline-flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-[4/3] w-full flex items-center justify-center">
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ filter: selectedFinish.filter }}
                className="max-h-full max-w-full object-contain rounded-[12px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
