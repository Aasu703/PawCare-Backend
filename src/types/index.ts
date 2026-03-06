/**
 * Centralized type definitions for PawCare Backend.
 * Re-exports common enum values and type aliases used across the application.
 */

// ── User Roles ──────────────────────────────────────────────
export const USER_ROLES = ["user", "admin", "provider"] as const;
export type UserRole = (typeof USER_ROLES)[number];

// ── Provider Types ──────────────────────────────────────────
export const PROVIDER_TYPES = ["shop", "vet", "babysitter"] as const;
export type ProviderType = (typeof PROVIDER_TYPES)[number];

// ── Provider Status ─────────────────────────────────────────
export const PROVIDER_STATUSES = ["pending", "approved", "rejected"] as const;
export type ProviderStatus = (typeof PROVIDER_STATUSES)[number];

// ── Booking Status ──────────────────────────────────────────
export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled", "rejected"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

// ── Order Status ────────────────────────────────────────────
export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// ── Service Category ────────────────────────────────────────
export const SERVICE_CATEGORIES = ["grooming", "boarding", "vet"] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

// ── Approval Status (Services / Inventory) ──────────────────
export const APPROVAL_STATUSES = ["pending", "approved", "rejected"] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

// ── Review Type ─────────────────────────────────────────────
export const REVIEW_TYPES = ["provider", "product", "general"] as const;
export type ReviewType = (typeof REVIEW_TYPES)[number];

// ── Chat Role ───────────────────────────────────────────────
export const CHAT_ROLES = ["user", "provider"] as const;
export type ChatRole = (typeof CHAT_ROLES)[number];

// ── Notification Type ───────────────────────────────────────
export const NOTIFICATION_TYPES = ["booking", "order", "system", "service", "message"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

// ── Provider Service Type ───────────────────────────────────
export const PROVIDER_SERVICE_TYPES = ["vet", "groomer", "boarding", "shop_owner"] as const;
export type ProviderServiceType = (typeof PROVIDER_SERVICE_TYPES)[number];

// ── Verification Status ─────────────────────────────────────
export const VERIFICATION_STATUSES = ["pending", "approved", "rejected"] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

// ── Pet Vaccination Status ──────────────────────────────────
export const VACCINATION_STATUSES = ["pending", "done", "not_required"] as const;
export type VaccinationStatus = (typeof VACCINATION_STATUSES)[number];
