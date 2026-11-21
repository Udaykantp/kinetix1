import React from 'react';
import {
  ArrowUpRight,
  BatteryCharging,
  Bike,
  Car,
  Cpu,
  Factory,
  Sun,
  Wrench,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ShopPage } from '../shop/ShopPage';
import { CategoryPageType } from '../../utils/router';
import { ProductCategory } from '../../types';

const DEDICATED_CATEGORY_CARDS: {
  pageType: CategoryPageType;
  category: ProductCategory;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    pageType: 'car-batteries',
    category: 'car',
    label: 'Car Batteries',
    tagline: 'AGM & Silven-Alloy Ignition',
    icon: Car,
  },
  {
    pageType: 'bike-batteries',
    category: 'bike',
    label: 'Bike Batteries',
    tagline: 'Sealed VRLA & LiFePO4',
    icon: Bike,
  },
  {
    pageType: 'inverter-batteries',
    category: 'inverter',
    label: 'Inverter Batteries',
    tagline: 'Tall Tubular Home Backup',
    icon: Zap,
  },
  {
    pageType: 'lithium-batteries',
    category: 'lithium',
    label: 'Lithium Batteries (LiFePO4)',
    tagline: '6,000+ Cycle Smart BMS',
    icon: Cpu,
  },
  {
    pageType: 'solar-batteries',
    category: 'solar',
    label: 'Solar Batteries',
    tagline: 'C10 Deep-Cycle PV Storage',
    icon: Sun,
  },
  {
    pageType: 'industrial-batteries',
    category: 'industrial',
    label: 'Industrial Batteries',
    tagline: '48V Telecom & Server Racks',
    icon: Factory,
  },
  {
    pageType: 'ups-batteries',
    category: 'ups',
    label: 'UPS Batteries',
    tagline: 'Zero-ms Standby AGM',
    icon: BatteryCharging,
  },
  {
    pageType: 'accessories',
    category: 'accessories',
    label: 'Accessories',
    tagline: 'Smart Chargers & Copper Cables',
    icon: Wrench,
  },
];

export const BrowseAllBatteriesPage: React.FC = () => {
  const { products, navigate, getRouteUrl } = useStore();

  const handleCategoryClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetPage: CategoryPageType
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(targetPage);
  };

  return (
    <div className="bg-[#F5F6F4] min-h-screen">
      {/* Dedicated Category Directory Strip linking to all 8 separate category pages */}
      <section className="bg-white border-b border-gray-200/90">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B5812B]">
                Browse by Dedicated Category
              </p>
              <h2 className="text-lg sm:text-xl font-bold text-[#073B32] tracking-tight">
                Explore Specialized Battery Pages
              </h2>
            </div>
            <p className="text-xs text-[#5C6663] tabular-nums">
              {products.length} certified battery models across 8 segments
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {DEDICATED_CATEGORY_CARDS.map((item) => {
              const Icon = item.icon;
              const count = products.filter((p) => p.category === item.category).length;
              return (
                <a
                  key={item.pageType}
                  href={getRouteUrl(item.pageType)}
                  onClick={(e) => handleCategoryClick(e, item.pageType)}
                  className="group rounded-xl border border-gray-200/90 hover:border-[#073B32] bg-[#FAFBF9] hover:bg-[#073B32] p-3 flex flex-col justify-between gap-2.5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="w-8 h-8 rounded-lg bg-[#073B32]/8 group-hover:bg-white/15 text-[#073B32] group-hover:text-[#E5A51C] flex items-center justify-center transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E5A51C] transition-colors shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#121417] group-hover:text-white leading-snug line-clamp-2 transition-colors">
                      {item.label}
                    </div>
                    <div className="text-[11px] font-mono text-[#5C6663] group-hover:text-white/75 mt-0.5 tabular-nums transition-colors">
                      {count} {count === 1 ? 'model' : 'models'}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full Real-Time Filterable All-Batteries Catalog */}
      <ShopPage />
    </div>
  );
};
