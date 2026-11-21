/**
 * Payload-First Security TDD specification for Firestore Rules.
 * Verifies that all 12 "Dirty Dozen" adversarial payloads violate rule invariants
 * and must return PERMISSION_DENIED when executed against the Firestore Rules Emulator.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  actor: { uid: string; email: string; email_verified: boolean };
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Self-Assigned Admin Role on Profile Create',
    operation: 'create',
    path: '/users/user_1',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { uid: 'user_1', role: 'admin', name: 'Attacker', email: 'shopper@example.com' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Shadow Ghost Field on Profile Create',
    operation: 'create',
    path: '/users/user_1',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { uid: 'user_1', role: 'customer', isVerified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Privilege Escalation via Profile Update',
    operation: 'update',
    path: '/users/user_1',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { role: 'admin' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Cross-User PII Read',
    operation: 'get',
    path: '/users/user_2',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Orphaned Subcollection Address Write Without Parent User',
    operation: 'create',
    path: '/users/user_ghost/addresses/addr_1',
    actor: { uid: 'user_ghost', email: 'ghost@example.com', email_verified: true },
    payload: { id: 'addr_1', userId: 'user_ghost', fullName: 'Ghost' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Order Identity Spoofing',
    operation: 'create',
    path: '/orders/KTX-99999',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { id: 'KTX-99999', userId: 'user_2', status: 'Placed' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Order Status Shortcutting on Create',
    operation: 'create',
    path: '/orders/KTX-99998',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { id: 'KTX-99998', userId: 'user_1', status: 'Delivered' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Client Timestamp Forgery on Order Create',
    operation: 'create',
    path: '/orders/KTX-99997',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { id: 'KTX-99997', userId: 'user_1', createdAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Terminal State Tampering on Cancelled Order',
    operation: 'update',
    path: '/orders/KTX-10001',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { status: 'Placed' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Price Tampering via Order Update',
    operation: 'update',
    path: '/orders/KTX-10001',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { total: 1 },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'ID Poisoning on Order Document ID',
    operation: 'create',
    path: '/orders/invalid!@#id',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { id: 'invalid!@#id', userId: 'user_1', status: 'Placed' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unverified Admin Email Spoof on Orders List',
    operation: 'list',
    path: '/orders',
    actor: { uid: 'spoof_1', email: 'udaykantp9199@gmail.com', email_verified: false },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 13,
    name: 'Review Rating Out of Bounds on Create',
    operation: 'create',
    path: '/reviews/rev_bad_rating',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { id: 'rev_bad_rating', productId: 'kinetix-aeon-75', userId: 'user_1', rating: 99, status: 'published' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 14,
    name: 'Cross-User Review Content Tampering',
    operation: 'update',
    path: '/reviews/rev_owned_by_u2',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { rating: 1, comment: 'Hijacked review comment body' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 15,
    name: 'Review Helpful Vote Stuffing With Third-Party UID',
    operation: 'update',
    path: '/reviews/rev_owned_by_u2',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    payload: { helpfulUserIds: ['user_3'] },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 16,
    name: 'Hidden Review Direct Read Leak',
    operation: 'get',
    path: '/reviews/rev_hidden_u2',
    actor: { uid: 'user_1', email: 'shopper@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
];
