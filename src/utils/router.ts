import { ProductCategory } from '../types';

export type CategoryPageType =
  | 'car-batteries'
  | 'bike-batteries'
  | 'inverter-batteries'
  | 'lithium-batteries'
  | 'solar-batteries'
  | 'industrial-batteries'
  | 'ups-batteries'
  | 'accessories';

export type PageType =
  | 'home'
  | 'shop'
  | 'all-batteries'
  | CategoryPageType
  | 'brands'
  | 'offers'
  | 'category'
  | 'product-detail'
  | 'compare'
  | 'cart'
  | 'checkout'
  | 'account'
  | 'tracking'
  | 'about'
  | 'contact'
  | 'blog'
  | 'blog-detail'
  | 'faq'
  | 'buying-guide'
  | 'maintenance-guide'
  | 'policy'
  | 'admin'
  | 'not-found';

export interface RouteMatch {
  page: PageType;
  params: Record<string, any>;
}

export const CATEGORY_TO_PAGE_MAP: Record<ProductCategory, CategoryPageType> = {
  car: 'car-batteries',
  bike: 'bike-batteries',
  inverter: 'inverter-batteries',
  lithium: 'lithium-batteries',
  solar: 'solar-batteries',
  industrial: 'industrial-batteries',
  ups: 'ups-batteries',
  accessories: 'accessories',
};

export const PAGE_TO_CATEGORY_MAP: Record<CategoryPageType, ProductCategory> = {
  'car-batteries': 'car',
  'bike-batteries': 'bike',
  'inverter-batteries': 'inverter',
  'lithium-batteries': 'lithium',
  'solar-batteries': 'solar',
  'industrial-batteries': 'industrial',
  'ups-batteries': 'ups',
  accessories: 'accessories',
};

export function getCategoryPageType(category: string): CategoryPageType {
  const normalized = category.toLowerCase() as ProductCategory;
  return CATEGORY_TO_PAGE_MAP[normalized] || 'car-batteries';
}

export function isDedicatedCategoryPage(page: PageType): page is CategoryPageType {
  return page in PAGE_TO_CATEGORY_MAP;
}

const VALID_ACCOUNT_TABS = new Set(['orders', 'wishlist', 'addresses', 'profile', 'returns']);
const VALID_POLICY_TYPES = new Set([
  'warranty',
  'shipping',
  'return',
  'privacy',
  'terms',
  'cancellation',
]);
const VALID_ADMIN_TABS = new Set([
  'overview',
  'products',
  'orders',
  'customers',
  'coupons',
  'settings',
]);

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function parseShopFilterParams(query: URLSearchParams): Record<string, any> {
  const params: Record<string, any> = {};
  const category = query.get('category');
  const searchVal = query.get('search') || query.get('q');
  const brand = query.get('brand');
  const voltage = query.get('voltage');
  const tech = query.get('tech');
  const minAh = query.get('minAh');
  const maxAh = query.get('maxAh');
  const minWarranty = query.get('minWarranty');
  const maxPrice = query.get('maxPrice');
  const inStock = query.get('inStock');
  const sort = query.get('sort');

  if (category) params.category = category;
  if (searchVal) params.search = searchVal;
  if (brand) params.brand = brand;
  if (voltage) params.voltage = voltage;
  if (tech) params.tech = tech;
  if (minAh && !Number.isNaN(Number(minAh))) params.minAh = Number(minAh);
  if (maxAh && !Number.isNaN(Number(maxAh))) params.maxAh = Number(maxAh);
  if (minWarranty && !Number.isNaN(Number(minWarranty))) params.minWarranty = Number(minWarranty);
  if (maxPrice && !Number.isNaN(Number(maxPrice))) params.maxPrice = Number(maxPrice);
  if (inStock === 'true' || inStock === '1') params.inStock = true;
  if (sort) params.sort = sort;

  return params;
}

function buildShopQueryString(params: Record<string, any> = {}): string {
  const qs = new URLSearchParams();
  if (params.category && params.category !== 'all') qs.set('category', String(params.category));
  if (params.search && String(params.search).trim()) qs.set('search', String(params.search).trim());
  if (params.brand && params.brand !== 'all') qs.set('brand', String(params.brand));
  if (params.voltage && params.voltage !== 'all') qs.set('voltage', String(params.voltage));
  if (params.tech && params.tech !== 'all') qs.set('tech', String(params.tech));
  if (params.minAh && Number(params.minAh) > 0) qs.set('minAh', String(params.minAh));
  if (params.maxAh && Number(params.maxAh) < 220) qs.set('maxAh', String(params.maxAh));
  if (params.minWarranty && Number(params.minWarranty) > 0) {
    qs.set('minWarranty', String(params.minWarranty));
  }
  if (params.maxPrice && Number(params.maxPrice) < 200000) {
    qs.set('maxPrice', String(params.maxPrice));
  }
  if (params.inStock) qs.set('inStock', 'true');
  if (params.sort && params.sort !== 'featured') qs.set('sort', String(params.sort));
  return qs.toString();
}

