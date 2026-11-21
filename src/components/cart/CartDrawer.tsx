import React, { useEffect, useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigate,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const freeShippingThreshold = 2500;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div
      className="fixed inset-0 z-[70] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white border-l border-gray-200 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#25282D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D6B98C]" />
              <h2 className="text-base font-bold text-[#F2F0EA]">Your Battery Reserve</h2>
              <span className="text-xs font-mono bg-[#25282D] text-[#D6B98C] px-2 py-0.5 rounded">
                {cart.length} Items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#8E959E] hover:text-[#F2F0EA] rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-[#17191C] border-b border-[#25282D] text-xs">
            {cartSubtotal >= freeShippingThreshold ? (
              <span className="text-[#D6B98C] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Unlocked Free Express Doorstep Installation!</span>
              </span>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#8E959E]">
                  <span>Add ₹{(freeShippingThreshold - cartSubtotal).toLocaleString('en-IN')} for Free Delivery</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#25282D] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D6B98C] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-[#343940] mb-3" />
                <h3 className="text-sm font-semibold text-[#F2F0EA]">Your bag is currently empty</h3>
                <p className="text-xs text-[#8E959E] mt-1 max-w-xs">
                  Select automotive AGM, inverter, or lithium batteries from our catalog.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('shop');
                  }}
                  className="mt-5 px-4 py-2 bg-[#D6B98C] text-[#17191C] font-semibold text-xs rounded-lg"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 bg-[#17191C] border border-[#25282D] rounded-xl flex gap-3 items-center"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={item.finishFilter ? { filter: item.finishFilter } : undefined}
                    className="w-16 h-16 object-cover rounded-lg bg-[#25282D] shrink-0 border border-[#343940] transition-all duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#F2F0EA] truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-[#8E959E] font-mono mt-0.5">
                      {item.finishName ? `${item.finishName} · ` : ''}
                      {item.capacityLabel
                        ? `${item.capacityLabel} · `
                        : item.product.capacityAh > 0
                        ? `${item.product.capacityAh}Ah · `
                        : ''}
                      {item.product.voltage} · {item.product.warrantyMonths}M
                    </div>
                    <div className="text-xs font-bold text-[#D6B98C] font-mono mt-1 tabular-nums">
                      ₹{(item.unitPrice ?? item.product.price).toLocaleString('en-IN')}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-[#25282D] border border-[#343940] rounded">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#8E959E] hover:text-[#F2F0EA]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#F2F0EA]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#8E959E] hover:text-[#F2F0EA]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-[#8E959E] hover:text-red-400"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Order Summary & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#17191C] border-t border-[#25282D] space-y-4">
              {/* Coupon input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#25282D] border border-[#D6B98C]/30 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#D6B98C]" />
                    <span className="font-mono text-[#D6B98C] font-bold">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-[#8E959E]">
                      (-₹{cartDiscount.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#8E959E] hover:text-red-400 font-mono"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Coupon Code (VOLT15)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#101214] border border-[#343940] text-xs text-[#F2F0EA] px-3 py-2 rounded-l-lg focus:outline-none focus:border-[#D6B98C] font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#25282D] hover:bg-[#343940] text-[#D6B98C] font-semibold text-xs border border-l-0 border-[#343940] rounded-r-lg"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#8E959E] border-t border-[#25282D] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#F2F0EA] font-mono">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#D6B98C]">
                    <span>Discount</span>
                    <span className="font-mono">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18% Component)</span>
                  <span className="text-[#F2F0EA] font-mono">
                    ₹{cartTax.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Doorstep Delivery & Installation</span>
                  <span className="text-[#F2F0EA] font-mono">
                    {cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#F2F0EA] pt-2 border-t border-[#25282D]">
                  <span>Total Amount</span>
                  <span className="text-[#D6B98C] font-mono">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('checkout');
                }}
                className="w-full min-h-[48px] py-3.5 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]"
              >
                <span>Proceed to Direct Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
