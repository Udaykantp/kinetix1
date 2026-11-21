import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CATEGORY_METADATA } from '../../data/products';
import { ProductCategory } from '../../types';

export const CategoryPage: React.FC = () => {
  const {
    pageParams,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    navigate,
  } = useStore();

  const currentCategory: ProductCategory = (pageParams?.category as ProductCategory) || 'car';
  const meta = CATEGORY_METADATA[currentCategory] || CATEGORY_METADATA['car'];
  const categoryProducts = products.filter((p) => p.category === currentCategory);

  return (
    <div className="bg-[#17191C] min-h-screen pb-20 border-b border-[#25282D]">
      {/* Cinematic Category Banner */}
      <div className="relative bg-[#101214] border-b border-[#25282D] py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={meta.bannerImage}
            alt={meta.name}
            className="w-full h-full object-cover filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101214] via-[#101214]/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#8E959E] font-mono mb-3">
            <button onClick={() => navigate('home')} className="hover:text-[#F2F0EA]">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('shop')} className="hover:text-[#F2F0EA]">
              Batteries
            </button>
            <span>/</span>
            <span className="text-[#D6B98C]">{meta.name}</span>
          </div>

          <div className="max-w-2xl">
            <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider mb-2">
              Engineered Segment Portfolio
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#F2F0EA] tracking-tight mb-4">
              {meta.headline}
            </h1>
            <p className="text-sm sm:text-base text-[#B7BCC2] leading-relaxed mb-6">
              {meta.description}
            </p>

            {/* Buying tip callout */}
            <div className="bg-[#17191C]/90 border border-[#343940] rounded-lg p-4 text-xs text-[#B7BCC2] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#D6B98C] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#F2F0EA] font-mono uppercase block mb-0.5">
                  Engineering Tip
                </span>
                <span>{meta.buyingTip}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Switcher Strip */}
      <div className="bg-[#101214] border-b border-[#25282D] py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <span className="text-xs font-mono text-[#8E959E] uppercase mr-2 shrink-0">
            Segments:
          </span>
          {[
            { id: 'car', label: 'Car' },
            { id: 'bike', label: 'Bike' },
            { id: 'inverter', label: 'Inverter' },
            { id: 'lithium', label: 'Lithium LiFePO4' },
            { id: 'solar', label: 'Solar' },
            { id: 'industrial', label: 'Industrial' },
            { id: 'ups', label: 'UPS' },
            { id: 'accessories', label: 'Accessories' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate('category', { category: cat.id })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                currentCategory === cat.id
                  ? 'bg-[#D6B98C] text-[#17191C] font-semibold'
                  : 'text-[#B7BCC2] hover:text-[#F2F0EA] bg-[#17191C]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Listing for this category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
          <h2 className="text-xl font-bold text-[#F2F0EA]">
            {meta.name} ({categoryProducts.length} Models)
          </h2>
          <button
            onClick={() => navigate('shop', { category: currentCategory })}
            className="text-xs text-[#D6B98C] hover:text-[#E3CDA7] flex items-center gap-1 font-mono self-start sm:self-auto"
          >
            <span>Filter in Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((product) => {
            const inWish = isInWishlist(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-[#101214] hover:bg-[#17191C] border border-[#25282D] hover:border-[#343940] rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between"
              >
                <div
                  onClick={() => navigate('product-detail', { productId: product.id })}
                  className="relative aspect-[4/3] bg-[#25282D] overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
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
                      className={`p-2 rounded-lg backdrop-blur-md transition-all active:scale-90 ${
                        inWish
                          ? 'bg-[#E11D48] text-white'
                          : 'bg-[#17191C]/85 text-[#F2F0EA] hover:text-[#E11D48]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      aria-label={`Quick view ${product.name}`}
                      className="p-2 rounded-lg bg-[#17191C]/80 backdrop-blur-md text-[#B7BCC2] hover:text-[#F2F0EA] opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#8E959E] uppercase tracking-wider font-mono">
                      <span>{product.brand}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.technology}</span>
                    </div>

                    <h3
                      onClick={() => navigate('product-detail', { productId: product.id })}
                      className="text-sm font-semibold text-[#F2F0EA] hover:text-[#D6B98C] cursor-pointer mt-1.5 line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-[#B7BCC2] mt-2">
                      {product.capacityAh > 0 && <span>{product.capacityAh} Ah</span>}
                      {product.capacityAh > 0 && <span aria-hidden="true">·</span>}
                      <span>{product.voltage}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.warrantyMonths}M Warranty</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2.5 text-xs text-[#D6B98C]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold text-[#F2F0EA]">{product.rating}</span>
                      <span className="text-[#8E959E]">({product.reviewCount})</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#25282D] flex items-center justify-between gap-2">
                    <div>
                      <div className="text-base font-bold text-[#F2F0EA] font-mono tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      {product.discountPercent > 0 && (
                        <div className="text-[11px] text-[#8E959E] line-through font-mono">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] rounded-lg text-xs font-semibold transition-colors"
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

        {/* Category FAQs */}
        {meta.faqs && meta.faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#25282D]">
            <h3 className="text-xl font-bold text-[#F2F0EA] mb-6">
              Frequently Asked Questions for {meta.name}
            </h3>
            <div className="space-y-4">
              {meta.faqs.map((f, i) => (
                <div key={i} className="bg-[#101214] border border-[#25282D] p-5 rounded-xl">
                  <h4 className="text-sm font-semibold text-[#F2F0EA]">{f.q}</h4>
                  <p className="text-xs text-[#B7BCC2] mt-2 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
