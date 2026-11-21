export type ProductCategory =
  | 'car'
  | 'bike'
  | 'inverter'
  | 'lithium'
  | 'solar'
  | 'industrial'
  | 'ups'
  | 'accessories';

export type BatteryTechnology =
  | 'LiFePO4 Lithium'
  | 'Pure Lead AGM'
  | 'Tall Tubular'
  | 'Gel VRLA'
  | 'Heavy Cast Lead-Acid'
  | 'Lithium Nickel Cobalt';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number; // in INR
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  capacityAh: number;
  voltage: string; // e.g. "12V", "24V", "48V"
  technology: BatteryTechnology;
  warrantyMonths: number;
  dimensions: string; // e.g. "305 × 175 × 225 mm"
  weightKg: number;
  coldCrankingAmps?: number; // e.g. 720 CCA
  cycleLife?: string; // e.g. "6000 cycles @ 80% DoD"
  chargingTime?: string; // e.g. "2.5 Hours Fast Charge"
  compatibleVehicles?: string[];
  compatibleAppliances?: string[];
  description: string;
  highlights: string[];
  technicalSpecs: Record<string, string>;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  finishName?: string;
  finishFilter?: string;
  capacityLabel?: string;
  unitPrice?: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrder?: number;
  description: string;
}

export interface Address {
  id?: string;
  label?: 'Home' | 'Work' | 'Other';
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Processing'
  | 'Quality Testing'
  | 'Dispatched'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested';

export interface Order {
  id: string;
  userId?: string;
  date: string;
  items: {
    product: Product;
    quantity: number;
    priceAtPurchase: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending COD' | 'Refunded';
  shippingAddress: Address;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  returnReason?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: '' | 'Male' | 'Female' | 'Other';
  photoURL?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  author: string;
  rating: number;
  date: string;
  createdAtMs: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  vehicleOrApplication?: string;
  configuredVariant?: string;
  helpfulUserIds: string[];
  baseHelpfulCount?: number;
  source: 'firestore' | 'baseline';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  coverImage: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}
