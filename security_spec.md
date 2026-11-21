# Security Specification & Payload-First Security TDD

## 1. Data Invariants
1. **Identity Ownership**: A user profile `/users/{userId}` can only be read, created, or updated by the verified user whose `request.auth.uid == userId` (or an admin).
2. **Privilege Isolation**: Clients can NEVER create a profile with `role: "admin"` or escalate `role` during profile updates. Admin privileges derive solely from verified runtime owner email (`udaykantp9199@gmail.com`) or server-managed `/admins/{uid}` documents.
3. **Master Gate on Subcollections**: An address under `/users/{userId}/addresses/{addressId}` can only be created or updated if the parent `/users/{userId}` document exists and `request.auth.uid == userId`.
4. **Order Integrity**: Orders in `/orders/{orderId}` MUST have `userId == request.auth.uid`, initial `status == "Placed"`, server-enforced timestamps (`request.time`), bounded `items` (`1..20`) and `statusHistory` (`1..20`), and immutable `userId` / `createdAt`.
5. **Terminal State Locking**: Customers may only transition `Placed` / `Confirmed` / `Packed` orders to `Cancelled`, or `Delivered` orders to `Return Requested` (with `returnReason`). Once `Cancelled`, customers cannot modify the order further. Admins retain override authority.
6. **PII & Query Protection**: No blanket `allow read` or `allow list` rules exist. `orders` list queries enforce `resource.data.userId == request.auth.uid` (or bootstrapped admin email) without `get()` lookups.
7. **Product Reviews Integrity & Zero-PII**: Reviews in `/reviews/{reviewId}` contain zero PII (no email/phone/address). Published reviews (`status == "published"`) are publicly readable so shoppers can evaluate battery models. Creating a review requires `isVerifiedUser()`, `userId == request.auth.uid`, an existing `/users/{uid}` profile, integer `rating` in `1..5`, initial `status == "published"`, empty `helpfulUserIds`, and server timestamps (`request.time`). Authors may edit only their own review text/rating fields or delete their own review. Other verified users may only toggle their own UID inside `helpfulUserIds` (strict ±1 array diff, capped at 50).

## 2. The "Dirty Dozen+" Adversarial Payloads
1. **Self-Assigned Admin Role**: `CREATE /users/u1` with `{ role: "admin", ... }` -> MUST DENY.
2. **Shadow Field Injection**: `CREATE /users/u1` with extra ghost key `isVerified: true` -> MUST DENY.
3. **Role Escalation Update**: `UPDATE /users/u1` modifying `role: "admin"` -> MUST DENY.
4. **Cross-User PII Read**: `GET /users/u2` as authenticated `u1` -> MUST DENY.
5. **Orphaned Address Write**: `CREATE /users/u1/addresses/a1` when `/users/u1` does not exist -> MUST DENY.
6. **Order Identity Spoofing**: `CREATE /orders/KTX-99999` as `u1` with `userId: "u2"` -> MUST DENY.
7. **Status Shortcutting on Create**: `CREATE /orders/KTX-99999` with `status: "Delivered"` -> MUST DENY.
8. **Client Timestamp Forgery**: `CREATE /orders/KTX-99999` with client-supplied `createdAt` instead of `request.time` -> MUST DENY.
9. **Terminal State Tampering**: `UPDATE /orders/KTX-10001` (already `Cancelled`) setting `status: "Placed"` as customer -> MUST DENY.
10. **Price Tampering on Update**: `UPDATE /orders/KTX-10001` as customer changing `total: 1` -> MUST DENY.
11. **ID Poisoning**: `CREATE /orders/<200-char-invalid-id!@#>` -> MUST DENY.
12. **Unverified Admin Email Spoof**: `LIST /orders` with `email: "udaykantp9199@gmail.com"` and `email_verified: false` -> MUST DENY.
13. **Review Rating Out-of-Bounds / Type Poisoning**: `CREATE /reviews/rev_bad` with `rating: 99` or `rating: "5"` -> MUST DENY.
14. **Review Author Impersonation / Cross-User Edit**: `UPDATE /reviews/rev_u2` as `u1` modifying `comment` or `rating` -> MUST DENY.
15. **Review Vote Stuffing**: `UPDATE /reviews/rev_u2` as `u1` injecting another UID (`"u3"`) into `helpfulUserIds` -> MUST DENY.
16. **Hidden Review Read Leak**: `GET /reviews/rev_hidden` (where `status == "hidden"`) as non-owner non-admin -> MUST DENY.
