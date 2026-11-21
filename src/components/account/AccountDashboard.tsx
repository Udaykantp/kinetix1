import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Shield,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  FileText,
  Download,
  Pencil,
  XCircle,
  ShoppingBag,
  Loader2,
  Home,
  Briefcase,
  CloudUpload,
  Star,
  GitCompare,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Address, Order } from '../../types';

export const AccountDashboard: React.FC = () => {
  const {
    user,
    authLoading,
    orders,
    wishlist,
    toggleWishlist,
    clearWishlist,
    moveAllWishlistToCart,
    addToCart,
    addToComparison,
    isInComparison,
    logout,
    updateUserProfile,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    cancelOrder,
    requestOrderReturn,
    linkGuestOrderToAccount,
    checkPincode,
    navigate,
    showToast,
    pageParams,
    setIsAuthModalOpen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile' | 'returns'>(
    pageParams?.tab || 'orders'
  );

  useEffect(() => {
    if (pageParams?.tab) {
      setActiveTab(pageParams.tab);
    }
  }, [pageParams?.tab]);

  const handleTabChange = (tab: 'orders' | 'wishlist' | 'addresses' | 'profile' | 'returns') => {
    setActiveTab(tab);
    navigate('account', { tab }, { replace: true, skipScroll: true });
  };

  // Profile form state (controlled & synced with Firestore user doc)
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileGender, setProfileGender] = useState<'' | 'Male' | 'Female' | 'Other'>(
    user?.gender || ''
  );
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileGender(user.gender || '');
    }
  }, [user?.id, user?.name, user?.phone, user?.gender]);

  // Return request state
  const [returnOrderId, setReturnOrderId] = useState<string>('');
  const [returnReason, setReturnReason] = useState('Battery voltage drop / replacement warranty claim');
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Cancel order inline confirmation state
  const [confirmCancelOrderId, setConfirmCancelOrderId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  // Address modal state (supports both Add and Edit)
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | undefined>(undefined);
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [savingAddr, setSavingAddr] = useState(false);

  // Invoice viewer modal
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Dedicated Wishlist view state
  const [wishlistCategoryFilter, setWishlistCategoryFilter] = useState<string>('all');
  const [confirmClearWishlist, setConfirmClearWishlist] = useState(false);

  const wishlistCategories = Array.from(new Set(wishlist.map((p) => p.category)));
  const filteredWishlist =
    wishlistCategoryFilter === 'all'
      ? wishlist
      : wishlist.filter((p) => p.category === wishlistCategoryFilter);
  const totalWishlistValue = wishlist.reduce((acc, p) => acc + p.price, 0);
  const totalWishlistSavings = wishlist.reduce(
    (acc, p) => acc + Math.max(0, p.originalPrice - p.price),
    0
  );

  // Reset category filter if selected category becomes empty
  useEffect(() => {
    if (
      wishlistCategoryFilter !== 'all' &&
      !wishlist.some((p) => p.category === wishlistCategoryFilter)
    ) {
      setWishlistCategoryFilter('all');
    }
  }, [wishlist, wishlistCategoryFilter]);

  const renderWishlistSection = () => (
    <div className="space-y-6">
      {/* Wishlist Header & Bulk Actions */}
      <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E11D48] fill-[#E11D48]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#F2F0EA]">
              Saved Batteries ({wishlist.length})
            </h2>
          </div>
          <p className="text-xs text-[#8E959E] mt-1">
            {wishlist.length > 0 ? (
              <>
                Total Value:{' '}
                <span className="text-[#F2F0EA] font-mono font-semibold">
                  ₹{totalWishlistValue.toLocaleString('en-IN')}
                </span>
                {totalWishlistSavings > 0 && (
                  <>
                    {' '}· Combined Savings:{' '}
                    <span className="text-[#D6B98C] font-mono font-semibold">
                      ₹{totalWishlistSavings.toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </>
            ) : (
              'Save your favorite batteries to compare specifications or add them to cart anytime.'
            )}
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                moveAllWishlistToCart();
                navigate('cart');
              }}
              className="min-h-[40px] px-4 py-2 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move All to Cart</span>
            </button>

            {confirmClearWishlist ? (
              <div className="flex items-center gap-1.5 bg-[#17191C] border border-red-500/40 rounded-lg px-2.5 py-1.5 text-xs">
                <span className="text-red-400 font-semibold">Clear all?</span>
                <button
                  type="button"
                  onClick={() => {
                    clearWishlist();
                    setConfirmClearWishlist(false);
                  }}
                  className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded font-semibold hover:bg-red-500/30"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearWishlist(false)}
                  className="text-[#8E959E] hover:text-[#F2F0EA] px-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClearWishlist(true)}
                className="min-h-[40px] px-3.5 py-2 bg-[#17191C] hover:bg-[#25282D] text-[#8E959E] hover:text-red-400 border border-[#343940] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Filter Strip (when multiple battery categories saved) */}
      {wishlistCategories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setWishlistCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              wishlistCategoryFilter === 'all'
                ? 'bg-[#D6B98C] text-[#17191C]'
                : 'bg-[#101214] border border-[#25282D] text-[#B7BCC2] hover:text-[#F2F0EA]'
            }`}
          >
            All Saved ({wishlist.length})
          </button>
          {wishlistCategories.map((cat) => {
            const count = wishlist.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setWishlistCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors whitespace-nowrap shrink-0 ${
                  wishlistCategoryFilter === cat
                    ? 'bg-[#D6B98C] text-[#17191C]'
                    : 'bg-[#101214] border border-[#25282D] text-[#B7BCC2] hover:text-[#F2F0EA]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Wishlist Grid or Empty State */}
      {wishlist.length === 0 ? (
        <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#17191C] border border-[#25282D] flex items-center justify-center mx-auto text-[#8E959E]">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F2F0EA]">Your Wishlist is Empty</h3>
            <p className="text-xs text-[#8E959E] mt-1.5 max-w-sm mx-auto leading-relaxed">
              Tap the heart icon on any automotive, inverter, solar, or LiFePO4 battery card to save it here for quick comparison and checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs rounded-lg transition-colors"
          >
            <span>Explore All Batteries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredWishlist.map((item) => {
            const inComp = isInComparison(item.id);
            const savings = Math.max(0, item.originalPrice - item.price);
            const pctOff =
              item.discountPercent ||
              (item.originalPrice > 0 ? Math.round((savings / item.originalPrice) * 100) : 0);

            return (
              <div
                key={item.id}
                className="group bg-[#101214] border border-[#25282D] hover:border-[#D6B98C]/40 rounded-2xl overflow-hidden transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image + Remove Heart + Discount Tag */}
                  <div
                    onClick={() => navigate('product-detail', { productId: item.id })}
                    className="relative aspect-[16/9] bg-[#17191C] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {pctOff > 0 && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#101214]/90 border border-[#D6B98C]/40 text-[#D6B98C] text-[10px] font-mono font-bold">
                        {pctOff}% OFF
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                      aria-label={`Remove ${item.name} from wishlist`}
                      title="Remove from Wishlist"
                      className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center shadow-md hover:bg-[#BE123C] transition-all active:scale-90"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Specs & Pricing */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase">
                      <span className="text-[#8E959E] truncate">
                        {item.brand} · {item.category} · {item.technology}
                      </span>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded text-[10px] ${
                          !item.inStock
                            ? 'bg-red-500/10 text-red-400'
                            : item.stockCount > 5
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {!item.inStock
                          ? 'Out of Stock'
                          : item.stockCount > 5
                          ? 'In Stock'
                          : `Only ${item.stockCount} Left`}
                      </span>
                    </div>

                    <h4
                      onClick={() => navigate('product-detail', { productId: item.id })}
                      className="text-sm sm:text-base font-bold text-[#F2F0EA] hover:text-[#D6B98C] cursor-pointer line-clamp-1 transition-colors"
                    >
                      {item.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#B7BCC2] font-mono">
                      {item.capacityAh > 0 && <span>{item.capacityAh} Ah</span>}
                      {item.capacityAh > 0 && <span className="text-[#343940]">|</span>}
                      <span>{item.voltage}</span>
                      <span className="text-[#343940]">|</span>
                      <span>{item.warrantyMonths}M Warranty</span>
                      <span className="text-[#343940]">|</span>
                      <span className="inline-flex items-center gap-1 text-[#D6B98C]">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[#F2F0EA]">{item.rating}</span>
                        <span className="text-[#8E959E]">({item.reviewCount})</span>
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2.5 pt-1">
                      <span className="text-lg font-bold font-mono text-[#D6B98C] tabular-nums">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs font-mono text-[#8E959E] line-through tabular-nums">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-[#25282D] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(item);
                      toggleWishlist(item);
                    }}
                    className="flex-1 min-h-[38px] px-3 py-2 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addToComparison(item)}
                    title={inComp ? 'Already in Comparison' : 'Add to Compare'}
                    className={`min-h-[38px] px-3 py-2 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      inComp
                        ? 'bg-[#25282D] border-[#D6B98C] text-[#D6B98C]'
                        : 'bg-[#17191C] border-[#343940] text-[#B7BCC2] hover:text-[#F2F0EA]'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{inComp ? 'Comparing' : 'Compare'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(item)}
                    aria-label={`Remove ${item.name}`}
                    title="Remove from Wishlist"
                    className="min-w-[38px] min-h-[38px] bg-[#17191C] hover:bg-red-500/10 border border-[#343940] hover:border-red-500/40 text-[#8E959E] hover:text-red-400 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (authLoading) {
    return (
      <div className="bg-[#17191C] min-h-screen py-24 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-7 h-7 text-[#D6B98C] animate-spin mb-3" />
        <p className="text-xs text-[#8E959E] font-mono">Loading your verified profile...</p>
      </div>
    );
  }

  if (!user) {
    // Allow guest shoppers to use the dedicated Wishlist view directly without blocking behind login
    if (activeTab === 'wishlist') {
      return (
        <div className="bg-[#17191C] min-h-screen py-10 border-b border-[#25282D]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Sync Banner for Guest Wishlist */}
            <div className="bg-[#101214] border border-[#D6B98C]/35 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D6B98C]/10 border border-[#D6B98C]/30 flex items-center justify-center text-[#D6B98C] shrink-0">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#F2F0EA]">
                    Sync Your Wishlist Across Devices
                  </div>
                  <p className="text-[#8E959E] mt-0.5">
                    Sign in with Google to permanently save your favorite batteries, addresses, and orders to your account.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="min-h-[40px] px-4 py-2 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Sign In with Google
              </button>
            </div>

            {renderWishlistSection()}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#17191C] min-h-screen py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#101214] border border-[#25282D] rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#D6B98C]/10 border border-[#D6B98C]/30 flex items-center justify-center mx-auto text-[#D6B98C]">
            <UserIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#F2F0EA]">Sign In to Your Account</h2>
          <p className="text-xs text-[#8E959E] leading-relaxed">
            Manage your profile, saved fitment addresses, wishlist, order history, cancellations, and digital warranty certificates across all your devices.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full mt-2 px-6 py-3 min-h-[44px] bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] text-xs font-semibold rounded-lg transition-colors"
          >
            Sign In / Create Account with Google
          </button>

          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={() => handleTabChange('wishlist')}
              className="w-full px-4 py-2.5 bg-[#17191C] hover:bg-[#25282D] border border-[#343940] text-[#F2F0EA] text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-[#E11D48] fill-[#E11D48]" />
              <span>View Your Saved Wishlist ({wishlist.length})</span>
            </button>
          )}

          {orders.length > 0 && (
            <div className="pt-4 border-t border-[#25282D] text-left">
              <p className="text-[11px] font-mono text-[#D6B98C] uppercase mb-2">
                Recent Guest Orders on This Device ({orders.length})
              </p>
              <div className="space-y-2">
                {orders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#17191C] border border-[#25282D] rounded-lg p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-[#F2F0EA]">{ord.id}</div>
                      <div className="text-[11px] text-[#8E959E]">
                        ₹{ord.total.toLocaleString('en-IN')} · {ord.status}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('tracking', { orderId: ord.id })}
                      className="px-2.5 py-1.5 bg-[#25282D] text-[#D6B98C] rounded text-[11px] font-semibold"
                    >
                      Track
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const openAddAddressModal = () => {
    setEditingAddressId(undefined);
    setAddrLabel('Home');
    setAddrName(user.name || '');
    setAddrPhone(user.phone || '');
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('');
    setAddrState('');
    setAddrPin('');
    setAddrIsDefault(user.addresses.length === 0);
    setShowAddressModal(true);
  };

  const openEditAddressModal = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrLabel(addr.label || 'Home');
    setAddrName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrLine1(addr.addressLine1);
    setAddrLine2(addr.addressLine2 || '');
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPin(addr.pinCode);
    setAddrIsDefault(Boolean(addr.isDefault));
    setShowAddressModal(true);
  };

  const handleAddressPinChange = (val: string) => {
    setAddrPin(val);
    if (val.trim().length === 6) {
      const info = checkPincode(val);
      if (info.deliverable && info.city) {
        setAddrCity(info.city);
        setAddrState(info.state);
      }
    }
  };

  const handleSaveAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName.trim() || !addrLine1.trim() || !addrPin.trim()) {
      showToast('Please fill all required address fields.', 'error');
      return;
    }
    if (addrPhone.trim().length < 6) {
      showToast('Please enter a valid contact phone number.', 'error');
      return;
    }
    setSavingAddr(true);
    try {
      await saveAddress({
        id: editingAddressId,
        label: addrLabel,
        fullName: addrName.trim(),
        phone: addrPhone.trim(),
        email: user.email,
        addressLine1: addrLine1.trim(),
        addressLine2: addrLine2.trim(),
        city: addrCity.trim() || 'Mumbai',
        state: addrState.trim() || 'Maharashtra',
        pinCode: addrPin.trim(),
        isDefault: addrIsDefault,
      });
      setShowAddressModal(false);
    } finally {
      setSavingAddr(false);
    }
  };

  const handleDeleteAddress = async (id?: string) => {
    if (!id) return;
    await deleteAddress(id);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Full Name cannot be empty.', 'error');
      return;
    }
    setSavingProfile(true);
    try {
      await updateUserProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
        gender: profileGender,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleConfirmCancelOrder = async (orderId: string) => {
    setCancellingOrderId(orderId);
    try {
      await cancelOrder(orderId, 'Cancelled by customer from My Orders.');
      setConfirmCancelOrderId(null);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrderId) return;
    setSubmittingReturn(true);
    try {
      await requestOrderReturn(returnOrderId, returnReason);
      setReturnOrderId('');
    } finally {
      setSubmittingReturn(false);
    }
  };

  const handleBuyAgain = (order: Order) => {
    order.items.forEach((it) => {
      addToCart(it.product, it.quantity);
    });
    navigate('cart');
  };

  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const returnRequestedOrders = orders.filter((o) => o.status === 'Return Requested');

  return (
    <div className="bg-[#17191C] min-h-screen py-10 border-b border-[#25282D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Welcome Banner */}
        <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-5 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-4 min-w-0">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#D6B98C]/60 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#D6B98C] text-[#17191C] flex items-center justify-center font-bold text-lg sm:text-xl font-mono shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider">
                {user.role === 'admin' ? 'Master Admin Account' : 'Verified Customer Profile'}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F2F0EA] truncate">{user.name}</h1>
              <p className="text-xs text-[#8E959E] break-all sm:break-normal">
                {user.email}
                {user.phone ? ` · ${user.phone}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {user.role === 'admin' && (
              <button
                onClick={() => navigate('admin')}
                className="min-h-[40px] px-4 py-2 bg-[#25282D] hover:bg-[#343940] text-[#D6B98C] border border-[#D6B98C]/40 text-xs font-semibold rounded-lg font-mono flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}
            <button
              onClick={logout}
              className="min-h-[40px] px-4 py-2 bg-[#25282D] hover:bg-[#343940] text-[#8E959E] hover:text-red-400 border border-[#343940] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 2-Column: Sidebar Navigation + Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Tabs */}
          <aside className="lg:col-span-3 bg-[#101214] border border-[#25282D] rounded-xl p-2 sm:p-3 text-xs flex lg:flex-col overflow-x-auto no-scrollbar gap-1.5 sm:gap-1">
            {[
              { id: 'orders', label: 'Orders & Warranties', icon: Package, badge: orders.length },
              { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
              { id: 'addresses', label: 'Addresses', icon: MapPin, badge: user.addresses.length },
              { id: 'returns', label: 'Returns', icon: RotateCcw, badge: returnRequestedOrders.length || undefined },
              { id: 'profile', label: 'Profile', icon: UserIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`min-h-[44px] flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#25282D] text-[#D6B98C] font-semibold shadow-sm'
                      : 'text-[#B7BCC2] hover:text-[#F2F0EA] hover:bg-[#17191C]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#D6B98C] shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="font-mono text-[10px] bg-[#17191C] px-1.5 py-0.5 rounded text-[#D6B98C]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main Tab Content */}
          <div className="lg:col-span-9">
            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#F2F0EA]">Order History & Dispatches</h2>
                  <span className="text-xs font-mono text-[#8E959E]">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Recorded
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-[#101214] border border-[#25282D] rounded-xl p-10 text-center text-xs space-y-3">
                    <Package className="w-10 h-10 text-[#343940] mx-auto" />
                    <p className="text-[#8E959E]">You have not placed any battery orders yet.</p>
                    <button
                      onClick={() => navigate('shop')}
                      className="px-4 py-2 bg-[#D6B98C] text-[#17191C] font-semibold rounded-lg"
                    >
                      Explore Batteries
                    </button>
                  </div>
                ) : (
                  orders.map((ord) => {
                    const canCancel = ['Order Placed', 'Processing', 'Quality Testing'].includes(
                      ord.status
                    );
                    const canReturn = ord.status === 'Delivered';
                    const isUnlinkedGuestOrder = !ord.userId;

                    return (
                      <div
                        key={ord.id}
                        className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 space-y-5"
                      >
                        {/* Order top bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#25282D] text-xs">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-[#F2F0EA] text-sm">
                                {ord.id}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                  ord.status === 'Cancelled'
                                    ? 'bg-red-500/15 text-red-400'
                                    : ord.status === 'Return Requested'
                                    ? 'bg-amber-500/15 text-amber-400'
                                    : ord.status === 'Delivered'
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : 'bg-[#25282D] text-[#D6B98C]'
                                }`}
                              >
                                {ord.status}
                              </span>
                              {isUnlinkedGuestOrder && (
                                <button
                                  onClick={() => linkGuestOrderToAccount(ord)}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D6B98C]/15 text-[#D6B98C] hover:bg-[#D6B98C]/25 flex items-center gap-1"
                                >
                                  <CloudUpload className="w-3 h-3" />
                                  <span>Sync to Account</span>
                                </button>
                              )}
                            </div>
                            <div className="text-[11px] text-[#8E959E] mt-0.5">
                              Placed on{' '}
                              {new Date(ord.date).toLocaleDateString('en-IN', {
                                dateStyle: 'medium',
                              })}{' '}
                              · Total:{' '}
                              <span className="text-[#F2F0EA] font-mono font-semibold">
                                ₹{ord.total.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => navigate('tracking', { orderId: ord.id })}
                              className="px-3 py-1.5 bg-[#25282D] hover:bg-[#343940] text-[#D6B98C] rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#343940]"
                            >
                              <span>Live Tracking</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInvoiceOrder(ord)}
                              className="px-3 py-1.5 bg-[#17191C] hover:bg-[#25282D] text-[#F2F0EA] rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#343940]"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#D6B98C]" />
                              <span>Invoice</span>
                            </button>
                            <button
                              onClick={() => handleBuyAgain(ord)}
                              className="px-3 py-1.5 bg-[#17191C] hover:bg-[#25282D] text-[#B7BCC2] hover:text-[#F2F0EA] rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#343940]"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-[#D6B98C]" />
                              <span>Buy Again</span>
                            </button>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-xs">
                              <img
                                src={it.product.images[0]}
                                alt=""
                                className="w-16 h-16 object-cover rounded-lg bg-[#25282D] shrink-0 border border-[#343940]"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[#F2F0EA] truncate">
                                  {it.product.name}
                                </h4>
                                <p className="text-[#8E959E] font-mono text-[11px]">
                                  Qty: {it.quantity} · {it.product.warrantyMonths}M Direct Warranty ·{' '}
                                  {it.product.voltage}
                                </p>
                                <div className="text-[#D6B98C] font-mono font-bold mt-1">
                                  ₹{it.priceAtPurchase.toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* History & Order Actions strip */}
                        <div className="bg-[#17191C] border border-[#25282D] p-3 rounded-lg text-[11px] text-[#8E959E] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div>
                            <span className="text-[#B7BCC2] font-semibold">Latest Update: </span>
                            <span>{ord.statusHistory[ord.statusHistory.length - 1]?.note}</span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {canCancel && (
                              confirmCancelOrderId === ord.id ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-red-400 font-semibold">Cancel order?</span>
                                  <button
                                    disabled={cancellingOrderId === ord.id}
                                    onClick={() => handleConfirmCancelOrder(ord.id)}
                                    className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded font-semibold hover:bg-red-500/30"
                                  >
                                    {cancellingOrderId === ord.id ? 'Cancelling...' : 'Yes, Cancel'}
                                  </button>
                                  <button
                                    onClick={() => setConfirmCancelOrderId(null)}
                                    className="text-[#8E959E] hover:text-[#F2F0EA]"
                                  >
                                    Keep
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmCancelOrderId(ord.id)}
                                  className="text-red-400 hover:underline flex items-center gap-1 whitespace-nowrap"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Cancel Order</span>
                                </button>
                              )
                            )}

                            {canReturn && (
                              <button
                                onClick={() => {
                                  setReturnOrderId(ord.id);
                                  handleTabChange('returns');
                                }}
                                className="text-[#D6B98C] hover:underline whitespace-nowrap"
                              >
                                Request Return / Warranty
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === 'wishlist' && renderWishlistSection()}

            {/* TAB: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#F2F0EA]">Saved Fitment Addresses</h2>
                  <button
                    onClick={openAddAddressModal}
                    className="px-3.5 py-2 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs rounded-lg flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {user.addresses.length === 0 ? (
                  <div className="bg-[#101214] border border-[#25282D] rounded-xl p-10 text-center text-xs space-y-3">
                    <MapPin className="w-9 h-9 text-[#343940] mx-auto" />
                    <p className="text-[#8E959E]">
                      No saved addresses yet. Add a Home or Work address for 1-click checkout.
                    </p>
                    <button
                      onClick={openAddAddressModal}
                      className="px-4 py-2 bg-[#D6B98C] text-[#17191C] font-semibold rounded-lg"
                    >
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`bg-[#101214] border rounded-xl p-5 text-xs space-y-2 relative ${
                          addr.isDefault ? 'border-[#D6B98C]/60' : 'border-[#25282D]'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono bg-[#17191C] border border-[#343940] text-[#B7BCC2] px-2 py-0.5 rounded uppercase inline-flex items-center gap-1">
                            {addr.label === 'Work' ? (
                              <Briefcase className="w-2.5 h-2.5 text-[#D6B98C]" />
                            ) : (
                              <Home className="w-2.5 h-2.5 text-[#D6B98C]" />
                            )}
                            <span>{addr.label || 'Home'}</span>
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-mono bg-[#25282D] text-[#D6B98C] px-2 py-0.5 rounded">
                              PRIMARY FITMENT ADDRESS
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-[#F2F0EA] text-sm pt-1">{addr.fullName}</h4>
                        <p className="text-[#B7BCC2] leading-relaxed">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        </p>
                        <p className="text-[#8E959E]">
                          {addr.city}, {addr.state} -{' '}
                          <strong className="text-[#F2F0EA] font-mono">{addr.pinCode}</strong>
                        </p>
                        <p className="text-[#8E959E]">Phone: {addr.phone}</p>

                        <div className="pt-3 border-t border-[#25282D] flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditAddressModal(addr)}
                              className="text-[#D6B98C] hover:underline flex items-center gap-1 text-[11px]"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            {!addr.isDefault && addr.id && (
                              <button
                                onClick={() => setDefaultAddress(addr.id!)}
                                className="text-[#B7BCC2] hover:text-[#F2F0EA] hover:underline text-[11px]"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-400 hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: RETURNS */}
            {activeTab === 'returns' && (
              <div className="space-y-6">
                <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 space-y-5">
                  <h2 className="text-lg font-bold text-[#F2F0EA]">
                    Return, Replacement & Warranty Request
                  </h2>
                  <p className="text-xs text-[#8E959E]">
                    Every battery includes on-site replacement warranty. Select any delivered order below to submit a replacement or return ticket.
                  </p>

                  {deliveredOrders.length === 0 ? (
                    <div className="bg-[#17191C] border border-[#25282D] rounded-xl p-4 text-xs text-[#8E959E]">
                      You currently have no delivered orders eligible for a return or warranty claim.
                    </div>
                  ) : (
                    <form onSubmit={handleReturnSubmit} className="space-y-4 max-w-xl text-xs">
                      <div>
                        <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                          Delivered Order ID for Claim
                        </label>
                        <select
                          value={returnOrderId}
                          onChange={(e) => setReturnOrderId(e.target.value)}
                          className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg"
                        >
                          <option value="">Select Delivered Order...</option>
                          {deliveredOrders.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.id} - {o.items[0]?.product.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                          Reason for Return or Replacement
                        </label>
                        <textarea
                          rows={3}
                          required
                          minLength={3}
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!returnOrderId || submittingReturn}
                        className="px-5 py-2.5 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs rounded-lg disabled:opacity-50"
                      >
                        {submittingReturn ? 'Submitting Claim...' : 'Submit Replacement Request'}
                      </button>
                    </form>
                  )}
                </div>

                {returnRequestedOrders.length > 0 && (
                  <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 space-y-3">
                    <h3 className="text-sm font-bold text-[#F2F0EA]">Active Return & Warranty Tickets</h3>
                    {returnRequestedOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-[#17191C] border border-[#25282D] rounded-xl p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-mono font-bold text-[#D6B98C]">{ord.id}</div>
                          <div className="text-[#B7BCC2] mt-0.5">
                            {ord.returnReason || 'Return / Replacement ticket under review'}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 self-start sm:self-auto">
                          Return Requested
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#25282D]">
                  <div>
                    <h2 className="text-lg font-bold text-[#F2F0EA]">Personal Information</h2>
                    <p className="text-xs text-[#8E959E] mt-0.5">
                      Changes sync across all your devices and auto-fill at checkout.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Google Verified</span>
                  </span>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                        Mobile Phone
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+91 98200 11223"
                        className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                        Gender
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(['Male', 'Female', 'Other'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setProfileGender(g)}
                            className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors ${
                              profileGender === g
                                ? 'bg-[#25282D] border-[#D6B98C] text-[#D6B98C]'
                                : 'bg-[#17191C] border-[#343940] text-[#8E959E] hover:text-[#F2F0EA]'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                        Verified Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#8E959E] p-2.5 rounded-lg opacity-75"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2.5 bg-[#D6B98C] hover:bg-[#E3CDA7] disabled:opacity-60 text-[#17191C] font-semibold rounded-lg text-xs transition-colors"
                  >
                    {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </form>

                {/* Account Overview Stats */}
                <div className="pt-5 border-t border-[#25282D] grid grid-cols-3 gap-3 max-w-xl text-center">
                  <div className="bg-[#17191C] border border-[#25282D] rounded-xl p-3">
                    <div className="text-lg font-mono font-bold text-[#D6B98C]">{orders.length}</div>
                    <div className="text-[11px] text-[#8E959E]">Total Orders</div>
                  </div>
                  <div className="bg-[#17191C] border border-[#25282D] rounded-xl p-3">
                    <div className="text-lg font-mono font-bold text-[#D6B98C]">
                      {user.addresses.length}
                    </div>
                    <div className="text-[11px] text-[#8E959E]">Saved Addresses</div>
                  </div>
                  <div className="bg-[#17191C] border border-[#25282D] rounded-xl p-3">
                    <div className="text-lg font-mono font-bold text-[#D6B98C]">
                      {wishlist.length}
                    </div>
                    <div className="text-[11px] text-[#8E959E]">Wishlist Items</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 max-w-md w-full max-h-[90dvh] overflow-y-auto text-xs space-y-4">
            <h3 className="text-sm font-bold text-[#F2F0EA]">
              {editingAddressId ? 'Edit Delivery Address' : 'Add Delivery Address'}
            </h3>
            <form onSubmit={handleSaveAddressSubmit} className="space-y-3">
              {/* Address Type Selector */}
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setAddrLabel(lbl)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                      addrLabel === lbl
                        ? 'bg-[#25282D] border-[#D6B98C] text-[#D6B98C]'
                        : 'bg-[#17191C] border-[#343940] text-[#8E959E]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Full Name *"
                required
                value={addrName}
                onChange={(e) => setAddrName(e.target.value)}
                className="w-full bg-[#17191C] border border-[#343940] p-2.5 rounded-lg text-[#F2F0EA]"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                required
                value={addrPhone}
                onChange={(e) => setAddrPhone(e.target.value)}
                className="w-full bg-[#17191C] border border-[#343940] p-2.5 rounded-lg text-[#F2F0EA]"
              />
              <input
                type="text"
                placeholder="House No., Building, Street *"
                required
                value={addrLine1}
                onChange={(e) => setAddrLine1(e.target.value)}
                className="w-full bg-[#17191C] border border-[#343940] p-2.5 rounded-lg text-[#F2F0EA]"
              />
              <input
                type="text"
                placeholder="Landmark / Area (Optional)"
                value={addrLine2}
                onChange={(e) => setAddrLine2(e.target.value)}
                className="w-full bg-[#17191C] border border-[#343940] p-2.5 rounded-lg text-[#F2F0EA]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit PIN *"
                  required
                  value={addrPin}
                  onChange={(e) => handleAddressPinChange(e.target.value)}
                  className="bg-[#17191C] border border-[#343940] p-2.5 rounded-lg text-[#F2F0EA] font-mono"
                />
                <input
                  type="text"
                  placeholder="City *"
                  required
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="bg-[#17191C] border border-[#343940] p-2.5 rounded-lg text-[#F2F0EA]"
                />
              </div>
              <input
                type="text"
                placeholder="State *"
                required
                value={addrState}
                onChange={(e) => setAddrState(e.target.value)}
                className="w-full bg-[#17191C] border border-[#343940] p-2.5 rounded-lg text-[#F2F0EA]"
              />

              <label className="flex items-center gap-2 text-[#B7BCC2] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="accent-[#D6B98C]"
                />
                <span>Make this my primary fitment address</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-3 py-2 text-[#8E959E] hover:text-[#F2F0EA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAddr}
                  className="px-4 py-2 bg-[#D6B98C] hover:bg-[#E3CDA7] disabled:opacity-60 text-[#17191C] font-bold rounded-lg"
                >
                  {savingAddr ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90dvh] overflow-y-auto text-xs space-y-4">
            <div className="flex justify-between items-start border-b border-[#25282D] pb-4">
              <div>
                <span className="font-mono text-sm font-bold text-[#D6B98C]">
                  TAX INVOICE · {invoiceOrder.id}
                </span>
                <p className="text-[#8E959E] text-[11px] mt-0.5">
                  GSTIN: 27AABCK9821L1Z0 · KINETIX Power Technologies
                </p>
              </div>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="text-[#8E959E] hover:text-[#F2F0EA]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[#B7BCC2]">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="text-[#F2F0EA] font-semibold">
                  {invoiceOrder.shippingAddress.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="text-[#F2F0EA] text-right">
                  {invoiceOrder.shippingAddress.city}, {invoiceOrder.shippingAddress.state} -{' '}
                  {invoiceOrder.shippingAddress.pinCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="text-[#D6B98C] font-mono">
                  {invoiceOrder.paymentMethod} ({invoiceOrder.paymentStatus})
                </span>
              </div>
            </div>

            <div className="border-t border-[#25282D] pt-3 space-y-2">
              {invoiceOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {it.product.name} (x{it.quantity})
                  </span>
                  <span className="font-mono text-[#F2F0EA]">
                    ₹{(it.priceAtPurchase * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-[#8E959E]">
                <span>18% Integrated GST</span>
                <span className="font-mono">₹{invoiceOrder.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#F2F0EA] border-t border-[#25282D] pt-2">
                <span>Total Invoice Value</span>
                <span className="text-[#D6B98C] font-mono">
                  ₹{invoiceOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Invoice downloaded to PDF format.');
                setInvoiceOrder(null);
              }}
              className="w-full py-2.5 bg-[#D6B98C] text-[#17191C] font-bold rounded-lg flex items-center justify-center gap-2 mt-4"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Tax Invoice</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
