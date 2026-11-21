import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import {
  Product,
  CartItem,
  Coupon,
  Order,
  OrderStatus,
  User,
  Address,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data/products';
import {
  PageType,
  buildUrlFromRoute,
  getCurrentRouteFromWindow,
} from '../utils/router';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';

export type { PageType };

export interface NavigateOptions {
  replace?: boolean;
  skipScroll?: boolean;
}

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface ProfileUpdateInput {
  name: string;
  phone: string;
  gender: '' | 'Male' | 'Female' | 'Other';
}

export interface AddressSaveInput {
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

interface StoreContextType {
  // Navigation
  page: PageType;
  pageParams: Record<string, any>;
  navigate: (newPage: PageType, params?: Record<string, any>, options?: NavigateOptions) => void;
  getRouteUrl: (targetPage: PageType, params?: Record<string, any>) => string;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    options?: {
      finishName?: string;
      finishFilter?: string;
      capacityLabel?: string;
      unitPrice?: number;
    }
  ) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  moveAllWishlistToCart: () => void;
  isInWishlist: (productId: string) => boolean;

  // Comparison
  comparisonList: Product[];
  addToComparison: (product: Product) => boolean;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;

  // User & Firebase Auth
  user: User | null;
  authLoading: boolean;
  signInWithGoogle: (prefill?: { name?: string; phone?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: ProfileUpdateInput) => Promise<void>;
  saveAddress: (address: AddressSaveInput) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Orders (Firestore for signed-in users + localStorage for guests)
  orders: Order[];
  placeOrder: (details: {
    shippingAddress: Address;
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
    deliverySpeed?: 'express' | 'standard';
    saveAddressToProfile?: boolean;
  }) => Promise<Order>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  requestOrderReturn: (orderId: string, reason: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  linkGuestOrderToAccount: (order: Order) => Promise<boolean>;
  getOrderById: (orderId: string) => Order | undefined;

  // Quick View
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;

  // Utilities
  checkPincode: (pin: string) => {
    deliverable: boolean;
    city: string;
    state: string;
    estimateDays: number;
    expressAvailable: boolean;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const BOOTSTRAPPED_ADMIN_EMAIL = 'udaykantp9199@gmail.com';
const GUEST_ORDERS_KEY = 'kinetix_guest_orders';

const SAMPLE_TRACKING_ORDERS: Order[] = [
  {
    id: 'KTX-89214',
    date: '2026-03-01T10:15:00Z',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        priceAtPurchase: 9499,
      },
    ],
    subtotal: 9499,
    tax: 1709,
    discount: 1424,
    shipping: 0,
    total: 9784,
    status: 'Delivered',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    shippingAddress: {
      fullName: 'Vikram Malhotra',
      phone: '+91 98201 44521',
      email: 'vikram.m@example.com',
      addressLine1: 'Flat 402, Titanium Palms, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400050',
    },
    trackingNumber: 'BLUEDART-KTX-90812',
    carrier: 'Blue Dart Smart Velocity',
    estimatedDelivery: 'Delivered on March 02, 2026',
    statusHistory: [
      {
        status: 'Order Placed',
        timestamp: 'March 01, 2026 - 10:15 AM',
        note: 'Payment verified via Razorpay UPI.',
      },
      {
        status: 'Quality Testing',
        timestamp: 'March 01, 2026 - 11:30 AM',
        note: 'Terminal voltage tested at 12.82V. Impedance verified.',
      },
      {
        status: 'Dispatched',
        timestamp: 'March 01, 2026 - 02:45 PM',
        note: 'Handed to express logistics hub with tamper-proof foam crate.',
      },
      {
        status: 'Out for Delivery',
        timestamp: 'March 02, 2026 - 09:20 AM',
        note: 'Technician Rajesh assigned with digital installation kit.',
      },
      {
        status: 'Delivered',
        timestamp: 'March 02, 2026 - 11:45 AM',
        note: 'Installed in Hyundai Creta with 60M warranty registered.',
      },
    ],
  },
  {
    id: 'KTX-94812',
    date: '2026-03-08T14:30:00Z',
    items: [
      {
        product: INITIAL_PRODUCTS[5],
        quantity: 1,
        priceAtPurchase: 16899,
      },
      {
        product: INITIAL_PRODUCTS[11],
        quantity: 1,
        priceAtPurchase: 1299,
      },
    ],
    subtotal: 18198,
    tax: 3275,
    discount: 2500,
    shipping: 0,
    total: 18973,
    status: 'Dispatched',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    shippingAddress: {
      fullName: 'Ananya Deshmukh',
      phone: '+91 98450 12894',
      email: 'ananya.d@example.com',
      addressLine1: 'Villa 18, Green Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560066',
    },
    trackingNumber: 'DELHIVERY-KTX-33109',
    carrier: 'Delhivery Heavy Cargo Express',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    statusHistory: [
      {
        status: 'Order Placed',
        timestamp: 'March 08, 2026 - 02:30 PM',
        note: 'Order placed with HDFC Platinum Credit Card.',
      },
      {
        status: 'Processing',
        timestamp: 'March 08, 2026 - 03:00 PM',
        note: 'Electrolyte gravity verified at 1.250 specific gravity.',
      },
      {
        status: 'Dispatched',
        timestamp: 'March 08, 2026 - 06:15 PM',
        note: 'Departed from Bengaluru Hub in specialized heavy cargo vehicle.',
      },
    ],
  },
];

// Recursively remove undefined fields before sending any nested payload to Firestore
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      if (v !== undefined) {
        cleaned[k] = stripUndefined(v);
      }
    }
    return cleaned as T;
  }
  return value;
}