/**
 * Parses a pathname + search + hash (supports both History API paths like `/car-batteries`
 * and hash-based deep links like `#/lithium-batteries`) into a typed PageType + params.
 */
export function parseUrlToRoute(
  pathname: string,
  search: string = '',
  hash: string = ''
): RouteMatch {
  let effectivePath = pathname || '/';
  let effectiveSearch = search || '';

  // Support hash deep links such as /#/product/kinetix-aeon-75?finish=basalt
  if (hash && hash.startsWith('#/')) {
    const hashBody = hash.slice(1);
    const qIndex = hashBody.indexOf('?');
    if (qIndex >= 0) {
      effectivePath = hashBody.slice(0, qIndex);
      effectiveSearch = hashBody.slice(qIndex);
    } else {
      effectivePath = hashBody;
    }
  }

  // Normalize trailing slashes
  const cleanPath = effectivePath.replace(/\/+$/, '') || '/';
  const segments = cleanPath
    .split('/')
    .filter(Boolean)
    .map((s) => safeDecode(s));

  const query = new URLSearchParams(effectiveSearch);

  if (segments.length === 0 || (segments.length === 1 && segments[0].toLowerCase() === 'home')) {
    return { page: 'home', params: {} };
  }

  const root = segments[0].toLowerCase();
  const sub = segments[1];

  // Dedicated Separate Battery Category Routes
  if (root === 'car-batteries') {
    return { page: 'car-batteries', params: {} };
  }
  if (root === 'bike-batteries') {
    return { page: 'bike-batteries', params: {} };
  }
  if (root === 'inverter-batteries') {
    return { page: 'inverter-batteries', params: {} };
  }
  if (
    root === 'lithium-batteries' ||
    root === 'lithium-batteries-lifepo4' ||
    root === 'lifepo4' ||
    root === 'lifepo4-batteries'
  ) {
    return { page: 'lithium-batteries', params: {} };
  }
  if (root === 'solar-batteries') {
    return { page: 'solar-batteries', params: {} };
  }
  if (root === 'industrial-batteries') {
    return { page: 'industrial-batteries', params: {} };
  }
  if (root === 'ups-batteries') {
    return { page: 'ups-batteries', params: {} };
  }
  if (root === 'accessories' || root === 'battery-accessories') {
    return { page: 'accessories', params: {} };
  }

  // Dedicated Browse All Batteries page
  if (root === 'all-batteries' || root === 'browse-all-batteries') {
    return { page: 'all-batteries', params: parseShopFilterParams(query) };
  }

  // Shop & Catalog (supports query params for deep-linked filters)
  if (
    root === 'shop' ||
    root === 'shop-batteries' ||
    root === 'batteries' ||
    root === 'catalog'
  ) {
    return { page: 'shop', params: parseShopFilterParams(query) };
  }

  // Legacy /category/:slug deep links seamlessly resolve to their dedicated category pages
  if (root === 'category' || root === 'categories') {
    const slug = (sub || 'car').toLowerCase();
    return { page: getCategoryPageType(slug), params: {} };
  }

  // Dedicated Offers page
  if (root === 'offers' || root === 'deals') {
    return { page: 'offers', params: {} };
  }

  // Dedicated Brands page (supports /brands and /brands/:brand)
  if (root === 'brand' || root === 'brands') {
    return {
      page: 'brands',
      params: sub ? { brand: sub } : {},
    };
  }

  // Products / Product Detail
  if (root === 'product' || root === 'products' || root === 'battery') {
    if (sub) {
      const params: Record<string, any> = { productId: sub };
      const finish = query.get('finish');
      const capacity = query.get('capacity');
      if (finish) params.finish = finish;
      if (capacity) params.capacity = capacity;
      return { page: 'product-detail', params };
    }
    return { page: 'all-batteries', params: {} };
  }

  // Compare
  if (root === 'compare') {
    const idsParam = query.get('ids');
    return {
      page: 'compare',
      params: idsParam
        ? {
            ids: idsParam
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : {},
    };
  }

  // Cart & Checkout
  if (root === 'cart' || root === 'bag') {
    return { page: 'cart', params: {} };
  }
  if (root === 'checkout') {
    return { page: 'checkout', params: {} };
  }

  // Account & direct tab shortcuts
  if (root === 'account') {
    const tab = sub && VALID_ACCOUNT_TABS.has(sub.toLowerCase()) ? sub.toLowerCase() : undefined;
    return { page: 'account', params: tab ? { tab } : {} };
  }
  if (root === 'orders') {
    return { page: 'account', params: { tab: 'orders' } };
  }
  if (root === 'wishlist') {
    return { page: 'account', params: { tab: 'wishlist' } };
  }
  if (root === 'profile') {
    return { page: 'account', params: { tab: 'profile' } };
  }

  // Order Tracking
  if (root === 'tracking' || root === 'track') {
    const orderId = sub || query.get('orderId') || undefined;
    return { page: 'tracking', params: orderId ? { orderId } : {} };
  }

  // Editorial & Info Pages
  if (root === 'about' || root === 'about-us') {
    return { page: 'about', params: {} };
  }
  if (root === 'contact' || root === 'support') {
    return { page: 'contact', params: {} };
  }
  if (root === 'blog' || root === 'articles' || root === 'publications') {
    if (sub) {
      return { page: 'blog-detail', params: { slug: sub } };
    }
    return { page: 'blog', params: {} };
  }
  if (root === 'faq' || root === 'faqs') {
    return { page: 'faq', params: {} };
  }
  if (root === 'buying-guide' || root === 'calculator') {
    return { page: 'buying-guide', params: {} };
  }
  if (root === 'maintenance-guide' || root === 'maintenance') {
    return { page: 'maintenance-guide', params: {} };
  }

  // Policies & direct policy shortcuts
  if (root === 'policy' || root === 'policies') {
    const type = sub && VALID_POLICY_TYPES.has(sub.toLowerCase()) ? sub.toLowerCase() : 'warranty';
    return { page: 'policy', params: { type } };
  }
  if (root === 'warranty') return { page: 'policy', params: { type: 'warranty' } };
  if (root === 'shipping') return { page: 'policy', params: { type: 'shipping' } };
  if (root === 'returns' || root === 'return') return { page: 'policy', params: { type: 'return' } };
  if (root === 'privacy') return { page: 'policy', params: { type: 'privacy' } };
  if (root === 'terms') return { page: 'policy', params: { type: 'terms' } };
  if (root === 'cancellation') return { page: 'policy', params: { type: 'cancellation' } };

  // Admin Console
  if (root === 'admin') {
    const tab = sub && VALID_ADMIN_TABS.has(sub.toLowerCase()) ? sub.toLowerCase() : undefined;
    return { page: 'admin', params: tab ? { tab } : {} };
  }

  return { page: 'not-found', params: { attemptedPath: cleanPath } };
}

/**
 * Serializes a PageType + params into a canonical shareable deep-link URL path.
 */
export function buildUrlFromRoute(page: PageType, params: Record<string, any> = {}): string {
  switch (page) {
    case 'home':
      return '/';

    case 'car-batteries':
      return '/car-batteries';
    case 'bike-batteries':
      return '/bike-batteries';
    case 'inverter-batteries':
      return '/inverter-batteries';
    case 'lithium-batteries':
      return '/lithium-batteries';
    case 'solar-batteries':
      return '/solar-batteries';
    case 'industrial-batteries':
      return '/industrial-batteries';
    case 'ups-batteries':
      return '/ups-batteries';
    case 'accessories':
      return '/accessories';

    case 'all-batteries': {
      const queryStr = buildShopQueryString(params);
      return queryStr ? `/all-batteries?${queryStr}` : '/all-batteries';
    }

    case 'shop': {
      const queryStr = buildShopQueryString(params);
      return queryStr ? `/shop?${queryStr}` : '/shop';
    }

    case 'brands':
      return params.brand
        ? `/brands/${encodeURIComponent(params.brand)}`
        : '/brands';

    case 'offers':
      return '/offers';

    case 'category':
      return `/${getCategoryPageType(String(params.category || 'car'))}`;

    case 'product-detail': {
      const id = encodeURIComponent(params.productId || 'kinetix-aeon-75');
      const qs = new URLSearchParams();
      if (params.finish) qs.set('finish', String(params.finish));
      if (params.capacity) qs.set('capacity', String(params.capacity));
      const queryStr = qs.toString();
      return queryStr ? `/product/${id}?${queryStr}` : `/product/${id}`;
    }

    case 'compare': {
      if (Array.isArray(params.ids) && params.ids.length > 0) {
        return `/compare?ids=${params.ids.map((id: string) => encodeURIComponent(id)).join(',')}`;
      }
      return '/compare';
    }

    case 'cart':
      return '/cart';

    case 'checkout':
      return '/checkout';

    case 'account':
      return params.tab && params.tab !== 'orders'
        ? `/account/${encodeURIComponent(params.tab)}`
        : '/account';

    case 'tracking':
      return params.orderId
        ? `/tracking/${encodeURIComponent(params.orderId)}`
        : '/tracking';

    case 'about':
      return '/about';

    case 'contact':
      return '/contact';

    case 'blog':
      return '/blog';

    case 'blog-detail':
      return params.slug ? `/blog/${encodeURIComponent(params.slug)}` : '/blog';

    case 'faq':
      return '/faq';

    case 'buying-guide':
      return '/buying-guide';

    case 'maintenance-guide':
      return '/maintenance-guide';

    case 'policy':
      return `/policy/${encodeURIComponent(params.type || 'warranty')}`;

    case 'admin':
      return params.tab && params.tab !== 'overview'
        ? `/admin/${encodeURIComponent(params.tab)}`
        : '/admin';

    case 'not-found':
      return params.attemptedPath || '/404';

    default:
      return '/';
  }
}

export function getCurrentRouteFromWindow(): RouteMatch {
  if (typeof window === 'undefined') {
    return { page: 'home', params: {} };
  }
  return parseUrlToRoute(
    window.location.pathname,
    window.location.search,
    window.location.hash
  );
}
