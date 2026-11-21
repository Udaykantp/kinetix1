import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  ArrowRight,
  MapPin,
  Lock,
  Check,
  User as UserIcon,
  Plus,
  CloudUpload,
  Loader2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Address, Order } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    user,
    signInWithGoogle,
    placeOrder,
    linkGuestOrderToAccount,
    checkPincode,
    showToast,
    navigate,
  } = useStore();

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [orderLinked, setOrderLinked] = useState(false);
  const [linkingOrder, setLinkingOrder] = useState(false);

  // Steps: 1. Address, 3. Payment
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Saved address selection vs custom new address
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>(
    user?.addresses[0]?.id || 'new'
  );
  const [saveAddressToProfile, setSaveAddressToProfile] = useState<boolean>(true);
  const [addressLabel, setAddressLabel] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Address Form State
  const defaultAddr = user?.addresses[0];
  const [fullName, setFullName] = useState(defaultAddr?.fullName || user?.name || '');
  const [phone, setPhone] = useState(defaultAddr?.phone || user?.phone || '');
  const [email, setEmail] = useState(defaultAddr?.email || user?.email || '');
  const [addressLine1, setAddressLine1] = useState(defaultAddr?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(defaultAddr?.addressLine2 || '');
  const [city, setCity] = useState(defaultAddr?.city || 'Mumbai');
  const [state, setState] = useState(defaultAddr?.state || 'Maharashtra');
  const [pinCode, setPinCode] = useState(defaultAddr?.pinCode || '400050');

  // Auto-hydrate fields when a user signs in or saved addresses load from Firestore
  useEffect(() => {
    if (!user) return;
    if (user.addresses.length > 0 && selectedAddressId === 'new' && !addressLine1) {
      const primary = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      if (primary) {
        setSelectedAddressId(primary.id || 'new');
        setFullName(primary.fullName);
        setPhone(primary.phone);
        setEmail(primary.email || user.email);
        setAddressLine1(primary.addressLine1);
        setAddressLine2(primary.addressLine2 || '');
        setCity(primary.city);
        setState(primary.state);
        setPinCode(primary.pinCode);
        return;
      }
    }
    if (!fullName && user.name) setFullName(user.name);
    if (!phone && user.phone) setPhone(user.phone);
    if (!email && user.email) setEmail(user.email);
  }, [user?.id, user?.addresses.length]);

  // Delivery Speed
  const [deliverySpeed, setDeliverySpeed] = useState<'express' | 'standard'>('express');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery'
  >('UPI');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id || 'new');
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setEmail(addr.email || user?.email || '');
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city);
    setState(addr.state);
    setPinCode(addr.pinCode);
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId('new');
    setFullName(user?.name || '');
    setPhone(user?.phone || '');
    setEmail(user?.email || '');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPinCode('');
  };

  const handlePincodeChange = (val: string) => {
    setPinCode(val);
    if (val.length === 6) {
      const info = checkPincode(val);
      if (info.deliverable && info.city) {
        setCity(info.city);
        setState(info.state);
      }
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim() || !addressLine1.trim() || !pinCode.trim()) {
      showToast('Please fill all mandatory shipping fields.', 'error');
      return;
    }
    if (phone.trim().length < 6) {
      showToast('Please enter a valid mobile number.', 'error');
      return;
    }
    setStep(3);
  };

  const handleFinalOrderSubmit = async () => {
    setIsProcessing(true);
    try {
      const shippingAddress: Address = {
        id: selectedAddressId !== 'new' ? selectedAddressId : undefined,
        label: addressLabel,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim() || 'Mumbai',
        state: state.trim() || 'Maharashtra',
        pinCode: pinCode.trim(),
      };

      const order = await placeOrder({
        shippingAddress,
        paymentMethod,
        deliverySpeed,
        saveAddressToProfile: Boolean(user && selectedAddressId === 'new' && saveAddressToProfile),
      });

      setConfirmedOrder(order);
      setOrderLinked(Boolean(order.userId));
    } catch (error) {
      console.error('Order placement failed:', error);
      showToast('Could not complete your order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLinkGuestOrderWithGoogle = async () => {
    if (!confirmedOrder) return;
    setLinkingOrder(true);
    try {
      let signedIn = Boolean(user);
      if (!signedIn) {
        signedIn = await signInWithGoogle({
          name: confirmedOrder.shippingAddress.fullName,
          phone: confirmedOrder.shippingAddress.phone,
        });
      }
      if (signedIn) {
        const linked = await linkGuestOrderToAccount(confirmedOrder);
        if (linked) {
          setOrderLinked(true);
        }
      }
    } finally {
      setLinkingOrder(false);
    }
  };

  // If order placed, show Confirmation Receipt View
  if (confirmedOrder) {
    return (
      <div className="bg-[#17191C] min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#D6B98C]/10 border border-[#D6B98C]/30 flex items-center justify-center mx-auto text-[#D6B98C]">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider">
                Order Confirmed · Ready for Dispatch
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F2F0EA] mt-1">
                Thank You, {confirmedOrder.shippingAddress.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-[#8E959E] mt-2">
                We have registered your direct manufacturer warranty under Order ID:
              </p>
              <div className="text-xl font-bold font-mono text-[#D6B98C] mt-2 bg-[#17191C] inline-block px-4 py-1.5 rounded-lg border border-[#343940]">
                {confirmedOrder.id}
              </div>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-[#17191C] border border-[#25282D] rounded-xl p-5 sm:p-6 text-left text-xs space-y-3">
              <div className="flex justify-between gap-4 border-b border-[#25282D] pb-3">
                <span className="text-[#8E959E] shrink-0">Carrier & Delivery Mode</span>
                <span className="text-[#F2F0EA] font-semibold text-right">
                  {confirmedOrder.carrier} ({confirmedOrder.estimatedDelivery})
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#25282D] pb-3">
                <span className="text-[#8E959E] shrink-0">Shipping Address</span>
                <span className="text-[#F2F0EA] font-semibold text-right max-w-xs">
                  {confirmedOrder.shippingAddress.addressLine1}, {confirmedOrder.shippingAddress.city}{' '}
                  - {confirmedOrder.shippingAddress.pinCode}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#25282D] pb-3">
                <span className="text-[#8E959E] shrink-0">Payment Method & Status</span>
                <span className="text-[#D6B98C] font-semibold text-right">
                  {confirmedOrder.paymentMethod} · {confirmedOrder.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between gap-4 pt-1 text-sm font-bold text-[#F2F0EA]">
                <span>Total Amount</span>
                <span className="text-[#D6B98C] font-mono">
                  ₹{confirmedOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Guest-to-Account Save Prompt */}
            {!orderLinked && (
              <div className="bg-[#17191C] border border-[#D6B98C]/35 rounded-xl p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-semibold text-[#F2F0EA]">
                    Save this order & digital warranty permanently
                  </div>
                  <p className="text-[#8E959E] text-[11px] mt-0.5">
                    Sign in with Google in 1 click to track, cancel, or claim warranty from any device.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={linkingOrder}
                  onClick={handleLinkGuestOrderWithGoogle}
                  className="px-4 py-2.5 bg-[#D6B98C] hover:bg-[#E3CDA7] disabled:opacity-60 text-[#17191C] font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 shrink-0"
                >
                  {linkingOrder ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CloudUpload className="w-3.5 h-3.5" />
                  )}
                  <span>{linkingOrder ? 'Saving...' : 'Sign In & Save Order'}</span>
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => navigate('tracking', { orderId: confirmedOrder.id })}
                className="w-full sm:w-auto px-6 py-3 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Track Live Delivery Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('account', { tab: 'orders' })}
                className="w-full sm:w-auto px-6 py-3 bg-[#25282D] hover:bg-[#343940] text-[#F2F0EA] border border-[#343940] font-semibold text-xs rounded-lg transition-colors"
              >
                Go to My Account Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-[#17191C] min-h-screen py-20 text-center">
        <h2 className="text-xl font-bold text-[#F2F0EA]">Your cart is empty</h2>
        <p className="text-xs text-[#8E959E] mt-2">Add batteries before proceeding to checkout.</p>
        <button
          onClick={() => navigate('shop')}
          className="mt-6 px-6 py-2.5 bg-[#D6B98C] text-[#17191C] text-xs font-semibold rounded-lg"
        >
          Browse Batteries
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#17191C] min-h-screen py-10 border-b border-[#25282D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 sm:mb-10 text-xs font-mono">
          <div
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 cursor-pointer ${
              step >= 1 ? 'text-[#D6B98C]' : 'text-[#8E959E]'
            }`}
          >
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px] font-bold shrink-0">
              1
            </span>
            <span>Delivery Address</span>
          </div>
          <span className="text-[#343940] hidden sm:inline">——</span>
          <div
            onClick={() => {
              if (fullName && phone && email && addressLine1 && pinCode) setStep(3);
            }}
            className={`flex items-center gap-2 cursor-pointer ${
              step >= 3 ? 'text-[#D6B98C]' : 'text-[#8E959E]'
            }`}
          >
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px] font-bold shrink-0">
              2
            </span>
            <span>Payment & Verification</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Checkout Form Left */}
          <div className="lg:col-span-7 space-y-6">
            {/* Flipkart-style Account Status Bar inside KINETIX UI */}
            <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#25282D] border border-[#343940] flex items-center justify-center text-[#D6B98C] shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-xs">
                  {user ? (
                    <>
                      <div className="text-[#D6B98C] font-mono text-[10px] uppercase">
                        Verified Account Signed In
                      </div>
                      <div className="text-[#F2F0EA] font-semibold truncate">
                        {user.name} · <span className="text-[#8E959E] font-normal">{user.email}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[#F2F0EA] font-semibold">
                        Ordering as Guest — Anyone Can Checkout Immediately
                      </div>
                      <div className="text-[#8E959E] text-[11px]">
                        Or sign in with Google to use saved addresses & sync order history.
                      </div>
                    </>
                  )}
                </div>
              </div>

              {!user && (
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="px-4 py-2 bg-[#25282D] hover:bg-[#343940] text-[#D6B98C] border border-[#D6B98C]/40 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                >
                  Sign In with Google
                </button>
              )}
            </div>

            {step === 1 ? (
              <form
                onSubmit={handleProceedToPayment}
                className="bg-[#101214] border border-[#25282D] rounded-2xl p-5 sm:p-8 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#25282D]">
                  <h2 className="text-base sm:text-lg font-bold text-[#F2F0EA] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D6B98C] shrink-0" />
                    <span>Doorstep Shipping & Fitment Address</span>
                  </h2>
                  <span className="text-xs text-[#8E959E] font-mono break-all sm:break-normal">
                    {user ? `${user.addresses.length} Saved` : 'Express Guest Checkout'}
                  </span>
                </div>

                {/* Saved Address Quick Selector for Signed-In Users */}
                {user && user.addresses.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-mono uppercase text-[#8E959E]">
                      Select a Saved Delivery Address
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {user.addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`text-left p-3.5 rounded-xl border transition-colors ${
                              isSelected
                                ? 'bg-[#17191C] border-[#D6B98C] text-[#F2F0EA]'
                                : 'bg-[#17191C]/50 border-[#25282D] text-[#8E959E] hover:border-[#343940]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-[#F2F0EA] truncate">
                                {addr.fullName}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#25282D] text-[#D6B98C]">
                                {addr.label || 'Home'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#B7BCC2] line-clamp-2">
                              {addr.addressLine1}, {addr.city} - {addr.pinCode}
                            </p>
                            <p className="text-[10px] text-[#8E959E] mt-1 font-mono">
                              {addr.phone}
                            </p>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={handleUseNewAddress}
                        className={`p-3.5 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${
                          selectedAddressId === 'new'
                            ? 'bg-[#17191C] border-[#D6B98C] text-[#D6B98C]'
                            : 'bg-[#17191C]/30 border-[#343940] text-[#8E959E] hover:text-[#F2F0EA]'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Deliver to a New Address</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#8E959E] uppercase font-mono text-[10px] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E959E] uppercase font-mono text-[10px] mb-1">
                      Mobile Phone (for technician dispatch) *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98201 44521"
                      className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#8E959E] uppercase font-mono text-[10px] mb-1">
                      Email Address (for Digital Warranty Certificate) *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="vikram.m@example.com"
                      className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#8E959E] uppercase font-mono text-[10px] mb-1">
                      Flat / House No. / Building / Street *
                    </label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      required
                      placeholder="Flat 402, Titanium Palms, Bandra West"
                      className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E959E] uppercase font-mono text-[10px] mb-1">
                      Landmark / Area (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Near Pali Hill Police Station"
                      className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E959E] uppercase font-mono text-[10px] mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      required
                      placeholder="400050"
                      className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E959E] uppercase font-mono text-[10px] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8E959E] uppercase font-mono text-[10px] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                    />
                  </div>
                </div>

                {/* Save Address Checkbox for Signed-In Users adding a New Address */}
                {user && selectedAddressId === 'new' && (
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#17191C] border border-[#25282D] rounded-xl p-3 text-xs">
                    <label className="flex items-center gap-2 text-[#B7BCC2] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveAddressToProfile}
                        onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                        className="accent-[#D6B98C]"
                      />
                      <span>Save this address to my profile for future orders</span>
                    </label>
                    {saveAddressToProfile && (
                      <div className="flex items-center gap-1.5">
                        {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setAddressLabel(lbl)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                              addressLabel === lbl
                                ? 'bg-[#25282D] border-[#D6B98C] text-[#D6B98C]'
                                : 'border-[#343940] text-[#8E959E]'
                            }`}
                          >
                            {lbl}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery Preference */}
                <div className="pt-4 border-t border-[#25282D]">
                  <label className="block text-xs font-bold text-[#F2F0EA] mb-3">
                    Select Fitment & Delivery Speed
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div
                      onClick={() => setDeliverySpeed('express')}
                      className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                        deliverySpeed === 'express'
                          ? 'bg-[#17191C] border-[#D6B98C] text-[#F2F0EA]'
                          : 'bg-[#17191C]/50 border-[#25282D] text-[#8E959E]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#D6B98C]">4-Hour Express Fitment</span>
                        <span className="font-mono text-[#F2F0EA]">FREE</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Technician arrives at your doorstep with portable tester and mounts new battery.
                      </p>
                    </div>

                    <div
                      onClick={() => setDeliverySpeed('standard')}
                      className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                        deliverySpeed === 'standard'
                          ? 'bg-[#17191C] border-[#D6B98C] text-[#F2F0EA]'
                          : 'bg-[#17191C]/50 border-[#25282D] text-[#8E959E]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#F2F0EA]">Standard Next-Day</span>
                        <span className="font-mono text-[#F2F0EA]">FREE</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Scheduled delivery slot of your choice.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Step 3: Payment Selection */
              <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-5 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#25282D]">
                  <h2 className="text-base sm:text-lg font-bold text-[#F2F0EA] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#D6B98C] shrink-0" />
                    <span>Select Payment Architecture</span>
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-[#D6B98C] hover:text-[#E3CDA7] font-mono self-start sm:self-auto"
                  >
                    Edit Shipping Address
                  </button>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                    { id: 'Card', label: 'Credit / Debit', icon: CreditCard },
                    { id: 'Net Banking', label: 'Net Banking', icon: Building },
                    { id: 'Cash on Delivery', label: 'COD / Doorstep', icon: Banknote },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs transition-colors ${
                          paymentMethod === method.id
                            ? 'bg-[#25282D] border-[#D6B98C] text-[#D6B98C] font-bold'
                            : 'bg-[#17191C] border-[#25282D] text-[#8E959E] hover:text-[#F2F0EA]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Method Details */}
                <div className="bg-[#17191C] border border-[#25282D] rounded-xl p-5">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-4 text-xs">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-36 h-36 bg-white p-2 rounded-lg flex items-center justify-center shrink-0">
                          <div className="w-full h-full border-2 border-black p-1 flex flex-col justify-between items-center text-black font-mono text-[9px] text-center">
                            <div className="w-full flex justify-between font-bold">
                              <span>■■■</span>
                              <span>■■■</span>
                            </div>
                            <div className="font-bold text-[10px]">
                              KINETIX UPI
                              <br />₹{cartTotal.toLocaleString('en-IN')}
                            </div>
                            <div className="w-full flex justify-between font-bold">
                              <span>■■■</span>
                              <span>■■■</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-[#F2F0EA] text-sm">
                            Scan QR with any UPI App
                          </h4>
                          <p className="text-[#8E959E] leading-relaxed">
                            Google Pay, PhonePe, Paytm, or BHIM. Zero payment gateway surcharge.
                          </p>
                          <div className="pt-2">
                            <label className="block text-[10px] text-[#8E959E] font-mono mb-1">
                              OR ENTER VPA / UPI ID
                            </label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="bg-[#101214] border border-[#343940] text-xs text-[#F2F0EA] px-3 py-1.5 rounded-lg w-full sm:w-64 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[#8E959E] font-mono text-[10px] mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-[#101214] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#8E959E] font-mono text-[10px] mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-[#101214] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[#8E959E] font-mono text-[10px] mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-[#101214] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Net Banking' && (
                    <div className="space-y-3 text-xs">
                      <label className="block text-[#8E959E] font-mono text-[10px]">
                        Select Indian Banking Institution
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-[#101214] border border-[#343940] text-xs text-[#F2F0EA] p-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                      >
                        <option value="HDFC Bank">HDFC Bank NetBanking</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'Cash on Delivery' && (
                    <div className="text-xs text-[#B7BCC2] space-y-2">
                      <p className="text-[#F2F0EA] font-semibold">
                        Pay upon doorstep verification and installation.
                      </p>
                      <p className="text-[#8E959E]">
                        Our field engineer carries UPI QR code, card swipe machine, and cash collection receipt.
                        An SMS OTP will be verified before releasing the battery.
                      </p>
                    </div>
                  )}
                </div>

                {/* Final Order Trigger */}
                <button
                  onClick={handleFinalOrderSubmit}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing Direct Manufacturer Order...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        Place Order & Confirm Fitment (₹{cartTotal.toLocaleString('en-IN')})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Mini Cart Summary */}
          <div className="lg:col-span-5 bg-[#101214] border border-[#25282D] rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-[#F2F0EA] pb-3 border-b border-[#25282D]">
              Order Items ({cart.length})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-12 object-cover rounded bg-[#25282D] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#F2F0EA] truncate">{item.product.name}</h4>
                    <span className="text-[#8E959E] font-mono">
                      Qty: {item.quantity} · {item.product.voltage}
                    </span>
                  </div>
                  <div className="text-right font-mono text-[#D6B98C] font-semibold">
                    ₹{((item.unitPrice ?? item.product.price) * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#8E959E] border-t border-[#25282D] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#F2F0EA] font-mono">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#D6B98C]">
                  <span>Discount ({appliedCoupon?.code})</span>
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
                <span>Doorstep Fitment</span>
                <span className="text-[#F2F0EA] font-mono">
                  {cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#F2F0EA] pt-3 border-t border-[#25282D]">
                <span>Total Due</span>
                <span className="text-[#D6B98C] font-mono">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#8E959E] space-y-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B98C]" />
                <span>Encrypted 256-bit payment transaction</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B98C]" />
                <span>On-site alternator & battery conductance test included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
