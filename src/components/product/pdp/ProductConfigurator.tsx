import React, { useState } from 'react';
import {
  Check,
  Heart,
  GitCompare,
  Maximize2,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react';
import { Product } from '../../../types';
import {
  CapacityOption,
  FINISH_OPTIONS,
  FinishId,
  FinishOption,
} from './pdpConfig';

interface ProductConfiguratorProps {
  product: Product;
  selectedFinish: FinishOption;
  onSelectFinish: (id: FinishId) => void;
  capacityOptions: CapacityOption[];
  selectedCapacity: CapacityOption;
  onSelectCapacity: (opt: CapacityOption) => void;
  quantity: number;
  onQuantityChange: (q: number) => void;
  exchangeScrap: boolean;
  onToggleScrap: (val: boolean) => void;
  effectivePrice: number;
  scrapDiscount: number;
  inWishlist: boolean;
  inComparison: boolean;
  onToggleWishlist: () => void;
  onAddToComparison: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onOpenZoom: () => void;
  pincode: string;
  onPincodeChange: (val: string) => void;
  onCheckPincode: (e: React.FormEvent) => void;
  pinResult: {
    deliverable: boolean;
    city: string;
    state: string;
    estimateDays: number;
    expressAvailable: boolean;
  } | null;
}

export const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({
  product,
  selectedFinish,
  onSelectFinish,
  capacityOptions,
  selectedCapacity,
  onSelectCapacity,
  quantity,
  onQuantityChange,
  exchangeScrap,
  onToggleScrap,
  effectivePrice,
  scrapDiscount,
  inWishlist,
  inComparison,
  onToggleWishlist,
  onAddToComparison,
  onAddToCart,
  onBuyNow,
  onOpenZoom,
  pincode,
  onPincodeChange,
  onCheckPincode,
  pinResult,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const currentImg = product.images[selectedImageIdx] || product.images[0];
  const totalAmount = effectivePrice * quantity;

  return (
    <section
      id="order"
      aria-labelledby="configurator-heading"
      className="py-20 sm:py-28 px-5 sm:px-8 max-w-[1240px] mx-auto border-t border-[var(--pdp-border)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
        {/* Left: Framed 4:5 Studio Preview Card with Soft Radial Plinth Glow & Dynamic Scale */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div
            className="relative aspect-[4/5] w-full rounded-[12px] overflow-hidden border border-[var(--pdp-border)] bg-[var(--pdp-surface)] flex items-center justify-center p-8 sm:p-12"
            style={{ backgroundImage: 'var(--pdp-plinth)' }}
          >
            {/* Top Status & Zoom Trigger */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="pdp-mono text-[11px] px-3 py-1 rounded-full bg-[var(--pdp-glass-strong)] backdrop-blur-md border border-[var(--pdp-border)] text-[var(--pdp-text)]">
                {selectedFinish.name} · {selectedCapacity.label}
              </span>

              <button
                type="button"
                onClick={onOpenZoom}
                aria-label="Inspect product full screen"
                className="pdp-btn w-9 h-9 flex items-center justify-center bg-[var(--pdp-glass-strong)] backdrop-blur-md border border-[var(--pdp-border)] text-[var(--pdp-text)] hover:border-[var(--pdp-border-strong)]"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Smoothly Scaling, Finish-Filtered Studio Product Cutout */}
            <div
              className="relative w-full max-w-[360px] transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `scale(${selectedCapacity.scale})`,
              }}
            >
              <img
                src={currentImg}
                alt={`${product.name} in ${selectedFinish.name}`}
                style={{
                  filter: selectedFinish.filter,
                  boxShadow: 'var(--pdp-shadow-float)',
                }}
                className="w-full aspect-square object-cover rounded-[12px] transition-[filter] duration-500"
              />
            </div>

            {/* Subtle Floor Shadow Plinth */}
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-6 rounded-full blur-xl pointer-events-none opacity-40"
              style={{ backgroundColor: selectedFinish.swatch }}
            />
          </div>

          {/* Thumbnail Switcher if Multiple Images */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  aria-label={`View gallery angle ${idx + 1}`}
                  className={`w-16 h-16 rounded-[12px] overflow-hidden border transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[var(--pdp-accent)] ring-2 ring-[var(--pdp-accent)]/30'
                      : 'border-[var(--pdp-border)] opacity-65 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    style={{ filter: selectedFinish.filter }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Title, Monospace Price, Pill Selectors, Spec Rows & CTA */}
        <div className="space-y-7">
          <div>
            <div className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pdp-accent)] flex items-center gap-2">
              <span>{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.inStock ? 'In Stock' : 'Backorder'}</span>
            </div>

            <h2
              id="configurator-heading"
              className="pdp-heading text-3xl sm:text-4xl font-bold text-[var(--pdp-text)] mt-2 leading-[1.08]"
            >
              {product.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="pdp-mono text-2xl sm:text-3xl font-medium text-[var(--pdp-text)] tabular-nums">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {selectedCapacity.originalPrice > selectedCapacity.price && (
                <span className="pdp-mono text-sm text-[var(--pdp-text-muted)] line-through tabular-nums">
                  ₹{selectedCapacity.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="pdp-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--pdp-surface-2)] text-[var(--pdp-accent)]">
                Incl. GST
              </span>
            </div>
          </div>

          {/* Finish Pill Radio Group */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--pdp-text)]">Finish</span>
              <span className="pdp-mono text-[var(--pdp-text-muted)]">{selectedFinish.name}</span>
            </div>
            <div
              role="radiogroup"
              aria-label="Choose chassis finish"
              className="flex flex-wrap gap-2.5"
            >
              {FINISH_OPTIONS.map((fin) => {
                const active = fin.id === selectedFinish.id;
                return (
                  <button
                    key={fin.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onSelectFinish(fin.id)}
                    className={`pdp-btn h-11 px-4 inline-flex items-center gap-2.5 text-xs font-medium border ${
                      active
                        ? 'border-[var(--pdp-accent)] bg-[var(--pdp-surface-2)] text-[var(--pdp-text)]'
                        : 'border-[var(--pdp-border)] bg-[var(--pdp-surface)]/50 text-[var(--pdp-text-muted)] hover:border-[var(--pdp-border-strong)] hover:text-[var(--pdp-text)]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: fin.swatch }}
                    />
                    <span>{fin.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capacity / Edition Pill Radio Group */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--pdp-text)]">Capacity &amp; Tier</span>
              <span className="pdp-mono text-[var(--pdp-text-muted)]">
                {selectedCapacity.sublabel}
              </span>
            </div>
            <div
              role="radiogroup"
              aria-label="Choose capacity tier"
              className="grid grid-cols-3 gap-1.5 sm:gap-2.5"
            >
              {capacityOptions.map((opt) => {
                const active = opt.id === selectedCapacity.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onSelectCapacity(opt)}
                    className={`pdp-btn py-2.5 px-2 sm:px-3 flex flex-col items-center justify-center border text-center min-w-0 ${
                      active
                        ? 'border-[var(--pdp-accent)] bg-[var(--pdp-accent)] text-[var(--pdp-accent-fg)]'
                        : 'border-[var(--pdp-border)] bg-[var(--pdp-surface)]/60 text-[var(--pdp-text)] hover:border-[var(--pdp-border-strong)]'
                    }`}
                  >
                    <span className="pdp-mono text-[11px] sm:text-xs font-medium truncate max-w-full">{opt.label}</span>
                    <span
                      className={`pdp-mono text-[10px] mt-0.5 tabular-nums ${
                        active ? 'opacity-85' : 'text-[var(--pdp-text-muted)]'
                      }`}
                    >
                      ₹{opt.price.toLocaleString('en-IN')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrap Exchange Rebate Toggle */}
          <label className="flex items-start gap-3 p-4 rounded-[12px] border border-[var(--pdp-border)] bg-[var(--pdp-surface)]/70 cursor-pointer hover:border-[var(--pdp-border-strong)] transition-colors">
            <input
              type="checkbox"
              checked={exchangeScrap}
              onChange={(e) => onToggleScrap(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[var(--pdp-accent)] rounded"
            />
            <div className="flex-1 text-xs">
              <div className="font-medium text-[var(--pdp-text)] flex items-center justify-between gap-2">
                <span>Exchange Old Scrap Battery</span>
                <span className="pdp-mono text-[var(--pdp-accent)]">
                  -₹{Math.min(1200, Math.round(selectedCapacity.price * 0.12)).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-[var(--pdp-text-muted)] mt-0.5">
                Instant doorstep rebate collected by our certified technician during installation.
                {exchangeScrap && scrapDiscount > 0 ? ' Applied to total.' : ''}
              </p>
            </div>
          </label>

          {/* Clean Key-Value Spec Rows */}
          <div className="divide-y divide-[var(--pdp-border)] border-y border-[var(--pdp-border)] text-xs">
            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-[var(--pdp-text-muted)] shrink-0">Chemistry</span>
              <span className="pdp-mono text-[var(--pdp-text)] font-medium text-right">
                {product.technology}
              </span>
            </div>
            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-[var(--pdp-text-muted)] shrink-0">Voltage &amp; Dimensions</span>
              <span className="pdp-mono text-[var(--pdp-text)] font-medium text-right">
                {product.voltage} · {product.dimensions}
              </span>
            </div>
            <div className="py-3 flex items-center justify-between gap-4">
              <span className="text-[var(--pdp-text-muted)] shrink-0">Warranty</span>
              <span className="pdp-mono text-[var(--pdp-text)] font-medium text-right">
                {product.warrantyMonths} Months Direct Factory
              </span>
            </div>
          </div>

          {/* Quantity + Primary Full-Width Add to Bag CTA */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Pill */}
              <div className="inline-flex items-center justify-between sm:justify-center h-12 px-2 rounded-full border border-[var(--pdp-border)] bg-[var(--pdp-surface)] shrink-0">
                <button
                  type="button"
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="pdp-btn w-9 h-9 flex items-center justify-center text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="pdp-mono text-sm font-medium w-8 text-center text-[var(--pdp-text)]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
                  aria-label="Increase quantity"
                  className="pdp-btn w-9 h-9 flex items-center justify-center text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Full-width Primary Pill Button */}
              <button
                type="button"
                onClick={onAddToCart}
                className="pdp-btn flex-1 h-12 px-5 sm:px-6 bg-[var(--pdp-accent)] hover:bg-[var(--pdp-accent-hover)] text-[var(--pdp-accent-fg)] text-sm font-medium flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                <span>Add to Bag</span>
                <span aria-hidden="true">—</span>
                <span className="pdp-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
              </button>
            </div>

            {/* Secondary Row: Express Buy Now + Wishlist + Compare */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={onBuyNow}
                className="pdp-btn h-11 px-4 border border-[var(--pdp-border-strong)] bg-transparent hover:bg-[var(--pdp-surface)] text-[var(--pdp-text)] text-xs font-medium inline-flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-[var(--pdp-accent)]" />
                <span>Express Checkout</span>
              </button>

              <button
                type="button"
                onClick={onToggleWishlist}
                className={`pdp-btn h-11 px-4 border text-xs font-medium inline-flex items-center justify-center gap-1.5 ${
                  inWishlist
                    ? 'border-[var(--pdp-accent)] bg-[var(--pdp-surface-2)] text-[var(--pdp-accent)]'
                    : 'border-[var(--pdp-border)] hover:border-[var(--pdp-border-strong)] text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
                <span>{inWishlist ? 'Saved' : 'Wishlist'}</span>
              </button>

              <button
                type="button"
                onClick={onAddToComparison}
                className={`pdp-btn h-11 px-4 border text-xs font-medium inline-flex items-center justify-center gap-1.5 ${
                  inComparison
                    ? 'border-[var(--pdp-accent)] bg-[var(--pdp-surface-2)] text-[var(--pdp-accent)]'
                    : 'border-[var(--pdp-border)] hover:border-[var(--pdp-border-strong)] text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>{inComparison ? 'Comparing' : 'Compare'}</span>
              </button>
            </div>
          </div>

          {/* Delivery PIN Code Availability Checker */}
          <div className="pt-2">
            <form onSubmit={onCheckPincode} className="flex items-center gap-2">
              <div className="relative flex-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--pdp-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => onPincodeChange(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN for 4-hr fitment"
                  aria-label="Delivery PIN code"
                  className="w-full h-10 pl-9 pr-3 rounded-full border border-[var(--pdp-border)] bg-[var(--pdp-surface)] text-xs pdp-mono focus:outline-none focus:border-[var(--pdp-accent)]"
                />
              </div>
              <button
                type="submit"
                className="pdp-btn h-10 px-4 border border-[var(--pdp-border-strong)] bg-[var(--pdp-surface)] hover:bg-[var(--pdp-surface-2)] text-xs font-medium text-[var(--pdp-text)]"
              >
                Check
              </button>
            </form>

            {pinResult && (
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--pdp-text-muted)] px-1">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[var(--pdp-accent)]" />
                  <span>
                    {pinResult.city}, {pinResult.state} —{' '}
                    <strong className="text-[var(--pdp-text)]">
                      {pinResult.expressAvailable
                        ? '4-Hour Express Doorstep Fitment'
                        : `${pinResult.estimateDays}-Day Insured Delivery`}
                    </strong>
                  </span>
                </span>
                <span className="pdp-mono text-[var(--pdp-accent)] inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> Free Fitment
                </span>
              </div>
            )}
          </div>

          {/* Subtle Trust Micro-Row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[11px] text-[var(--pdp-text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--pdp-accent)]" />
              <span>BIS &amp; ISO 9001 Verified</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[var(--pdp-accent)]" />
              <span>Free Alternator Health Test</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
