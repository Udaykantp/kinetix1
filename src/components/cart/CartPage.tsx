import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigate,
    products,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponCode('');
  };

  const recommended = products.filter((p) => p.category === 'accessories').slice(0, 2);

  return (
    <div className="bg-[#17191C] min-h-screen py-10 border-b border-[#25282D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8E959E] font-mono mb-6">
          <button onClick={() => navigate('home')} className="hover:text-[#F2F0EA]">
            Home
          </button>
          <span>/</span>
          <span className="text-[#D6B98C]">Shopping Bag</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F2F0EA] tracking-tight">
            Review Your Energy Cart ({cart.length} Models)
          </h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-[#8E959E] hover:text-red-400 font-mono transition-colors py-1"
            >
              Empty Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-16 text-center">
            <ShoppingBag className="w-16 h-16 text-[#343940] mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[#F2F0EA]">Your shopping cart is currently empty</h2>
            <p className="text-xs text-[#8E959E] mt-1 max-w-sm mx-auto">
              Browse our automotive AGM, tall tubular, and lithium-ion batteries.
            </p>
            <button
              onClick={() => navigate('shop')}
              className="mt-6 px-6 py-3 bg-[#D6B98C] text-[#17191C] font-semibold text-xs rounded-lg inline-flex items-center gap-2"
            >
              <span>Explore Batteries</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#101214] border border-[#25282D] rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5 justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg bg-[#25282D] shrink-0 border border-[#343940]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono text-[#8E959E] uppercase">
                        {item.product.brand} · {item.product.technology}
                      </div>
                      <h3
                        onClick={() =>
                          navigate('product-detail', { productId: item.product.id })
                        }
                        className="text-sm font-bold text-[#F2F0EA] hover:text-[#D6B98C] cursor-pointer mt-0.5 line-clamp-1"
                      >
                        {item.product.name}
                      </h3>
                      <div className="text-xs text-[#8E959E] mt-1">
                        {item.product.voltage} · {item.product.capacityAh > 0 ? `${item.product.capacityAh} Ah · ` : ''}
                        {item.product.warrantyMonths}M Factory Warranty
                      </div>
                      <div className="text-sm font-bold text-[#D6B98C] font-mono mt-2 tabular-nums">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#25282D] shrink-0">
                    <div className="flex items-center bg-[#17191C] border border-[#343940] rounded-lg">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#8E959E] hover:text-[#F2F0EA]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-mono font-bold text-[#F2F0EA]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#8E959E] hover:text-[#F2F0EA]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-[#F2F0EA] font-mono tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[11px] text-[#8E959E] hover:text-red-400 mt-1 flex items-center gap-1 justify-end"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Recommended Add-ons */}
              {recommended.length > 0 && (
                <div className="bg-[#101214] border border-[#25282D] rounded-xl p-6 mt-8">
                  <h3 className="text-sm font-bold text-[#F2F0EA] mb-4">Recommended Accessories</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommended.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3 bg-[#17191C] border border-[#25282D] rounded-lg flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded bg-[#25282D] shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-[#F2F0EA] line-clamp-1">
                              {prod.name}
                            </h4>
                            <div className="text-xs font-mono text-[#D6B98C]">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(prod)}
                          className="shrink-0 min-h-[36px] px-3 py-1.5 bg-[#25282D] hover:bg-[#343940] text-xs text-[#F2F0EA] rounded border border-[#343940]"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 space-y-5">
                <h2 className="text-base font-bold text-[#F2F0EA]">Order Breakdown</h2>

                {/* Coupon input */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#17191C] border border-[#D6B98C]/30 p-3 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#D6B98C]" />
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
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. VOLT15, TITANIUM)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 min-w-0 bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] px-3 py-2.5 rounded-l-lg focus:outline-none focus:border-[#D6B98C] font-mono"
                      />
                      <button
                        type="submit"
                        className="shrink-0 px-4 py-2.5 bg-[#25282D] hover:bg-[#343940] text-[#D6B98C] text-xs font-semibold rounded-r-lg border border-l-0 border-[#343940]"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMsg && (
                      <p
                        className={`text-[11px] ${
                          couponMsg.error ? 'text-red-400' : 'text-[#D6B98C]'
                        }`}
                      >
                        {couponMsg.text}
                      </p>
                    )}
                  </form>
                )}

                {/* Subtotals & Taxes */}
                <div className="space-y-2 text-xs text-[#8E959E] border-t border-[#25282D] pt-4">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="text-[#F2F0EA] font-mono">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#D6B98C]">
                      <span>Coupon Discount</span>
                      <span className="font-mono">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Applicable GST (18%)</span>
                    <span className="text-[#F2F0EA] font-mono">
                      ₹{cartTax.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doorstep Express Fitment</span>
                    <span className="text-[#F2F0EA] font-mono">
                      {cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#F2F0EA] pt-3 border-t border-[#25282D]">
                    <span>Grand Total</span>
                    <span className="text-[#D6B98C] font-mono">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() => navigate('checkout')}
                  className="w-full py-3.5 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Security and Guarantees */}
                <div className="pt-2 text-[11px] text-[#8E959E] space-y-1.5 border-t border-[#25282D]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D6B98C]" />
                    <span>Direct Factory Replacement Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#D6B98C]" />
                    <span>Free Doorstep Fitment in 45+ Cities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
