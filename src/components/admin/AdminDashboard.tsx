import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Shield,
  Search,
  Eye,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory, BatteryTechnology, OrderStatus } from '../../types';
import defaultBatteryImg from '../../assets/images/hero_battery_titanium_1794476148118.jpg';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    appliedCoupon,
    showToast,
    navigate,
    pageParams,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'settings'>(
    pageParams?.tab || 'overview'
  );

  useEffect(() => {
    if (pageParams?.tab) {
      setActiveTab(pageParams.tab);
    }
  }, [pageParams?.tab]);

  const handleAdminTabChange = (
    tab: 'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'settings'
  ) => {
    setActiveTab(tab);
    navigate('admin', { tab }, { replace: true, skipScroll: true });
  };

  // Search & filter in product management
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('KINETIX');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('car');
  const [newProdPrice, setNewProdPrice] = useState(8999);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(10999);
  const [newProdAh, setNewProdAh] = useState(65);
  const [newProdVoltage, setNewProdVoltage] = useState('12V');
  const [newProdTech, setNewProdTech] = useState<BatteryTechnology>('Pure Lead AGM');
  const [newProdWarranty, setNewProdWarranty] = useState(60);
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Coupon Manager state
  const [couponsList, setCouponsList] = useState([
    { code: 'VOLT15', discount: 15, max: 2500, min: 4000, active: true },
    { code: 'TITANIUM', discount: 20, max: 5000, min: 10000, active: true },
    { code: 'FREESHIP', discount: 5, max: 1000, min: 2000, active: true },
    { code: 'SOLAR5000', discount: 25, max: 8000, min: 25000, active: true },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDisc, setNewCouponDisc] = useState(10);

  // Revenue analytics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 148200; // includes past month base
  const totalOrderCount = orders.length + 38;
  const lowStockProducts = products.filter((p) => p.stockCount <= 15);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addProduct({
      name: newProdName.trim(),
      brand: newProdBrand,
      category: newProdCategory,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      discountPercent: Math.round(
        ((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100
      ),
      rating: 5.0,
      reviewCount: 1,
      inStock: newProdStock > 0,
      stockCount: Number(newProdStock),
      images: [defaultBatteryImg],
      capacityAh: Number(newProdAh),
      voltage: newProdVoltage,
      technology: newProdTech,
      warrantyMonths: Number(newProdWarranty),
      dimensions: '280 × 175 × 190 mm',
      weightKg: 18.5,
      description: newProdDesc || 'Precision engineered battery with active internal protection.',
      highlights: [
        'Direct factory sealed casing',
        'High temperature resistance matrix',
        'Pre-charged ready for immediate fitment',
      ],
      technicalSpecs: {
        Voltage: newProdVoltage,
        Capacity: `${newProdAh} Ah`,
        Technology: newProdTech,
      },
    });

    setIsAddProductOpen(false);
    setNewProdName('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCouponCode.trim()) {
      setCouponsList([
        ...couponsList,
        {
          code: newCouponCode.trim().toUpperCase(),
          discount: Number(newCouponDisc),
          max: 3000,
          min: 3000,
          active: true,
        },
      ]);
      setNewCouponCode('');
      showToast('Campaign coupon activated successfully.');
    }
  };

  return (
    <div className="bg-[#17191C] min-h-screen py-8 border-b border-[#25282D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Navigation Top Header */}
        <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-5 sm:p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 shadow-xl">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#25282D] border border-[#D6B98C]/30 flex items-center justify-center text-[#D6B98C] shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-[#F2F0EA]">KINETIX Central Admin Panel</span>
                <span className="text-[10px] font-mono bg-[#25282D] text-[#D6B98C] px-2 py-0.5 rounded border border-[#343940]">
                  ROLE: SUPER_ADMIN
                </span>
              </div>
              <p className="text-xs text-[#8E959E] mt-0.5">
                Full CRUD control over catalog, inventory, order processing, and coupons
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('home')}
            className="w-full md:w-auto min-h-[40px] px-4 py-2 bg-[#25282D] hover:bg-[#343940] text-[#F2F0EA] border border-[#343940] text-xs font-semibold rounded-lg text-center"
          >
            ← Exit to Customer Storefront
          </button>
        </div>

        {/* Admin Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#25282D] pb-4 mb-8 overflow-x-auto no-scrollbar text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: LayoutDashboard },
            { id: 'products', label: 'Product Inventory', icon: Package },
            { id: 'orders', label: 'Order Processing', icon: ShoppingBag },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'coupons', label: 'Marketing & Coupons', icon: Tag },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleAdminTabChange(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#D6B98C] text-[#17191C] font-bold'
                    : 'text-[#B7BCC2] hover:text-[#F2F0EA] bg-[#101214] border border-[#25282D]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#101214] border border-[#25282D] p-6 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-[#8E959E] font-mono">
                  <span>TOTAL GROSS REVENUE</span>
                  <DollarSign className="w-4 h-4 text-[#D6B98C]" />
                </div>
                <div className="text-3xl font-bold font-mono text-[#F2F0EA] mt-2 tabular-nums">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#D6B98C] mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+28.4% month-over-month growth</span>
                </div>
              </div>

              <div className="bg-[#101214] border border-[#25282D] p-6 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-[#8E959E] font-mono">
                  <span>TOTAL FULFILLED ORDERS</span>
                  <ShoppingBag className="w-4 h-4 text-[#D6B98C]" />
                </div>
                <div className="text-3xl font-bold font-mono text-[#F2F0EA] mt-2 tabular-nums">
                  {totalOrderCount} Orders
                </div>
                <div className="text-[11px] text-[#8E959E] mt-2">
                  98.2% on-time 4-hour doorstep delivery rate
                </div>
              </div>

              <div className="bg-[#101214] border border-[#25282D] p-6 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-[#8E959E] font-mono">
                  <span>ACTIVE CATALOG SKUS</span>
                  <Package className="w-4 h-4 text-[#D6B98C]" />
                </div>
                <div className="text-3xl font-bold font-mono text-[#F2F0EA] mt-2 tabular-nums">
                  {products.length} Models
                </div>
                <div className="text-[11px] text-[#8E959E] mt-2">
                  Across 8 certified battery categories
                </div>
              </div>

              <div className="bg-[#101214] border border-[#25282D] p-6 rounded-2xl">
                <div className="flex items-center justify-between text-xs text-[#8E959E] font-mono">
                  <span>LOW INVENTORY ALERTS</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-amber-400 mt-2 tabular-nums">
                  {lowStockProducts.length} Items
                </div>
                <div className="text-[11px] text-[#8E959E] mt-2">
                  Stock quantity &le; 15 units available
                </div>
              </div>
            </div>

            {/* Sales Graph SVG Visualization */}
            <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#F2F0EA]">Revenue & Battery Volume Trend</h3>
                  <p className="text-xs text-[#8E959E]">
                    Daily sales distribution across Indian metro fulfillment centers
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-[#8E959E]">
                  <span className="flex items-center gap-1.5 text-[#D6B98C]">
                    <span className="w-2.5 h-2.5 bg-[#D6B98C] rounded-sm"></span>
                    <span>Revenue (₹ Lacs)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#A87555]">
                    <span className="w-2.5 h-2.5 bg-[#A87555] rounded-sm"></span>
                    <span>Units Dispatched</span>
                  </span>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="overflow-x-auto no-scrollbar pb-2">
                <div className="h-52 min-w-[480px] w-full">
                  <svg className="w-full h-full" viewBox="0 0 700 185">
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="700" y2="40" stroke="#25282D" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="700" y2="80" stroke="#25282D" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="700" y2="120" stroke="#25282D" strokeDasharray="3 3" />
                  <line x1="0" y1="155" x2="700" y2="155" stroke="#343940" />

                  {/* Bars & Labels */}
                  {[
                    { label: 'Mon', revH: 70, unitH: 45, x: 50 },
                    { label: 'Tue', revH: 95, unitH: 60, x: 150 },
                    { label: 'Wed', revH: 80, unitH: 52, x: 250 },
                    { label: 'Thu', revH: 120, unitH: 85, x: 350 },
                    { label: 'Fri', revH: 140, unitH: 92, x: 450 },
                    { label: 'Sat', revH: 110, unitH: 75, x: 550 },
                    { label: 'Sun', revH: 85, unitH: 58, x: 650 },
                  ].map((bar, i) => (
                    <g key={i}>
                      {/* Revenue Bar */}
                      <rect
                        x={bar.x - 16}
                        y={155 - bar.revH}
                        width="14"
                        height={bar.revH}
                        rx="3"
                        fill="#D6B98C"
                        opacity="0.9"
                      />
                      {/* Units Bar */}
                      <rect
                        x={bar.x + 2}
                        y={155 - bar.unitH}
                        width="14"
                        height={bar.unitH}
                        rx="3"
                        fill="#A87555"
                        opacity="0.8"
                      />
                      {/* Day Label */}
                      <text
                        x={bar.x}
                        y="175"
                        textAnchor="middle"
                        fill="#8E959E"
                        fontSize="11"
                        fontFamily="monospace"
                      >
                        {bar.label}
                      </text>
                    </g>
                  ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Low Stock Warning Table */}
            <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6">
              <h3 className="text-base font-bold text-[#F2F0EA] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Low Stock Critical Reorder List</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#25282D] text-[#8E959E] font-mono uppercase">
                      <th className="py-3 px-4">Battery Model</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Remaining Units</th>
                      <th className="py-3 px-4 text-right">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#25282D]">
                    {lowStockProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#17191C]/50">
                        <td className="py-3 px-4 font-semibold text-[#F2F0EA]">{p.name}</td>
                        <td className="py-3 px-4 text-[#8E959E] uppercase font-mono">{p.category}</td>
                        <td className="py-3 px-4 font-mono text-[#D6B98C]">₹{p.price.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-amber-400">
                            {p.stockCount} units left
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              updateProduct({ ...p, stockCount: p.stockCount + 20 });
                            }}
                            className="px-2.5 py-1 bg-[#25282D] hover:bg-[#343940] text-[#D6B98C] rounded text-[11px] font-semibold"
                          >
                            + Restock 20
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCT MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#8E959E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search catalog products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[#101214] border border-[#25282D] text-xs text-[#F2F0EA] pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                />
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 bg-[#D6B98C] hover:bg-[#E3CDA7] text-[#17191C] font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Battery</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#101214] border border-[#25282D] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#25282D] bg-[#17191C]/60 text-[#8E959E] font-mono uppercase">
                      <th className="py-3.5 px-4">Battery</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Technology</th>
                      <th className="py-3.5 px-4">Ah / Voltage</th>
                      <th className="py-3.5 px-4">Price (INR)</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#25282D]">
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#17191C]/40">
                          <td className="py-3 px-4 font-semibold text-[#F2F0EA]">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images[0]}
                                alt=""
                                className="w-10 h-10 object-cover rounded bg-[#25282D]"
                              />
                              <div>
                                <div className="text-xs">{prod.name}</div>
                                <div className="text-[10px] text-[#8E959E] font-mono">
                                  {prod.brand}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[#8E959E] uppercase font-mono">
                            {prod.category}
                          </td>
                          <td className="py-3 px-4 text-[#B7BCC2]">{prod.technology}</td>
                          <td className="py-3 px-4 font-mono text-[#F2F0EA]">
                            {prod.capacityAh}Ah / {prod.voltage}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#D6B98C]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-mono text-xs font-bold ${
                                prod.stockCount <= 10 ? 'text-amber-400' : 'text-emerald-400'
                              }`}
                            >
                              {prod.stockCount} in stock
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                updateProduct({
                                  ...prod,
                                  price: prod.price + 500,
                                });
                              }}
                              title="Quick +₹500 Price Adjustment"
                              className="p-1.5 bg-[#25282D] text-[#D6B98C] rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              title="Delete Product"
                              className="p-1.5 bg-[#25282D] text-red-400 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDER PROCESSING TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#F2F0EA]">Order Lifecycle & Fulfillment</h2>
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="text-base font-bold text-[#F2F0EA] font-mono">
                        {ord.id}
                      </span>
                      <span className="text-xs font-mono bg-[#25282D] text-[#D6B98C] px-2.5 py-0.5 rounded">
                        {ord.status}
                      </span>
                      <span className="text-xs text-[#8E959E]">
                        {new Date(ord.date).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <p className="text-xs text-[#B7BCC2]">
                      Recipient: <strong className="text-[#F2F0EA]">{ord.shippingAddress.fullName}</strong> ·{' '}
                      {ord.shippingAddress.phone} ({ord.shippingAddress.city})
                    </p>

                    <div className="text-xs text-[#8E959E]">
                      {ord.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-bold font-mono text-[#D6B98C]">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-[#8E959E] font-mono">
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </div>
                    </div>

                    {/* Change Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          updateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className="bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-[#D6B98C]"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Quality Testing">Quality Testing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Return Requested">Return Requested</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F2F0EA]">Registered Battery Customers</h3>
            <div className="space-y-3">
              {[
                { name: 'Vikram Malhotra', email: 'vikram.m@example.com', orders: 3, spend: '₹28,497', city: 'Mumbai' },
                { name: 'Ananya Deshmukh', email: 'ananya.d@example.com', orders: 1, spend: '₹18,973', city: 'Bengaluru' },
                { name: 'Rajesh K. Nambiar', email: 'rajesh@apexlogistics.in', orders: 8, spend: '₹1,42,800', city: 'Pune' },
                { name: 'Dr. Shruti Somani', email: 'shruti@heliosclean.in', orders: 4, spend: '₹2,70,000', city: 'Bengaluru' },
              ].map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#17191C] border border-[#25282D] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#F2F0EA]">{c.name}</h4>
                    <p className="text-[#8E959E] break-all sm:break-normal">{c.email} · {c.city}</p>
                  </div>
                  <div className="text-left sm:text-right font-mono shrink-0">
                    <span className="text-[#D6B98C] font-bold block">{c.spend}</span>
                    <span className="text-[#8E959E]">{c.orders} Orders Placed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6">
              <h3 className="text-base font-bold text-[#F2F0EA] mb-4">Create New Discount Coupon</h3>
              <form onSubmit={handleCreateCoupon} className="flex flex-wrap gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. SUMMER20)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="bg-[#17191C] border border-[#343940] text-[#F2F0EA] px-3.5 py-2 rounded-lg font-mono"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={newCouponDisc}
                  onChange={(e) => setNewCouponDisc(Number(e.target.value))}
                  className="w-28 bg-[#17191C] border border-[#343940] text-[#F2F0EA] px-3.5 py-2 rounded-lg font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D6B98C] text-[#17191C] font-bold rounded-lg"
                >
                  Activate Promo Code
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {couponsList.map((cpn, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[#101214] border border-[#25282D] rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-sm text-[#D6B98C]">{cpn.code}</span>
                    <p className="text-[#8E959E] mt-0.5">{cpn.discount}% off · Min ₹{cpn.min.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 space-y-6 text-xs max-w-2xl">
            <h3 className="text-base font-bold text-[#F2F0EA]">Website & Commerce Configurations</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                  Razorpay & UPI Webhook Gateway Status
                </label>
                <div className="p-3 bg-[#17191C] border border-emerald-800/40 text-emerald-400 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Production Gateway Live (UPI, Cards, NetBanking, COD Verified)</span>
                </div>
              </div>

              <div>
                <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                  Free Doorstep Fitment Order Threshold (INR)
                </label>
                <input
                  type="number"
                  defaultValue={2500}
                  className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                  Goods & Services Tax (GST) Rate
                </label>
                <input
                  type="text"
                  defaultValue="18% Integrated GST (IGST/CGST/SGST)"
                  className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                  24x7 Roadside Battery Breakdown Hotline
                </label>
                <input
                  type="text"
                  defaultValue="1800 209 8899"
                  className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                />
              </div>

              <button
                onClick={() => showToast('Store settings saved successfully.')}
                className="px-5 py-2.5 bg-[#D6B98C] text-[#17191C] font-bold rounded-lg mt-4"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 max-w-lg w-full text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#F2F0EA]">Add New Battery to Catalog</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. KINETIX AEON 85Ah Heavy AGM"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg"
                  >
                    <option value="car">Car Batteries</option>
                    <option value="bike">Bike Batteries</option>
                    <option value="inverter">Inverter Batteries</option>
                    <option value="lithium">Lithium LiFePO4</option>
                    <option value="solar">Solar Batteries</option>
                    <option value="industrial">Industrial</option>
                    <option value="ups">UPS Batteries</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                    Capacity (Ah)
                  </label>
                  <input
                    type="number"
                    value={newProdAh}
                    onChange={(e) => setNewProdAh(Number(e.target.value))}
                    className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                    Voltage
                  </label>
                  <input
                    type="text"
                    value={newProdVoltage}
                    onChange={(e) => setNewProdVoltage(e.target.value)}
                    className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                    Warranty (M)
                  </label>
                  <input
                    type="number"
                    value={newProdWarranty}
                    onChange={(e) => setNewProdWarranty(Number(e.target.value))}
                    className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-[#17191C] border border-[#343940] text-[#F2F0EA] p-2.5 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-[#8E959E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D6B98C] text-[#17191C] font-bold rounded-lg"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
