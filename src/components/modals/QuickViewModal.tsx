import React from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Check, ArrowRight, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
  } = useStore();

  if (!quickViewProduct) return null;

  const inWish = isInWishlist(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#101214] border border-[#25282D] rounded-2xl shadow-2xl">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 min-w-[36px] min-h-[36px] flex items-center justify-center bg-[#17191C]/90 text-[#B7BCC2] hover:text-[#F2F0EA] rounded-lg border border-[#343940]"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/3] sm:aspect-auto bg-[#25282D]">
            <img
              src={quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between space-y-4 text-xs">
            <div>
              <div className="flex items-center gap-2 text-[#8E959E] font-mono uppercase text-[10px]">
                <span>{quickViewProduct.brand}</span>
                <span aria-hidden="true">·</span>
                <span>{quickViewProduct.technology}</span>
              </div>

              <h3 className="text-base font-bold text-[#F2F0EA] mt-1 leading-snug">
                {quickViewProduct.name}
              </h3>

              <div className="flex items-center gap-1.5 mt-2 text-[#D6B98C]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-semibold text-[#F2F0EA]">{quickViewProduct.rating}</span>
                <span className="text-[#8E959E]">({quickViewProduct.reviewCount} reviews)</span>
              </div>

              <div className="text-lg font-bold text-[#F2F0EA] font-mono mt-3 tabular-nums">
                ₹{quickViewProduct.price.toLocaleString('en-IN')}
                <span className="text-xs text-[#8E959E] line-through ml-2 font-normal">
                  ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono text-[#B7BCC2]">
                <div className="p-2 bg-[#17191C] border border-[#25282D] rounded">
                  <span className="text-[#8E959E] block text-[9px]">CAPACITY</span>
                  <span>{quickViewProduct.capacityAh} Ah</span>
                </div>
                <div className="p-2 bg-[#17191C] border border-[#25282D] rounded">
                  <span className="text-[#8E959E] block text-[9px]">VOLTAGE</span>
                  <span>{quickProductVoltage(quickViewProduct.voltage)}</span>
                </div>
              </div>

              <p className="text-[#8E959E] mt-3 line-clamp-2 leading-relaxed">
                {quickViewProduct.description}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#25282D]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 py-2.5 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct)}
                  aria-label={inWish ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  aria-pressed={inWish}
                  title={inWish ? 'Remove from Wishlist' : 'Save to Wishlist'}
                  className={`p-2.5 rounded-lg border transition-all active:scale-90 ${
                    inWish
                      ? 'bg-[#E11D48] border-[#E11D48] text-white'
                      : 'bg-[#17191C] border-[#343940] text-[#B7BCC2] hover:text-[#E11D48]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigate('product-detail', { productId: quickViewProduct.id });
                }}
                className="w-full text-center text-[11px] text-[#D6B98C] hover:underline block pt-1"
              >
                View Full Technical Specifications →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function quickProductVoltage(voltage: string) {
  return voltage;
}
