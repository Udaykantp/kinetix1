import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  CheckCircle2,
  Edit3,
  Filter,
  Loader2,
  LogIn,
  MessageSquarePlus,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  Trash2,
  X,
} from 'lucide-react';
import { Product, Review } from '../../../types';
import { useStore } from '../../../context/StoreContext';
import { auth, db, handleFirestoreError, OperationType } from '../../../firebase';
import { getBaselineReviewsForProduct } from '../../../data/seedReviews';

interface ProductReviewsSectionProps {
  product: Product;
  configuredVariantLabel: string;
  onStatsChange?: (stats: { averageRating: number; totalCount: number }) => void;
}

type SortOption = 'recent' | 'helpful' | 'highest' | 'lowest';

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Improvement',
  2: 'Below Expectations',
  3: 'Solid & Reliable',
  4: 'Very Good',
  5: 'Exceptional Performance',
};

function getApplicationPlaceholder(category: Product['category']): string {
  switch (category) {
    case 'car':
      return 'e.g. Hyundai Creta 1.5 Diesel, Maruti Brezza';
    case 'bike':
      return 'e.g. Royal Enfield Classic 350, KTM Duke 390';
    case 'inverter':
      return 'e.g. 1500VA Home Pure Sine Inverter, 3BHK Backup';
    case 'lithium':
    case 'solar':
      return 'e.g. 5kW Hybrid Rooftop Solar, Off-Grid Cabin';
    case 'industrial':
    case 'ups':
      return 'e.g. 3kVA Online Office UPS, Server Rack';
    default:
      return 'e.g. Weekend SUV Trickle Maintenance, Home Garage';
  }
}