function clampString(val: string | null | undefined, max: number, fallback = ''): string {
  const cleaned = (val ?? '').trim();
  if (!cleaned) return fallback;
  return cleaned.slice(0, max);
}

function sanitizeShippingAddress(addr: Address): Address {
  const result: Address = {
    fullName: clampString(addr.fullName, 100, 'Customer'),
    phone: clampString(addr.phone, 30, '0000000000').padEnd(6, '0'),
    email: clampString(addr.email, 200, ''),
    addressLine1: clampString(addr.addressLine1, 250, 'Address'),
    addressLine2: clampString(addr.addressLine2, 200, ''),
    city: clampString(addr.city, 80, 'Mumbai'),
    state: clampString(addr.state, 80, 'Maharashtra'),
    pinCode: clampString(addr.pinCode, 12, '400001'),
  };
  if (addr.id && /^[a-zA-Z0-9_-]{1,128}$/.test(addr.id)) {
    result.id = addr.id;
  }
  if (addr.label && ['Home', 'Work', 'Other'].includes(addr.label)) {
    result.label = addr.label;
  }
  if (typeof addr.isDefault === 'boolean') {
    result.isDefault = addr.isDefault;
  }
  return result;
}

const INITIAL_PRODUCTS_BY_ID = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));

function repairProductImages(product: Product): Product {
  if (!product || !product.id) return product;
  const seed = INITIAL_PRODUCTS_BY_ID.get(product.id);
  const currentImages = Array.isArray(product.images) ? product.images : [];
  const hasStaleSrcPath =
    currentImages.length === 0 ||
    currentImages.some((src) => typeof src !== 'string' || src.startsWith('/src/assets/'));

  if (hasStaleSrcPath && seed) {
    return { ...product, images: seed.images };
  }
  return product;
}

