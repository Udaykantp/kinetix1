import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PdpTheme } from './pdpConfig';

interface PdpHeaderProps {
  theme: PdpTheme;
  onToggleTheme: () => void;
  cartItemCount: number;
  onOpenCart: () => void;
  onBackToCatalog: () => void;
  onScrollToSection: (id: string) => void;
}

export const PdpHeader: React.FC<PdpHeaderProps> = ({
  theme,
  onToggleTheme,
  cartItemCount,
  onOpenCart,
  onBackToCatalog,
  onScrollToSection,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 pdp-glass-bar transition-colors">
      <div className="max-w-[1240px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Back to Storefront + Minimal Mountain-Peak SVG Brand Mark + Wordmark */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="pdp-btn inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium border border-[var(--pdp-border)] hover:border-[var(--pdp-border-strong)] bg-[var(--pdp-surface)]/70 text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)] shrink-0"
            aria-label="Return to KINETIX catalog"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Catalog</span>
          </button>

          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onScrollToSection('hero');
            }}
            className="inline-flex items-center gap-2.5 text-[var(--pdp-text)] hover:opacity-80 transition-opacity whitespace-nowrap shrink-0"
          >
            {/* Minimal Alpine Peak + Energy Brand Mark SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M3 18.5L9.5 6.5L14.2 14.2L16.8 10.4L21 18.5H3Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 11.5L11.4 14.5"
                stroke="var(--pdp-accent)"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <span className="pdp-heading text-[17px] font-bold tracking-[-0.04em]">
              KINETIX
            </span>
          </a>
        </div>

        {/* Right: Clean nav links (Showcase, Specs), Light/Dark toggle, Shopping Bag with mono count */}
        <div className="flex items-center gap-2 sm:gap-6">
          <nav aria-label="Product sections" className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[var(--pdp-text-muted)]">
            <button
              type="button"
              onClick={() => onScrollToSection('showcase')}
              className="hover:text-[var(--pdp-text)] transition-colors py-1"
            >
              Showcase
            </button>
            <button
              type="button"
              onClick={() => onScrollToSection('thermal')}
              className="hover:text-[var(--pdp-text)] transition-colors py-1"
            >
              Thermal
            </button>
            <button
              type="button"
              onClick={() => onScrollToSection('craft')}
              className="hover:text-[var(--pdp-text)] transition-colors py-1"
            >
              Craft
            </button>
            <button
              type="button"
              onClick={() => onScrollToSection('specs')}
              className="hover:text-[var(--pdp-text)] transition-colors py-1"
            >
              Specs
            </button>
            <button
              type="button"
              onClick={() => onScrollToSection('reviews')}
              className="hover:text-[var(--pdp-text)] transition-colors py-1"
            >
              Reviews
            </button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Circular Light/Dark Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to Alpine Basalt Dark' : 'Switch to Alpine Mineral Light'}
              className="pdp-btn w-10 h-10 flex items-center justify-center border border-[var(--pdp-border)] hover:border-[var(--pdp-border-strong)] bg-[var(--pdp-surface)]/80 text-[var(--pdp-text)]"
            >
              {theme === 'light' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )}
            </button>

            {/* Shopping Bag Icon Button with Live Monospace Count Badge */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping bag (${cartItemCount} items)`}
              className="pdp-btn relative h-10 px-3.5 flex items-center gap-2 border border-[var(--pdp-border)] hover:border-[var(--pdp-border-strong)] bg-[var(--pdp-surface)]/80 text-[var(--pdp-text)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="pdp-mono text-xs font-medium min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-[var(--pdp-accent)] text-[var(--pdp-accent-fg)]">
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
