// ============================================================
// Leave / excuse status normalisation
// ============================================================

export type LeaveStatusCode = "approved" | "rejected" | "pending";

type StatusLike = string | { name?: string | null; key?: string | null; slug?: string | null } | null | undefined;

const APPROVED = ["approved", "accepted", "accept", "مقبول", "مقبولة", "موافق", "تمت الموافقة", "معتمد", "قبول"];
const REJECTED = ["rejected", "declined", "refused", "reject", "مرفوض", "مرفوضة", "رفض", "تم الرفض"];

/**
 * The backend has sent the status as an English code, an Arabic display name,
 * a plain string or a `{ name }` object. Anything unrecognised is treated as pending.
 */
export function resolveLeaveStatus(status: StatusLike): LeaveStatusCode {
  const raw = typeof status === "string" ? status : status?.key || status?.slug || status?.name || "";
  const s = raw.trim().toLowerCase();
  if (!s) return "pending";
  if (APPROVED.some((v) => s === v || s.includes(v))) return "approved";
  if (REJECTED.some((v) => s === v || s.includes(v))) return "rejected";
  return "pending";
}
