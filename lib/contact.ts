export const CONTACT_SUBJECTS = [
  "Competition Invitation",
  "Collaboration",
  "Project Inquiry",
  "Media",
  "Other",
] as const;
export const MESSAGE_STATUSES = ["new", "read", "contacted"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];
export type ContactInput = {
  name: string;
  organization: string;
  email: string;
  subject: string;
  message: string;
};
export type ContactSubmission = ContactInput & {
  id: string;
  created_at: string;
  status: MessageStatus;
};
export type MessageList = {
  messages: ContactSubmission[];
  count: number;
  page: number;
  pageSize: number;
  stats: { total: number; new: number; today: number };
};
export const CONTACT_SUCCESS =
  "Message sent successfully. Our team will review it soon.";
export const CONTACT_ERROR = "Something went wrong. Please try again.";

export function validateContact(value: unknown): ContactInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const body = value as Record<string, unknown>;
  const limits = {
    name: 120,
    organization: 180,
    email: 254,
    subject: 80,
    message: 5000,
  };
  if (Object.keys(body).some((key) => !Object.hasOwn(limits, key))) return null;
  const result: Record<string, string> = {};
  for (const [key, limit] of Object.entries(limits)) {
    const raw = body[key] ?? (key === "organization" ? "" : undefined);
    if (typeof raw !== "string") return null;
    const text = raw.trim();
    if (
      (key !== "organization" && !text) ||
      text.length > limit ||
      text.includes("\0")
    )
      return null;
    result[key] = text;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) return null;
  if (
    !CONTACT_SUBJECTS.includes(
      result.subject as (typeof CONTACT_SUBJECTS)[number],
    )
  )
    return null;
  return result as ContactInput;
}

// The team is based in the UAE. Dubai uses UTC+4 year round.
export function dubaiDayBounds(now = new Date()) {
  const offset = 4 * 60 * 60 * 1000;
  const local = new Date(now.getTime() + offset);
  const start =
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) -
    offset;
  return {
    start: new Date(start).toISOString(),
    end: new Date(start + 86400000).toISOString(),
  };
}