function formatReviewDate(ts?: Timestamp | null): { label: string; ms: number } {
  if (ts && typeof ts.toDate === 'function') {
    const d = ts.toDate();
    return {
      label: d.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }),
      ms: d.getTime(),
    };
  }
  const now = new Date();
  return {
    label: now.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    }),
    ms: now.getTime(),
  };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'K';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  product,
  configuredVariantLabel,
  onStatsChange,
}) => {
  const { user, orders, signInWithGoogle, showToast } = useStore();

  // Firestore live reviews for this specific battery model
  const [firestoreReviews, setFirestoreReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);

  // Local session helpful votes for baseline reviews
  const [baselineHelpfulMap, setBaselineHelpfulMap] = useState<Record<string, boolean>>({});
  const [votingReviewId, setVotingReviewId] = useState<string | null>(null);

  // Filtering & Sorting state
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Review composer state (supports creating & editing own Firestore review)
  const composerRef = useRef<HTMLFormElement | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>(user?.name || '');
  const [title, setTitle] = useState<string>('');
  const [vehicleOrApplication, setVehicleOrApplication] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Inline delete confirmation state (no window.confirm)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Keep display name synced when user signs in (unless user is actively editing)
  useEffect(() => {
    if (user?.name && !editingReviewId && !authorName.trim()) {
      setAuthorName(user.name.slice(0, 80));
    }
  }, [user?.name, editingReviewId, authorName]);

  // Reset filters & edit state when navigating to a different battery model
  useEffect(() => {
    setSelectedStarFilter(null);
    setVerifiedOnly(false);
    setSortBy('recent');
    setEditingReviewId(null);
    setConfirmDeleteId(null);
    setFormError('');
  }, [product.id]);

  // Real-time Firestore listener for published reviews of this battery model
  useEffect(() => {
    if (!product?.id) return;
    setReviewsLoading(true);

    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('productId', '==', product.id),
      where('status', '==', 'published')
    );

    const unsubscribe = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const loaded: Review[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const { label, ms } = formatReviewDate(data.createdAt as Timestamp | undefined);
          return {
            id: data.id || docSnap.id,
            productId: data.productId || product.id,
            userId: data.userId,
            author: data.authorName || 'KINETIX Owner',
            rating: Math.min(5, Math.max(1, Math.round(Number(data.rating) || 5))),
            date: label,
            createdAtMs: ms,
            title: data.title || 'Verified Owner Report',
            comment: data.comment || '',
            verifiedPurchase: Boolean(data.verifiedPurchase),
            vehicleOrApplication: data.vehicleOrApplication || '',
            configuredVariant: data.configuredVariant || '',
            helpfulUserIds: Array.isArray(data.helpfulUserIds)
              ? data.helpfulUserIds.filter((id: unknown): id is string => typeof id === 'string')
              : [],
            source: 'firestore',
          };
        });
        setFirestoreReviews(loaded);
        setReviewsLoading(false);
      },
      (error) => {
        setReviewsLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'reviews');
      }
    );

    return () => unsubscribe();
  }, [product.id]);

  // Auto-detect if the signed-in customer has previously ordered this exact battery model
  const hasPurchasedProduct = useMemo(() => {
    if (!orders || orders.length === 0) return false;
    return orders.some(
      (ord) =>
        ord.status !== 'Cancelled' &&
        ord.items.some((item) => item.product?.id === product.id)
    );
  }, [orders, product.id]);

  // Combine Firestore reviews + model-specific baseline field reports
  const baselineReviews = useMemo(() => getBaselineReviewsForProduct(product), [product]);

  const allReviews = useMemo(() => {
    return [...firestoreReviews, ...baselineReviews];
  }, [firestoreReviews, baselineReviews]);

  // Compute live star-rating summary & distribution breakdown
  const stats = useMemo(() => {
    const totalCount = allReviews.length;
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let ratingSum = 0;
    let recommendCount = 0;

    allReviews.forEach((rev) => {
      const clamped = Math.min(5, Math.max(1, Math.round(rev.rating)));
      distribution[clamped] = (distribution[clamped] || 0) + 1;
      ratingSum += clamped;
      if (clamped >= 4) recommendCount += 1;
    });

    const averageRating = totalCount > 0 ? ratingSum / totalCount : product.rating;
    const recommendPercent = totalCount > 0 ? Math.round((recommendCount / totalCount) * 100) : 100;

    return {
      totalCount,
      averageRating,
      recommendPercent,
      distribution,
      communityCount: firestoreReviews.length,
    };
  }, [allReviews, firestoreReviews.length, product.rating]);

  // Notify parent ProductDetailPage so Hero telemetry reflects live rating & count
  useEffect(() => {
    onStatsChange?.({
      averageRating: stats.averageRating,
      totalCount: stats.totalCount,
    });
  }, [stats.averageRating, stats.totalCount, onStatsChange]);

  const getHelpfulCount = (rev: Review): number => {
    if (rev.source === 'firestore') {
      return rev.helpfulUserIds.length;
    }
    return (rev.baseHelpfulCount || 0) + (baselineHelpfulMap[rev.id] ? 1 : 0);
  };

  const hasVotedHelpful = (rev: Review): boolean => {
    if (rev.source === 'firestore') {
      return Boolean(user && rev.helpfulUserIds.includes(user.id));
    }
    return Boolean(baselineHelpfulMap[rev.id]);
  };

  // Filtered and sorted reviews
  const displayedReviews = useMemo(() => {
    let list = [...allReviews];

    if (selectedStarFilter !== null) {
      list = list.filter((r) => Math.round(r.rating) === selectedStarFilter);
    }
    if (verifiedOnly) {
      list = list.filter((r) => r.verifiedPurchase);
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case 'highest':
          return b.rating - a.rating || b.createdAtMs - a.createdAtMs;
        case 'lowest':
          return a.rating - b.rating || b.createdAtMs - a.createdAtMs;
        case 'helpful':
          return getHelpfulCount(b) - getHelpfulCount(a) || b.createdAtMs - a.createdAtMs;
        case 'recent':
        default:
          return b.createdAtMs - a.createdAtMs;
      }
    });

    return list;
  }, [allReviews, selectedStarFilter, verifiedOnly, sortBy, baselineHelpfulMap, user]);

  // Validate inputs strictly matching firebase-blueprint.json bounds
  const validateReviewForm = (nameVal: string): string | null => {
    const cleanName = nameVal.trim();
    const cleanTitle = title.trim();
    const cleanComment = comment.trim();

    if (rating < 1 || rating > 5) return 'Please select a star rating from 1 to 5.';
    if (cleanName.length < 1 || cleanName.length > 80) {
      return 'Display name must be between 1 and 80 characters.';
    }
    if (cleanTitle.length < 2 || cleanTitle.length > 120) {
      return 'Please enter a short review headline (2–120 characters).';
    }
    if (cleanComment.length < 10 || cleanComment.length > 1500) {
      return 'Please share at least 10 characters of feedback (max 1500 characters).';
    }
    if (vehicleOrApplication.trim().length > 120) {
      return 'Vehicle or application note must be 120 characters or fewer.';
    }
    return null;
  };

  const resetComposer = () => {
    setEditingReviewId(null);
    setRating(5);
    setHoverRating(0);
    setTitle('');
    setVehicleOrApplication('');
    setComment('');
    setFormError('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    let activeFbUser = auth.currentUser;
    let resolvedAuthorName = authorName.trim();

    // If guest, trigger Google sign-in seamlessly without losing typed draft
    if (!activeFbUser) {
      setSubmitting(true);
      const signedIn = await signInWithGoogle(
        resolvedAuthorName ? { name: resolvedAuthorName } : undefined
      );
      if (!signedIn || !auth.currentUser) {
        setSubmitting(false);
        return;
      }
      activeFbUser = auth.currentUser;
      if (!resolvedAuthorName) {
        resolvedAuthorName =
          activeFbUser.displayName || activeFbUser.email?.split('@')[0] || 'KINETIX Customer';
        setAuthorName(resolvedAuthorName.slice(0, 80));
      }
    }

    const validationError = validateReviewForm(resolvedAuthorName);
    if (validationError) {
      setFormError(validationError);
      setSubmitting(false);
      return;
    }

    const safeRating = Math.min(5, Math.max(1, Math.round(rating)));
    const safeAuthorName = resolvedAuthorName.slice(0, 80);
    const safeTitle = title.trim().slice(0, 120);
    const safeComment = comment.trim().slice(0, 1500);
    const safeApplication = vehicleOrApplication.trim().slice(0, 120);
    const safeVariant = configuredVariantLabel.trim().slice(0, 120);

    setSubmitting(true);
    try {
      if (editingReviewId) {
        const reviewRef = doc(db, 'reviews', editingReviewId);
        await updateDoc(reviewRef, {
          authorName: safeAuthorName,
          rating: safeRating,
          title: safeTitle,
          comment: safeComment,
          vehicleOrApplication: safeApplication,
          updatedAt: serverTimestamp(),
        });
        showToast('Your review has been updated.');
        resetComposer();
      } else {
        const reviewId = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const reviewRef = doc(db, 'reviews', reviewId);
        await setDoc(reviewRef, {
          id: reviewId,
          productId: product.id,
          userId: activeFbUser.uid,
          authorName: safeAuthorName,
          rating: safeRating,
          title: safeTitle,
          comment: safeComment,
          vehicleOrApplication: safeApplication,
          configuredVariant: safeVariant,
          verifiedPurchase: hasPurchasedProduct,
          helpfulUserIds: [],
          status: 'published',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        showToast(`Thank you! Your ${safeRating}-star review for ${product.name} is live.`);
        resetComposer();
      }
    } catch (error) {
      const path = editingReviewId ? `reviews/${editingReviewId}` : 'reviews';
      const op = editingReviewId ? OperationType.UPDATE : OperationType.CREATE;
      setFormError('Unable to publish review right now. Please try again.');
      handleFirestoreError(error, op, path);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (rev: Review) => {
    setEditingReviewId(rev.id);
    setRating(rev.rating);
    setAuthorName(rev.author);
    setTitle(rev.title);
    setVehicleOrApplication(rev.vehicleOrApplication || '');
    setComment(rev.comment);
    setFormError('');
    setConfirmDeleteId(null);
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleConfirmDelete = async (reviewId: string) => {
    if (!auth.currentUser) return;
    setDeletingId(reviewId);
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      if (editingReviewId === reviewId) {
        resetComposer();
      }
      setConfirmDeleteId(null);
      showToast('Your review was deleted.', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleHelpful = async (rev: Review) => {
    if (rev.source === 'baseline') {
      setBaselineHelpfulMap((prev) => ({ ...prev, [rev.id]: !prev[rev.id] }));
      return;
    }

    let fbUser = auth.currentUser;
    if (!fbUser) {
      const signedIn = await signInWithGoogle();
      if (!signedIn || !auth.currentUser) return;
      fbUser = auth.currentUser;
    }

    const uid = fbUser.uid;
    const alreadyVoted = rev.helpfulUserIds.includes(uid);
    if (!alreadyVoted && rev.helpfulUserIds.length >= 50) {
      showToast('Helpful vote limit reached for this review.', 'info');
      return;
    }

    const nextVoters = alreadyVoted
      ? rev.helpfulUserIds.filter((id) => id !== uid)
      : [...rev.helpfulUserIds, uid];

    setVotingReviewId(rev.id);
    try {
      await updateDoc(doc(db, 'reviews', rev.id), {
        helpfulUserIds: nextVoters,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `reviews/${rev.id}`);
    } finally {
      setVotingReviewId(null);
    }
  };

  const activeStarDisplay = hoverRating || rating;

  return (
    <div
      id="reviews"
      className="pt-14 border-t border-[var(--pdp-border)] space-y-10 scroll-mt-24"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="pdp-mono text-xs uppercase tracking-[0.14em] text-[var(--pdp-accent)]">
            06 / Owner Feedback & Star Ratings
          </p>
          <h3 className="pdp-heading text-3xl sm:text-4xl font-bold text-[var(--pdp-text)]">
            Customer reviews for {product.name}.
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[var(--pdp-text-muted)] max-w-md">
          Real-world cold cranking, backup endurance, and installation telemetry logged by{' '}
          <span className="text-[var(--pdp-text)] font-medium">{product.brand}</span> owners.
        </p>
      </div>

      {/* Rating Summary & Interactive 5-Star Distribution Bar Dashboard */}
      <div className="rounded-[12px] border border-[var(--pdp-border)] bg-[var(--pdp-surface)] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Aggregate Score */}
        <div className="lg:col-span-4 flex flex-col items-start sm:items-center lg:items-start lg:border-r lg:border-[var(--pdp-border)] lg:pr-8 space-y-3">
          <div className="flex items-baseline gap-2.5">
            <span className="pdp-heading text-5xl sm:text-6xl font-bold tracking-tight text-[var(--pdp-text)] tabular-nums">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="pdp-mono text-sm text-[var(--pdp-text-muted)]">/ 5.0</span>
          </div>

          <div
            className="flex items-center gap-1"
            aria-label={`Average rating ${stats.averageRating.toFixed(1)} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((starIdx) => {
              const filled = starIdx <= Math.round(stats.averageRating);
              return (
                <Star
                  key={starIdx}
                  className={`w-5 h-5 ${
                    filled
                      ? 'fill-current text-[#D6A546]'
                      : 'text-[var(--pdp-border-strong)]'
                  }`}
                />
              );
            })}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--pdp-text)]">
              Based on{' '}
              <span className="pdp-mono font-bold">
                {stats.totalCount} {stats.totalCount === 1 ? 'review' : 'reviews'}
              </span>
            </p>
            <p className="pdp-mono text-xs text-[var(--pdp-accent)] inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats.recommendPercent}% of owners recommend this model</span>
            </p>
          </div>
        </div>

        {/* Center: Clickable 5-to-1 Star Breakdown Bars */}
        <div className="lg:col-span-5 space-y-2.5">
          {[5, 4, 3, 2, 1].map((starTier) => {
            const count = stats.distribution[starTier] || 0;
            const pct = stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
            const isSelected = selectedStarFilter === starTier;

            return (
              <button
                key={starTier}
                type="button"
                onClick={() =>
                  setSelectedStarFilter((prev) => (prev === starTier ? null : starTier))
                }
                aria-pressed={isSelected}
                className={`w-full group flex items-center gap-3 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                  isSelected
                    ? 'bg-[var(--pdp-surface-2)] ring-1 ring-[var(--pdp-accent)]'
                    : 'hover:bg-[var(--pdp-surface-2)]/70'
                }`}
              >
                <span className="pdp-mono text-xs font-medium text-[var(--pdp-text)] w-11 shrink-0 inline-flex items-center gap-1">
                  {starTier}
                  <Star className="w-3 h-3 fill-current text-[#D6A546]" />
                </span>

                <div className="flex-1 h-2.5 rounded-full bg-[var(--pdp-bg)] border border-[var(--pdp-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isSelected ? 'var(--pdp-accent)' : '#D6A546',
                    }}
                  />
                </div>

                <span className="pdp-mono text-[11px] text-[var(--pdp-text-muted)] w-16 text-right shrink-0 tabular-nums">
                  {count} ({pct}%)
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Call-to-Action & Community Counter */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-4 lg:pl-6 lg:border-l lg:border-[var(--pdp-border)]">
          <div className="space-y-1.5">
            <div className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pdp-text-muted)]">
              Own this battery?
            </div>
            <p className="text-sm text-[var(--pdp-text)] font-medium leading-snug">
              Help fellow drivers & homeowners evaluate {product.name}.
            </p>
            {stats.communityCount > 0 && (
              <p className="pdp-mono text-[11px] text-[var(--pdp-accent)] inline-flex items-center gap-1 pt-0.5">
                <Sparkles className="w-3 h-3" />
                <span>
                  {stats.communityCount} live community{' '}
                  {stats.communityCount === 1 ? 'submission' : 'submissions'}
                </span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
            className="pdp-btn w-full h-11 px-4 bg-[var(--pdp-accent)] hover:bg-[var(--pdp-accent-hover)] text-[#f3f6f4] text-xs font-semibold inline-flex items-center justify-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Grid: Review Feed (Left 7 cols) + Interactive Composer (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN: Filter Bar + Review Cards */}
        <div className="lg:col-span-7 space-y-5">
          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--pdp-border)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="pdp-mono text-[11px] uppercase tracking-[0.1em] text-[var(--pdp-text-muted)] inline-flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>

              <button
                type="button"
                onClick={() => setSelectedStarFilter(null)}
                className={`pdp-mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedStarFilter === null
                    ? 'bg-[var(--pdp-accent)] border-[var(--pdp-accent)] text-[#f3f6f4]'
                    : 'bg-[var(--pdp-surface)] border-[var(--pdp-border)] text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]'
                }`}
              >
                All ({stats.totalCount})
              </button>

              {selectedStarFilter !== null && (
                <button
                  type="button"
                  onClick={() => setSelectedStarFilter(null)}
                  className="pdp-mono text-xs px-3 py-1.5 rounded-full bg-[var(--pdp-accent)] text-[#f3f6f4] inline-flex items-center gap-1.5"
                >
                  <span>{selectedStarFilter} ★ Only</span>
                  <X className="w-3 h-3" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setVerifiedOnly((v) => !v)}
                aria-pressed={verifiedOnly}
                className={`pdp-mono text-xs px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 transition-colors ${
                  verifiedOnly
                    ? 'bg-[var(--pdp-surface-2)] border-[var(--pdp-accent)] text-[var(--pdp-text)] font-medium'
                    : 'bg-[var(--pdp-surface)] border-[var(--pdp-border)] text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--pdp-accent)]" />
                <span>Verified</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="pdp-review-sort"
                className="pdp-mono text-[11px] uppercase tracking-[0.08em] text-[var(--pdp-text-muted)]"
              >
                Sort:
              </label>
              <select
                id="pdp-review-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pdp-mono text-xs h-9 px-3 rounded-lg bg-[var(--pdp-surface)] border border-[var(--pdp-border)] text-[var(--pdp-text)] focus:outline-none focus:border-[var(--pdp-accent)]"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {reviewsLoading && firestoreReviews.length === 0 && (
            <div className="flex items-center gap-2 text-xs pdp-mono text-[var(--pdp-text-muted)] py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--pdp-accent)]" />
              <span>Syncing live customer reviews...</span>
            </div>
          )}

          {/* Review List or Empty Filtered State */}
          {displayedReviews.length === 0 ? (
            <div className="rounded-[12px] border border-[var(--pdp-border)] bg-[var(--pdp-surface)] p-8 text-center space-y-3">
              <p className="pdp-heading text-base font-bold text-[var(--pdp-text)]">
                No reviews match the selected filter.
              </p>
              <p className="text-xs text-[var(--pdp-text-muted)]">
                Clear the star rating or verified filter to view all {stats.totalCount} owner
                reports for {product.name}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedStarFilter(null);
                  setVerifiedOnly(false);
                }}
                className="pdp-btn px-4 py-2 text-xs font-medium border border-[var(--pdp-border-strong)] bg-[var(--pdp-bg)] text-[var(--pdp-text)]"
              >
                Reset Review Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedReviews.map((rev) => {
                const isOwnReview =
                  rev.source === 'firestore' && Boolean(user && rev.userId === user.id);
                const helpfulCount = getHelpfulCount(rev);
                const voted = hasVotedHelpful(rev);

                return (
                  <article
                    key={rev.id}
                    className={`rounded-[12px] border bg-[var(--pdp-surface)] p-5 sm:p-6 space-y-3.5 transition-colors ${
                      editingReviewId === rev.id
                        ? 'border-[var(--pdp-accent)] ring-1 ring-[var(--pdp-accent)]'
                        : 'border-[var(--pdp-border)]'
                    }`}
                  >
                    {/* Top Meta Row */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          aria-hidden="true"
                          className="w-9 h-9 rounded-full bg-[var(--pdp-surface-2)] border border-[var(--pdp-border)] flex items-center justify-center pdp-mono text-xs font-bold text-[var(--pdp-text)] shrink-0"
                        >
                          {getInitials(rev.author)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-[var(--pdp-text)] truncate">
                              {rev.author}
                            </span>
                            {rev.verifiedPurchase && (
                              <span className="pdp-mono text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-full bg-[var(--pdp-surface-2)] text-[var(--pdp-accent)] inline-flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                Verified Purchase
                              </span>
                            )}
                            {isOwnReview && (
                              <span className="pdp-mono text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-full bg-[var(--pdp-accent)]/15 text-[var(--pdp-accent)] font-semibold">
                                Your Review
                              </span>
                            )}
                          </div>
                          <p className="pdp-mono text-[11px] text-[var(--pdp-text-muted)] mt-0.5">
                            {rev.date}
                          </p>
                        </div>
                      </div>

                      {/* Star Row */}
                      <div
                        className="flex items-center gap-0.5 shrink-0"
                        aria-label={`Rated ${rev.rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((sIdx) => (
                          <Star
                            key={sIdx}
                            className={`w-3.5 h-3.5 ${
                              sIdx <= rev.rating
                                ? 'fill-current text-[#D6A546]'
                                : 'text-[var(--pdp-border-strong)]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Headline & Feedback Body */}
                    <div className="space-y-1.5">
                      <h4 className="text-[15px] font-bold text-[var(--pdp-text)] leading-snug">
                        {rev.title}
                      </h4>
                      <p className="text-sm text-[var(--pdp-text-muted)] leading-relaxed whitespace-pre-line">
                        {rev.comment}
                      </p>
                    </div>

                    {/* Context Chips (Vehicle / Application + Variant) */}
                    {(rev.vehicleOrApplication || rev.configuredVariant) && (
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {rev.vehicleOrApplication && (
                          <span className="pdp-mono text-[11px] px-2.5 py-1 rounded-md bg-[var(--pdp-bg)] border border-[var(--pdp-border)] text-[var(--pdp-text-muted)]">
                            Application:{' '}
                            <span className="text-[var(--pdp-text)]">
                              {rev.vehicleOrApplication}
                            </span>
                          </span>
                        )}
                        {rev.configuredVariant && (
                          <span className="pdp-mono text-[11px] px-2.5 py-1 rounded-md bg-[var(--pdp-bg)] border border-[var(--pdp-border)] text-[var(--pdp-text-muted)]">
                            {rev.configuredVariant}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Footer: Helpful Vote + Owner Edit/Delete */}
                    <div className="pt-3 border-t border-[var(--pdp-border)] flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={votingReviewId === rev.id}
                        onClick={() => handleToggleHelpful(rev)}
                        aria-pressed={voted}
                        className={`pdp-mono text-xs px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 transition-colors disabled:opacity-60 ${
                          voted
                            ? 'bg-[var(--pdp-accent)]/12 border-[var(--pdp-accent)] text-[var(--pdp-accent)] font-medium'
                            : 'bg-[var(--pdp-bg)] border-[var(--pdp-border)] text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)] hover:border-[var(--pdp-border-strong)]'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${voted ? 'fill-current' : ''}`} />
                        <span>Helpful</span>
                        <span className="tabular-nums">({helpfulCount})</span>
                      </button>

                      {isOwnReview && (
                        <div className="flex items-center gap-2">
                          {confirmDeleteId === rev.id ? (
                            <div className="flex items-center gap-2">
                              <span className="pdp-mono text-[11px] text-red-600 dark:text-red-400">
                                Delete review?
                              </span>
                              <button
                                type="button"
                                disabled={deletingId === rev.id}
                                onClick={() => handleConfirmDelete(rev.id)}
                                className="pdp-mono text-xs px-2.5 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                              >
                                {deletingId === rev.id ? 'Deleting...' : 'Confirm'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="pdp-mono text-xs px-2.5 py-1 rounded-md border border-[var(--pdp-border)] text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(rev)}
                                className="pdp-mono text-xs px-2.5 py-1 rounded-md border border-[var(--pdp-border)] text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)] hover:border-[var(--pdp-border-strong)] inline-flex items-center gap-1 transition-colors"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(rev.id)}
                                className="pdp-mono text-xs px-2.5 py-1 rounded-md border border-[var(--pdp-border)] text-[var(--pdp-text-muted)] hover:text-red-600 hover:border-red-400/50 inline-flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sticky Interactive Star-Rating & Review Composer */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <form
            ref={composerRef}
            onSubmit={handleSubmitReview}
            className="rounded-[12px] border border-[var(--pdp-border)] bg-[var(--pdp-surface)] p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="pdp-heading text-xl font-bold text-[var(--pdp-text)]">
                  {editingReviewId ? 'Edit your review' : 'Share your feedback'}
                </h4>
                <p className="text-xs text-[var(--pdp-text-muted)] mt-1">
                  Reviewing{' '}
                  <span className="font-semibold text-[var(--pdp-text)]">{product.name}</span>
                </p>
              </div>
              {editingReviewId && (
                <button
                  type="button"
                  onClick={resetComposer}
                  className="pdp-mono text-xs px-2.5 py-1 rounded-md border border-[var(--pdp-border)] text-[var(--pdp-text-muted)] hover:text-[var(--pdp-text)] inline-flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Cancel
                </button>
              )}
            </div>

            {/* Verified Purchase / Auth Status Notice */}
            {user ? (
              hasPurchasedProduct ? (
                <div className="rounded-lg bg-[var(--pdp-surface-2)] border border-[var(--pdp-accent)]/30 px-3.5 py-2.5 flex items-center gap-2 text-xs text-[var(--pdp-text)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--pdp-accent)] shrink-0" />
                  <span>
                    <strong className="font-semibold">Verified Purchase</strong> detected from your
                    order history.
                  </span>
                </div>
              ) : (
                <div className="rounded-lg bg-[var(--pdp-bg)] border border-[var(--pdp-border)] px-3.5 py-2 text-[11px] pdp-mono text-[var(--pdp-text-muted)]">
                  Posting as <span className="text-[var(--pdp-text)] font-medium">{user.name}</span>
                </div>
              )
            ) : (
              <div className="rounded-lg bg-[var(--pdp-bg)] border border-[var(--pdp-border)] px-3.5 py-2.5 flex items-center justify-between gap-3">
                <p className="text-xs text-[var(--pdp-text-muted)] leading-snug">
                  Draft your feedback below — sign in with Google when ready to publish.
                </p>
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="pdp-mono text-[11px] font-medium px-2.5 py-1.5 rounded-md border border-[var(--pdp-border-strong)] bg-[var(--pdp-surface)] text-[var(--pdp-text)] hover:border-[var(--pdp-accent)] inline-flex items-center gap-1 shrink-0"
                >
                  <LogIn className="w-3 h-3" />
                  Sign In
                </button>
              </div>
            )}

            {/* Interactive 5-Star Rating Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pdp-text-muted)]">
                  Overall Rating *
                </label>
                <span className="pdp-mono text-xs font-medium text-[var(--pdp-accent)]">
                  {activeStarDisplay}.0 — {RATING_LABELS[activeStarDisplay]}
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Select star rating from 1 to 5"
                onMouseLeave={() => setHoverRating(0)}
                className="flex items-center gap-1.5 p-2.5 rounded-[12px] bg-[var(--pdp-bg)] border border-[var(--pdp-border)] w-fit"
              >
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isActive = starVal <= activeStarDisplay;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      role="radio"
                      aria-checked={rating === starVal}
                      aria-label={`Rate ${starVal} out of 5 stars: ${RATING_LABELS[starVal]}`}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onFocus={() => setHoverRating(starVal)}
                      onBlur={() => setHoverRating(0)}
                      onClick={() => setRating(starVal)}
                      className="p-1.5 rounded-lg hover:bg-[var(--pdp-surface)] transition-transform active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pdp-accent)]"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          isActive
                            ? 'fill-current text-[#D6A546]'
                            : 'text-[var(--pdp-border-strong)]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="pdp-review-author"
                className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pdp-text-muted)] block"
              >
                Display Name *
              </label>
              <input
                id="pdp-review-author"
                type="text"
                required
                maxLength={80}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
                className="w-full h-11 px-4 rounded-[10px] bg-[var(--pdp-bg)] border border-[var(--pdp-border)] text-sm text-[var(--pdp-text)] focus:outline-none focus:border-[var(--pdp-accent)]"
              />
            </div>

            {/* Review Headline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pdp-review-title"
                  className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pdp-text-muted)]"
                >
                  Review Headline *
                </label>
                <span className="pdp-mono text-[10px] text-[var(--pdp-text-muted)]">
                  {title.length}/120
                </span>
              </div>
              <input
                id="pdp-review-title"
                type="text"
                required
                minLength={2}
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience in one line"
                className="w-full h-11 px-4 rounded-[10px] bg-[var(--pdp-bg)] border border-[var(--pdp-border)] text-sm text-[var(--pdp-text)] focus:outline-none focus:border-[var(--pdp-accent)]"
              />
            </div>

            {/* Vehicle / Setup / Application */}
            <div className="space-y-1.5">
              <label
                htmlFor="pdp-review-application"
                className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pdp-text-muted)] block"
              >
                Vehicle or Application (Optional)
              </label>
              <input
                id="pdp-review-application"
                type="text"
                maxLength={120}
                value={vehicleOrApplication}
                onChange={(e) => setVehicleOrApplication(e.target.value)}
                placeholder={getApplicationPlaceholder(product.category)}
                className="w-full h-11 px-4 rounded-[10px] bg-[var(--pdp-bg)] border border-[var(--pdp-border)] text-sm text-[var(--pdp-text)] focus:outline-none focus:border-[var(--pdp-accent)]"
              />
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pdp-review-comment"
                  className="pdp-mono text-[11px] uppercase tracking-[0.12em] text-[var(--pdp-text-muted)]"
                >
                  Detailed Feedback *
                </label>
                <span className="pdp-mono text-[10px] text-[var(--pdp-text-muted)]">
                  {comment.length}/1500
                </span>
              </div>
              <textarea
                id="pdp-review-comment"
                rows={4}
                required
                minLength={10}
                maxLength={1500}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share cranking power, backup runtime, thermal stability, or doorstep installation feedback..."
                className="w-full px-4 py-3 rounded-[10px] bg-[var(--pdp-bg)] border border-[var(--pdp-border)] text-sm text-[var(--pdp-text)] focus:outline-none focus:border-[var(--pdp-accent)] resize-y min-h-[104px]"
              />
            </div>

            {/* Inline Validation Error */}
            {formError && (
              <p
                role="alert"
                className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2"
              >
                {formError}
              </p>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="pdp-btn w-full h-12 bg-[var(--pdp-accent)] hover:bg-[var(--pdp-accent-hover)] text-[#f3f6f4] text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-65"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{editingReviewId ? 'Saving changes...' : 'Publishing review...'}</span>
                </>
              ) : editingReviewId ? (
                <span>Update Review</span>
              ) : user ? (
                <span>Publish {rating}-Star Review</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign in with Google & Publish</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
