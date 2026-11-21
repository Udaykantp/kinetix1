import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const { getOrderById, orders, pageParams, showToast, navigate } = useStore();
  const [searchId, setSearchId] = useState(pageParams?.orderId || orders[0]?.id || 'KTX-89214');
  const [activeOrder, setActiveOrder] = useState(() => getOrderById(searchId) || orders[0]);

  useEffect(() => {
    const targetId = pageParams?.orderId || activeOrder?.id;
    if (targetId) {
      if (pageParams?.orderId) setSearchId(pageParams.orderId);
      const found = getOrderById(targetId);
      if (found) {
        setActiveOrder(found);
      }
    }
  }, [pageParams?.orderId, orders]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      const found = getOrderById(searchId.trim());
      if (found) {
        setActiveOrder(found);
        navigate('tracking', { orderId: found.id }, { replace: true, skipScroll: true });
      } else {
        showToast('Order ID not found in tracking registry. Try KTX-89214 or KTX-94812.', 'error');
      }
    }
  };

  const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
    {
      status: 'Order Placed',
      label: 'Order Verified',
      desc: 'Payment captured and scheduled for laboratory dispatch.',
    },
    {
      status: 'Quality Testing',
      label: 'Conductance Quality Test',
      desc: 'Terminal voltage checked (12.8V+), specific gravity & cold cranking tested.',
    },
    {
      status: 'Dispatched',
      label: 'Dispatched in Heavy Crate',
      desc: 'En route in shock-absorbing vehicle with verified courier.',
    },
    {
      status: 'Out for Delivery',
      label: 'Technician Assigned',
      desc: 'Field engineer dispatched with multimeter & mounting toolkit.',
    },
    {
      status: 'Delivered',
      label: 'Mounted & Warranty Active',
      desc: 'Installed at doorstep and digital warranty certificate registered.',
    },
  ];

  const getStepIndex = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case 'Order Placed':
        return 0;
      case 'Processing':
      case 'Quality Testing':
        return 1;
      case 'Dispatched':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
      case 'Return Requested':
        return 4;
      case 'Cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const currentIndex = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="bg-[#17191C] min-h-screen py-12 border-b border-[#25282D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-xs font-mono text-[#D6B98C] uppercase tracking-wider mb-2">
            Real-Time Logistics Telematics
          </div>
          <h1 className="text-3xl font-bold text-[#F2F0EA]">Live Battery Order Tracking</h1>
          <p className="text-xs sm:text-sm text-[#8E959E] mt-2">
            Track door-to-door delivery, technician assignment, and pre-fitment conductance testing logs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-5 mb-8 shadow-xl">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8E959E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. KTX-89214, KTX-94812)..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#D6B98C] font-mono min-h-[44px]"
              />
            </div>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-3 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-bold text-xs rounded-lg transition-all whitespace-nowrap active:scale-95"
            >
              Track Order
            </button>
          </form>

          {/* Quick chip examples */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-[#8E959E]">
            <span>{orders.length > 0 ? 'Your Orders:' : 'Sample Tracking IDs:'}</span>
            {(orders.length > 0 ? orders.slice(0, 4).map((o) => o.id) : ['KTX-89214', 'KTX-94812']).map((oid) => (
              <button
                key={oid}
                onClick={() => {
                  const found = getOrderById(oid);
                  setSearchId(oid);
                  if (found) setActiveOrder(found);
                  navigate('tracking', { orderId: oid }, { replace: true, skipScroll: true });
                }}
                className="font-mono text-[#D6B98C] hover:underline"
              >
                {oid}
              </button>
            ))}
          </div>
        </div>

        {activeOrder && (
          <div className="space-y-6">
            {/* Top Order Overview Banner */}
            <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#D6B98C]">
                  <span>CARRIER: {activeOrder.carrier}</span>
                  <span aria-hidden="true">·</span>
                  <span>TRACKING: {activeOrder.trackingNumber}</span>
                </div>
                <h2 className="text-2xl font-bold text-[#F2F0EA] mt-1 font-mono">
                  {activeOrder.id}
                </h2>
                <p className="text-xs text-[#B7BCC2] mt-1">
                  Recipient: <strong className="text-[#F2F0EA]">{activeOrder.shippingAddress.fullName}</strong> (
                  {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.pinCode})
                </p>
              </div>

              <div className="bg-[#17191C] border border-[#343940] p-4 rounded-xl text-left md:text-right">
                <div className="text-[10px] font-mono text-[#8E959E] uppercase">
                  Current Fulfillment Status
                </div>
                <div className="text-sm font-bold text-[#D6B98C] font-mono mt-0.5">
                  {activeOrder.status}
                </div>
                <div className="text-[11px] text-[#8E959E] mt-0.5">
                  Est: {activeOrder.estimatedDelivery}
                </div>
              </div>
            </div>

            {/* Stepper Progression Visual */}
            <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#F2F0EA] mb-8">
                Delivery Progression Timeline
              </h3>

              <div className="relative">
                {/* Horizontal progress bar background */}
                <div className="hidden md:block absolute top-4 left-6 right-6 h-0.5 bg-[#25282D] z-0" />
                <div
                  className="hidden md:block absolute top-4 left-6 h-0.5 bg-[#D6B98C] transition-all duration-500 z-0"
                  style={{ width: `${(currentIndex / (STEPS.length - 1)) * 90}%` }}
                />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
                  {STEPS.map((step, idx) => {
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div key={idx} className="flex md:flex-col items-start md:items-center gap-4 md:gap-2 text-left md:text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border-2 transition-colors ${
                            isDone
                              ? 'bg-[#D6B98C] border-[#D6B98C] text-[#17191C]'
                              : 'bg-[#17191C] border-[#343940] text-[#8E959E]'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div>
                          <h4
                            className={`text-xs font-bold leading-tight ${
                              isCurrent ? 'text-[#D6B98C]' : isDone ? 'text-[#F2F0EA]' : 'text-[#8E959E]'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-[#8E959E] mt-1 leading-snug">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Event Log */}
            <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#F2F0EA] mb-6">
                Laboratory & Field Telematics Log
              </h3>

              <div className="space-y-4">
                {activeOrder.statusHistory.map((hist, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-3.5 bg-[#17191C] border border-[#25282D] rounded-xl text-xs"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#D6B98C] shrink-0 mt-1.5" />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold text-[#F2F0EA]">{hist.status}</span>
                        <span className="text-[11px] text-[#8E959E] font-mono">{hist.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#B7BCC2] mt-1">{hist.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technician contact helpline */}
              <div className="mt-8 pt-6 border-t border-[#25282D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E959E]">
                <span>Need to reschedule your doorstep installation slot?</span>
                <a
                  href="tel:18002098899"
                  className="px-4 py-2 bg-[#25282D] hover:bg-[#343940] text-[#D6B98C] rounded-lg border border-[#343940] flex items-center gap-2 font-semibold"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Dispatch Desk: 1800 209 8899</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