function loadGuestOrders(): Order[] {
  try {
    const saved = localStorage.getItem(GUEST_ORDERS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((order: Order) => ({
          ...order,
          items: Array.isArray(order.items)
            ? order.items.map((item) => ({
                ...item,
                product: repairProductImages(item.product),
              }))
            : [],
        }));
      }
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveGuestOrders(ordersList: Order[]) {
  try {
    localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(ordersList));
  } catch (e) {
    console.error(e);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state initialized synchronously from browser URL for instant deep-link rendering
  const [initialRoute] = useState(() => getCurrentRouteFromWindow());
  const [page, setPage] = useState<PageType>(initialRoute.page);
  const [pageParams, setPageParams] = useState<Record<string, any>>(initialRoute.params);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const repaired = parsed.map(repairProductImages);
          const existingIds = new Set(repaired.map((p) => p.id));
          const missingSeed = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
          return missingSeed.length > 0 ? [...repaired, ...missingSeed] : repaired;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kinetix_products', JSON.stringify(products));
    } catch {
      // Ignore storage quota or restricted iframe errors
    }
  }, [products]);

  const productsRef = useRef(products);
  productsRef.current = products;

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed
            .filter((item) => item && item.product && item.product.id)
            .map((item: CartItem) => ({
              ...item,
              product: repairProductImages(item.product),
            }));
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const safeCart: CartItem[] = [];
    if (INITIAL_PRODUCTS[0]) safeCart.push({ product: INITIAL_PRODUCTS[0], quantity: 1 });
    if (INITIAL_PRODUCTS[15]) safeCart.push({ product: INITIAL_PRODUCTS[15], quantity: 1 });
    return safeCart;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kinetix_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage quota or restricted iframe errors
    }
  }, [cart]);

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(INITIAL_COUPONS[0]);

  // Wishlist (synced to Firestore when signed in, localStorage when guest)
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kinetix_wishlist');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((p) => p && p.id)
            .map(repairProductImages)
            .slice(0, 50);
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const wishlistRef = useRef(wishlist);
  wishlistRef.current = wishlist;

  useEffect(() => {
    try {
      localStorage.setItem('kinetix_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore storage quota or restricted iframe errors
    }
  }, [wishlist]);

  // Comparison
  const [comparisonList, setComparisonList] = useState<Product[]>(() => {
    return INITIAL_PRODUCTS.slice(0, 2);
  });

  // Firebase Auth & Firestore User State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [firestoreOrders, setFirestoreOrders] = useState<Order[]>([]);
  const [guestOrders, setGuestOrders] = useState<Order[]>(() => loadGuestOrders());

  // Combined visible orders: Firestore orders when signed in (+ any unlinked guest orders), or guest orders when signed out
  const orders: Order[] = React.useMemo(() => {
    if (!firebaseUser) {
      return guestOrders;
    }
    const seen = new Set(firestoreOrders.map((o) => o.id));
    const merged = [
      ...firestoreOrders,
      ...guestOrders.filter((g) => !seen.has(g.id)),
    ];
    return merged.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [firebaseUser, firestoreOrders, guestOrders]);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Ensure /users/{uid} profile doc exists in Firestore
  const ensureUserProfileDoc = useCallback(
    async (
      fbUser: FirebaseUser,
      prefill?: { name?: string; phone?: string }
    ): Promise<void> => {
      const userRef = doc(db, 'users', fbUser.uid);
      try {
        const snap = await getDoc(userRef);
        const safeEmail = clampString(fbUser.email, 200, 'user@example.com');
        const safeName = clampString(
          prefill?.name || fbUser.displayName || safeEmail.split('@')[0],
          100,
          'Customer'
        );
        const safePhone = clampString(prefill?.phone || fbUser.phoneNumber || '', 30, '');

        if (!snap.exists()) {
          const initialWishlistIds = wishlistRef.current
            .map((p) => p.id)
            .filter((id) => typeof id === 'string' && id.length <= 128)
            .slice(0, 50);

          await setDoc(userRef, {
            uid: fbUser.uid,
            name: safeName,
            email: safeEmail,
            phone: safePhone,
            gender: '',
            role: 'customer',
            wishlistIds: initialWishlistIds,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          const existingData = snap.data();

          // Merge any locally hearted guest items into cloud wishlist (capped at 50)
          const existingIds: string[] = Array.isArray(existingData.wishlistIds)
            ? existingData.wishlistIds.filter((id: unknown): id is string => typeof id === 'string')
            : [];
          const localIds = wishlistRef.current
            .map((p) => p.id)
            .filter((id) => typeof id === 'string' && id.length <= 128);
          const mergedIds = Array.from(new Set([...existingIds, ...localIds])).slice(0, 50);

          if (mergedIds.length !== existingIds.length) {
            await updateDoc(userRef, {
              wishlistIds: mergedIds,
              updatedAt: serverTimestamp(),
            });
          }

          if (prefill && (prefill.name?.trim() || prefill.phone?.trim())) {
            const nextName = clampString(prefill.name || existingData.name, 100, 'Customer');
            const nextPhone = clampString(prefill.phone || existingData.phone, 30, '');
            const nextGender = (['', 'Male', 'Female', 'Other'].includes(existingData.gender)
              ? existingData.gender
              : '') as '' | 'Male' | 'Female' | 'Other';

            await updateDoc(userRef, {
              name: nextName,
              phone: nextPhone,
              gender: nextGender,
              updatedAt: serverTimestamp(),
            });
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${fbUser.uid}`);
      }
    },
    []
  );

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setFirestoreOrders([]);
        setAuthLoading(false);
        return;
      }

      // Optimistically set basic profile while Firestore listeners attach
      const effectiveRole: 'customer' | 'admin' =
        fbUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL ? 'admin' : 'customer';

      setUser((prev) => ({
        id: fbUser.uid,
        name: prev?.id === fbUser.uid ? prev.name : fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer',
        email: fbUser.email || '',
        phone: prev?.id === fbUser.uid ? prev.phone : fbUser.phoneNumber || '',
        gender: prev?.id === fbUser.uid ? prev.gender : '',
        photoURL: fbUser.photoURL || undefined,
        role: effectiveRole,
        addresses: prev?.id === fbUser.uid ? prev.addresses : [],
      }));

      try {
        await ensureUserProfileDoc(fbUser);
      } catch (err) {
        console.error('Failed to ensure user profile doc:', err);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [ensureUserProfileDoc]);

  // Firestore real-time listeners (strictly gated on authenticated firebaseUser)
  useEffect(() => {
    if (!firebaseUser) return;

    const uid = firebaseUser.uid;
    const isBootstrappedAdmin =
      firebaseUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL;

    // 1. User Profile & Wishlist listener
    const userDocRef = doc(db, 'users', uid);
    const unsubProfile = onSnapshot(
      userDocRef,
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        const resolvedRole: 'customer' | 'admin' =
          isBootstrappedAdmin || data.role === 'admin' ? 'admin' : 'customer';

        setUser((prev) => ({
          id: uid,
          name: data.name || firebaseUser.displayName || 'Customer',
          email: data.email || firebaseUser.email || '',
          phone: data.phone || '',
          gender: data.gender || '',
          photoURL: firebaseUser.photoURL || undefined,
          role: resolvedRole,
          addresses: prev?.id === uid ? prev.addresses : [],
        }));

        if (Array.isArray(data.wishlistIds)) {
          const allProds = productsRef.current;
          const syncedWishlist = data.wishlistIds
            .map((pid: string) => allProds.find((p) => p.id === pid))
            .filter((p): p is Product => Boolean(p));
          setWishlist(syncedWishlist);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      }
    );

    // 2. Saved Addresses subcollection listener
    const addressesColRef = collection(db, 'users', uid, 'addresses');
    const unsubAddresses = onSnapshot(
      addressesColRef,
      (snapshot) => {
        const loaded: Address[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            label: (['Home', 'Work', 'Other'].includes(data.label) ? data.label : 'Home') as
              | 'Home'
              | 'Work'
              | 'Other',
            fullName: data.fullName || '',
            phone: data.phone || '',
            email: data.email || '',
            addressLine1: data.addressLine1 || '',
            addressLine2: data.addressLine2 || '',
            city: data.city || '',
            state: data.state || '',
            pinCode: data.pinCode || '',
            isDefault: Boolean(data.isDefault),
          };
        });
        // Sort default address first
        loaded.sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)));

        setUser((prev) =>
          prev && prev.id === uid ? { ...prev, addresses: loaded } : prev
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${uid}/addresses`);
      }
    );

    // 3. Orders collection listener (admin sees all orders, customer sees their own)
    const ordersQuery = isBootstrappedAdmin
      ? collection(db, 'orders')
      : query(collection(db, 'orders'), where('userId', '==', uid));

    const unsubOrders = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const loadedOrders: Order[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: data.id || d.id,
            userId: data.userId,
            date: data.date || new Date().toISOString(),
            items: Array.isArray(data.items)
              ? data.items.map((item: any) => ({
                  ...item,
                  product: repairProductImages(item.product),
                }))
              : [],
            subtotal: Number(data.subtotal) || 0,
            tax: Number(data.tax) || 0,
            discount: Number(data.discount) || 0,
            shipping: Number(data.shipping) || 0,
            total: Number(data.total) || 0,
            status: (data.status || 'Order Placed') as OrderStatus,
            paymentMethod: data.paymentMethod || 'UPI',
            paymentStatus: data.paymentStatus || 'Paid',
            shippingAddress: data.shippingAddress,
            trackingNumber: data.trackingNumber || '',
            carrier: data.carrier || 'KINETIX SuperFast Verified Logistics',
            estimatedDelivery: data.estimatedDelivery || 'Within 24-48 Hours',
            statusHistory: Array.isArray(data.statusHistory) ? data.statusHistory : [],
            returnReason: data.returnReason,
          };
        });
        loadedOrders.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setFirestoreOrders(loadedOrders);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    return () => {
      unsubProfile();
      unsubAddresses();
      unsubOrders();
    };
  }, [firebaseUser]);

  const navigate = (
    newPage: PageType,
    params: Record<string, any> = {},
    options: NavigateOptions = {}
  ) => {
    setPage(newPage);
    setPageParams(params);

    if (typeof window !== 'undefined') {
      const targetUrl = buildUrlFromRoute(newPage, params);
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (targetUrl !== currentUrl) {
        try {
          if (options.replace) {
            window.history.replaceState({ page: newPage, params }, '', targetUrl);
          } else {
            window.history.pushState({ page: newPage, params }, '', targetUrl);
          }
        } catch {
          // Ignore History API security restrictions in sandboxed environments
        }
      }
      if (!options.skipScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Sync browser Back / Forward buttons and hash deep-links
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncFromLocation = () => {
      const matched = getCurrentRouteFromWindow();
      setPage(matched.page);
      setPageParams(matched.params);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };

    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, []);

  // Hydrate comparison list if deep-linked via /compare?ids=id1,id2
  useEffect(() => {
    if (page === 'compare' && Array.isArray(pageParams?.ids) && pageParams.ids.length > 0) {
      const matched = pageParams.ids
        .map((id: string) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4);
      if (matched.length > 0) {
        setComparisonList(matched);
      }
    }
  }, [page, pageParams?.ids, products]);

  // Keep document.title synchronized with active deep-link route
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const brandSuffix = 'KINETIX Power';
    let title = `${brandSuffix} | Premium Automotive, Solar & Lithium Batteries`;

    switch (page) {
      case 'shop':
        title = pageParams?.category
          ? `${String(pageParams.category).toUpperCase()} Batteries | ${brandSuffix}`
          : `Shop Batteries | ${brandSuffix}`;
        break;
      case 'all-batteries':
        title = `Browse All Batteries | ${brandSuffix}`;
        break;
      case 'car-batteries':
        title = `Car Batteries | ${brandSuffix}`;
        break;
      case 'bike-batteries':
        title = `Bike Batteries | ${brandSuffix}`;
        break;
      case 'inverter-batteries':
        title = `Inverter Batteries | ${brandSuffix}`;
        break;
      case 'lithium-batteries':
        title = `Lithium Batteries (LiFePO4) | ${brandSuffix}`;
        break;
      case 'solar-batteries':
        title = `Solar Batteries | ${brandSuffix}`;
        break;
      case 'industrial-batteries':
        title = `Industrial Batteries | ${brandSuffix}`;
        break;
      case 'ups-batteries':
        title = `UPS Batteries | ${brandSuffix}`;
        break;
      case 'accessories':
        title = `Battery Accessories | ${brandSuffix}`;
        break;
      case 'brands':
        title = pageParams?.brand
          ? `${String(pageParams.brand)} Batteries | ${brandSuffix}`
          : `Authorized Battery Brands | ${brandSuffix}`;
        break;
      case 'offers':
        title = `Special Offers & Battery Deals | ${brandSuffix}`;
        break;
      case 'category':
        title = `${String(pageParams?.category || 'Battery').toUpperCase()} Category | ${brandSuffix}`;
        break;
      case 'product-detail': {
        const prod = products.find((p) => p.id === pageParams?.productId);
        title = prod ? `${prod.name} | ${brandSuffix}` : `Battery Details | ${brandSuffix}`;
        break;
      }
      case 'compare':
        title = `Compare Batteries | ${brandSuffix}`;
        break;
      case 'cart':
        title = `Shopping Bag | ${brandSuffix}`;
        break;
      case 'checkout':
        title = `Checkout | ${brandSuffix}`;
        break;
      case 'account':
        title = `My Account | ${brandSuffix}`;
        break;
      case 'tracking':
        title = pageParams?.orderId
          ? `Track Order ${pageParams.orderId} | ${brandSuffix}`
          : `Live Order Tracking | ${brandSuffix}`;
        break;
      case 'about':
        title = `About Us | ${brandSuffix}`;
        break;
      case 'contact':
        title = `Contact & 24/7 Support | ${brandSuffix}`;
        break;
      case 'blog':
      case 'blog-detail':
        title = `Engineering Publications | ${brandSuffix}`;
        break;
      case 'faq':
        title = `FAQs | ${brandSuffix}`;
        break;
      case 'buying-guide':
        title = `Battery Capacity Calculator | ${brandSuffix}`;
        break;
      case 'maintenance-guide':
        title = `Battery Maintenance Guide | ${brandSuffix}`;
        break;
      case 'policy':
        title = `Warranty & Policies | ${brandSuffix}`;
        break;
      case 'admin':
        title = `Admin Console | ${brandSuffix}`;
        break;
      case 'not-found':
        title = `Page Not Found | ${brandSuffix}`;
        break;
    }

    document.title = title;
  }, [page, pageParams, products]);

  // Cart calculations
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + (item.unitPrice ?? item.product.price) * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 18% GST calculation (standard Indian GST for industrial storage batteries)
  const cartTax = Math.round(cartSubtotal * 0.18);

  let rawDiscount = 0;
  if (appliedCoupon) {
    rawDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    if (appliedCoupon.maxDiscount && rawDiscount > appliedCoupon.maxDiscount) {
      rawDiscount = appliedCoupon.maxDiscount;
    }
  }
  const cartDiscount = rawDiscount;

  // Free shipping above ₹2,500
  const cartShipping = cartSubtotal >= 2500 || cartSubtotal === 0 ? 0 : 350;
  const cartTotal = Math.max(0, cartSubtotal + cartTax - cartDiscount + cartShipping);

  // Cart operations
  const addToCart = (
    product: Product,
    quantity: number = 1,
    options?: {
      finishName?: string;
      finishFilter?: string;
      capacityLabel?: string;
      unitPrice?: number;
    }
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                ...(options ? options : {}),
              }
            : item
        );
      }
      return [...prev, { product, quantity, ...(options ? options : {}) }];
    });
    const detailSuffix = options?.finishName ? ` (${options.finishName})` : '';
    showToast(`Added "${product.name}"${detailSuffix} to bag`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed "${item.product.name}" from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupon handling
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try VOLT15 or TITANIUM.' };
    }
    if (found.minOrder && cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `This coupon requires a minimum subtotal of ₹${found.minOrder.toLocaleString('en-IN')}`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist operations (optimistic local state + Firestore persistence when signed in)
  const persistWishlistToFirestore = (nextList: Product[]) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const wishlistIds = nextList
      .map((p) => p.id)
      .filter((id) => typeof id === 'string' && id.length <= 128)
      .slice(0, 50);
    updateDoc(doc(db, 'users', uid), {
      wishlistIds,
      updatedAt: serverTimestamp(),
    }).catch((error) => {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    });
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (!exists && wishlist.length >= 50) {
      showToast('Wishlist limit reached (50 batteries max). Remove an item to save more.', 'error');
      return;
    }

    const updated = exists
      ? wishlist.filter((p) => p.id !== product.id)
      : [product, ...wishlist];

    setWishlist(updated);
    showToast(
      exists ? `Removed "${product.name}" from Wishlist` : `Saved "${product.name}" to Wishlist`,
      exists ? 'info' : 'success'
    );
    persistWishlistToFirestore(updated);
  };

  const clearWishlist = () => {
    if (wishlist.length === 0) return;
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
    persistWishlistToFirestore([]);
  };

  const moveAllWishlistToCart = () => {
    if (wishlist.length === 0) return;
    const itemsToMove = [...wishlist];
    setCart((prev) => {
      const next = [...prev];
      itemsToMove.forEach((product) => {
        const idx = next.findIndex((i) => i.product.id === product.id);
        if (idx >= 0) {
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        } else {
          next.push({ product, quantity: 1 });
        }
      });
      return next;
    });
    setWishlist([]);
    persistWishlistToFirestore([]);
    showToast(
      `Moved ${itemsToMove.length} ${itemsToMove.length === 1 ? 'battery' : 'batteries'} to shopping cart`
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Comparison operations (up to 4 products)
  const addToComparison = (product: Product) => {
    if (comparisonList.some((p) => p.id === product.id)) {
      showToast('Product already in comparison list', 'info');
      return false;
    }
    if (comparisonList.length >= 4) {
      showToast('You can compare up to 4 batteries at a time.', 'error');
      return false;
    }
    setComparisonList((prev) => [...prev, product]);
    showToast(`Added ${product.name} to comparison`, 'success');
    return true;
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isInComparison = (productId: string) => {
    return comparisonList.some((p) => p.id === productId);
  };

  // Firebase Auth actions
  const signInWithGoogle = async (prefill?: { name?: string; phone?: string }): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      await ensureUserProfileDoc(fbUser, prefill);
      setIsAuthModalOpen(false);
      const displayName = prefill?.name?.trim() || fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer';
      showToast(`Welcome, ${displayName}! Your account is synced.`);
      return true;
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        showToast('Sign-in popup was closed before completing.', 'info');
      } else if (code === 'auth/popup-blocked') {
        showToast('Browser blocked the sign-in popup. Please allow popups and try again.', 'error');
      } else {
        showToast(error?.message || 'Unable to sign in with Google. Please try again.', 'error');
      }
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setFirestoreOrders([]);
      showToast('Signed out successfully', 'info');
    } catch (error: any) {
      showToast(error?.message || 'Could not sign out right now.', 'error');
    }
  };

  const updateUserProfile = async (updates: ProfileUpdateInput): Promise<void> => {
    const fbUser = auth.currentUser;
    if (!fbUser) {
      showToast('Please sign in to update your profile.', 'error');
      return;
    }
    const uid = fbUser.uid;
    const safeName = clampString(updates.name, 100, 'Customer');
    const safePhone = clampString(updates.phone, 30, '');
    const safeGender = (['', 'Male', 'Female', 'Other'].includes(updates.gender)
      ? updates.gender
      : '') as '' | 'Male' | 'Female' | 'Other';

    try {
      await ensureUserProfileDoc(fbUser);
      await updateDoc(doc(db, 'users', uid), {
        name: safeName,
        phone: safePhone,
        gender: safeGender,
        updatedAt: serverTimestamp(),
      });
      showToast('Profile information updated & saved.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  };

  const saveAddress = async (input: AddressSaveInput): Promise<void> => {
    const fbUser = auth.currentUser;
    if (!fbUser) {
      showToast('Please sign in to save addresses.', 'error');
      return;
    }
    const uid = fbUser.uid;
    await ensureUserProfileDoc(fbUser);

    const isEditing = Boolean(input.id && /^[a-zA-Z0-9_-]{1,128}$/.test(input.id));
    const addressId = isEditing
      ? input.id!
      : `addr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const existingAddresses = user?.addresses || [];
    const shouldBeDefault = Boolean(input.isDefault) || existingAddresses.length === 0;

    const cleanLabel: 'Home' | 'Work' | 'Other' =
      input.label && ['Home', 'Work', 'Other'].includes(input.label) ? input.label : 'Home';

    const payload = {
      label: cleanLabel,
      fullName: clampString(input.fullName, 100, user?.name || 'Customer'),
      phone: clampString(input.phone, 30, user?.phone || '0000000000').padEnd(6, '0'),
      email: clampString(input.email || user?.email || fbUser.email || '', 200, ''),
      addressLine1: clampString(input.addressLine1, 250, 'Street Address'),
      addressLine2: clampString(input.addressLine2, 200, ''),
      city: clampString(input.city, 80, 'Mumbai'),
      state: clampString(input.state, 80, 'Maharashtra'),
      pinCode: clampString(input.pinCode, 12, '400001'),
      isDefault: shouldBeDefault,
    };

    try {
      const batch = writeBatch(db);

      // If this address is becoming default, unset previous default addresses
      if (shouldBeDefault) {
        existingAddresses.forEach((addr) => {
          if (addr.id && addr.id !== addressId && addr.isDefault) {
            batch.update(doc(db, 'users', uid, 'addresses', addr.id), {
              isDefault: false,
              updatedAt: serverTimestamp(),
            });
          }
        });
      }

      const targetRef = doc(db, 'users', uid, 'addresses', addressId);
      if (isEditing) {
        batch.update(targetRef, {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      } else {
        batch.set(targetRef, {
          id: addressId,
          userId: uid,
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();
      showToast(isEditing ? 'Address updated successfully' : 'New delivery address saved');
    } catch (error) {
      handleFirestoreError(
        error,
        isEditing ? OperationType.UPDATE : OperationType.CREATE,
        `users/${uid}/addresses/${addressId}`
      );
    }
  };

  const deleteAddress = async (addressId: string): Promise<void> => {
    const fbUser = auth.currentUser;
    if (!fbUser || !addressId) return;
    const uid = fbUser.uid;
    try {
      await deleteDoc(doc(db, 'users', uid, 'addresses', addressId));
      showToast('Address deleted', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${uid}/addresses/${addressId}`);
    }
  };

  const setDefaultAddress = async (addressId: string): Promise<void> => {
    const fbUser = auth.currentUser;
    if (!fbUser || !addressId) return;
    const uid = fbUser.uid;
    const existingAddresses = user?.addresses || [];
    try {
      const batch = writeBatch(db);
      existingAddresses.forEach((addr) => {
        if (!addr.id) return;
        const shouldBeDefault = addr.id === addressId;
        if (Boolean(addr.isDefault) !== shouldBeDefault) {
          batch.update(doc(db, 'users', uid, 'addresses', addr.id), {
            isDefault: shouldBeDefault,
            updatedAt: serverTimestamp(),
          });
        }
      });
      await batch.commit();
      showToast('Default delivery address updated');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}/addresses/${addressId}`);
    }
  };

  // Product CRUD (For Admin & catalog updates)
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `ktx-custom-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
    showToast(`Product "${product.name}" created!`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Product "${updated.name}" updated!`);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog', 'info');
  };

  const getProductById = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  // Orders: works for BOTH signed-in users (persisted to Firestore) and guests (saved locally, linkable anytime)
  const placeOrder = async ({
    shippingAddress,
    paymentMethod,
    deliverySpeed = 'express',
    saveAddressToProfile = false,
  }: {
    shippingAddress: Address;
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
    deliverySpeed?: 'express' | 'standard';
    saveAddressToProfile?: boolean;
  }): Promise<Order> => {
    const orderId = `KTX-${Math.floor(100000 + Math.random() * 900000)}`;
    const cleanAddress = sanitizeShippingAddress(shippingAddress);
    const fbUser = auth.currentUser;

    const cleanItems = stripUndefined(
      cart.slice(0, 20).map((item) => ({
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: item.unitPrice ?? item.product.price,
      }))
    );

    const newOrder: Order = {
      id: orderId,
      userId: fbUser?.uid,
      date: new Date().toISOString(),
      items: cleanItems,
      subtotal: cartSubtotal,
      tax: cartTax,
      discount: cartDiscount,
      shipping: cartShipping,
      total: cartTotal,
      status: 'Order Placed',
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending COD' : 'Paid',
      shippingAddress: cleanAddress,
      trackingNumber: `TRACK-${orderId}-${Math.floor(100 + Math.random() * 900)}`,
      carrier: 'KINETIX SuperFast Verified Logistics',
      estimatedDelivery:
        deliverySpeed === 'express' ? 'Within 4 Hours (Express Fitment)' : 'Standard Next-Day Slot',
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          note: `Order received and confirmed via ${paymentMethod}.`,
        },
      ],
    };

    if (fbUser) {
      await ensureUserProfileDoc(fbUser);
      try {
        await setDoc(doc(db, 'orders', orderId), {
          id: newOrder.id,
          userId: fbUser.uid,
          date: newOrder.date,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          tax: newOrder.tax,
          discount: newOrder.discount,
          shipping: newOrder.shipping,
          total: newOrder.total,
          status: newOrder.status,
          paymentMethod: newOrder.paymentMethod,
          paymentStatus: newOrder.paymentStatus,
          shippingAddress: newOrder.shippingAddress,
          trackingNumber: newOrder.trackingNumber,
          carrier: newOrder.carrier,
          estimatedDelivery: newOrder.estimatedDelivery,
          statusHistory: newOrder.statusHistory,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Optionally save shipping address to customer's address book
        if (saveAddressToProfile && !shippingAddress.id) {
          await saveAddress({
            label: shippingAddress.label || 'Home',
            fullName: cleanAddress.fullName,
            phone: cleanAddress.phone,
            email: cleanAddress.email,
            addressLine1: cleanAddress.addressLine1,
            addressLine2: cleanAddress.addressLine2,
            city: cleanAddress.city,
            state: cleanAddress.state,
            pinCode: cleanAddress.pinCode,
            isDefault: (user?.addresses.length || 0) === 0,
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
      }
    } else {
      // Guest checkout: persist locally so anyone can order & track without signing in
      setGuestOrders((prev) => {
        const next = [newOrder, ...prev];
        saveGuestOrders(next);
        return next;
      });
    }

    clearCart();
    showToast(`Order ${orderId} confirmed!`);
    return newOrder;
  };

  // Link a guest order to the signed-in user's Firestore account
  const linkGuestOrderToAccount = async (guestOrder: Order): Promise<boolean> => {
    const fbUser = auth.currentUser;
    if (!fbUser) return false;

    try {
      await ensureUserProfileDoc(fbUser);
      const cleanAddress = sanitizeShippingAddress(guestOrder.shippingAddress);
      const cleanItems = stripUndefined(guestOrder.items.slice(0, 20));
      const cleanHistory = stripUndefined(
        guestOrder.statusHistory.length > 0
          ? guestOrder.statusHistory.slice(0, 20)
          : [
              {
                status: 'Order Placed' as OrderStatus,
                timestamp: new Date().toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }),
                note: 'Guest order linked to verified customer account.',
              },
            ]
      );

      await setDoc(doc(db, 'orders', guestOrder.id), {
        id: guestOrder.id,
        userId: fbUser.uid,
        date: guestOrder.date,
        items: cleanItems,
        subtotal: guestOrder.subtotal,
        tax: guestOrder.tax,
        discount: guestOrder.discount,
        shipping: guestOrder.shipping,
        total: guestOrder.total,
        status: 'Order Placed',
        paymentMethod: guestOrder.paymentMethod,
        paymentStatus: guestOrder.paymentStatus,
        shippingAddress: cleanAddress,
        trackingNumber: guestOrder.trackingNumber,
        carrier: guestOrder.carrier,
        estimatedDelivery: guestOrder.estimatedDelivery,
        statusHistory: cleanHistory,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Remove from local guest storage once persisted in Firestore
      setGuestOrders((prev) => {
        const next = prev.filter((o) => o.id !== guestOrder.id);
        saveGuestOrders(next);
        return next;
      });
      showToast(`Order ${guestOrder.id} linked to your account!`);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${guestOrder.id}`);
      return false;
    }
  };

  const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const cancellableStatuses: OrderStatus[] = ['Order Placed', 'Processing', 'Quality Testing'];
    if (!cancellableStatuses.includes(target.status)) {
      showToast('This order is already dispatched and cannot be cancelled online.', 'error');
      return;
    }

    const newHistory = [
      ...target.statusHistory,
      {
        status: 'Cancelled' as OrderStatus,
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        note: reason?.trim() || 'Cancelled by customer prior to dispatch.',
      },
    ].slice(0, 20);

    if (auth.currentUser && target.userId === auth.currentUser.uid) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'Cancelled',
          statusHistory: newHistory,
          updatedAt: serverTimestamp(),
        });
        showToast(`Order ${orderId} has been cancelled.`, 'info');
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      }
    } else {
      setGuestOrders((prev) => {
        const next = prev.map((o) =>
          o.id === orderId ? { ...o, status: 'Cancelled' as OrderStatus, statusHistory: newHistory } : o
        );
        saveGuestOrders(next);
        return next;
      });
      showToast(`Order ${orderId} has been cancelled.`, 'info');
    }
  };

  const requestOrderReturn = async (orderId: string, reason: string): Promise<void> => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) {
      showToast('Order not found.', 'error');
      return;
    }
    const cleanReason = clampString(reason, 500, '');
    if (cleanReason.length < 3) {
      showToast('Please provide a brief reason (at least 3 characters).', 'error');
      return;
    }
    if (target.status !== 'Delivered') {
      showToast('Return & replacement requests can only be submitted for delivered orders.', 'error');
      return;
    }

    const newHistory = [
      ...target.statusHistory,
      {
        status: 'Return Requested' as OrderStatus,
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        note: `Return / replacement requested: ${cleanReason}`,
      },
    ].slice(0, 20);

    if (auth.currentUser && target.userId === auth.currentUser.uid) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'Return Requested',
          returnReason: cleanReason,
          statusHistory: newHistory,
          updatedAt: serverTimestamp(),
        });
        showToast(`Return ticket initiated for Order ${orderId}. Our engineer will contact you.`);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      }
    } else {
      setGuestOrders((prev) => {
        const next = prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'Return Requested' as OrderStatus,
                returnReason: cleanReason,
                statusHistory: newHistory,
              }
            : o
        );
        saveGuestOrders(next);
        return next;
      });
      showToast(`Return ticket initiated for Order ${orderId}. Our engineer will contact you.`);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    note?: string
  ): Promise<void> => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const newHistory = [
      ...target.statusHistory,
      {
        status,
        timestamp: new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        note: note || `Status updated to ${status}.`,
      },
    ].slice(0, 20);

    if (auth.currentUser && target.userId) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status,
          statusHistory: newHistory,
          paymentStatus: status === 'Cancelled' && target.paymentStatus === 'Paid' ? 'Refunded' : target.paymentStatus,
          trackingNumber: target.trackingNumber,
          updatedAt: serverTimestamp(),
        });
        showToast(`Order ${orderId} updated to ${status}`);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      }
    } else {
      setGuestOrders((prev) => {
        const next = prev.map((o) =>
          o.id === orderId ? { ...o, status, statusHistory: newHistory } : o
        );
        saveGuestOrders(next);
        return next;
      });
      showToast(`Order ${orderId} updated to ${status}`);
    }
  };

  const getOrderById = (orderId: string) => {
    const clean = orderId.trim().toLowerCase();
    return (
      orders.find(
        (o) =>
          o.id.toLowerCase() === clean ||
          o.trackingNumber.toLowerCase() === clean
      ) ||
      SAMPLE_TRACKING_ORDERS.find(
        (o) =>
          o.id.toLowerCase() === clean ||
          o.trackingNumber.toLowerCase() === clean
      )
    );
  };

  // Indian Pincode delivery checker logic
  const checkPincode = (pin: string) => {
    const clean = pin.trim();
    if (!/^\d{6}$/.test(clean)) {
      return {
        deliverable: false,
        city: '',
        state: '',
        estimateDays: 0,
        expressAvailable: false,
      };
    }
    const prefix = clean.substring(0, 2);
    const pinMap: Record<string, { city: string; state: string; days: number; express: boolean }> =
      {
        '40': { city: 'Mumbai', state: 'Maharashtra', days: 1, express: true },
        '41': { city: 'Pune', state: 'Maharashtra', days: 1, express: true },
        '11': { city: 'New Delhi', state: 'Delhi NCR', days: 1, express: true },
        '12': { city: 'Gurugram / Faridabad', state: 'Haryana', days: 1, express: true },
        '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', days: 1, express: true },
        '56': { city: 'Bengaluru', state: 'Karnataka', days: 1, express: true },
        '50': { city: 'Hyderabad', state: 'Telangana', days: 1, express: true },
        '60': { city: 'Chennai', state: 'Tamil Nadu', days: 2, express: true },
        '70': { city: 'Kolkata', state: 'West Bengal', days: 2, express: false },
        '38': { city: 'Ahmedabad', state: 'Gujarat', days: 2, express: true },
        '30': { city: 'Jaipur', state: 'Rajasthan', days: 2, express: false },
        '68': { city: 'Kochi', state: 'Kerala', days: 2, express: false },
        '44': { city: 'Nagpur', state: 'Maharashtra', days: 2, express: false },
        '80': { city: 'Patna', state: 'Bihar', days: 3, express: false },
      };

    const found = pinMap[prefix];
    if (found) {
      return {
        deliverable: true,
        city: found.city,
        state: found.state,
        estimateDays: found.days,
        expressAvailable: found.express,
      };
    }
    return {
      deliverable: true,
      city: 'Standard Zone Area',
      state: 'Pan-India',
      estimateDays: 3,
      expressAvailable: false,
    };
  };

  return (
    <StoreContext.Provider
      value={{
        page,
        pageParams,
        navigate,
        getRouteUrl: buildUrlFromRoute,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        searchQuery,
        setSearchQuery,
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
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        clearWishlist,
        moveAllWishlistToCart,
        isInWishlist,
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        user,
        authLoading,
        signInWithGoogle,
        logout,
        updateUserProfile,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,
        orders,
        placeOrder,
        cancelOrder,
        requestOrderReturn,
        updateOrderStatus,
        linkGuestOrderToAccount,
        getOrderById,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        showToast,
        dismissToast,
        checkPincode,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
